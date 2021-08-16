import React from "react"

export default function Menu({children}) {
  return (
    <div className="d-none d-sm-block pt-1" id="home-menu" dangerouslySetInnerHTML={{ __html: children}}/>
  )
}