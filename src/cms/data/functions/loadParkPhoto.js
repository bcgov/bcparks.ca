const mime = require("mime-types");
const fs = require("fs");

const http = require("http");
const https = require("https");

var Stream = require("stream").Transform;
const loadUtils = require("./loadUtils");

const rootDir = process.cwd();

var downloadImageToUrl = (url, filename, callback) => {
  var client = http;
  if (url.toString().indexOf("https") === 0) {
    client = https;
  }

  client
    .request(url, function (response) {
      var data = new Stream();

      response.on("data", function (chunk) {
        data.push(chunk);
      });

      response.on("end", function () {
        fs.writeFileSync(filename, data.read());
      });
    })
    .end();
};

const loadImage = async () => {
  const fileName = "abc.png";
  const filePath = `${rootDir}/data/images/${fileName}`;
  const fileStat = fs.statSync(filePath);
  const attachment = await strapi.plugins.upload.services.upload.upload({
    data: {
      refId: 3,
      ref: "restaurant",
      field: "cover",
    },
    files: {
      path: filePath,
      name: fileName,
      type: mime.lookup(filePath),
      size: fileStat.size,
    },
  });
};

const loadParkPhoto = async () => {
  const modelName = "park-photo";
  const loadSetting = await loadUtils.getLoadSettings(modelName);

  //if (loadSetting && loadSetting.purge)
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
        dateTaken: data.dateTaken,
        photographer: data.photographer,
        isActive: data.isActive,
      };
      await strapi.services["park-photo"].create(parkPhoto);
      break;
    }
    strapi.log.info("loading park photo completed...");
  }
};

module.exports = {
  loadParkPhoto,
};
