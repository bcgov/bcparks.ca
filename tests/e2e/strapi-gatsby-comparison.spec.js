import { test, expect } from "./fixtures.js";
import { pauseTests } from "./networkBreaker.js";

// Compares Strapi API content with the published park pages to detect
// Gatsby local database corruption after a build. For each park, one item
// from each child relation is looked up on the park page.

// Parks to sample, by ORCS number. Kept small, since GitHub Actions runners
// may be rate limited by bcparks.ca. Busy park pages are included, plus parks
// that cover the less common relations.
const PARK_ORCS = [
  // High-traffic parks
  2, // Mount Robson (guidelines)
  8, // Golden Ears (trail reports, guidelines)
  15, // Mount Seymour (trail reports, guidelines)
  24, // Wells Gray (trail reports, guidelines)
  33, // E.C. Manning
  41, // Cultus Lake
  90, // Alice Lake
  193, // Rathtrevor Beach (guidelines)
  314, // Porteau Cove
  363, // Joffre Lakes (guidelines)

  // Coverage for other relations and protected area types
  19, // Tweedsmuir (the only sampled park with nearby parks)
  142, // sẁiẁs Park (the only sampled park with audio clips)
  547, // Hakai Lúxvbálís Conservancy
  3087, // Heather Lake Ecological Reserve (ecological lists, no marine ecosections)
  3097, // Race Rocks Ecological Reserve (ecological lists, marine ecosections)
  4433, // Lac du Bois Grasslands Protected Area
];

// Locator for the park page's main column, which holds most page sections
const PAGE_CONTENT = ".page-content";

// Resource types that aren't downloaded, since only the page text is checked.
// Scripts and data requests still load: some sections, such as facilities
// and camping types, are only rendered by the browser after the page loads.
const SKIPPED_RESOURCE_TYPES = new Set([
  "image",
  "stylesheet",
  "font",
  "media",
]);

/**
 * Removes the "<orcs>:" prefix Strapi adds to internal relation names,
 * e.g. "1:Drinking water" -> "Drinking water".
 * @param {string} name internal relation name
 * @returns {string} display name
 */
const stripPrefix = (name) =>
  String(name ?? "")
    .replace(/^\s*\d+\s*:\s*/, "")
    .trim();

/**
 * Checks whether a rich text field from the Strapi API has content.
 * @param {string|null|undefined} value field value
 * @returns {boolean} true if the field is not empty
 */
const hasText = (value) => typeof value === "string" && value.trim() !== "";

/**
 * Checks whether the "About this park" section is shown, which is required
 * for the ecological lists to appear (see src/gatsby/src/templates/park.js).
 * @param {object} park protected area from the Strapi API
 * @returns {boolean} true if the About section is shown
 */
const hasAboutSection = (park) =>
  ["conservation", "culturalHeritage", "history", "wildlife"].some((field) => {
    const value = park[field];
    return (
      typeof value === "string" &&
      value.replace(/(<([^>]+)>)|^\s+|\s+$|\s+/g, "") !== ""
    );
  });

/**
 * Checks whether an audio clip's title is shown on the park page. The title
 * is shown in the highlights, history and cultural heritage sections, when
 * that section is shown. The "tldr" location is a play button with no text,
 * so it is not checked (see components/audioButton.js and components/park/).
 * @param {object} clip audio clip from the Strapi API
 * @param {object} park protected area from the Strapi API
 * @returns {boolean} true if the clip's title is shown
 */
const isAudioClipShown = (clip, park) => {
  const locations = clip.displayLocation ?? [];
  if (!clip.url || !hasText(clip.title)) {
    return false;
  }
  return (
    (locations.includes("highlights") && hasText(park.description)) ||
    (locations.includes("history") && hasText(park.history)) ||
    (locations.includes("heritage") && hasText(park.culturalHeritage))
  );
};

// Relations whose display name and visibility come from a related type,
// which populate=* does not return. They are fetched with a second request.
const TYPE_RELATIONS = {
  parkActivities: { type: "activityType", name: "activityName" },
  parkFacilities: { type: "facilityType", name: "facilityName" },
  parkCampingTypes: { type: "campingType", name: "campingTypeName" },
};

/**
 * Checks whether a relation item and its related type are both active,
 * which is when Gatsby shows it (see park.js and utils/parkFeaturesHelper.js).
 * isActivityOpen, isFacilityOpen and isCampingOpen are not checked because
 * park pages still show closed items.
 * @param {object} item relation item with its type merged in
 * @param {string} relation relation name from TYPE_RELATIONS
 * @returns {boolean} true if the item is shown
 */
