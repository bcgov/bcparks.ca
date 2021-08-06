import React from "react"

export default function ParkFacility({ data }) {
  return (
    <>
      <h1>Facilities</h1>
      {data && (
        <div className="indent">
          <ul>
            {data.map((facility, index) => (
              <li key={index}>
                <img
                  src={facility.icon}
                  alt={facility.activityName}
                  width="24"
                  height="24"
                ></img>
                {facility.facilityName}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  )
}
