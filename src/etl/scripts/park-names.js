import axios from 'axios';
import _ from 'lodash';
import * as dotenv from 'dotenv';
import { promises as fs } from 'fs';
import * as qs from 'qs'

import { dataFileSpecified, getDataFilePath } from '../utils/commandLine.js';
import { getLogger } from '../utils/logging.js';

const LEGAL_NAME_TYPE = 1;
const PHONETIC_NAME_TYPE = 3;
const DR_SOURCE = "Parks Data Register";

/**
 *  This is the main processing pipeline for the Park Names Data Register sync
 */
const loadData = async function () {
  dotenv.config({
    path: `.env`,
  });

  const httpReqHeaders = {
    'Authorization': 'Bearer ' + process.env.STRAPI_API_TOKEN,
    'Content-Type': 'application/json'
  };

  const logger = getLogger();
  logger.info("UPDATING PARK NAMES...");

  const strapiParks = [];
  let dataRegisterParks;

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
          'Authorization': 'None',
          'x-api-key': process.env.PARK_NAMES_API_KEY
        }
      });
      dataRegisterParks = response.data.data.items;
      logger.info(`${dataRegisterParks.length} parks found in the BC Parks Data Register.`);
    } catch (error) {
      logger.error(error);
      process.exit(1);
    }
  }

  // convert the dataRegisterParks to a dictionary
  const parksDict = {};
  for (const park of dataRegisterParks) {
    parksDict[park.pk] = park;
  }

  // get a list of existing parks from Strapi
  const strapiQuery = {
    fields: [
      "orcs",
      "protectedAreaName"
    ],
    populate: {
      parkNames: {
        fields: ["parkName", "source"],
        populate: { "parkNameType": { fields: ["nameTypeId"] } }
      }
    },
    pagination: {
      limit: 2000
    }
  };

  try {
    // get the list of protected areas and park names
    const response = await axios.get(`${process.env.STRAPI_BASE_URL}/api/protected-areas?${qs.stringify(strapiQuery)}`);

    // join together and simplify the two lists
    for (const strapiPark of response.data.data) {
      strapiPark.dataRegister = parksDict[strapiPark?.attributes?.orcs] || null;
      strapiPark.orcs = strapiPark.attributes.orcs;
      const legalName = getParkName(strapiPark, LEGAL_NAME_TYPE);
      const phoneticName = getParkName(strapiPark, PHONETIC_NAME_TYPE);
      strapiPark.strapi = {
        protectedAreaName: strapiPark.attributes.protectedAreaName,
        legalName: legalName.name,
        legalNameId: legalName.id,
        legalNameSource: legalName.source,
        phoneticName: phoneticName.name,
        phoneticNameId: phoneticName.id,
        phoneticNameSource: phoneticName.source
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
      await updateParkName(
        p.strapi.legalNameId,
        p.id,
        LEGAL_NAME_TYPE,
        p.orcs,
        p.dataRegister?.legalName,
        p.strapi.legalName,
        p.strapi.legalNameSource
      );

    }

    // update the phonetic name
    if (p.dataRegister?.phoneticName !== p.strapi.phoneticName) {
      await updateParkName(
        p.strapi.phoneticNameId,
        p.id,
        PHONETIC_NAME_TYPE,
        p.orcs,
        p.dataRegister?.phoneticName,
        p.strapi.phoneticName,
        p.strapi.phoneticNameSource
      );
    }

    // update the protectedAreaName
    if (p.dataRegister?.displayName !== p.strapi.protectedAreaName) {
      if (p.dataRegister?.displayName) {
        logger.info(`Updating the protectedAreaName for park ${p.orcs} from "${p.strapi.protectedAreaName}" to "${p.dataRegister.displayName}"`);
        try {
          await axios.put(`${process.env.STRAPI_BASE_URL}/api/protected-areas/${p.id}`,
            {
              "data": {
                "protectedAreaName": p.dataRegister.displayName
              }
            },
            { headers: httpReqHeaders }
          );
        } catch (error) {
          logger.error(`Error updating park ${p.orcs}\n${JSON.stringify(error)}"`);
        }
      }
    }
  }

  logger.info("DONE!")
};


/**
 *  Gets a simlified park name from the list of park names associated with a protected area
 */
const getParkName = function (strapiPark, nameTypeId) {
  const parkName = strapiPark.attributes.parkNames?.data.find(p => p?.attributes?.parkNameType?.data?.attributes?.nameTypeId === nameTypeId)
  return {
    id: parkName?.id || null,
    name: (parkName?.attributes?.parkName || ""),
    source: (parkName?.attributes?.source || "")
  };
};


/**
 *  Updates, inserts, or deletes a park name
 */
const updateParkName = async function (parkNameId, protectedAreaId, nameTypeId, orcs, newName, oldName, source) {
  let nameType = "";
  const logger = getLogger();
  const httpReqHeaders = {
    'Authorization': 'Bearer ' + process.env.STRAPI_API_TOKEN,
    'Content-Type': 'application/json'
  };
  switch (nameTypeId) {
    case LEGAL_NAME_TYPE:
      nameType = "legalName";
      break;
    case PHONETIC_NAME_TYPE:
      nameType = "phoneticName";
      break;
    default:
      nameType = "unknownName";
  }
  if (newName) {
    if (parkNameId) {
      logger.info(`Updating ${nameType} for park ${orcs} from "${oldName}" to "${newName}"`);
      try {
        await axios.put(`${process.env.STRAPI_BASE_URL}/api/park-names/${parkNameId}`,
          {
            "data": {
              "parkName": newName,
              "source": DR_SOURCE
            }
          },
          { headers: httpReqHeaders }
        );
      } catch (error) {
        logger.error(`Error updating ${nameType} for park ${orcs}\n${JSON.stringify(error)}"`);
      }
    } else {
      logger.info(`Adding ${nameType} "${newName}" for park ${orcs}`);
      try {
        await axios.post(`${process.env.STRAPI_BASE_URL}/api/park-names`,
          {
            "data": {
              "parkName": newName,
              "source": DR_SOURCE,
              "parkNameType": { connect: [{ id: nameTypeId }] },
              "nameTypeId": nameTypeId,
              "protectedArea": { connect: [{ id: protectedAreaId }] }
            }
          },
          { headers: httpReqHeaders }
        );
      } catch (error) {
        logger.error(`Error adding ${nameType} for park ${orcs}\n${JSON.stringify(error)}"`);
      }
    }
  } else {
    // only delete park names where the source is "Parks Data Register"
    if (oldName && source === DR_SOURCE) {
      logger.info(`Deleting ${nameType} "${oldName}" for park ${orcs}`);
      try {
        await axios.delete(`${process.env.STRAPI_BASE_URL}/api/park-names/${parkNameId}`,
          { headers: httpReqHeaders }
        );
      } catch (error) {
        logger.error(`Error deleting ${nameType} "${oldName}" for park ${orcs}\n${JSON.stringify(error)}"`);
      }
    }
  }
};

export default loadData;
