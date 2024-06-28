import React from "react"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import HtmlContent from "./htmlContent"

export const Guideline = ({ guide }) => {
  // console.log("guide", guide)
  const guidelineType = guide.guidelineType

  return (
    <Row className="guideline mb-4">
      <Col xs="auto" className="guideline--left">
        <FontAwesomeIcon icon={`fa-regular fa-${guidelineType.icon}`} />
      </Col>
      <Col className="guideline--right">
        <h4>{guide.title ? guide.title : guidelineType.defaultTitle}</h4>
        <HtmlContent>
          {guide.description.data ? guide.description.data : guidelineType.defaultDescription.data}
        </HtmlContent>
      </Col>
    </Row>
  )
}

export default function VisitorGuidelines({ guidelines }) {
  console.log("guidelines", guidelines)
  // filter isActive and sort by order
  const sortedGuidelines =
    guidelines.filter(guide => guide.isActive).sort((a, b) => a.defaultRank - b.defaultRank)
  return (
    <>
      <h3>Visitor guidelines</h3>
      {sortedGuidelines.map((guide, index) => (
        <Guideline key={index} guide={guide} />
      ))}
    </>
  )
}
