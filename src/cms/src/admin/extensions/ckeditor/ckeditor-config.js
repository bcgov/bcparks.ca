/**
 * Strapi Admin (v5) CKEditor configuration
 *
 * This module centralizes all configuration for the @_sh/strapi-plugin-ckeditor
 * custom field:
 * - Defines the CKEditor preset (toolbar, headings, link decorators, etc.)
 * - Applies WYSIWYG content styles by fetching `ckeditor-styles.css` from the
 *   Gatsby frontend and injecting it into the editor
 * - Adds a few targeted theme overrides to keep content readable when the
 *   editor canvas is forced to white (while still respecting Strapi light/dark)
 *
 * Called from `src/admin/app.js` during the admin panel `register` lifecycle.
 */
import {
  setPluginConfig,
  defaultHtmlPreset,
  defaultTheme,
} from "@_sh/strapi-plugin-ckeditor";

import { lightTheme } from "@strapi/design-system";

export const registerCKEditor = async (_app) => {
  const customTheme = {
    // Dark-only fixes: extend the plugin's dark theme rather than applying these globally.
    dark: [
      defaultTheme.dark,
      `
        /* Link context-toolbar preview text needs higher contrast in dark mode */
        a.ck.ck-button.ck-link-toolbar__preview {
          color: ${lightTheme.colors.primary200} !important;
        }
      `,
    ],

    // Override CKEditor's built-in styles
    additional: `
      /* Content styles are loaded into the admin panel via <link> in admin-styles.js */

      /*
        Keep CKEditor aligned with Strapi's theme (light/dark), but force a
        white content canvas for WYSIWYG parity with the public site.
      */

      /* Ensure white background and dark text in the editable content area */
      .ck.ck-content.ck-editor__editable,
      .ck.ck-editor__main > .ck.ck-content.ck-editor__editable {
        background-color: #fff !important;
        color: #1a1a1a !important;
        font-size: 16px;
        line-height: 1.6;
        font-family: "BC Sans", sans-serif;
        font-weight: 400;
      }

      /* Selected link highlight: keep the light-mode highlight on the white canvas */
      .ck {
        --ck-color-link-selected-background: ${lightTheme.colors.primary200} !important;
        --ck-color-link-fake-selection: ${lightTheme.colors.primary200} !important;
      }
    `,
  };

  const customPreset = {
    ...defaultHtmlPreset,
    name: "default",
    editorConfig: {
      ...defaultHtmlPreset.editorConfig,

      // Remove color controls from the text-selection popup (balloon toolbar).
      // We only allow branded colors via predefined styles/classes.
      balloonToolbar: (
        defaultHtmlPreset.editorConfig.balloonToolbar || []
      ).filter(
        (item) => item !== "fontColor" && item !== "fontBackgroundColor"
      ),

      toolbar: [
        "heading",
        "style",
        "|",
        "bold",
        "italic",
        "underline",
        "|",
        "link",
        "strapiMediaLib",
        "|",
        "numberedList",
        "bulletedList",
        "|",
        "horizontalLine",
        "blockQuote",
        "insertTable",
        "mediaEmbed",
        "|",
        "removeFormat",
        "sourceEditing",
      ],

      heading: {
        options: [
          {
            model: "paragraph",
            title: "Paragraph",
            class: "ck-heading_paragraph",
          },
          {
            model: "heading3",
            view: "h3",
            title: "Heading 3",
            class: "ck-heading_heading3",
          },
          {
            model: "heading4",
            view: "h4",
            title: "Heading 4",
            class: "ck-heading_heading4",
          },
        ],
      },

      list: {
        properties: {
          styles: false,
        },
      },

      style: {
        definitions: [
          {
            name: "Callout box",
            element: "blockquote",
            classes: ["callout-box"],
          },
          {
            name: "Legacy link",
            element: "a",
            classes: ["legacy-link"],
          },
          {
            name: "Audio clip",
            element: "div",
            classes: ["audio-clip"],
          },
        ],
      },

      mediaEmbed: {
        previewsInData: true,
      },

      link: {
        defaultProtocol: "https://",

        toolbar: ["linkPreview", "|", "editLink", "linkProperties", "unlink"],

        decorators: {
          openInNewTab: {
            mode: "manual",
            label: "Open in a new tab",
            defaultValue: false,
            attributes: {
              target: "_blank",
              rel: "noopener",
            },
          },

          makeLinkWithIcon: {
            mode: "manual",
            label: "Learn more link",
            classes: "learn-more-link",
          },

          makeButton: {
            mode: "manual",
            label: "Primary button",
            classes: "btn btn-primary",
            attributes: {
              role: "button",
            },
          },

          makeSecondaryButton: {
            mode: "manual",
            label: "Secondary button",
            classes: "btn btn-secondary",
            attributes: {
              role: "button",
            },
          },

          detectDownloadable: {
            mode: "automatic",
            callback: (url) => url.endsWith(".pdf"),
            attributes: {
              target: "_blank",
              rel: "noopener",
            },
          },
        },
      },
    },
  };

  setPluginConfig({
    presets: [customPreset],
    theme: customTheme,
  });
};
