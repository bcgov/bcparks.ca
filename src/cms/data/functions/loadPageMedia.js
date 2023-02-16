const mime = require("mime-types");
const fs = require("fs");
const path = require("path");
const { loadWebsites } = require("./loadOtherData")

const rootDir = process.cwd();
const MEDIA_PATH = "media_uploads";

const loadJson = async (model, jsonData, object) => {
  try {
      strapi.log.info(`loading ${model} started...`);
      const dataSeed = JSON.parse(jsonData)[object];

      for await (const data of dataSeed) {
        const keys = Object.keys(data);
        for (let i = 0; i < keys.length; i++) {
          if (data[keys[i]] === "") data[keys[i]] = null;
        }
        await strapi.services[model].create(data);
      }

      strapi.log.info(`loading ${model} completed...`)
  } catch (error) {
    strapi.log.error(`error loading ${model}...`);
    strapi.log.error(error);
  }
};

const loadPageMedia = async () => {
  const fullMediaPath = rootDir + "/" + MEDIA_PATH;
  const jsonWebSitesFile = "./data/websites.json"; 
  const modelPage = "page";
  const objectPage = "page";
  const jsonPagesFile = "./data/pages.json";  
  const objectStoreURL = "https://"+ process.env.S3_ENDPOINT + "/" + process.env.S3_BUCKET

  // Load the seed data
  var jsonWebSitesData = fs.readFileSync(jsonWebSitesFile, "utf8");
  var jsonPagesData = fs.readFileSync(jsonPagesFile, "utf8");

  // Replace localhost references with objectstore URL
  if (process.env.NODE_ENV=="production")
  {
    strapi.log.info(`Objectstore URL ...${objectStoreURL}`);
    jsonWebSitesData = jsonWebSitesData.replace(/http:\\\/\\\/localhost:1337\\\/uploads/gi ,objectStoreURL);
    jsonPagesData = jsonPagesData.replace(/http:\\\/\\\/localhost:1337\\\/uploads/gi ,objectStoreURL);
  }
  else
  {
    strapi.log.info(`external URL ...${process.env.STRAPI_EXTERNAL_URL}`);
    jsonWebSitesData = jsonWebSitesData.replace(/http:\\\/\\\/localhost:1337/gi ,process.env.STRAPI_EXTERNAL_URL);
    jsonPagesData = jsonPagesData.replace(/http:\\\/\\\/localhost:1337/gi ,process.env.STRAPI_EXTERNAL_URL);
  }

  strapi.log.info("loading media files started ...");
  
  files = fs.readdirSync(fullMediaPath)
  
  // iterate through media files and upload
  for await (const file of files) {
    var filename = path.parse(file).base;
    var fileStat = fs.statSync(`${fullMediaPath}/${file}`);
    const attachment = await strapi.plugin('upload').services.upload.upload({
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
    
    //Replace files references with strapi hashed filnames
    jsonWebSitesData = jsonWebSitesData.replace(filenameWithOutHash,`${filenameWithHash}`);
    jsonPagesData = jsonPagesData.replace(filenameWithOutHash,`${filenameWithHash}`);
  };
  
  strapi.log.info("loading media files completed...");
  // Create page records
  await loadJson(modelPage,jsonPagesData,objectPage);
  // Create website records
  await loadWebsites(jsonWebSitesData);
  
};

module.exports = {
  loadPageMedia,
};
