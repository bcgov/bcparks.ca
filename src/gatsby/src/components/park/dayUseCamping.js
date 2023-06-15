import React from "react"
import { styled } from '@mui/material/styles';
import { Link } from "gatsby"
import { Grid, Card, CardHeader, Avatar } from "@mui/material"

import dayUseIcon from "../../images/park/day-use.png"

const PREFIX = 'dayUseCamping';

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

export default function DayUseCamping({ data }) {
  const hasCamping = data.parkFacilities.some(facility =>
    facility.facilityType.facilityName.toLowerCase().includes("camping")
  )

  let title = []
  if (data.hasDayUsePass) title.push("Day Use")
  if (hasCamping) title.push("Camping")

  return (
    <Root>
      {(hasCamping || data.hasDayUsePass) && (
        <Grid container item xs={12} sm={6} md={4}>
          <Card className={classes.card}>
            <CardHeader
              avatar={
                <Avatar
                  variant="square"
                  src={dayUseIcon}
                  aria-label="day use"
                  alt=""
                />
              }
              title={
                <Link to="#park-facility-container">
                  {title.join(" and ")} offered at this park
                </Link>
              }
            />
          </Card>
        </Grid>
      )}
    </Root>
  );
}
