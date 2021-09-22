import axios from "axios";

import config from "./utils/config";

// For common config
axios.defaults.headers.post["Content-Type"] = "application/json";

const cmsAxios = axios.create({
  baseURL: config.REACT_APP_CMS_BASE_URL,
});

const apiAxios = axios.create({
  baseURL: config.REACT_APP_API_BASE_URL,
});

export { cmsAxios, apiAxios, axios };
