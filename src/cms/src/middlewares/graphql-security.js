/**
 *  GRAPHQL SECURITY (Request Middleware)
 *  Overrides Strapi CSP for GraphQL developer tools
 */

module.exports = (_config, { strapi }) => {
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
