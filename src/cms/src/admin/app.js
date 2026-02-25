// The admin panel can be tailored to match your branding, by editing src/admin/app
// https://docs.strapi.io/cms/admin-panel-customization#general-considerations

import { registerCKEditor } from "./extensions/ckeditor/ckeditor-config";
import { injectAdminStylesheets } from "./extensions/admin-styles/admin-styles";

// Register admin plugins and customizations here.

// register() hook runs before the app is initialized
const register = async (app) => {
  await registerCKEditor(app);
};

const config = {};

// bootstrap() hook runs after the app is initialized, before the server starts
const bootstrap = (_app) => {
  injectAdminStylesheets();
};

export default {
  register,
  config,
  bootstrap,
};
