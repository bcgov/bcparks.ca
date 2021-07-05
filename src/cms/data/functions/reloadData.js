// main loader function
"use strict";

const permission = require("./loadPermissions");
const parData = require("./loadPar");
const otherData = require("./loadOtherData");
const publicAdvisory = require("./loadPublicAdvisory");
const parkPhoto = require("./loadParkPhoto");

const reloadData = (loaderFunction) => {
  if (loaderFunction) {
    strapi.log.info(`reloading ${loaderFunction} ...`);
    eval(loaderFunction);
  }
};

module.exports = {
  reloadData,
};
