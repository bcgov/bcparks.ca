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
    areaNumbers,
    campingNumbers,
    limit,
    offset,
    latitude,
    longitude,
    radius
  }) => {

    let textFilter = [];

    if (searchText) {
      textFilter = [
        {
          match_phrase: {
            "protectedAreaName": {
              query: searchText,
              boost: 5
            }
          }
        },
        {
          match_phrase: {
            "parkNames": {
              query: searchText,
              boost: 3
            }
          }
        },
        {
          match_phrase_prefix: {
            "protectedAreaName": {
              query: searchText,
              boost: 1
            }
          }
        },
        {
          match_phrase_prefix: {
            parkNames: {
              query: searchText,
              boost: 1
            }
          }
        },
        {
          multi_match: {
            query: searchText,
            fuzziness: 1,
            type: "best_fields",
            fields: ["parkNames^2", "protectedAreaName^2", "nameLowerCase"],
            operator: "and"
          }
        }
      ];
    }

    let mustFilter = [];
    let campingFilter = [];

    for (const activityNum of activityNumbers) {
      mustFilter.push({ match: { "parkActivities.num": activityNum } })
    }

    for (const facilityNum of facilityNumbers) {
      mustFilter.push({ match: { "parkFacilities.num": facilityNum } })
    }

    for (const campingNum of campingNumbers) {
      campingFilter.push({ match: { "parkCampingTypes.num": campingNum } })
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

    if (!isNaN(latitude) && !isNaN(longitude) && !isNaN(radius)) {
      mustFilter.push({
        "geo_distance": {
          "distance": `${radius}km`,
          "geoBoundary": `${latitude},${longitude}`
        }
      });
    }

    let areaFilter = [];

    for (const areaNum of areaNumbers) {
      areaFilter.push({ match: { "parkLocations.searchAreaNum": areaNum } })
    }

    let sortOrder;
    if (isNaN(latitude) || isNaN(longitude)) {
      sortOrder = [
        "_score",
        "nameLowerCase.keyword"
      ];
    } else {
      sortOrder = [
        {
          _geo_distance: {
            geoBoundary: `${latitude}, ${longitude}`,
            order: "asc",
            unit: "km",
            mode: "min",
            distance_type: "arc",
            ignore_unmapped: true
          }
        }
      ]
    }

    let aggregations = {};
    if (limit > 0) {
      aggregations = {
        activities: {
          terms: {
            field: "parkActivities.num",
            size: 50,
            min_doc_count: 0
          }
        },
        facilities: {
          terms: {
            field: "parkFacilities.num",
            size: 50,
            min_doc_count: 0
          }
        },
        all_areas: {
          global: {},
          aggs: {
            filtered: {
              filter: {
                bool: {
                  filter: [
                    ...mustFilter,
                    {
                      bool: {
                        filter: [{ bool: { should: [...campingFilter] } }]
                      }
                    }
                  ],
                  must: [{ bool: { should: [...textFilter] } }]
                }
              },
              aggs: {
                areas: {
                  terms: {
                    field: "parkLocations.searchAreaNum",
                    size: 50,
                    min_doc_count: 0
                  }
                }
              }
            }
          }
        },
        all_camping: {
          global: {},
          aggs: {
            filtered: {
              filter: {
                bool: {
                  filter: [
                    ...mustFilter,
                    {
                      bool: {
                        filter: [{ bool: { should: [...areaFilter] } }]
                      }
                    }
                  ],
                  must: [{ bool: { should: [...textFilter] } }]
                }
              },
              aggs: {
                campings: {
                  terms: {
                    field: "parkCampingTypes.num",
                    size: 50,
                    min_doc_count: 0
                  }
                }
              }
            }
          }
        }
      }
    }

    try {
      const query = {
        index: getIndexName(),
        body: {
          from: offset,
          size: limit,
          query: {
            bool: {
              filter: [
                ...mustFilter,
                {
                  bool: {
                    filter: [
                      {
                        bool: { should: [...areaFilter] }
                      }
                    ],
                    must: [
                      {
                        bool: { should: [...campingFilter] }
                      }
                    ]
                  }
                }
              ],
              must: [
                {
                  bool: { should: [...textFilter] }
                }
              ]
            }
          },
          sort: sortOrder,
          _source: [
            "orcs",
            "protectedAreaName",
            "hasCampfireBan",
            "slug",
            "parkFacilities",
            "parkActivities",
            "parkCampingTypes",
            "parkLocations.searchArea",
            "parkLocations.searchAreaNum",
            "advisories",
            "parkPhotos",
            "parkOperationSubAreas",
            // TODO: CMS-1206 Replace with parkDates
            "parkOperationDates",
            "parkDates",
            "parkAreas",
            "parkFeatures"
          ],
          aggs: aggregations
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
          match_phrase_prefix: {
            nameLowerCase: {
              query: searchText,
              boost: 4
            }
          }
        },
        {
          match_phrase_prefix: {
            parkNames: {
              query: searchText,
              boost: 4
            }
          }
        },
        {
          multi_match: {
            query: searchText,
            fuzziness: 1,
            type: "best_fields",
            fields: ["parkNames^2", "protectedAreaName^5", "nameLowerCase"],
            operator: "and"
          }
        }];
    }

    if (searchText) {
      textFilter = [
        {
          prefix: {
            "nameLowerCase.keyword": {
              value: searchText.toLowerCase(),
              boost: 6
            }
          }
        },
        {
          prefix: {
            "parkNames.keyword": {
              value: searchText.toLowerCase(),
              boost: 3
            }
          }
        },
        ...filtersForLongerQueries
      ];
    }

    try {
      const query = {
        index: getIndexName(),
        filterPath: "hits.hits._source",
        body: {
          from: 0,
          size: 10,
          query: {
            bool: {
              should: [...textFilter]
            }
          }
        },
        sort: [
          "typeCode.keyword:desc",
          "_score",
          "nameLowerCase.keyword"
        ],
        _source: [
          "protectedAreaName",
          "slug"
        ]
      };
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
