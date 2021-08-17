import React from "react";
import PropTypes from "prop-types";
import "./AdvisorySummaryView.css";
import LaunchIcon from "@material-ui/icons/Launch";
import FileCopyOutlinedIcon from "@material-ui/icons/FileCopyOutlined";
import Chip from "@material-ui/core/Chip";
import moment from "moment";
import VisibilityOutlinedIcon from "@material-ui/icons/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@material-ui/icons/VisibilityOffOutlined";
import AdvisoryHistory from "../advisoryHistory/AdvisoryHistory";

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
  const { ClipboardItem } = window;
  return (
    <>
      <div className="row">
        <div className="col-lg-4 col-md-6 col-12 ad-label">Advisory Number</div>
        <div className="col-lg-8 col-md-6 col-12">
          {advisory.advisoryNumber}
        </div>
      </div>
      <div className="row">
        <div className="col-lg-4 col-md-6 col-12 ad-label">Revision Number</div>
        <div className="col-lg-8 col-md-6 col-12">
          {advisory.revisionNumber}
        </div>
      </div>
      <div className="row">
        <div className="col-lg-4 col-md-6 col-12 ad-label">Headline</div>
        <div className="col-lg-8 col-md-6 col-12">{advisory.title}</div>
      </div>
      {advisory.eventType && (
        <div className="row">
          <div className="col-lg-4 col-md-6 col-12 ad-label">Event Type</div>
          <div className="col-lg-8 col-md-6 col-12">
            {advisory.eventType.eventType}
          </div>
        </div>
      )}
      {advisory.accessStatus && (
        <div className="row">
          <div className="col-lg-4 col-md-6 col-12 ad-label">
            Park Access Status
          </div>
          <div className="col-lg-8 col-md-6 col-12">
            {advisory.accessStatus.accessStatus}
          </div>
        </div>
      )}
      {advisory.urgency && (
        <div className="row">
          <div className="col-lg-4 col-md-6 col-12 ad-label">Urgency Level</div>
          <div className="col-lg-8 col-md-6 col-12">
            {advisory.urgency.urgency}
          </div>
        </div>
      )}
      <div className="row">
        <div className="col-lg-4 col-md-6 col-12 ad-label">Safety Related</div>
        <div className="col-lg-8 col-md-6 col-12">
          {advisory.isSafetyRelated ? "Yes" : "No"}
        </div>
      </div>
      {advisory.description && (
        <div className="row">
          <div className="col-lg-4 col-md-6 col-12 ad-label">Description</div>
          <div className="col-lg-8 col-md-6 col-12">{advisory.description}</div>
        </div>
      )}
      {!showOriginalAdvisory &&
        advisory.standardMessages &&
        advisory.standardMessages.length > 0 && (
          <div className="row">
            <div className="col-lg-4 col-md-6 col-12 ad-label">
              Standard Messages
            </div>
            <div className="col-lg-8 col-md-6 col-12">
              {advisory.standardMessages.map((m, index) => (
                <div key={index}>{m.description}</div>
              ))}
            </div>
          </div>
        )}
      <div className="row">
        <div className="col-lg-4 col-md-6 col-12 ad-label">
          Associated Park(s)
        </div>
        <div className="col-lg-8 col-md-6 col-12">
          {advisory.protectedAreas.map((p) => (
            <div key={p.id}>
              {p.url && (
                <a
                  href={
                    isPublished
                      ? p.url
                      : p.url.replace("bcparks", "wwwt.bcparks")
                  }
                  rel="noreferrer"
                  target="_blank"
                  className="ad-anchor"
                >
                  {p.protectedAreaName} <LaunchIcon className="launchIcon" />
                </a>
              )}
              {!p.url && p.protectedAreaName}
            </div>
          ))}
          <Chip
            icon={<FileCopyOutlinedIcon />}
            label="Copy all"
            clickable
            className="ad-copy"
            onClick={() => {
              const type = "text/html";
              const blob = new Blob([parkUrls], { type });
              let data = [new ClipboardItem({ [type]: blob })];
              navigator.clipboard.write(data);
              handleOpenSnackBar("Park urls copied to clipboard");
            }}
          />
        </div>
      </div>
      {advisory.sites.length > 0 && (
        <div className="row">
          <div className="col-lg-4 col-md-6 col-12 ad-label">
            Associated Site(s)
          </div>
          <div className="col-lg-8 col-md-6 col-12">
            {advisory.sites.map((s) => (
              <div key={s.id}>
                {s.url && (
                  <a
                    href={
                      isPublished
                        ? s.url
                        : s.url.replace("bcparks", "wwwt.bcparks")
                    }
                    rel="noreferrer"
                    target="_blank"
                    className="ad-anchor"
                  >
                    {s.siteName} <LaunchIcon className="launchIcon" />
                  </a>
                )}
                {!s.url && s.siteName}
              </div>
            ))}
            <Chip
              icon={<FileCopyOutlinedIcon />}
              label="Copy all"
              clickable
              className="ad-copy"
              onClick={() => {
                const type = "text/html";
                const blob = new Blob([siteUrls], { type });
                let data = [new ClipboardItem({ [type]: blob })];
                navigator.clipboard.write(data);
                handleOpenSnackBar("Site urls copied to clipboard");
              }}
            />
          </div>
        </div>
      )}
      {advisory.regions.length > 0 && (
        <div className="row">
          <div className="col-lg-4 col-md-6 col-12 ad-label">
            Associated Region(s)
          </div>
          <div className="col-lg-8 col-md-6 col-12">
            {advisory.regions.map((r) => (
              <div key={r.id}>{r.regionName} Region</div>
            ))}
          </div>
        </div>
      )}
      {advisory.sections.length > 0 && (
        <div className="row">
          <div className="col-lg-4 col-md-6 col-12 ad-label">
            Associated Section(s)
          </div>
          <div className="col-lg-8 col-md-6 col-12">
            {advisory.sections.map((s) => (
              <div key={s.id}>{s.sectionName} Section</div>
            ))}
          </div>
        </div>
      )}
      {advisory.managementAreas.length > 0 && (
        <div className="row">
          <div className="col-lg-4 col-md-6 col-12 ad-label">
            Associated Management Area(s)
          </div>
          <div className="col-lg-8 col-md-6 col-12">
            {advisory.managementAreas.map((m) => (
              <div key={m.id}>{m.managementAreaName} Management Area</div>
            ))}
          </div>
        </div>
      )}
      {advisory.fireCentres.length > 0 && (
        <div className="row">
          <div className="col-lg-4 col-md-6 col-12 ad-label">
            Associated Fire Centre(s)
          </div>
          <div className="col-lg-8 col-md-6 col-12">
            {advisory.fireCentres.map((f) => (
              <div key={f.id}>{f.fireCentreName}</div>
            ))}
          </div>
        </div>
      )}
      {advisory.fireZones.length > 0 && (
        <div className="row">
          <div className="col-lg-4 col-md-6 col-12 ad-label">
            Associated Fire Zone(s)
          </div>
          <div className="col-lg-8 col-md-6 col-12">
            {advisory.fireZones.map((f) => (
              <div key={f.id}>{f.fireZoneName}</div>
            ))}
          </div>
        </div>
      )}
      <div className="row">
        <div className="col-lg-4 col-md-6 col-12 ad-label">
          Reservations Affected
        </div>
        <div className="col-lg-8 col-md-6 col-12">
          {advisory.isReservationsAffected ? "Yes" : "No"}
        </div>
      </div>
      {advisory.dcTicketNumber && (
        <div className="row">
          <div className="col-lg-4 col-md-6 col-12 ad-label">
            DC Ticket Number
          </div>
          <div className="col-lg-8 col-md-6 col-12">
            {advisory.dcTicketNumber}
          </div>
        </div>
      )}
      {advisory.listingRank !== null && advisory.listingRank >= 0 && (
        <div className="row">
          <div className="col-lg-4 col-md-6 col-12 ad-label">Listing Rank</div>
          <div className="col-lg-8 col-md-6 col-12">{advisory.listingRank}</div>
        </div>
      )}
      {advisory.advisoryDate && (
        <div className="row">
          <div className="col-lg-4 col-md-6 col-12 ad-label">Advisory Date</div>
          <div className="col-lg-8 col-md-6 col-12 ad-flex">
            {moment(advisory.advisoryDate).format("MMMM DD, yyyy hh:mm A")}
            <div className="ml15">
              {(advisory.isAdvisoryDateDisplayed && (
                <VisibilityOutlinedIcon className="visibilityIcon" />
              )) || <VisibilityOffOutlinedIcon className="visibilityIcon" />}
            </div>
          </div>
        </div>
      )}
      {advisory.effectiveDate && (
        <div className="row">
          <div className="col-lg-4 col-md-6 col-12 ad-label">Start Date</div>
          <div className="col-lg-8 col-md-6 col-12 ad-flex">
            {moment(advisory.effectiveDate).format("MMMM DD, yyyy hh:mm A")}
            <div className="ml15">
              {(advisory.isEffectiveDateDisplayed && (
                <VisibilityOutlinedIcon className="visibilityIcon" />
              )) || <VisibilityOffOutlinedIcon className="visibilityIcon" />}
            </div>
          </div>
        </div>
      )}
      {advisory.endDate && (
        <div className="row">
          <div className="col-lg-4 col-md-6 col-12 ad-label">End Date</div>
          <div className="col-lg-8 col-md-6 col-12 ad-flex">
            {moment(advisory.endDate).format("MMMM DD, yyyy hh:mm A")}
            <div className="ml15">
              {(advisory.isEndDateDisplayed && (
                <VisibilityOutlinedIcon className="visibilityIcon" />
              )) || <VisibilityOffOutlinedIcon className="visibilityIcon" />}
            </div>
          </div>
        </div>
      )}
      {advisory.updatedDate && (
        <div className="row">
          <div className="col-lg-4 col-md-6 col-12 ad-label">Updated Date</div>
          <div className="col-lg-8 col-md-6 col-12 ad-flex">
            {moment(advisory.updatedDate).format("MMMM DD, yyyy hh:mm A")}
            <div className="ml15">
              {(advisory.isUpdatedDateDisplayed && (
                <VisibilityOutlinedIcon className="visibilityIcon" />
              )) || <VisibilityOffOutlinedIcon className="visibilityIcon" />}
            </div>
          </div>
        </div>
      )}
      {advisory.expiryDate && (
        <div className="row">
          <div className="col-lg-4 col-md-6 col-12 ad-label">Expiry Date</div>
          <div className="col-lg-8 col-md-6 col-12 ad-flex">
            {moment(advisory.expiryDate).format("MMMM DD, yyyy hh:mm A")}
          </div>
        </div>
      )}
      {advisory.links.length > 0 && (
        <div className="row">
          <div className="col-lg-4 col-md-6 col-12 ad-label">Links</div>
          <div className="col-lg-8 col-md-6 col-12">
            {advisory.links.map((l) => (
              <div key={l.id}>
                {l.url && (
                  <a
                    href={l.url}
                    rel="noreferrer"
                    target="_blank"
                    className="ad-anchor"
                  >
                    {l.type &&
                      advisory.linkTypes.filter((t) => t.id === l.type)[0].type}
                    {l.type && " - "}
                    {l.title} <LaunchIcon className="launchIcon" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      {advisory.note && (
        <div className="row">
          <div className="col-lg-4 col-md-6 col-12 ad-label">
            Internal Notes
          </div>
          <div className="col-lg-8 col-md-6 col-12">{advisory.note}</div>
        </div>
      )}
      {advisory.advisoryStatus && (
        <div className="row">
          <div className="col-lg-4 col-md-6 col-12 ad-label">
            Advisory Status
          </div>
          <div className="col-lg-8 col-md-6 col-12">
            {advisory.advisoryStatus.advisoryStatus}
          </div>
        </div>
      )}

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
