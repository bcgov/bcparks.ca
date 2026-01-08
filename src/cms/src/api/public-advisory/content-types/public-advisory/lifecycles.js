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
// const indexParks = async function (ctx) {
//     let { where } = ctx.params;
//     const advisory = await strapi.documents("api::public-advisory.public-advisory").findOne({
//         documentId: where.documentId,
//         fields: ['id'],
//         populate: { protectedAreas: { fields: ['id'] } }
//     });
//     for (const pa of advisory.protectedAreas) {
//         await indexPark(pa.id);
//     }
// };
//
// const clearRestCache = async function () {
//     const cachePlugin = strapi.plugins["rest-cache"];
//     if (cachePlugin) {
//         await cachePlugin.services.cacheStore.clearByUid('api::public-advisory.public-advisory');
//         await cachePlugin.services.cacheStore.clearByUid('api::protected-area.protected-area');
//         await cachePlugin.services.cacheStore.clearByUid('api::park-access-status.park-access-status');
//     }
// }
//
// // clear the public advisories from the rest cache after all crud operations
// module.exports = {
//     afterCreate: async (ctx) => {
//         await clearRestCache();
//         for (const pa of ctx.params?.data?.protectedAreas || []) {
//             await indexPark(pa?.id);
//         }
//     },
//     afterUpdate: async (ctx) => {
//         await clearRestCache();
//         for (const pa of ctx.params?.data?.protectedAreas || []) {
//             await indexPark(pa?.id);
//         }
//     },
//     beforeUpdate: async (ctx) => {
//         await indexParks(ctx);
//     },
//     beforeDelete: async (ctx) => {
//         await indexParks(ctx);
//     },
//     afterDelete: async (ctx) => {
//         await clearRestCache();
//     },
//     afterCreateMany: async (ctx) => {
//         await clearRestCache();
//     },
//     afterUpdateMany: async (ctx) => {
//         await clearRestCache();
//     },
//     afterDeleteMany: async (ctx) => {
//         await clearRestCache();
//     },
// };
//
