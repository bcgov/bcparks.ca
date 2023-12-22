module.exports = {
  routes: [
    {
      method: "GET",
      path: "/public-advisories/count",
      handler: "public-advisory.count",
    },
    {
      method: "GET",
      path: "/public-advisories/items",
      handler: "public-advisory.items",
    },
    {
      method: "GET",
      path: "/public-advisories/access-statuses",
      handler: "public-advisory.getAccessStatusesByProtectedArea",
    }
  ],
};
