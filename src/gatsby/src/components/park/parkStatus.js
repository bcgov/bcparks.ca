import React from "react"
import { styled } from '@mui/material/styles';
import { Grid, Box } from "@mui/material"

import Advisory from "./advisory"
import CampfireBan from "./campfireBan"
import ParkAccessStatus from "./parkAccessStatus"

const PREFIX = 'parkStatus';

const classes = {
  topGrid: `${PREFIX}-topGrid`
};

const StyledGrid = styled(Grid)({
  [`& .${classes.topGrid}`]: {
    backgroundColor: "#e1ecf4",
  },
});

export default function ParkStatus({ data }) {
  const { advisories, parkAccessStatus } = data
  const { hasCampfireBan, hasSmokingBan } = parkAccessStatus
  return (
    <StyledGrid item xs={12} id="park-status-container" className="anchor-link">
      <Box m={2}>
        <Grid container item spacing={0} xs={12} className={classes.topGrid}>
          <ParkAccessStatus data={parkAccessStatus.accessStatus} />
          <Advisory data={advisories} />
          <CampfireBan
            data={{
              hasCampfireBan,
              hasSmokingBan,
            }}
          />
        </Grid>
      </Box>
    </StyledGrid>
  );
}
