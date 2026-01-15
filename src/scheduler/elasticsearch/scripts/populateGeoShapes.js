const axios = require("axios");
const qs = require("qs");
const { getLogger } = require("../../shared/logging");
const { cmsAxios } = require("../../shared/axiosConfig");

/**
 * Populates the Geo-shapes collection in Strapi
 */
exports.populateGeoShapes = async function (options) {
  const logger = getLogger();
  const query = qs.stringify(
    {
      fields: ["orcs", "typeCode"],
      filters: {
        geoShape: {
          geometry: {
            $null: true,
          },
        },
      },
      populate: {
        geoShape: { fields: ["orcs"] },
      },
      pagination: {
        limit: -1,
      },
      publicationState: "preview",
      sort: "orcs",
    },
    {
      encodeValuesOnly: true,
    }
  );

  let parks;
  try {
    const allParks = `/api/protected-areas?${query}&filters[typeCode][$ne]=CS`;
    parks = await cmsAxios.get(allParks);
    if (parks.data.data.length > 0 || !options?.silent) {
      logger.info(`found ${parks.data.data.length} parks, pa's and er's without geo-shapes`);
    }
  } catch (error) {
    logger.error(`populateGeoShapes.js failed while getting parks, pa's and er's: ${error}`);
    return;
  }
  await processParkList(parks);

  let conservancies;
  try {
    const allConservancies = `/api/protected-areas?${query}&filters[typeCode][$eq]=CS`;
    conservancies = await cmsAxios.get(allConservancies);
    if (conservancies.data.data.length > 0 || !options?.silent) {
      logger.info(`found ${conservancies.data.data.length} conservancies without geo-shapes`);
    }
  } catch (error) {
    logger.error(`populateGeoShapes.js failed while getting conservancies: ${error}`);
    return;
  }
  await processParkList(conservancies);
};

const processParkList = async function (parks) {
  const logger = getLogger();
  for (const park of parks.data.data) {
    if (park.geoShape.data === null) {
      const { orcs, typeCode } = park;
      if (orcs) {
        logger.info(`getting geo-shape for orcs ${orcs}`);
        let shape;
        try {
          shape = await getGeoShape(orcs, typeCode);
        } catch (error) {
          logger.warn("error getting geoshape from openmaps.gov.bc.ca:");
          logger.warn(error);
          continue;
        }
        let geoShape;
        if (shape !== null) {
          geoShape = {
            protectedArea: park.id,
            geometry: shape,
            orcs: park.orcs,
            isEmpty: false,
          };
        } else {
          geoShape = {
            protectedArea: park.id,
            geometry: [],
            orcs: park.orcs,
            isEmpty: true,
          };
        }
        try {
          await cmsAxios.post("/api/geo-shapes", { data: geoShape });
        } catch (error) {
          logger.error(`populateGeoShapes.js failed saving geoshape: ${error}`);
          continue;
        }
      }
    }
  }
};

const getGeoShape = async function (orcs, typeCode) {
  orcs = orcs.toString().padStart(4, "0");
  let shapeQuery = process.env.GEOSHAPE_URL.replace("{0}", orcs);
  if (typeCode === "CS") {
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
};
