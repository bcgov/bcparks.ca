const fs = require("fs");

const loadUtils = require("./loadUtils");

const loadParkPhoto = async () => {
  const modelName = "park-photo";

  const currentData = await strapi.services[modelName].find();
  if (currentData.length === 0) {
    strapi.log.info("loading park photo...");
    var jsonData = fs.readFileSync("./data/park-photos.json", "utf8");
    const dataSeed = JSON.parse(jsonData)["parkPhotos"];

    for await (const data of dataSeed) {
      const parkPhoto = {
        orcs: data.orcs,
        orcsSiteNumber: data.orcsSiteNumber,
        title: data.title,
        caption: data.caption,
        subject: data.subject,
        dateTaken: loadUtils.formatDate(data.dateTaken),
        photographer: data.photographer,
        imageUrl: data.image,
        thumbnailUrl: data.thumbnail,
        isActive: data.active === true ? true : false,
      };

      try {
        await strapi.services["park-photo"].create(parkPhoto);
      } catch {
        strapi.log.info("error occured - loadParkPhoto");
      }
    }

    strapi.log.info("loading park photo completed...");
  }
};

module.exports = {
  loadParkPhoto,
};
