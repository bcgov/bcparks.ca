import React from "react"
import { styled } from '@mui/material/styles';
import { Card, CardHeader, Avatar } from "@mui/material"

import campfireBanIcon from "../images/park/campfire-ban-48.png"

const StyledCard = styled(Card)({
  border: "none",
  boxShadow: "none",
});

export default function CampfireBan() {
  return (
    <StyledCard>
      <CardHeader
        className="access-icon campfire-icon"
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
