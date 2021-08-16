import React from "react"

export default function HtmlContent(props) {
  if (!props) return null
  return <div dangerouslySetInnerHTML={{ __html: props.children }} />
}
