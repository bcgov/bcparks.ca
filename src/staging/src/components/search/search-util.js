const searchParkByCriteria = (
  textOnly,
  protectedAreas,
  selectedActivities,
  selectedFacilities,
  searchText,
  camping,
  petFriendly,
  wheelchair,
  marine,
  ecoReserve,
  electricalHookup
) => {
  const textResults = []
  const activityResults = []
  const facilityResults = []
  const activityNames = selectedActivities.map(a => a.label)
  const facilityNames = selectedFacilities.map(f => f.label)
  const campingResults = []
  const petResults = []
  const wheelchairResults = []
  const marineResults = []
  const ecoReserveResults = []
  const electricalHookupResults = []
  const quickSearchResults = {
    campingResults: campingResults,
    petResults: petResults,
    wheelchairResults: wheelchairResults,
    marineResults: marineResults,
    ecoReserveResults: ecoReserveResults,
    electricalHookupResults: electricalHookupResults,
  }
  // Track required results in each filter criteria.
  // This data is later used to perform array intersection.
  let requiredResults = {
    text: false,
    camping: false,
    petFriendly: false,
    wheelchair: false,
    marine: false,
    ecoReserve: false,
    electricalHookup: false,
    activity: false,
    facility: false,
  }

  let results = []

  // Iterate through each park and filter based on search criteria
  protectedAreas.forEach(park => {
    park.isOpenToPublic = true
    park.advisories = ["Wildfire Alert", "Road Closure Alert"]
    park.parkPhotos = [
      "/uploads/mt_assiniboine_photos_images_20_d4bfb5f8ec.jpg",
      "/uploads/mt_assiniboine_photos_images_19_0d09398ed7.jpg",
    ]
    park.isDayUsePass = true
    if (searchText && searchText.length > 0) {
      requiredResults.text = true
      searchParkNames(park, searchText, textResults)
      searchActivityText(park, searchText, textResults)
      searchFacilityText(park, searchText, textResults)
    }
    if (!textOnly) {
      filterQuickSearch(
        park,
        quickSearchResults,
        requiredResults,
        camping,
        petFriendly,
        wheelchair,
        marine,
        ecoReserve,
        electricalHookup
      )

      if (activityNames && activityNames.length > 0) {
        requiredResults.activity = true
        searchParkActivities(park, activityResults, activityNames)
      }

      if (facilityNames && facilityNames.length > 0) {
        requiredResults.facility = true
        searchParkFacilities(park, facilityResults, facilityNames)
      }
    }
  })

  // Return all parks if no filter criteria is selected
  if (
    selectedActivities.length === 0 &&
    selectedFacilities.length === 0 &&
    !camping &&
    !petFriendly &&
    !wheelchair &&
    !marine &&
    !ecoReserve &&
    !electricalHookup &&
    searchText.length === 0
  ) {
    return protectedAreas
  }

  // Return empty if any of the selected filter criteria has no parks
  if (
    (requiredResults.text && (!textResults || textResults.length === 0)) ||
    (requiredResults.camping &&
      (!campingResults || campingResults.length === 0)) ||
    (requiredResults.petFriendly && (!petResults || petResults.length === 0)) ||
    (requiredResults.wheelchair &&
      (!wheelchairResults || wheelchairResults.length === 0)) ||
    (requiredResults.marine &&
      (!marineResults || marineResults.length === 0)) ||
    (requiredResults.ecoReserve &&
      (!ecoReserveResults || ecoReserveResults.length === 0)) ||
    (requiredResults.electricalHookup &&
      (!electricalHookupResults || electricalHookupResults.length === 0)) ||
    (requiredResults.activity &&
      (!activityResults || activityResults.length === 0)) ||
    (requiredResults.facility &&
      (!facilityResults || facilityResults.length === 0))
  ) {
    return []
  }

  let isResultAvailable = false

  // Consolidate text search results -> 1
  if (textResults.length > 0) {
    results = [...textResults]
    isResultAvailable = true
  }

  if (!textOnly) {
    // Consolidate quick search results through array intersection (n)
    let groupedQuickSearchResults = []
    let isQuickSearchResultAvailable = false

    // Camping checkbox -> 2
    if (campingResults.length > 0) {
      groupedQuickSearchResults = [...campingResults]
      isQuickSearchResultAvailable = true
    }
    // Dog friendly checkbox -> 3 = 2 n 3
    if (petResults.length > 0) {
      if (isQuickSearchResultAvailable) {
        groupedQuickSearchResults = groupedQuickSearchResults.filter(t =>
          petResults.includes(t)
        )
      } else {
        groupedQuickSearchResults = [...petResults]
        isQuickSearchResultAvailable = true
      }
    }
    // Wheelchair checkbox -> 4 = 3 n 4
    if (wheelchairResults.length > 0) {
      if (isQuickSearchResultAvailable) {
        groupedQuickSearchResults = groupedQuickSearchResults.filter(t =>
          wheelchairResults.includes(t)
        )
      } else {
        groupedQuickSearchResults = [...wheelchairResults]
        isQuickSearchResultAvailable = true
      }
    }
    // Marine area checkbox -> 5 = 4 n 5
    if (marineResults.length > 0) {
      if (isQuickSearchResultAvailable) {
        groupedQuickSearchResults = groupedQuickSearchResults.filter(t =>
          marineResults.includes(t)
        )
      } else {
        groupedQuickSearchResults = [...marineResults]
        isQuickSearchResultAvailable = true
      }
    }
    // Ecological reserve checkbox -> 6 = 5 n 6
    if (ecoReserveResults.length > 0) {
      if (isQuickSearchResultAvailable) {
        groupedQuickSearchResults = groupedQuickSearchResults.filter(t =>
          ecoReserveResults.includes(t)
        )
      } else {
        groupedQuickSearchResults = [...ecoReserveResults]
        isQuickSearchResultAvailable = true
      }
    }
    // Electrical hookups checkbox -> 7 = 6 n 7
    if (electricalHookupResults.length > 0) {
      if (isQuickSearchResultAvailable) {
        groupedQuickSearchResults = groupedQuickSearchResults.filter(t =>
          electricalHookupResults.includes(t)
        )
      } else {
        groupedQuickSearchResults = [...electricalHookupResults]
        isQuickSearchResultAvailable = true
      }
    }

    // Consolidate text results and quick search results -> 8 = 1 n 7
    if (isQuickSearchResultAvailable) {
      if (groupedQuickSearchResults.length > 0) {
        if (isResultAvailable) {
          results = results.filter(t => groupedQuickSearchResults.includes(t))
        } else {
          results = [...groupedQuickSearchResults]
          isResultAvailable = true
        }
      } else {
        return []
      }
    }

    // Consolidate activity select results through array intersection -> 9 = 8 n 9
    if (activityResults.length > 0) {
      if (isResultAvailable) {
        results = results.filter(t => activityResults.includes(t))
      } else {
        results = [...activityResults]
        isResultAvailable = true
      }
    }
    // Consolidate facility select results through array intersection -> 10 = 9 n 10
    if (facilityResults.length > 0) {
      if (isResultAvailable) {
        results = results.filter(t => facilityResults.includes(t))
      } else {
        results = [...facilityResults]
        isResultAvailable = true
      }
    }
  }
  return results
}

