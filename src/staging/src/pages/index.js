import React from "react"
import { Link } from "gatsby"
import Layout from "../components/layout"

const IndexPage = ({ data }) => (
  <Layout>
    <h1>Hi,</h1>
    <p>Welcome to the new BC parks staging site.</p>
    <p>
      The links below are prototypes for CMS/Strapi plugin, showing 10 records
      only
    </p>
    <Link to="/park/">Parks</Link>
    <br />
    <Link to="/publicAdvisory/">Public Advisories</Link>
  </Layout>
)

export default IndexPage
