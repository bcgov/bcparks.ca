import React from "react"

export default function Header({ children }) {
  return <header id="header" dangerouslySetInnerHTML={{ __html: children }} />
}
