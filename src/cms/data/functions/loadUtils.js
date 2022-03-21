"use strict";
const fs = require("fs");
const moment = require("moment");

const formatDate = (date) => {
  try {
    if (date) {
      return moment(new Date(date), "YYYY-MM-DD hh:mm:ss A").tz("UTC").format();
    } else {
      return null;
    }
  } catch (e) {
    return null;
  }
};

const loadJson = async (model, jsonFile, object) => {
  try {
    const currentData = await strapi.services[model].find();

    if (currentData.length == 0) {
      strapi.log.info(`loading ${model} started...`);
      var jsonData = fs.readFileSync(jsonFile, "utf8");
      const dataSeed = JSON.parse(jsonData)[object];

      for(let z=0;z < dataSeed.length;z++) {
        const data = dataSeed[z];
        const keys = Object.keys(data);
        for (let i = 0; i < keys.length; i++) {
          if (data[keys[i]] === "") data[keys[i]] = null;
        }

        await strapi.services[model].create(data);
      }
      strapi.log.info(`loading ${model} completed...`);
    }
  } catch (error) {
    strapi.log.error(`error loading ${model}...`);
    strapi.log.error(error);
  }
};

module.exports = {
  loadJson,
  formatDate,
};
