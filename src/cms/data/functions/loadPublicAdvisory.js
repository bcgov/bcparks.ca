"use strict";
const fs = require("fs");
const loadUtils = require("./loadUtils");
const moment = require("moment");

const savePublicAdvisory = async (
  modelName,
  data,
  dataXref,
  accessStatuses,
  advisoryStatuses,
  eventTypes,
  urgencies
) => {
  try {
    const orcsXref = await dataXref["publicAdvisoryXRef"].filter(
      (x) => x.advisoryNumber == data.advisoryNumber
    );
    const promises = orcsXref.map(async (o) => {
      const protectedArea = await strapi
        .query("protected-area")
        .findOne({ orcs: o.orcs });
      return protectedArea.id;
    });
    const orcIds = await Promise.all(promises).then((res) => {
      return [...res];
    });
    const sitePromises = orcsXref.map(async (o) => {
      const site = await strapi
        .query("site")
        .findOne({ orcsSiteNumber: o.orcsSiteNumber });
      if (site) return site.id;
    });
    let siteIds = [];
    if (sitePromises) {
      siteIds = await Promise.all(sitePromises).then((res) => {
        return [...res];
      });
    }

    const advisoryStatus =
      data.advisoryStatus === "Active" ? "Published" : data.advisoryStatus;

    const publicAdvisory = {
      advisoryNumber: data.advisoryNumber,
      title: data.title,
      description: data.description,
      dcTicketNumber: data.dcTicketNumber,
      isSafetyRelated: data.isSafetyRelated,
      listingRank: +data.listingRank,
      note: data.note,
      latitude: +data.latitude,
      longitude: +data.longitude,
      mapZoom: +data.mapZoom,
      submittedBy: data.submittedBy,
      createdDate: loadUtils.formatDate(data.createdDate),
      createdBy: data.createdBy,
      contactID: data.contactID,
      advisoryDate: loadUtils.formatDate(data.advisoryDate),
      effectiveDate: loadUtils.formatDate(data.effectiveDate),
      endDate: loadUtils.formatDate(data.endDate),
      expiryDate: loadUtils.formatDate(data.expiryDate),
      removalDate: loadUtils.formatDate(data.removalDate),
      updatedDate: loadUtils.formatDate(data.updatedDate),
      modifiedDate: loadUtils.formatDate(data.modifiedDate),
      modifiedBy: data.modifiedBy,
      accessStatus: accessStatuses.find(
        (d) => d.accessStatus === data.accessStatus
      ),
      eventType: eventTypes.find((d) => d.eventType === data.eventType),
      urgency: urgencies.find((d) => d.urgency === data.urgency),
      advisoryStatus: advisoryStatuses.find(
        (d) => d.advisoryStatus === advisoryStatus
      ),
      isAdvisoryDateDisplayed: data.isAdvisoryDateDisplayed,
      isEffectiveDateDisplayed: data.isEffectiveDateDisplayed,
      isEndDateDisplayed: data.isEndDateDisplayed,
      isUpdatedDateDisplayed: data.isUpdatedDateDisplayed,
      isReservationsAffected: data.isReservationsAffected,
      protectedAreas: [...orcIds],
      sites: [...siteIds],
      published_at: loadUtils.formatDate(data.published_at),
      created_at: loadUtils.formatDate(data.created_at),
      updated_at: loadUtils.formatDate(data.updated_at),
      created_by: "system",
    };
    const advisory = await strapi.services[modelName].create(publicAdvisory);
    return advisory;
  } catch (error) {
    strapi.log.error(error);
  }
};

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
      strapi.log.info(`public advisories to load: ${dataSeed.length}`);

      for (const data of dataSeed) {
        await savePublicAdvisory(
          modelName,
          data,
          dataXref,
          accessStatuses,
          advisoryStatuses,
          eventTypes,
          urgencies
        ).then((res) => {
          return res;
        });
      }
      const publicAdvisoryCount = await strapi.services[modelName].count();
      strapi.log.info(`public advisories loaded: ${publicAdvisoryCount}`);
      strapi.log.info(`loading completed ${modelName}...`);
    }
  } catch (error) {
    strapi.log.error(error);
  }
};

module.exports = {
  loadPublicAdvisory,
};
