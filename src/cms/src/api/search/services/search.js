'use strict';

const { doElasticSearch } = require('../../../helpers/elasticClient');

/**
 * search service
 */

module.exports = ({ strapi }) => ({

  searchParks: async ({
    searchText,
    typeCode,
    camping,
    marineProtectedArea,
    activityNumbers,
    facilityNumbers,
    limit,
    offset,
  }) => {

    let textFilter = [];

    if (searchText) {
      textFilter = [
        {
          "match_phrase": {
            "protectedAreaName": {
              "query": searchText,
              "boost": 5
            }
          }
        },
        {
          "match_phrase": {
            "parkNames": {
              "query": searchText,
              "boost": 3
            }
          }
        },
        {
          "match_phrase_prefix": {
            "protectedAreaName": {
              "query": searchText,
              "boost": 1
            }
          }
        },
        {
          "match_phrase_prefix": {
            "parkNames": {
              "query": searchText,
              "boost": 1
            }
          }
        },
        {
          "multi_match": {
            "query": searchText,
            "type": "best_fields",
            "fields": ["parkNames^2", "protectedAreaName^2"],
            "operator": "and"
          }
        }
      ];
    }

    let mustFilter = [];

    for (const activityNum of activityNumbers) {
      mustFilter.push({ match: { "parkActivities.num": activityNum } })
    }

    for (const facilityNum of facilityNumbers) {
      mustFilter.push({ match: { "parkFacilities.num": facilityNum } })
    }

    if (camping) {
      mustFilter.push({ match: { "hasCamping": true } })
    }

    if (marineProtectedArea) {
      mustFilter.push({ match: { "marineProtectedArea": true } })
    }

    if (typeCode) {
      mustFilter.push({ match: { "typeCode": typeCode } })
    }

    try {
      const query = {
        index: getIndexName(),
        from: offset,
        size: limit,
        body: {
          query: {
            bool: {
              filter: [
                {
                  bool: {
                    must: [...mustFilter]
                  }
                }
              ],
              must: [{
                bool: { should: [...textFilter] }
              }
              ]
            }
          },
          "sort": [
            "_score",
            "nameLowerCase.keyword"
          ],
          _source: true,
          aggs: {
            "activities": {
              "terms": { "field": "parkActivities.code.keyword" }
            },
            "facilities": {
              "terms": { "field": "parkFacilities.code.keyword" }
            },
            "marinePark": {
              "terms": { "field": "marineProtectedArea" }
            },
            "hasCamping": {
              "terms": { "field": "hasCamping" }
            },
            "typeCode": {
              "terms": { "field": "typeCode.keyword" }
            },
          }
        }
      };
      const result = await doElasticSearch(query);
      return result;
    }
    catch (err) {
      console.log('Search : search.searchParks : Error encountered while making a search request to ElasticSearch.')
      throw err;
    }
  },

  parkAutocomplete: async ({
    searchText,
  }) => {

    if (!searchText) {
      return [];
    }

    let textFilter = [];

    let filtersForLongerQueries = [];

    if (searchText.length > 1) {
      filtersForLongerQueries = [{
        "multi_match": {
          "query": searchText,
          "type": "best_fields",
          "fields": ["parkNames^2", "protectedAreaName^5"],
          "operator": "or"
        }
      }];
    }

    if (searchText) {
      textFilter = [
        {
          "match_phrase_prefix": {
            "protectedAreaName": {
              "query": searchText,
              "boost": 4
            }
          }
        },
        {
          "match_phrase_prefix": {
            "parkNames": {
              "query": searchText,
              "boost": 3
            }
          }
        },
        ...filtersForLongerQueries
      ];
    }

    try {
      const query = {
        from: 0,
        size: 10,
        index: getIndexName(),
        filterPath: "hits.hits._source",
        body: {
          query: {
            bool: {
              should: [...textFilter]
            }
          }
        },
        "sort": [
          "_score",
          "typeCode.keyword:desc",
          "nameLowerCase.keyword"
        ],
        "_source": [
          "protectedAreaName",
          "slug"
        ]
      };
      console.log(JSON.stringify(query))

      const result = await doElasticSearch(query);
      return result;
    }
    catch (err) {
      console.log('Search : search.parkAutocomplete : Error encountered while making a search request to ElasticSearch.')
      throw err;
    }
  },

  async queueAllParksForIndexing() {

    // clear items that are already queued to be indexed (they don't need to be indexed twice)
    await strapi.db.query("api::queued-task.queued-task").deleteMany({
      where: { action: 'elastic index park' }
    });

    // items queued to be deleted are okay to be deleted twice because there is a big risk of 
    // missing them if we delete them as well

    const removeParks = await strapi.entityService.findMany("api::protected-area.protected-area", {
      filters: { isDisplayed: { $ne: true } },
      fields: ["id"]
    });

    const addParks = await strapi.entityService.findMany("api::protected-area.protected-area", {
      filters: { isDisplayed: true },
      fields: ["id"]
    });

    const removeList = removeParks.map(p => {
      return {
        action: 'elastic remove park',
        numericData: p.id
      }
    });

    const addList = addParks.map(p => {
      return {
        action: 'elastic index park',
        numericData: p.id
      }
    });

    if (removeList.length) {
      await strapi.db.query("api::queued-task.queued-task").createMany({ data: removeList });
    }

    if (addList.length) {
      await strapi.db.query("api::queued-task.queued-task").createMany({ data: addList });
    }
  }

});

const getIndexName = () => {
  return `${process.env.ELASTIC_PARK_INDEX_NAME}-${process.env.STRAPI_ADMIN_ENVIRONMENT || 'local'}`;
}
