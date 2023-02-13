import { makeStyles } from "@material-ui/core/styles"

export const PARK_NAME_TYPE = {
  Legal: 1,
  Escaped: 2,
  Phonetic: 3,
  Basic: 4,
  Alias: 5,
  Historic: 6,
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

// for stylings
const drawerWidth = 230
export const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
  },
  parkContent: {
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${drawerWidth}px)`,
    },
    "& > div:last-of-type": {
      minHeight: "600px"
    }
  },
  appBarOffset: theme.mixins.toolbar,
}))