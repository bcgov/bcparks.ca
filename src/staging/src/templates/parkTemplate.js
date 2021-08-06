import React, { useState, useEffect } from "react"
import ParkActivity from "../components/parkActivity"
import ParkFacility from "../components/parkFacility"
import "./parkTemplate.css"

export default function ParkTemplate({ pageContext: { park } }) {
  const [data, setData] = useState([])

  useEffect(async () => {
    const result = await fetch(
      `http://localhost:1337/public-advisories?protectedAreas.orcs=${park.orcs}`
    )
    const resultData = await result.json()
    console.log(resultData)

    setData(resultData)
  }, [])

  return (
    <div>
      <h1>{park.protectedAreaName}</h1>
      <ParkActivity data={park.parkActivities} />
      <ParkFacility data={park.parkFacilities} />
    </div>
  )
}
