/**
 *  REST CACHE INVALIDATION (Document Services Middleware)
 *  Invalidates all rest-cache entries when any cached content changes
 */

// CONFIGURATION

const cachedCollectionTypes = [
  "api::public-advisory.public-advisory",
  "api::protected-area.protected-area",
];

const pageActions = ["create", "update", "delete", "publish", "unpublish"];

// MAIN MIDDLEWARE FUNCTION (scaffolding)

module.exports = () => {
  return async (context, next) => {
    if (
      !cachedCollectionTypes.includes(context.uid) ||
      !pageActions.includes(context.action)
    ) {
      return await next(); // Call the next middleware in the stack
    }

    strapi.log.info(
      `restCacheInvalidationMiddleware ${context.uid}->${context.action}`,
    );
    // @TODO: for bulk operations this will run once per doccument. Consider optimizing.
    await clearRestCache();

    return await next(); // Call the next middleware in the stack
  };
};

// HELPER FUNCTIONS

// This is the main workhorse function that handles the logic of clearing rest-cache entries
async function clearRestCache() {
  const cachePlugin = strapi.plugins["rest-cache"];
  if (cachePlugin) {
    for (const collectionType of cachedCollectionTypes) {
      await cachePlugin.services.cacheStore.clearByUid(collectionType);
    }
  }
}
