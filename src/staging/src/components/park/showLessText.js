import React from "react"
import HtmlContent from "./HtmlContent"

export default function ShowLessText({ text, length = 300 }) {
  if (text.length < length) {
    return <HtmlContent>{text}</HtmlContent>
  }

  return (
    <div>
      <HtmlContent>{`${text.slice(0, length)}...`}</HtmlContent>
    </div>
  )
}
