import React from "react"
import { usePreRenderVideo } from "../utils/usePreRenderVideo"

export default function HTMLArea(props) {
  const { htmlContent } = usePreRenderVideo(props.children)

  if (!props.isVisible) {
    return null;
  }
  return (
    <div dangerouslySetInnerHTML={{ __html: htmlContent || props.children}}/>
  )
}