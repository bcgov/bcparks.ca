// Temporary script for importing staff contacts from data.json into Strapi.

const axios = require("axios");
const dotenv = require("dotenv");
const qs = require("qs");
const { readFile } = require("node:fs/promises");
const path = require("node:path");

dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});

const httpReqHeaders = {
  Authorization: "Bearer " + process.env.STRAPI_API_TOKEN,
  "Content-Type": "application/json",
};

// converts "Murray, Rachel K" to "Rachel Murray", dropping middle initials
function formatFullName(fullName) {
  if (typeof fullName !== "string") return "";
  const parts = fullName.split(",").map((part) => part.trim());
  if (parts.length < 2 || !parts[1]) return fullName.trim();
  const [lastName, rest] = parts;
  const firstName = rest.split(/\s+/)[0];
  return `${firstName} ${lastName}`.trim();
}

const loadData = async function () {
  // get the staff contact data from a local file
  let rawContacts;
  try {
    const dataPath = path.resolve(__dirname, "data.json");
    const fileContents = await readFile(dataPath, "utf8");
    rawContacts = JSON.parse(fileContents);
  } catch (error) {
    console.error(`Error loading staff contacts from local file data.json.`);
    throw error;
  }

  // group the raw rows (one per management area) by activeDirectoryGuid
  const contactsByGuid = new Map();
  for (const row of rawContacts) {
    const activeDirectoryGuid = row.activeDirectoryGuid.toLowerCase();
    let contact = contactsByGuid.get(activeDirectoryGuid);
    if (!contact) {
      contact = {
        activeDirectoryGuid,
        fullName: formatFullName(row.fullName),
        email: row.email,
        title: row.jobTitle,
        managementAreaNumbers: [],
      };
      contactsByGuid.set(activeDirectoryGuid, contact);
    }
    contact.managementAreaNumbers.push(Number(row.managementAreaNumber));
  }
  const contacts = Array.from(contactsByGuid.values());
  console.log(`Got ${contacts.length} unique staff contacts from data.json.`);

  // fetch management areas from Strapi
  let strapiManagementAreas = [];
  try {
    const url = `${process.env.STRAPI_BASE_URL}/api/management-areas`;

    for (let page = 1, pageCount = 1; page <= pageCount; page++) {
      const { data } = await axios.get(url, {
        headers: httpReqHeaders,
        params: { pagination: { page, pageSize: 1000 } },
        paramsSerializer: (params) => qs.stringify(params, { encodeValuesOnly: true }),
      });

      strapiManagementAreas.push(...(data?.data || []));
      pageCount = data?.meta?.pagination?.pageCount || 1;
    }
  } catch (error) {
    console.error(`Error getting management areas from Strapi: ${error?.message ?? error}`);
    throw error;
  }

  const requiredManagementAreas = [
    {
      managementAreaNumber: 55,
      managementAreaName: "Miracle Beach",
      sectionName: "South Central Coast/North Island",
    },
    {
      managementAreaNumber: 54,
      managementAreaName: "Howe Sound",
      sectionName: "Lower Mainland",
    },
    {
      managementAreaNumber: 49,
      managementAreaName: "Garibaldi South",
      sectionName: "Sea to Sky",
    },
  ];
  const existingManagementAreaNumbers = new Set(
    strapiManagementAreas.map((area) => area.managementAreaNumber),
  );
  const missingManagementAreas = requiredManagementAreas.filter(
    (area) => !existingManagementAreaNumbers.has(area.managementAreaNumber),
  );

  if (missingManagementAreas.length > 0) {
    let strapiSections;
    try {
      const url = `${process.env.STRAPI_BASE_URL}/api/sections`;
      const { data } = await axios.get(url, {
        headers: httpReqHeaders,
        params: {
          filters: {
            sectionName: {
              $in: requiredManagementAreas.map((area) => area.sectionName),
            },
          },
          fields: ["sectionName", "documentId"],
          pagination: { pageSize: 1000 },
        },
        paramsSerializer: (params) => qs.stringify(params, { encodeValuesOnly: true }),
      });
      strapiSections = data?.data || [];
    } catch (error) {
      console.error(`Error getting sections from Strapi: ${error?.message ?? error}`);
      throw error;
    }

    const sectionLookup = {};
    for (const section of strapiSections) {
      sectionLookup[section.sectionName] = section.documentId;
    }

    for (const managementArea of missingManagementAreas) {
      const sectionDocumentId = sectionLookup[managementArea.sectionName];
      if (!sectionDocumentId) {
        throw new Error(
          `Section ${managementArea.sectionName} was not found for management area ${managementArea.managementAreaNumber}`,
        );
      }

      try {
        const url = `${process.env.STRAPI_BASE_URL}/api/management-areas`;
        const { data } = await axios.post(
          url,
          {
            data: {
              managementAreaNumber: managementArea.managementAreaNumber,
              managementAreaName: managementArea.managementAreaName,
              section: sectionDocumentId,
            },
          },
          { headers: httpReqHeaders },
        );
        strapiManagementAreas.push(data.data);
        console.log(
          `Created management area ${managementArea.managementAreaNumber}: ${managementArea.managementAreaName}.`,
        );
      } catch (error) {
        console.error(
          `Error creating management area ${managementArea.managementAreaNumber}: ${error?.message ?? error}`,
        );
        throw error;
      }
    }
  }

  // create a lookup object for management areas to get documentId from managementAreaNumber
  const managementAreaLookup = {};
  for (const managementArea of strapiManagementAreas) {
    managementAreaLookup[managementArea.managementAreaNumber] = managementArea.documentId;
  }

  let errorCount = 0;

  // loop through the staff contacts and create a record for each one
  for (const contact of contacts) {
    const managementAreaDocumentIds = [];
    const unmatchedManagementAreaNumbers = [];
    for (const managementAreaNumber of contact.managementAreaNumbers) {
      const documentId = managementAreaLookup[managementAreaNumber];
      if (documentId) {
        managementAreaDocumentIds.push(documentId);
      } else {
        unmatchedManagementAreaNumbers.push(managementAreaNumber);
      }
    }

    if (unmatchedManagementAreaNumbers.length > 0) {
      console.log(
        `Staff contact ${contact.fullName}: no matching management area was found in this environment for management area numbers ${unmatchedManagementAreaNumbers.join(", ")}.`,
      );
    }

    if (managementAreaDocumentIds.length === 0) {
      continue;
    }

    try {
      const url = `${process.env.STRAPI_BASE_URL}/api/staff-contacts`;
      await axios.post(
        url,
        {
          data: {
            fullName: contact.fullName,
            email: contact.email,
            title: contact.title,
            managementAreas: managementAreaDocumentIds,
            activeDirectoryGuid: contact.activeDirectoryGuid,
            isActive: true,
          },
        },
        { headers: httpReqHeaders },
      );
      console.log(`Created staff contact ${contact.fullName} in Strapi.`);
    } catch (error) {
      console.error(`Error creating staff contact ${contact.fullName}: ${error?.message ?? error}`);
      if (error?.response?.data) {
        console.error(`Response body: ${JSON.stringify(error.response.data)}`);
      }
      errorCount++;
    }
  }

  if (errorCount > 0) {
    process.exit(1);
  }
};

// Run when executed with: node import-staff-contacts.js
loadData().catch((error) => {
  console.error(`Fatal error running import-staff-contacts.js: ${error}`);
  process.exit(1);
});
