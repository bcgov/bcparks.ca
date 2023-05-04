
import React from "react"

import HTMLArea from "../HTMLArea"
import LinkCard from "./linkCard"
import PageSection from "../pageContent/pageSection"

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
          subTitle={content.subTitle}
          url={content.url}
          imageUrl={content.imageUrl}
          imageAltText={content.imageAltText}
          variation={content.variation}
          buttonText={content.buttonText}
        ></LinkCard>
      )
    }
  if (contentType === "parks.card-set") {
    return (
      <div className="row">
        {content.cards.map(card =>
          <LinkCard
            key={card.id}
            title={card.title}
            subTitle={card.subTitle}
            url={card.url}
            imageUrl={card.imageUrl}
            imageAltText={card.imageAltText}
            variation={card.variation}
            buttonText={card.buttonText}
          ></LinkCard>
        )}
      </div>
    )
  }
    if (contentType === "parks.html-area") {
        return <HTMLArea isVisible={true}>{content.HTML.data.HTML}</HTMLArea>
    }
    if (contentType === "parks.page-section") {
        return <PageSection sectionTitle={content.sectionTitle} sectionId={content.id} sectionHtml={content.sectionHTML} />
    }

    return null

}

