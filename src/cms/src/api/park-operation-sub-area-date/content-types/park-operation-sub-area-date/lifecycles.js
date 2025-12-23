
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
// const indexParkBySubAreaId = async (subAreaId) => {
//   if (!subAreaId) {
//     return;
//   }
//   const subArea = await strapi.entityService.findOne(
//     "api::park-operation-sub-area.park-operation-sub-area",
//     subAreaId,
//     {
//       fields: ['id'],
//       populate: { protectedArea: { fields: ['id'] } }
//     });
//   await indexPark(subArea?.protectedArea?.id)
// };
// 
// module.exports = {
//   async afterUpdate(event) {
//     await indexParkBySubAreaId(event.result.parkOperationSubArea?.id)
//   },
//   async afterCreate(event) {
//     await indexParkBySubAreaId(event.result.parkOperationSubArea?.id)
//   },
//   async beforeUpdate(event) {
//     for (const park of event.params.data?.parkOperationSubArea?.disconnect || []) {
//       await indexParkBySubAreaId(park.id)
//     }
//   },
//   async beforeDelete(event) {
//     let { where } = event.params;
//     const subAreaDate = await strapi.entityService.findOne(
//       "api::park-operation-sub-area-date.park-operation-sub-area-date",
//       where.id,
//       {
//         fields: ['id'],
//         populate: {
//           parkOperationSubArea: {
//             fields: ['id'],
//             populate: { protectedArea: { fields: ['id'] } }
//           }
//         }
//       });
//     await indexPark(subAreaDate.parkOperationSubArea?.protectedArea?.id)
//   }
// };
// 