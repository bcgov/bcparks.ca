import React from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"

const DesktopMenu = ({ linkStructure }) => {
  const formattedContent = formatMenuTree(linkStructure)

  const generateMenuItem = ({ strapiChildren, title, url }) => {
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
            <li key={`t${title}`} className="menu-list-header">
              <Link to={url ?? '/'} className="menu-link menu-list-link mega-menu-link">{title}</Link>
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
      url: '/',
      pageType: 'Unique',
      strapiChildren: [],
      strapiParent: {}
    }
    const formattedMenuTree = [home, ...menu.filter(i => i?.strapiParent?.title === 'Home')]
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
    <nav id="main-nav">
      <ul className="menu menu-bar">
        {formattedContent.map(fc => {
          return generateMenuItem(fc)
        })}
      </ul>
    </nav>
  )

}

DesktopMenu.propTypes = {
  linkStructure: PropTypes.arrayOf(PropTypes.shape({
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

export default DesktopMenu