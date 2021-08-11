import React from "react"
import { Paper, Typography } from "@material-ui/core"
import Heading from "./heading"

export default function Advisory({ data }) {
  const advisories = data.nodes
  return (
    <>
      <div id="park-alerts">
        <Paper>
          <Heading title={`Alerts (${advisories.length})`} />
          {data &&
            advisories.map((advisory, index) => (
              <li key={index}>{advisory.title}</li>
            ))}
        </Paper>
      </div>
    </>
  )
}
