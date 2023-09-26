const axios = require('axios');
const { getLogger } = require('../utils/logging');
const qs = require('qs');
const { isEmpty } = require('lodash');

/**
 * Populates the Geo-shapes collection in Strapi
 */
exports.populateGeoShapes = async function () {
  const logger = getLogger();
  const httpReqHeaders = {
    'Authorization': 'Bearer ' + process.env.STRAPI_API_TOKEN,
    'Content-Type': 'application/json'
  };

  const query = qs.stringify({
    fields: ["orcs", "typeCode"],
    filters: {
      geoShape: {
        geometry: {
          $null: true
        }
      }
    },
    populate: {
      geoShape: { fields: ["orcs"] }
    },
    pagination: {
      limit: -1
    },
    publicationState: "preview",
    sort: "orcs"
  }, {
    encodeValuesOnly: true,
  })

  let parks;
  try {
    const allParks = `${process.env.STRAPI_BASE_URL}/api/protected-areas?${query}&filters[typeCode][$ne]=CS`;
    parks = await axios.get(allParks, { headers: httpReqHeaders });
    logger.info(`found ${parks.data.data.length} parks, pa's and er's without geo-shapes`)
  } catch (error) {
    logger.error(`populateGeoShapes.js failed while getting parks, pa's and er's: ${error}`);
    return;
  }
  await processParkList(parks)

  let conservancies;
  try {
    const allConservancies = `${process.env.STRAPI_BASE_URL}/api/protected-areas?${query}&filters[typeCode][$eq]=CS`;
    conservancies = await axios.get(allConservancies, { headers: httpReqHeaders });
    logger.info(`found ${conservancies.data.data.length} conservancies without geo-shapes`)
  } catch (error) {
    logger.error(`populateGeoShapes.js failed while getting conservancies: ${error}`);
    return;
  }
  await processParkList(conservancies)
};

const processParkList = async function (parks) {
  const httpReqHeaders = {
    'Authorization': 'Bearer ' + process.env.STRAPI_API_TOKEN,
    'Content-Type': 'application/json'
  };
  const logger = getLogger();
  for (const park of parks.data.data) {
    if (park.attributes.geoShape.data === null) {
      const { orcs, typeCode } = park.attributes;
      if (orcs) {
        logger.info(`getting geo-shape for orcs ${orcs}`)
        let shape;
        try {
          shape = await getGeoShape(orcs, typeCode);
        } catch (error) {
          logger.warn('error getting geoshape from openmaps.gov.bc.ca:')
          logger.warn(error)
          continue;
        }
        let geoShape;
        if (shape !== null) {
          geoShape = {
            protectedArea: park.id,
            geometry: shape,
            orcs: park.attributes.orcs,
            isEmpty: false
          };
        } else {
          geoShape = {
            protectedArea: park.id,
            geometry: [],
            orcs: park.attributes.orcs,
            isEmpty: true
          };
        }
        try {
          await axios.post(`${process.env.STRAPI_BASE_URL}/api/geo-shapes`, { data: geoShape }, { headers: httpReqHeaders });
        } catch (error) {
          logger.error(`populateGeoShapes.js failed saving geoshape: ${error}`);
          continue;
        }
      }
    }
  }
}

const getGeoShape = async function (orcs, typeCode) {
  orcs = orcs.toString().padStart(4, '0');
  let shapeQuery = process.env.GEOSHAPE_URL.replace("{0}", orcs);
  if (typeCode === 'CS') {
    shapeQuery = shapeQuery.replace("{1}", "WHSE_TANTALIS.TA_CONSERVANCY_AREAS_SVW");
  } else {
    shapeQuery = shapeQuery.replace("{1}", "WHSE_TANTALIS.TA_PARK_ECORES_PA_SVW");
  }
  const response = await axios.get(shapeQuery, { timeout: 10000 });
  if (response.data.features.length) {
    return response.data.features[0].geometry;
  } else {
    return null;
  }
}