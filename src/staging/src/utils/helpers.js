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

    let parent = menuContent.find(mc => mc.strapiId === current?.strapiParent?.id)
    return addItems(parent, menuContent, breadcrumbItems)

    function addItems(parent, menuContent, breadcrumbItems) {
        if (parent) {
            breadcrumbItems.push(
                <Link key={parent.strapiId} to={parent?.url ?? "/"}>
                    {parent.title}
                </Link>
            )
            parent = menuContent.find(mc => mc.strapiId === parent?.strapiParent?.id)
            return addItems(parent, menuContent, breadcrumbItems)
        }
        return breadcrumbItems.reverse()
    }
}
