"use strict";
const fs = require("fs");

/**
 * An asynchronous bootstrap function that runs before
 * your application gets started.
 *
 * This gives you an opportunity to set up your data model,
 * run jobs, or perform some special logic.
 *
 * See more details here: https://strapi.io/documentation/developer-docs/latest/concepts/configurations.html#bootstrap
 */
const createParks = async () => {
  const currentParks = await strapi.services.park.find();
  if (currentParks.length == 0) {
    console.log("Loading Parks data");
    var parksData = fs.readFileSync("./data/park.json", "utf8");
    const parks = JSON.parse(parksData);
    parks.forEach((park) => {
      strapi.services.park.create({
        ParkID: park.ParkID,
        TypeCode: park.TypeCode,
        ParkName: park.ParkName,
        URL: park.URL,
        Latitude: park.Latitude,
        Longitude: park.Longitude,
        EstablishedDate: park.EstablishedDate,
        TotalArea: park.TypeCode,
        UploadArea: park.UploadArea,
        MarineArea: park.MarineArea,
      });
    });
  }
};

module.exports = async () => {
  await createParks();
};
