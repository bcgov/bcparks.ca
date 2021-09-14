export function addProtectedAreasFromArea(
  area,
  field,
  selProtectedAreas,
  selSites,
  sites,
  areaList,
  protectedAreaList
) {
  if (!protectedAreaList) {
    protectedAreaList = [];
  }
  area[field].forEach((f) => {
    const relatedArea = areaList.find((a) => {
      return a.obj.id === f.id;
    });
    addProtectedAreas(
      relatedArea.obj.protectedAreas,
      sites,
      selProtectedAreas,
      selSites,
      protectedAreaList
    );
  });
  return protectedAreaList;
}

export function addProtectedAreas(
  protectedAreas,
  sites,
  selProtectedAreas,
  selSites,
  protectedAreaList
) {
  if (!protectedAreaList) {
    protectedAreaList = [];
  }
  const tempParkList = [];
  protectedAreas.forEach((park) => {
    if (!selProtectedAreas.includes(park.id)) {
      selProtectedAreas.push(park.id);
      tempParkList.push(park.id);
      protectedAreaList.push({ orcs: park.orcs, name: park.protectedAreaName });
    }
  });
  if (sites && sites.length > 0) {
    sites.forEach((site) => {
      if (
        !selSites.includes(site.id) &&
        tempParkList.includes(site.obj.protectedArea.id)
      ) {
        selSites.push(site.value);
      }
    });
  }
  protectedAreaList.sort(parkNameCompare);
  return protectedAreaList;
}

export function removeProtectedAreasFromArea(
  area,
  field,
  updatedProtectedAreas,
  areaList,
  sites,
  updatedSites
) {
  let parks = updatedProtectedAreas;
  area[field].forEach((f) => {
    const relatedArea = areaList.find((a) => {
      return a.obj.id === f.id;
    });
    let response = removeProtectedAreas(
      relatedArea.obj.protectedAreas,
      parks,
      sites,
      updatedSites
    );
    parks = response.updatedProtectedAreas;
    updatedSites = response.updatedSites;
  });
  return { updatedProtectedAreas: parks, updatedSites: updatedSites };
}

export function removeProtectedAreas(
  protectedAreas,
  parks,
  sites,
  updatedSites
) {
  const parkIds = protectedAreas.map((p) => p.id);
  parks = parks.filter((p) => !parkIds.includes(p.value));
  if (sites && sites.length > 0) {
    let siteIds = [];
    sites.forEach((site) => {
      if (parkIds.includes(site.obj.protectedArea.id)) {
        siteIds.push(site.value);
      }
    });
    updatedSites = updatedSites.filter((s) => !siteIds.includes(s.value));
  }
  return { updatedProtectedAreas: parks, updatedSites: updatedSites };
}

export function parkNameCompare(a, b) {
  if (a.name < b.name) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
  }
  return 0;
}
