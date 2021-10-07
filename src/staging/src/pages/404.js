import * as React from "react"
import { Link } from "gatsby"
import Layout from "../components/layout"
import Seo from "../components/seo"

const NotFoundPage = () => (
  <Layout>
    <Seo title="404: Not found" />
    <br />
    <h3>Sorry, this page isn't available</h3>
    <p>
      The link you followed may be broken, unavailable or have been removed.
    </p>
    <Link to="/">Go back to homepage</Link>
  </Layout>
)

export default NotFoundPage
