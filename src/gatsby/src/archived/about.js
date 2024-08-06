import React from "react"
import { parseISO, format } from "date-fns"

import { capitalizeFirstLetter } from "../utils/helpers";
import HtmlContent from "../components/park/htmlContent"

export default function About({ park }) {
  const formattedEstablishedDate = park.establishedDate ? format(
    parseISO(park.establishedDate),
    "MMMM d, yyyy"
  ) : null
  const parkType = park.type ?? "park"
  const parkContact = park.parkContact.data.parkContact
  const biogeoclimaticZones = park.biogeoclimaticZones
  const marineEcosections = park.marineEcosections
  const terrestrialEcosections = park.terrestrialEcosections
  const marineProtectedArea = park.marineProtectedArea

  return (
    <div id="park-about-container" className="anchor-link">
      <h2 className="section-heading">{capitalizeFirstLetter(`Learn more about this ${parkType}`)}</h2>
      {(park.totalArea || park.establishedDate) && (
        <>
          <h3>{capitalizeFirstLetter(`${park.type} details`)}</h3>
          <ul>
            {park.establishedDate && (
              <li>
                <strong>Date established:</strong> {formattedEstablishedDate}
              </li>
            )}
            {park.totalArea && (
              <li>
                <strong>Size:</strong>
                {marineProtectedArea === "Y" ?
                  <>
                    {" "}{park.totalArea.toLocaleString("en-CA")} hectares
                    {(park.uplandArea || park.marineArea) && ' ('}
                    {park.uplandArea && park.uplandArea.toLocaleString("en-CA") + ' ha upland'}
                    {(park.uplandArea && park.marineArea) && ' and '}
                    {park.marineArea && park.marineArea.toLocaleString("en-CA") + ' ha foreshore'}
                    {(park.uplandArea || park.marineArea) && ')'}
                  </>
                  :
                  <>
                    {" "}{park.totalArea.toLocaleString("en-CA")} hectares
                  </>
                }
              </li>
            )}
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
                      {biogeoclimaticZones.length > 1 && index + 1 !== biogeoclimaticZones.length && (",")}
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
                      {terrestrialEcosections.length > 1 && index + 1 !== terrestrialEcosections.length && (",")}
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
                      {marineEcosections.length > 1 && index + 1 !== marineEcosections.length && (",")}
                    </li>
                  ))}
                </ul>
              </li>
            )}
          </ul>
        </>
      )}
      {parkContact && (
        <>
          <h3>{capitalizeFirstLetter(`${parkType} contact`)}</h3>
          <HtmlContent>{parkContact}</HtmlContent>
        </>
      )}
    </div>
  )
}
