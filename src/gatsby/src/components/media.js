import React from "react"

export default function Media(props)
{
  if (!props.isVisible) {
    return null;
  }
    return (
    <img src={props.url} alt="Example" />
  )
}