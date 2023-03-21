"use strict";

/**
 * protected-area service
 */

const { createCoreService } = require("@strapi/strapi").factories;

const TEXT_SIMILARITY_THRESHOLD = 0.3;

module.exports = createCoreService("api::protected-area.protected-area", ({ strapi }) => ({
  async items() {
    const results = await strapi.db.query('api::protected-area.protected-area').findMany(
      {
        select: ["id", "orcs", "protectedAreaName"],
        limit: 2000,
        orderBy: ['protectedAreaName'],
      }
    );
    return results;
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

    const query = knex
      .from(strapi.getModel('api::protected-area.protected-area').collectionName)
      .select("protected_areas.id",
        "protected_areas.protected_area_name AS protectedAreaName",
        "protected_areas.slug",
        knex.raw(
          `array(
            SELECT to_json((
              SELECT j FROM (
                SELECT adv."id", 
                public_advisories_urgency_links.urgency_id, 
                public_advisories_advisory_status_links.advisory_status_id
              ) j
            ))
            FROM public_advisories_protected_areas_links
            INNER JOIN public_advisories adv
              ON adv.id = public_advisories_protected_areas_links.public_advisory_id
            INNER JOIN public_advisories_urgency_links 
              ON adv.id = public_advisories_urgency_links.public_advisory_id
            INNER JOIN public_advisories_advisory_status_links
              ON adv.id = public_advisories_advisory_status_links.public_advisory_id
            WHERE public_advisories_protected_areas_links.protected_area_id = protected_areas.id
              AND adv.published_at IS NOT NULL
          ) AS "advisories"`
        ),
        knex.raw(
          `array(
            SELECT image_url
            FROM park_photos
            WHERE park_photos.orcs = protected_areas.orcs
                AND park_photos.published_at IS NOT NULL
                AND park_photos.is_active = TRUE
                AND park_photos.image_url IS NOT NULL
            ORDER BY park_photos.is_featured DESC NULLS LAST,
                park_photos.sort_order ASC NULLS LAST,
                park_photos.date_taken DESC,
                park_photos.id DESC
            LIMIT 5
          ) AS "parkPhotos"`
        ),
        knex.raw(
          `EXISTS(
            SELECT 1 FROM park_operations
            INNER JOIN park_operations_protected_area_links
              ON park_operations.id = park_operations_protected_area_links.park_operation_id
            WHERE park_operations_protected_area_links.protected_area_id = protected_areas.id
              AND park_operations.published_at IS NOT NULL
              AND has_reservations = TRUE
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
          'similarity("protected_area_name", ?) AS protected_area_name_search_similarity',
          [searchText]
        ),
        knex.raw(
          `GREATEST(
              (
                SELECT similarity(park_names.park_name, ?) AS name_similarity
                FROM park_names 
                INNER JOIN park_names_protected_area_links ON park_names.id = park_names_protected_area_links.park_name_id
                WHERE park_names_protected_area_links.protected_area_id = protected_areas.id
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
          column: "park_name_search_similarity",
          order: "desc",
        },
        {
          column: "protected_area_name_search_similarity",
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

    const results = await query;

    const newResults = [];

    const parkEntities = await strapi.entityService.findMany('api::protected-area.protected-area', {
      filters: { id: results.map((r) => r.id) },
      populate: ['parkFacilities.facilityType', 'parkActivities.activityType']
    });

    for (const result of results) {
      const parkEntity = await parkEntities.find(e => e.id === result.id);
      newResults.push({
        ...result,
        parkFacilities: parkEntity.parkFacilities
          .filter(f => f.isActive && f.facilityType.isActive)
          .map((f) => {
            return {
              facilityType: f.facilityType.id,
              facilityName: f.facilityType.facilityName
            }
          }),
        parkActivities: parkEntity.parkActivities
          .filter(a => a.isActive && a.activityType.isActive)
          .map((a) => {
            return {
              activityType: a.activityType.id,
              activityName: a.activityType.activityName
            }
          })
      });
    }
    return newResults;
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

    const knex = strapi.db.connection;

    if (filters.searchText) {
      await this.setTextSimilarity(knex);
    }

    const applyFilters = this.applyQueryFilters;

    const query = knex
      .from(strapi.getModel('api::protected-area.protected-area').collectionName).count("id");

    this.applyQueryFilters(knex, query, filters);
    const result = await query.first();

    if (result) {
      return parseInt(result.count, 10);
    }

    return 0;
  },  
  async setTextSimilarity(knex) {
    // If we have some search text for full text search, drop the similarity threshold
    // Default is 0.3 which misses basic misspellings
    return await knex.raw("SET pg_trgm.similarity_threshold = ??", [
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
    query.where("protected_areas.is_displayed", true);

    if (typeCode) {
      query.where("protected_areas.type_code", typeCode);
    }

    if (marineProtectedArea) {
      query.where("protected_areas.marine_protected_area", marineProtectedArea);
    }

    if (camping) {
      query.whereIn("protected_areas.id", (builder) => {
        builder
          .select("protected_area_id")
          .from("park_facilities")
          .innerJoin(
            "park_facilities_facility_type_links",
            "park_facilities.id",
            "park_facilities_facility_type_links.park_facility_id"
          )
          .innerJoin(
            "facility_types",
            "park_facilities_facility_type_links.facility_type_id",
            "facility_types.id"
          )
          .innerJoin(
            "park_facilities_protected_area_links",
            "park_facilities.id",
            "park_facilities_protected_area_links.park_facility_id"
          )
          .where("park_facilities.is_active", true)
          .where("facility_types.is_active", true)
          .whereNotNull("facility_types.published_at")
          .whereNotNull("park_facilities.published_at")
          .where("facility_types.is_camping", true);
      });
    }

    if (activityTypeIds.length > 0) {
      query.whereIn("protected_areas.id", (builder) => {
        builder
          .select("protected_area_id")
          .from("park_activities")
          .innerJoin(
            "park_activities_activity_type_links",
            "park_activities.id",
            "park_activities_activity_type_links.park_activity_id"
          )
          .innerJoin(
            "activity_types",
            "park_activities_activity_type_links.activity_type_id",
            "activity_types.id"
          )
          .innerJoin(
            "park_activities_protected_area_links",
            "park_activities.id",
            "park_activities_protected_area_links.park_activity_id"
          )
          .where("park_activities.is_active", true)
          .where("activity_types.is_active", true)
          .whereNotNull("activity_types.published_at")
          .whereNotNull("park_activities.published_at")
          .whereIn("activity_type_id", activityTypeIds);
      });
    }

    if (facilityTypeIds.length > 0) {
      query.whereIn("protected_areas.id", (builder) => {
        builder
          .select("protected_area_id")
          .from("park_facilities")
          .innerJoin(
            "park_facilities_facility_type_links",
            "park_facilities.id",
            "park_facilities_facility_type_links.park_facility_id"
          )
          .innerJoin(
            "facility_types",
            "park_facilities_facility_type_links.facility_type_id",
            "facility_types.id"
          )
          .innerJoin(
            "park_facilities_protected_area_links",
            "park_facilities.id",
            "park_facilities_protected_area_links.park_facility_id"
          )
          .where("park_facilities.is_active", true)
          .where("facility_types.is_active", true)
          .whereNotNull("facility_types.published_at")
          .whereNotNull("park_facilities.published_at")
          .whereIn("facility_type_id", facilityTypeIds);
      });
    }

    if (searchText) {
      // Run a full text match on our indexed search text column
      // and the description columns of park_activities and park_facilities
      // Any match here counts.
      query.where((builder) => {
        builder.where("protected_area_name", "ILIKE", `%${searchText}%`);
        builder.orWhereIn("protected_areas.id", (subqueryBuilder) => {
          subqueryBuilder
            .select("protected_area_id")
            .from("park_names")
            .innerJoin(
              "park_names_protected_area_links",
              "park_names_protected_area_links.park_name_id",
              "park_names.id"
            )
            .innerJoin(
              "park_names_park_name_type_links",
              "park_names_park_name_type_links.park_name_id",
              "park_names.id"
            )
            .whereNotNull("park_names.published_at")
            .whereIn("park_name_type_id", [1, 3, 4, 5, 6])
            .where((orBuilder) => {
              orBuilder
                .where(knex.raw('"park_name" % ?', [searchText]))
                .orWhere(
                  knex.raw(
                    `to_tsvector('english', "park_name") @@ websearch_to_tsquery('english', ?)`,
                    [searchText]
                  )
                )
                .orWhere(
                  knex.raw(`similarity("park_name", ?) > ${TEXT_SIMILARITY_THRESHOLD}`, [searchText])
                );
            });
        });
      });
    }
  }
})
);
