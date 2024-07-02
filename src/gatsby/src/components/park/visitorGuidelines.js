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

export const Guideline = ({ guide }) => {
  const guidelineType = guide.guidelineType
  const media = guide.mediaLink

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
        {media !== null &&
          <p>
            View the <a href={media.url}>trail conditions report [PDF]</a>
            {` (${formatDate(media.updatedAt)})`}.
          </p>
        }
      </Col>
    </Row>
  )
}

export default function VisitorGuidelines({ guidelines }) {
  // Filter isActive and sort by order
  const sortedGuidelines =
    guidelines.filter(guide => guide.isActive).sort((a, b) => {
      // Check if both have rank to override defaultRank
      if (a.rank && b.rank) {
        return a.rank - b.rank;
      }
      // Fallback to defaultRank if one or both don't have rank
      return a.guidelineType.defaultRank - b.guidelineType.defaultRank
    })
  return (
    <>
      <h3>Visitor guidelines</h3>
      {sortedGuidelines.map((guide, index) => (
        <Guideline key={index} guide={guide} />
      ))}
    </>
  )
}
