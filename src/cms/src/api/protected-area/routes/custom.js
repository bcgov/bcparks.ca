module.exports = {
  routes: [
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
    {
      method: "GET",
      path: "/park-access-statuses",
      handler: "protected-area.status",
    },
    {
      method: "GET",
      path: "/protected-areas/search",
      handler: "protected-area.searchParks",
    },
    {
      method: "GET",
      path: "/protected-areas/searchnames",
      handler: "protected-area.autocomplete",
    },
  ],
};
