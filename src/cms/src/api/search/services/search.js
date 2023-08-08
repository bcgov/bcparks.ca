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
    activityTypeIds,
    facilityTypeIds,
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
        }
      ];
    }

    let campingFilter = [];

    if (camping) {
      campingFilter = [
        {
          match: {
            "parkActivities.isCamping": true
          }
        },
        {
          match: {
            "parkFacilities.isCamping": true
          }
        }
      ];
    }

    let mustFilter = [];

    for (const typeId of activityTypeIds) {
      mustFilter.push({ match: { "parkActivities.typeId": typeId } })
    }

    for (const typeId of facilityTypeIds) {
      mustFilter.push({ match: { "parkFacilities.typeId": typeId } })
    }

    if (marineProtectedArea) {
      mustFilter.push({ match: { "marineProtectedArea": "Y" } })
    }

    if (typeCode) {
      mustFilter.push({ match: { "typeCode": typeCode } })
    }

    try {
      const result = await doElasticSearch({
        index: getIndexName(),
        from: offset,
        size: limit,
        body: {
          query: {
            bool: {
              filter: [
                {
                  bool: {
                    should: [...campingFilter],
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
          _source: true
        }
      });
      return result;
    }
    catch (err) {
      console.log('Search : search.searchParks : Error encountered while making a search request to ElasticSearch.')
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
