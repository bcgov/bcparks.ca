const cachedCollectionTypes = [
  "api::public-advisory.public-advisory",
  "api::protected-area.protected-area",
];

const pageActions = ["create", "update", "delete"];

// The middleware function
const restCacheInvalidationMiddleware = (strapi) => {
  const clearRestCache = async function () {
    const cachePlugin = strapi.plugins["rest-cache"];
    if (cachePlugin) {
      for (const collectionType of cachedCollectionTypes) {
        await cachePlugin.services.cacheStore.clearByUid(collectionType);
      }
    }
  };

  return async (context, next) => {
    if (
      !cachedCollectionTypes.includes(context.uid) ||
      !pageActions.includes(context.action)
    ) {
      return await next(); // Call the next middleware in the stack
    }

    console.log(
      `restCacheInvalidationMiddleware ${context.uid}->${context.action}`,
    );
    // @TODO: for bulk operations this will run once per doccument. Consider optimizing.
    await clearRestCache();

    return await next(); // Call the next middleware in the stack
  };
};

module.exports = restCacheInvalidationMiddleware;
