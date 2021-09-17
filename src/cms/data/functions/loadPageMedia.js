const mime = require("mime-types");
const fs = require("fs");
const request = require("request");
const path = require("path");

const rootDir = process.cwd();
const MEDIA_PATH = "media_uploads";

const loadJson = (model, jsonData, object) => {
  try {

      strapi.log.info(`loading ${model} started...`);
      const dataSeed = JSON.parse(jsonData)[object];

      dataSeed.forEach( (data) => {
        const keys = Object.keys(data);
        for (let i = 0; i < keys.length; i++) {
          if (data[keys[i]] === "") data[keys[i]] = null;
        }

        strapi.services[model].create(data);
        
      });
      strapi.log.info(`loading ${model} completed...`)

  } catch (error) {
    strapi.log.error(`error loading ${model}...`);
    strapi.log.error(error);
  }
};

const loadPageMedia = async () => {
  const fullMediaPath = rootDir + "/" + MEDIA_PATH;
  const modelWebSite = "website";
  const objectWebsite = "website";
  const jsonWebSitesFile = "./data/websites.json"; 
  const modelPage = "page";
  const objectPage = "page";
  const jsonPagesFile = "./data/pages.json";  

  // Load the seed data
  var jsonWebSitesData = fs.readFileSync(jsonWebSitesFile, "utf8");
  var jsonPagesData = fs.readFileSync(jsonPagesFile, "utf8");

  // Replace localhost references
  strapi.log.info(`external URL ...${process.env.STRAPI_EXTERNAL_URL}`);
  jsonWebSitesData = jsonWebSitesData.replace(/http:\\\/\\\/localhost:1337/gi ,process.env.STRAPI_EXTERNAL_URL);
  jsonPagesData = jsonPagesData.replace(/http:\\\/\\\/localhost:1337/gi ,process.env.STRAPI_EXTERNAL_URL);

  strapi.log.info("loading media files started ...");
  
  files = fs.readdirSync(fullMediaPath)
  
  // iterate through media files and upload
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
    
    //Replace files references with strapi hashed filnames
    jsonWebSitesData = jsonWebSitesData.replace(filenameWithOutHash,`${filenameWithHash}`);
    jsonPagesData = jsonPagesData.replace(filenameWithOutHash,`${filenameWithHash}`);


  };
  
  
  strapi.log.info("loading media files completed...");
  loadJson(modelPage,jsonPagesData,objectPage); 
  loadJson(modelWebSite,jsonWebSitesData,objectWebsite);
  
};

module.exports = {
  loadPageMedia,
};
