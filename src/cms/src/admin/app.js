// TODO: Upgrade CKeditor
// https://github.com/nshenderov/strapi-plugin-ckeditor/blob/master/MIGRATION.md#from-v4-to-v5

import {
  setPluginConfig,
  defaultHtmlPreset,
} from "@_sh/strapi-plugin-ckeditor";

export default {
  register() {
    defaultHtmlPreset.name = "default";
    setPluginConfig({ presets: [defaultHtmlPreset] });
  },
};

// import ckeditor5Dll from "ckeditor5/build/ckeditor5-dll.js";
// import ckeditor5MrkdownDll from "@ckeditor/ckeditor5-markdown-gfm/build/markdown-gfm.js";

// const config = {};

// const bootstrap = (app) => { };

// export default {
//   config,
//   bootstrap,
// };
