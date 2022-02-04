
import React from "react"

import LinkCard from "./linkCard"
import PageSection from "../pageContent/pageSection"
import HTMLArea from "../HTMLArea"

/*
 * PageContent is a generic switch for different strapi content types.
 */
export default function PageContent({ contentType, content }) {
  if (!content) {
    return null
  }

{
    // this will expand as page components are added
    // note that parks.page-header does not appear here as 
    // that content should be added in the containing page

    if (!content) {
        return null
    }

<<<<<<< HEAD
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
=======
>>>>>>> 2ce2e1a (BRS-384 Static page update, new page components)
    if (contentType === "parks.html-area") {
        return <HTMLArea isVisible={true}>{content.HTML}</HTMLArea>
    }
    if (contentType === "parks.page-section") {
        return <PageSection sectionTitle={content.SectionTitle} sectionId={content.id} sectionHtml={content.SectionHTML} />
    }
<<<<<<< HEAD
  return null
}
=======

    return null


}
>>>>>>> 2ce2e1a (BRS-384 Static page update, new page components)
