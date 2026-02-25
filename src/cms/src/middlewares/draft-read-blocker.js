/**
 *  DRAFT READ BLOCKER (Request Middleware)
 *  Blocks unauthenticated draft access (REST + GraphQL)
 */

const { parse, visit } = require("graphql");

module.exports = () => {
  return async (ctx, next) => {
    // Only check for status query parameter
    const url = (ctx.request?.url || "").toLowerCase();
    const isGraphQL = url.startsWith("/graphql");

    // Initial lighweight checks
    if (!isGraphQL) {
      // For REST, only check read requests. Other requests require auth
      const method = (ctx.request?.method || "").toUpperCase();
      if (!["GET", "HEAD", "OPTIONS"].includes(method)) {
        return await next();
      }

      // Allow access if status is not specified or explicitly set to published
      const status = ctx.query?.status;
      if (status === undefined || status === "published") {
        return await next();
      }

      // Allow access by the Content Manager, which is for the Strapi admin UI
      const isContentManager =
        url.startsWith("/admin/content-manager") ||
        url.startsWith("/content-manager");
      if (isContentManager) {
        return await next();
      }
    }

    // Call next() to ensure ctx.request.body & ctx.state.auth are populated
    await next();

    // Allow draft access for authenticated users
    const isUser = !!ctx.state?.user;
    const isApiToken = ctx.state?.auth?.strategy?.name === "api-token";

    if (isUser || isApiToken) {
      return;
    }

    // Block draft access for unauthenticated users
    if (!isGraphQL) {
      // For REST requests
      strapi.log.warn(`draftReadBlockerMiddleware blocked REST request`);

      ctx.status = 403;
      ctx.body = {
        data: null,
        error: {
          status: 403,
          name: "ForbiddenError",
          message: "draftReadBlocker: Bearer token required",
        },
      };
      return;
    }

    // For GraphQL requests
    const body = ctx.request?.body ?? {};
    if (body && hasGraphQLArgument(body.query, "status")) {
      strapi.log.warn(`draftReadBlockerMiddleware blocked GraphQL request`);
      ctx.status = 200;
      ctx.body = {
        error: "Bad Request",
        message:
          "The parameter 'status' is not allowed in GraphQL POST payloads.",
        code: "GRAPHQL_FORBIDDEN_PARAMETER",
      };
      return;
    }
  };
};

// HELPER FUNCTIONS

// Checks if a GraphQL query string contains a specific argument
function hasGraphQLArgument(queryString, argumentName = "status") {
  if (typeof queryString !== "string" || queryString.trim() === "") {
    return false;
  }
  let found = false;
  try {
    const ast = parse(queryString);
    visit(ast, {
      Field(node) {
        if (found) return;
        if (node.arguments && node.arguments.length > 0) {
          for (const arg of node.arguments) {
            if (
              (arg?.name?.value || "").toLowerCase() ===
              argumentName.toLowerCase()
            ) {
              found = true;
              return;
            }
          }
        }
      },
    });
  } catch {
    return false;
  }
  return found;
}
