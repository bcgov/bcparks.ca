import React, { useState, useEffect, useCallback } from "react"
import PropTypes from "prop-types"
import { Link, navigate } from "gatsby"
import { isTablet } from "react-device-detect"

import BCParksLogo from "../images/bcparks-h-rgb-rev.png"
import BCParksWordmark from "../images/BCParks_Wordmark_White.svg"

import "../styles/megaMenu/megaMenu.scss"

const MegaMenu = ({ content, menuMode }) => {
  const [menuContent, setMenuContent] = useState([])
  const [menuTree, setMenuTree] = useState([])
  const [menuRoot, setMenuRoot] = useState({})
  const [selectedItem, setSelectedItem] = useState([]) // most recent item user has interacted with
  const [selections, setSelections] = useState({}) // the selected item at each level, i.e. selection breadcrumbs
  const [isMenuOpen, setIsMenuOpen] = useState(false) // currently only used for mobile - menu closed at first
  let sectionImages = {}

  const getSelectionObj = (item, obj) => {
    // this creates an object that indicates all the pages that
    // are "selected" based on the selectedItem and its parents
    // i.e. the breadcrumbs back to home
    // this allows us to highlight the selected parents and
    // keep the correct menus open
    if (item.strapiId === 1) {
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
    // go "up" a level by navigating to this item's parent
    menuNavigate(item.parent)
  }

  const navigatePage = (e, item, menuMode) => {
    if (menuMode === "sitemap") {
      navigate(item.url)
    } else {
      menuNavigate(item, menuMode)
    }
  }

  const sectionHover = (e, section, menuMode) => {
    if (window.innerWidth >= 992 && menuMode !== "sitemap" && !isTablet) {
      // otherwise hover triggered in mobile emulator
      if (section !== selectedItem) {
        // don't trigger nav through hovers
        setSelectedItem(section)
        let selObj = getSelectionObj(section, {}) // track the selected item at this level and above
        setSelections(selObj)
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

        if (item.strapiChildren === undefined) {
          // catch second level where children are not defined
          // get items whose parent is the current item
          let itemChildren = menuContent.filter(
            child => child.strapiParent?.id === item.id
          )
          item.strapiChildren = itemChildren || []
        }
        if (item.treeLevel < 3) {
          // Enforcing max 3 levels
          // process children
          item.strapiChildren = sortedTree(item.strapiChildren || [], level + 1) // recurse for each child
          item.hasChildren = item.strapiChildren.length > 0

          // add parent
          item.strapiChildren.map(i => {
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

  useEffect(() => {
    // create sorted + structured menuTree from menuContent

    // pick the root of the tree
    let t = menuContent.filter(item => item.strapiId === 1)

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

  // get images for top level sections
  let sections = content.filter(item => item.strapiParent?.id === 1)
  sections.forEach(item => {
    sectionImages[item.order] = item.imgUrl || ""
  })

  // recursive menu generator which makes single version of DOM
  // that can be used for desktop, mobile and sitemap views of megamenu
  const generateMenus = (item, menuMode) => {
    return (
      <>
        {item.hasChildren && (
          <>
            <nav className={"menu-level menu-level--" + item.treeLevel}>
              <ul className="menu-button-list">
                <li className="menu-button menu-back">
                  <span
                    className="menu-button__title"
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
                  </span>
                </li>
                <li className="menu-button menu-header">
                  <Link className="menu-button__title" to={item.url || "/"}>
                    {item.title}
                  </Link>
                </li>
                {item.strapiChildren.map((page, index) => (
                  <li
                    key={index}
                    className={
                      "menu-button menu-button--" +
                      (selections[page.treeLevel] === page
                        ? "selected"
                        : "unselected")
                    }
                  >
                    <span
                      className="menu-button__title"
                      role="button"
                      tabIndex={0}
                      onFocus={e => menuFocus(e, page)}
                      onMouseOver={e => sectionHover(e, page, menuMode)}
                      onKeyDown={e => {
                        if (e.key === "Enter" || e.key === " ") {
                          navigatePage(e, page, menuMode)
                        }
                      }}
                      onClick={e => navigatePage(e, page, menuMode)}
                    >
                      {page.title}
                      {page.hasChildren && (
                        <i className="menu-button__arr fa fa-chevron-right"></i>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </nav>
            {item.strapiChildren.map((page, index) => (
              <div
                key={index}
                className={
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
            ))}
            <div className="menu-image d-none d-lg-block">
              {menuMode === "responsive" &&
                item.treeLevel === 1 &&
                sectionImages[item.order] && (
                  <>
                    {item.level}
                    <img src={sectionImages[item.order]} alt="" />
                  </>
                )}
            </div>
          </>
        )}
        {!item.hasChildren && (
          <nav>
            <ul>
              <li className="menu-button menu-header">
                <Link className="menu-button__title" to={item.url || "/"}>
                  {item.title}
                </Link>
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
                className="bc-parks-logo--desktop d-none d-lg-block"
                alt="BC Parks Logo"
                src={BCParksLogo}
              />
              <img
                className="bc-parks-logo--mobile d-block d-lg-none"
                alt="BC Parks Logo"
                src={BCParksWordmark}
              />
            </Link>
            <a
              href="https://camping.bcparks.ca"
              className="btn book-campsite-btn"
            >
              Book a campsite
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
            onMouseLeave={e => menuReset(e)}
          >
            {menuTree.map((page, index) => (
              <div key="index">{generateMenus(page, menuMode)}</div>
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
      strapiChildren: PropTypes.array,
      strapiParent: PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
      }),
      title: PropTypes.string.isRequired,
      url: PropTypes.string,
    })
  ),
}

export default MegaMenu
