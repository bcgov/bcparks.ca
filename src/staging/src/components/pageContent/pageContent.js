
import React from "react"

import LinkCard from "./linkCard"
import PageSection from "../pageContent/pageSection"
import HTMLArea from "../HTMLArea"

/*
 * PageContent is a generic switch for different strapi content types.
 */
export default function PageContent({ contentType, content }) {

  // this will expand as page components are added
  // note that parks.page-header does not appear here as 
  // that content should be added in the containing page

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
    if (contentType === "parks.page-section") {
        return <PageSection sectionTitle={content.sectionTitle} sectionId={content.id} sectionHtml={content.sectionHTML} />
    }

    return null


}

