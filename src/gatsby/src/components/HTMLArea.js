import React from "react"
import { useContent } from "../utils/useContent"

export default function HTMLArea(props) {
  const { htmlContent } = useContent(props.children)

  if (!props.isVisible) {
    return null;
  }
  return (
    <div dangerouslySetInnerHTML={{ __html: htmlContent || props.children}}/>
  )
}