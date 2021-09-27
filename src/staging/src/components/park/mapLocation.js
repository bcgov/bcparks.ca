import React, { useRef, useEffect } from "react"
import { Paper, Grid } from "@material-ui/core"
import Heading from "./heading"
import Spacer from "./spacer"
import MapView from "@arcgis/core/views/MapView"
import WebMap from "@arcgis/core/WebMap"
import ScaleBar from "@arcgis/core/widgets/ScaleBar"
import Fullscreen from "@arcgis/core/widgets/Fullscreen"
import Locate from "@arcgis/core/widgets/Locate"

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

      const scaleBar = new ScaleBar({
        view: view,
      })
      view.ui.add(scaleBar, {
        position: "bottom-left",
      })

      const locateWidget = new Locate({
        view: view,
      })
      view.ui.add(locateWidget, "top-left")

      const fullscreen = new Fullscreen({
        view: view,
      })
      view.ui.add(fullscreen, "top-left")
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
