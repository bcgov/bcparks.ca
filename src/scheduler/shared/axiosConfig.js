const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config({
  path: `.env`,
});

const cmsAxios = axios.create({
  baseURL: process.env.STRAPI_BASE_URL,
  headers: {
    common: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + process.env.STRAPI_API_TOKEN,
    },
  },
  rejectUnauthorized: false,
});

module.exports = {
  cmsAxios,
};
