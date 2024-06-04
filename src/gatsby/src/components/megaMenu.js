import React, { useState, useEffect, useCallback } from "react"
import PropTypes from "prop-types"
import { Link, navigate } from "gatsby"
import Logo from "../images/logo/BCParks_Primary_Reversed-cropped.svg"
import LogoVertical from "../images/logo/BCParks_Primary_Reversed_Vertical.svg"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleChevronRight } from "@fortawesome/free-solid-svg-icons"

import "../styles/megaMenu/megaMenu.scss"

const MegaMenu = ({ content, menuMode }) => {
  const [menuContent, setMenuContent] = useState([])
  const [menuTree, setMenuTree] = useState([])
  const [menuRoot, setMenuRoot] = useState({})
  const [selectedItem, setSelectedItem] = useState([]) // most recent item user has interacted with
  const [selections, setSelections] = useState({}) // the selected item at each level, i.e. selection breadcrumbs
  const [isMenuOpen, setIsMenuOpen] = useState(false) // currently only used for mobile - menu closed at first
  const [hasClickedTwice, setHasClickedTwice] = useState(false)
  const [currentPath, setCurrentPath] = useState("")
  const ROOT_MENU_URL = '/'
  let sectionImages = {}
  let menuCollection
  let menuElements
  if (typeof window !== "undefined") {
    menuCollection = document.getElementsByClassName("menu-children-exist--true menu-level-0-children")
    menuElements = Array.from(menuCollection)
  }

  const getSelectionObj = (item, obj) => {
    // this creates an object that indicates all the pages that
    // are "selected" based on the selectedItem and its parents
    // i.e. the breadcrumbs back to home
    // this allows us to highlight the selected parents and
    // keep the correct menus open
    if (item.url === ROOT_MENU_URL) {
      // have reached home,
      // add home at level 0 and return, ending he recursion
      obj[0] = item
      return obj
    } else {
      // add this item as the one that is "selected" at its level
      // then recurse to its parent to add the next highest level
      obj[item.treeLevel] = item
      obj = getSelectionObj(item.parent, obj) // recurse
      return obj
    }
  }

  const menuNavigate = item => {
    // either open the menu for the item's children (isPageNav=false)
    // or navigate to the associated url (isPageNav=true)
    if (item) {
      let isPageNav = false

      if (!item.hasChildren) {
        isPageNav = true
      }
      if (item === selectedItem) {
        // reselect
        isPageNav = true
      }

      if (isPageNav) {
        navigate(item.url)
        setIsMenuOpen(false)
        menuReset()
      } else {
        setSelectedItem(item)
        let selObj = getSelectionObj(item, {}) // track the selected item at this level and above
        setSelections(selObj)
      }
    }
  }

  const navigateBack = (e, item) => {
    e.preventDefault();
    // go "up" a level by navigating to this item's parent
    menuNavigate(item.parent)
  }

  const sectionClick = (e, section, menuMode) => {
    if (section.hasChildren) {
      e.preventDefault()
    } else {
      if (currentPath.includes(section.url)) {
        setIsMenuOpen(false)
      }
    }

    if (menuMode !== "sitemap") {
      // otherwise hover triggered in mobile emulator
      if (section !== selectedItem) {
        // don't trigger nav through hovers
        setSelectedItem(section)
        let selObj = getSelectionObj(section, {}) // track the selected item at this level and above
        setSelections(selObj)
        if (selectedItem.treeLevel === 2) {
          setHasClickedTwice(false)
        }
      } else {
        if (selectedItem.treeLevel === 2) {
          setHasClickedTwice(!hasClickedTwice)
        } else {
          menuReset()
        }
      }
    }
  }

  const menuReset = () => {
    // reset menu to initial state, with root of menuTree selected
    if (selectedItem !== menuRoot) {
      menuNavigate(menuRoot)
    }
  }

  const menuFocus = e => {
    // doesn't do anything, needed to eliminate warning
  }

  const toggleMenu = e => {
    if (!isMenuOpen) {
      // menu is closed, will open now
      menuReset() // select the root
    }
    setIsMenuOpen(!isMenuOpen) // toggle open state
  }

  const sortedTree = useCallback(
    (arr, level) => {
      // sort the items at this level
      // then recurse on each item to sort the children, etc
      arr.sort((a, b) => {
        return a.order - b.order // sort the array by order
      })
      arr.forEach(item => {
        item.treeLevel = level
        item.orderCode =
          item.parent?.treeLevel > 0
            ? item.parent.orderCode + "." + item.order
            : item.order

        if (item.strapi_children === undefined) {
          // catch second level where children are not defined
          // get items whose parent is the current item
          let itemChildren = menuContent.filter(
            child => child.strapi_parent?.id === item.id
          )
          item.strapi_children = itemChildren || []
        }
        if (item.treeLevel < 3) {
          // Enforcing max 3 levels
          // process children
          item.strapi_children = sortedTree(item.strapi_children || [], level + 1) // recurse for each child
          item.hasChildren = item.strapi_children.length > 0

          // add parent
          item.strapi_children.map(i => {
            i.parent = item
            return i
          })
        } else {
          // prevent view from showing children
          // deeper than max level
          item.hasChildren = false
        }
      })

      return arr // return sorted children back to parent
    },
    [menuContent]
  )

  const handleClick = useCallback((e) => {
    if (!(menuElements.some((el) => el.parentElement.contains(e.target)))) {
      menuReset()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuElements])

  useEffect(() => {
    // create sorted + structured menuTree from menuContent

    // pick the root of the tree
    let t = menuContent.filter(item => item.url === ROOT_MENU_URL)

    // sort all levels of the menu
    t = sortedTree(t, 0) // pass root at level 0

    // store in menuTree, ready to be passed to view
    setMenuTree(t)

    const root = t[0]
    setMenuRoot(root)
  }, [setMenuTree, sortedTree, menuContent])

  useEffect(() => {
    // make deep copy of content to process, will trigger useEffect above
    setMenuContent(JSON.parse(JSON.stringify(content)))
  }, [setMenuContent, content])

  useEffect(() => {
    if (menuElements.length === 0) { return }
    document.addEventListener("click", handleClick)
    return () => {
      document.removeEventListener("click", handleClick)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuElements])

  // get images for top level sections
  let sections = content.filter(item => item.strapi_parent?.url === ROOT_MENU_URL)
  sections.forEach(item => {
    sectionImages[item.order] = item.imgUrl || ""
  })

  // get current path
  useEffect(() => {
    if (window.location) {
      setCurrentPath(window.location.pathname)
    }
  }, [])

  // recursive menu generator which makes single version of DOM
  // that can be used for desktop, mobile and sitemap views of megamenu
  const generateMenus = (item, menuMode) => {
    return (
      <>
        {item.hasChildren && (
          <nav
            className={
              "menu-level menu-level--" + item.treeLevel +
              " has-clicked-twice--" + hasClickedTwice
            }
            aria-labelledby="mainmenulabel"
          >
            <h2 id="mainmenulabel" className="sr-only">Main Menu</h2>
            <ul className="menu-button-list" role="presentation">
              <li className="menu-button menu-back">
                <a
                  className="menu-button__title"
                  href="back"
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => {
                    if (e.key === "Enter" || e.key === " ") {
                      navigateBack(e, item)
                    }
                  }}
                  onClick={e => navigateBack(e, item)}
                >
                  <i className="menu-button__arr fa fa-chevron-left"></i> Back
                </a>
              </li>
              <li className="menu-button menu-header">
                {item.url.toLowerCase().startsWith('http') ?
                  <a className="menu-button__title" href={item.url || ROOT_MENU_URL} role="menuitem">
                    {item.title}
                    <FontAwesomeIcon icon={faCircleChevronRight} className="menu-button__title--icon" />
                  </a> :
                  <Link
                    className="menu-button__title"
                    to={item.url || ROOT_MENU_URL}
                    role="menuitem"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.title}
                    <FontAwesomeIcon icon={faCircleChevronRight} className="menu-button__title--icon" />
                  </Link>
                }
              </li>
              {item.strapi_children.map((page, index) => (
                <React.Fragment key={index}>
                  <li className={
                    "menu-button menu-button--" +
                    (page === selections[page.treeLevel]
                      ? "selected"
                      : "unselected")
                  }
                  >
                    {page.url.toLowerCase().startsWith('http') ?
                      <a
                        className="menu-button__title"
                        href={page.url}
                        role="menuitem"
                      >
                        {page.title}
                      </a>
                      :
                      <Link
                        className={`menu-button__title ${
                          page.hasChildren && "has-children"
                        }`}
                        to={page.url}
                        role="menuitem"
                        onFocus={e => menuFocus(e, page)}
                        onClick={e => sectionClick(e, page, menuMode)}
                      >
                        {page.title}
                        {page.hasChildren && (
                          <i className="menu-button__arr fa fa-chevron-right"></i>
                        )}
                      </Link>
                    }
                  </li>
                  <div className={
                    "menu-children menu-children-exist--" +
                    page.hasChildren +
                    " menu-level-" +
                    item.treeLevel +
                    "-children menu-children--" +
                    (page === selections[page.treeLevel]
                      ? "selected"
                      : "unselected")
                  }
                  >
                    {generateMenus(page, menuMode)}
                  </div>
                </React.Fragment>
              ))}
            </ul>
          </nav>
        )}
        {!item.hasChildren && (
          <nav>
            <ul role="presentation">
              <li className="menu-button menu-header">
                {item.url.toLowerCase().startsWith('http') ?
                  <a className="menu-button__title" href={item.url || ROOT_MENU_URL} role="menuitem">
                    {item.title}
                  </a> :
                  <Link className="menu-button__title" to={item.url || ROOT_MENU_URL} role="menuitem">
                    {item.title}
                  </Link>
                }
              </li>
            </ul>
          </nav>
        )}
      </>
    )
  }

  return (
    <>
      <div className={"mega-menu-wrapper menu-mode--" + menuMode}>
        <div className="header-wrapper">
          <nav className="header-nav">
            <Link to="/">
              <img
                src={Logo}
                alt="BC Parks Logo"
                style={{ height: 64 }}
                className="bc-parks-logo--desktop d-none d-lg-block"
              />
              <img
                src={LogoVertical}
                alt="BC Parks Logo"
                style={{ height: 64 }}
                className="bc-parks-logo--mobile d-block d-lg-none"
              />
            </Link>
            <a
              href="https://camping.bcparks.ca"
              className="btn book-campsite-btn"
              aria-label="Book camping button"
              role="button"
              tabIndex="0"
            >
              Book camping
            </a>
          </nav>
        </div>
        <div
          className={
            "menu-toggle menu-mode--" +
            menuMode +
            " menu-toggle--" +
            (isMenuOpen ? "open" : "closed")
          }
          role="button"
          tabIndex={0}
          onKeyDown={e => {
            if (e.key === "Enter" || e.key === " ") {
              toggleMenu(e)
            }
          }}
          onClick={e => toggleMenu(e)}
        >
          <nav className="menu-open">
            <i className="fa fa-bars"></i>
          </nav>
          <nav className="menu-close">
            <i className="fa fa-times"></i>
          </nav>
        </div>
        <nav
          className={
            "mega-menu menu-selected-level-" +
            selectedItem.treeLevel +
            " menu-mode--" +
            menuMode +
            " menu-" +
            (isMenuOpen ? "open" : "closed")
          }
        >
          <div
            className="menu-wrapper"
            tabIndex={0}
            role="menu"
            onFocus={e => menuFocus(e)}
          >
            {menuTree.map((page, index) => (
              <div key={index}>{generateMenus(page, menuMode)}</div>
            ))}
          </div>
        </nav>
      </div>
    </>
  )
}

MegaMenu.propTypes = {
  content: PropTypes.arrayOf(
    PropTypes.shape({
      order: PropTypes.number.isRequired,
      strapi_children: PropTypes.array,
      strapi_parent: PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
      }),
      title: PropTypes.string.isRequired,
      url: PropTypes.string,
    })
  ),
}

export default MegaMenu
