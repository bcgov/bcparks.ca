"use strict";

/**
 * public-advisory controller
 */

const { sanitize } = require('@strapi/utils')
const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
    "api::public-advisory.public-advisory",
    ({ strapi }) => ({
        async findOne(ctx) {
            const { id } = ctx.params;
            const entities = await strapi.entityService.findMany("api::public-advisory.public-advisory", {
                filters: { advisoryNumber: id },
                // fields: ["id", "advisoryNumber", "revisionNumber", "title", "description", "dcTicketNumber",
                //     "isSafetyRelated", "listingRank", "note", "latitude", "longitude", "mapZoom",
                //     "isReservationsAffected", "isAdvisoryDateDisplayed", "isEffectiveDateDisplayed",
                //     "isEndDateDisplayed", "isUpdatedDateDisplayed", "submittedBy", "createdDate", 
                //     "advisoryDate", "effectiveDate", "endDate", "expiryDate", "removalDate"
                // ],
                populate: {
                    "accessStatus": { "fields": ["id", "accessStatus", "precedence", "color"] },
                    "standardMessages": { "fields": ["id", "title", "description"] },
                    "eventType": { "fields": ["id", "eventType"] },
                    "urgency": { "fields": ["id", "urgency", "code", "sequence", "color"] },
                    "advisoryStatus": { "fields": ["id", "advisoryStatus", "code"] },
                    "protectedAreas": { "fields": ["id", "orcs", "protectedAreaName", "url"] }
                }
            });

            const contentType = strapi.contentType("api::public-advisory.public-advisory");
            const entity = entities.length ? await sanitize.contentAPI.output(entities[0], contentType, ctx.state.auth) : null;

            if (entity) {

                const { description = "", standardMessages } = entity;

                strapi.log.warn(JSON.stringify(standardMessages))

                if (standardMessages && standardMessages.length > 0) {
                    entity.description = (
                        description +
                        " " +
                        standardMessages.map((m) => m.description).join(" ")
                    ).trim();
                }
            }
            return entity;
        },
        async find(ctx) {
            // let entities;
            if (ctx.query._q) {
                return await strapi.service("api::public-advisory.public-advisory").search(ctx.query);
            } else {
                return await super.find(ctx.query);
            }
            // return entities.map((entity) => {
            //     const publicAdvisory = sanitizeEntity(entity, {
            //         model: strapi.contentTypes["public-advisory"],
            //     });
            //     if (publicAdvisory) {
            //         const { description = "", standardMessages } = publicAdvisory;
            //         if (standardMessages.length > 0) {
            //             publicAdvisory.description = (
            //                 description +
            //                 " " +
            //                 standardMessages.map((m) => m.description).join(" ")
            //             ).trim();
            //         }
            //     }
            //     return publicAdvisory;
            // });
        },
    }
    )
);
