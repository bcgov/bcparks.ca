// The admin panel can be tailored to match your branding, by editing src/admin/app
// and using an extensions folder to swap logos, favicon, locales, translations, themes, bundlers, or editors.
// https://docs.strapi.io/cms/admin-panel-customization#general-considerations

import {
  setPluginConfig,
  defaultHtmlPreset,
} from "@_sh/strapi-plugin-ckeditor";

// CKEditor plugin configuration
const register = () => {
  defaultHtmlPreset.name = "default";
  setPluginConfig({ presets: [defaultHtmlPreset] });
};

const config = {};

const bootstrap = (app) => {};

export default {
  register,
  config,
  bootstrap,
};
