/* 
  Remove extra data from parkOperationDates and parkOperationSubAreaDates 
  e.g. inactive or closed subareas and data from past years
*/

const convertParkDates = function (parkDates) {
  const thisYear = new Date().getFullYear();
  return parkDates
    .filter(d =>
      d.operatingYear >= thisYear &&
      // dateTypeId 1 = gate dates
      d.parkDateType.dateTypeId === 1 &&
      d.protectedArea !== null &&
      d.publishedAt !== null &&
      (d.startDate || d.endDate)
    )
    .map(d => {
      delete d.id;
      delete d.publishedAt;
      return d;
    });
}

const convertParkOperationDates = function (parkOperationDates) {
  const thisYear = new Date().getFullYear();
  return parkOperationDates
    .filter(d =>
      d.operatingYear >= thisYear &&
      d.publishedAt !== null &&
      (d.gateOpenDate || d.gateCloseDate)
    )
    .map(d => {
      delete d.id;
      delete d.publishedAt;
      return d;
    });
}

const convertParkFeatures = function (parkFeatures) {
  const thisYear = new Date().getFullYear();
  const results = [];
  for (const feature of parkFeatures) {
    if (feature.isActive && feature.isOpen && feature.publishedAt !== null) {
      const f = {
        isActive: true,
        isOpen: true,
        parkFeatureTypeId: feature?.parkFeatureType?.id,
        isIgnored: feature.closureAffectsAccessStatus === null ? null : !feature.closureAffectsAccessStatus,
        parkFeatureDates: feature.parkDates
          .filter(d =>
            d.operatingYear >= thisYear &&
            d.isActive &&
            d.publishedAt !== null &&
            (d.startDate || d.endDate)
          )
          .map(d => {
            delete d.id;
            delete d.publishedAt;
            return d;
          })
      }
      if (sa.parkOperationSubAreaDates.length > 0) {
        results.push(sa);
      }
    }
  }
  return results;
}

const convertParkOperationSubAreas = function (parkOperationSubAreas) {
  const thisYear = new Date().getFullYear();
  const results = [];
  for (const subarea of parkOperationSubAreas) {
    if (subarea.isActive && subarea.isOpen && subarea.publishedAt !== null) {
      const sa = {
        isActive: true,
        isOpen: true,
        subAreaTypeId: subarea?.parkSubAreaType?.id,
        isIgnored: subarea.closureAffectsAccessStatus === null ? null : !subarea.closureAffectsAccessStatus,
        parkOperationSubAreaDates: subarea.parkOperationSubAreaDates
          .filter(d =>
            d.operatingYear >= thisYear &&
            d.isActive &&
            d.publishedAt !== null &&
            (d.openDate || d.closeDate)
          )
          .map(d => {
            delete d.id;
            delete d.publishedAt;
            return d;
          })
      }
      if (sa.parkOperationSubAreaDates.length > 0) {
        results.push(sa);
      }
    }
  }
  return results;
}

module.exports = {
  convertParkDates,
  convertParkOperationDates,
  convertParkFeatures,
  convertParkOperationSubAreas
}
