/* Helper functions to make the code more readable */

const noCommandLineArgs = function () {
    return process.argv.length < 3;
}

const scriptKeySpecified = function (scriptKey) {
    return process.argv.length >= 3 && process.argv[2].toLowerCase() === scriptKey.toLowerCase();
}

const dataFileSpecified = function (scriptKey) {
    return process.argv.length > 3;
}

const getDataFilePath = function () {
    return process.argv[3];
}

export {
    noCommandLineArgs,
    scriptKeySpecified,
    dataFileSpecified,
    getDataFilePath
};
