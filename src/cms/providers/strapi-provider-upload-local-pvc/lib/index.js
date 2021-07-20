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

    const pvcDir = path.resolve("\\" + config.path);

    return {
      upload(file) {
        verifySize(file);

        return new Promise((resolve, reject) => {
          fs.writeFile(
            path.join(uploadDir, `/uploads/${file.hash}${file.ext}`),
            file.buffer,
            (err) => {
              if (err) {
                return reject(err);
              }
              file.url = `/uploads/${file.hash}${file.ext}`;
              resolve();
            }
          );
          // write file in custom folder
          fs.writeFile(
            path.join(pvcDir, `/uploads/${file.hash}${file.ext}`),
            file.buffer,
            (err) => {
              if (err) {
                return reject(err);
              }
              file.url = `/uploads/${file.hash}${file.ext}`;
              resolve();
            }
          );
        });
      },
      delete(file) {
        return new Promise((resolve, reject) => {
          const filePath = path.join(
            uploadDir,
            `/uploads/${file.hash}${file.ext}`
          );
          const pcvPath = path.join(pvcDir, `/uploads/${file.hash}${file.ext}`);

          if (!fs.existsSync(filePath)) {
            return resolve("File doesn't exist");
          }

          // remove file from public/uploads folder
          fs.unlink(filePath, (err) => {
            if (err) {
              return reject(err);
            }
            resolve();
          });

          fs.unlink(pcvPath, (err) => {
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