const isTypeItemShown = (item, relation) =>
  item.isActive && item[TYPE_RELATIONS[relation].type]?.isActive;

/**
 * Returns the type name Gatsby shows for a relation item.
 * @param {object} item relation item with its type merged in
 * @param {string} relation relation name from TYPE_RELATIONS
 * @returns {string} display name
 */
const getTypeName = (item, relation) => {
  const { type, name } = TYPE_RELATIONS[relation];
  return item[type][name];
};

// Relations to check on the park page. isEligible mirrors the Gatsby rules
// for when an item is shown; getText returns the text to look for.
const RELATION_CHECKS = {
  parkActivities: {
    isEligible: (item) => isTypeItemShown(item, "parkActivities"),
    getText: (item) => getTypeName(item, "parkActivities"),
  },
  parkFacilities: {
    isEligible: (item) => isTypeItemShown(item, "parkFacilities"),
    getText: (item) => getTypeName(item, "parkFacilities"),
  },
  parkCampingTypes: {
    isEligible: (item) => isTypeItemShown(item, "parkCampingTypes"),
    getText: (item) => getTypeName(item, "parkCampingTypes"),
  },
  parkGuidelines: {
    isEligible: (item) => item.isActive && hasText(item.title),
    getText: (item) => item.title,
  },
  parkContacts: {
    // The legacy parkContact HTML replaces the contact list when it is set
    isEligible: (item, park) => item.isActive && !hasText(park.parkContact),
    getText: (item) =>
      hasText(item.title) ? item.title : stripPrefix(item.name),
  },
  nearbyParks: {
    isEligible: () => true,
    getText: (item) => item.protectedAreaName,
    locator: "#nearby-parks-container",
  },
  trailReports: {
    // Trail reports only render inside an active visitor guideline whose
    // type has hasTrailReport (see components/park/visitorGuidelines.js)
    isEligible: (item, park) => park.hasTrailReportGuideline,
    getText: (item) => item.title,
  },
  biogeoclimaticZones: {
    isEligible: (item, park) => hasAboutSection(park),
    getText: (item) => item.zone,
  },
  terrestrialEcosections: {
    isEligible: (item, park) => hasAboutSection(park),
    getText: (item) => item.terrestrialEcosection,
  },
  marineEcosections: {
    isEligible: (item, park) => hasAboutSection(park),
    getText: (item) => item.marineEcosection,
  },
  audioClips: {
    isEligible: (item, park) => isAudioClipShown(item, park),
    getText: (item) => item.title,
  },
};

// Relations that are not checked, and why. Together with RELATION_CHECKS,
// this should list every relation in
// src/cms/src/api/protected-area/content-types/protected-area/schema.json.
// Update both maps when relations are added to or removed from the schema.
const RUNTIME =
  "Loaded by the browser at runtime, not from the Gatsby database";
const NOT_QUERIED = "Not in the Gatsby park page query";
const PRIVATE = "Used internally, not available in the public API";
const SKIPPED_RELATIONS = {
  publicAdvisories: RUNTIME,
  parkFeatures: RUNTIME,
  parkAreas: RUNTIME,
  parkDates: RUNTIME,
  parkGate: RUNTIME,
  parkOperationDates: RUNTIME,
  fireZones: RUNTIME,
  naturalResourceDistricts: RUNTIME,
  sites: NOT_QUERIED,
  parkNames: NOT_QUERIED,
  managementDocuments: NOT_QUERIED,
  parkOperationSubAreas: NOT_QUERIED,
  geoShape: PRIVATE,
  publicAdvisoryAudits: PRIVATE,
  parkPhotos: "Photos come from a separate query and are images, not text",
  parkOperation: "One-to-one relation, so a poor sample",
  parkSubPages: "Shown on a different page",
  managementAreas:
    "The page shows searchArea.searchAreaName, which populate=* does not return",
};

// When the Strapi API or the park page can't be reached (a timeout, network
// error, 429 or 5xx), GitHub Actions runners are probably rate limited. The
// whole run is paused until the site responds again (see networkBreaker.js),
// and the park is retried after the pause. If the retry can't reach it either,
// the park is skipped, not failed: only parks that load are checked for
// corruption. Each request has its own timeout, so it fails before the test
// timeout does: a test timeout can't be turned into a retry or skip.
const REQUEST_TIMEOUT_MS = 10000;
const TEST_TIMEOUT_MS = 60000;

