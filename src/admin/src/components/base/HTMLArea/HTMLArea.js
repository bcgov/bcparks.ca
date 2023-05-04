import React from "react"

export default function HTMLArea(props) {
    return (
        <div dangerouslySetInnerHTML={{ __html: props.children}}/>
    )
}