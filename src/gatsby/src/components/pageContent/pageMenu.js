import React from "react"

import "../../styles/pageContent/pageMenu.scss"

export default function PageMenu({ pageSections, activeSection, menuStyle }) {
  if (menuStyle === "nav") {
    return (
      <nav className="navbar">
        <nav id="section-navbar" className="nav">
          {pageSections.filter(s => s.visible).map(section => (
            <a
              className="nav-link"
              active-section={
                activeSection === section.sectionIndex ? "true" : "false"
              }
              key={section.sectionIndex}
              href={section.link}
            >
              {section.display}
            </a>
          ))}
        </nav>
      </nav>
    )
  }

  if (menuStyle === "select") {
    return (
      <div className="section-select-container">
        <p><b>On this page</b></p>
        <ul>
          {pageSections.filter(section => section.visible).map(section => (
            <li key={section.sectionIndex}>
              <a href={section.link}>
                {section.display}
              </a>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  return null
}
