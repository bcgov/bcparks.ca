import React, { useRef, useEffect } from "react"
import { Paper, Grid } from "@material-ui/core"
import MapView from "@arcgis/core/views/MapView"
import WebMap from "@arcgis/core/WebMap"
import ScaleBar from "@arcgis/core/widgets/ScaleBar"

import Heading from "./heading"
import Spacer from "./spacer"

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
        ui: {
          components: ["attribution"]
        }
      })

      const scaleBar = new ScaleBar({
        view: view,
        unit: "metric",
      })

      view.ui.add(scaleBar, {
        position: "bottom-left",
      })

      view.on("mouse-wheel", (event) => {
        event.stopPropagation()
      })

      view.on("double-click", (event) => {
        event.stopPropagation()
      });

      view.on("drag", (event) => {
        event.stopPropagation()
      });

    }
  }, [data.latitude, data.longitude, data.mapZoom])

  return (
    <Grid item xs={12} id="park-map-container" className="anchor-link">
      <Paper elevation={0}>
        <Heading>Maps and location</Heading>
        <a href="https://governmentofbc.maps.arcgis.com/apps/webappviewer/index.html?id=077ef73a1eae4ca88f2bafbb831215af&query=British_Columbia_Parks_Ecological_Reserves_and_Protected_Areas_8747,ORCS_PRIMARY,0000">
        <div id="mapDiv" ref={mapRef}></div>
        </a>
        <Spacer />
      </Paper>
    </Grid>
  )
}
