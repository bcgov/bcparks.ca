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
    let sectionIndex = activeSection
    const handleSectionChange = e => {
      let index = e.target.value
      let s = pageSections.find(c => c.sectionIndex === Number(index))
      let link = s.link
      window.location.hash = link
    }

    return (
      <select
        className="section-select"
        value={sectionIndex}
        onChange={handleSectionChange}
        title="mobile-navigation"
      >
        <option value={0}>Table of Contents</option>
        {pageSections.filter(s => s.visible).map(
          section =>
            section.sectionIndex > 0 && (
              <option key={section.sectionIndex} value={section.sectionIndex}>
                {section.display}
              </option>
            )
        )}
      </select>
    )
  }

  return null
}
