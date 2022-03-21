import React from "react"
import moment from "moment"
import HTMLArea from "../HTMLArea"
import Heading from "./heading" // TODO this is MUI, but in many places

export default function ParkDates({ data }) {
  const parkOperation = data.parkOperation || {}
  const subAreas = data.subAreas || []

  // Operations record is required, even if subarea records are present
  // If no operations record, show "not available" message
  const hasOperations = parkOperation.isActive // either false, or whole record missing

  const fmt = "MMM DD, yyyy" // date format for display

  // -------- Operating Dates --------

  const datePhrase = (openDate, closeDate) => {
    if (openDate && closeDate) {
      try {
        const open = moment(openDate).format(fmt)
        const close = moment(closeDate).format(fmt)

        // check if dates go from jan 1 to dec 31
        // for puposes of checking if year-round, ignoring year
        const openYearRound =
          open.indexOf("Jan 01") === 0 && close.indexOf("Dec 31") === 0
        let output = openYearRound ? "year-round" : open + " - " + close

        return output
      } catch (err) {
        console.log("Err formatting date " + openDate + ", " + closeDate)
        return ""
      }
    } else {
      return "-" // at least one date missing
    }
  }

  // Overall operating dates for parks, to display above subareas
  // TODO override with closures via advisories
  const parkDates = datePhrase(parkOperation.openDate, parkOperation.closeDate)

  // ---- Subarea Dates -----
  const subAreaCount = subAreas.length

  let dates = []

  for (let idx in subAreas) {
    const subArea = subAreas[idx]

    if (subArea.isActive) {
      // Subarea operating dates
      const saDates = subArea.parkOperationSubAreaDates
      let saDateCount = 0
      for (let dIdx in saDates) {
        saDateCount++
        const dateRec = saDates[dIdx]
        if (dateRec.isActive) {
          const serviceDates = datePhrase(
            dateRec.serviceStartDate,
            dateRec.serviceEndDate
          )
          const resDates = datePhrase(
            dateRec.reservationStartDate,
            dateRec.reservationEndDate
          )
          // TODO winter dates

          dates.push({
            dateCount: saDateCount,
            subArea: subArea.parkSubArea,
            serviceDates: serviceDates,
            resDates: resDates,
          })
        }
      }

      // TODO process subarea type
      // Show subarea type icon
      // Add other related icons e.g. accessibility
      // Link to activty section on page
    }
  }
  // Subareas to appear in alpha order
  dates.sort((a, b) => (a.subArea >= b.subArea ? 1 : -1))

  // -------- Operating Notes ----------

  // Use this to configure which notes show below the subareas,
  // and in what order. Note that "openNote" appears separately above subareas
  const notesList = [
    "generalNote",
    "serviceNote",
    "reservationsNotes",
    "offSeasonNote",
  ]

  let notes = []
  for (const nIdx in notesList) {
    const n = notesList[nIdx]
    if (parkOperation[n]) {
      notes.push({ noteType: n, display: parkOperation[n] })
    }
  }

  // -------- Capacity Counts ----------

  const countsList = [
    // Use this to configure which counts show and in what order
    // Don't show if isActive is false
    {
      display: "Total number of wilderness campsites",
      countVar: "wildernessSites",
      isActive: true,
    },
    {
      display: "Total number of backcountry campsites",
      countVar: "backgrountrySites",
      isActive: true,
    },
    {
      display: "Total number of vehicle-accessible campsites",
      countVar: "vehicleSites",
      isActive: true,
    },
    {
      display: "Total number of group campsites",
      countVar: "groupSites",
      isActive: true,
    },
    {
      display: "Total number of RV-accessible campsites",
      countVar: "rvSites",
      isActive: true,
    },
    {
      display: "Total number of reservable frontcountry campsites",
      countVar: "reservableSites",
      isActive: true,
    },
    { display: "", countVar: "totalCapacity", isActive: false },
    { display: "", countVar: "reservableSites", isActive: false },
    { display: "", countVar: "nonReservableSites", isActive: false },
    { display: "", countVar: "doubleSites", isActive: false },
    { display: "", countVar: "pullThroughSites", isActive: false },
    { display: "", countVar: "horseSites", isActive: false },
    { display: "", countVar: "cabins", isActive: false },
    { display: "", countVar: "huts", isActive: false },
    { display: "", countVar: "yurts", isActive: false },
    { display: "", countVar: "shelters", isActive: false },
    { display: "", countVar: "boatLaunches", isActive: false },
    { display: "", countVar: "vehicleSitesReservable", isActive: false },
    { display: "", countVar: "rvSitesReservable", isActive: false },
  ]

  let counts = []
  let asterixFootnote = false // show only if necessary
  for (const cIdx in countsList) {
    const c = countsList[cIdx]
    if (c.isActive) {
      const countVal = parkOperation[c.countVar]
      if (countVal) {
        counts.push({ display: c.display, countVal: countVal })
        if (countVal === "*") {
          // need to explain * as a count
          asterixFootnote = true
        }
      }
    }
  }

  return (
    <div id="park-dates-container" className="anchor-link mb-3">
      <div className="anchor-link">
        <Heading>Dates of Operation</Heading>
        {!hasOperations && (
          <div className="font-italic">
            There is currently no operating date information available
          </div>
        )}
        {hasOperations && (
          <>
            <div className="dates-header font-italic text-center">
              All dates are subject to change without notice.
            </div>
            <div className="font-italic text-center">
              While this site is in beta, make sure to check advisories below,
              which may affect these dates
            </div>
            {parkDates && (
              <>
                <h4 className="dates-access-dates text-center mt-3">
                  The park is open to public access {parkDates}
                </h4>
              </>
            )}

            {parkOperation.openNote && (
              <div className="dates-open-note">
                <HTMLArea isVisible={true}>{parkOperation.openNote}</HTMLArea>
              </div>
            )}

            {subAreaCount && (
              <>
                <hr />
                <div className="dates-sub-areas">
                  <div className="row">
                    <div className="col col-3">&nbsp;</div>
                    <div className="col col-3 text-center">
                      Main Camping Season
                      <div>(Full services and fees)</div>
                    </div>
                    <div className="col col-3 text-center">
                      Reservable Dates
                    </div>
                    <div className="col col-3 text-center">
                      Winter Camping Season
                      <div>(Not available in beta)</div>
                    </div>
                  </div>

                  {dates.map((d, index) => (
                    <div
                      key={index}
                      className={
                        d.dateCount === 1
                          ? "border-dark border-top row pt-3 mt-3 ml-1"
                          : "row py-1"
                      }
                    >
                      <div className="col col-3 pl-0">
                        {d.dateCount === 1 ? <>{d.subArea}</> : ""}
                      </div>
                      <div className="col col-3 text-center">
                        {d.serviceDates}
                      </div>
                      <div className="col col-3 text-center">{d.resDates}</div>
                      <div className="col col-3 text-center">&nbsp;</div>
                    </div>
                  ))}
                </div>
                <hr />
              </>
            )}

            {notes.length > 0 && (
              <div className="park-operation-notes mt-3">
                <div className="font-weight-bold">Notes</div>
                {notes.map((note, index) => (
                  <div key={index}>
                    {note.noteType === "offSeasonNote" && (
                      <div className="font-weight-bold">Winter Camping</div>
                    )}
                    <div key={index} className="park-operation-note">
                      <HTMLArea isVisible={true}>{note.display}</HTMLArea>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="park-operation-counts my-3">
              {counts.map((count, index) => (
                <div key={index} className="park-operation-count">
                  {count.display}: {count.countVal}
                </div>
              ))}
              {asterixFootnote && (
                <div className="">* Number of sites is undesignated</div>
              )}
            </div>
          </>
        )}
        <div className="m-3">&nbsp;</div>
      </div>
    </div>
  )
}
