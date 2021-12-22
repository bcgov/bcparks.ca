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
          knex.raw(
            'array_remove(array_agg(DISTINCT ?? ORDER BY ??), NULL) AS "advisories"',
            ["public_advisories.title", "public_advisories.title"]
          ),
          knex.raw(
            `array(
              SELECT "thumbnailUrl"
              FROM park_photos
              WHERE park_photos.orcs = protected_areas.orcs
                  AND park_photos."isActive" = TRUE
            ) AS "parkPhotos"`
          ),
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
        query.where((builder) => {
          builder.where(
            knex.raw(
              "protected_areas.search_text @@ websearch_to_tsquery('english', ?)",
              [searchText]
            )
          );
          builder.orWhere(
            knex.raw(
              `to_tsvector('english', park_activities.description) @@ websearch_to_tsquery('english', ?)`,
              [searchText]
            )
          );
          builder.orWhere(
            knex.raw(
              `to_tsvector('english', park_facilities.description) @@ websearch_to_tsquery('english', ?)`,
              [searchText]
            )
          );
        });
      }

      if (activityTypeIds.length > 0) {
        query.havingRaw('array_agg(park_activities."activityType") @> ?', [
          activityTypeIds,
        ]);
      }
      if (facilityTypeIds.length > 0) {
        query.havingRaw('array_agg(park_facilities."facilityType") @> ?', [
          facilityTypeIds,
        ]);
      }

      if (sortCol === "protectedAreaName" && sortDesc) {
        query.orderBy("protectedAreaName", "DESC");
      } else if (sortCol === "protectedAreaName" && !sortDesc) {
        query.orderBy("protectedAreaName", "ASC");
      } else if (sortCol === "rank" && sortDesc && searchText) {
        query.select(
          knex.raw(
            `ts_rank(protected_areas.search_text, websearch_to_tsquery('english', ?)) +
             coalesce(max(ts_rank(to_tsvector('english', park_activities.description), websearch_to_tsquery('english', ?))), 0) +
             coalesce(max(ts_rank(to_tsvector('english', park_facilities.description), websearch_to_tsquery('english', ?))), 0)
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
      query.where((builder) => {
        builder.where(
          knex.raw(
            "protected_areas.search_text @@ websearch_to_tsquery('english', ?)",
            [searchText]
          )
        );
        builder.orWhere(
          knex.raw(
            `to_tsvector('english', park_activities.description) @@ websearch_to_tsquery('english', ?)`,
            [searchText]
          )
        );
        builder.orWhere(
          knex.raw(
            `to_tsvector('english', park_facilities.description) @@ websearch_to_tsquery('english', ?)`,
            [searchText]
          )
        );
      });
    }

    if (activityTypeIds.length > 0) {
      query.havingRaw('array_agg(park_activities."activityType") @> ?', [
        activityTypeIds,
      ]);
    }
    if (facilityTypeIds.length > 0) {
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
