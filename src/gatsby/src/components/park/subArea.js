import React from "react"

import HTMLArea from "../HTMLArea"
import { countsList } from "../../utils/constants"

export default function SubArea({ data, showHeading }) {

  const subAreasNotesList = [
    { noteVar: "generalNote", display: "Note" },
    { noteVar: "serviceNote", display: "Service note" },
    { noteVar: "reservationNote", display: "Booking note" },
    { noteVar: "offSeasonNote", display: "Winter season note" },
  ]

  const isShown = (count, countGroup) => {
    return countGroup[count.countVar] &&
      countGroup[count.countVar] !== "0" &&
      countGroup[count.countVar] !== "*" &&
      count.isActive;
  }

  return (
    <div className="accordion-content">
      {showHeading && (<h4>{data.parkSubArea}</h4>)}
      <dl>
        {countsList
          .filter(count => isShown(count, data)).length > 0 && (
            <>
              <dt className="mt-3">Number of campsites</dt>
              <dd>
                <ul className="pl-4">
                  {countsList
                    .filter(count => isShown(count, data))
                    .map((count, index) => (
                      <li key={index}>
                        {count.display}:{" "}
                        {data[count.countVar]}
                      </li>
                    ))}
                </ul>
              </dd>
            </>
          )}
        {data.serviceDates.length > 0 && (
          <>
            <dt className="mt-3">
              Main operating season
            </dt>
            <dd>
              <ul className="pl-4">
                {data.serviceDates.map((dateRange, index) =>
                  <li key={index}>{dateRange}</li>
                )}
              </ul>
            </dd>
          </>
        )}
        <>
          <dt className="mt-3">Winter season</dt>
          <dd>
            {data.offSeasonDates.length > 0 ? (
              <ul className="pl-4">
                {data.offSeasonDates.map((dateRange, index) =>
                  <li key={index}>{dateRange}</li>
                )}
              </ul>
            ) : (
              data.operationDates.length > 0 ? (
                <>
                  {data.operationDates[0].includes("Year-round") ? "Limited services" : "No services"}
                </>
              ) : (
                <>Not known</>
              )
            )}
          </dd>
        </>
        {data.resDates.length > 0 && (
          <>
            <dt className="mt-3">Booking required</dt>
            <dd>
              <ul className="pl-4">
                {data.resDates.map((dateRange, index) =>
                  <li key={index}>{dateRange}</li>
                )}
              </ul>
            </dd>
          </>
        )}
        {subAreasNotesList
          .filter(note => data[note.noteVar])
          .map((note, index) => (
            <div key={index}>
              {note.display && (
                <dt className="mt-3">
                  {note.display}
                </dt>
              )}
              <dd>
                <HTMLArea isVisible={true}>
                  {data[note.noteVar]}
                </HTMLArea>
              </dd>
            </div>
          ))}
      </dl>
    </div>
  )
}