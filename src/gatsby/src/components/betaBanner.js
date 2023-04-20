import React from "react"
import { Box } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles";

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
      <Box>Welcome to the new BC Parks website</Box>
      <Box className={classes.linkDivider}>|</Box>
      <Box>
        <a href="https://helpshapebc.gov.bc.ca/new-bcparks-ca-visitor-survey">
          Share your feedback
        </a>
      </Box>
    </Box>
  )
}