import React from "react"

import HtmlContent from "../htmlContent"

import "../../styles/pageContent/pageSection.scss"

const slugify = require("slugify")

export default function PageSection({ sectionTitle, sectionId, sectionStrapiId, sectionHtml }) {
    const titleId = slugify(sectionTitle).toLowerCase()

    return (
        <>
            <span id={`page-section-${sectionId}`}></span>
            <span id={`page-section-${sectionStrapiId}`}></span>
            <div className="page-section" id={titleId}>
                <h2 className="page-section-title">{sectionTitle}</h2>
                <HtmlContent className="page-section-html">
                    {sectionHtml.data.sectionHTML}
                </HtmlContent>     
            </div>
        </>
  )
}