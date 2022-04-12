import React from "react"
import "../../styles/advisories/advisoryLegend.scss"

const AdvisoryLegend = () => {
  const legendItems = [
    {
      label: "High",
      description: "Immediate Danger and Closures",
      color: "#d8292f",
    },
    {
      label: "Medium",
      description: "Safety and Health Related",
      color: "#fcba19",
    },
    {
      label: "Low",
      description: "Discretion and Warnings",
      color: "#2464a4",
    },
  ]

  return (
    <div className="advisory-legend">
      <div className="row">
        {legendItems.map((legendItem, index) => {
          return (
            <div key={index} className="col col-12 col-md-4">
              <div className="advisory-legend-item row">
                <div
                  style={{ background: legendItem.color }}
                  className="legend-icon mr-3"
                >
                  &nbsp;
                </div>
                <div className="col">
                  <span className="legend-label font-weight-bold d-md-block">
                    {legendItem.label}
                  </span>
                  <span className="legend-description font-italic ml-2 ml-md-0">
                    {legendItem.description}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <div className="mb-4 mt-3 px-md-5 mx-md-5 font-italic text-center">
        For most up to date emergencies please visit BC Flood &amp; Wildfire
        Service and learn how to be prepared for an emergency before it happens.
        Updated Monday to Friday from 8:30 am to 4:30 pm, excluding statutory
        holidays.
      </div>
    </div>
  )
}

export default AdvisoryLegend
