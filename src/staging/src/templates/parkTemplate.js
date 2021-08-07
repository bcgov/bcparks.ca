import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import ParkActivity from "../components/parkActivity"
import ParkFacility from "../components/parkFacility"
import "./parkTemplate.css"

export default function ParkTemplate({ data }) {
  const park = data.strapiProtectedArea
  const test = data.allStrapiActivityTypes
  console.log(test)

  return (
    <div>
      <h1>{park.protectedAreaName}</h1>

      {/* <ParkActivity data={park.parkActivities} />
      <ParkFacility data={park.parkFacilities} /> */}
    </div>
  )
}

export const query = graphql`
  query($orcs: Int) {
    allStrapiActivityTypes(sort: { fields: activityName }) {
      totalCount
      nodes {
        activityName
        activityNumber
      }
    }
    allStrapiFacilityTypes(sort: { fields: facilityName }) {
      totalCount
      nodes {
        facilityName
        facilityNumber
      }
    }
    strapiProtectedArea(orcs: { eq: $orcs }) {
      protectedAreaName
      status
      orcs
      marineArea
      type
      typeCode
      parkActivities {
        activityType
        isActive
        isActivityOpen
        name
      }
      parkFacilities {
        facilityType
        isActive
        isFacilityOpen
        name
      }
    }
  }
`
