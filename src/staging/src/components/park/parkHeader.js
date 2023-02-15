import React from "react"
import PropTypes from "prop-types"
import { Grid, Button, Box, Paper } from "@material-ui/core"

import Advisory from "./advisory"
import ParkAccessStatus from "./parkAccessStatus"
export default function ParkHeader({
  parkName,
  hasReservations,
  hasDayUsePass,
  isLoadingAdvisories,
  advisoryLoadError,
  advisories,
}) {
  const reservationsURL = "https://camping.bcparks.ca"
  const dayUsePassURL = "https://reserve.bcparks.ca/dayuse"

  return (
    <>
      <Paper elevation={0} id="park-header-container">
        <div className="col-12 no-padding">
          <Grid item xs={12}>
            <Box mt={0}>
              <h1>{parkName}</h1>
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
                      Book camping
                    </Button>
                  )}
                  {hasDayUsePass && (
                    <Button className="blue-button" href={dayUsePassURL}>
                      Get a day-use pass
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
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              className="park-info-header-flex"
            >
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
                  Book camping
                </Button>
              )}
              {hasDayUsePass && (
                <Button
                  className="blue-button full-width mt-2"
                  href={dayUsePassURL}
                >
                  Get a day-use pass
                </Button>
              )}
            </Grid>
          </div>
        </div>
      </Paper>
    </>
  )
}

ParkHeader.propTypes = {
  parkName: PropTypes.oneOfType([
    PropTypes.object.isRequired, PropTypes.string.isRequired
  ]),
  isLoadingAdvisories: PropTypes.bool.isRequired,
  advisoryLoadError: PropTypes.any,
  hasReservations: PropTypes.bool,
  advisories: PropTypes.array,
}
