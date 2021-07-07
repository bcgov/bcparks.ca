export function addProtectedAreasFromArea(
  area,
  field,
  selProtectedAreas,
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
      selProtectedAreas,
      protectedAreaList
    );
  });
  return protectedAreaList;
}

export function addProtectedAreas(
  protectedAreas,
  selProtectedAreas,
  protectedAreaList
) {
  if (!protectedAreaList) {
    protectedAreaList = [];
  }
  protectedAreas.forEach((park) => {
    if (!selProtectedAreas.includes(park.id)) {
      selProtectedAreas.push(park.id);
      protectedAreaList.push({ orcs: park.orcs, name: park.protectedAreaName });
    }
  });
  protectedAreaList.sort(parkNameCompare);
  return protectedAreaList;
}

export function removeProtectedAreasFromArea(
  area,
  field,
  updatedProtectedAreas,
  areaList
) {
  let parks = updatedProtectedAreas;
  area[field].forEach((f) => {
    const relatedArea = areaList.find((a) => {
      return a.obj.id === f.id;
    });
    parks = removeProtectedAreas(relatedArea.obj.protectedAreas, parks);
  });
  return parks;
}

export function removeProtectedAreas(protectedAreas, parks) {
  const parkIds = protectedAreas.map((p) => p.id);
  parks = parks.filter((p) => !parkIds.includes(p.value));
  return parks;
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
