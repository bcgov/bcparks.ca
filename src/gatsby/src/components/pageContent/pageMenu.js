import React from "react"

import "../../styles/pageContent/pageMenu.scss"

export default function PageMenu({ pageSections, activeSection, menuStyle }) {
  return (
    <div className="page-menu--container">
      <div className="menu-header">
        <b>On this page</b>
      </div>
      <ul>
        {pageSections
          .filter(section => section.visible)
          .map(section => (
            <li key={section.sectionIndex}>
              {menuStyle === "nav" && (
                <a
                  active-section={
                    activeSection === section.sectionIndex ? "true" : "false"
                  }
                  key={section.sectionIndex}
                  href={section.link}
                >
                  {section.display}
                </a>
              )}
              {menuStyle === "list" && (
                <a href={section.link}>{section.display}</a>
              )}
            </li>
          ))}
      </ul>
    </div>
  )
}
