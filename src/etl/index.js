import bcwfsLoadData from './scripts/bcwfs-bans.js';

(async () => {
    if (process.argv.length < 3 || process.argv[2] === 'bcwfs') {
        await bcwfsLoadData();
    }
})();