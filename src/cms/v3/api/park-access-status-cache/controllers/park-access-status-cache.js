"use strict";

module.exports = {
  async find(ctx) {
    console.log("Park access status cache find:", ctx);
    return strapi.services["park-access-status-cache"].find({ _limit: 1200 });
  },
};
