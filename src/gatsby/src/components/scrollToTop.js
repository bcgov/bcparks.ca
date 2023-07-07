import React, { useState, useEffect } from "react"
import { styled } from '@mui/material/styles';
import { Fab } from "@mui/material"
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp"

const PREFIX = 'scrollToTop';

const classes = {
  toTop: `${PREFIX}-toTop`
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('div')((
  {
    theme
  }
) => ({
  [`& .${classes.toTop}`]: {
    zIndex: 100,
    position: "fixed",
    bottom: "2vh",
    color: "#ffffff",
    opacity: "1",
    backgroundColor: "#003366",
    boxShadow: "none",
    "&:hover, &.Mui-focusVisible": {
      transition: "0.3s",
      color: "#ffffff",
      opacity: "1",
      backgroundColor: "#003366",
    },
    [theme.breakpoints.up("xs")]: {
      right: "5%",
    },
    [theme.breakpoints.up("md")]: {
      right: "2%",
      opacity: "0.75",
    },
  }
}));

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)

  const handleClick = () => {
    window[`scrollTo`]({ top: 0, behavior: `smooth` })
  }

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 500) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener("scroll", toggleVisibility)

    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  return (
    <Root>
      {isVisible && (
        <Fab
          size="small"
          onClick={handleClick}
          aria-label="scroll to top"
          className={classes.toTop}
        >
          <KeyboardArrowUpIcon />
        </Fab>
      )}
    </Root>
  );
}
