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
 * Maps CMS hostnames to their corresponding Gatsby frontend URLs.
 * Determines the frontend URL at runtime based on the current hostname.
 *
 * @returns {string} The URL of the Gatsby frontend.
 */
export function getGatsbyUrl() {
  // Get Strapi's hostname
  const hostname = typeof window !== "undefined"
    ? window.location.hostname
    : "bcparks.ca";

  // Map CMS subdomains to frontend subdomains
  const hostnameMap = new Map([
    ["localhost", "http://localhost:8000"],
    ["cms.bcparks.ca", "https://bcparks.ca"],
    ["alpha-dev-cms.bcparks.ca", "https://alpha-dev.bcparks.ca"],
    ["alpha-test-cms.bcparks.ca", "https://alpha-test.bcparks.ca"],
    ["dev-cms.bcparks.ca", "https://dev.bcparks.ca"],
    ["test-cms.bcparks.ca", "https://test.bcparks.ca"],
  ]);

  // Return mapped URL or default to production
  return hostnameMap.get(hostname) || "https://bcparks.ca";
}

// CKEditor content styles URL - points to Gatsby frontend
const editorStylesUrl = `${getGatsbyUrl()}/ckeditor-styles.css`;

const injectAdminStylesheet = (href, dataAttr, integrity = null) => {
  if (typeof document === "undefined") return;

  // Use a data attribute to prevent injecting the same stylesheet multiple times
  const dataAttrKey = "data-custom-admin-styles";

  const existing = document.querySelector(`link[${dataAttrKey}="${dataAttr}"]`);
  if (existing) return;

  const link = document.createElement("link");
  link.setAttribute("rel", "stylesheet");
  if (integrity) {
    link.setAttribute("integrity", integrity);
    link.setAttribute("crossorigin", "anonymous");
  }
  link.setAttribute("href", href);
  link.setAttribute(dataAttrKey, dataAttr);
  document.head.appendChild(link);
};

export const injectAdminStylesheets = () => {
  // Inject font dependencies first
  injectAdminStylesheet(
    "https://cdn.jsdelivr.net/npm/@bcgov/bc-sans@2.1.0/css/BC_Sans.min.css",
    "bc-sans-font",
    "sha384-AK+SldBmwNGzhuCscvxxZx4O0hDR2M5z5BdD8NSOAeWyVzRHMXINWpTiBjt9gM2+",
  );
  injectAdminStylesheet(
    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css",
    "font-awesome",
    "sha384-DyZ88mC6Up2uqS4h/KRgHuoeGwBcD4Ng9SiP4dIRy0EXTlnuz47vAwmeGwVChigm",
  );

  // Then inject CKEditor content styles
  injectAdminStylesheet(editorStylesUrl, "ckeditor-content-styles");
};
