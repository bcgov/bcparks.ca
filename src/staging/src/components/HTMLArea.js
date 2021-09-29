import React from "react"

export default function HTMLArea(props)
{
  if (!props.isVisible) {
    return null;
  }
    return (
    <div dangerouslySetInnerHTML={{ __html: props.children}}/>
  )
}