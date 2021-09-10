import React from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"
import "../styles/megamenu.scss"

const MegaMenu = ({ content }) => {
  const formattedContent = formatMenuTree(content)

  return (
    <div className="nav">
      <nav id="main-nav">
        <ul className="menu menu-bar">
          {formattedContent.map(fc => {
            return generateMenuItem(fc)
          })}
        </ul>
      </nav>
    </div>
  )
}

function generateMenuItem({ strapiChildren, title, url }) {
  if (!strapiChildren?.length) {
    return (
      <>
      <li key={title}>
          <Link to={url ?? '/'} className="menu-link menu-bar-link">{title}</Link>
      </li>
      <li className="empty"></li>
      </>
    )
  }
  if (strapiChildren?.length) {
    return (
      <li key={title}>
        <Link to={url ?? '/'} className="menu-link menu-bar-link" aria-haspopup="true">{title}</Link>
        <ul className="mega-menu mega-menu--multiLevel"> {/** level 1 */}
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
                  <Link to={c.url ?? '/'} className="menu-link mega-menu-link" aria-haspopup="true">{c.title}</Link>
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
  const home = {
    strapiId: 1,
    title: 'Home',
    url: '/home',
    pageType: 'Unique',
    strapiChildren: [],
    strapiParent: {}
  }
  const formattedMenuTree = [home, ...menu.filter(i => i?.strapiParent?.title === 'Homepage')]
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