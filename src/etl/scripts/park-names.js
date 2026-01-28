import axios from "axios";
import _ from "lodash";
import * as dotenv from "dotenv";
import { promises as fs } from "fs";
import * as qs from "qs";

import { dataFileSpecified, getDataFilePath } from "../utils/commandLine.js";
import { getLogger } from "../utils/logging.js";

const LEGAL_NAME_TYPE = "Legal";
const PHONETIC_NAME_TYPE = "Phonetic";
const DR_SOURCE = "Parks Data Register";

/**
 *  This is the main processing pipeline for the Park Names Data Register sync
 */
const loadData = async function () {
  dotenv.config({
    path: `.env`,
  });

  const httpReqHeaders = {
    Authorization: "Bearer " + process.env.STRAPI_API_TOKEN,
    "Content-Type": "application/json",
  };

  const logger = getLogger();
  logger.info("UPDATING PARK NAMES...");

  const strapiParks = [];
  let dataRegisterParks;
  let errorCount = 0;

  if (dataFileSpecified()) {
    // get a list of parks from the local filesystem (for testing purposes)
    const dataFilePath = getDataFilePath();
    logger.warn(`Using test file ${dataFilePath}`);
    const data = await fs.readFile(dataFilePath);
    dataRegisterParks = JSON.parse(data).data.items;
    logger.info(`${dataRegisterParks.length} parks found in ${dataFilePath}`);
  } else {
    // get the list of parks from the BC Parks Data Register
    try {
      const response = await axios.get(process.env.PARK_NAMES_API, {
        headers: {
          Authorization: "None",
          "x-api-key": process.env.PARK_NAMES_API_KEY,
        },
      });
      dataRegisterParks = response.data.data.items;
      logger.info(`${dataRegisterParks.length} parks found in the BC Parks Data Register.`);
    } catch (error) {
      logger.error(error);
      process.exit(1);
    }
  }

  // get the list of park name types
  const parkNameTypes = (await axios.get(`${process.env.STRAPI_BASE_URL}/api/park-name-types`)).data
    .data;
  const legalNameType = parkNameTypes.find((t) => t.attributes.nameType === LEGAL_NAME_TYPE);
  const phoneticNameType = parkNameTypes.find((t) => t.attributes.nameType === PHONETIC_NAME_TYPE);

  // convert the dataRegisterParks to a dictionary
  const parksDict = {};
  for (const park of dataRegisterParks) {
    parksDict[park.pk] = park;
  }

  // get a list of existing parks from Strapi
  const strapiQuery = {
    fields: ["orcs", "protectedAreaName", "searchTerms"],
    populate: {
      parkNames: {
        fields: ["parkName", "source"],
        populate: { parkNameType: { fields: ["nameType"] } },
      },
    },
    pagination: {
      limit: 2000,
    },
  };

  try {
    // get the list of protected areas and park names
    const response = await axios.get(
      `${process.env.STRAPI_BASE_URL}/api/protected-areas?${qs.stringify(strapiQuery)}`,
    );

    // join together and simplify the two lists
    for (const strapiPark of response.data.data) {
      strapiPark.dataRegister = parksDict[strapiPark?.attributes?.orcs] || null;
      strapiPark.orcs = strapiPark.attributes.orcs;
      const legalName = getParkName(strapiPark, LEGAL_NAME_TYPE);
      const phoneticName = getParkName(strapiPark, PHONETIC_NAME_TYPE);
      strapiPark.strapi = {
        protectedAreaName: strapiPark.attributes.protectedAreaName,
        searchTerms: strapiPark.attributes.searchTerms,
        legalName: legalName.name,
        legalNameId: legalName.id,
        legalNameSource: legalName.source,
        phoneticName: phoneticName.name,
        phoneticNameId: phoneticName.id,
        phoneticNameSource: phoneticName.source,
      };
      delete strapiPark.attributes;
      strapiParks.push(strapiPark);
    }
    logger.info(`${strapiParks.length} parks found in Strapi.`);
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }

  for (const p of strapiParks) {
    if (p.dataRegister === undefined) {
      continue;
    }

    // update the legal name
    if (p.dataRegister?.legalName !== p.strapi.legalName) {
      errorCount += await updateParkName(
        p.strapi.legalNameId,
        p.id,
        legalNameType,
        p.orcs,
        p.dataRegister?.legalName,
        p.strapi.legalName,
        p.strapi.legalNameSource,
      );
    }

    // update the phonetic name
    if (p.dataRegister?.phoneticName !== p.strapi.phoneticName) {
      errorCount += await updateParkName(
        p.strapi.phoneticNameId,
        p.id,
        phoneticNameType,
        p.orcs,
        p.dataRegister?.phoneticName,
        p.strapi.phoneticName,
        p.strapi.phoneticNameSource,
      );
    }

    // update the protectedAreaName
    if (p.dataRegister?.displayName !== p.strapi.protectedAreaName) {
      if (p.dataRegister?.displayName) {
        logger.info(
          `Updating the protectedAreaName for park ${p.orcs} from "${p.strapi.protectedAreaName}" to "${p.dataRegister.displayName}"`,
        );
        try {
          await axios.put(
            `${process.env.STRAPI_BASE_URL}/api/protected-areas/${p.id}`,
            {
              data: {
                protectedAreaName: p.dataRegister.displayName,
              },
            },
            { headers: httpReqHeaders },
          );
          await queueNameChangeNotification(
            {
              oldName: p.strapi.protectedAreaName,
              newName: p.dataRegister?.displayName || "",
            },
            p.orcs,
            httpReqHeaders,
          );
        } catch (error) {
          logger.error(`Error updating park ${p.orcs}\n${JSON.stringify(error)}`);
        }
      }
    }

    // update the searchTerms
    if ((p.dataRegister?.searchTerms || null) !== p.strapi.searchTerms) {
      logger.info(`Updating the searchTerms for park ${p.orcs}`);
      try {
        await axios.put(
          `${process.env.STRAPI_BASE_URL}/api/protected-areas/${p.id}`,
          {
            data: {
              searchTerms: p.dataRegister?.searchTerms || null,
            },
          },
          { headers: httpReqHeaders },
        );
      } catch (error) {
        logger.error(`Error updating searchTerms for park ${p.orcs}\n${JSON.stringify(error)}`);
      }
    }
  }

  if (errorCount > 0) {
    process.exit(1);
  }

  logger.info("DONE!");
};

