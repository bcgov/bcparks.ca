"use strict";
/**
 * public-advisory-audit controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::public-advisory-audit.public-advisory-audit",
  ({ strapi }) => ({
    async history(ctx) {
      const { advisoryNumber } = ctx.params;
      const entities = await strapi
        .documents("api::public-advisory-audit.public-advisory-audit")
        .findMany({
          filters: { advisoryNumber: advisoryNumber },
          sort: ["revisionNumber:desc"],
          populate: "*",
        });

      // remove createdBy and updatedBy because it's easier to maintain than
      // changing populate: "*" to include everything else but these fields.
      for (const version of entities) {
        delete version.createdBy;
        delete version.updatedBy;
      }

      return this.sanitizeOutput(entities, ctx);
    },
    /**
     * Retrieves all public advisory audits that are either scheduled or published.
     * This is used for synchronization with RST RecSpace.
     **/
    async scheduledAndPublished(ctx) {
      const { filters, sort, populate, fields, pagination } = ctx.query;

      // Get all the published public advisories from the projection table.
      // We need to do it this way because it's possible for the latest revision
      // of a public advisory audit to be newer than the published revision.
      const published = await strapi
        .documents("api::public-advisory.public-advisory")
        .findMany({
          fields: ["advisoryNumber", "revisionNumber"],
        });

      // build filters to join with the audit table
      const publishedPairFilters = published
        .filter(
          ({ advisoryNumber, revisionNumber }) =>
            advisoryNumber && revisionNumber,
        )
        .map((record) => ({
          advisoryNumber: record.advisoryNumber,
          revisionNumber: record.revisionNumber,
        }));

      // filter for records matching the join map and
      // all scheduled records that are the latest revision
      const publishedOrScheduledFilter = {
        $or: [
          ...publishedPairFilters,
          {
            advisoryStatus: { code: "SCH" },
            isLatestRevision: true,
          },
        ],
      };

      // add additional filters from the querystring if they exist
      const mergedFilters = filters
        ? {
            $and: [publishedOrScheduledFilter, filters],
          }
        : publishedOrScheduledFilter;

      // use a very large pageSize to force the configured rest.maxLimit cap.
      const paginationOption = !pagination
        ? { pagination: { pageSize: Number.MAX_SAFE_INTEGER } }
        : { pagination };

      // query the audit table with the merged filters and all other query params
      const { results, pagination: paginationResult } = await strapi
        .service("api::public-advisory-audit.public-advisory-audit")
        .find({
          filters: mergedFilters,
          sort,
          populate,
          ...paginationOption,
          fields,
          status: "published",
        });

      const sanitizedEntities = await this.sanitizeOutput(results, ctx);

      return this.transformResponse(sanitizedEntities, {
        pagination: paginationResult,
      });
    },
  }),
);
