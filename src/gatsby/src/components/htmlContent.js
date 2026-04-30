import React, { useMemo } from "react"
import { usePreRenderVideo } from "../utils/usePreRenderVideo"
import { applyCkeditorLinkDecorators } from "../utils/ckeditorLinkDecoratorHelper"

export default function HtmlContent(props = {}) {
  // Apply link decorators from CKEditor
  const decoratedHtml = useMemo(
    () => applyCkeditorLinkDecorators(props.children),
    [props.children]
  )

  // Process YouTube video embeds
  const { htmlContent } = usePreRenderVideo(decoratedHtml)

  if (!props) return null
  return (
    <div
      lang="en"
      aria-hidden={props.ariaHidden}
      className={`raw-html-content ${props.className ? props.className : ""}`}
      dangerouslySetInnerHTML={{ __html: htmlContent || decoratedHtml }}
    />
  )
}
