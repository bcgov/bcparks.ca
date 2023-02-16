const mime = require("mime-types");
const fs = require("fs");

const rootDir = process.cwd();
const IMAGE_PATH = "\\data\\icons\\activity\\";

const loadActivityIcon = async () => {
  const modelName = "activity-type";

  strapi.log.info("loading activity icons...");
  var jsonData = fs.readFileSync("./data/activity-icon.json", "utf8");
  const dataSeed = JSON.parse(jsonData)["activity-icon"];

  for await (const data of dataSeed) {
    try {
      const filename = data.iconFilename;
      const filepath = `${rootDir}${IMAGE_PATH}${filename}`;

      let fileStat;
      try {
        fileStat = fs.statSync(filepath);
      } catch (e) {
        console.log("File does not exist.", filepath);
        continue;
      }
      const activity = await strapi.services[modelName].findOne({
        activityNumber: data.activityNumber,
      });

      if (activity) {
        await strapi.plugin("upload").services.upload.upload({
          data: {
            refId: activity.id,
            ref: "activity-type",
            field: "icon",
          },
          files: {
            path: filepath,
            name: filename,
            type: mime.lookup(filepath),
            size: fileStat.size,
          },
        });
      }
    } catch {
      strapi.log.info("error occured - loadImage");
    }
  }

  strapi.log.info("loading activity icons completed...");
};

module.exports = {
  loadActivityIcon,
};
