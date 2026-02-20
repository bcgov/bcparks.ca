/**
 * GraphQL Security Middleware
 *
 * NOTE: CSP is intentionally disabled for the /graphql route.
 *
 * Reasons:
 * - The Apollo landing page and embedded sandbox load assets from multiple CDNs.
 * - These currently require at least five external hosts.
 * - We do not control when Apollo adds, removes, or changes hosts.
 * - Keeping a strict CSP up to date becomes brittle and high-maintenance.
 * - This route is for developers only.
 *
 * As a result, we remove Strapi's global CSP header for /graphql
 * to ensure the developer tools function without breaking. It has been
 * replaced with a relaxed CSP in report-only mode to allow GraphQL users
 * to monitor for any issues.
 */

module.exports = () => {
  return async (ctx, next) => {
    if (ctx.path.startsWith("/graphql")) {
      // Remove the Strapi CSP for this route only
      ctx.remove("Content-Security-Policy");

      // Add a relaxed CSP in report-only mode to monitor for any issues
      ctx.set(
        "Content-Security-Policy-Report-Only",
        [
          "default-src 'self'",
          "connect-src 'self' embeddable-sandbox.cdn.apollographql.com",
          "font-src fonts.googleapis.com fonts.gstatic.com",
          "style-src 'unsafe-inline' fonts.googleapis.com",
          "frame-src sandbox.embed.apollographql.com studio.apollographql.com",
          "script-src 'unsafe-inline' embeddable-sandbox.cdn.apollographql.com",
          "img-src 'self' data: https:",
          "object-src 'none'",
        ].join("; "),
      );
    }
    await next();
  };
};
