import React from "react"
import PropTypes from "prop-types"
import "../styles/megaMenu/desktop.scss"
import "../styles/megaMenu/mobile.scss"
import MobileMegaMenu from "../components/megaMenu/mobileMenu.js"
import DesktopMegaMenu from "../components/megaMenu/desktopMenu.js"

const MegaMenu = ({ content }) => {
  return (
    <div className="nav-container">
      <div className="nav d-none d-lg-block">
        <DesktopMegaMenu linkStructure={content} />
      </div>
      <div className="nav d-block d-lg-none">
        <MobileMegaMenu linkStructure={content} />
      </div>
    </div>
  )
}

MegaMenu.propTypes = {
  content: PropTypes.arrayOf(PropTypes.shape({
    order: PropTypes.number.isRequired,
    pageType: PropTypes.string.isRequired,
    strapiChildren: PropTypes.array.isRequired,
    strapiParent: PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired
    }),
    title: PropTypes.string.isRequired,
    url: PropTypes.string
  }))
}

export default MegaMenu