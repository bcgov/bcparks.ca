import React from "react"
import { parseISO, format } from "date-fns"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import HtmlContent from "./htmlContent"

// Helper function to format date
const formatDate = (str) => {
  const date = parseISO(str)
  return format(date, 'MMMM d, yyyy')
}

export const Guideline = ({ guide, reports }) => {
  const guidelineType = guide.guidelineType

  return (
    <Row className="guideline">
      <Col xs="auto" className="guideline--left">
        <FontAwesomeIcon icon={`fa-regular fa-${guidelineType.icon}`} />
      </Col>
      <Col className="guideline--right">
        <h4>{guide.title ? guide.title : guidelineType.defaultTitle}</h4>
        <HtmlContent>
          {guide.description.data.description ?
            guide.description.data.description : guidelineType.defaultDescription.data.defaultDescription}
        </HtmlContent>
        {(guidelineType.icon === "list-check" && reports?.length > 0) &&
          reports.map((report, index) => (
            <p key={index}>
              View the <a href={report.reportUrl}>{report.title} [PDF]</a>
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
    <>
      <h3>Visitor guidelines</h3>
      {sortedGuidelines.map((guide, index) => (
        <Guideline key={index} guide={guide} reports={trailReports} />
      ))}
    </>
  )
}
