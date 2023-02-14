"use strict";
const { omit } = require("lodash/fp");

// Default is 0.3, but we want to match a little more flexibly than that.
const TEXT_SIMILARITY_THRESHOLD = 0.15;

const parkSearchBuilder = (query) => (builder) => {
  // Done via it subquery as it seems to oddly be the most performant
  builder.whereIn("public_advisories.id", (subquery) => {
    subquery
      .select("public_advisory_id")
      .from("public_advisories__protected_areas")
      .join(
        "protected_areas",
        "public_advisories__protected_areas.protected-area_id",
        "protected_areas.id"
      )
      .whereNotNull("protected_areas.published_at")
      .where("protected_areas.isDisplayed", true)
      .whereRaw('"protectedAreaName" % ?', [query]);
  });
  // names table
  builder.orWhereIn("public_advisories.id", (subquery) => {
    subquery
      .select("public_advisory_id")
      .distinct()
      .from("public_advisories__protected_areas")
      .join(
        "protected_areas",
        "public_advisories__protected_areas.protected-area_id",
        "protected_areas.id"
      )
      .leftJoin("park_names", "protected_areas.id", "park_names.protectedArea")
      .whereNotNull("protected_areas.published_at")
      .where("protected_areas.isDisplayed", true)
      .whereNotNull("park_names.published_at")
      .whereRaw('park_names."parkName" % ?', [query])
      .groupBy("public_advisories__protected_areas.public_advisory_id");
  });
};

const keywordSearchBuilder = (query) => (builder) => {
  // Trigram match on title
  builder.whereRaw("public_advisories.title % ?", [query]);
  // full text search match on title and description
  builder.orWhereRaw(
    "public_advisories.search_text @@ websearch_to_tsquery('english', ?)",
    [query]
  );
};

/*
 * Build the search query.
 * This is a bit limited compared to regular strapi filters, but it adds full
 * text search matches.
 */
const buildQuery =
  ({ filters }) =>
  (builder) => {
    const searchTerm = filters._q;
    const searchType = filters._searchType || "all";
    const eventType = filters["eventType.eventType_contains"];
    const limit = filters._limit;
    const offset = filters._start;

    builder.whereNotNull("public_advisories.published_at");

    if (searchTerm) {
      if (searchType === "park") {
        builder.where(parkSearchBuilder(searchTerm));
      } else if (searchType === "keyword") {
        builder.where(keywordSearchBuilder(searchTerm));
      } else {
        // default to either
        builder.where((orBuilder) => {
          orBuilder.where(parkSearchBuilder(searchTerm));
          orBuilder.orWhere(keywordSearchBuilder(searchTerm));
        });
      }
    }

    // If using park search, we've already limited it to published, displayed parks.
    // otherwise, do that here.
    if (!(searchTerm && searchType === "park")) {
      builder.whereIn("public_advisories.id", (subquery) => {
        subquery
          .select("public_advisory_id")
          .from("public_advisories__protected_areas")
          .join(
            "protected_areas",
            "public_advisories__protected_areas.protected-area_id",
            "protected_areas.id"
          )
          .whereNotNull("protected_areas.published_at")
          .where("protected_areas.isDisplayed", true);
      });
    }

    if (eventType) {
      builder.whereIn("public_advisories.eventType", (subquery) => {
        subquery
          .select("id")
          .from("event_types")
          .where("event_types.eventType", "ILIKE", eventType);
      });
    }

    if (limit) {
      builder.limit(limit);
    }

    if (offset) {
      builder.offset(offset);
    }
  };

/*
 * Set the threshold for similar trigram matches.
 */
const setTextSimilarity = (knex) => {
  return knex.raw("SET pg_trgm.similarity_threshold = ??", [
    TEXT_SIMILARITY_THRESHOLD,
  ]);
};

module.exports = {
  async search(params, populate) {
    const knex = strapi.connections[strapi.config.database.defaultConnection];
    const model = strapi.query("public-advisory").model;

    if (params._q) {
      await setTextSimilarity(knex);
    }

    const query = model.query(buildQuery({ model, filters: params }));
    query.query((builder) =>
      builder.orderBy("public_advisories.advisoryDate", "desc")
    );
    const results = await query.fetchAll({
      withRelated: populate,
    });
    return results.toJSON();
  },
  async countSearch(params) {
    const knex = strapi.connections[strapi.config.database.defaultConnection];
    const model = strapi.query("public-advisory").model;
    const countParams = omit(["_sort", "_limit", "_start"], params);

    if (params._q) {
      await setTextSimilarity(knex);
    }

    const query = model.query(buildQuery({ model, filters: countParams }));

    const result = await query.count();
    return Number(result);
  },
};
