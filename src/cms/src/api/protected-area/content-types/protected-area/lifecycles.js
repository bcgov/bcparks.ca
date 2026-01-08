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
// const { indexPark, removePark } = require("../../../../helpers/taskQueue.js");
//
// /**
//  * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
//  * to customize this model
//  */
//
// const validator = require("../../../../helpers/validator.js");
//
// const saveParkAccessStatus = async (ctx) => {
//   try {
//     if (ctx.result?.orcs) {
//       const updateResult = await strapi.db
//         .query(
//           "api::park-access-status.park-access-status"
//         )
//         .updateMany(
//           {
//             where: {
//               orcs: ctx.result.orcs
//             },
//             data: {
//               orcs: ctx.result.orcs,
//               publishedAt: new Date(),
//               updatedAt: new Date()
//             }
//           });
//       if (updateResult.count === 0) {
//         await strapi.documents("api::park-access-status.park-access-status").create({
//           data: {
//             orcs: ctx.result.orcs,
//             publishedAt: new Date()
//           }
//         })
//       }
//     }
//   } catch (error) {
//     strapi.log.error(
//       `error saving park-access-status for orcs ${ctx.result?.orcs}...`,
//       error
//     );
//   }
// };
//
// module.exports = {
//   beforeCreate(event) {
//     const { data, where, select, populate } = event.params;
//     validator.slugCharacterValidator(data.slug)
//     validator.slugNoLeadingSlashValidator(data.slug)
//     validator.slugNoLeadingDashValidator(data.slug)
//     validator.slugNoTrailingDashValidator(data.slug)
//   },
//   beforeUpdate(event) {
//     const { data, where, select, populate } = event.params;
//     validator.slugCharacterValidator(data.slug)
//     validator.slugNoLeadingSlashValidator(data.slug)
//     validator.slugNoLeadingDashValidator(data.slug)
//     validator.slugNoTrailingDashValidator(data.slug)
//   },
//   afterCreate: async (ctx) => {
//     await indexPark(ctx.params?.where?.id);
//     saveParkAccessStatus(ctx);
//   },
//   afterUpdate: async (ctx) => {
//     await indexPark(ctx.params?.where?.id);
//     saveParkAccessStatus(ctx);
//   },
//   beforeDelete: async (ctx) => {
//     await removePark(ctx.params?.where?.id);
//   },
// };
//
