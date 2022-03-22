import React, { useState, useEffect, useRef } from "react"
import PropTypes from "prop-types"
import {
  Grid,
  Button,
  Box,
  Paper,
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

export default function ParkHeader({
  park,
  menu,
  hasReservations,
  hasDayUsePass,
  isLoadingAdvisories,
  advisoryLoadError,
  advisories,
}) {
  const menuItems = useRef([...menu])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [openMenu, setOpenMenu] = useState(false)
  const reservationsURL = "https://camping.bcparks.ca";
  const dayUsePassURL = "https://reserve.bcparks.ca/dayuse";

  useEffect(() => {
    menuItems.current[currentIndex].visible = false
    return
  }, [currentIndex])

  const handleMenuClick = () => {
    setOpenMenu(!openMenu)
  }

  const handleMenuChange = index => {
    const items = menuItems.current
    items[currentIndex].visible = true
    items[index].visible = false
    menuItems.current = [...items]
    setCurrentIndex(index)
    handleMenuClick()
    navigate(`#${menuItems.current[index].url}`)
  }

  return (
    <Paper elevation={0} id="park-header-container">
      <div className="col-12 no-padding">
        <Grid item xs={12}>
          <Box mt={0}>
            <h1 className="park-heading">{park.protectedAreaName}</h1>
          </Box>
        </Grid>
        <div className="d-none d-xl-block d-lg-block d-md-none d-sm-none d-xs-none">
          <div className="flex-display p10t">
            <Grid item xs={12} sm={12} md={12} lg={7}>
              <>
                {hasReservations && (
                  <Button
                    className="yellow-button mr-3"
                    href={reservationsURL}
                  >
                    Book a campsite
                  </Button>
                )}
                {hasDayUsePass && (
                  <Button
                    className="blue-button"
                    href={dayUsePassURL}
                  >
                    Get a daypass
                  </Button>
                )}
              </>
            </Grid>
            {!isLoadingAdvisories && !advisoryLoadError && (
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={5}
                className="park-info-header-flex"
              >
                <div className="park-info-header park-access">
                  <ParkAccessStatus advisories={advisories} />
                </div>

                <div className="park-info-header ml-auto park-access">
                  <Advisory advisories={advisories} />
                </div>
              </Grid>
            )}
          </div>
        </div>
        <div className="d-block d-sm-block d-xs-block d-md-block d-lg-none d-xl-none">
          <Grid item xs={12} sm={12} md={12} className="park-info-header-flex">
            <div className="park-info-header">
              <ParkAccessStatus advisories={advisories} />
            </div>
            <div className="park-info-header">
              <Advisory advisories={advisories} />
            </div>
          </Grid>

          <Grid item xs={12} className="mb-2">
            {hasReservations && (
              <Button
              className="yellow-button full-width mt-2"
              href={reservationsURL}
              >
                  Book a campsite
                </Button>
            )}
            {hasDayUsePass && (
                <Button 
                  className="blue-button full-width mt-2"
                  href={dayUsePassURL}>
                  Get a daypass
                </Button>
            )}
          </Grid>
          {/* Mobile */}
          <Grid item xs={12} className="park-menu-mobile">
            <List
              component="nav"
              aria-labelledby="park-menu-mobile"
              disablePadding
            >
              <ListItem button onClick={handleMenuClick}>
                <ListItemText>
                  {menuItems.current[currentIndex].text}
                </ListItemText>
                {openMenu ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse in={openMenu} timeout="auto" unmountOnExit>
                {menuItems.current.map((item, index) => (
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
        </div>
      </div>
    </Paper>
  )
}

ParkHeader.propTypes = {
  park: PropTypes.shape({
    protectedAreaName: PropTypes.string,
    orcs: PropTypes.number,
  }).isRequired,
  menu: PropTypes.array.isRequired,
  isLoadingAdvisories: PropTypes.bool.isRequired,
  advisoryLoadError: PropTypes.any,
  hasReservations: PropTypes.bool,
  advisories: PropTypes.array,
}
