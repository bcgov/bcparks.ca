import axios from 'axios';
import * as dotenv from 'dotenv';
import { promises as fs } from 'fs';

import { getDataFilePath } from '../utils/commandLine.js';
import { getLogger } from '../utils/logging.js';

// TODO: CMS-1206 Replace with parkDates
const loadData = async function () {
  dotenv.config({
    path: `.env`,
  });

  const httpReqHeaders = {
    'Authorization': 'Bearer ' + process.env.STRAPI_API_TOKEN,
    'Content-Type': 'application/json'
  };

  const logger = getLogger();
  logger.info("IMPORTING SUBAREA DATES...");

  // get the data from the local filesystem
  const dataFilePath = getDataFilePath();
  logger.warn(`Using test file ${dataFilePath}`);
  const data = await fs.readFile(dataFilePath);
  const subareaDates = JSON.parse(data);
  logger.info(`${subareaDates.length} records found in ${dataFilePath}`);

  // TODO: CMS-1206 Replace with parkDates
  for (const yearData of subareaDates) {

    yearData["parkOperationSubArea"] = { connect: [{ id: yearData.parkOperationSubAreaId }] };
    yearData["isActive"] = true;
    console.log(`adding record ${yearData.parkOperationSubAreaId}`)
    delete yearData.parkOperationSubAreaId;

    try {
      await axios.post(`${process.env.STRAPI_BASE_URL}/api/park-operation-sub-area-dates`,
        {
          "data": yearData
        },
        { headers: httpReqHeaders }
      );
    } catch (error) {
      logger.error(error.message);
      logger.error(JSON.stringify(yearData));
    }
  }
};

export default loadData;
