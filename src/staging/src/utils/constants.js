import { makeStyles } from "@material-ui/core/styles"

export const PARK_NAME_TYPE = {
  Legal: 1,
  Escaped: 2,
  Phonetic: 3,
  Basic: 4,
  Alias: 5,
  Historic: 6,
}

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