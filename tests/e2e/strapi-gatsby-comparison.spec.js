import { test, expect } from "@playwright/test";

// Compares Strapi API content with the published park pages to detect
// Gatsby local database corruption after a build. For each park, one item
// from each child relation is looked up on the park page.

// Parks to sample, by ORCS number
const PARK_ORCS = [
  // Parks
  1, // Strathcona
  2, // Mount Robson
  4, // Kokanee Glacier
  8, // Golden Ears
  11, // Tunkwa
  15, // Mount Seymour
  19, // Tweedsmuir
  24, // Wells Gray
  28, // Elk Falls
  33, // E.C. Manning
  41, // Cultus Lake
  90, // Alice Lake
  122, // Rolley Lake
  143, // Monashee
  166, // Bridal Veil Falls
  193, // Rathtrevor Beach
  200, // Sasquatch
  258, // Chilliwack Lake
  314, // Porteau Cove
  363, // Joffre Lakes

  // Ecological Reserves
  3011, // Sartine Island Ecological Reserve
  3087, // Heather Lake Ecological Reserve
  3089, // Skagit River Cottonwoods Ecological Reserve
  3097, // Race Rocks Ecological Reserve

  // Conservancies
  343, // Fiordland Conservancy
  547, // Hakai Lúxvbálís Conservancy
  1000, // Khutzeymateen Inlet Conservancy

  // Protected Areas
  464, // South Okanagan Grasslands Protected Area
  616, // Stawamus Chief Protected Area
  4433, // Lac du Bois Grasslands Protected Area
];

// Locator for the park page's main column, which holds most page sections
const PAGE_CONTENT = ".page-content";

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
  ["conservation", "culturalHeritage", "history", "wildlife"].some((field) =>
    hasText(park[field]),
  );

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
};

// Relations that are not checked, and why
const RUNTIME =
  "Loaded by the browser at runtime, not from the Gatsby database";
const NOT_QUERIED = "Not in the Gatsby park page query";
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
  parkPhotos: "Photos come from a separate query and are images, not text",
  parkOperation: "One-to-one relation, so a poor sample",
  parkSubPages: "Shown on a different page",
  managementAreas:
    "The page shows searchArea.searchAreaName, which populate=* does not return",
};

/**
 * Fetches protected areas from the Strapi API and returns the one match.
 * @param {import('@playwright/test').APIRequestContext} request Playwright request fixture
 * @param {number} orcs park ORCS number
 * @param {object} params query parameters besides the ORCS filter
 * @returns {Promise<object>} the protected area
 */
async function fetchProtectedArea(request, orcs, params) {
  const url = new URL("api/protected-areas", process.env.CMS_URL).href;
  const response = await request.get(url, {
    params: { "filters[orcs]": orcs, ...params },
  });
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

  test.beforeEach(() => {
    for (const [name, value] of Object.entries(ENV_SETTINGS)) {
      test.info().annotations.push({ type: name, description: value });
    }
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

      await page.goto(`/${park.slug}/`);
      await page.waitForLoadState("networkidle");
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
