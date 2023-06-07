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
  const biogeoclimaticZones = park.biogeoclimaticZones
  const marineEcosections = park.marineEcosections
  const terrestrialEcosections = park.terrestrialEcosections

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
              {biogeoclimaticZones?.length > 0 && (
                <li className="ecological-list">
                  <strong>
                    <a href="https://catalogue.data.gov.bc.ca/dataset/bec-zones-generalized-1-2m-">
                      Biogeoclimatic zone:
                    </a>
                  </strong>
                  <ul>
                    {biogeoclimaticZones.map((bioZone, index) => (
                      <li key={index}>
                        {bioZone.zone}
                        {biogeoclimaticZones.length > 1 && index+1 !== biogeoclimaticZones.length && (",")}
                      </li>
                    ))}
                  </ul>
                </li>
              )}
              {terrestrialEcosections?.length > 0 && (
                <li className="ecological-list">
                  <strong>
                    <a href="https://catalogue.data.gov.bc.ca/dataset/ecosections-ecoregion-ecosystem-classification-of-british-columbia">
                      Terrestrial ecosection:
                    </a>
                  </strong>
                  <ul>
                    {terrestrialEcosections.map((terreSection, index) => (
                      <li key={index}>
                        {terreSection.terrestrialEcosection}
                        {terrestrialEcosections.length > 1 && index+1 !== terrestrialEcosections.length && (",")}
                      </li>
                    ))}
                  </ul>
                </li>
              )}
              {marineEcosections?.length > 0 && (
                <li className="ecological-list">
                  <strong>
                    <a href="https://catalogue.data.gov.bc.ca/dataset/marine-ecosections-coastal-resource-information-management-system-crims">
                      Marine ecosection:
                    </a>
                  </strong>
                  <ul>
                    {marineEcosections.map((marineSection, index) => (
                      <li key={index}>
                        {marineSection.marineEcosection}
                        {marineEcosections.length > 1 && index+1 !== marineEcosections.length && (",")}
                      </li>
                    ))}
                  </ul>
                </li>
              )}
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
        <Spacer />
      </Paper>
    </Grid>
  )
}
