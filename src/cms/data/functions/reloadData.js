// main loader function
"use strict";

const permission = require("./loadPermissions");
const parData = require("./loadPAR");
const otherData = require("./loadOtherData");
const publicAdvisory = require("./loadPublicAdvisory");

const reloadData = (loaderFunction) => {
  if (loaderFunction) {
    strapi.log.info(`reloading ${loaderFunction} ...`);
    eval(loaderFunction);
  }
};

module.exports = {
  reloadData,
};