// Run text search on park names
const searchParkNames = (park, searchText, textResults) => {
  if (park && park.parkNames) {
    park.parkNames.forEach(name => {
      if (name.parkName.toLowerCase().includes(searchText.toLowerCase())) {
        if (!textResults.includes(park)) {
          textResults.push(park)
        }
      }
    })
  }
}

// Run text search on park activities
const searchActivityText = (park, keyword, textResults) => {
  if (park && park.parkActivities) {
    park.parkActivities.forEach(activity => {
      const name = activity.name.split(":")[1]
      if (
        name.toLowerCase().includes(keyword.toLowerCase()) &&
        activity.isActive &&
        activity.isActivityOpen &&
        !textResults.includes(park)
      ) {
        textResults.push(park)
      }
    })
  }
}

// Run text search on park facilities
const searchFacilityText = (park, keyword, textResults) => {
  if (park && park.parkFacilities) {
    park.parkFacilities.forEach(facility => {
      const name = facility.name.split(":")[1]
      if (
        name.toLowerCase().includes(keyword.toLowerCase()) &&
        facility.isActive &&
        facility.isFacilityOpen &&
        !textResults.includes(park)
      ) {
        textResults.push(park)
      }
    })
  }
}

// Filter based on quick search checkbox selections
const filterQuickSearch = (
  park,
  quickSearchResults,
  requiredResults,
  camping,
  petFriendly,
  wheelchair,
  marine,
  ecoReserve,
  electricalHookup
) => {
  if (camping) {
    requiredResults.camping = true
    searchActivityText(park, "camping", quickSearchResults.campingResults)
    searchFacilityText(park, "camping", quickSearchResults.campingResults)
  }
  if (petFriendly) {
    requiredResults.petFriendly = true
    searchActivityText(park, "pets on leash", quickSearchResults.petResults)
  }
  if (wheelchair) {
    requiredResults.wheelchair = true
    searchFacilityText(
      park,
      "accessibility information",
      quickSearchResults.wheelchairResults
    )
  }
  if (marine) {
    requiredResults.marine = true
    if (
      park.marineProtectedArea === "Y" &&
      !quickSearchResults.marineResults.includes(park)
    ) {
      quickSearchResults.marineResults.push(park)
    }
  }
  if (ecoReserve) {
    requiredResults.ecoReserve = true
    if (
      park.typeCode === "ER" &&
      !quickSearchResults.ecoReserveResults.includes(park)
    ) {
      quickSearchResults.ecoReserveResults.push(park)
    }
  }
  if (electricalHookup) {
    requiredResults.electricalHookup = true
    searchFacilityText(
      park,
      "electrical hookup",
      quickSearchResults.electricalHookupResults
    )
  }
}

