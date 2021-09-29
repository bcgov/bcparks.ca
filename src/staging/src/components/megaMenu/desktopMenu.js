import React from "react"
import PropTypes from "prop-types"
import { Link, navigate } from "gatsby"
import { isTablet } from "react-device-detect"
import BCParksLogo from "../../images/bcparks-h-rgb-rev.png"

const DesktopMenu = ({ linkStructure }) => {
  const formattedContent = formatMenuTree(linkStructure)

  /**
   * Certain top level menu links are designed to dropdown in response to hover on desktop view.
   * We want to be able to trigger the dropdown of these links without activating the link itself. 
  */
  const handleLinkClick = (e, url) => {
    if(isTablet) {
      return e.preventDefault()
    }
    return navigate(url)
  }

  const generateMenuItem = ({ strapiChildren, title, url }) => {
    if (!strapiChildren?.length) {
      return (
        <React.Fragment key={`f${title}`}>
          <li key={title}>
            <Link to={url ?? '/'} className="menu-link menu-bar-link">{title}</Link>
          </li>
          <li key="empty" className="empty"></li>
        </React.Fragment>
      )
    }
    if (strapiChildren?.length) {
      return (
        <li key={title}>
          <a href={url} onClick={e => handleLinkClick(e, url)} className="menu-link menu-bar-link" data-haspopup="true">{title}</a>
          <ul className="mega-menu mega-menu--multiLevel"> {/** level 1 */}
            <li key={`t${title}`} className="menu-list-header">
              <Link to={url ?? '/'} className="menu-link menu-list-link mega-menu-link menu-list-header-link">{title}</Link>
            </li>
            {strapiChildren.map(c => {
              let listElement
              if (!c?.strapiChildren?.length) {
                listElement = (
                  <li key={`c${c.title}`} className="mega-menu-list">
                    <Link to={c.url ?? '/'} className="menu-link menu-list-link mega-menu-link">{c.title}</Link>
                  </li>
                )
              } else {
                listElement = (
                  <li key={`c${c.title}`} className="mega-menu-list">
                    <a href="/" onClick={e => handleLinkClick(e, c.url)} className="menu-link mega-menu-link" data-haspopup="true">{c.title}</a>
                    <ul className="menu menu-list sub-menu-list"> {/** level 2 */}
                      <li key={`sc${c.title}`} className="sub-menu-list-header mega-menu-list">
                        <Link to={c.url ?? '/'} className="sub-menu-link">{c.title}</Link>  
                      </li>
                      {c.strapiChildren.map(sc => {
                        return (
                          <li key={`sc${sc.title}`} className="mega-menu-list">
                            <Link to={sc.url ?? '/'} className="sub-menu-link">{sc.title}</Link>  
                          </li>
                        )
                      })}
                    </ul>
                  </li>
                )
              }
              return listElement
            })}
          </ul>
        </li>
      )
    }
  }

  /**
   * Nest child menus from the second layer of IA down to the fourth. Used in conjuction with generateMenuItem().
   * @param {Object[]} menu 
   * @returns {Object[]}
   */
  function formatMenuTree(menu) {
    const formattedMenuTree = menu.filter(i => i?.strapiParent?.title === 'Home')
    formattedMenuTree.forEach(menuTree => {
      if (menuTree.strapiChildren.length) {
        menuTree.strapiChildren.forEach(child => {
          const childSubMenus = menu.filter(i => i?.strapiParent?.id === child.id).map(c => {
            delete c.strapiChildren
            return { ...c }
          })
          return child.strapiChildren = childSubMenus
        })
      }
    })
    return formattedMenuTree
  }

  return (
    <>
      <nav className="navbar navbar-dark" id="desktopNav">
        <Link to="/">
          <img className="bc-parks-logo" src={BCParksLogo} alt="BC Parks logo" />
        </Link>
        <a href="https://www.discovercamping.ca" rel="noreferrer" target="_blank" className="btn book-campsite-btn">Book a campsite</a>
      </nav>
      <div id="desktopNavMenu">
        <nav>
          <ul className="menu menu-bar justify-content-center">
            {formattedContent.map(fc => {
              return generateMenuItem(fc)
            })}
          </ul>
        </nav>
      </div>
    </>
  )
}

DesktopMenu.propTypes = {
  linkStructure: PropTypes.arrayOf(PropTypes.shape({
    order: PropTypes.number.isRequired,
    strapiChildren: PropTypes.array,
    strapiParent: PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired
    }),
    title: PropTypes.string.isRequired,
    url: PropTypes.string
  }))
}

export default DesktopMenu