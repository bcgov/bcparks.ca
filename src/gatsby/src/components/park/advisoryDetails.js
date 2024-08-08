import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"
import { parseJSON, format } from "date-fns"
import Accordion from "react-bootstrap/Accordion"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons"

import HtmlContent from "./htmlContent"
import blueAlertIcon from "../../images/park/blue-alert.svg"
import redAlertIcon from "../../images/park/red-alert.svg"
import yellowAlertIcon from "../../images/park/yellow-alert.svg"

import "../../styles/advisories/advisoryDetails.scss"

const formatDate = isoDate => {
  return isoDate ? format(parseJSON(isoDate), "MMMM d, yyyy") : ""
}

export default function AdvisoryDetails({ advisories, parkType }) {
  let expandedsInitial = []
  advisories.sort((a, b) => {
    return b.listingRank - a.listingRank
      || b?.urgency?.sequence - a?.urgency?.sequence
      || new Date(b.advisoryDate) - new Date(a.advisoryDate)
  }).forEach((advisory, index) => {
    expandedsInitial[index] = false
  })

  const [allExpanded, setAllExpanded] = useState(false)
  const [expandeds, setExpandeds] = useState(expandedsInitial)

  const handleChange = id => {
    expandeds[id] = !expandeds[id]
    setExpandeds([...expandeds])
  }

  const expandAll = isAllExpanded => {
    let expandeds = []
    advisories.forEach((advisory, index) => {
      expandeds[index] = isAllExpanded
    })
    setExpandeds(expandeds)
  }

  const advisoriesWithFormatting = advisories.map(advisory => {
    let alertIcon
    let alertColorCss
    switch (advisory.urgency.color) {
      case "blue":
        alertIcon = blueAlertIcon
        alertColorCss = "blue-alert"
        break
      case "red":
        alertIcon = redAlertIcon
        alertColorCss = "red-alert"
        break
      case "yellow":
        alertIcon = yellowAlertIcon
        alertColorCss = "yellow-alert"
        break
      default:
        alertIcon = blueAlertIcon
        alertColorCss = "blue-alert"
    }

    return {
      alertIcon,
      alertColorCss,
      formattedAdvisoryDate: formatDate(advisory.advisoryDate),
      formattedEffectiveDate: formatDate(advisory.effectiveDate),
      formattedEndDate: formatDate(advisory.endDate),
      formattedUpdatedDate: formatDate(advisory.updatedDate),
      ...advisory,
    }
  })

  useEffect(() => {
    setAllExpanded(expandeds.every(state => state))
  }, [expandeds])

  useEffect(() => {
    if (advisories.length === 1) {
      expandAll(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [advisories.length])

  return (
    <div id="advisories" className="mb-4">
      {/* id="park-advisory-details-container" should be removed once it's removed from the contents */}
      <h3 id="park-advisory-details-container">
        {`Advisories (${advisories.length})`}
      </h3>
      <Row>
        {advisories.length === 0 && (
          <Col>
            <p>
              There are no reported advisories for this {parkType}
            </p>
          </Col>
        )}
        {advisories.length > 0 && (
          <Col>
            {advisories.length > 1 && (
              <button
                onClick={() => {
                  expandAll(!allExpanded)
                  setAllExpanded(!allExpanded)
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    expandAll(!allExpanded)
                    setAllExpanded(!allExpanded)
                  }
                }}
                className="btn btn-link expand-link expand-icon"
              >
                {allExpanded ?
                  <>Collapse all <FontAwesomeIcon icon={faChevronUp} /></>
                  :
                  <>Expand all <FontAwesomeIcon icon={faChevronDown} /></>
                }
              </button>
            )}
            {advisoriesWithFormatting.map((advisory, index) => (
              <Accordion
                // React bootstrap accordions are designed to only have 1 item open at a time.
                // To allow multiple open at the same time, each item must be in its own accordion with only 1 element in it.
                // The following assigns each item its own activeKey IFF the item accordion is 'open'.
                // Otherwise the activeKey is set to null, effectively removing the 'open' state from the accordion.
                // This is a cheeky way to programmatically open one, some, or all items simultaneously.
                key={advisory.id}
                aria-controls={advisory.title}
                activeKey={expandeds[index] ? advisory.id : null}
                className={`advisory-accordion is-open--${expandeds[index]}`}
              >
                <Accordion.Toggle
                  as={"div"}
                  className="accordion-toggle"
                  eventKey={advisory.id}
                  onClick={() => handleChange(index)}
                >
                  <div className="d-flex justify-content-between">
                    <div className="d-flex align-items-center">
                      <img
                        src={advisory.alertIcon}
                        alt="advisory status icon"
                        className="advisory-status-icon"
                      ></img>
                      <HtmlContent className="accordion-header">{advisory.title}</HtmlContent>
                    </div>
                    <div className="d-flex align-items-center">
                      {expandeds[index] ?
                        <FontAwesomeIcon icon={faChevronUp} /> : <FontAwesomeIcon icon={faChevronDown} />
                      }
                    </div>
                  </div>
                </Accordion.Toggle>
                <Accordion.Collapse eventKey={advisory.id}>
                  <div className="accordion-content">
                    {advisory.description && (
                      <HtmlContent className="mb-2">
                        {advisory.description}
                      </HtmlContent>
                    )}
                    {advisory.links?.map(({ title, url, id }) => (
                      <p key={id}>
                        <a
                          href={url}
                          style={{ display: 'block' }}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {title}
                        </a>
                      </p>
                    ))}
                    {advisory.isEffectiveDateDisplayed &&
                      advisory.formattedEffectiveDate && (
                        <p>
                          In effect {advisory.formattedEffectiveDate}
                          {advisory.isEndDateDisplayed &&
                            advisory.formattedEndDate && (
                              <>
                                {" to "}
                                {advisory.formattedEndDate}
                              </>
                            )}
                        </p>
                      )}
                    {advisory.isAdvisoryDateDisplayed &&
                      advisory.formattedAdvisoryDate && (
                        <p>Posted {advisory.formattedAdvisoryDate}</p>
                      )}
                    {advisory.isUpdatedDateDisplayed &&
                      advisory.formattedUpdatedDate && (
                        <p>Updated {advisory.formattedUpdatedDate}</p>
                      )}
                  </div>
                </Accordion.Collapse>
              </Accordion>
            ))}
          </Col>
        )}
      </Row>
    </div>
  )
}

AdvisoryDetails.propTypes = {
  advisories: PropTypes.array.isRequired,
  parkType: PropTypes.string,
}
