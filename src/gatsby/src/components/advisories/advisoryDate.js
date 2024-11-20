import React from 'react';
import "../../styles/advisories/advisoryDate.scss";

const AdvisoryDate = ({
  hasEffectiveDateDisplay,
  hasEndDateDisplay,
  effectiveDate,
  hasEffectiveDateRange,
  endDate,
  hasAdvisoryDateDisplay,
  advisoryDate,
  hasUpdatedDateDisplay,
  updatedDate,
  hasDisplayedDate
}) => {
  return (
    <>
      {hasEffectiveDateDisplay && (
        hasEndDateDisplay ? (
          <div className="date">
            <small>In effect</small>
            <small>
              <b>
                {effectiveDate}
                {hasEffectiveDateRange && ` to ${endDate}`}
              </b>
            </small>
          </div>
        ) : (
          <div className="date">
            <small>Starts</small>
            <small><b>{effectiveDate}</b></small>
          </div>
        )
      )}
      {hasAdvisoryDateDisplay && (
        <div className="date">
          <small>Posted</small>
          <small><b>{advisoryDate}</b></small>
        </div>
      )}
      {hasUpdatedDateDisplay && (
        <div className="date">
          <small>Updated</small>
          <small><b>{updatedDate}</b></small>
        </div>
      )}
      {/* if "No date" is selected */}
      {!hasDisplayedDate && (
        updatedDate ? (
          <div className="date">
            <small>Updated</small>
            <small><b>{updatedDate}</b></small>
          </div>
        ) : (
          advisoryDate && (
            <div className="date">
              <small>Posted</small>
              <small><b>{advisoryDate}</b></small>
            </div>
          )
        )
      )}
    </>
  );
};

export default AdvisoryDate;