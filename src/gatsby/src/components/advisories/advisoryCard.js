import React, { useState } from "react"
import Col from "react-bootstrap/Col"
import Row from "react-bootstrap/Row"
import { Link } from "gatsby"

import HTMLArea from "../HTMLArea"

import "../../styles/advisories/advisoryCard.scss"

const AdvisoryCard = ({ advisory, index, parkInfoHash }) => {
  const [open, setOpen] = useState(false)
  const checkRelation = (orcs, orcsSite) => {
    return orcsSite?.includes(orcs?.toString())
  }

  const checkAdditionalParks = () => {

    const advisoryFireCentres = advisory.fireCentres.map(c => { return c.id })
    const advisoryRegions = advisory.regions.map(r => { return r.id })
    const advisorySections = advisory.sections.map(s => { return s.id })

    let hasAdditionalParks = false;

    const parkCameFromFireCentre = (protectedAreaId) => {
      if (!advisoryFireCentres.length) {
        return false;
      }
      const parkFireCentres = parkInfoHash[protectedAreaId.toString()]?.fireCentres || [];
      return parkFireCentres.filter(value => advisoryFireCentres.includes(value)).length > 0;
    }

    const parkCameFromRegion = (protectedAreaId) => {
      if (!advisoryRegions.length) {
        return false;
      }
      const parkRegions = parkInfoHash[protectedAreaId.toString()]?.regions || [];
      return parkRegions.filter(value => advisoryRegions.includes(value)).length > 0;
    }

    const parkCameFromSection = (protectedAreaId) => {
      if (!advisorySections.length) {
        return false;
      }
      const parkSections = parkInfoHash[protectedAreaId.toString()]?.sections || [];
      return parkSections.filter(value => advisorySections.includes(value)).length > 0;
    }

    for (const pa of advisory.protectedAreas) {
      if (showFireCentres) {
        hasAdditionalParks = hasAdditionalParks || !parkCameFromFireCentre(pa.id)
      }
      if (showRegions) {
        hasAdditionalParks = hasAdditionalParks || !parkCameFromRegion(pa.id)
      }
      if (showSections) {
        hasAdditionalParks = hasAdditionalParks || !parkCameFromSection(pa.id)
      }

      if (hasAdditionalParks) {
        break;
      }
    }

    return hasAdditionalParks;
  }

  const showFireCentres = advisory.fireCentres?.length > 0; // 1st priority
  const showRegions = advisory.regions?.length > 0 && !showFireCentres; // 2nd priority
  const showSections = advisory.sections?.length > 0 && !showFireCentres && !showRegions;  // 3rd priority
  const hasAdditionalParks = checkAdditionalParks();

  return (
    <>
      <Row
        className={advisory.detailsClass + " mb-2"}
        key={advisory.id}
        thing={advisory.isFirstInYear.toString()}
      >
        <Col>
          <div
            className={
              (advisory.isFirstInYear || index === 0) &&
                !advisory.advisoryDateObj.dateUnknown
                ? "yearHeader mt-1"
                : "hidden"
            }
          >
            {advisory.advisoryDateObj.yearStr}
          </div>
          <div
            className={"dateBanner d-md-none p-2 " + advisory.alertClass}
            aria-label={advisory.alertMsg}
          >
            <div
              className={
                advisory.advisoryDateObj.dateUnknown ? "hidden" : "d-md-none"
              }
            >
              {advisory.advisoryDateObj.str}
            </div>
            <div
              className={
                advisory.advisoryDateObj.dateUnknown
                  ? "dateUnknown d-md-none"
                  : "hidden"
              }
            >
              Ongoing
            </div>
          </div>
          <Row className="advisoryCard no-gutters p-2">
            <div className="d-none d-md-block p-2">
              <div className="dateArea" aria-label={advisory.alertMsg}>
                <div className={"dateCircle " + advisory.alertClass}>
                  <div className="dateDate">
                    {advisory.advisoryDateObj.dateStr}
                  </div>
                  <div className="dateMonth">
                    {advisory.advisoryDateObj.monthStr}
                  </div>
                  <div
                    className={
                      advisory.advisoryDateObj.dateUnknown
                        ? "hidden"
                        : "d-md-none"
                    }
                  >
                    {advisory.advisoryDateObj.str}
                  </div>
                  <div
                    className={
                      advisory.advisoryDateObj.dateUnknown
                        ? "dateUnknown d-md-none"
                        : "hidden"
                    }
                  >
                    Ongoing
                  </div>
                </div>
              </div>
            </div>
            <Col>
              <div className="d-flex justify-content-between align-items-center p-3">
                <div className="contentArea">
                  {advisory.eventType && (
                    <div className="cardTitle">
                      {advisory.eventType.eventType}
                    </div>
                  )}
                  <div>
                    {showFireCentres && advisory.fireCentres.map(
                      (fireCentre, index) => (
                        <Link
                          className="parkLink badge badge-pill badge-primary mb-2 mr-2"
                          key={index}
                        >
                          {fireCentre.fireCentreName}
                        </Link>
                      ))}
                    {showRegions && advisory.regions.map(
                      (region, index) => (
                        <Link
                          className="parkLink badge badge-pill badge-primary mb-2 mr-2"
                          key={index}
                        >
                          {region.regionName} Region
                        </Link>
                      ))}
                    {showSections && advisory.sections.map(
                      (section, index) => (
                        <Link
                          className="parkLink badge badge-pill badge-primary mb-2 mr-2"
                          key={index}
                        >
                          {section.sectionName} Section
                        </Link>
                      ))}
                    {hasAdditionalParks &&
                      <Link
                        className="parkLink badge-pill badge-secondary-light mb-2 mr-2"
                      >
                        Additional parks
                      </Link>
                    }
                  </div>
                  <div>
                    {advisory.protectedAreas.length > 5 ? (
                      <>
                        {open && (
                          <div>
                            {advisory.protectedAreas
                              .filter(
                                park => park.publishedAt && park.isDisplayed
                              )
                              .map((par, index) => (
                                <Link
                                  className="parkLink badge badge-pill badge-light mb-2 mr-2"
                                  to={`/${par.slug}`}
                                  key={index}
                                >
                                  {par.protectedAreaName}
                                </Link>
                              ))
                            }
                          </div>
                        )}
                        <button
                          className="btn btn-link"
                          onClick={() => setOpen(!open)}
                        >
                          {open
                            ? `Hide parks affected`
                            : `Show all ${advisory.protectedAreas.length} parks affected`
                          }
                        </button>
                      </>
                    ) : (
                      <div>
                        {advisory.protectedAreas.length > 0 &&
                          advisory.protectedAreas
                            .filter(
                              park => park.publishedAt && park.isDisplayed
                            )
                            .map((par, index) => (
                              <Link
                                className="parkLink badge badge-pill badge-light mb-2 mr-2"
                                to={`/${par.slug}`}
                                key={index}
                              >
                                {par.protectedAreaName}
                              </Link>
                            ))
                        }
                        {advisory.sites.length > 0 &&
                          advisory.sites
                            .filter(
                              site => site.publishedAt && site.isDisplayed
                            )
                            .map((site, index) => (
                              advisory.protectedAreas.map((park, index) => (
                                checkRelation(park.orcs, site.orcsSiteNumber) &&
                                <Link
                                  className="parkLink badge badge-pill badge-light mb-2 mr-2"
                                  to={`/${park.slug}/${site.slug}`}
                                  key={index}
                                >
                                  {park.protectedAreaName} – {site.siteName}
                                </Link>
                              ))
                            ))
                        }
                      </div>
                    )}
                  </div>
                  <div>
                    <HTMLArea isVisible>{advisory.title}</HTMLArea>
                  </div>
                </div>
              </div>
              <div>
                {advisory.description && (
                  <>
                    <div className="detailsArea p-3">
                      {advisory.isEffectiveDateDisplayed &&
                        advisory.effectiveDate && (
                          <>
                            <br />
                            <p>
                              In effect {advisory.effectiveDateObj.str}
                              {advisory.isEndDateDisplayed &&
                                advisory.endDate && (
                                  <>
                                    {" to "}
                                    {advisory.endDateObj.str}
                                  </>
                                )}
                            </p>
                          </>
                        )}
                      <HTMLArea isVisible>
                        {advisory.description}
                      </HTMLArea>
                      {advisory.links?.map(({ title, url, id }) => (
                        <a
                          href={url}
                          style={{ display: 'block' }}
                          target="_blank"
                          rel="noopener noreferrer"
                          key={id}
                        >
                          {title}
                        </a>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  )
}

export default AdvisoryCard
