import React from "react"
import { graphql } from "gatsby"
import Header from "../components/header"
import Footer from "../components/footer"

export default function WebPage({ data }) {
  const post = data.markdownRemark
  return (
    <div>
    <Header/>
    <Footer/>
    </div>
  )
}

