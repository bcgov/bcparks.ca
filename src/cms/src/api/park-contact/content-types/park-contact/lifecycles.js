/*
 * ============================================================
 * STRAPI 5 LIFECYCLE HOOKS - MIGRATED TO DOCUMENT SERVICE
 * ============================================================
 *
 * NOTE: This lifecycle logic has been migrated to Document Service Middleware
 * in src/index.js as recommended by Strapi v5 migration guide.
 *
 * This file is kept for reference but the main logic now runs through the
 * centralized middleware to properly handle Draft & Publish and i18n features.
 *
 * Migration Guide: https://docs.strapi.io/cms/migration/v4-to-v5/breaking-changes/lifecycle-hooks-document-service
 * Document Service Middlewares: https://docs.strapi.io/cms/api/document-service/middlewares
 *
 * ============================================================
 */

"use strict";

const updateName = async (data, where) => {
    if (where) {
        const documentId = where.documentId
        const parkContact = await strapi.documents("api::park-contact.park-contact").findOne({
            documentId, populate: '*'
        })
        let protectedArea = parkContact.protectedArea
        const parkOperatorContact = parkContact.parkOperatorContact

        // Check if new protectedArea is being added
        if (data?.protectedArea?.connect?.length > 0) {
          protectedArea = await strapi.documents("api::protected-area.protected-area").findOne({
            documentId: data?.protectedArea.connect[0].documentId
          })
        // Check if current protectedArea is being removed
        } else if (data?.protectedArea?.disconnect?.length > 0) {
          protectedArea = { orcs: 0 }
        }

        data.name = ""
        if (protectedArea) {
            data.name = protectedArea.orcs
        } else {
            data.name = 0
        }
        if (parkOperatorContact) {
            data.name += ":"
            data.name += parkOperatorContact.defaultTitle
        } else {
            data.name += ":"
            data.name += data.title || parkContact.title
        }
    }
    return data
};

module.exports = {
    async beforeCreate(event) {
        let { data, where } = event.params;
        data = await updateName(data, where);
    },
    async beforeUpdate(event) {
        let { data, where } = event.params;
        data = await updateName(data, where);
    },
};

