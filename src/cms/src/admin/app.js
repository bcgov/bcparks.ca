// The admin panel can be tailored to match your branding, by editing src/admin/app
// and using an extensions folder to swap logos, favicon, locales, translations, themes, bundlers, or editors.
// https://docs.strapi.io/cms/admin-panel-customization#general-considerations

import { Plugin } from "ckeditor5";
import {
  setPluginConfig,
  defaultHtmlPreset,
} from "@_sh/strapi-plugin-ckeditor";

// Custom plugin to load frontend content styles into the editor
class ContentStyles extends Plugin {
  static get pluginName() {
    return 'ContentStyles';
  }

  init() {
    const editor = this.editor;
    // Determine Gatsby URL based on environment
    const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const gatsbyUrl = isDevelopment ? 'http://localhost:8000' : 'https://bcparks.ca';
    const contentStylesUrl = `${gatsbyUrl}/ckeditor-styles.css`;

    // Wait for editor to be ready, then inject the stylesheet
    editor.on('ready', () => {
      const editableElement = editor.editing.view.document.getRoot();
      if (editableElement) {
        // Find the editable DOM element
        const domEditableElement = editor.ui.view.editable.element;
        if (domEditableElement) {
          // Create and inject a link tag for our styles
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = contentStylesUrl;
          link.setAttribute('data-cke-custom-styles', 'true');

          // Insert into the same document as the editor
          const targetDocument = domEditableElement.ownerDocument;
          if (!targetDocument.querySelector(`link[href="${contentStylesUrl}"]`)) {
            targetDocument.head.appendChild(link);
          }

          // Also set the background color directly on the editable element
          domEditableElement.style.backgroundColor = '#fff';
          domEditableElement.style.color = '#1a1a1a';
        }
      }
    });
  }
}

// CKEditor plugin configuration
const register = () => {
  // Customize the default preset to show specific toolbar options and heading levels
  const customPreset = {
    ...defaultHtmlPreset,
    name: "default",
    // Override editor styles to ensure white background
    styles: `
      .ck.ck-content.ck-editor__editable {
        background-color: #fff !important;
        color: #1a1a1a !important;
      }
    `,
    editorConfig: {
      ...defaultHtmlPreset.editorConfig,

      plugins: [
        ...defaultHtmlPreset.editorConfig.plugins,
        ContentStyles, // Add our custom content styles plugin
      ],

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

  setPluginConfig({ presets: [customPreset] });
};

const config = {};

const bootstrap = (app) => {};

export default {
  register,
  config,
  bootstrap,
};
