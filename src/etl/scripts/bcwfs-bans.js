import axios from "axios";
import { parseISO } from "date-fns";
import _ from "lodash";
import * as dotenv from "dotenv";
import { promises as fs } from "fs";
import * as qs from "qs";

import { dataFileSpecified, getDataFilePath } from "../utils/commandLine.js";
import { getLogger } from "../utils/logging.js";

/**
 *  This is the main processing pipeline for the BCWFS sync
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
  logger.info("UPDATING FIRE-BAN-PROHIBITIONS...");

  const fireZones = {};
  const fireCentres = {};
  const strapiBans = [];
  const bcwfsBans = [];
  let bcwfsData;

  if (dataFileSpecified()) {
    // get a list of bans from the local filesystem (for testing purposes)
    const dataFilePath = getDataFilePath();
    logger.warn(`Using test file ${dataFilePath}`);
    const data = await fs.readFile(dataFilePath);
    bcwfsData = JSON.parse(data);
    logger.info(`${bcwfsData.features.length} bans found in ${dataFilePath}`);
  } else {
    // get a list of bans from BC Map Services
    try {
      const response = await axios.get(process.env.BCWFS_BANS_API);
      bcwfsData = response.data;
      logger.info(`${response.data.features.length} bans found in BC Map Services.`);
    } catch (error) {
      logger.error(error);
      process.exit(1);
    }
  }

  // get fireZones from Strapi and put them in an object to use as a dictionary
  try {
    const response = await axios.get(
      `${process.env.STRAPI_BASE_URL}/api/fire-zones?fields=fireZoneName`,
    );

    for (const zone of response.data.data) {
      const name = zone.fireZoneName.replace(/ fire zone(s?)$/gi, "");
      fireZones[name] = zone.documentId;
    }
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }

  // get fireCentres from Strapi and put them in an object to use as a dictionary
  try {
    const response = await axios.get(
      `${process.env.STRAPI_BASE_URL}/api/fire-centres?fields=fireCentreName`,
    );
    for (const centre of response.data.data) {
      const name = centre.fireCentreName.replace(/ fire centre$/gi, "");
      fireCentres[name] = centre.documentId;
    }
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }

  // convert each bcwfs ban to an object that can be imported into strapi
  for (const ban of bcwfsData.features) {
    const attribute = ban.properties;
    const bcwfsBan = {
      type: attribute["TYPE"],
      prohibitionDescription: attribute["ACCESS_PROHIBITION_DESCRIPTION"],
      effectiveDate: parseISO(attribute["ACCESS_STATUS_EFFECTIVE_DATE"]).toISOString(),
      fireCentre: fireCentres[attribute["FIRE_CENTRE_NAME"]] || null,
      fireZone: fireZones[attribute["FIRE_ZONE_NAME"]] || null,
      bulletinURL: attribute["BULLETIN_URL"],
    };
    bcwfsBans.push(bcwfsBan);
  }

  // get a list of existing bans from Strapi
  const strapiQuery = {
    populate: {
      fireCentre: {
        fields: ["documentId"],
      },
      fireZone: {
        fields: ["documentId"],
      },
    },
  };
  try {
    const response = await axios.get(
      `${process.env.STRAPI_BASE_URL}/api/fire-ban-prohibitions?${qs.stringify(strapiQuery)}`,
    );
    for (const strapiBan of response.data.data) {
      strapiBans.push(strapiBan);
    }
    logger.info(`${strapiBans.length} bans found in Strapi.`);
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }

  // determine which old or updated bans need to be removed from Strapi
  const deletions = _.differenceWith(strapiBans, bcwfsBans, compareBans);
  for (const ban of deletions) {
    try {
      await axios.delete(
        `${process.env.STRAPI_BASE_URL}/api/fire-ban-prohibitions/${ban.documentId}`,
        {
          headers: httpReqHeaders,
        },
      );
    } catch (error) {
      logger.error(error);
      process.exit(1);
    }
  }
  logger.info(`${deletions.length} bans removed from Strapi.`);

  // determine which new or updated bans need to be added to Strapi
  const insertions = _.differenceWith(bcwfsBans, strapiBans, compareBans);
  for (const ban of insertions) {
    try {
      await axios.post(
        `${process.env.STRAPI_BASE_URL}/api/fire-ban-prohibitions/`,
        { data: ban },
        { headers: httpReqHeaders },
      );
    } catch (error) {
      logger.error(error);
      process.exit(1);
    }
  }
  logger.info(`${insertions.length} bans added to Strapi.`);
  logger.info(`${strapiBans.length - deletions.length} bans unchanged.`);
};

/**
 *  Compares two records to see if anything has changed
 */
function compareBans(ban1, ban2) {
  return (
    ban1.type === ban2.type &&
    ban1.prohibitionDescription === ban2.prohibitionDescription &&
    ban1.effectiveDate === ban2.effectiveDate &&
    ban1.bulletinURL === ban2.bulletinURL &&
    (ban1.fireCentre === (ban2.fireCentre?.documentId || null) ||
      ban2.fireCentre === (ban1.fireCentre?.documentId || null)) &&
    (ban1.fireZone === (ban2.fireZone?.documentId || null) ||
      ban2.fireZone === (ban1.fireZone?.documentId || null))
  );
}

export default loadData;
