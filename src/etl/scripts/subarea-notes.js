import axios from 'axios';
import * as dotenv from 'dotenv';
import { promises as fs } from 'fs';

import { getDataFilePath } from '../utils/commandLine.js';
import { getLogger } from '../utils/logging.js';


const loadData = async function () {
  dotenv.config({
    path: `.env`,
  });

  const httpReqHeaders = {
    'Authorization': 'Bearer ' + process.env.STRAPI_API_TOKEN,
    'Content-Type': 'application/json'
  };

  const logger = getLogger();
  logger.info("IMPORTING SUBAREA NOTES...");

  // get the data from the local filesystem
  const dataFilePath = getDataFilePath();
  logger.warn(`Using test file ${dataFilePath}`);
  const data = await fs.readFile(dataFilePath);
  const subareaNotes = JSON.parse(data);
  logger.info(`${subareaNotes.length} records found in ${dataFilePath}`);

  for (const notesData of subareaNotes) {
    const id = notesData.id;
    logger.info(`updating record ${id}`)
    try {
      await axios.put(`${process.env.STRAPI_BASE_URL}/api/park-operation-sub-areas/${id}`,
        {
          "data": notesData
        },
        { headers: httpReqHeaders }
      );
    } catch (error) {
      logger.error(error.message);
      logger.error(JSON.stringify(notesData));
    }
  }
};

export default loadData;
