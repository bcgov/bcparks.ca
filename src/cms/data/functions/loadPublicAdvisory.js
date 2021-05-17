"use strict";
const fs = require("fs");
const loadUtils = require("./loadUtils");

const loadPublicAdvisory = async () => {
  try {
    const modelName = "public-advisory";
    const loadSetting = await loadUtils.getLoadSettings(modelName);

    if (loadSetting && loadSetting.purge)
      await strapi.services[modelName].delete();

    if (loadSetting && !loadSetting.reload) return;

    const currentData = await strapi.services[modelName].find();
    if (currentData.length === 0) {
      strapi.log.info(`loading ${modelName}...`);

      const accessStatuses = await strapi.query("access-status").find();
      const advisoryStatuses = await strapi.query("advisory-status").find();
      const eventTypes = await strapi.query("event-type").find();
      const urgencies = await strapi.query("urgency").find();

      var jsonData = fs.readFileSync("./data/public-advisory.json", "utf8");
      const dataSeed = JSON.parse(jsonData)[modelName];

      var jsonData = fs.readFileSync(
        "./data/public-advisory-xref.json",
        "utf8"
      );
      const dataXref = JSON.parse(jsonData);

      dataSeed.map(async (data) => {
        const orcsXref = await dataXref["public-advisory-xref"].filter(
          (x) => x.advisoryNumber == data.advisoryNumber
        );

        let orcs = [];
        await Promise.all(
          orcsXref.map(async (o) => {
            const orc = await strapi
              .query("protected-area")
              .find({ orcs: o.orcs });
            orcs = [...orcs, ...orc];
          })
        );
        data.protectedAreas = orcs;

        data.accessStatus = accessStatuses.find(
          (d) => d.accessStatus === data.accessStatus
        );
        data.advisoryStatus = advisoryStatuses.find(
          (d) => d.advisoryStatus === data.advisoryStatus
        );
        data.eventType = eventTypes.find((d) => d.eventType === data.eventType);
        data.urgency = urgencies.find((d) => d.urgency === data.urgency);

        data.dcTicketNumber = data.dcTicketNumber;
        data.listingRank = +data.listingRank;
        data.latitude = +data.latitude;
        data.longitude = +data.longitude;
        data.mapZoom = +data.mapZoom;
        data.advisoryDate = loadUtils.formatDate(data.advisoryDate);
        data.effectiveDate = loadUtils.formatDate(data.fffectiveDate);
        data.endDate = loadUtils.formatDate(data.endDate);
        data.expiryDate = loadUtils.formatDate(data.expiryDate);
        data.removalDate = loadUtils.formatDate(data.removalDate);
        data.updatedDate = loadUtils.formatDate(data.updatedDate);
        data.createdDate = loadUtils.formatDate(data.createdDate);
        data.modifiedDate = loadUtils.formatDate(data.modifiedDate);
        await strapi.services[modelName].create(data);
      });
      strapi.log.info(`loading completed ${modelName}...`);
    }
  } catch (error) {
    strapi.log.error(error);
  }
};

module.exports = {
  loadPublicAdvisory,
};
