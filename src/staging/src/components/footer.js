import React from "react"

export default function Footer({children}) {
  return (
    <footer id='footer' dangerouslySetInnerHTML={{ __html: children}}/>
  )
}