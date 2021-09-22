// main loader function
"use strict";

const permission = require("./loadPermissions");
const parData = require("./loadPar");
const otherData = require("./loadOtherData");
const publicAdvisoryAudit = require("./loadPublicAdvisoryAudit");
const parkPhoto = require("./loadParkPhoto");
const pageMedia = require("./loadPageMedia");

const reloadData = (loaderFunction) => {
  if (loaderFunction) {
    strapi.log.info(`reloading ${loaderFunction} ...`);
    eval(loaderFunction);
  }
};

module.exports = {
  reloadData,
};
