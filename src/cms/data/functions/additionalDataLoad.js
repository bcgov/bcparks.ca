"use strict";

const pageMedia = require("./loadPageMedia");

const seedData = async () => {
   const isPageMediaLoaded = await pageMedia.loadPageMedia();
};

module.exports = {
  seedData,
};
