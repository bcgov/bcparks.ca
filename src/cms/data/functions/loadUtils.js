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

const getLoadSettings = async (modelName) => {
  let message = {
    model: modelName,
    reload: null,
    purge: null,
  };

  const loadSetting = await strapi
    .query("x-data-load-setting")
    .findOne({ model: modelName });

  if (loadSetting) {
    message.reload = loadSetting.reload;
    message.purge = loadSetting.purge;
  }

  strapi.log.info("pre-load config", message);
  return loadSetting;
};

const loadJson = async (model, jsonFile, object) => {
  try {
    const loadSetting = await getLoadSettings(model);

    if (loadSetting && loadSetting.purge) await strapi.services[model].delete();

    if (loadSetting && !loadSetting.reload) return;

    const currentData = await strapi.services[model].find();

    if (currentData.length == 0) {
      strapi.log.info(`loading ${model} started...`);
      var jsonData = fs.readFileSync(jsonFile, "utf8");
      const dataSeed = JSON.parse(jsonData)[object];

      dataSeed.forEach(async (data) => {
        const keys = Object.keys(data);
        for (let i = 0; i < keys.length; i++) {
          if (data[keys[i]] === "") data[keys[i]] = null;
        }

        await strapi.services[model].create(data);
      });
      strapi.log.info(`loading ${model} completed...`);
    }
  } catch (error) {
    strapi.log.error(`error loading ${model}...`);
    strapi.log.error(error);
  }
};

module.exports = {
  loadJson,
  getLoadSettings,
  formatDate,
};
