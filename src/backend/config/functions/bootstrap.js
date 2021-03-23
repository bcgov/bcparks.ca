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

const createAccessStatus = async () => {
  const currentData = await strapi.services["access-status"].find();
  if (currentData.length == 0) {
    console.log("Loading Access Statuses..");
    var jsonData = fs.readFileSync("./data/access-status.json", "utf8");
    const dataSeed = JSON.parse(jsonData);
    dataSeed.forEach((data) => {
      strapi.services["access-status"].create({
        AccessStatus: data.AccessStatus,
      });
    });
  }
};

const createEventType = async () => {
  const currentData = await strapi.services["event-type"].find();
  if (currentData.length == 0) {
    console.log("Loading Event Statuses..");
    var jsonData = fs.readFileSync("./data/event-type.json", "utf8");
    const dataSeed = JSON.parse(jsonData);
    dataSeed.forEach((data) => {
      strapi.services["event-type"].create({
        EventType: data.EventType,
      });
    });
  }
};

const createPublicAdvisoryEvent = async () => {
  const currentData = await strapi.services["public-advisory-event"].find();
  if (currentData.length == 0) {
    console.log("Loading Public Advisory Event..");
    var jsonData = fs.readFileSync("./data/public-advisory-event.json", "utf8");
    const dataSeed = JSON.parse(jsonData);
    dataSeed.forEach((data) => {
      strapi.services["public-advisory-event"].create({
        Title: data.Title,
        Submitter: data.Submitter,
        AdvisoryStatus: data.AdvisoryStatus,
      });
    });
  }
};

module.exports = async () => {
  await createParks();
  await createAccessStatus();
  await createEventType();
  await createPublicAdvisoryEvent();
};
