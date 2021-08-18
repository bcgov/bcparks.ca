import React from "react"
import HtmlContent from "./HtmlContent"

export default function ShowMoreText({ text, length = 300 }) {
  if (text.length < length) return null

  return (
    <div>
      <HtmlContent>{`...${text.slice(length, text.length)}`}</HtmlContent>
    </div>
  )
}
