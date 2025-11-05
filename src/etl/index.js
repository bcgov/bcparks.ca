import * as dotenv from 'dotenv';

import bcwfsLoadData from './scripts/bcwfs-bans.js';
import bcwfsPropagateData from './scripts/bcwfs-propagate.js';
import parkNamesLoadData from './scripts/park-names.js';
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

    // If no arg was entered then run all the scripts
    // (the cron will run all the scripts)
    if (noCommandLineArgs()) {

        // Run these jobs hourly at 15 minutes past the hour
        if (process.env.DISABLE_BCWFS_CRON !== "true") {
            await bcwfsLoadData();
        }

        if (process.env.DISABLE_BCWFS_CRON !== "true" || process.env.ENABLE_BCWFS_STANDALONE_PROPAGATION === "true") {
            await bcwfsPropagateData();
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