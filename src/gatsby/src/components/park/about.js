import React from "react"
import { parseISO, format } from "date-fns"
import { Paper, Grid } from "@material-ui/core"

import { capitalizeFirstLetter } from "../../utils/helpers";

import Heading from "./heading"
import HtmlContent from "./htmlContent"
import Spacer from "./spacer"

// TODO: this component needs to be converted to bootstrap but
// it should be done at the same time as the other sections
// to match spacing
export default function About({
  park
}) {
  const formattedEstablishedDate = park.establishedDate ? format(
    parseISO(park.establishedDate),
    "MMMM d, yyyy"
  ) : null
  const parkType = park.type ?? "park"
  const parkContact = park.parkContact.data.parkContact
  const natureAndCulture = park.natureAndCulture.data.natureAndCulture

  return (
    <Grid item xs={12} id="park-about-container" className="anchor-link">
      <Paper elevation={0}>
        <Heading>{capitalizeFirstLetter(`Learn more about this ${parkType}`)}</Heading>
        {(park.totalArea || park.establishedDate) && (
          <>
            <h3>{capitalizeFirstLetter(`${park.type} details`)}</h3>
            <ul>
              <li>
                <strong>Date established:</strong> {formattedEstablishedDate}
              </li>
              <li>
                <strong>Size:</strong> {park.totalArea} hectares
              </li>
            </ul>
          </>
        )}
        {(park.totalArea || park.establishedDate) && parkContact && <Spacer />}
        {parkContact && (
          <>
            <h3>{capitalizeFirstLetter(`${parkType} contact`)}</h3>
            <HtmlContent>{parkContact}</HtmlContent>
          </>
        )}
        {parkContact && natureAndCulture && <Spacer />}
        {natureAndCulture && (
          <>
            <h3>Nature and culture</h3>
            <HtmlContent>{natureAndCulture}</HtmlContent>
          </>
        )}
        <Spacer />
      </Paper>
    </Grid>
  )
}
