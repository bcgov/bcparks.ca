import * as dotenv from 'dotenv';

import bcwfsLoadData from './scripts/bcwfs-bans.js';
import parkNamesLoadData from './scripts/park-names.js';
import subareaDatesLoadData from './scripts/subarea-dates.js';
import subareaNotesLoadData from './scripts/subarea-notes.js';
import { noCommandLineArgs, scriptKeySpecified } from './utils/commandLine.js';

// The cron schedule is set to "15 * * * *" in the /infrastructure/helm/bcparks/values.yaml
// Hourly jobs will run at 15 minutes past the hour. 

// Daily jobs will run at 12:15am PST or 1:15am PDT (depending on the time of year)
const DAILY_RUN_HOUR_UTC = 8;

(async () => {
    dotenv.config({
        path: `.env`,
    });

    // Check if the command line arg 'bcwfs' was entered.
    // e.g. `node index.js bcwfs` or `npm run start bcwfs ./data/bcwfs-response.json`
    if (scriptKeySpecified('bcwfs')) {
        await bcwfsLoadData();
    }

    // Check if the command line arg 'parknames' was entered.
    // e.g. `node index.js parknames` or `npm run start parknames ./data/park-names-response.json`
    if (scriptKeySpecified('parknames')) {
        await parkNamesLoadData();
    }

    // Check if the command line arg 'subareadates' was entered.
    // e.g. `npm run start subareadates ./data/2024-subarea-dates.json`
    if (scriptKeySpecified('subareadates')) {
        await subareaDatesLoadData();
    }

    // Check if the command line arg 'subareanotes' was entered.
    // e.g. `npm run start subareanotes ./data/2024-subarea-notes.json`
    if (scriptKeySpecified('subareanotes')) {
        await subareaNotesLoadData();
    }

    // If no arg was entered then run all the scripts
    // (the cron will run all the scripts)
    if (noCommandLineArgs()) {

        // Run these jobs hourly at 15 minutes past the hour
        if (process.env.DISABLE_BCWFS_CRON !== "true") {
            await bcwfsLoadData();
        }
        // add more hourly jobs here

        // Run these jobs daily at 12:15am PST or 1:15am PDT
        if (new Date().getUTCHours() === DAILY_RUN_HOUR_UTC) {
            if (process.env.DISABLE_PARK_NAMES_CRON !== "true") {
                await parkNamesLoadData();
            }
            // add more daily jobs here
        }
    }
})();