// Filter based on park activities dropdown selections
const searchParkActivities = (park, activityResults, activityNames) => {
  if (park && park.parkActivities) {
    // Track all selected activities
    let count = 0
    let addedActivity = []
    park.parkActivities.forEach(activity => {
      const name = activity.name.split(":")[1]
      if (
        activityNames.includes(name) &&
        activity.isActive &&
        activity.isActivityOpen &&
        !addedActivity.includes(name)
      ) {
        addedActivity.push(name)
        count++
      }
    })
    if (count === activityNames.length && !activityResults.includes(park)) {
      activityResults.push(park)
    }
  }
}

// Filter based on park facilities dropdown selections
const searchParkFacilities = (park, facilityResults, facilityNames) => {
  if (park && park.parkFacilities) {
    // Track all selected facilities
    let count = 0
    let addedFacility = []
    park.parkFacilities.forEach(facility => {
      const name = facility.name.split(":")[1]
      if (
        facilityNames.includes(name) &&
        facility.isActive &&
        facility.isFacilityOpen &&
        !addedFacility.includes(name)
      ) {
        addedFacility.push(name)
        count++
      }
    })
    if (count === facilityNames.length && !facilityResults.includes(park)) {
      facilityResults.push(park)
    }
  }
}

const labelCompare = (a, b) => {
  if (a.label.toLowerCase() < b.label.toLowerCase()) {
    return -1
  }
  if (a.label.toLowerCase() > b.label.toLowerCase()) {
    return 1
  }
  return 0
}

const sortAsc = (a, b) => {
  if (a.protectedAreaName.toLowerCase() < b.protectedAreaName.toLowerCase()) {
    return -1
  }
  if (a.protectedAreaName.toLowerCase() > b.protectedAreaName.toLowerCase()) {
    return 1
  }
  return 0
}

const sortDesc = (a, b) => {
  if (a.protectedAreaName.toLowerCase() > b.protectedAreaName.toLowerCase()) {
    return -1
  }
  if (a.protectedAreaName.toLowerCase() < b.protectedAreaName.toLowerCase()) {
    return 1
  }
  return 0
}

// TODO Remove all code above this and uncomment below
// const labelCompare = (a, b) => {
//   if (a.label.toLowerCase() < b.label.toLowerCase()) {
//     return -1
//   }
//   if (a.label.toLowerCase() > b.label.toLowerCase()) {
//     return 1
//   }
//   return 0
// }

const compare = (a, b) => {
  if (a.toLowerCase() < b.toLowerCase()) {
    return -1
  }
  if (a.toLowerCase() > b.toLowerCase()) {
    return 1
  }
  return 0
}

export { searchParkByCriteria, labelCompare, sortAsc, sortDesc, compare }
