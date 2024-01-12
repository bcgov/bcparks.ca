/* 
  Remove extra data from parkOperationDates and parkOperationSubAreaDates 
  e.g. inactive or closed subareas and data from past years
*/

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

const convertParkOperationSubAreas = function (parkOperationSubAreas) {
  const thisYear = new Date().getFullYear();
  const results = [];
  for (const subarea of parkOperationSubAreas) {
    if (subarea.isActive && subarea.isOpen && subarea.publishedAt !== null) {
      const sa = {
        isActive: true,
        isOpen: true,
        subareaTypeId: subarea?.parkSubAreaType?.id,
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
  convertParkOperationDates,
  convertParkOperationSubAreas
}
