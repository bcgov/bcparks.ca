import React, { useState, useEffect } from "react"
import { Link } from "gatsby"
import parksLogo from "../images/park-card.png"

// function to check if a string contains anything besides html tags and whitespace characters
export const isNullOrWhiteSpace = (str) => !str || !str.toString().replace(/(<([^>]+)>)|^\s+|\s+$|\s+/g, "");
export const capitalizeFirstLetter = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
export const renderHTML = (rawHTML) => React.createElement("span", { dangerouslySetInnerHTML: { __html: rawHTML } });
export const renderBreadcrumbs = (menuContent, pageContext) => {
  // TODO this doesn't work if the page is not in the menu
  let current = menuContent.find(mc => mc.url === pageContext.Slug)
  const breadcrumbItems = [
    <div key={pageContext.id} className="breadcrumb-text">
      {current?.title}
    </div>,
  ]

  let parent = menuContent.find(mc => mc.strapi_id === current?.strapi_parent?.id)
  return addItems(parent, menuContent, breadcrumbItems)

  function addItems(parent, menuContent, breadcrumbItems) {
    if (parent) {
      breadcrumbItems.push(
        <Link key={parent.strapi_id} to={parent?.url ?? "/"}>
          {parent.title}
        </Link>
      )
      parent = menuContent.find(mc => mc.strapi_id === parent?.strapi_parent?.id)
      return addItems(parent, menuContent, breadcrumbItems)
    }
    return breadcrumbItems.reverse()
  }
}
export const addSmallImagePrefix = (str) => {
  if (!str) {
    return parksLogo
  }
  let url = str
  // fallback in case imageUrl has already prefix
  // remove another prefix from str
  const prefixes = ["large_", "medium_", "small_"]
  for (let i = 0; i < prefixes.length; i++) {
    if (str.includes(prefixes[i])) {
      url = str.replace(prefixes[i], "")
    }
  }
  const i = url.lastIndexOf("/")
  return url.substring(0, i + 1) + "small_" + url.substring(i + 1, url.length)
}
export const handleImgError = (setErrorStates, index) => {
  setErrorStates(prevErrorStates => {
    const newErrorStates = [...prevErrorStates]
    newErrorStates[index] = true
    return newErrorStates
  })
  console.clear()
}
export const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  })

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }
    window.addEventListener('resize', handleResize);
    // clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])
  return screenSize
}