import React from "react"
import { styled } from '@mui/material/styles';
import { Link } from "gatsby"
import { Grid, Card, CardHeader, Avatar } from "@mui/material"

import petsOnLeashIcon from "../../images/park/pets-on-leash.png"

const PREFIX = 'petsOnLeash';

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

export default function PetsOnLeash({ data }) {
  const petsOnLeash = data.some(
    activity => activity.activityCode === "PetsOnLeash"
  )

  return (
    <Root>
      {petsOnLeash && (
        <Grid container item xs={12} sm={6} md={4}>
          <Card className={classes.card}>
            <CardHeader
              avatar={
                <Avatar
                  variant="square"
                  src={petsOnLeashIcon}
                  aria-label="pets on leash"
                  alt=""
                />
              }
              title={<Link to="#park-activity-container">Pet on Leash</Link>}
            />
          </Card>
        </Grid>
      )}
    </Root>
  );
}