/**
 * Checks whether an error means a server couldn't be reached (a timeout or a
 * network error), rather than a problem with the page content.
 * @param {unknown} error error thrown by a Playwright request or navigation
 * @returns {boolean} true if the server couldn't be reached
 */
function isUnreachableError(error) {
  return (
    error?.name === "TimeoutError" ||
    /net::ERR_|ECONNREFUSED|ECONNRESET|ETIMEDOUT|EAI_AGAIN|ENOTFOUND|socket hang up/i.test(
      String(error?.message),
    )
  );
}

/**
 * Pauses the test run, then fails the test so it is retried after the pause.
 * On the last attempt, skips the test instead, and says why in the log and
 * the report.
 * @param {string} reason why the park couldn't be checked
 * @returns {never}
 */
function skipPark(reason) {
  pauseTests(reason);
  const { retry, project } = test.info();
  if (retry < project.retries) {
    throw new Error(`${reason}. Retrying after the network pause.`);
  }
  console.log(`Skipped: ${reason}`);
  test.skip(true, reason);
}

/**
 * Runs a request or navigation, and skips the test (see skipPark) if the
 * server can't be reached. Other errors are rethrown, so they still fail the test.
 * @template T
 * @param {string} name what is being loaded, for the skip reason
 * @param {() => Promise<T>} action the request or navigation
 * @returns {Promise<T>} the action's result
 */
async function skipIfUnreachable(name, action) {
  try {
    return await action();
  } catch (error) {
    if (!isUnreachableError(error)) {
      throw error;
    }
    skipPark(
      `${name} could not be reached: ${String(error.message).split("\n")[0]}`,
    );
  }
}

/**
 * Skips the test if a response shows the server is rate limiting or failing
 * (429 or 5xx). Other statuses, such as 404, are left for the test to check.
 * @param {string} name what was loaded, for the skip reason
 * @param {number|undefined} status HTTP status of the response
 * @returns {void}
 */
function skipIfUnavailableStatus(name, status) {
  if (status === 429 || status >= 500) {
    skipPark(`${name} returned ${status}`);
  }
}

/**
 * Fetches protected areas from the Strapi API and returns the one match.
 * @param {import('@playwright/test').APIRequestContext} request Playwright request fixture
 * @param {number} orcs park ORCS number
 * @param {object} params query parameters besides the ORCS filter
 * @returns {Promise<object>} the protected area
 */
async function fetchProtectedArea(request, orcs, params) {
  const url = new URL("api/protected-areas", process.env.CMS_URL).href;
  const response = await skipIfUnreachable("The Strapi API", () =>
    request.get(url, {
      params: { "filters[orcs]": orcs, ...params },
      timeout: REQUEST_TIMEOUT_MS,
    }),
  );
  skipIfUnavailableStatus("The Strapi API", response.status());
  expect(
    response.ok(),
    `Strapi API returned ${response.status()} for ORCS ${orcs}`,
  ).toBeTruthy();

  const { data } = await response.json();
  expect(
    data,
    `Strapi API should return one park for ORCS ${orcs}`,
  ).toHaveLength(1);
  return data[0];
}

/**
 * Fetches a protected area with its first-level relations, then merges in
 * the related types for the relations in TYPE_RELATIONS and sets
 * hasTrailReportGuideline.
 * @param {import('@playwright/test').APIRequestContext} request Playwright request fixture
 * @param {number} orcs park ORCS number
 * @returns {Promise<object>} the protected area
 */
