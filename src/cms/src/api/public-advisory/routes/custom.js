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
    }
  ],
};
