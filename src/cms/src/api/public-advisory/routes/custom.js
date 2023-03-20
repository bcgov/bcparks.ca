module.exports = {
  routes: [
    {
      method: "GET",
      path: "/public-advisories/count",
      handler: "public-advisory.count",
    },
  ],
};
