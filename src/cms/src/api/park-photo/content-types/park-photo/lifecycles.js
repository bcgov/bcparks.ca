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
//
// const { indexPark } = require("../../../../helpers/taskQueue.js");
//
// /**
//  * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
//  * to customize this model
//  */
//
// const getOrcs = async function (event) {
//   let { where } = event.params;
//   if (!where.documentId) {
//     return null;
//   }
//   const photo = await strapi.documents("api::park-photo.park-photo").findOne(
//     {
//       documentId: where.documentId,
//       fields: ["orcs"],
//     }
//   );
//   return photo?.orcs;
// };
//
// const getOrcsSiteNumber = async function (event) {
//   let { where } = event.params;
//   if (!where.documentId) {
//     return null;
//   }
//   const photo = await strapi.documents("api::park-photo.park-photo").findOne(
//     {
//       documentId: where.documentId,
//       fields: ["orcsSiteNumber"],
//     }
//   );
//   return photo?.orcsSiteNumber;
// };
//
// const getProtectedAreaIdByOrcs = async function (orcs) {
//   if (!orcs) {
//     return null;
//   }
//   const parks = await strapi.documents("api::protected-area.protected-area").findMany(
//     {
//       fields: ["id"],
//       filters: {
//         orcs: orcs,
//       },
//     }
//   );
//   if (!parks.length) {
//     return null;
//   }
//   return parks[0]?.id;
// };
//
// module.exports = {
//   async afterCreate(event) {
//     // If parkPhoto.protectedArea is selected, get that protectedArea.orcs in the parkPhoto.orcs
//     if (event.result?.protectedArea) {
//       const protectedAreaOrcs = event.result.protectedArea.orcs;
//       event.result.orcs = protectedAreaOrcs;
//       await strapi.documents("api::park-photo.park-photo").update({
//         documentId: event.result.documentId, data: { orcs: protectedAreaOrcs }
//       })
//     }
//     // If parkPhoto.site is selected, get that site.orcsSiteNumber in the parkPhoto.orcsSiteNumber
//     if (event.result?.site) {
//       const siteOrcs = event.result.site.orcsSiteNumber;
//       event.result.orcsSiteNumber = siteOrcs;
//       await strapi.documents("api::park-photo.park-photo").update({
//         documentId: event.result.documentId, data: { orcsSiteNumber: siteOrcs }
//       })
//     }
//     const protectedAreaId = await getProtectedAreaIdByOrcs(event.result?.orcs);
//     await indexPark(protectedAreaId);
//   },
//   async afterUpdate(event) {
//     // If parkPhoto.protectedArea is selected, get that protectedArea.orcs in the parkPhoto.orcs
//     if (event.result?.protectedArea !== undefined) {
//       const protectedAreaOrcs = event.result.protectedArea?.orcs;
//       if (event.result.orcs !== protectedAreaOrcs) {
//         event.result.orcs = protectedAreaOrcs;
//         await strapi.documents("api::park-photo.park-photo").update({
//           documentId: event.result.documentId, data: { orcs: protectedAreaOrcs }
//         })
//       }
//     }
//     // If parkPhoto.site is selected, get that site.orcsSiteNumber in the parkPhoto.orcsSiteNumber
//     if (event.result?.site !== undefined) {
//       const siteOrcs = event.result.site?.orcsSiteNumber;
//       if (event.result.orcsSiteNumber !== siteOrcs) {
//         event.result.orcsSiteNumber = siteOrcs;
//         await strapi.documents("api::park-photo.park-photo").update({
//           documentId: event.result.documentId, data: { orcsSiteNumber: siteOrcs }
//         })
//       }
//     }
//     const newProtectedAreaId = await getProtectedAreaIdByOrcs(event.result?.orcs);
//     await indexPark(newProtectedAreaId);
//   },
//   async beforeUpdate(event) {
//     if (event.params?.data?.protectedArea?.disconnect?.length > 0) {
//       event.params.data.orcs = null;
//     }
//     if (event.params?.data?.site?.disconnect?.length > 0) {
//       event.params.data.orcsSiteNumber = null;
//     }
//     const oldOrcs = await getOrcs(event);
//     const oldProtectedAreaId = await getProtectedAreaIdByOrcs(oldOrcs);
//     await indexPark(oldProtectedAreaId);
//   },
//   async beforeDelete(event) {
//     const orcs = await getOrcs(event);
//     const protectedAreaId = await getProtectedAreaIdByOrcs(orcs);
//     await indexPark(protectedAreaId);
//   }
// };
//
