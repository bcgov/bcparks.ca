/**
 * Strapi Admin Stylesheet Injection
 *
 * This module handles injecting external stylesheets into the admin panel:
 * - BC Sans font (for branded typography)
 * - Font Awesome (for icons used in CKEditor custom styles)
 * - CKEditor content styles (from Gatsby frontend for WYSIWYG parity)
 *
 * Called from `src/admin/app.js` during the admin panel `bootstrap` lifecycle.
 */

/**
 * Reads environment variables to return the URL of the Gatsby frontend.
 *
 * @param {Object} env - Environment variables object
 * @returns {string} The URL of the Gatsby frontend.
 */
export function getGatsbyUrl(env) {
  const { DEV, STRAPI_ADMIN_ENVIRONMENT } = env ?? {};

  // For local development, use the Gatsby development server URL
  if (DEV || STRAPI_ADMIN_ENVIRONMENT === "local") {
    return "http://localhost:8000";
  }

  // For dev and test environments, use the environment-specific URL
  // (e.g. https://alpha-test.bcparks.ca)
  if (STRAPI_ADMIN_ENVIRONMENT) {
    return `https://${STRAPI_ADMIN_ENVIRONMENT}.bcparks.ca`;
  }

  // Use the production URL, or fall back to the production URL if
  // STRAPI_ADMIN_ENVIRONMENT is undefined
  return "https://bcparks.ca";
}

// CKEditor content styles URL - points to Gatsby frontend
const editorStylesUrl = `${getGatsbyUrl(import.meta.env)}/ckeditor-styles.css`;

const injectAdminStylesheet = (href, dataAttr) => {
  if (typeof document === "undefined") return;

  // Use a data attribute to prevent injecting the same stylesheet multiple times
  const dataAttrKey = "data-custom-admin-styles";

  const existing = document.querySelector(`link[${dataAttrKey}="${dataAttr}"]`);
  if (existing) return;

  const link = document.createElement("link");
  link.setAttribute("rel", "stylesheet");
  link.setAttribute("href", href);
  link.setAttribute(dataAttrKey, dataAttr);
  document.head.appendChild(link);
};

export const injectAdminStylesheets = () => {
  // Inject font dependencies first
  injectAdminStylesheet(
    "https://cdn.jsdelivr.net/npm/@bcgov/bc-sans@2.1.0/css/BC_Sans.min.css",
    "bc-sans-font",
  );
  injectAdminStylesheet(
    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css",
    "font-awesome",
  );

  // Then inject CKEditor content styles
  injectAdminStylesheet(editorStylesUrl, "ckeditor-content-styles");
};
