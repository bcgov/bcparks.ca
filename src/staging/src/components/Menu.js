import React from "react"

export default function Menu({ children }) {
  return <div id="menu" dangerouslySetInnerHTML={{ __html: children }} />
}
