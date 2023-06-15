import React from "react"
import { styled } from '@mui/material/styles';
import { Link } from "gatsby"
import { Grid, Card, CardHeader, Avatar } from "@mui/material"

import accessibilityIcon from "../../images/park/accessibility.png"

const PREFIX = 'accessibility';

const classes = {
  card: `${PREFIX}-card`
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('div')({
  [`& .${classes.card}`]: {
    border: "none",
    boxShadow: "none",
  },
});

export default function Accessibility({ parkFacilities }) {
  const isAccessibility = parkFacilities.some(facility =>
    facility.facilityType.facilityName.toLowerCase().includes("accessibility")
  )

  return (
    <Root>
      {isAccessibility && (
        <Grid container item xs={12} sm={6} md={4}>
          <Card className={classes.card}>
            <CardHeader
              avatar={
                <Avatar
                  variant="square"
                  src={accessibilityIcon}
                  aria-label="accessibility information"
                  alt=""
                />
              }
              title={<Link to="#park-facility-container">Accessibility</Link>}
            />
          </Card>
        </Grid>
      )}
    </Root>
  );
}
