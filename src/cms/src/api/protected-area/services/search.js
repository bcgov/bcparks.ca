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
              "terms": {
                "field": "parkActivities.code.keyword",
                "size": 50
              }
            },
            "facilities": {
              "terms": {
                "field": "parkFacilities.code.keyword",
                "size": 50
              }
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

    if (searchText.length > 2) {
      filtersForLongerQueries = [
        {
          "match_phrase_prefix": {
            "nameLowerCase": {
              "query": searchText,
              "boost": 4
            }
          }
        },
        {
          "match_phrase_prefix": {
            "parkNames": {
              "query": searchText,
              "boost": 4
            }
          }
        },
        {
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
          "prefix": {
            "nameLowerCase.keyword": {
              "value": searchText.toLowerCase(),
              "boost": 6
            }
          }
        },
        {
          "prefix": {
            "parkNames": {
              "value": searchText,
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
          "typeCode.keyword:desc",
          "_score",
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
});

const getIndexName = () => {
  return `${process.env.ELASTIC_PARK_INDEX_NAME}-${process.env.STRAPI_ADMIN_ENVIRONMENT || 'local'}`;
}