/**
 *  Gets a simlified park name from the list of park names associated with a protected area
 */
const getParkName = function (strapiPark, nameType) {
  const parkName = strapiPark.attributes.parkNames?.data.find(
    (p) => p?.attributes?.parkNameType?.data?.attributes?.nameType === nameType,
  );
  return {
    id: parkName?.id || null,
    name: parkName?.attributes?.parkName || "",
    source: parkName?.attributes?.source || "",
  };
};

/**
 *  Updates, inserts, or deletes a park name
 */
const updateParkName = async function (
  parkNameId,
  protectedAreaId,
  nameTypeObj,
  orcs,
  newName,
  oldName,
  source,
) {
  const nameType = `${nameTypeObj.attributes.nameType.toLowerCase()}Name`;
  const logger = getLogger();
  const httpReqHeaders = {
    Authorization: "Bearer " + process.env.STRAPI_API_TOKEN,
    "Content-Type": "application/json",
  };
  if (newName) {
    if (parkNameId) {
      logger.info(`Updating ${nameType} for park ${orcs} from "${oldName}" to "${newName}"`);
      try {
        await axios.put(
          `${process.env.STRAPI_BASE_URL}/api/park-names/${parkNameId}`,
          {
            data: {
              parkName: newName,
              source: DR_SOURCE,
            },
          },
          { headers: httpReqHeaders },
        );
      } catch (error) {
        logger.error(`Error updating ${nameType} for park ${orcs}\n${JSON.stringify(error)}"`);
        return 1;
      }
    } else {
      logger.info(`Adding ${nameType} "${newName}" for park ${orcs}`);
      try {
        await axios.post(
          `${process.env.STRAPI_BASE_URL}/api/park-names`,
          {
            data: {
              parkName: newName,
              source: DR_SOURCE,
              parkNameType: { connect: [{ id: nameTypeObj.id }] },
              protectedArea: { connect: [{ id: protectedAreaId }] },
            },
          },
          { headers: httpReqHeaders },
        );
      } catch (error) {
        logger.error(`Error adding ${nameType} for park ${orcs}\n${JSON.stringify(error)}"`);
        return 1;
      }
    }
  } else {
    // only delete park names where the source is "Parks Data Register"
    if (oldName && source === DR_SOURCE) {
      logger.info(`Deleting ${nameType} "${oldName}" for park ${orcs}`);
      try {
        await axios.delete(`${process.env.STRAPI_BASE_URL}/api/park-names/${parkNameId}`, {
          headers: httpReqHeaders,
        });
      } catch (error) {
        logger.error(
          `Error deleting ${nameType} "${oldName}" for park ${orcs}\n${JSON.stringify(error)}"`,
        );
        return 1;
      }
    }
  }
  return 0;
};

/**
 * Adds a notification to the task queue
 */
const queueNameChangeNotification = async function (changeInfo, orcs, httpReqHeaders) {
  try {
    await axios.post(
      `${process.env.STRAPI_BASE_URL}/api/queued-tasks`,
      {
        data: {
          action: "email parkname change",
          numericData: orcs,
          jsonData: changeInfo,
        },
      },
      { headers: httpReqHeaders },
    );
  } catch (error) {
    const logger = getLogger();
    logger.error(
      `Error queuing parkname change message for orcs ${orcs}\n${JSON.stringify(error)}`,
    );
  }
};

export default loadData;
