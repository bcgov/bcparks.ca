"use strict";

const createSearchService = require("../src/api/public-advisory/services/search");

/**
 * Runs an active-advisory search against fixed document results.
 *
 * @param {object[]} advisories advisories returned by the document service
 * @param {object} [pagination] optional pagination query
 * @returns {Promise<object>} search results, pagination metadata, and document query mock
 */
const searchActiveAdvisories = async (advisories, pagination) => {
  const findMany = jest.fn().mockResolvedValue(advisories);
  const strapi = {
    documents: jest.fn().mockReturnValue({ findMany }),
  };
  const service = createSearchService({ strapi });

  const response = await service.search({
    _activeAdvisorySort: "1",
    ...(pagination && { pagination }),
  });

  return { ...response, findMany };
};

describe("public advisory search", () => {
  // Ensures advisoryDate does not override an available updatedDate.
  it("sorts by updatedDate when it is available", async () => {
    const { results } = await searchActiveAdvisories([
      {
        id: 1,
        title: "Earlier update",
        updatedDate: "2026-08-20T20:00:00.000Z",
        advisoryDate: "2026-09-30T20:00:00.000Z",
      },
      {
        id: 2,
        title: "Later update",
        updatedDate: "2026-08-24T20:00:00.000Z",
        advisoryDate: "2026-07-01T20:00:00.000Z",
      },
    ]);

    expect(results.map(({ title }) => title)).toEqual([
      "Later update",
      "Earlier update",
    ]);
  });

  // Ensures a missing updatedDate resolves to the advisoryDate.
  it("falls back to advisoryDate when updatedDate is null", async () => {
    const { results } = await searchActiveAdvisories([
      {
        id: 1,
        title: "Fallback date",
        updatedDate: null,
        advisoryDate: "2026-08-21T20:00:00.000Z",
      },
      {
        id: 2,
        title: "Updated date",
        updatedDate: "2026-08-20T20:00:00.000Z",
        advisoryDate: "2026-09-30T20:00:00.000Z",
      },
    ]);

    expect(results.map(({ title }) => title)).toEqual([
      "Fallback date",
      "Updated date",
    ]);
  });

  // Keeps ordering deterministic when effective dates are equal.
  it("sorts by descending id when effective dates are equal", async () => {
    const effectiveDate = "2026-08-21T20:00:00.000Z";
    const { results } = await searchActiveAdvisories([
      { id: 1, updatedDate: effectiveDate, advisoryDate: effectiveDate },
      { id: 3, updatedDate: effectiveDate, advisoryDate: effectiveDate },
      { id: 2, updatedDate: null, advisoryDate: effectiveDate },
    ]);

    expect(results.map(({ id }) => id)).toEqual([3, 2, 1]);
  });

  // Guards against applying pagination before the effective-date sort.
  it("sorts active advisories before pagination", async () => {
    const { results, pagination, findMany } = await searchActiveAdvisories(
      [
        {
          id: 1,
          updatedDate: "2026-08-20T20:00:00.000Z",
          advisoryDate: "2026-08-20T20:00:00.000Z",
        },
        {
          id: 2,
          updatedDate: "2026-08-24T20:00:00.000Z",
          advisoryDate: "2026-08-24T20:00:00.000Z",
        },
        {
          id: 3,
          updatedDate: "2026-08-21T20:00:00.000Z",
          advisoryDate: "2026-08-21T20:00:00.000Z",
        },
      ],
      { start: 1, limit: 1 },
    );

    const documentQuery = findMany.mock.calls[0][0];
    expect(documentQuery).not.toHaveProperty("limit");
    expect(documentQuery).not.toHaveProperty("start");
    expect(documentQuery).not.toHaveProperty("pagination");
    expect(results.map(({ id }) => id)).toEqual([3]);
    expect(pagination).toEqual({
      page: 2,
      pageSize: 1,
      pageCount: 3,
      total: 3,
    });
  });
});
