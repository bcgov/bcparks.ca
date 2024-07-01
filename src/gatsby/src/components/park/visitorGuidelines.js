import React, { useState, useEffect } from "react"
import axios from "axios"
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

export const Guideline = ({ guide, api }) => {
  const guidelineType = guide.guidelineType
  const [media, setMedia] = useState(null)
  const [guideLoadError, setGuideLoadError] = useState(false)

  // Get media data through api
  useEffect(() => {
    const getGuideData = async () => {
      try {
        const response = await axios.get(`${api}/park-guidelines/${guide.strapi_id}?populate=*`)
        setMedia(response.data.data.attributes.mediaLink.data.attributes)
      } catch (error) {
        setGuideLoadError(true)
      }
    }
    getGuideData()
  }, [api, guide.strapi_id])

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
        {(!guideLoadError && media !== null) &&
          <>
            View the <a href={media.url}>View the trail conditions report [PDF]</a>
            {` (${formatDate(media.updatedAt)})`}.
          </>
        }
      </Col>
    </Row>
  )
}

export default function VisitorGuidelines({ guidelines, api }) {
  // filter isActive and sort by order
  const sortedGuidelines =
    guidelines.filter(guide => guide.isActive).sort((a, b) => {
      // Check if both have guidelineType.rank
      if (a.guidelineType.rank && b.guidelineType.rank) {
        return a.guidelineType.rank - b.guidelineType.rank;
      }
      // Fallback to defaultRank if one or both don't have guidelineType.rank
      return a.defaultRank - b.defaultRank
    })
  return (
    <>
      <h3>Visitor guidelines</h3>
      {sortedGuidelines.map((guide, index) => (
        <Guideline key={index} guide={guide} api={api} />
      ))}
    </>
  )
}
