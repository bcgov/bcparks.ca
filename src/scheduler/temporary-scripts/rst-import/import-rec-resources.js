// This is copied from /src/etl/scripts/rst-resources.js and logging has been
// modified so it can be used as a temporary script for importing recreation
// resources from the RST API into Strapi.

const axios = require("axios");
const dotenv = require("dotenv");
const https = require("https");
const proj4 = require("proj4");
const _ = require("lodash");
const qs = require("qs");
const path = require("node:path");

dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});

const httpReqHeaders = {
  Authorization: "Bearer " + process.env.STRAPI_API_TOKEN,
  "Content-Type": "application/json",
};

const rejectUnauthorized = "false";

const rstAxiosConfig = {
  headers: httpReqHeaders,
  httpsAgent: new https.Agent({ rejectUnauthorized }),
};

// Define BC Albers (EPSG:3005) once at module scope to avoid repeated registration
proj4.defs(
  "EPSG:3005",
  "+proj=aea +lat_1=50 +lat_2=58.5 +lat_0=45 +lon_0=-126 " +
    "+x_0=1000000 +y_0=0 +datum=NAD83 +units=m +no_defs",
);

const loadData = async function () {
  console.log("UPDATING RECREATION RESOURCES...");

  // get the list of recreation resources from the RST API
  let rstResources;
  try {
    rstResources = await fetchRSTResources();
    console.log(
      `Got ${rstResources.length} recreation resources from the RST API.`,
    );
  } catch (error) {
    console.error(`Error getting recreation resources from RST API: ${error}`);
    process.exit(1);
  }

  // get the list of recreation resources from Strapi
  const strapiResourcesUrl = `${process.env.STRAPI_BASE_URL}/api/recreation-resources`;
  let strapiResources;
  try {
    strapiResources = await fetchStrapiResources(strapiResourcesUrl);
    console.log(
      `Got ${strapiResources.length} recreation resources from Strapi.`,
    );
  } catch (error) {
    console.error(`Error getting recreation resources from Strapi: ${error}`);
    process.exit(1);
  }

  // get a list of recreation districts from Strapi
  let strapiDistrictData;
  try {
    strapiDistrictData = await axios.get(
      `${process.env.STRAPI_BASE_URL}/api/recreation-districts`,
      { headers: httpReqHeaders },
    );
  } catch (error) {
    console.error(`Error getting recreation districts from Strapi: ${error}`);
    process.exit(1);
  }

  // create a lookup object for districts to get documentId from the district code
  const districtLookup = {};
  for (const district of strapiDistrictData.data.data) {
    districtLookup[district.districtCode] = district.documentId;
  }

  // get a list of recreation resource types from Strapi
  let strapiResourceTypeData;
  try {
    strapiResourceTypeData = await axios.get(
      `${process.env.STRAPI_BASE_URL}/api/recreation-resource-types`,
      { headers: httpReqHeaders },
    );
  } catch (error) {
    console.error(
      `Error getting recreation resource types from Strapi: ${error}`,
    );
    throw error;
  }

  // create a lookup object for resource types to get documentId from the resource type code
  const resourceTypeLookup = {};
  for (const resourceType of strapiResourceTypeData.data.data) {
    resourceTypeLookup[resourceType.resourceTypeCode] = resourceType.documentId;
  }

  let errorCount = 0;

  // loop through the RST resources and update or create them in Strapi
  for (const rstResource of rstResources) {
    const matchingStrapiResource = strapiResources.find(
      (r) => r.recResourceId === rstResource.rec_resource_id,
    );

    const districtDocId = districtLookup[rstResource.district_code];
    const resourceTypeDocId =
      resourceTypeLookup[rstResource.rec_resource_type_code];

    // extract latitue and longitude from the site_point_geometry field which is stored
    // as BC Albers in the RST API and convert it to WGS84 for Strapi
    if (rstResource.site_point_geometry) {
      const { latitude, longitude } = convertAlbersToWGS84(
        rstResource.site_point_geometry,
      );
      rstResource.latitude = latitude;
      rstResource.longitude = longitude;
    }

    // apply title casing to fields known to contain badly formatted data
    rstResource.name = titleCase(rstResource.name);
    rstResource.closest_community = titleCase(rstResource.closest_community);

    if (matchingStrapiResource) {
      // update the existing resource in Strapi if any of the fields have changed
      if (
        matchingStrapiResource.resourceName !== rstResource.name ||
        matchingStrapiResource.isDisplayed !==
          rstResource.display_on_public_site ||
        matchingStrapiResource.recreationDistrict?.documentId !==
          districtDocId ||
        matchingStrapiResource.recreationResourceType?.documentId !==
          resourceTypeDocId ||
        // use != instead of !== to treat null and undefined as equal
        matchingStrapiResource.closestCommunity !=
          rstResource.closest_community ||
        matchingStrapiResource.latitude != rstResource.latitude ||
        matchingStrapiResource.longitude != rstResource.longitude
      ) {
        // update the existing resource in Strapi
        try {
          await axios.put(
            `${strapiResourcesUrl}/${matchingStrapiResource.documentId}`,
            {
              data: {
                resourceName: rstResource.name,
                isDisplayed: rstResource.display_on_public_site,
                recreationDistrict: districtDocId,
                recreationResourceType: resourceTypeDocId,
                latitude: rstResource.latitude,
                longitude: rstResource.longitude,
                closestCommunity: rstResource.closest_community,
              },
            },
            { headers: httpReqHeaders },
          );
          console.log(
            `Updated recreation resource ${rstResource.rec_resource_id} in Strapi.`,
          );
        } catch (error) {
          console.error(
            `Error updating recreation resource in Strapi: ${error}`,
          );
          errorCount++;
        }
      }
    } else {
      // create a new resource in Strapi
      try {
        await axios.post(
          `${strapiResourcesUrl}`,
          {
            data: {
              recResourceId: rstResource.rec_resource_id,
              resourceName: titleCase(rstResource.name),
              isDisplayed: rstResource.display_on_public_site,
              recreationDistrict: districtDocId,
              recreationResourceType: resourceTypeDocId,
              latitude: rstResource.latitude,
              longitude: rstResource.longitude,
              closestCommunity: rstResource.closest_community,
            },
          },
          { headers: httpReqHeaders },
        );
        console.log(
          `Created recreation resource ${rstResource.rec_resource_id} in Strapi.`,
        );
      } catch (error) {
        console.error(`Error creating recreation resource in Strapi: ${error}`);
        errorCount++;
      }
    }
  }

  if (errorCount > 0) {
    process.exit(1);
  }

  console.log("DONE!");
};

