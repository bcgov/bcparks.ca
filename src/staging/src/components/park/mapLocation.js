import React, { useRef, useEffect } from "react"
import { Paper, Grid } from "@material-ui/core"
import Heading from "./heading"
import Spacer from "./spacer"
import MapView from "@arcgis/core/views/MapView"
import WebMap from "@arcgis/core/WebMap"

export default function MapLocation({ data }) {
  const webMapId = "bdc3d62fffc14e2da2eb85c9a763bac2"
  const portalUrl = "https://governmentofbc.maps.arcgis.com"

  const mapRef = useRef("")

  useEffect(() => {
    if (mapRef.current) {
      const webMap = new WebMap({
        portalItem: {
          id: webMapId,
          portal: { url: portalUrl },
        },
      })

      const view = new MapView({
        container: mapRef.current,
        map: webMap,
        center: [data.longitude, data.latitude],
        zoom: data.mapZoom,
      })
    }
  }, [])

  return (
    <Grid item xs={12} id="park-map-container" className="anchor-link">
      <Paper elevation={0}>
        <Heading>Maps and location</Heading>
        <div id="mapDiv" ref={mapRef}></div>
        <Spacer />
      </Paper>
    </Grid>
  )
}
