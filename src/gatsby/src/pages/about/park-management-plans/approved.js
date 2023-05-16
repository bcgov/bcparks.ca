import React, { useState } from "react"
import { graphql, useStaticQuery } from "gatsby"
import { Breadcrumbs, Link } from "@material-ui/core"

import Header from "../../../components/header"
import Footer from "../../../components/footer"
import Seo from "../../../components/seo"
import ScrollToTop from "../../../components/scrollToTop"

import "../../../styles/listPage.scss"

const DocumentLink = ({ doc }) => {
  const year = doc.documentDate.split('-').shift()
  return (
    <p>
      <a href={doc.url}>
        {`${doc.title} - ${doc.documentType?.documentCode}(${year}) [PDF]`}
      </a>
    </p>
  )
}

const ApprovedListPage = () => {
  const queryData = useStaticQuery(graphql`
    query {
      allStrapiManagementDocument(sort: {fields: title, order: ASC}) {
        nodes {
          title
          url
          description
          documentDate
          documentType {
            documentCode
            documentType
            description
          }
        }
      }
      allStrapiMenu(
        sort: { fields: order, order: ASC }
        filter: { show: { eq: true } }
      ) {
        nodes {
          strapi_id
          title
          url
          order
          id
          strapi_children {
            id
            title
            url
            order
          }
          strapi_parent {
            id
            title
          }
        }
      }
    }
  `)

  const menuContent = queryData?.allStrapiMenu?.nodes || []
  const documents = queryData?.allStrapiManagementDocument?.nodes || []

  const [currentFilter, setCurrentFilter] = useState("All")

  const handleClick = (e) => {
    setCurrentFilter(e.target.value)
  }
  const filtering = (char) =>
    documents.filter(doc => doc.title.charAt(0) === char)
  
  const filters = [
    "All", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L",
    "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"
  ]
  const breadcrumbs = [
    <Link key="1" href="/">
      Home
    </Link>,
    <Link key="2" href="/about">
      About
    </Link>,
    <Link key="3" href="/about/park-management-plans">
      Management plans
    </Link>,
    <div key="4" className="breadcrumb-text">
      Approved management plans
    </div>,
  ]

  return (
    <>
      <ScrollToTop />
      <div className="max-width-override">
        <Header mode="internal" content={menuContent} />
      </div>
      <div id="sr-content" className="d-none d-md-block static-content-container page-breadcrumbs">
        <Breadcrumbs separator="›" aria-label="breadcrumb">
          {breadcrumbs}
        </Breadcrumbs>
      </div>
      <div className="static-content--header">
        <h1 className="header-title">
          Approved management plans
        </h1>
      </div>

      <div className="static-content-container">
        <div className="page-content-wrapper">
          <div>
            <h3>Filter</h3>
            <div className="filters">
              {filters.map((filter, index) => (
                <button
                  key={index}
                  value={filter}
                  onClick={(e) => handleClick(e, filter)}
                  className={
                    `btn btn-selected--${
                      currentFilter === filter ? 'true' : 'false'
                    }`
                  }
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="lists">
            {currentFilter === "All" ? (
              filters.map((filter, index) => (
                <div key={index} className="list">
                  {filter !== "All" && <h3>{filter}</h3>}
                  {filtering(filter).map((doc, index) => (
                    <DocumentLink doc={doc} key={index} />
                  ))}
                </div>
              ))
            ) : (
              <div className="list">
                <h3>{currentFilter}</h3>
                {filtering(currentFilter).map((doc, index) => (
                  <DocumentLink doc={doc} key={index} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="max-width-override">
        <Footer />
      </div>
    </>
  )
}

export default ApprovedListPage

export const Head = () => (
  <Seo title="Approved management plans" />
)
