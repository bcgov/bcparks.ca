const axios = require("axios");
const dotenv = require("dotenv");
const https = require("https");
const proj4 = require("proj4");
const _ = require("lodash");
const qs = require("qs");
const { readFile } = require("node:fs/promises");
const path = require("node:path");

dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});

const resourceTypeMap = {
  IF: "Interpretive forest",
  RR: "Recreation reserve",
  RTR: "Trail",
  SIT: "Site",
  TBL: "Trail",
  TRB: "Trail based recreation area",
  IFT: "Trail",
  RTE: "Trail",
};

function formatIdirName(idirName) {
  // remove the prefix and make it lowercase based on the original format IDIR\USERNAME
  const nameParts = idirName.split("\\");
  if (nameParts.length === 2) {
    return nameParts[1].toLowerCase();
  }
  return idirName.toLowerCase();
}

const httpReqHeaders = {
  Authorization: "Bearer " + process.env.STRAPI_API_TOKEN,
  "Content-Type": "application/json",
};

const loadData = async function () {
  // get the closure data from a local file
  let rstClosures;
  try {
    const fileContents = await readFile(
      "./closed-rec-resources-2026-07-22.json",
      "utf8",
    );
    rstClosures = JSON.parse(fileContents);
  } catch (error) {
    console.error(
      `Error loading recreation resources from local file closed-rec-resources-2026-07-22.json.`,
    );
    throw error;
  }

  for (const resource of rstClosures) {
    const resourceType = resourceTypeMap[resource.rec_resource_type_code];
    resource.advisory_title = `${resourceType} is closed`;
  }

  // fetch recreation resources from Strapi
  let strapiResources = [];
  try {
    const url = `${process.env.STRAPI_BASE_URL}/api/recreation-resources`;

    for (let page = 1, pageCount = 1; page <= pageCount; page++) {
      const { data } = await axios.get(url, {
        headers: httpReqHeaders,
        params: { pagination: { page, pageSize: 1000 } },
        paramsSerializer: (params) =>
          qs.stringify(params, { encodeValuesOnly: true }),
      });

      strapiResources.push(...(data?.data || []));
      pageCount = data?.meta?.pagination?.pageCount || 1;
    }
  } catch (error) {
    console.error(
      `Error getting recreation resources from Strapi: ${error?.message ?? error}`,
    );
    throw error;
  }

  // create a lookup object for recreation resources to get documentId from rec_resource_id
  const resourceLookup = {};
  for (const resource of strapiResources) {
    resourceLookup[resource.recResourceId] = resource.documentId;
  }

  // get the documentId of the "Full closure" access status
  const url = `${process.env.STRAPI_BASE_URL}/api/access-statuses`;
  let fullClosureAccessStatus;
  try {
    const { data } = await axios.get(url, {
      headers: httpReqHeaders,
      params: {
        filters: { accessStatus: "Full closure" },
        fields: ["documentId"],
      },
      paramsSerializer: (params) =>
        qs.stringify(params, { encodeValuesOnly: true }),
    });

    fullClosureAccessStatus = data?.data?.[0]?.documentId;
  } catch (error) {
    console.error(
      `Error getting full closure access status from Strapi: ${error?.message ?? error}`,
    );
    throw error;
  }

  // get the documentId of the "High" urgency
  let highUrgency;
  try {
    const url = `${process.env.STRAPI_BASE_URL}/api/urgencies`;
    const { data } = await axios.get(url, {
      headers: httpReqHeaders,
      params: { filters: { urgency: "High" }, fields: ["documentId"] },
      paramsSerializer: (params) =>
        qs.stringify(params, { encodeValuesOnly: true }),
    });

    highUrgency = data?.data?.[0]?.documentId;
  } catch (error) {
    console.error(
      `Error getting high urgency from Strapi: ${error?.message ?? error}`,
    );
    throw error;
  }

  // get the biggest advisoryNumber from publicAdvisoryAudits
  let latestAdvisoryNumber;
  try {
    const url = `${process.env.STRAPI_BASE_URL}/api/public-advisory-audits`;
    const { data } = await axios.get(url, {
      headers: httpReqHeaders,
      params: {
        sort: "advisoryNumber:desc",
        pagination: { page: 1, pageSize: 1 },
        fields: ["advisoryNumber"],
      },
      paramsSerializer: (params) =>
        qs.stringify(params, { encodeValuesOnly: true }),
    });

    latestAdvisoryNumber = data?.data?.[0]?.advisoryNumber || 0;
  } catch (error) {
    console.error(
      `Error getting latest advisory number from Strapi: ${error?.message ?? error}`,
    );
    throw error;
  }

  // get the documentId for the "Area closure" event type
  let areaClosureEventType;
  try {
    const url = `${process.env.STRAPI_BASE_URL}/api/event-types`;
    const { data } = await axios.get(url, {
      headers: httpReqHeaders,
      params: {
        filters: { eventType: "Area closure" },
        fields: ["documentId"],
      },
      paramsSerializer: (params) =>
        qs.stringify(params, { encodeValuesOnly: true }),
    });

    areaClosureEventType = data?.data?.[0]?.documentId;
  } catch (error) {
    console.error(
      `Error getting area closure event type from Strapi: ${error?.message ?? error}`,
    );
    throw error;
  }

  // get the documentId for the "Published" advisory-status
  let publishedAdvisoryStatus;
  try {
    const url = `${process.env.STRAPI_BASE_URL}/api/advisory-statuses`;
    const { data } = await axios.get(url, {
      headers: httpReqHeaders,
      params: {
        filters: { advisoryStatus: "Published" },
        fields: ["documentId"],
      },
      paramsSerializer: (params) =>
        qs.stringify(params, { encodeValuesOnly: true }),
    });

    publishedAdvisoryStatus = data?.data?.[0]?.documentId;
  } catch (error) {
    console.error(
      `Error getting published advisory status from Strapi: ${error?.message ?? error}`,
    );
    throw error;
  }

  if (!fullClosureAccessStatus) {
    throw new Error('Access status "Full closure" not found');
  }
  if (!highUrgency) {
    throw new Error('Urgency "High" not found');
  }
  if (!areaClosureEventType) {
    throw new Error('Event type "Area closure" not found');
  }
  if (!publishedAdvisoryStatus) {
    throw new Error('Advisory status "Published" not found');
  }

  // loop through the closures and create a public advisory audit record for each one
  for (const closure of rstClosures) {
    const recreationResourceDocumentId =
      resourceLookup[closure.rec_resource_id];

    if (!recreationResourceDocumentId) {
      console.log(
        `Skipping closure for recreation resource ${closure.rec_resource_id}: no matching recreation resource was found in this environment.`,
      );
      continue;
    }

    // get the calendar date of entry_timestamp
    const entryDate = closure.entry_timestamp
      ? new Date(closure.entry_timestamp).toISOString().split("T")[0]
      : null;

    if (entryDate === closure.comment_date) {
      closure.isAdvisoryDateDisplayed = true;
      closure.isUpdatedDateDisplayed = false;
      closure.updatedDate = null;
    } else {
      closure.isAdvisoryDateDisplayed = false;
      closure.isUpdatedDateDisplayed = true;
      closure.updatedDate = closure.comment_date;
    }

    const advisory = {
      recreationResources: [recreationResourceDocumentId],
      title: closure.advisory_title,
      description: closure.closure_comment.trim(),
      accessStatus: fullClosureAccessStatus,
      submittedByName: formatIdirName(closure.entry_userid),
      createdByName: formatIdirName(closure.entry_userid),
      modifiedByName: formatIdirName(closure.update_userid),
      advisoryDate: new Date(closure.entry_timestamp)
        .toISOString()
        .split("T")[0],
      effectiveDate: null,
      createdDate: closure.entry_timestamp,
      modifiedDate: closure.update_timestamp,
      eventType: areaClosureEventType,
      isLatestRevision: true,
      revisionNumber: 1,
      advisoryNumber: latestAdvisoryNumber + 1,
      isSafetyRelated: false,
      listingRank: 0,
      latitude: 0,
      longitude: 0,
      mapZoom: 0,
      isReservationsAffected: false,
      isEffectiveDateDisplayed: false,
      isEndDateDisplayed: false,
      urgency: highUrgency,
      isUrgentAfterHours: false,
      advisoryStatus: publishedAdvisoryStatus,
      publishedDate: closure.update_timestamp,
      publishedByName: formatIdirName(closure.update_userid),
      endDate: null,
      expiryDate: null,
      isUpdatedDateDisplayed: closure.isUpdatedDateDisplayed,
      isAdvisoryDateDisplayed: closure.isAdvisoryDateDisplayed,
      updatedDate: closure.updatedDate,
      createdByRole: "approver",
      modifiedByRole: "approver",
      reviewedByName: formatIdirName(closure.update_userid),
      reviewedDate: closure.update_timestamp,
      unpublishedByName: null,
      unpublishedDate: null,
      note: "Imported from FTA on " + new Date().toISOString().split("T")[0],
    };

    console.log(
      `Creating public advisory audit for recreation resource ${closure.rec_resource_id} with advisory number ${advisory.advisoryNumber}`,
    );

    // post the advisory to Strapi
    try {
      const url = `${process.env.STRAPI_BASE_URL}/api/public-advisory-audits`;
      await axios.post(
        url,
        { data: advisory },
        {
          headers: httpReqHeaders,
        },
      );
    } catch (error) {
      console.error(
        `Error creating public advisory audit for recreation resource ${closure.rec_resource_id}: ${error?.message ?? error}`,
      );
      if (error?.response?.data) {
        console.error(`Response body: ${JSON.stringify(error.response.data)}`);
      }
      throw error;
    }

    latestAdvisoryNumber++;
  }

  return;
};

// Run when executed with: node import-closures.js
loadData().catch((error) => {
  console.error(`Fatal error running import-closures.js: ${error}`);
  process.exit(1);
});
