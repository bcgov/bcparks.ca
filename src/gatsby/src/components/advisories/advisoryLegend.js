import React from "react"
import "../../styles/advisories/advisoryLegend.scss"

const AdvisoryLegend = () => {
  const legendItems = [
    {
      label: "High",
      description: "Immediate danger and closures",
      color: "#d8292f",
    },
    {
      label: "Medium",
      description: "Safety and health related",
      color: "#fcba19",
    },
    {
      label: "Low",
      description: "Discretion and warnings",
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
                  <strong className="legend-label d-md-block">
                    {legendItem.label}
                  </strong>
                  <em className="legend-description ml-2 ml-md-0">
                    {legendItem.description}
                  </em>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <div className="mb-4 mt-3 px-md-5 mx-md-5 font-italic text-center">
        Advisories are updated Monday to Friday 8:30 to 4:30, excluding statutory holidays.<br />
        Get up-to-date provincial emergency information for wildfires, floods, and highways from:<br />
        <a href="https://www2.gov.bc.ca/gov/content/safety/wildfire-status">
          BC Wildfire Service
        </a>{", "}
        <a href="https://www2.gov.bc.ca/gov/content/environment/air-land-water/water/drought-flooding-dikes-dams/river-forecast-centre">
          BC River Forecast Centre
        </a>{", "}
        <a href="https://drivebc.ca">Drive BC</a>
      </div>
    </div>
  )
}

export default AdvisoryLegend
