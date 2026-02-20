// Blocks unauthenticated access to draft content.
// Strapi's draft/publish system allows access to drafts via ?status=draft,
// but does not restrict unauthenticated users by default.

const draftReadBlockerMiddleware = (strapi) => {
  return async (context, next) => {
    // Only apply to read actions
    if (context.action !== "findMany" && context.action !== "findOne") {
      return await next();
    }

    // Only restrict if status is set and not "published"
    const status = context.params?.status;
    if (status === undefined || status === "published") {
      return await next();
    }

    // Allow draft access for authenticated users
    const httpCtx = strapi.requestContext.get();
    const isUser = !!httpCtx?.state?.user;
    const isApiToken = httpCtx?.state?.auth?.strategy?.name === "api-token";

    if (isUser || isApiToken) {
      return await next();
    }

    // Block draft access for unauthenticated users
    strapi.log.warn(
      `draftReadBlockerMiddleware blocked ${context.action} request for ${
        context.contentType?.modelName ?? context.uid
      }`,
    );
    httpCtx.status = 403;
    httpCtx.body = {
      data: null,
      error: {
        status: 403,
        name: "ForbiddenError",
        message: "draftReadBlocker: Bearer token required",
      },
    };
    return; // Don't call next()
  };
};

module.exports = draftReadBlockerMiddleware;
