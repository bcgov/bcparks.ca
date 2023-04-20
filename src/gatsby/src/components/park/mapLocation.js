import React, { useRef, useEffect } from "react"
import { Paper, Grid } from "@material-ui/core"
import MapView from "@arcgis/core/views/MapView"
import WebMap from "@arcgis/core/WebMap"
import ScaleBar from "@arcgis/core/widgets/ScaleBar"
import Fullscreen from "@arcgis/core/widgets/Fullscreen"
import Locate from "@arcgis/core/widgets/Locate"
 
import Heading from "./heading"
import Spacer from "./spacer"

export default function MapLocation({ data }) {
  const webMapId = "bdc3d62fffc14e2da2eb85c9a763bac2"
  const portalUrl = "https://governmentofbc.maps.arcgis.com"
  const linkZoom = data.mapZoom + 1;

  const mapRef = useRef("")

  const externalLink = `${portalUrl}/apps/webappviewer/index.html?id=077ef73a1eae4ca88f2bafbb831215af&query=British_Columbia_Parks_Ecological_Reserves_and_Protected_Areas_8747,ORCS_PRIMARY,${data.parkOrcs}&center=${data.longitude},${data.latitude}&level=${linkZoom}`

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
        zoom: data.mapZoom
      })

      const scaleBar = new ScaleBar({
        view: view,
        unit: "metric",
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

      // As per CM-209. Currently the map layers point back to the legacy URLs
      // This can be removed when the layers are updated in the arcgis instance
      view.on("click", (event) => {
        event.stopPropagation()
      });


    }
  }, [data.latitude, data.longitude, data.mapZoom])

  return (
    <Grid item xs={12} id="park-map-container" className="anchor-link">
      <Paper elevation={0}>
        <Heading>Maps and location</Heading>
        {data.latitude && data.longitude && (
          <div>
            <div id="mapDiv" ref={mapRef}></div>
            <p><a href={externalLink}>View a more detailed map.</a></p>
            <Spacer />
          </div>
        )}
      </Paper>
    </Grid>
  )
}
