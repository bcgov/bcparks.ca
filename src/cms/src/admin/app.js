// The admin panel can be tailored to match your branding, by editing src/admin/app
// and using an extensions folder to swap logos, favicon, locales, translations, themes, bundlers, or editors.
// https://docs.strapi.io/cms/admin-panel-customization#general-considerations

import {
  setPluginConfig,
  defaultHtmlPreset,
  defaultTheme,
} from "@_sh/strapi-plugin-ckeditor";

// CKEditor content styles - imported from Gatsby frontend
const contentStyles = `@import url('https://bcparks.ca/ckeditor-styles.css');`;
const contentStylesDev = `@import url('http://localhost:8000/ckeditor-styles.css');`;

// CKEditor plugin configuration
const register = () => {
  // Use the theme configuration to apply content styles globally
  const customTheme = {
    ...defaultTheme,
    // Apply content styles that match the frontend (dev vs prod)
    additional: import.meta.env.DEV ? contentStylesDev : contentStyles,
  };

  // Customize the default preset to show specific toolbar options and heading levels
  const customPreset = {
    ...defaultHtmlPreset,
    name: "default",
    editorConfig: {
      ...defaultHtmlPreset.editorConfig,

      toolbar: ['heading', '|', 'bold', 'italic', 'underline', '|', 'link', 'strapiMediaLib', '|', 'numberedList', 'bulletedList', '|', 'horizontalLine', 'blockQuote', 'insertTable', 'mediaEmbed', '|', 'removeFormat', 'sourceEditing'],

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

      mediaEmbed: {
        // Show the embedded media in the editor instead of a placeholder
        previewsInData: true
      },

      link: {
        defaultProtocol: 'https://',

        // Configure the link toolbar to include linkProperties for manual decorators
        toolbar: [ 'linkPreview', '|', 'editLink', 'linkProperties', 'unlink' ],

        decorators: {
          // Manual decorator for opening links in a new tab
          openInNewTab: {
            mode: "manual",
            label: "Open in a new tab",
            defaultValue: false,
            attributes: {
              target: "_blank",
              rel: "noopener",
            },
          },

          // Manual decorator for "learn more" link style
          makeLinkWithIcon: {
            mode: 'manual',
            label: 'Learn more link',
            classes: 'learn-more-link'
          },

          // Manual decorator for primary button style
          makeButton: {
            mode: 'manual',
            label: 'Primary button',
            classes: 'btn btn-primary',
            attributes: {
                role: "button"
            }
          },

          // Manual decorator for secondary button style
          makeSecondaryButton: {
            mode: 'manual',
            label: 'Secondary button',
            classes: 'btn btn-secondary',
            attributes: {
              role: "button"
            }
          },

          // Automatically add target _blank and noopener for PDF links
          detectDownloadable: {
            mode: 'automatic',
            callback: url => url.endsWith( '.pdf' ),
            attributes: {
              target: "_blank",
              rel: "noopener",
            }
          },
        },
      },
    }
  };

  setPluginConfig({
    presets: [customPreset],
    theme: customTheme,
  });
};

const config = {};

const bootstrap = (app) => {};

export default {
  register,
  config,
  bootstrap,
};
