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
    const configPublicPath = strapi.config.get(
      "middleware.settings.public.path",
      strapi.config.paths.static
    );

    const uploadDir = path.resolve(strapi.dir, configPublicPath);
    const uploadPath = path.join(uploadDir, config.path);

    return {
      upload(file) {
        verifySize(file);

        return new Promise((resolve, reject) => {
          // write file in custom folder
          fs.writeFile(
            path.join(uploadPath, `${file.hash}${file.ext}`),
            file.buffer,
            (err) => {
              if (err) {
                return reject(err);
              }

              file.url = path.join(uploadPath, `${file.hash}${file.ext}`);

              resolve();
            }
          );
        });
      },
      delete(file) {
        return new Promise((resolve, reject) => {
          const filePath = path.join(uploadPath, `${file.hash}${file.ext}`);

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
