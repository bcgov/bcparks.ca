'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async search (ctx, next) {
    console.log("CTX body:", ctx.request.body);
    let queryObj = {};
    let obj = ctx.request.body;

    if (obj.camping !== undefined) {
      queryObj['camping'] = obj.camping;
    }
    if (obj.petFriendly !== undefined) {
      queryObj['petFriendly'] = obj.petFriendly;
    }
    if (obj.wheelchair !== undefined) {
      queryObj['wheelchair'] = obj.wheelchair;
    }
    if (obj.marine !== undefined) {
      queryObj['marine'] = obj.marine;
    }
    if (obj.ecoReserve !== undefined) {
      queryObj['ecoReserve'] = obj.ecoReserve;
    }
    if (obj.electricalHookup !== undefined) {
      queryObj['electricalHookup'] = obj.electricalHookup;
    }
    let activities = [];
    let facilities = [];
    if (obj.selectedActivities && obj.selectedActivities.length > 0) {
      obj.selectedActivities.forEach(item => {
        activities.push(item.label)
      })
      queryObj = { ...queryObj, parkactivities_contains: activities }
    }
    if (obj.selectedFacilities && obj.selectedFacilities.length > 0) {
      obj.selectedFacilities.forEach(item => {
        facilities.push(item.label)
      })
      queryObj = { ...queryObj, parkfacilities_contains: facilities };
    }

    // No limit, TODO: Sort/pagination server-side.
    queryObj['_limit'] = -1;
    console.log("obj.searchText:", obj.searchText);

    if (obj.searchText === '' || obj.searchText === undefined) {
      console.log("Standard searching.");
      console.log("QueryObj:", queryObj);
      // No keyword, so we can use standard property filtering.
      return await strapi.query("search-view").find(queryObj);
    } else {
      console.log("SearchText mode.");
      // TODO: Tokenize the 3 fields here into a search table that gets indexed and queried instead of
      // using horrible LIKE %text% SQL, as performance will suffer.  For now, will work to wire up the
      // front end to live back-end data.

      // TODO Fix the data model work so that these are flagged appropriately based on their park activities.
      const knex = strapi.connections[strapi.config.database.defaultConnection];
      return await knex('search_view')
                        .where((builder) =>
                          builder.where('protectedAreaName', 'like', `%${obj.searchText}%`)
                                  .orWhere('locationNotes', 'like', `%${obj.searchText}%`)
                                  .orWhere('parkactivities', 'like', `%${obj.searchText}%`)
                        )
                        .modify(function (queryBuilder) {
                          if (obj.camping) {
                            queryBuilder.andWhere('camping', '=', 1)
                          }
                        })
                        .modify(function (queryBuilder) {
                          if (obj.petFriendly) {
                            queryBuilder.andWhere('petFriendly', '=', 1)
                          }
                        })
                        .modify(function (queryBuilder) {
                          if (obj.wheelchair) {
                            queryBuilder.andWhere('wheelchair', '=', 1)
                          }
                        })
                        .modify(function (queryBuilder) {
                          if (obj.marine) {
                            queryBuilder.andWhere('marine', '=', 1)
                          }
                        })
                        .modify(function (queryBuilder) {
                          if (obj.ecoReserve) {
                            queryBuilder.andWhere('ecoReserve', '=', 1)
                          }
                        })
                        .modify(function (queryBuilder) {
                          if (obj.electricalHookup) {
                            queryBuilder.andWhere('electricalHookup', '=', 1)
                          }
                        })
    }
  }
};
