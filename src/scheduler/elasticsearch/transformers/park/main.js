const _ = require("lodash");
const geo = require("./geoshape");
const operatingDates = require("./operatingDates");

/**
 * Transforms a protectedArea retrieved from Strapi into a JSON format
 * that is optimized for Elasticsearch
 */

exports.createElasticPark = async function (park, photos) {
  if (!park || !park.isDisplayed || !park.publishedAt) {
    return null;
  }

  // convert marineProtectedArea to bool
  park.marineProtectedArea = park.marineProtectedArea === 'Y';

  // get photos
  park.parkPhotos = photos.filter((p) => p.orcs === park.orcs)
    .sort((a, b) => { return a.sortOrder > b.sortOrder ? 1 : -1 })
    .slice(0, 5)
    .map(p => { return p.imageUrl });

  // convert managementAreas to parkLocations
  park.parkLocations = [];
  if (park?.managementAreas?.length) {
    for (const ma of park.managementAreas) {
      park.parkLocations.push({
        searchAreaNum: ma.searchArea?.id,
        searchArea: ma.searchArea?.searchAreaName,
        regionNum: ma.section?.region?.regionNumber,
        region: ma.section?.region?.regionName,
        sectionNum: ma.section?.sectionNumber,
        section: ma.section?.sectionName,
        managementAreaNum: ma.managementAreaNumber,
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
        return n.parkName.toLowerCase();
      });
    park.parkNames = [...new Set(parkNames || [])];
  } else {
    park.parNames = [];
  }

  // add the searchTerms to the parkNames
  if (park.searchTerms && !park.parkNames.find(n => n === park.searchTerms.toLowerCase())) {
    park.parkNames.push(park.searchTerms.toLowerCase())
  }
  
  // store protectedAreaName as lowercase for sorting
  park.nameLowerCase = park.protectedAreaName.toLowerCase().replace(/\./g, '');

  // convert parkCampingTypes
  park.hasCamping = false;
  if (park?.parkCampingTypes?.length) {
    const parkCampingTypes = park.parkCampingTypes
      .filter(ct => {
        return ct.isActive && ct.campingType?.isActive;
      })
      .map(ct => {
        park.hasCamping = true;
        let campingTypeCode = ct.campingType.campingTypeCode;
        let campingTypeNumber = ct.campingType.campingTypeNumber;
        if (campingTypeCode === 'wilderness-camping') {
          campingTypeCode = 'backcountry-camping'
          campingTypeNumber = 36
        }
        return {
          code: campingTypeCode,
          num: campingTypeNumber
        };
      });
    park.parkCampingTypes = _.uniqBy(parkCampingTypes, 'code');
  }

  // convert parkFacilities
  if (park?.parkFacilities?.length) {
    park.parkFacilities = park.parkFacilities
      .filter(f => {
        return f.isActive && f.facilityType?.isActive;
      })
      .map(f => {
        return {
          code: f.facilityType.facilityCode,
          num: f.facilityType.facilityNumber
        };
      });
  }

  // convert parkActivities
  if (park?.parkActivities?.length) {
    park.parkActivities = park.parkActivities
      .filter(a => {
        return a.isActive && a.activityType?.isActive;
      })
      .map(a => {
        return {
          code: a.activityType.activityCode,
          num: a.activityType.activityNumber
        };
      });
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

  // add geo info
  let flattenedGeometry = [];
  if (park.geoShape?.geometry) {
    flattenedGeometry = geo.flatten(park.geoShape?.geometry.coordinates, 2);
  }

  // add geo center point (this ensures we have at least one point for every park)
  if (park.latitude && park.longitude) {
    park.location = `${park.latitude},${park.longitude}`
    flattenedGeometry = geo.appendPoint(flattenedGeometry, park.latitude, park.longitude, 2);
  }

  // add extra points for long line segments
  flattenedGeometry = geo.fillLongSegments(park.geoShape, flattenedGeometry, 2);

  // add the park boundary points 
  // this is a work-around because you can't sort by distance to a shape
  // in Elasticsearch
  park.geoBoundary = geo.outline(flattenedGeometry);

  // remove unnecessary operating dates
  park.parkOperationDates = operatingDates.convertParkOperationDates(park.parkOperationDates);

  // remove unnecessary subareas and subarea dates
  park.parkOperationSubAreas = operatingDates.convertParkOperationSubAreas(park.parkOperationSubAreas);

  // delete raw fields that were used for transformation
  delete park.isDisplayed;
  delete park.publishedAt;
  delete park.latitude;
  delete park.longitude;
  delete park.geoShape;
  delete park.searchTerms;
  
  return park;
};
