import React from "react"

export default function HtmlContent(props) {
  if (!props) return null
  return (
    <div
      className="raw-html-content"
      dangerouslySetInnerHTML={{ __html: props.children }}
    />
  )
}
