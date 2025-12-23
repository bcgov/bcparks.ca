export const mapUrl = 
  "https://governmentofbc.maps.arcgis.com/apps/instant/basic/index.html?appid=4b3eb47c25ff45fa9f6bff45e3f2a389"

export const PARK_NAME_TYPE = {
  Legal: 1,
  Escaped: 2,
  Phonetic: 3,
  Basic: 4,
  Alias: 5,
  Historic: 6,
}

// dateTypeId from Strapi park-date-type
export const PARK_DATE_TYPE = {
  GATE: 1,
  TIER_1: 2,
  TIER_2: 3,
  WINTER_FEE: 4,
  DAY_USE_PASS: 5,
  OPERATION: 6,
  RESERVATION: 7,
  BACKCOUNTRY_REGISTRATION: 8,
  FIRST_COME_FIRST_SERVED: 9,
  FULL_SERVICES_AND_FEES: 10,
}

export const countsList = [
  // Use this to configure which counts show and in what order
  // Don't show if isActive is false
  {
    display: "Reservable frontcountry sites",
    countVar: "reservableSites",
    isActive: true,
  },
  {
    display: "Vehicle-accessible sites",
    countVar: "vehicleSites",
    isActive: true,
  },
  {
    display: "Double sites",
    countVar: "doubleSites",
    isActive: true,
  },
  {
    display: "Groupsites",
    countVar: "groupSites",
    isActive: true,
  },
  {
    display: "Walk-in sites",
    countVar: "walkInSites",
    isActive: true,
  },
  {
    display: "Backcountry sites",
    countVar: "backcountrySites",
    isActive: true,
  },
  {
    display: "Wilderness sites",
    countVar: "wildernessSites",
    isActive: true,
  },
  {
    display: "Boat-accessible sites",
    countVar: "boatAccessSites",
    isActive: true,
  },
  {
    display: "Horse-accessible sites",
    countVar: "horseSites",
    isActive: true,
  },
  {
    display: "RV-accessible sites",
    countVar: "rvSites",
    isActive: true,
  },
  {
    display: "Pull-through sites",
    countVar: "pullThroughSites",
    isActive: true,
  },
  {
    display: "Sites with electrical hook-ups",
    countVar: "electrifiedSites",
    isActive: true,
  },
  {
    display: "Long-stay sites",
    countVar: "longStaySites",
    isActive: true,
  },
  { display: "Cabins", countVar: "cabins", isActive: true },
  { display: "Huts", countVar: "huts", isActive: true },
  { display: "Yurts", countVar: "yurts", isActive: true },
  { display: "Shelters", countVar: "shelters", isActive: false },
  { display: "Boat launches", countVar: "boatLaunches", isActive: false },
  {
    display: "First-come, first-served frontcountry sites",
    countVar: "nonReservableSites",
    isActive: false,
  },
  {
    display: "Reservable vehicle-accessible sites",
    countVar: "vehicleSitesReservable",
    isActive: false,
  },
  {
    display: "Reservable RV-accessible sites",
    countVar: "rvSitesReservable",
    isActive: false,
  },
  { display: "TOTAL", countVar: "totalCapacity", isActive: false },
]