import * as React from "react"

const Footer = () => {
  return (
    <>
      <footer
        style={{
          marginTop: `2rem`,
        }}
      >
        © {new Date().getFullYear()} <a href="https://bcparks.ca">BC Parks</a>
      </footer>
    </>
  )
}

export default Footer
