// The admin panel can be tailored to match your branding, by editing src/admin/app
// and using an extensions folder to swap logos, favicon, locales, translations, themes, bundlers, or editors.
// https://docs.strapi.io/cms/admin-panel-customization#general-considerations

import {
  setPluginConfig,
  defaultHtmlPreset,
} from "@_sh/strapi-plugin-ckeditor";

// CKEditor plugin configuration
const register = () => {
  // Customize the default preset to show specific toolbar options and heading levels
  const customPreset = {
    ...defaultHtmlPreset,
    name: "default",
    editorConfig: {
      ...defaultHtmlPreset.editorConfig,

      toolbar: ['heading', '|', 'bold', 'italic', 'underline', '|', 'link', '|', 'numberedList', 'bulletedList', '|', 'horizontalLine', 'blockQuote', 'insertTable', '|', 'removeFormat', 'sourceEditing'],

      heading: {
        options: [
          { model: "paragraph", title: "Paragraph", class: "ck-heading_paragraph" },
          { model: "heading3", view: "h3", title: "Heading 3", class: "ck-heading_heading3" },
          { model: "heading4", view: "h4", title: "Heading 4", class: "ck-heading_heading4" },
        ],
      },
      list: {
        // Hide dropdown for alternate list styles
        properties: {
          styles: false
        }
      },
    }
  };

  setPluginConfig({ presets: [customPreset] });
};

const config = {};

const bootstrap = (app) => {};

export default {
  register,
  config,
  bootstrap,
};
