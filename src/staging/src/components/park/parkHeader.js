import React, { useState } from "react"
import {
  Grid,
  Button,
  Box,
  Paper,
  Hidden,
  Collapse,
  List,
  ListItem,
  ListItemText,
} from "@material-ui/core"
import ParkAccessStatus from "./parkAccessStatus"
import Advisory from "./advisory"
import ExpandLess from "@material-ui/icons/ExpandLess"
import ExpandMore from "@material-ui/icons/ExpandMore"

import { navigate } from "gatsby"

export default function ParkHeader({ data }) {
  const { advisories, parkAccessStatus, park } = data

  const items = [
    { text: "Park Overview", url: "park-overview-container", visible: false },
    {
      text: "Accessibility",
      url: "accessibility-details-container",
      visible: true,
    },
    {
      text: `Alerts`,
      url: "park-advisory-details-container",
      visible: true,
    },
    { text: "Camping", url: "park-camping-details-container", visible: true },
    { text: "Facilities", url: "park-facility-container", visible: true },
    { text: "Activities", url: "park-activity-container", visible: true },
    { text: "Maps and Location", url: "park-map-container", visible: true },
    {
      text: "Learn about this park",
      url: "park-about-container",
      visible: true,
    },
  ]
  const hasCamping = data.parkAccessStatus.parkFacilities.some(facility =>
    facility.facilityName.toLowerCase().includes("camping")
  )
  if (!hasCamping) items[3].visible = false
  if (data.parkAccessStatus.parkFacilities.length === 0)
    items[4].visible = false
  if (data.parkAccessStatus.parkActivities.length === 0)
    items[5].visible = false

  const [menuItems, setMenuItems] = useState([...items])

  const [currentIndex, setCurrentIndex] = useState(0)
  const [openMenu, setOpenMenu] = useState(false)

  const handleMenuClick = () => {
    setOpenMenu(!openMenu)
  }

  const handleMenuChange = index => {
    const items = menuItems
    items[currentIndex].visible = true
    items[index].visible = false
    setMenuItems([...items])
    setCurrentIndex(index)
    handleMenuClick()
    navigate(`#${menuItems[index].url}`)
  }

  return (
    <Paper elevation={0} id="park-header-container">
      <div className="col-12 no-padding">
        <Grid item xs={12}>
          <Box mt={0}>
            <h1 className="park-heading">{park.protectedAreaName}</h1>
          </Box>
        </Grid>
        <Hidden smDown implementation="css">
          <div className="flex-display p10t">
            <Grid item xs={12} sm={12} md={7} lg={7}>
              <Button
                className="yellow-button"
                href="https://discovercamping.ca/"
              >
                Book a campsite
              </Button>
              <Button className="blue-button ml10" href="#">
                Get a daypass
              </Button>
            </Grid>

            <Grid
              item
              xs={12}
              sm={12}
              md={5}
              lg={5}
              className="park-info-header-flex"
            >
              <div className="park-info-header park-access">
                <ParkAccessStatus data={parkAccessStatus.accessStatus} />
              </div>
              <div className="park-info-header ml-auto">
                <Advisory data={advisories} />
              </div>
            </Grid>
          </div>
        </Hidden>
        <Hidden smUp implementation="css">
          <Grid item xs={12} sm={12} className="park-info-header-flex">
            <div className="park-info-header">
              <ParkAccessStatus data={parkAccessStatus.accessStatus} />
            </div>
            <div className="park-info-header">
              <Advisory data={advisories} />
            </div>
          </Grid>
          <Grid item xs={12}>
            <div className="p20t">
              <Button
                className="yellow-button full-width"
                href="https://discovercamping.ca/"
              >
                Book a campsite
              </Button>
            </div>
            <div className="p10t">
              <Button className="blue-button full-width" href="#">
                Get a daypass
              </Button>
            </div>
          </Grid>
          {/* Mobile */}
          <Grid item xs={12} className="park-menu-mobile">
            <List
              component="nav"
              aria-labelledby="park-menu-mobile"
              disablePadding
            >
              <ListItem button onClick={handleMenuClick}>
                <ListItemText>{menuItems[currentIndex].text}</ListItemText>
                {openMenu ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse in={openMenu} timeout="auto" unmountOnExit>
                {menuItems.map((item, index) => (
                  <div key={index}>
                    {item.visible && (
                      <List component="div" disablePadding>
                        <ListItem
                          button
                          onClick={() => {
                            handleMenuChange(index)
                          }}
                        >
                          <ListItemText primary={item.text} />
                        </ListItem>
                      </List>
                    )}
                  </div>
                ))}
              </Collapse>
            </List>
          </Grid>
        </Hidden>
      </div>
    </Paper>
  )
}
