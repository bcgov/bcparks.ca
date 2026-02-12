/* Helper functions to make the code more readable */
const idSpecified = function () {
  return process.argv.length >= 3 && !isNaN(process.argv[2]);
};

const scriptKeySpecified = function (scriptKey) {
  return process.argv.length >= 3 && process.argv[2].toLowerCase() === scriptKey.toLowerCase();
};

const noCommandLineArgs = function () {
  return process.argv.length < 3;
};

module.exports = {
  idSpecified,
  scriptKeySpecified,
  noCommandLineArgs,
};
