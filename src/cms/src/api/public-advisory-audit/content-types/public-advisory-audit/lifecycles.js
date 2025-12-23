
/*
 *
 * ============================================================
 * WARNING: THIS FILE HAS BEEN COMMENTED OUT
 * ============================================================
 *
 * CONTEXT:
 *
 * The lifecycles.js file has been commented out to prevent unintended side effects when starting Strapi 5 for the first time after migrating to the document service.
 *
 * STRAPI 5 introduces a new document service that handles lifecycles differently compared to previous versions. Without migrating your lifecycles to document service middlewares, you may experience issues such as:
 *
 * - `unpublish` actions triggering `delete` lifecycles for every locale with a published entity, which differs from the expected behavior in v4.
 * - `discardDraft` actions triggering both `create` and `delete` lifecycles, leading to potential confusion.
 *
 * MIGRATION GUIDE:
 *
 * For a thorough guide on migrating your lifecycles to document service middlewares, please refer to the following link:
 * [Document Services Middlewares Migration Guide](https://docs.strapi.io/dev-docs/migration/v4-to-v5/breaking-changes/lifecycle-hooks-document-service)
 *
 * IMPORTANT:
 *
 * Simply uncommenting this file without following the migration guide may result in unexpected behavior and inconsistencies. Ensure that you have completed the migration process before re-enabling this file.
 *
 * ============================================================
 */

