import React from "react"

import HTMLArea from "../HTMLArea"

import "../../styles/pageContent/pageSection.scss"

const slugify = require("slugify")

export default function PageSection({ sectionTitle, sectionHtml}) {
    const titleId = slugify(sectionTitle).toLowerCase()

    return (
        <>
            <div className="page-section" id={titleId}>
                <h2 className="page-section-title">{sectionTitle}</h2>
                <HTMLArea className="page-section-html" isVisible={true}>
                    {sectionHtml.data.sectionHTML}
                </HTMLArea>     
            </div>
        </>
  )
}