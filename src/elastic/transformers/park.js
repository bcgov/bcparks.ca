const axios = require("axios");

/**
 * Transforms a protectedArea retrieved from Strapi into a JSON format
 * that is optimized for Elasticsearch
 */

exports.createElasticPark = async function (park) {
  if (!park || !park.isDisplayed || !park.publishedAt) {
    return null;
  }

  // get photos
  const photosQuery = `${process.env.STRAPI_BASE_URL}/api/search/indexing/photos/${park.orcs}`;
  const response = await axios.get(photosQuery);
  park.parkPhotos = response.data;

  // convert managementAreas to parkLocations
  park.parkLocations = [];
  if (park?.managementAreas?.length) {
    for (const ma of park.managementAreas) {
      park.parkLocations.push({
        region: ma.section?.region?.regionName,
        section: ma.section?.sectionName,
        managementArea: ma.managementAreaName
      });
    }
  }
  delete park.managementAreas;

  // convert parkNames
  if (park.parkNames?.length) {
    let parkNames = park.parkNames
      .filter(n => n.parkNameType?.nameTypeId !== 2)
      .map(n => {
        return n.parkName;
      });
    park.parkNames = [...new Set(parkNames || [])];
  }

  // store protectedAreaName as lowercase for sorting
  park.nameLowerCase = park.protectedAreaName.toLowerCase();

  // convert parkFacilities
  if (park?.parkFacilities?.length) {
    const parkFacilities = park.parkFacilities
      .filter(f => {
        return f.isActive && f.facilityType?.isActive;
      })
      .map(f => {
        const { isActive, ...rest } = f.facilityType;
        rest.isCamping = rest.isCamping || false;
        rest.typeId = rest.id;
        delete rest.id;
        return rest;
      });
    park.parkFacilities = parkFacilities;
  }

  // convert parkActivities
  if (park?.parkActivities?.length) {
    const parkActivities = park.parkActivities
      .filter(f => {
        return f.isActive && f.activityType?.isActive;
      })
      .map(f => {
        const { isActive, ...rest } = f.activityType;
        rest.isCamping = rest.isCamping || false;
        rest.typeId = rest.id;
        delete rest.id;
        return rest;
      });
    park.parkActivities = parkActivities;
  }

  // convert publicAdvisories
  park.advisories = [];
  if (park?.publicAdvisories?.length) {
    const publicAdvisories = park.publicAdvisories
      .filter(a => {
        return a.advisoryStatus.code === "PUB";
      })
      .map(a => {
        return {
          id: a.id,
          urgencyId: a.urgency?.id,
          advisoryStatusId: a.advisoryStatus?.id,
          accessStatusId: a.accessStatus?.id
        };
      });
    park.advisories = publicAdvisories;
  }
  delete park.publicAdvisories;

  // delete fields that are only used for indexing
  delete park.isDisplayed;
  delete park.publishedAt;

  return park;
};
