const mime = require("mime-types");
const fs = require("fs");
const request = require("request");
const path = require("path");

const loadUtils = require("./loadUtils");

const rootDir = process.cwd();
const IMAGE_PATH = "\\data\\images";

const downloadImage = async (url, dest) => {
  const file = fs.createWriteStream(dest);

  await new Promise((resolve, reject) => {
    request({
      uri: url,
      gzip: true,
    })
      .pipe(file)
      .on("finish", async () => {
        resolve();
      })
      .on("error", (error) => {
        reject(error);
      });
  }).catch((error) => {
    console.log("error occured - downloadImage", error);
  });
};

const loadImage = async (parkId, filepath) => {
  try {
    const filename = path.parse(filepath).base;
    const fileStat = fs.statSync(filepath);
    const attachment = await strapi.plugins.upload.services.upload.upload({
      data: {
        refId: parkId,
        ref: "park-photo",
        field: "thumbnail",
      },
      files: {
        path: filepath,
        name: filename,
        type: mime.lookup(filepath),
        size: fileStat.size,
      },
    });
  } catch {
    console.log("error occured - loadImage");
  }
};

const loadParkPhoto = async () => {
  const modelName = "park-photo";
  const loadSetting = await loadUtils.getLoadSettings(modelName);

  if (loadSetting && loadSetting.purge)
    await strapi.services[modelName].delete();

  if (loadSetting && !loadSetting.reload) return;

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
        image: null,
        thumbnail: null,
      };
      try {
        const result = await strapi.services["park-photo"].create(parkPhoto);

        const filename = result.thumbnailUrl
          .replace("https://bcparks.ca/explore/parkpgs/", "")
          .replace(/\//g, "-");
        const filepath = `${rootDir}${IMAGE_PATH}\\${filename}`;

        await downloadImage(result.thumbnailUrl, filepath);
        loadImage(result.id, filepath);
      } catch {
        console.log("error occured - loadParkPhoto");
      }
    }

    strapi.log.info("loading park photo completed...");
  }
};

module.exports = {
  loadParkPhoto,
};
