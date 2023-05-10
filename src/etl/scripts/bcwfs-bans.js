import axios from 'axios';
import { parseISO } from 'date-fns';
import _ from 'lodash';
import * as dotenv from 'dotenv';
import { promises as fs } from 'fs';

import { getLogger } from '../helpers/loggerFactory.js';

function compareBans(ban1, ban2) {
    return ban1.attributes.type === ban2.attributes.type
        && ban1.attributes.prohibitionDescription === ban2.attributes.prohibitionDescription
        && ban1.attributes.effectiveDate === ban2.attributes.effectiveDate
        && ban1.attributes.bulletinURL === ban2.attributes.bulletinURL
        && (
            ban1.attributes.fireCentre === (ban2.attributes.fireCentre?.data?.id || null)
            || ban2.attributes.fireCentre === (ban1.attributes.fireCentre?.data?.id || null)
        )
        && (
            ban1.attributes.fireZone === (ban2.attributes.fireZone?.data?.id || null)
            || ban2.attributes.fireZone === (ban1.attributes.fireZone?.data?.id || null)
        );
};



const loadData = async function () {
    dotenv.config({
        path: `.env`,
    });

    const logger = getLogger();
    logger.info("UPDATING FIRE-BAN-PROHIBITIONS...");

    const fireZones = {};
    const fireCentres = {};
    const strapiBans = [];
    const bcwfsBans = [];
    let bcwfsData = {};

    if (process.argv.length > 3) {
        const dataFilePath = process.argv[3];
        const data = await fs.readFile(dataFilePath);
        bcwfsData = JSON.parse(data);
        logger.info(`${bcwfsData.features.length} bans found in ${process.argv[3]}`);
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

    for (const ban of bcwfsData.features) {
        const attribute = ban.properties;
        const bcwfsBan = {
            attributes: {
                "type": attribute["TYPE"],
                "prohibitionDescription": attribute["ACCESS_PROHIBITION_DESCRIPTION"],
                "effectiveDate": parseISO(attribute["ACCESS_STATUS_EFFECTIVE_DATE"]).toISOString(),
                "fireCentre": fireCentres[attribute["FIRE_CENTRE_NAME"]] || null,
                "fireZone": fireZones[attribute["FIRE_ZONE_NAME"]] || null,
                "bulletinURL": attribute["BULLETIN_URL"]
            }
        };
        bcwfsBans.push(bcwfsBan);
    }

    // get a list of fire zones from Strapi
    try {
        const response = await axios.get(`${process.env.STRAPI_BASE_URL}/api/fire-zones?fields=fireZoneName`);

        for (const zone of response.data.data) {
            const name = zone.fireZoneName.replace(/ fire zone(s?)$/ig, '');
            fireZones[name] = zone.id;
        }
    } catch (error) {
        logger.error(error);
        process.exit(1);
    }

    // get a list of fire centres from Strapi
    try {
        const response = await axios.get(`${process.env.STRAPI_BASE_URL}/api/fire-centres?fields=fireCentreName`);
        for (const centre of response.data.data) {
            const name = centre.fireCentreName.replace(/ fire centre$/ig, '');
            fireCentres[name] = centre.id;
        }
    } catch (error) {
        logger.error(error);
        process.exit(1);
    }

    // get a list of existing bans from Strapi
    try {
        const response = await axios.get(`${process.env.STRAPI_BASE_URL}/api/fire-ban-prohibitions?populate[fireCentre][fields][0]=id&populate[fireZone][fields][0]=id`);
        for (const strapiBan of response.data.data) {
            strapiBans.push(strapiBan);
        }
        logger.info(`${strapiBans.length} bans found in Strapi.`);
    } catch (error) {
        logger.error(error);
        process.exit(1);
    }

    const httpReqHeaders = {
        'Authorization': 'Bearer ' + process.env.STRAPI_API_TOKEN,
        'Content-Type': 'application/json'
    };

    // determine which old or updated bans need to be removed from Strapi
    const deletions = _.differenceWith(strapiBans, bcwfsBans, compareBans);
    for (const ban of deletions) {
        try {
            await axios.delete(`${process.env.STRAPI_BASE_URL}/api/fire-ban-prohibitions/${ban.id}`, { headers: httpReqHeaders });
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
            await axios.post(`${process.env.STRAPI_BASE_URL}/api/fire-ban-prohibitions/`, { data: ban.attributes }, { headers: httpReqHeaders });
        } catch (error) {
            logger.error(error);
            process.exit(1);
        }
    }
    logger.info(`${insertions.length} bans added to Strapi.`);
    logger.info(`${strapiBans.length - deletions.length} bans unchanged.`);

    if (insertions.length > 0 || deletions.length > 0) {
        logger.info(`Propagating firebans to protected areas`);
        // get a list of existing bans from Strapi
        try {
            await axios.post(`${process.env.STRAPI_BASE_URL}/api/fire-ban-prohibitions/propagate`, {}, { headers: httpReqHeaders });
            logger.info(`Propagation complete`);
        } catch (error) {
            const { response } = error;
            const { data } = response;
            logger.error(`Propagation failed: ${data?.error?.message}. ${data?.error?.details}.`)
            process.exit(1);
        }
    }

    logger.info("DONE!")
};

export default loadData;
