import React from "react"
import MegaMenu from "./megaMenu.js"
import {
  Box
} from "@material-ui/core"

import { makeStyles } from "@material-ui/core/styles";
import "../styles/global.scss"

const useStyles = makeStyles(theme => ({
  // This extra styling is so that in mobile the improve link is below the beta message
  betaHeader: {
    minHeight: '55px',
    fontSize: "1rem", 
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
    [theme.breakpoints.down('sm')]: {
      minHeight: '36px',
      fontSize: "0.7rem"
    }
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
    fontSize: "1.2rem",  
    marginRight: "8px",
    [theme.breakpoints.down('sm')]: { 
      fontSize: "0.7rem"
    }
  }
}));

export default function Header({ children, mode = 'external', content = [] }) {
  const classes = useStyles();

  if (mode === 'internal') {
    return (
      <>
        <Box className={classes.betaHeader + " bc-bg-yellow bc-color-blue-dk"}>
          <i className={'fa fa-info-circle ' + classes.infoIcon }></i>
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
}