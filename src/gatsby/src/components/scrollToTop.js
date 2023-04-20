import React, { useState, useEffect } from "react"
import { Fab } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp"

const useStyles = makeStyles(theme => ({
  toTop: {
    zIndex: 100,
    position: "fixed",
    bottom: "2vh",
    color: "#ffffff",
    opacity: "0.75",
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
    },
  },
}))

export default function ScrollToTop() {
  const classes = useStyles()
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
    <>
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
    </>
  )
}
