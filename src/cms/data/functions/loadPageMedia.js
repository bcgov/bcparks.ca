const mime = require("mime-types");
const fs = require("fs");
const request = require("request");
const path = require("path");

const rootDir = process.cwd();
const MEDIA_PATH = "/../../media_uploads";

const loadJson = async (model, jsonFile, object) => {
  try {
    
    const model = "website";
    const jsonFile = "./data/websites.json";
    await strapi.services[model].delete();
    const currentData = await strapi.services[model].find();

    if (currentData.length == 0) {
      strapi.log.info(`loading ${model} started...`);
      var jsonData = fs.readFileSync(jsonFile, "utf8");
      const dataSeed = JSON.parse(jsonData)[object];

      dataSeed.forEach(async (data) => {
        const keys = Object.keys(data);
        for (let i = 0; i < keys.length; i++) {
          if (data[keys[i]] === "") data[keys[i]] = null;
        }

        await strapi.services[model].create(data);
      });
      strapi.log.info(`loading ${model} completed...`);
    }
  } catch (error) {
    strapi.log.error(`error loading ${model}...`);
    strapi.log.error(error);
  }
};

const loadPageMedia = async () => {
  const fullMediaPath = rootDir + MEDIA_PATH;
  const model = "website";
  const object = "website";
  const jsonFile = "./data/websites.json";
  
  var jsonData = fs.readFileSync(jsonFile, "utf8");
  

  strapi.log.info(`Media directory ${fullMediaPath}`);
  
  files = fs.readdirSync(fullMediaPath)
    
  for await (const file of files) {
    var filename = path.parse(file).base;
    var fileStat = fs.statSync(`${fullMediaPath}/${file}`);
    const attachment = await strapi.plugins.upload.services.upload.upload({
      data: {},
      files: {
        path: `${fullMediaPath}/${file}`,
        name: filename,
        type: mime.lookup(file),
        size: fileStat.size,
      }
    });
    strapi.log.info(`loaded media file ${filename} as ${attachment[0].url}`);
    var filenameWithHash = attachment[0].hash.replace("/uploads/","")+ attachment[0].ext;
    var filenameWithOutHash = new RegExp(filenameWithHash.substr(0, filenameWithHash.length-15) + attachment[0].ext, "gi");
    jsonData = jsonData.replace(filenameWithOutHash,`${filenameWithHash}`);
  };
  
  strapi.log.info("loading media files completed...");
  
  const dataSeed = JSON.parse(jsonData)[object];

  dataSeed.forEach(async (data) => {
    const keys = Object.keys(data);
    for (let i = 0; i < keys.length; i++) {
      if (data[keys[i]] === "") data[keys[i]] = null;
    }

    await strapi.services[model].create(data);
  });
  strapi.log.info(`loading ${model} completed...`);
  
};

module.exports = {
  loadPageMedia,
};
