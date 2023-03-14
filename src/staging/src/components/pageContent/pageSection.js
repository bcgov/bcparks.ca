import React from "react"

import HTMLArea from "../HTMLArea"

import "../../styles/pageContent/pageSection.scss"

export default function PageSection({ sectionId, sectionTitle, sectionHtml})
{
    return (
        <>
            <div className="page-section" id={"page-section-" + sectionId}>
                <h2 className="page-section-title">{sectionTitle}</h2>
                <HTMLArea className="page-section-html" isVisible={true}>
                    {sectionHtml.data.sectionHTML}
                </HTMLArea>     
            </div>
        </>
  )
}