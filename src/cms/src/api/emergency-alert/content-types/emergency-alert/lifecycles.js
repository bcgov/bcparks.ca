
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
// const format = require('date-fns/format')
// const utcToZonedTime = require('date-fns-tz/utcToZonedTime')
// 
// const formatDateToPacificTime = (dateString) => {
//   // Strapi returns the date in ISO format e.g. 2025-01-01T00:00:00.000Z
//   // Convert dateString to Pacific Time
//   const pacificTime = utcToZonedTime(dateString, 'America/Los_Angeles')
//   // Format the date in YYYY-MM-DD e.g. 2025-01-01
//   return format(pacificTime, 'yyyy-MM-dd')
// }
// 
// module.exports = {
//     beforeCreate(event) {
//         const { data } = event.params
//         const createdDate = formatDateToPacificTime(data.createdAt)
//         if (data.isActive === true) {
//             data.activeDate = createdDate
//         }
//     },
//     beforeUpdate(event) {
//         const { data } = event.params
//         const updatedDate = formatDateToPacificTime(data.updatedAt)
//         if (data.isActive === true) {
//             data.activeDate = updatedDate
//         }
//         if (data.isActive === false && data.activeDate) {
//             data.inactiveDate = updatedDate
//         }
//     }
// }
// 