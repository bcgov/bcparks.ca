import React from "react"
import { useStaticQuery, graphql } from "gatsby"

const useProtectedArea = () => {
  const { data } = useStaticQuery(
    graphql`
      query {
        allStrapiProtectedArea(limit: -1) {
          nodes {
            id
            orcs
            protectedAreaName
          }
          totalCount
        }
      }
    `
  )
  console.log(data)
  return data
}