async function getProtectedArea(request, orcs) {
  const fields = [
    "orcs",
    "slug",
    "protectedAreaName",
    "parkContact",
    "description",
    "conservation",
    "culturalHeritage",
    "history",
    "wildlife",
  ];
  const params = { populate: "*" };
  fields.forEach((field, index) => {
    params[`fields[${index}]`] = field;
  });
  const park = await fetchProtectedArea(request, orcs, params);

  const typeParams = { "fields[0]": "orcs" };
  for (const [relation, { type, name }] of Object.entries(TYPE_RELATIONS)) {
    typeParams[`populate[${relation}][fields][0]`] = "documentId";
    typeParams[`populate[${relation}][populate][${type}][fields][0]`] = name;
    typeParams[`populate[${relation}][populate][${type}][fields][1]`] =
      "isActive";
  }
  typeParams["populate[parkGuidelines][fields][0]"] = "isActive";
  typeParams["populate[parkGuidelines][populate][guidelineType][fields][0]"] =
    "hasTrailReport";
  const parkWithTypes = await fetchProtectedArea(request, orcs, typeParams);

  park.hasTrailReportGuideline = (parkWithTypes.parkGuidelines ?? []).some(
    (guideline) =>
      guideline.isActive && guideline.guidelineType?.hasTrailReport,
  );

  for (const [relation, { type }] of Object.entries(TYPE_RELATIONS)) {
    const typesById = new Map(
      (parkWithTypes[relation] ?? []).map((item) => [
        item.documentId,
        item[type],
      ]),
    );
    for (const item of park[relation] ?? []) {
      item[type] = typesById.get(item.documentId);
    }
  }
  return park;
}

/**
 * Finds the populated child relations of a protected area. Relation items
 * have a documentId, which separates them from components.
 * @param {object} park protected area from the Strapi API
 * @returns {Array<[string, object[]]>} relation name and items, for non-empty relations
 */
function getRelations(park) {
  return Object.entries(park)
    .filter(([, value]) => value && typeof value === "object")
    .map(([name, value]) => [name, Array.isArray(value) ? value : [value]])
    .filter(
      ([, items]) =>
        items.length > 0 && items.every((item) => item?.documentId),
    );
}

// Environment settings, shown in the console and the HTML report.
// ENV defaults to prod in playwright.config.js.
const ENV_SETTINGS = {
  ENV: process.env.ENV || "prod",
  BASE_URL: process.env.BASE_URL,
  CMS_URL: process.env.CMS_URL,
};

test.describe("Strapi and Gatsby content comparison", () => {
  // Room for each request's own timeout (see REQUEST_TIMEOUT_MS)
  test.describe.configure({ timeout: TEST_TIMEOUT_MS });

  test.beforeAll(({}, testInfo) => {
    if (!process.env.CMS_URL) {
      throw new Error(
        "CMS_URL is not set. Add it to env/.env.<ENV> (see the .example files).",
      );
    }
    // beforeAll runs once per worker, so only the first worker prints
    if (testInfo.parallelIndex === 0) {
      console.log("Content check settings:", ENV_SETTINGS);
    }
  });

  test.beforeEach(async ({ page }) => {
    for (const [name, value] of Object.entries(ENV_SETTINGS)) {
      test.info().annotations.push({ type: name, description: value });
    }
    // fallback() passes other requests on to the routes in fixtures.js,
    // which block Snowplow
    await page.route("**/*", (route) =>
      SKIPPED_RESOURCE_TYPES.has(route.request().resourceType())
        ? route.abort()
        : route.fallback(),
    );
  });

  for (const orcs of PARK_ORCS) {
    test(`Park page content matches Strapi for ORCS ${orcs}`, async ({
      page,
      request,
    }) => {
      const park = await getProtectedArea(request, orcs);
      const annotate = (type, description) =>
        test.info().annotations.push({ type, description });

      const parkLabel = `${park.protectedAreaName} (ORCS ${park.orcs})`;
      console.log(`Checking ${parkLabel}`);
      annotate("park", parkLabel);

      const response = await skipIfUnreachable("The park page", () =>
        page.goto(`/${park.slug}/`, { timeout: REQUEST_TIMEOUT_MS }),
      );
      skipIfUnavailableStatus("The park page", response?.status());
      await skipIfUnreachable("The park page", () =>
        page.waitForLoadState("networkidle", { timeout: REQUEST_TIMEOUT_MS }),
      );
      await expect(page.locator("h1")).toContainText(park.protectedAreaName);

      for (const [relation, items] of getRelations(park)) {
        if (SKIPPED_RELATIONS[relation]) {
          continue;
        }
        const check = RELATION_CHECKS[relation];
        if (!check) {
          annotate("unmapped relation", relation);
          continue;
        }
        const item = items.find((i) => check.isEligible(i, park));
        if (!item) {
          annotate("no eligible items", relation);
          continue;
        }
        const text = check.getText(item);
        annotate("checked", `${relation}: "${text}"`);
        await expect
          .soft(
            page.locator(check.locator ?? PAGE_CONTENT).first(),
            `${relation}: "${text}"`,
          )
          .toContainText(text);
      }
    });
  }
});
