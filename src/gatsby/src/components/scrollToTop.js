import React, { useState, useEffect } from "react"
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp"

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)

  const handleClick = () => {
    window[`scrollTo`]({ top: 0, behavior: `smooth` })
  }

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 500) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener("scroll", toggleVisibility)

    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  return (
    isVisible && (
      <button
        aria-label="scroll to top"
        onClick={handleClick}
        className="btn-scroll"
      >
        <div className="btn-scroll--inner">
          <KeyboardArrowUpIcon />
        </div>
      </button>
    )
  );
}
