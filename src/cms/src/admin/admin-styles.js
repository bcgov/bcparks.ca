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

// CKEditor content styles URL - points to Gatsby frontend
const contentStylesUrl = import.meta.env.DEV
  ? "http://localhost:8000/ckeditor-styles.css"
  : "https://bcparks.ca/ckeditor-styles.css";

const injectAdminStylesheet = (href, dataAttr) => {
  if (typeof document === "undefined") return;

  // Use a data attribute to prevent injecting the same stylesheet multiple times
  const dataAttrKey = 'data-custom-admin-styles';

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
    "bc-sans-font"
  );
  injectAdminStylesheet(
    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css",
    "font-awesome"
  );

  // Then inject CKEditor content styles
  injectAdminStylesheet(contentStylesUrl, "ckeditor-content-styles");
};
