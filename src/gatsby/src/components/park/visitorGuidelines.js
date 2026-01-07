import React from "react"
import { parseISO, format } from "date-fns"
import _ from "lodash"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import HtmlContent from "../htmlContent"
import FontAwesome from "../fontAwesome"

// Helper function to format date
const formatDate = (str) => {
  const date = parseISO(str)
  return format(date, 'MMMM d, yyyy')
}

// Helper function to add cache buster to URL based on an ISO date
const addCacheBuster = (url, isoDate) => {
  const cacheBuster = new Date(isoDate).getTime()
  const separator = url.includes("?") ? "&" : "?"
  return `${url}${separator}cb=${cacheBuster}`
}

export const Guideline = ({ guide, reports }) => {
  const guidelineType = guide.guidelineType
  const guidelineTypeIcon = guidelineType?.icon ? _.kebabCase(guidelineType.icon) : ""

  return (
    <Row className="guideline">
      <Col xs="auto" className="guideline--left">
        {guidelineTypeIcon && <FontAwesome icon={guidelineTypeIcon} />}
      </Col>
      <Col className="guideline--right">
        <h4>{guide.title ? guide.title : guidelineType.defaultTitle}</h4>
        <HtmlContent>
          {guide.description?.data?.description ?
            guide.description.data.description : guidelineType.defaultDescription.data.defaultDescription}
        </HtmlContent>
        {(guidelineType.hasTrailReport && reports?.length > 0) &&
          reports.map((report, index) => (
            <p key={index}>
              View the{" "}
              <a
                href={addCacheBuster(report.reportUrl, report.updatedAt)}
                target="_blank"
                rel="noreferrer"
              >
                {report.title} [PDF]
              </a>
              {` (${formatDate(report.reportDate)})`}.
            </p>
          ))}
      </Col>
    </Row>
  )
}

export default function VisitorGuidelines({ guidelines, trailReports }) {
  // Filter guildelines by isActive and sort by rank
  const sortedGuidelines =
    guidelines.filter(guide => guide.isActive).sort((a, b) => {
      const rankA = a.rank || a.guidelineType.defaultRank
      const rankB = b.rank || b.guidelineType.defaultRank
      return rankA - rankB
    })
  return (
    <div id="visitor-guidelines">
      <h3>Visitor guidelines</h3>
      {sortedGuidelines.map((guide, index) => (
        <Guideline key={index} guide={guide} reports={trailReports} />
      ))}
    </div>
  )
}
