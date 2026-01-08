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
// const updateName = async (data, where) => {
//     if (where) {
//         const documentId = where.documentId
//         const parkContact = await strapi.documents("api::park-contact.park-contact").findOne({
//             documentId, populate: '*'
//         })
//         let protectedArea = parkContact.protectedArea
//         const parkOperatorContact = parkContact.parkOperatorContact
//
//         // Check if new protectedArea is being added
//         if (data?.protectedArea?.connect?.length > 0) {
//           protectedArea = await strapi.documents("api::protected-area.protected-area").findOne({
//             documentId: data?.protectedArea.connect[0].documentId
//           })
//         // Check if current protectedArea is being removed
//         } else if (data?.protectedArea?.disconnect?.length > 0) {
//           protectedArea = { orcs: 0 }
//         }
//
//         data.name = ""
//         if (protectedArea) {
//             data.name = protectedArea.orcs
//         } else {
//             data.name = 0
//         }
//         if (parkOperatorContact) {
//             data.name += ":"
//             data.name += parkOperatorContact.defaultTitle
//         } else {
//             data.name += ":"
//             data.name += data.title || parkContact.title
//         }
//     }
//     return data
// };
//
// module.exports = {
//     async beforeCreate(event) {
//         let { data, where } = event.params;
//         data = await updateName(data, where);
//     },
//     async beforeUpdate(event) {
//         let { data, where } = event.params;
//         data = await updateName(data, where);
//     },
// };
//
