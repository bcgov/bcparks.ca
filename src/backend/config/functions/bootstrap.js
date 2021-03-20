"use strict";
const fs = require("fs");
const axios = require("axios");
const { sanitizeEntity } = require("strapi-utils");

/**
 * An asynchronous bootstrap function that runs before
 * your application gets started.
 *
 * This gives you an opportunity to set up your data model,
 * run jobs, or perform some special logic.
 *
 * See more details here: https://strapi.io/documentation/developer-docs/latest/concepts/configurations.html#bootstrap
 */
// const loadParData = async () => {
//   const currentParks = await strapi.services.park.find();
//   if (currentParks.length == 0) {
//     console.log("Loading Parks data");
//     axios
//       .get("https://a100.gov.bc.ca/pub/parws/protectedLands", {
//         params: {
//           protectedLandName: "%",
//           protectedLandTypeCodes: "CS,ER,PA,PK,RA",
//         },
//       })
//       .then((response) => {
//         const parks = response.data.data;
//         parks.forEach(async (park) => {
//           await strapi.services.park.create({
//             ParkID: park.protectedLandId.toString(),
//             TypeCode: park.protectedLandTypeCode.toString(),
//             ParkName: park.protectedLandName.toString(),
//             EstablishedDate: park.establishedDate.toString(),
//             TotalArea: park.totalArea.toString(),
//             UploadArea: park.uplandArea.toString(),
//             MarineArea: park.marineArea.toString(),
//           });
//         });
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   }
// };

// // This method is used for testing and development only
// const removeParks = async () => {
//   console.log("Removing parks data for testing");
//   const parks = await strapi.services.park.delete();
//   return sanitizeEntity(parks, { model: strapi.models.park });
// };

module.exports = async () => {
  //await loadParData();
  //await removeParks();
};
