import React from "react"
import { Link } from "gatsby"
import { makeStyles } from "@material-ui/core/styles"
import { Grid, Card, CardHeader, Avatar } from "@material-ui/core"

import petsOnLeashIcon from "../../images/park/pets-on-leash.png"

const useStyles = makeStyles({
  card: {
    border: "none",
    boxShadow: "none",
  },
})

export default function PetsOnLeash({ data }) {
  const classes = useStyles()

  const petsOnLeash = data.some(
    activity => activity.activityCode === "PetsOnLeash"
  )

  return (
    <>
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
    </>
  )
}
