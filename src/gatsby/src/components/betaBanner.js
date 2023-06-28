import React from "react"
import { styled } from '@mui/material/styles';
import { Box } from "@mui/material"
const PREFIX = 'betaBanner';

const classes = {
  betaHeader: `${PREFIX}-betaHeader`,
  linkDivider: `${PREFIX}-linkDivider`,
  infoIcon: `${PREFIX}-infoIcon`
};

const Root = styled('div')((
  {
    theme
  }
) => ({
  // This extra styling is so that in mobile the improve link is below the beta message
  [`& .${classes.betaHeader}`]: {
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
  [`& .${classes.linkDivider}`]: {
    margin: "0px 4px",
  },
  [`& .${classes.infoIcon}`]: {
    fontSize: "1.2rem",
    marginRight: "8px",
    [theme.breakpoints.down('sm')]: {
      fontSize: "0.7rem"
    }
  }
}));

export default function BetaBanner() {
  return (
    <Root>
      <Box className={classes.betaHeader + " bc-bg-yellow bc-color-blue-dk"}>
        <Box>Welcome to the new BC Parks website</Box>
        <Box className={classes.linkDivider}>|</Box>
        <Box>
          <a href="https://helpshapebc.gov.bc.ca/new-bcparks-ca-visitor-survey">
            Share your feedback
          </a>
        </Box>
      </Box>
    </Root>
  );
}