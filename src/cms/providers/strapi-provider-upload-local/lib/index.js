"use strict";

/**
 * Module dependencies
 */

// Public node modules.
const fs = require("fs");
const path = require("path");
const { errors } = require("strapi-plugin-upload");

module.exports = {
  init(config) {
    const verifySize = (file) => {
      if (file.size > config.sizeLimit) {
        throw errors.entityTooLarge();
      }
    };

    const uploadDir = path.resolve("\\" + config.path);
    console.log(uploadDir);

    return {
      upload(file) {
        verifySize(file);

        return new Promise((resolve, reject) => {
          // write file in custom folder
          fs.writeFile(
            path.join(uploadDir, `${file.hash}${file.ext}`),
            file.buffer,
            (err) => {
              if (err) {
                return reject(err);
              }

              file.url = path.join(uploadDir, `${file.hash}${file.ext}`);

              resolve();
            }
          );
        });
      },
      delete(file) {
        return new Promise((resolve, reject) => {
          const filePath = path.join(uploadDir, `${file.hash}${file.ext}`);

          if (!fs.existsSync(filePath)) {
            return resolve("File doesn't exist");
          }

          // remove file from public/assets folder
          fs.unlink(filePath, (err) => {
            if (err) {
              return reject(err);
            }

            resolve();
          });
        });
      },
    };
  },
};
