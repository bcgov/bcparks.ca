module.exports = {
  routes: [
    {
      method: "GET",
      path: "/public-advisory-audits/history/:advisoryNumber",
      handler: "public-advisory-audit.history",
    },
    {
      method: "GET",
      path: "/public-advisory-audits/scheduled-and-published",
      handler: "public-advisory-audit.scheduledAndPublished",
    },
  ],
};
