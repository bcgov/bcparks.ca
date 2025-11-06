/* 
  Remove extra data from parkDates for park and parkFeatures
  e.g. inactive or closed parkFeatures and data from past years
*/

const convertParkDates = function (parkDates) {
  const thisYear = new Date().getFullYear();
  return parkDates
    .filter(d =>
      d.operatingYear >= thisYear &&
      d.publishedAt !== null &&
      (d.startDate || d.endDate)
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
        parkFeatureTypeId: feature?.parkFeatureType?.featureTypeId,
        isIgnored: feature.closureAffectsAccessStatus === null ? null : !feature.closureAffectsAccessStatus,
        parkDates: feature.parkDates
          .filter(d =>
            d.operatingYear >= thisYear &&
            d.isActive &&
            d.publishedAt !== null &&
            (d.startDate && d.endDate)
          )
          .map(d => {
            delete d.id;
            delete d.publishedAt;
            return d;
          })
      }
      if (f.parkDates.length > 0) {
        results.push(f);
      }
    }
  }
  return results;
}

module.exports = {
  convertParkDates,
  convertParkFeatures
}
