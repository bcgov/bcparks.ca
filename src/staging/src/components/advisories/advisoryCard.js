import React, { useState } from "react"
import Accordion from "react-bootstrap/Accordion"
import Card from "react-bootstrap/Card"
import Col from "react-bootstrap/Col"
import Row from "react-bootstrap/Row"
import { Link } from "gatsby"

import HTMLArea from "../HTMLArea"

import "../../styles/advisories/advisoryCard.scss"

const AdvisoryCard = ({ advisory, index }) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Row
        className={advisory.detailsClass + " mb-2"}
        key={advisory.id}
        thing={advisory.isFirstInYear.toString()}
      >
        <Col
          onClick={() => {
            setOpen(!open)
          }}
        >
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
          <Accordion aria-controls={advisory.cardTitle} id={advisory.id}>
            <Accordion.Toggle
              as={Card}
              eventKey="0"
              className={
                (advisory.description ? "" : "noDetails ") + "advisoryCard"
              }
            >
              <Row className="p-2">
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
                        {advisory.protectedAreas.length > 0 &&
                          advisory.protectedAreas
                            .filter(
                              park => park.published_at && park.isDisplayed
                            )
                          .map((par, index) => (
                              <Link
                                className="parkLink my-2 badge badge-pill badge-light"
                                href={`/${
                                  par.slug
                                    ? par.slug
                                    : par.protectedAreaName
                                        .toLowerCase()
                                        .replace(/ /g, "-")
                                }`}
                                key={index}
                              >
                                  {par.protectedAreaName}
                              </Link>
                            ))}
                      </div>
                      <div>
                        <HTMLArea isVisible>{advisory.title}</HTMLArea>
                      </div>
                    </div>
                    <div
                      className={
                        advisory.description
                          ? "expandIcon d-flex align-items-center"
                          : "hidden"
                      }
                    >
                      <i
                        className={
                          (open ? "open " : "close ") + "fa fa-angle-down"
                        }
                      ></i>
                    </div>
                  </div>
                  <Accordion.Collapse eventKey="0">
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
                                style={{display: 'block'}}
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
                  </Accordion.Collapse>
                </Col>
              </Row>
            </Accordion.Toggle>
          </Accordion>
        </Col>
      </Row>
    </>
  )
}

export default AdvisoryCard
