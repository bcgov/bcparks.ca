import React from "react"

import HtmlContent from "./htmlContent"

export default function About({ parkType, natureAndCulture, biogeoclimaticZones, terrestrialEcosections, marineEcosections }) {
  return (
    <div id="about-this-park" className="anchor-link" >
      {/* id="park-about-container" should be removed once it's removed from the contents */}
      <span id="park-about-container"></span>
      {/* id="park-nature-and-culture-container" should be removed once it's removed from the contents */}
      <h2 id="park-nature-and-culture-container" className="section-heading">
        About this {parkType}
      </h2>
      <HtmlContent>{natureAndCulture}</HtmlContent>
      <ul>
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
    </div>
  )
}