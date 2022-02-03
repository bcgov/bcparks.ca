
import React, { useState, useEffect } from "react"

import "../../styles/pageContent/pageContent.scss"

export default function PageMenu({ pageSections, activeSection })
{
console.log(pageSections)

    return (
        <>
        <div className="d-none d-md-block">
            <div className="sticky-top">
                <nav className="navbar">
                    <nav id="section-navbar" className="nav nav-pills">
                        {pageSections.map(section =>
                        <a className="nav-link"
                            active-section={ activeSection === section.sectionIndex ? 'true' : 'false' }
                            key={section.id} href={section.link}>{section.display}</a>
                            )}
                    </nav>
                </nav>
            </div>
        </div>    
    </>
  )
}