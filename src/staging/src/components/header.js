import React from "react"
import MegaMenu from "./megaMenu.js"
import {
  Box
} from "@material-ui/core"

import InfoIcon from "@material-ui/icons/Info"
import { makeStyles } from "@material-ui/core/styles";
import "../styles/global.scss"

const useStyles = makeStyles(theme => ({
  // This extra styling is so that in mobile the improve link is below the beta message
  betaHeader: {
    minHeight: '44px',
    fontSize: "0.8rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "& a": {
      marginLeft: "5px",
      textDecoration: "none"
    },
    "& a:hover": {
      color: "#036"
    },
  },
  betaMsg: {

  },
  linkDivider: {
    margin: "0px 4px",
    [theme.breakpoints.down('sm')]: { // otherwise shifting margins
      display: "none"
    }
  },
  link: {
    "& a": { color: "#036" }
  },
  infoIcon: {
    height: "20px;",
    marginRight: "4px"
  }
}));

export default function Header({ children, mode = 'external', content = [] }) {
  const isBeta = true; // TODO set to false to remove beta banner
  const classes = useStyles();

  if (mode === 'internal') {
    return (
      <>
        <Box className={classes.betaHeader + " bc-bg-yellow bc-color-blue-dk"}>
          <InfoIcon className={classes.infoIcon} fontSize="small" />
          <Box className={classes.betaMsg}>
            
            This site is in beta
          </Box>
          <Box className={classes.linkDivider}>|</Box>
          <Box className={classes.link}>
            <a href="#">Help us improve this by submitting here</a>
          </Box>
        </Box>
        <MegaMenu content={content} />
        </>
    )
  }
  // TODO is the following case (i.e. mode="external") ever hit?
  return (
    <header id='header' dangerouslySetInnerHTML={{ __html: children }} />
  )
}