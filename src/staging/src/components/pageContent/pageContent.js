import React from "react"
import HTMLArea from "../htmlArea"
import LinkCard from "./linkCard"

/*
 * PageContent is a generic switch for different strapi content types.
 */
export default function PageContent({ contentType, content }) {
  if (!content) {
    return null
  }

  if (contentType === "parks.link-card") {
    return (
      <LinkCard
        title={content.title}
        url={content.url}
        imageUrl={content.imageUrl}
        imageAltText={content.imageAltText}
      ></LinkCard>
    )
  }
  if (contentType === "parks.html-area") {
    return <HTMLArea isVisible={true}>{content.HTML}</HTMLArea>
  }
  return null
}