// DATA FETCHING FUNCTIONS

// Fetches all recreation resources from the RST API, handling pagination
async function fetchRSTResources() {
  const rstSummaryUrl = `${process.env.REC_SPACE_PUBLIC_API_URL}/api/v1/recreation-resource/summary`;

  console.log(`Fetching recreation resources from RST API: ${rstSummaryUrl}`);

  const rstResources = [];
  const { data } = await axios.get(`${rstSummaryUrl}?page=1`, rstAxiosConfig);
  const totalPages = data.totalPages;
  rstResources.push(...data.data);

  for (let page = 2; page <= totalPages; page++) {
    const { data } = await axios.get(
      `${rstSummaryUrl}?page=${page}`,
      rstAxiosConfig,
    );
    rstResources.push(...data.data);
  }
  return rstResources;
}

// Fetches all recreation resources from Strapi, handling pagination
async function fetchStrapiResources(strapiResourcesUrl) {
  const queryParams = {
    populate: {
      recreationDistrict: { fields: ["documentId"] },
      recreationResourceType: { fields: ["documentId"] },
    },
    pagination: {
      pageSize: 1000,
    },
  };

  const { data: strapiData } = await axios.get(
    `${strapiResourcesUrl}?${qs.stringify(queryParams, { encodeValuesOnly: true })}`,
    { headers: httpReqHeaders },
  );
  const strapiResources = strapiData.data;
  const strapiTotalPages = strapiData.meta.pagination.pageCount;

  for (let page = 2; page <= strapiTotalPages; page++) {
    queryParams.pagination.page = page;

    const { data: strapiPageData } = await axios.get(
      `${strapiResourcesUrl}?${qs.stringify(queryParams, { encodeValuesOnly: true })}`,
      { headers: httpReqHeaders },
    );
    strapiResources.push(...strapiPageData.data);
  }
  return strapiResources;
}

// HELPER FUNCTIONS

// helper to convert names that are in ALL CAPS to title case
function titleCase(str) {
  if (!str) return str;
  const isAllCaps = /[A-Z]/.test(str) && str === str.toUpperCase();
  return isAllCaps ? _.startCase(_.toLower(str)) : str;
}

// converts a geometry string in BC Albers (EPSG:3005) to latitude and longitude in WGS84 (EPSG:4326)
function convertAlbersToWGS84(sitePointGeometry) {
  const { coordinates } = JSON.parse(sitePointGeometry);
  try {
    const [longitude, latitude] = proj4("EPSG:3005", "EPSG:4326", coordinates);
    // round the latitude and longitude to 5 decimal places (about 1 meter)
    return {
      latitude: parseFloat(latitude.toFixed(5)),
      longitude: parseFloat(longitude.toFixed(5)),
    };
  } catch {
    return { latitude: null, longitude: null };
  }
}

// Run when executed with: node import-rec-resources.js
loadData().catch((error) => {
  console.error(`Fatal error running import-rec-resources.js: ${error}`);
  process.exit(1);
});
