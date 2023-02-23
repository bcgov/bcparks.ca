"use strict";

const TEXT_SIMILARITY_THRESHOLD = 0.15;

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
    const knex = strapi.db.connection;

    // If we have some search text for full text search, drop the similarity threshold
    // Default is 0.3 which misses basic misspellings
    if (searchText) {
      await this.setTextSimilarity(knex);
    }

    const applyFilters = this.applyQueryFilters;

    const results = strapi.query("protected-area").model.query((query) => {
      query.select(
        "protected_areas.id",
        "protected_areas.protectedAreaName",
        "protected_areas.slug",
        knex.raw(
          `array(
            SELECT to_json((
              SELECT j FROM (
                SELECT public_advisories."id", 
                public_advisories."urgency", 
                public_advisories."accessStatus"
              ) j
            ))
            FROM public_advisories__protected_areas
            JOIN public_advisories
            ON public_advisories.id = public_advisories__protected_areas.public_advisory_id
            WHERE public_advisories__protected_areas."protected-area_id" = protected_areas.id
              AND public_advisories.published_at IS NOT NULL
          ) AS "advisories"`
        ),
        // Include first 5 active park photos thumbnails, ordered by
        // featured and then by sort order (with fallback to date, then id)
        knex.raw(
          `array(
            SELECT "thumbnailUrl"
            FROM park_photos
            WHERE park_photos.orcs = protected_areas.orcs
                AND park_photos.published_at IS NOT NULL
                AND park_photos."isActive" = TRUE
                AND park_photos."thumbnailUrl" IS NOT NULL
            ORDER BY park_photos."isFeatured" DESC NULLS LAST,
                park_photos."sortOrder" ASC NULLS LAST,
                park_photos."dateTaken" DESC,
                park_photos."id" DESC
            LIMIT 5
          ) AS "parkPhotos"`
        ),
        knex.raw(
          `EXISTS(
            SELECT 1 FROM park_operations
            WHERE orcs = protected_areas.orcs
              AND park_operations.published_at IS NOT NULL
              AND "hasReservations" = TRUE
          ) AS "hasReservations"`
        )
      );
      applyFilters(knex, query, {
        searchText,
        typeCode,
        camping,
        marineProtectedArea,
        activityTypeIds,
        facilityTypeIds,
      });

      if (sortCol === "protectedAreaName" && sortDesc) {
        query.orderBy("protectedAreaName", "DESC");
      } else if (sortCol === "protectedAreaName" && !sortDesc) {
        query.orderBy("protectedAreaName", "ASC");
      } else if (sortCol === "rank" && sortDesc && searchText) {
        // if we're sorting by relevance, add various rank columns to the query
        // for sorting:
        // - protected_area_name_search_similarity: similarity score for the protected area name
        // - park_name_search_similarity: similarity score for the park name table
        //
        // Unfortunately there's no clear way to combine these ranks (as they use different
        // scales) so we sort by them in order.
        query.select(
          knex.raw(
            'similarity("protectedAreaName", ?) AS protected_area_name_search_similarity',
            [searchText]
          ),
          knex.raw(
            `GREATEST(
              (
                SELECT similarity(park_names."parkName", ?) AS name_similarity
                FROM park_names
                WHERE park_names."protectedArea" = id
                  AND park_names.published_at IS NOT NULL
                ORDER BY name_similarity DESC
                LIMIT 1
              ),
              0.0
            ) AS park_name_search_similarity`,
            [searchText]
          )
        );
        query.orderBy([
          {
            column: "protected_area_name_search_similarity",
            order: "desc",
          },
          {
            column: "park_name_search_similarity",
            order: "desc",
          },
          {
            column: "protectedAreaName",
            order: "asc",
          },
        ]);
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
  async countSearch(filters) {
    const knex = strapi.connections[strapi.config.database.defaultConnection];
    const query = knex("protected_areas").count("id");

    if (filters.searchText) {
      await this.setTextSimilarity(knex);
    }

    this.applyQueryFilters(knex, query, filters);
    const result = await query.first();

    if (result) {
      return parseInt(result.count, 10);
    }

    return 0;
  },
  setTextSimilarity(knex) {
    // If we have some search text for full text search, drop the similarity threshold
    // Default is 0.3 which misses basic misspellings
    return knex.raw("SET pg_trgm.similarity_threshold = ??", [
      TEXT_SIMILARITY_THRESHOLD,
    ]);
  },
  /* Apply where clauses to the query given */
  applyQueryFilters(
    knex,
    query,
    {
      searchText,
      typeCode,
      marineProtectedArea,
      camping,
      activityTypeIds,
      facilityTypeIds,
    }
  ) {
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
      query.whereIn("protected_areas.id", (builder) => {
        builder
          .select("protectedArea")
          .from("park_facilities")
          .innerJoin(
            "facility_types",
            "park_facilities.facilityType",
            "facility_types.id"
          )
          .where("park_facilities.isActive", true)
          .where("facility_types.isActive", true)
          .whereNotNull("facility_types.published_at")
          .whereNotNull("park_facilities.published_at")
          .where("facility_types.facilityName", "ILIKE", "%camping%");
      });
    }

    if (activityTypeIds.length > 0) {
      query.whereIn("protected_areas.id", (builder) => {
        builder
          .select("protectedArea")
          .from("park_activities")
          .innerJoin(
            "activity_types",
            "park_activities.activityType",
            "activity_types.id"
          )
          .where("park_activities.isActive", true)
          .where("activity_types.isActive", true)
          .whereNotNull("activity_types.published_at")
          .whereNotNull("park_activities.published_at")
          .whereIn("activityType", activityTypeIds);
      });
    }

    if (facilityTypeIds.length > 0) {
      query.whereIn("protected_areas.id", (builder) => {
        builder
          .select("protectedArea")
          .from("park_facilities")
          .innerJoin(
            "facility_types",
            "park_facilities.facilityType",
            "facility_types.id"
          )
          .where("park_facilities.isActive", true)
          .where("facility_types.isActive", true)
          .whereNotNull("facility_types.published_at")
          .whereNotNull("park_facilities.published_at")
          .whereIn("facilityType", facilityTypeIds);
      });
    }

    if (searchText) {
      // Run a full text match on our indexed search text column
      // and the description columns of park_activities and park_facilities
      // Any match here counts.
      query.where((builder) => {
        builder.where("protectedAreaName", "ILIKE", `%${searchText}%`);
        builder.orWhereIn("protected_areas.id", (subqueryBuilder) => {
          subqueryBuilder
            .select("protectedArea")
            .from("park_names")
            .whereNotNull("park_names.published_at")
            .whereIn("parkNameType", [1, 3, 4, 5, 6])
            .where((orBuilder) => {
              orBuilder
                .where(knex.raw('"parkName" % ?', [searchText]))
                .orWhere(
                  knex.raw(
                    `to_tsvector('english', "parkName") @@ websearch_to_tsquery('english', ?)`,
                    [searchText]
                  )
                )
                .orWhere(
                  knex.raw('similarity("parkName", ?) > 0.12', [searchText])
                );
            });
        });
      });
    }
  },
  find(params, populate) {
    let fields = [
      "parkOperationSubAreas.parkOperationSubAreaDates",
      "parkOperationSubAreas.parkSubAreaType",
      "parkOperationSubAreas.facilityType",
      "parkActivities",
      "parkFacilities",
      "parkOperation",
      "parkNames",
      "fireZones",
      "managementAreas",
    ];
    if (populate) {
      fields = [...fields, ...populate];
    }
    return strapi.query("protected-area").find(params, fields);
  },

  findOne(params, populate) {
    let fields = [
      "parkOperationSubAreas.parkOperationSubAreaDates",
      "parkOperationSubAreas.parkSubAreaType",
      "parkOperationSubAreas.facilityType",
      "parkActivities",
      "parkFacilities",
      "parkOperation",
      "parkNames",
      "fireZones",
      "managementAreas",
    ];
    if (populate) {
      fields = [...fields, ...populate];
    }
    return strapi.query("protected-area").findOne(params, fields);
  },
};
