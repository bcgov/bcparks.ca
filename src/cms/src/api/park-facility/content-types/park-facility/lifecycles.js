
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
// const validator = require("../../../../helpers/validator.js");
// 
// /**
//  * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
//  * to customize this model
//  */
// 
// const updateName = async (data, where) => {
//   if (where) {
//     const id = where.id
//     const parkFacility = await strapi.entityService.findOne(
//       "api::park-facility.park-facility", id, { populate: '*'}
//     )
//     const protectedArea = parkFacility.protectedArea
//     const site = parkFacility.site
//     const facilityType = parkFacility.facilityType
//   
//     data.name = ""
//     if (protectedArea) {
//       data.name = protectedArea.orcs
//     }
//     if (site) {
//       data.name = site.orcsSiteNumber
//     }
//     if (facilityType) {
//       data.name += ":"
//       data.name += facilityType.facilityName;
//     }
//   }
//   return data
// };
// 
// module.exports = {
//   async beforeCreate(event) {
//     let { data, where } = event.params;
//     data = await updateName(data, where);
//     validator.facilityTypeConnectValidator(data.facilityType)
//   },
//   async beforeUpdate(event) {
//     let { data, where } = event.params;
//     data = await updateName(data, where);
//     validator.facilityTypeDisconnectValidator(data.facilityType)
//     for (const park of event.params.data?.protectedArea?.disconnect || []) {
//       await indexPark(park.id)
//     }
//   },
//   async afterUpdate(event) {
//     await indexPark(event.result.protectedArea?.id)
//   },
//   async afterCreate(event) {
//     await indexPark(event.result.protectedArea?.id)
//   },
//   async beforeDelete(event) {
//     let { where } = event.params;
//     const parkFacility = await strapi.entityService.findOne(
//       "api::park-facility.park-facility", where.id, {
//       fields: ['id'],
//       populate: { protectedArea: { fields: ['id'] } }
//     });
//     await indexPark(parkFacility.protectedArea?.id)
//   }
// };
// 