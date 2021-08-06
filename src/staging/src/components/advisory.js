import React from "react"

export default function Advisory({ data }) {
  return (
    <>
      <h1>Activities</h1>
      {data && (
        <div classNName="indent">
          <ul>
            {data.map((activity, index) => (
              <li key={index}>
                <img src={activity.icon} width="24" height="24"></img>
                {activity.activityName}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  )
}
