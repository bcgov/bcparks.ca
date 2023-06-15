import React from "react"
import { styled } from '@mui/material/styles';
import { Card, CardHeader, Avatar } from "@mui/material"

import campfireBanIcon from "../../images/park/campfire-ban-48.png"

const PREFIX = 'campfireBan';

const classes = {
  card: `${PREFIX}-card`
};

const StyledCard = styled(Card)({
  [`&.${classes.card}`]: {
    border: "none",
    boxShadow: "none",
  },
});

export default function CampfireBan() {
  return (
    <StyledCard className={classes.card}>
      <CardHeader
        className="access-icon"
        avatar={
          <Avatar
            variant="square"
            src={campfireBanIcon}
            aria-label="campfires prohibited"
            className="park-overview-icon"
            alt="Campfires are prohibited"
          />
        }
        title="No campfires"
      />
    </StyledCard>
  );
}
