const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config({
  path: `.env`,
});

const cmsAxios = axios.create({
  baseURL: process.env.STRAPI_BASE_URL,
  headers: {
    post: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + process.env.STRAPI_API_TOKEN,
    },
    get: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + process.env.STRAPI_API_TOKEN,
    },
    put: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + process.env.STRAPI_API_TOKEN,
    },
    delete: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + process.env.STRAPI_API_TOKEN,
    },
  },
  rejectUnauthorized: false,
});

module.exports = {
  cmsAxios,
};
