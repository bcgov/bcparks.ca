import React from "react"
import HTMLArea from "../../components/HTMLArea"


export default function PageHeader({ pageSections, activeSection })
{
    // Temp values TODO
    let content = {
        pageTitle: "Indigenous Relations and Reconciliation",
        imageUrl: "https://nrs.objectstore.gov.bc.ca/kuwyyf/haida_trail_marker_installation_1_5319194a95.jpg",
        imageAlt: "test",
        imageCaption: "BC Parks supports the continued exercise of constitutionally protected Aboriginal Rights in provincial parks and protected areas, such as: hunting, fishing, gathering, social, and ceremonial activities.",
        introHtml: ""
    }

    // handle mobile dropdown menu
    let sectionIndex = activeSection
    const handleSectionChange = (e) => { 
        let index = e.target.value
        console.log(index)
        let s = pageSections.find(c => (c.sectionIndex === Number(index)))
        console.log(s)
        let link = s.link
        window.location.hash = link
        
        console.log(link)
    }

  //if (props.Content==null) {
   // return null;
  //}
    return (
        <div className="page-header">
            <div className="header-image-wrapper">
                <img src={content.imageUrl} alt={content.imageAlt} />
            </div>
            <div className="header-title">
            {content.pageTitle}
            </div>
            <div className="d-block d-md-none">
                <select className="header-mobile-dropdown" value={sectionIndex}
                    onChange={handleSectionChange}>
                    <option value={0}>Table of Contents</option>
                {pageSections.map(section =>
                    <option key={section.sectionIndex} value={section.sectionIndex}>
                        {section.display}
                    </option>
                        )}
                </select>
            </div>
            <div className="header-intro">
                {/* -{content.imageCaption}
        <HTMLArea>
        {content.introHtml}
                </HTMLArea> */}
                <p>
                Provincial parks in British Columbia cover a large part of the province and include many culturally important places for Indigenous peoples. BC Parks recognizes that building and maintaining relationships with Indigenous peoples has not always been a major driver in park establishment or management, but has more recently become a central part of the work we do.  
                </p><p>
                Over the past few decades, there has been a shift towards true and meaningful collaboration with Indigenous peoples and respect for their deep and on going connections to the land. Today, reconciliation is a core principle guiding the work of BC Parks and is a shared responsibility of everyone in the agency. 
                </p><p>
                        BC Parks has been partnering with First Nations communities on hundreds of projects that nurture our common interests in stewardship, management and appreciation of these special places. As we continue to renew and strengthen our relationships with Indigenous peoples, BC Parks will also strive to better integrate Indigenous knowledge, values and interests into parks planning and management as we work together towards a shared future. 
                </p>
            </div>
        </div>
  )
}