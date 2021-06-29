const mime = require("mime-types");
const fs = require("fs");

const http = require("http");
const https = require("https");

var Stream = require("stream").Transform;

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

const loadPhoto = async () => {
  const rootDir = process.cwd();
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
