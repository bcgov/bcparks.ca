// The admin panel can be tailored to match your branding, by editing src/admin/app
// https://docs.strapi.io/cms/admin-panel-customization#general-considerations

import { registerCKEditor } from "./ckeditor";
import { injectAdminStylesheets } from "./admin-styles";

// Register admin plugins
const register = async (app) => {
  await registerCKEditor(app);
};

const config = {};

const bootstrap = (_app) => {
  injectAdminStylesheets();
};

export default {
  register,
  config,
  bootstrap,
};
