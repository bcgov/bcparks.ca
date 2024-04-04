import axios from 'axios';
import * as dotenv from 'dotenv';

import { getLogger } from '../utils/logging.js';

/**
 *  This enables firebans to be propagated to protected areas every hour when the BCWFS ETL is disabled
 */
const propagate = async function () {
    dotenv.config({
        path: `.env`,
    });

    const httpReqHeaders = {
        'Authorization': 'Bearer ' + process.env.STRAPI_API_TOKEN,
        'Content-Type': 'application/json'
    };

    const logger = getLogger();
    logger.info("PROPAGATING FIREBANS TO PROTECTED AREAS...");

    try {
        const { data } = await axios.post(`${process.env.STRAPI_BASE_URL}/api/fire-ban-prohibitions/propagate`, {}, { headers: httpReqHeaders });
        logger.info(data.message);
    } catch (error) {
        const { response } = error;
        const { data } = response;
        logger.error(`Propagation failed: ${data?.error?.message}. ${data?.error?.details}.`)
        process.exit(1);
    }

    logger.info("DONE!")
};

export default propagate;
