import {
  test,
  expect,
  isUnreachableError,
  MAX_PAUSE_MS,
  pauseTests,
  waitWhilePaused,
} from "./utils/networkPause.js";

// Compares Strapi API content with the published park pages to detect
// Gatsby local database corruption after a build. For each park, one item
// from each child relation is looked up on the park page.

// Parks to sample. The name is only used in the test title. Busy park pages
// are included, plus parks that cover the less common relations. If GitHub
// Actions runners are rate limited, the run pauses (see utils/networkPause.js).
const PARKS = [
  // Popular and typical parks
  { orcs: 1, name: "Strathcona" },
  { orcs: 2, name: "Mount Robson" }, // guidelines
  { orcs: 4, name: "Kokanee Glacier" },
  { orcs: 7, name: "Garibaldi" },
  { orcs: 8, name: "Golden Ears" }, // trail reports, guidelines
  { orcs: 15, name: "Mount Seymour" }, // trail reports, guidelines
  { orcs: 24, name: "Wells Gray" }, // trail reports, guidelines
  { orcs: 28, name: "Elk Falls" },
  { orcs: 33, name: "E.C. Manning" },
  { orcs: 41, name: "Cultus Lake" },
  { orcs: 90, name: "Alice Lake" },
  { orcs: 122, name: "Rolley Lake" },
  { orcs: 143, name: "Monashee" },
  { orcs: 166, name: "Bridal Veil Falls" },
  { orcs: 193, name: "Rathtrevor Beach" }, // guidelines
  { orcs: 200, name: "Sasquatch" },
  { orcs: 258, name: "Sx̱ótsaqel/Chilliwack Lake" },
  { orcs: 314, name: "Porteau Cove" },
  { orcs: 363, name: "Joffre Lakes" }, // guidelines
  { orcs: 6878, name: "Tunkwa" },

  // Coverage for other relations and protected area types
  { orcs: 19, name: "Tweedsmuir" }, // the only sampled park with nearby parks
  { orcs: 142, name: "sẁiẁs Park" }, // the only sampled park with audio clips
  { orcs: 343, name: "Fiordland Conservancy" }, // conservancy
  { orcs: 464, name: "South Okanagan Grasslands Protected Area" }, // protected area
  { orcs: 547, name: "Hakai Lúxvbálís Conservancy" }, // conservancy
  { orcs: 616, name: "Stawamus Chief Protected Area" }, // protected area
  { orcs: 1000, name: "Hunwadi/Ahnuhati – Bald Conservancy" }, // conservancy
  { orcs: 3011, name: "Sartine Island Ecological Reserve" }, // ecological lists, marine ecosections
  { orcs: 3087, name: "Heather Lake Ecological Reserve" }, // ecological lists, no marine ecosections
  { orcs: 3089, name: "Skagit River Cottonwoods Ecological Reserve" }, // ecological lists
  { orcs: 3097, name: "Race Rocks Ecological Reserve" }, // ecological lists, marine ecosections
  { orcs: 4433, name: "Lac du Bois Grasslands Protected Area" }, // protected area
];

// Locator for the park page's main column, which holds most page sections
const PAGE_CONTENT = ".page-content";

// Resource types that aren't downloaded, since only the page text is checked.
// Scripts are needed since park.js renders facilities and camping types from
// pagedata after load.
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
 * that section is shown. showWithProtectedAreaName is a play button with no
 * text, so it is not checked (see components/audioButton.js and
 * components/park/).
 * @param {object} clip audio clip from the Strapi API
 * @param {object} park protected area from the Strapi API
 * @returns {boolean} true if the clip's title is shown
 */
const isAudioClipShown = (clip, park) => {
  if (!clip.url || !hasText(clip.title)) {
    return false;
  }
  return (
    (clip.showWithDescription && hasText(park.description)) ||
    (clip.showWithHistory && hasText(park.history)) ||
    (clip.showWithCulturalHeritage && hasText(park.culturalHeritage))
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
// whole run is paused until the server responds (see utils/networkPause.js),
// then the request is tried once more. If that fails too, the park is skipped,
// not failed: only parks that load are checked for corruption. Each request
// has its own timeout, so it fails before the test timeout does.
const REQUEST_TIMEOUT_MS = 10000;
const TEST_TIMEOUT_MS = 60000;

/**
 * Runs a request or navigation. If the server can't be reached (a timeout,
 * network error, 429 or 5xx), pauses the run, waits for the server, and tries
 * once more. If it still can't be reached, the park is skipped. On a Playwright
 * retry, it fails instead: an earlier attempt failed for some other reason,
 * which a skip would hide. Other errors are rethrown, so they fail the test.
 * @template T
 * @param {string} name what is being loaded, for the log and the skip reason
 * @param {string} url URL being loaded, so the pause waits for its server
 * @param {() => Promise<T>} action the request or navigation, returning its response
 * @returns {Promise<T>} the action's response
 */
async function loadOrSkip(name, url, action) {
  for (let attempt = 1; ; attempt++) {
    let reason;
    try {
      const response = await action();
      const status = response?.status();
      if (status !== 429 && !(status >= 500)) {
        return response;
      }
      reason = `${name} returned ${status}`;
    } catch (error) {
      if (!isUnreachableError(error)) {
        throw error;
      }
      reason = `${name} could not be reached: ${String(error.message).split("\n")[0]}`;
    }

    pauseTests(reason, url);
    if (attempt === 2) {
      if (test.info().retry > 0) {
        throw new Error(`${reason}. Not skipped, because an earlier attempt of this test failed.`);
      }
      console.log(`Skipped: ${reason}`);
      test.skip(true, reason);
    }
    // Room to wait for the pause, which can be longer than the test timeout
    test.setTimeout(test.info().timeout + MAX_PAUSE_MS);
    await waitWhilePaused();
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
  const response = await loadOrSkip("The Strapi API", url, () =>
    request.get(url, {
      params: { "filters[orcs]": orcs, ...params },
      timeout: REQUEST_TIMEOUT_MS,
    }),
  );
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
    await page.route("**/*", (route) =>
      SKIPPED_RESOURCE_TYPES.has(route.request().resourceType())
        ? route.abort()
        : route.continue(),
    );
  });

  for (const { orcs, name } of PARKS) {
    test(`Park page content matches Strapi for ${name} (ORCS ${orcs})`, async ({
      page,
      request,
    }) => {
      const park = await getProtectedArea(request, orcs);
      const annotate = (type, description) =>
        test.info().annotations.push({ type, description });

      annotate("park", `${park.protectedAreaName} (ORCS ${park.orcs})`);

      const parkUrl = new URL(`${park.slug}/`, process.env.BASE_URL).href;
      await loadOrSkip("The park page", parkUrl, () =>
        page.goto(`/${park.slug}/`, { timeout: REQUEST_TIMEOUT_MS }),
      );
      // Give the page's scripts and data requests time to finish. The page
      // itself has loaded, so if a request is still running after the
      // timeout, compare the content anyway: the checks below wait for
      // each item, and only fail if it's missing.
      await page
        .waitForLoadState("networkidle", { timeout: REQUEST_TIMEOUT_MS })
        .catch((error) => {
          if (error?.name !== "TimeoutError") {
            throw error;
          }
          annotate(
            "network not idle",
            `Requests still running after ${REQUEST_TIMEOUT_MS / 1000}s; compared the content anyway`,
          );
        });
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
