import axios from "axios";

// For common config
axios.defaults.headers.post["Content-Type"] = "application/json";

const cmsUrl = () => {
  if (window.REACT_APP_CMS_BASE_URL) {
    return window.REACT_APP_CMS_BASE_URL;
  } else if (process.env.REACT_APP_CMS_BASE_URL) {
    return process.env.REACT_APP_CMS_BASE_URL;
  }
};

const apiUrl = () => {
  if (window.REACT_APP_API_BASE_URL) {
    return window.REACT_APP_API_BASE_URL;
  } else if (process.env.REACT_APP_API_BASE_URL) {
    return process.env.REACT_APP_API_BASE_URL;
  }
};

const cmsAxios = axios.create({
  baseURL: "http://cms-61d198-dev.apps.silver.devops.gov.bc.ca",
});

const apiAxios = axios.create({
  baseURL: apiUrl(),
});

export { cmsAxios, apiAxios };
