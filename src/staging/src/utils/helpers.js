import React from "react"
import { Link } from "gatsby"

// function to check if a string contains anything besides html tags and whitespace characters
export const isNullOrWhiteSpace = (str) => !str || !str.toString().replace(/(<([^>]+)>)|^\s+|\s+$|\s+/g, "");
export const capitalizeFirstLetter = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
export const renderHTML = (rawHTML) => React.createElement("div", { dangerouslySetInnerHTML: { __html: rawHTML } });
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
export const handleImgError = (e, imgSrc) => {
    e.target.onError = null
    e.target.src = imgSrc
    console.clear()
}