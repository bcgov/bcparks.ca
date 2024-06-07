"use strict";

const { indexPark } = require("../../../../helpers/taskQueue.js");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

const getOrcs = async function (event) {
  let { where } = event.params;
  if (!where.id) {
    return null;
  }
  const photo = await strapi.entityService.findOne(
    "api::park-photo.park-photo",
    where.id,
    {
      fields: ["orcs"],
    }
  );
  return photo?.orcs;
};

const getOrcsSiteNumber = async function (event) {
  let { where } = event.params;
  if (!where.id) {
    return null;
  }
  const photo = await strapi.entityService.findOne(
    "api::park-photo.park-photo",
    where.id,
    {
      fields: ["orcsSiteNumber"],
    }
  );
  return photo?.orcsSiteNumber;
};

const getProtectedAreaIdByOrcs = async function (orcs) {
  if (!orcs) {
    return null;
  }
  const parks = await strapi.entityService.findMany(
    "api::protected-area.protected-area",
    {
      fields: ["id"],
      filters: {
        orcs: orcs,
      },
    }
  );
  if (!parks.length) {
    return null;
  }
  return parks[0]?.id;
};

module.exports = {
  async afterCreate(event) {
    // If parkPhoto.protectedArea is selected, get that protectedArea.orcs in the parkPhoto.orcs
    if (event.result?.protectedArea) {
      const protectedAreaOrcs = event.result.protectedArea.orcs;
      event.result.orcs = protectedAreaOrcs;
      await strapi.entityService.update(
        "api::park-photo.park-photo", event.result.id, { data: { orcs: protectedAreaOrcs } }
      )
    }
    // If parkPhoto.site is selected, get that site.orcsSiteNumber in the parkPhoto.orcsSiteNumber
    if (event.result?.site) {
      const siteOrcs = event.result.site.orcsSiteNumber;
      event.result.orcsSiteNumber = siteOrcs;
      await strapi.entityService.update(
        "api::park-photo.park-photo", event.result.id, { data: { orcsSiteNumber: siteOrcs } }
      )
    }
    const protectedAreaId = await getProtectedAreaIdByOrcs(event.result?.orcs);
    await indexPark(protectedAreaId);
  },
  async afterUpdate(event) {
    // If parkPhoto.protectedArea is selected, get that protectedArea.orcs in the parkPhoto.orcs
    if (event.result?.protectedArea !== undefined) {
      const protectedAreaOrcs = event.result.protectedArea?.orcs;
      if (event.result.orcs !== protectedAreaOrcs) {
        event.result.orcs = protectedAreaOrcs;
        await strapi.entityService.update(
          "api::park-photo.park-photo", event.result.id, { data: { orcs: protectedAreaOrcs } }
        )
      }
    }
    // If parkPhoto.site is selected, get that site.orcsSiteNumber in the parkPhoto.orcsSiteNumber
    if (event.result?.site !== undefined) {
      const siteOrcs = event.result.site?.orcsSiteNumber;
      if (event.result.orcsSiteNumber !== siteOrcs) {
        event.result.orcsSiteNumber = siteOrcs;
        await strapi.entityService.update(
          "api::park-photo.park-photo", event.result.id, { data: { orcsSiteNumber: siteOrcs } }
        )
      }
    }
    const newProtectedAreaId = await getProtectedAreaIdByOrcs(event.result?.orcs);
    await indexPark(newProtectedAreaId);
  },
  async beforeUpdate(event) {
    if (event.params?.data?.protectedArea?.disconnect?.length > 0) {
      event.params.data.orcs = null;
    }
    if (event.params?.data?.site?.disconnect?.length > 0) {
      event.params.data.orcsSiteNumber = null;
    }
    const oldOrcs = await getOrcs(event);
    const oldProtectedAreaId = await getProtectedAreaIdByOrcs(oldOrcs);
    await indexPark(oldProtectedAreaId);
  },
  async beforeDelete(event) {
    const orcs = await getOrcs(event);
    const protectedAreaId = await getProtectedAreaIdByOrcs(orcs);
    await indexPark(protectedAreaId);
  }
};