// "use strict";
// /**
//  * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
//  * to customize this model
//  */
// 
// const { queueAdvisoryEmail } = require("../../../../helpers/taskQueue.js");
// 
// const getNextAdvisoryNumber = async () => {
//   const result = await strapi.db.query('api::public-advisory-audit.public-advisory-audit').findOne({
//     orderBy: {
//       advisoryNumber: 'DESC'
//     }
//   });
//   let { advisoryNumber: maxAdvisoryNumber } = result;
//   if (!maxAdvisoryNumber || maxAdvisoryNumber < 0) maxAdvisoryNumber = 0;
//   return ++maxAdvisoryNumber;
// };
// 
// const getNextRevisionNumber = async (advisoryNumber) => {
//   const result = await strapi.db.query('api::public-advisory-audit.public-advisory-audit').findOne({
//     where: {
//       advisoryNumber
//     },
//     orderBy: {
//       revisionNumber: 'DESC'
//     }
//   });
//   let { revisionNumber } = result;
//   let maxRevisionNumber = revisionNumber;
//   if (!maxRevisionNumber || maxRevisionNumber < 0) maxRevisionNumber = 0;
//   return ++maxRevisionNumber;
// };
// 
// const archiveOldPublicAdvisoryAudit = async (data) => {
//   delete data.id;
//   delete data.updatedBy;
//   delete data.createdBy;
//   delete data.links; // keep links connected to the latest revision, not the archived version
//   data.publishedAt = null;
//   data.isLatestRevision = false;
// 
//   try {
//     await strapi.entityService.create('api::public-advisory-audit.public-advisory-audit', { data: data })
//   } catch (error) {
//     strapi.log.error(
//       `error creating public-advisory-audit ${data.advisoryNumber}...`,
//       error
//     );
//   }
// };
// 
// const savePublicAdvisory = async (publicAdvisory) => {
//   delete publicAdvisory.updatedBy;
//   delete publicAdvisory.createdBy;
//   const isExist = await strapi.db.query('api::public-advisory.public-advisory').findOne({
//     where: {
//       advisoryNumber: publicAdvisory.advisoryNumber
//     }
//   });
//   if (publicAdvisory.advisoryStatus.code === "PUB") {
//     publicAdvisory.publishedAt = new Date();
//     if (isExist) {
//       try {
//         publicAdvisory.id = isExist.id;
//         await strapi.entityService.update('api::public-advisory.public-advisory', isExist.id, { data: publicAdvisory })
//       } catch (error) {
//         strapi.log.error(
//           `error updating public-advisory advisoryNumber ${publicAdvisory.advisoryNumber}...`,
//           error
//         );
//       }
//     } else {
//       try {
//         delete publicAdvisory.id;
//         await strapi.entityService.create('api::public-advisory.public-advisory', {
//           data: publicAdvisory
//         });
//       } catch (error) {
//         strapi.log.error(
//           `error creating public-advisory ${publicAdvisory.id}...`,
//           error
//         );
//       }
//     }
//   } else if (isExist) {
//     try {
//       await strapi.entityService.delete('api::public-advisory.public-advisory', isExist.id);
//     } catch (error) {
//       strapi.log.error(
//         `error deleting public-advisory ${publicAdvisory.id}...`,
//         error
//       );
//     }
//   }
// };
// 
// const copyToPublicAdvisory = async (newPublicAdvisory) => {
//   if (newPublicAdvisory.isLatestRevision && newPublicAdvisory.advisoryStatus) {
//     const publishedStatuses = ["PUB", "INA"];
//     if (publishedStatuses.includes(newPublicAdvisory.advisoryStatus.code)) {
//       savePublicAdvisory(newPublicAdvisory);
//     }
//   }
// };
// 
// const isAdvisoryEqual = (newData, oldData) => {
//   const fieldsToCompare = {
//     title: null,
//     description: null,
//     isSafetyRelated: null,
//     listingRank: null,
//     note: null,
//     advisoryDate: null,
//     effectiveDate: null,
//     endDate: null,
//     expiryDate: null,
//     accessStatus: {},
//     eventType: {},
//     urgency: {},
//     standardMessages: [],
//     protectedAreas: [],
//     advisoryStatus: {},
//     links: [],
//     regions: [],
//     sections: [],
//     managementAreas: [],
//     sites: [],
//     fireCentres: [],
//     fireZones: [],
//     naturalResourceDistricts: [],
//     isAdvisoryDateDisplayed: null,
//     isEffectiveDateDisplayed: null,
//     isEndDateDisplayed: null,
//     isUpdatedDateDisplayed: null,
//     modifiedBy: null,
//   };
// 
//   for (const key of Object.keys(fieldsToCompare)) {
//     if (Array.isArray(oldData[key])) {
//       oldData[key] = oldData[key].map((x) => x.id).sort();
//       if (newData[key]) newData[key].sort();
//     } else {
//       if (typeof oldData[key] === "object" && oldData[key])
//         oldData[key] = oldData[key].id;
//     }
//     if (JSON.stringify(newData[key]) != JSON.stringify(oldData[key]))
//       return false;
//   }
//   return true;
// };
// 
// module.exports = {
//   beforeCreate: async (ctx) => {
//     let { data } = ctx.params;
//     if (!data.revisionNumber && !data.advisoryNumber) {
//       data.advisoryNumber = await getNextAdvisoryNumber();
//       data.revisionNumber = 1;
//       data.isLatestRevision = true;
//       data.publishedAt = new Date();
//     }
//   },
//   afterCreate: async (ctx) => {
//     const newPublicAdvisoryAudit = await strapi.entityService.findOne('api::public-advisory-audit.public-advisory-audit', ctx.result.id, {
//       populate: "*"
//     });
// 
//     const newAdvisoryStatus = newPublicAdvisoryAudit.advisoryStatus?.code;
// 
//     if (newAdvisoryStatus === "ARQ") {
//       await queueAdvisoryEmail(
//         "Approval requested",
//         "Approval requested for the following advisory",
//         newPublicAdvisoryAudit.advisoryNumber,
//         "public-advisory-audit::lifecycles::afterCreate()"
//       );
//     }
// 
//     if (newAdvisoryStatus === "PUB" && newPublicAdvisoryAudit.isUrgentAfterHours) {
//       await queueAdvisoryEmail(
//         "After-hours advisory posted",
//         "An after-hours advisory was posted",
//         newPublicAdvisoryAudit.advisoryNumber,
//         "public-advisory-audit::lifecycles::afterCreate()"
//       );
//     }
// 
//     copyToPublicAdvisory(newPublicAdvisoryAudit);
//   },
//   beforeUpdate: async (ctx) => {
//     let { data, where } = ctx.params;
//     const newPublicAdvisory = data;
//     if (!newPublicAdvisory.publishedAt) return;
// 
//     newPublicAdvisory.publishedAt = new Date();
//     newPublicAdvisory.isLatestRevision = true;
//     const oldPublicAdvisory = await strapi.entityService.findOne('api::public-advisory-audit.public-advisory-audit', where.id, {
//       populate: "*"
//     });
// 
//     if (!oldPublicAdvisory) return;
//     if (!oldPublicAdvisory.publishedAt) return;
// 
//     // save the status of the old advisory so we can get it back in afterUpdate()
//     ctx.state.oldStatus = oldPublicAdvisory.advisoryStatus?.code;
// 
//     const oldAdvisoryStatus = oldPublicAdvisory.advisoryStatus
//       ? oldPublicAdvisory.advisoryStatus.code
//       : "DFT";
// 
//     if (isAdvisoryEqual(newPublicAdvisory, oldPublicAdvisory)) return;
// 
//     // flow 5: system updates
//     if (newPublicAdvisory.modifiedBy === "system") {
//       await archiveOldPublicAdvisoryAudit(oldPublicAdvisory);
//       newPublicAdvisory.revisionNumber = await getNextRevisionNumber(
//         oldPublicAdvisory.advisoryNumber
//       );
//       return;
//     }
// 
//     // flow 4: update inactive (set by system)
//     if (
//       oldAdvisoryStatus === "INA" &&
//       oldPublicAdvisory.modifiedBy === "system"
//     ) {
//       await archiveOldPublicAdvisoryAudit(oldPublicAdvisory);
//       newPublicAdvisory.revisionNumber = await getNextRevisionNumber(
//         oldPublicAdvisory.advisoryNumber
//       );
//       return;
//     }
// 
//     // flow 3: update published advisory
//     if (oldAdvisoryStatus === "PUB") {
//       await archiveOldPublicAdvisoryAudit(oldPublicAdvisory);
//       newPublicAdvisory.revisionNumber = await getNextRevisionNumber(
//         oldPublicAdvisory.advisoryNumber
//       );
//       return;
//     }
//   },
//   afterUpdate: async (ctx) => {
//     const publicAdvisoryAudit = await strapi.entityService.findOne('api::public-advisory-audit.public-advisory-audit', ctx.result.id, {
//       populate: "*"
//     });
// 
//     const oldAdvisoryStatus = ctx.state.oldStatus; // saved by beforeUpdate() above
//     const newAdvisoryStatus = publicAdvisoryAudit.advisoryStatus?.code;
// 
//     if (newAdvisoryStatus === "ARQ" && oldAdvisoryStatus !== "ARQ") {
//       await queueAdvisoryEmail(
//         "Approval requested",
//         "Approval requested for the following advisory",
//         publicAdvisoryAudit.advisoryNumber,
//         "public-advisory-audit::lifecycles::afterUpdate()"
//       );
//     }
// 
//     if (
//       newAdvisoryStatus === "PUB" && oldAdvisoryStatus !== "PUB" &&
//       publicAdvisoryAudit.modifiedByRole === "submitter" && publicAdvisoryAudit.isUrgentAfterHours
//     ) {
//       await queueAdvisoryEmail(
//         "After-hours advisory posted",
//         "An after-hours advisory was posted",
//         publicAdvisoryAudit.advisoryNumber,
//         "public-advisory-audit::lifecycles::afterUpdate()"
//       );
//     }
// 
//     copyToPublicAdvisory(publicAdvisoryAudit);
//   },
// };
// 