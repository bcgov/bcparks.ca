import bcwfsLoadData from './scripts/bcwfs-bans.js';
import { noCommandLineArgs, scriptKeySpecified } from './utils/commandLine.js';

(async () => {
    // This was written this way to demonstrate the pattern for later.
    // It checks if the command line arg 'bcwfs' was entered.
    // e.g. `node index.js bcwfs` or `npm run start bcwfs ./data/bcwfs-response.json`
    // If no arg was entered then run all the scripts (but there is only one right now)
    // The cron will always run all the scripts, so these args are just for local testing purposes.
    if (noCommandLineArgs() || scriptKeySpecified('bcwfs')) {
        await bcwfsLoadData();
    }
})();