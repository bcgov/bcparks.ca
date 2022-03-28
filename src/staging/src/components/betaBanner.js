import React from "react"
import { Link } from "gatsby"
import { Box } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles";

import "../styles/global.scss"

const useStyles = makeStyles(theme => ({
  // This extra styling is so that in mobile the improve link is below the beta message
  betaHeader: {
    minHeight: '55px',
    fontSize: "1rem",
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    "& a": {
      marginLeft: "5px",
      textDecoration: "underline",
      color: "#003366"
    },
    [theme.breakpoints.down('sm')]: {
      minHeight: '40px',
      fontSize: "0.8rem",
      padding: "5px"
    }
  },
  linkDivider: {
    margin: "0px 4px",
  },
  infoIcon: {
    fontSize: "1.2rem",
    marginRight: "8px",
    [theme.breakpoints.down('sm')]: {
      fontSize: "0.7rem"
    }
  }
}));

export default function BetaBanner() {
  const classes = useStyles();

  return (
    <Box className={classes.betaHeader + " bc-bg-yellow bc-color-blue-dk"}>
      <i className={"fa fa-info-circle " + classes.infoIcon}></i>
      <Box>This site is in<Link to="/intro">beta</Link></Box>
      <Box className={classes.linkDivider}>|</Box>
      <Box>
        <a href="https://chefs.nrs.gov.bc.ca/app/form/submit?f=62ae996e-0f0b-4c2c-a8ae-6a32bb1b046f">Feedback Form</a>
      </Box>
      <Box className={classes.linkDivider}>|</Box>
      <Box>Return to<a href="https://bcparks.ca/">bcparks.ca</a></Box>
    </Box>
  )
}