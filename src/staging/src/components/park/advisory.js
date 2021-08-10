import React from "react"

export default function Advisory({ data }) {
  return (
    <>
      <h1>Alert(s)</h1>
      {data && data.nodes.map((m, index) => <li key={index}>{m.title}</li>)}
    </>
  )
}
