import React from "react"

export default function ParkActivity({ data }) {
  return (
    <>
      <h1>Activities</h1>
      {data && (
        <div className="indent">
          <ul>
            {data.map((activity, index) => (
              <li key={index}>
                <img
                  src={activity.icon}
                  alt={activity.activityName}
                  width="24"
                  height="24"
                ></img>
                {activity.activityName}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  )
}
