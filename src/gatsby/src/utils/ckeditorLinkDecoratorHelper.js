import * as cheerio from "cheerio";
const CKEDITOR_LINK_DECORATOR_ATTRIBUTES = [
  "data-ck-link-open-in-new-tab",
  "data-ck-link-downloadable",
];

/**
 * Applies CKEditor link decorators to the given HTML.
 * Looks for links with specific data attributes, added by CKEditor's link decorators.
 * @param {string} html - The HTML content to process.
 * @returns {string} - The modified HTML with link decorators applied.
 */
export const applyCkeditorLinkDecorators = (html = "") => {
  // Skip processing if the input is not a string
  if (!html || typeof html !== "string") return html;

  // Skip processing if there are no applicable links to transform
  const hasDecoratorMarkers = CKEDITOR_LINK_DECORATOR_ATTRIBUTES.some(
    (attributeName) => html.includes(`${attributeName}="true"`),
  );

  if (!hasDecoratorMarkers) {
    return html;
  }

  // Parse the page content HTML to find all applicable links
  const $ = cheerio.load(html);
  let hasChanges = false;

  const decoratorSelectors = CKEDITOR_LINK_DECORATOR_ATTRIBUTES.map(
    (attributeName) => `a[${attributeName}="true"]`,
  ).join(", ");

  // Loop through links with applicable data attributes,
  // and add target/rel attributes as needed
  $(decoratorSelectors).each((_, link) => {
    const $link = $(link);

    // Add target="_blank" if not already present
    if (!$link.attr("target")) {
      $link.attr("target", "_blank");
      hasChanges = true;
    }

    // Add rel="noopener noreferrer" if not already present
    if (!$link.attr("rel")) {
      $link.attr("rel", "noopener noreferrer");
      hasChanges = true;
    }
  });

  // If any changes were made, return the modified HTML; otherwise, return the original HTML
  return hasChanges ? $.root().html() || html : html;
};
