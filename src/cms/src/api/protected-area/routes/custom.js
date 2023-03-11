module.exports = {
  routes: [
    {
      method: "GET",
      path: "/protected-areas/count",
      handler: "protected-area.count",
    },
    {
      method: "GET",
      path: "/protected-areas/items",
      handler: "protected-area.items",
    },
    {
      method: "GET",
      path: "/protected-areas/status",
      handler: "protected-area.status",
    },
  ],
};
