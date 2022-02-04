
import React from "react"
import HTMLArea from "../HTMLArea"
import "../../styles/pageContent/pageSection.scss"

export default function PageSection({ sectionId, sectionTitle, sectionHtml})
{

    return (
        <>
            <div className="page-section" id={"page-section-" + sectionId}>
                <div className="page-section-title">{sectionTitle}</div>
                <div className="page-section-hr"><hr /></div>

                <HTMLArea className="page-section-html" isVisible={true}>
                    {sectionHtml}
                </HTMLArea>     
            </div>
        </>
  )
}