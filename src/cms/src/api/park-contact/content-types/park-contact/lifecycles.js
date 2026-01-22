/**
 * Strapi 5 lifecycle hooks for Document Service
 * Migration Guide: https://docs.strapi.io/cms/migration/v4-to-v5/breaking-changes/lifecycle-hooks-document-service
 * Document Service API: https://docs.strapi.io/cms/api/document-service
 */

"use strict";

const validator = require("../../../../helpers/validator.js");

const updateName = async (data) => {
  if (data.documentId) {
    const documentId = data.documentId;

    const parkContact = await strapi
      .documents("api::park-contact.park-contact")
      .findOne({
        documentId,
        populate: "*",
      });

    if (!parkContact) {
      return data;
    }

    const protectedArea = parkContact.protectedArea;
    const parkOperatorContact = parkContact.parkOperatorContact;

    data.name = "";
    if (protectedArea) {
      data.name = protectedArea.orcs;
    } else {
      data.name = 0;
    }
    if (parkOperatorContact) {
      data.name += ":";
      data.name += parkOperatorContact.defaultTitle;
    } else {
      data.name += ":";
      data.name += data.title || parkContact.title;
    }
  }
  return data;
};

module.exports = {
  async beforeCreate(event) {
    let { data } = event.params;
    data = await updateName(data);
    validator.protectedAreaValidator(data.protectedArea);
  },
  async beforeUpdate(event) {
    let { data } = event.params;
    data = await updateName(data);
    validator.protectedAreaValidator(data.protectedArea);
  },
};
