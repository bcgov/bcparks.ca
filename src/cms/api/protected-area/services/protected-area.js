"use strict";

module.exports = {
  // custom route for light weight park details used in client app
  async items() {
    const results = await strapi.query("protected-area").find(
      {
        _limit: -1,
        _sort: "protectedAreaName",
      },
      ["id", "orcs", "protectedAreaName"]
    );
    return results;
  },
  // custom route for park id and name only
  async names(ctx) {
    let entities;
    if (ctx.query._q) {
      entities = await strapi
        .query("protected-area")
        .search(ctx.query, [
          "id",
          "orcs",
          "type",
          "typeCode",
          "protectedAreaName",
        ]);
    } else {
      entities = await strapi
        .query("protected-area")
        .find(ctx.query, [
          "id",
          "orcs",
          "type",
          "typeCode",
          "protectedAreaName",
        ]);
    }
    return entities;
  },
  /*
   * Park search handling
   *
   * Protected area search is used for the main parks search page on the frontend.
   * It uses some complex filters and Postgres full text search to achieve this.
   *
   * Full text indexes and the search_text column are created automatically during
   * bootstrap.
   */
  async search({
    searchText,
    typeCode,
    camping,
    marineProtectedArea,
    activityTypeIds,
    facilityTypeIds,
    sortCol,
    sortDesc,
    limit,
    offset,
  }) {
    const knex = strapi.connections[strapi.config.database.defaultConnection];

    // Load open access status ids
    const openAccessStatus = await strapi
      .query("access-status")
      .model.query((query) => {
        query.where("accessStatus", "ILIKE", "%open%");
      })
      .fetch();

    // Check park access status. If the park has any advisories
    // with access status set and not equal to "open" then it is closed.
    // TODO: will likely be replaced with the access status text.
    let isOpenToPublicSelect;
    if (openAccessStatus) {
      isOpenToPublicSelect = knex.raw(
        `bool_and(
          CASE
            WHEN public_advisories."accessStatus" IS NULL THEN TRUE
            WHEN public_advisories."accessStatus" = ? THEN TRUE
            ELSE FALSE
          END) AS "isOpenToPublic"`,
        [openAccessStatus.id]
      );
    } else {
      isOpenToPublicSelect = knex.raw('TRUE AS "isOpenToPublic"');
    }

    const results = strapi.query("protected-area").model.query((query) => {
      query
        .select(
          "protected_areas.*",
          // Include all advisories, filtering out nulls caused by joins.
          knex.raw(
            'to_json(array_remove(array_agg(DISTINCT ?? ORDER BY ??), NULL)) AS "advisories"',
            ["public_advisories.*", "public_advisories.*"]
          ),
          // Include all active park photos. Ordering is by featured first,
          // then sort order, then most recently taken first (as a fallback
          // for cases where the order is not specified).
          // Only includes the first 6 photos, as a some parks may have large galleries
          knex.raw(
            `array(
              SELECT "thumbnailUrl"
              FROM park_photos
              WHERE park_photos.orcs = protected_areas.orcs
                  AND park_photos."isActive" = TRUE
                  AND park_photos."thumbnailUrl" IS NOT NULL
              ORDER BY park_photos."isFeatured" DESC NULLS LAST,
              	  park_photos."sortOrder" ASC NULLS LAST,
              	  park_photos."dateTaken" DESC,
                  park_photos."id" DESC
              LIMIT 6
            ) AS "parkPhotos"`
          ),
          // Check all associated park operations rows, and set hasReservations
          // if any are true
          knex.raw(
            'bool_or(park_operations."hasReservations") AS "hasReservations"'
          ),
          isOpenToPublicSelect
        )
        .leftJoin(
          "park_activities",
          "protected_areas.id",
          "park_activities.protectedArea"
        )
        .leftJoin(
          "park_facilities",
          "protected_areas.id",
          "park_facilities.protectedArea"
        )
        .leftJoin(
          "facility_types",
          "park_facilities.facilityType",
          "facility_types.id"
        )
        .leftJoin(
          "public_advisories__protected_areas",
          "protected_areas.id",
          "public_advisories__protected_areas.protected-area_id"
        )
        .leftJoin(
          "public_advisories",
          "public_advisories__protected_areas.public_advisory_id",
          "public_advisories.id"
        )
        .leftJoin(
          "park_operations",
          "protected_areas.orcs",
          "park_operations.orcs"
        )
        .groupBy("protected_areas.id");

      // Only include published & displayed parks
      query.whereNotNull("protected_areas.published_at");
      query.where("protected_areas.isDisplayed", true);

      if (typeCode) {
        query.where("protected_areas.typeCode", typeCode);
      }
      if (marineProtectedArea) {
        query.where("protected_areas.marineProtectedArea", marineProtectedArea);
      }
      if (camping) {
        query.where("facility_types.facilityName", "ILIKE", "%camping%");
      }

      if (searchText) {
        // Run a full text match on our indexed search text column
        // and the description columns of park_activities and park_facilities
        // Any match here counts.
        query.where((builder) => {
          builder.where(
            knex.raw(
              "protected_areas.search_text @@ websearch_to_tsquery('english', ?)",
              [searchText]
            )
          );
          builder.orWhere(
            knex.raw(
              `setweight(to_tsvector('english', park_activities.description), 'D') @@ websearch_to_tsquery('english', ?)`,
              [searchText]
            )
          );
          builder.orWhere(
            knex.raw(
              `setweight(to_tsvector('english', park_facilities.description), 'D') @@ websearch_to_tsquery('english', ?)`,
              [searchText]
            )
          );
        });
      }

      if (activityTypeIds.length > 0) {
        // check if the aggregated array of all activity type ids for the park
        // contains ALL of the activity type ids we're searching for
        query.havingRaw('array_agg(park_activities."activityType") @> ?', [
          activityTypeIds,
        ]);
      }
      if (facilityTypeIds.length > 0) {
        // check if the aggregated array of all facility type ids for the park
        // contains ALL of the facility type ids we're searching for
        query.havingRaw('array_agg(park_facilities."facilityType") @> ?', [
          facilityTypeIds,
        ]);
      }

      if (sortCol === "protectedAreaName" && sortDesc) {
        query.orderBy("protectedAreaName", "DESC");
      } else if (sortCol === "protectedAreaName" && !sortDesc) {
        query.orderBy("protectedAreaName", "ASC");
      } else if (sortCol === "rank" && sortDesc && searchText) {
        // if we're sorting by relevance, add a rank column to the query
        // and sort by it. Rank is combined from the search_text on protected_areas
        // (which is a generated column that combines a few fields with weights)
        // and the park activities and facilities descriptions.
        query.select(
          knex.raw(
            `ts_rank(protected_areas.search_text, websearch_to_tsquery('english', ?)) +
             coalesce(max(ts_rank(setweight(to_tsvector('english', park_activities.description), 'D'), websearch_to_tsquery('english', ?))), 0) +
             coalesce(max(ts_rank(setweight(to_tsvector('english', park_facilities.description), 'D'), websearch_to_tsquery('english', ?))), 0)
             AS search_rank`,
            [searchText, searchText, searchText]
          )
        );
        query.orderBy("search_rank", "DESC");
      } else {
        // Fall back to alphabetical (e.g. if no search text)
        query.orderBy("protectedAreaName", "ASC");
      }

      query.limit(limit);
      query.offset(offset);
    });

    return await results.fetchAll();
  },
  /*
   * Park search count handling
   *
   * Protected area search is used for the main parks search page on the frontend.
   * Counting is a bit simpler than data retrieval so we use different queries.
   *
   * Full text indexes and the search_text column are created automatically during
   * bootstrap.
   */
  async countSearch({
    searchText,
    typeCode,
    marineProtectedArea,
    camping,
    activityTypeIds,
    facilityTypeIds,
  }) {
    const knex = strapi.connections[strapi.config.database.defaultConnection];
    const query = knex("protected_areas")
      .select(knex.raw("COUNT(protected_areas.id) OVER() AS count"))
      .leftJoin(
        "park_activities",
        "protected_areas.id",
        "park_activities.protectedArea"
      )
      .leftJoin(
        "park_facilities",
        "protected_areas.id",
        "park_facilities.protectedArea"
      )
      .leftJoin(
        "facility_types",
        "park_facilities.facilityType",
        "facility_types.id"
      )
      .groupBy("protected_areas.id");

    // Only include published & displayed parks
    query.whereNotNull("protected_areas.published_at");
    query.where("protected_areas.isDisplayed", true);

    if (typeCode) {
      query.where("protected_areas.typeCode", typeCode);
    }
    if (marineProtectedArea) {
      query.where("protected_areas.marineProtectedArea", marineProtectedArea);
    }
    if (camping) {
      query.where("facility_types.facilityName", "ILIKE", "%camping%");
    }

    if (searchText) {
      // Run a full text match on our indexed search text column
      // and the description columns of park_activities and park_facilities.
      // Any match here counts.
      query.where((builder) => {
        builder.where(
          knex.raw(
            "protected_areas.search_text @@ websearch_to_tsquery('english', ?)",
            [searchText]
          )
        );
        builder.orWhere(
          knex.raw(
            `setweight(to_tsvector('english', park_activities.description), 'D') @@ websearch_to_tsquery('english', ?)`,
            [searchText]
          )
        );
        builder.orWhere(
          knex.raw(
            `setweight(to_tsvector('english', park_facilities.description), 'D') @@ websearch_to_tsquery('english', ?)`,
            [searchText]
          )
        );
      });
    }

    if (activityTypeIds.length > 0) {
      // check if the aggregated array of all activity type ids for the park
      // contains ALL of the activity type ids we're searching for
      query.havingRaw('array_agg(park_activities."activityType") @> ?', [
        activityTypeIds,
      ]);
    }
    if (facilityTypeIds.length > 0) {
      // check if the aggregated array of all facility type ids for the park
      // contains ALL of the facility type ids we're searching for
      query.havingRaw('array_agg(park_facilities."facilityType") @> ?', [
        facilityTypeIds,
      ]);
    }

    const result = await query.first();

    if (result) {
      return parseInt(result.count, 10);
    }

    return 0;
  },
};
