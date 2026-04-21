"use strict";
// adapted from src/etl/scripts/rst-resources.js
// THIS IS TEST DATA FOR V2.5.0 and this migration can be removed for future releases

const axios = require("axios");

const _ = require("lodash");

const loadData = async function () {
  console.log("UPDATING RECREATION RESOURCES...");

  // get the list of recreation resources from the RST API
  let rstResources;
  try {
    rstResources = await fetchRSTResources();
    console.log(
      `Got ${rstResources.length} recreation resources from the RST API.`
    );
  } catch (error) {
    console.log(error);
    return;
  }

  // get the list of recreation resources from Strapi
  let strapiResources;
  try {
    strapiResources = await fetchStrapiResources();
    console.log(
      `Got ${strapiResources.length} recreation resources from Strapi.`
    );
  } catch (error) {
    console.log(error);
    return;
  }

  // get a list of recreation districts from Strapi
  let strapiDistricts;
  try {
    strapiDistricts = await strapi
      .documents("api::recreation-district.recreation-district")
      .findMany({
        status: "published",
        fields: ["districtCode", "documentId"],
      });
  } catch (error) {
    console.log(error);
    return;
  }

  // create a lookup object for districts to get documentId from the district code
  const districtLookup = {};
  for (const district of strapiDistricts) {
    districtLookup[district.districtCode] = district.documentId;
  }

  // get a list of recreation resource types from Strapi
  let strapiResourceTypes;
  try {
    strapiResourceTypes = await strapi
      .documents("api::recreation-resource-type.recreation-resource-type")
      .findMany({
        status: "published",
        fields: ["resourceTypeCode", "documentId"],
      });
  } catch (error) {
    console.log(error);
    return;
  }

  // create a lookup object for resource types to get documentId from the resource type code
  const resourceTypeLookup = {};
  for (const resourceType of strapiResourceTypes) {
    resourceTypeLookup[resourceType.resourceTypeCode] = resourceType.documentId;
  }

  let errorCount = 0;

  // loop through the RST resources and update or create them in Strapi
  for (const rstResource of rstResources) {
    const matchingStrapiResource = strapiResources.find(
      (r) => r.recResourceId === rstResource.rec_resource_id
    );

    const districtDocId = districtLookup[rstResource.district_code];
    const resourceTypeDocId =
      resourceTypeLookup[rstResource.rec_resource_type_code];

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
        matchingStrapiResource.closestCommunity != rstResource.closest_community
      ) {
        try {
          await strapi
            .documents("api::recreation-resource.recreation-resource")
            .update({
              documentId: matchingStrapiResource.documentId,
              data: {
                resourceName: rstResource.name,
                isDisplayed: rstResource.display_on_public_site,
                recreationDistrict: districtDocId,
                recreationResourceType: resourceTypeDocId,
                closestCommunity: rstResource.closest_community,
              },
            });
          console.log(
            `Updated recreation resource ${rstResource.rec_resource_id} in Strapi.`
          );
        } catch (error) {
          console.log(error);
          errorCount++;
        }
      }
    } else {
      // create a new resource in Strapi
      try {
        await strapi
          .documents("api::recreation-resource.recreation-resource")
          .create({
            data: {
              recResourceId: rstResource.rec_resource_id,
              resourceName: rstResource.name,
              isDisplayed: rstResource.display_on_public_site,
              recreationDistrict: districtDocId,
              recreationResourceType: resourceTypeDocId,
              closestCommunity: rstResource.closest_community,
            },
          });
        console.log(
          `Created recreation resource ${rstResource.rec_resource_id} in Strapi.`
        );
      } catch (error) {
        console.log(error);
        errorCount++;
      }
    }
  }

  console.log("DONE!");
};

// DATA FETCHING FUNCTIONS

// Fetches all recreation resources from the RST API, handling pagination
async function fetchRSTResources() {
  const rstSummaryUrl = `https://dj2qs6gf0wkg3.cloudfront.net/api/v1/recreation-resource/summary`;

  const rstResources = [];
  const { data } = await axios.get(`${rstSummaryUrl}?page=1`);
  const totalPages = data.totalPages;
  rstResources.push(...data.data);

  for (let page = 2; page <= totalPages; page++) {
    const { data } = await axios.get(`${rstSummaryUrl}?page=${page}`);
    rstResources.push(...data.data);
  }

  return rstResources.filter((r) => r.status === "Closed");
}

// Fetches all recreation resources from Strapi using the Document Service API
async function fetchStrapiResources() {
  const pageSize = 1000;
  const firstPage = await strapi
    .documents("api::recreation-resource.recreation-resource")
    .findMany({
      status: "published",
      populate: {
        recreationDistrict: { fields: ["documentId"] },
        recreationResourceType: { fields: ["documentId"] },
      },
      pagination: {
        pageSize,
        page: 1,
      },
    });

  const strapiResources = [...firstPage];

  // fetch remaining pages if needed - document service doesn't return pagination meta
  // so we keep fetching until we get a page with fewer results than pageSize
  let page = 2;
  while (
    strapiResources.length % pageSize === 0 &&
    strapiResources.length > 0
  ) {
    const nextPage = await strapi
      .documents("api::recreation-resource.recreation-resource")
      .findMany({
        status: "published",
        populate: {
          recreationDistrict: { fields: ["documentId"] },
          recreationResourceType: { fields: ["documentId"] },
        },
        pagination: {
          pageSize,
          page,
        },
      });
    if (nextPage.length === 0) break;
    strapiResources.push(...nextPage);
    page++;
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

module.exports = {
  async up(knex) {
    if (await knex.schema.hasTable("recreation_resources")) {
      await knex.raw(
        "DELETE FROM public_advisory_audits WHERE submitted_by = 'Imported'"
      );
      await knex.raw(
        "DELETE FROM public_advisories WHERE submitted_by = 'Imported'"
      );
      await loadData();
    }
  },
};
