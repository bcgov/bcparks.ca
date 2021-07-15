import React, { useState, useEffect } from "react";
import { Redirect, useLocation, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import { cmsAxios } from "../../../axios_config";
import "./AdvisorySummary.css";
import Header from "../../composite/header/Header";
import { Loader } from "shared-components/build/components/loader/Loader";
import Alert from "@material-ui/lab/Alert";
import LaunchIcon from "@material-ui/icons/Launch";
import Snackbar from "@material-ui/core/Snackbar";
import FileCopyOutlinedIcon from "@material-ui/icons/FileCopyOutlined";
import { Button } from "shared-components/build/components/button/Button";
import Chip from "@material-ui/core/Chip";
import moment from "moment";
import VisibilityOutlinedIcon from "@material-ui/icons/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@material-ui/icons/VisibilityOffOutlined";
import { getLinkTypes } from "../../../utils/CmsDataUtil";

export default function AdvisorySummary({
  page: { setError, cmsData, setCmsData },
}) {
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [isPublished, setIsPublished] = useState(false);
  const [toError, setToError] = useState(false);
  const [advisory, setAdvisory] = useState({});
  const [parkUrls, setParkUrls] = useState("");
  const [siteUrls, setSiteUrls] = useState("");
  const [toDashboard, setToDashboard] = useState(false);
  const [toUpdate, setToUpdate] = useState(false);
  const [snackPack, setSnackPack] = useState([]);
  const [openSnack, setOpenSnack] = useState(false);
  const [snackMessageInfo, setSnackMessageInfo] = useState(undefined);
  const { id } = useParams();
  const { confirmationText, index } = useLocation();
  const { ClipboardItem } = window;

  useEffect(() => {
    if (parseInt(id)) {
      Promise.all([
        cmsAxios.get(`/public-advisories/${id}?_publicationState=preview`),
        getLinkTypes(cmsData, setCmsData),
      ])
        .then((res) => {
          const advisoryData = res[0].data;
          advisoryData.linkTypes = res[1];
          setAdvisory(advisoryData);
          const parkUrlInfo = [];
          const siteUrlInfo = [];
          const isAdvisoryPublished =
            advisoryData.advisoryStatus.code === "PUB";
          advisoryData.protectedAreas.map((p) => {
            if (p.url) {
              const url = isAdvisoryPublished
                ? p.url
                : p.url.replace("bcparks", "wwwt.bcparks");
              return parkUrlInfo.push(
                "<a href='" + url + "'>" + p.protectedAreaName + "</a>"
              );
            } else {
              return parkUrlInfo.push(
                "<span>" + p.protectedAreaName + "</span>"
              );
            }
          });
          const parkUrlText = parkUrlInfo.join("<br/>");
          setParkUrls(parkUrlText);
          setIsPublished(isAdvisoryPublished);
          advisoryData.sites.map((s) => {
            if (s.url) {
              const url = isAdvisoryPublished
                ? s.url
                : s.url.replace("bcparks", "wwwt.bcparks");
              return siteUrlInfo.push(
                "<a href='" + url + "'>" + s.siteName + "</a>"
              );
            } else {
              return siteUrlInfo.push("<span>" + s.siteName + "</span>");
            }
          });
          const siteUrlText = siteUrlInfo.join("<br/>");
          setSiteUrls(siteUrlText);
          setIsLoadingPage(false);
        })
        .catch((error) => {
          console.log("error occurred fetching Public Advisory data", error);
          setToError(true);
          setError({
            status: 500,
            message: "Error fetching advisory",
          });
          setIsLoadingPage(false);
        });
    } else {
      setToError(true);
      setError({
        status: 400,
        message: "Advisory Id is not found",
      });
      setIsLoadingPage(false);
    }
    if (snackPack.length && !snackMessageInfo) {
      // Set a new snack when we don't have an active one
      setSnackMessageInfo({ ...snackPack[0] });
      setSnackPack((prev) => prev.slice(1));
      setOpenSnack(true);
    } else if (snackPack.length && snackMessageInfo && openSnack) {
      // Close an active snack when a new one is added
      setOpenSnack(false);
    }
  }, [
    id,
    setError,
    setToError,
    setIsLoadingPage,
    setAdvisory,
    setParkUrls,
    setSiteUrls,
    setIsPublished,
    snackPack,
    openSnack,
    snackMessageInfo,
    cmsData,
    setCmsData,
  ]);

  const handleOpenSnackBar = (message) => {
    setSnackPack((prev) => [...prev, { message, key: new Date().getTime() }]);
  };

  const handleCloseSnackBar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnack(false);
  };

  const handleExitedSnackBar = () => {
    setSnackMessageInfo(undefined);
  };

  if (toDashboard) {
    return (
      <Redirect
        push
        to={{
          pathname: `/bcparks/dashboard`,
          index: index >= 0 ? index : 0,
        }}
      />
    );
  }

  if (toUpdate) {
    return <Redirect push to={`/bcparks/update-advisory/${id}`} />;
  }

  if (toError) {
    return <Redirect push to="/bcparks/error" />;
  }

  return (
    <main>
      <Header />
      <br />
      <div className="AdvisorySummary" data-testid="AdvisorySummary">
        <div className="container">
          {isLoadingPage && (
            <div className="page-loader">
              <Loader page />
            </div>
          )}
          {!isLoadingPage && (
            <div className="container pt10b30">
              <div className="row ad-wrap-reverse">
                <div className="container-fluid col-lg-3 col-md-12 col-12">
                  <div className="button-row ad-btn-group">
                    <br />
                    <Button
                      label="Back"
                      styling="bcgov-normal-white btn mt10"
                      onClick={() => {
                        setToDashboard(true);
                      }}
                    />
                    <Button
                      label="Edit"
                      styling="bcgov-normal-blue btn mt10"
                      onClick={() => {
                        setToUpdate(true);
                      }}
                    />
                  </div>
                </div>
                <div className="container-fluid ad-summary col-lg-9 col-md-12 col-12">
                  {confirmationText && (
                    <>
                      <Alert severity="success">{confirmationText}</Alert>
                      <br />
                    </>
                  )}
                  <div className="row">
                    <div className="col-lg-4 col-md-6 col-12 ad-label">
                      Headline
                    </div>
                    <div className="col-lg-8 col-md-6 col-12">
                      {advisory.title}
                    </div>
                  </div>
                  {advisory.eventType && (
                    <div className="row">
                      <div className="col-lg-4 col-md-6 col-12 ad-label">
                        Event Type
                      </div>
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
                      <div className="col-lg-4 col-md-6 col-12 ad-label">
                        Urgency Level
                      </div>
                      <div className="col-lg-8 col-md-6 col-12">
                        {advisory.urgency.urgency}
                      </div>
                    </div>
                  )}
                  <div className="row">
                    <div className="col-lg-4 col-md-6 col-12 ad-label">
                      Safety Related
                    </div>
                    <div className="col-lg-8 col-md-6 col-12">
                      {advisory.isSafetyRelated ? "Yes" : "No"}
                    </div>
                  </div>
                  {advisory.description && (
                    <div className="row">
                      <div className="col-lg-4 col-md-6 col-12 ad-label">
                        Description
                      </div>
                      <div className="col-lg-8 col-md-6 col-12">
                        {advisory.description}
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
                              {p.protectedAreaName}{" "}
                              <LaunchIcon className="launchIcon" />
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
                                {s.siteName}{" "}
                                <LaunchIcon className="launchIcon" />
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
                          <div key={m.id}>
                            {m.managementAreaName} Management Area
                          </div>
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
                      <div className="col-lg-4 col-md-6 col-12 ad-label">
                        Listing Rank
                      </div>
                      <div className="col-lg-8 col-md-6 col-12">
                        {advisory.listingRank}
                      </div>
                    </div>
                  )}
                  {advisory.advisoryDate && (
                    <div className="row">
                      <div className="col-lg-4 col-md-6 col-12 ad-label">
                        Advisory Date
                      </div>
                      <div className="col-lg-8 col-md-6 col-12 ad-flex">
                        {moment(advisory.advisoryDate).format(
                          "MMMM DD, yyyy hh:mm A"
                        )}
                        <div className="ml15">
                          {(advisory.isAdvisoryDateDisplayed && (
                            <VisibilityOutlinedIcon className="visibilityIcon" />
                          )) || (
                            <VisibilityOffOutlinedIcon className="visibilityIcon" />
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  {advisory.effectiveDate && (
                    <div className="row">
                      <div className="col-lg-4 col-md-6 col-12 ad-label">
                        Start Date
                      </div>
                      <div className="col-lg-8 col-md-6 col-12 ad-flex">
                        {moment(advisory.effectiveDate).format(
                          "MMMM DD, yyyy hh:mm A"
                        )}
                        <div className="ml15">
                          {(advisory.isEffectiveDateDisplayed && (
                            <VisibilityOutlinedIcon className="visibilityIcon" />
                          )) || (
                            <VisibilityOffOutlinedIcon className="visibilityIcon" />
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  {advisory.endDate && (
                    <div className="row">
                      <div className="col-lg-4 col-md-6 col-12 ad-label">
                        End Date
                      </div>
                      <div className="col-lg-8 col-md-6 col-12 ad-flex">
                        {moment(advisory.endDate).format(
                          "MMMM DD, yyyy hh:mm A"
                        )}
                        <div className="ml15">
                          {(advisory.isEndDateDisplayed && (
                            <VisibilityOutlinedIcon className="visibilityIcon" />
                          )) || (
                            <VisibilityOffOutlinedIcon className="visibilityIcon" />
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  {advisory.updatedDate && (
                    <div className="row">
                      <div className="col-lg-4 col-md-6 col-12 ad-label">
                        Updated Date
                      </div>
                      <div className="col-lg-8 col-md-6 col-12 ad-flex">
                        {moment(advisory.updatedDate).format(
                          "MMMM DD, yyyy hh:mm A"
                        )}
                        <div className="ml15">
                          {(advisory.isUpdatedDateDisplayed && (
                            <VisibilityOutlinedIcon className="visibilityIcon" />
                          )) || (
                            <VisibilityOffOutlinedIcon className="visibilityIcon" />
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  {advisory.expiryDate && (
                    <div className="row">
                      <div className="col-lg-4 col-md-6 col-12 ad-label">
                        Expiry Date
                      </div>
                      <div className="col-lg-8 col-md-6 col-12 ad-flex">
                        {moment(advisory.expiryDate).format(
                          "MMMM DD, yyyy hh:mm A"
                        )}
                      </div>
                    </div>
                  )}
                  {advisory.links.length > 0 && (
                    <div className="row">
                      <div className="col-lg-4 col-md-6 col-12 ad-label">
                        Links
                      </div>
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
                                  advisory.linkTypes.filter(
                                    (t) => t.id === l.type
                                  )[0].type}
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
                      <div className="col-lg-8 col-md-6 col-12">
                        {advisory.note}
                      </div>
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
                </div>
              </div>
              <Snackbar
                key={snackMessageInfo ? snackMessageInfo.key : undefined}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                open={openSnack}
                autoHideDuration={3000}
                onClose={handleCloseSnackBar}
                onExited={handleExitedSnackBar}
              >
                <Alert onClose={handleCloseSnackBar} severity="info">
                  {snackMessageInfo ? snackMessageInfo.message : undefined}
                </Alert>
              </Snackbar>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

AdvisorySummary.propTypes = {
  page: PropTypes.shape({
    setError: PropTypes.func.isRequired,
    cmsData: PropTypes.object.isRequired,
    setCmsData: PropTypes.func.isRequired,
  }).isRequired,
};
