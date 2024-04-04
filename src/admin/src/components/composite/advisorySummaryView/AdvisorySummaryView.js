import React, { useState } from "react";
import PropTypes from "prop-types";
import "./AdvisorySummaryView.css";
import LaunchIcon from "@material-ui/icons/Launch";
import FileCopyOutlinedIcon from "@material-ui/icons/FileCopyOutlined";
import Chip from "@material-ui/core/Chip";
import moment from "moment";
import AdvisoryHistory from "../advisoryHistory/AdvisoryHistory";
import config from "../../../utils/config";

export default function AdvisorySummaryView({
  data: {
    advisory,
    isPublished,
    parkUrls,
    siteUrls,
    handleOpenSnackBar,
    showOriginalAdvisory,
  },
}) {
  const publicUrl = config.REACT_APP_PUBLIC_URL;
  const [showParks, setShowParks] = useState(false)
  const [showSites, setShowSites] = useState(false)

  const getDisplayedDate = (advisory) => {
    if (!advisory.isEffectiveDateDisplayed && !advisory.isEndDateDisplayed && !advisory.isAdvisoryDateDisplayed && !advisory.isUpdatedDateDisplayed) {
      return "No date";
    } else if (!advisory.isEffectiveDateDisplayed && !advisory.isEndDateDisplayed && advisory.isAdvisoryDateDisplayed && !advisory.isUpdatedDateDisplayed) {
      return "Posting date";
    } else if (!advisory.isEffectiveDateDisplayed && !advisory.isEndDateDisplayed && !advisory.isAdvisoryDateDisplayed && advisory.isUpdatedDateDisplayed) {
      return "Updated date";
    } else if (advisory.isEffectiveDateDisplayed && !advisory.isEndDateDisplayed && !advisory.isAdvisoryDateDisplayed && !advisory.isUpdatedDateDisplayed) {
      return "Start date";
    } else if (advisory.isEffectiveDateDisplayed && advisory.isEndDateDisplayed && !advisory.isAdvisoryDateDisplayed && !advisory.isUpdatedDateDisplayed) {
      return "Event date range";
    }
  }

  return (
    <>
      <div className="row heading">
        Affected area
      </div>
      {advisory.fireCentres.length > 0 && (
        <div className="row">
          <div className="col-lg-3 col-md-4 col-12 ad-summary-label">
            Fire Centre(s)
          </div>
          <div className="col-lg-7 col-md-8 col-12">
            {advisory.fireCentres.map((f) => (
              <div key={f.id}>{f.fireCentreName}</div>
            ))}
          </div>
        </div>
      )}
      {advisory.fireZones.length > 0 && (
        <div className="row">
          <div className="col-lg-3 col-md-4 col-12 ad-summary-label">
            Fire Zone(s)
          </div>
          <div className="col-lg-7 col-md-8 col-12">
            {advisory.fireZones.map((f) => (
              <div key={f.id}>{f.fireZoneName}</div>
            ))}
          </div>
        </div>
      )}
      {advisory.naturalResourceDistricts.length > 0 && (
        <div className="row">
          <div className="col-lg-3 col-md-4 col-12 ad-summary-label">
            Natural Resource District(s)
          </div>
          <div className="col-lg-7 col-md-8 col-12">
            {advisory.naturalResourceDistricts.map((n) => (
              <div key={n.id}>{n.naturalResourceDistrictName}</div>
            ))}
          </div>
        </div>
      )}
      {advisory.regions.length > 0 && (
        <div className="row">
          <div className="col-lg-3 col-md-4 col-12 ad-summary-label">
            Region(s)
          </div>
          <div className="col-lg-7 col-md-8 col-12">
            {advisory.regions.map((r) => (
              <div key={r.id}>{r.regionName} Region</div>
            ))}
          </div>
        </div>
      )}
      {advisory.sections.length > 0 && (
        <div className="row">
          <div className="col-lg-3 col-md-4 col-12 ad-summary-label">
            Section(s)
          </div>
          <div className="col-lg-7 col-md-8 col-12">
            {advisory.sections.map((s) => (
              <div key={s.id}>{s.sectionName} Section</div>
            ))}
          </div>
        </div>
      )}
      {advisory.managementAreas.length > 0 && (
        <div className="row">
          <div className="col-lg-3 col-md-4 col-12 ad-summary-label">
            Management Area(s)
          </div>
          <div className="col-lg-7 col-md-8 col-12">
            {advisory.managementAreas.map((m) => (
              <div key={m.id}>{m.managementAreaName} Management Area</div>
            ))}
          </div>
        </div>
      )}
      <div className="row">
        <div className="col-lg-3 col-md-4 col-12 ad-summary-label">
          Park(s)
        </div>
        <div className="col-lg-7 col-md-8 col-12">
          {(showParks ? advisory.protectedAreas : advisory.protectedAreas.slice(0, 5)).map((p) => (
            <div key={p.id} className="mb-3">
              {p.url && (
                <a
                  href={p.url.replace("https://bcparks.ca", publicUrl)}
                  rel="noreferrer"
                  target="_blank"
                  className="ad-anchor"
                >
                  {p.protectedAreaName}<LaunchIcon className="launchIcon" />
                </a>
              )}
              {!p.url && p.protectedAreaName}
            </div>
          ))}
          {advisory.protectedAreas.length > 5 &&
            <button
              type="button"
              className="btn btn-link btn-boolean d-block mt-4"
              onClick={() => setShowParks(!showParks)}
            >
              {showParks ? "Hide" : "Show"} all parks affected
            </button>
          }
          <Chip
            icon={<FileCopyOutlinedIcon />}
            label="Copy all URLs"
            clickable
            className="ad-copy bcgov-button bcgov-normal-white"
            onClick={() => {
              navigator.clipboard
                .writeText(parkUrls)
                .then(() => {
                  handleOpenSnackBar("Park urls copied to clipboard");
                })
                .catch(() => {
                  handleOpenSnackBar("Failed to copy to clipboard");
                });
            }}
          />
        </div>
      </div>
      {advisory.sites.length > 0 && (
        <div className="row">
          <div className="col-lg-3 col-md-4 col-12 ad-summary-label">
            Site(s)
          </div>
          <div className="col-lg-7 col-md-8 col-12">
            {(showSites ? advisory.sites : advisory.sites.slice(0, 5)).map((s) => (
              <div key={s.id} className="mb-3">
                {s.url && (
                  <a
                    href={s.url.replace("https://bcparks.ca", publicUrl)}
                    rel="noreferrer"
                    target="_blank"
                    className="ad-anchor"
                  >
                    {s.siteName}<LaunchIcon className="launchIcon" />
                  </a>
                )}
                {!s.url && s.siteName}
              </div>
            ))}
            {advisory.sites.length > 5 &&
              <button
                type="button"
                className="btn btn-link btn-boolean d-block mt-4"
                onClick={() => setShowSites(!showSites)}
              >
                {showSites ? "Hide" : "Show"} all sites affected
              </button>
            }
            <Chip
              icon={<FileCopyOutlinedIcon />}
              label="Copy all URLs"
              clickable
              className="ad-copy bcgov-button bcgov-normal-white"
              onClick={() => {
                navigator.clipboard
                  .writeText(siteUrls)
                  .then(() => {
                    handleOpenSnackBar("Site urls copied to clipboard");
                  })
                  .catch(() => {
                    handleOpenSnackBar("Failed to copy to clipboard");
                  });
              }}
            />
          </div>
        </div>
      )}
      <div className="row heading">
        Advisory content
      </div>
      <div className="row">
        <div className="col-lg-3 col-md-4 col-12 ad-summary-label">Headline</div>
        <div
          className="col-lg-7 col-md-8 col-12"
          dangerouslySetInnerHTML={{ __html: advisory.title }}>
        </div>
      </div>
      {advisory.eventType && (
        <div className="row">
          <div className="col-lg-3 col-md-4 col-12 ad-summary-label">Event type</div>
          <div className="col-lg-7 col-md-8 col-12">
            {advisory.eventType.eventType}
          </div>
        </div>
      )}
      {advisory.urgency && (
        <div className="row">
          <div className="col-lg-3 col-md-4 col-12 ad-summary-label">Urgency level</div>
          <div className="col-lg-7 col-md-8 col-12">
            {advisory.urgency.urgency}
          </div>
        </div>
      )}
      {advisory.listingRank !== null && advisory.listingRank >= 0 && (
        <div className="row">
          <div className="col-lg-3 col-md-4 col-12 ad-summary-label">Listing rank</div>
          <div className="col-lg-7 col-md-8 col-12">{advisory.listingRank}</div>
        </div>
      )}
      {advisory.accessStatus && (
        <div className="row">
          <div className="col-lg-3 col-md-4 col-12 ad-summary-label">
            Park status
          </div>
          <div className="col-lg-7 col-md-8 col-12">
            {advisory.accessStatus.accessStatus}
          </div>
        </div>
      )}
      {!showOriginalAdvisory &&
        advisory.standardMessages &&
        advisory.standardMessages.length > 0 && (
          <div className="row">
            <div className="col-lg-3 col-md-4 col-12 ad-summary-label">
              Standard message(s)
            </div>
            <div className="col-lg-7 col-md-8 col-12">
              {advisory.standardMessages.map((m, index) => (
                <div key={index}>
                  {m.title}
                </div>
              ))}
            </div>
          </div>
        )}
      {advisory.description && (
        <div className="row">
          <div className="col-lg-3 col-md-4 col-12 ad-summary-label">Description</div>
          <div
            className="col-lg-7 col-md-8 col-12"
            dangerouslySetInnerHTML={{ __html: advisory.description }}>
          </div>
        </div>
      )}
      {!showOriginalAdvisory &&
        advisory.standardMessages &&
        advisory.standardMessages.length > 0 && (
          <div className="row">
            <div className="col-lg-3 col-md-4 col-12 ad-summary-label">
              Standard message preview
            </div>
            <div className="col-lg-7 col-md-8 col-12">
              {advisory.standardMessages.map((m, index) => (
                <div
                  key={index}
                  dangerouslySetInnerHTML={{ __html: m.description }}
                ></div>
              ))}
            </div>
          </div>
        )}
      {advisory.links.length > 0 && (
        <div className="row">
          <div className="col-lg-3 col-md-4 col-12 ad-summary-label">
            Links and documents
          </div>
          <div className="col-lg-7 col-md-8 col-12">
            {advisory.links.map((l) => (
              <div key={l.id}>
                {l.url && (
                  <>
                    <a
                      href={l?.file?.url ? l.file.url : l.url}
                      rel="noreferrer"
                      target="_blank"
                      className="d-block ad-anchor"
                    >
                      {l.type &&
                        advisory.linkTypes.filter((t) => t.id === l.type)[0].type}
                      {l.type && " - "}
                      {l.title}
                      <LaunchIcon className="launchIcon" />
                    </a>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      {advisory.effectiveDate && (
        <div className="row">
          <div className="col-lg-3 col-md-4 col-12 ad-summary-label">Start date</div>
          <div className="col-lg-7 col-md-8 col-12 ad-flex">
            {moment(advisory.effectiveDate).format("MMMM DD, yyyy hh:mm A")}
          </div>
        </div>
      )}
      {advisory.endDate && (
        <div className="row">
          <div className="col-lg-3 col-md-4 col-12 ad-summary-label">End date</div>
          <div className="col-lg-7 col-md-8 col-12 ad-flex">
            {moment(advisory.endDate).format("MMMM DD, yyyy hh:mm A")}
          </div>
        </div>
      )}
      {advisory.updatedDate && (
        <div className="row">
          <div className="col-lg-3 col-md-4 col-12 ad-summary-label">Updated date</div>
          <div className="col-lg-7 col-md-8 col-12 ad-flex">
            {moment(advisory.updatedDate).format("MMMM DD, yyyy hh:mm A")}
          </div>
        </div>
      )}
      <div className="row">
        <div className="col-lg-3 col-md-4 col-sm-12 ad-summary-label">
          Displayed date
        </div>
        <div className="col-lg-7 col-md-8 col-sm-12">
          {getDisplayedDate(advisory)}
        </div>
      </div>
      <div className="row heading">
        Internal details
      </div>
      {advisory.advisoryDate && (
        <div className="row">
          <div className="col-lg-3 col-md-4 col-12 ad-summary-label">Posting date</div>
          <div className="col-lg-7 col-md-8 col-12 ad-flex">
            {moment(advisory.advisoryDate).format("MMMM DD, yyyy hh:mm A")}
          </div>
        </div>
      )}
      {advisory.expiryDate && (
        <div className="row">
          <div className="col-lg-3 col-md-4 col-12 ad-summary-label">Expiry date</div>
          <div className="col-lg-7 col-md-8 col-12 ad-flex">
            {moment(advisory.expiryDate).format("MMMM DD, yyyy hh:mm A")}
          </div>
        </div>
      )}
      {advisory.advisoryStatus && (
        <div className="row">
          <div className="col-lg-3 col-md-4 col-12 ad-summary-label">
            Advisory status
          </div>
          <div className="col-lg-7 col-md-8 col-12">
            {advisory.advisoryStatus.advisoryStatus}
          </div>
        </div>
      )}
      <div className="row">
        <div className="col-lg-3 col-md-4 col-12 ad-summary-label">
          Requested by
        </div>
        <div className="col-lg-7 col-md-8 col-12">
          {advisory.submittedBy}
        </div>
      </div>
      <div className="row">
        <div className="col-lg-3 col-md-4 col-12 ad-summary-label">
          Public safety related
        </div>
        <div className="col-lg-7 col-md-8 col-12">
          {advisory.isSafetyRelated ? "Yes" : "No"}
        </div>
      </div>
      {advisory.note && (
        <div className="row">
          <div className="col-lg-3 col-md-4 col-12 ad-summary-label">
            Internal notes
          </div>
          <div
            className="col-lg-7 col-md-8 col-12"
            dangerouslySetInnerHTML={{ __html: advisory.note }}>
          </div>
        </div>
      )}
      <div className="row heading">
        History
      </div>
      <AdvisoryHistory data={{ advisoryNumber: advisory.advisoryNumber }} />
    </>
  );
}

AdvisorySummaryView.propTypes = {
  data: PropTypes.shape({
    advisory: PropTypes.object,
    isPublished: PropTypes.bool,
    parkUrls: PropTypes.string,
    siteUrls: PropTypes.string,
    handleOpenSnackBar: PropTypes.func.isRequired,
    showOriginalAdvisory: PropTypes.bool,
  }).isRequired,
};
