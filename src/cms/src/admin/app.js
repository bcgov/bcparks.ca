// The admin panel can be tailored to match your branding, by editing src/admin/app
// and using an extensions folder to swap logos, favicon, locales, translations, themes, bundlers, or editors.
// https://docs.strapi.io/cms/admin-panel-customization#general-considerations

import {
  setPluginConfig,
  defaultHtmlPreset,
} from "@_sh/strapi-plugin-ckeditor";

// TODO: Upgrade CKeditor
// https://github.com/nshenderov/strapi-plugin-ckeditor/blob/master/MIGRATION.md#from-v4-to-v5
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
