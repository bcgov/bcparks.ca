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

  const showFireCentres = advisory.fireCentres?.length > 0; // 1st priority
  const showFireZones = advisory.fireZones?.length > 0 && !showFireCentres; // 2nd priority
  const showRegions = advisory.regions?.length > 0 && !showFireCentres && !showFireZones; // 3rd priority
  const showSections = advisory.sections?.length > 0 && !showFireCentres && !showFireZones && !showRegions;  // 4th priority

  const checkAdditionalParks = () => {

    const advisoryFireCentres = advisory.fireCentres.map(c => { return c.id })
    const advisoryFireZones = advisory.fireZones.map(z => { return z.id })
    const advisoryRegions = advisory.regions.map(r => { return r.id })
    const advisorySections = advisory.sections.map(s => { return s.id })

    const parkCameFromFireCentre = (paKey) => {
      const parkFireCentres = parkInfoHash[paKey]?.fireCentres || [];
      return parkFireCentres.some(x => advisoryFireCentres.includes(x))
    }

    const parkCameFromFireZone = (paKey) => {
      const parkFireZones = parkInfoHash[paKey]?.fireZones || [];
      return parkFireZones.some(x => advisoryFireZones.includes(x))
    }

    const parkCameFromRegion = (paKey) => {
      const parkRegions = parkInfoHash[paKey]?.regions || [];
      return parkRegions.some(x => advisoryRegions.includes(x))
    }

    const parkCameFromSection = (paKey) => {
      const parkSections = parkInfoHash[paKey]?.sections || [];
      return parkSections.some(x => advisorySections.includes(x))
    }

    for (const pa of advisory.protectedAreas) {
      const paKey = pa.id.toString();
      if (showFireCentres && !parkCameFromFireCentre(paKey)) {
        return true;
      }
      if (showFireZones && !parkCameFromFireZone(paKey)) {
        return true;
      }
      if (showRegions && !parkCameFromRegion(paKey)) {
        return true;
      }
      if (showSections && !parkCameFromSection(paKey)) {
        return true;
      }
    }

    return false;
  }

  const hasAdditionalParks = checkAdditionalParks();

  const sentenceCase = (areaName, upperCaseWord) => {
    const lowerCaseWord = upperCaseWord.toLowerCase()
    return areaName.replace(upperCaseWord, lowerCaseWord)
  }

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
                    <div>
                      {showFireCentres && advisory.fireCentres.map(
                        (fireCentre, index) => (
                          <Link
                            className="parkLink badge badge-pill badge-primary mb-2 mr-2"
                            key={index}
                          >
                            {sentenceCase(fireCentre.fireCentreName, "Fire Centre")}
                          </Link>
                        ))}
                      {showFireZones && advisory.fireZones.map(
                        (fireZone, index) => (
                          <Link
                            className="parkLink badge badge-pill badge-primary mb-2 mr-2"
                            key={index}
                          >
                            {sentenceCase(fireZone.fireZoneName, "Fire Zone")}
                          </Link>
                        ))}
                      {showRegions && advisory.regions.map(
                        (region, index) => (
                          <Link
                            className="parkLink badge badge-pill badge-primary mb-2 mr-2"
                            key={index}
                          >
                            {region.regionName} region
                          </Link>
                        ))}
                      {showSections && advisory.sections.map(
                        (section, index) => (
                          <Link
                            className="parkLink badge badge-pill badge-primary mb-2 mr-2"
                            key={index}
                          >
                            {section.sectionName} section
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
