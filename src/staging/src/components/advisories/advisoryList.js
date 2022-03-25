
import React from "react"

import AdvisoryCard from "../advisories/advisoryCard"

const AdvisoryList = ({ advisories }) => {
  // NB when paging was done in front-end, this component
  // had more work to do. However this component still processes
  // visible advisories for dates, alerts, etc.

  let haveAdvisories = false;

  const processDate = (date) => {
      // dates come in as strings, need processing for display purposes
      // several dates per advisory need processing, which is why this is a separate fn
    var pd = {
      dateStr: "",
      monthStr: "",
      yearStr: "",
      str: "",
      dateUnknown: true
    };
    if (date) {
      var d = new Date(date);

      var options = { month: 'short' };
      var month = new Intl.DateTimeFormat('en-US', options).format(d);

      pd.dateStr = d.getDate().toString();
      pd.monthStr = month;
      pd.yearStr = d.getFullYear().toString();
      pd.str = pd.monthStr + " " + pd.dateStr + ", " + pd.yearStr;
      pd.dateUnknown = false;
    } 

    return pd
  }

  const processAlertLevel = (advisory) => {
    // Determine color for alert
    var color = advisory.urgency.color
    
    advisory.alertClass = color + "Alert";
    
    let capColor = "";
    let level = "";
    
    switch (color) {
      case "red":
        capColor = "Red";
        level = "High";
        break;
      case "yellow":
        capColor = "Yellow";
        level = "Moderate";
        break;
      case "blue":
        capColor = "Blue";
        level = "Low";
        break;
      default:
        capColor = "Grey";
        level = "Informational";
        break;
    }

    // alertMsg to use for aria-label on date circle, for screen readers
    if (capColor === "Grey") {
      advisory.alertMsg = "Grey Advisory - Informational Advisory"
    } else {
      advisory.alertMsg = capColor + " Advisory - " + level + " Urgency"; // eg Red alert - high urgency
    }


  }

  const processAdvisories = (a) => {
    
    // determine properties not found from api call or need processing
      
    if(a.length > 0){ // otherwise no advisories yet

        a.forEach((advisory) => {

          processAlertLevel(advisory);

          // Determine if card has details
          advisory.detailsClass = (advisory.description || advisory.isEffectiveDateDisplayed) ? "details" : "noDetails";

          // Process date strings
          advisory.advisoryDateObj = processDate(advisory.advisoryDate);
          advisory.effectiveDateObj = processDate(advisory.effectiveDate);
          advisory.endDateObj = processDate(advisory.endDate);

          advisory.isFirstInYear = false; // assume this, check below

        })

        // mark advisories that are first in that year
        // when true, year displayed above card

        var y = ""; // placeholder year
        for (let idx in a) {
        let ai = a[idx];     
        if (y !== ai.advisoryDateObj.yearStr) {   
            ai.isFirstInYear = true; 
            y = ai.advisoryDateObj.yearStr;
        } 
      }
    }
    
    haveAdvisories = true;
    return (a);
  }

  processAdvisories(advisories);

  return (
    <>  
    { haveAdvisories && (       
      <div>
          {advisories.map((advisory, index) => (
           <AdvisoryCard key={index} advisory={advisory} index={index}></AdvisoryCard>
          ))}
      </div>
    )}
    </>
  );

}

export default AdvisoryList