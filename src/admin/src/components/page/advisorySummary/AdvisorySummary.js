import React, { useState, useEffect } from "react";
import { Redirect, useLocation, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import { useKeycloak } from "@react-keycloak/web";
import { cmsAxios } from "../../../axios_config";
import "./AdvisorySummary.css";
import Header from "../../composite/header/Header";
import { Loader } from "shared-components/build/components/loader/Loader";
import Alert from "@material-ui/lab/Alert";
import LaunchIcon from "@material-ui/icons/Launch";
import Snackbar from "@material-ui/core/Snackbar";
import FileCopyOutlinedIcon from "@material-ui/icons/FileCopyOutlined";
import { Button } from "shared-components/build/components/button/Button";

export default function AdvisorySummary({ page: { setError } }) {
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [isPublished, setIsPublished] = useState(false);
  const [toError, setToError] = useState(false);
  const [advisory, setAdvisory] = useState({});
  const [pageUrls, setPageUrls] = useState("");
  const [toDashboard, setToDashboard] = useState(false);
  const { keycloak, initialized } = useKeycloak();
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const { id } = useParams();
  const { confirmationText } = useLocation();
  const { ClipboardItem } = window;

  useEffect(() => {
    if (!initialized) {
      setIsLoadingPage(true);
    } else if (!keycloak.authenticated) {
      setToError(true);
      setError({
        status: 401,
        message: "Login required",
      });
    } else {
      if (parseInt(id)) {
        cmsAxios
          .get(`/public-advisories/${id}?_publicationState=preview`)
          .then((res) => {
            const advisoryData = res.data;
            setAdvisory(advisoryData);
            const pageUrlInfo = [];
            const isAdvisoryPublished =
              advisoryData.advisoryStatus.code === "PUB";
            advisoryData.protectedAreas.map((p) => {
              const url = isAdvisoryPublished
                ? p.url
                : p.url.replace("bcparks", "test.bcparks");
              return pageUrlInfo.push(
                "<a href='" + url + "'>" + p.protectedAreaName + "</a>"
              );
            });
            const pageUrlText = pageUrlInfo.join("<br/>");
            setPageUrls(pageUrlText);
            setIsPublished(isAdvisoryPublished);
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
    }
  }, [
    id,
    initialized,
    keycloak,
    setError,
    setToError,
    setIsLoadingPage,
    setAdvisory,
    setPageUrls,
    setIsPublished,
  ]);

  const handleOpenSnackBar = () => {
    setOpenSnackBar(true);
  };

  const handleCloseSnackBar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackBar(false);
  };

  if (toDashboard) {
    return <Redirect to="/bcparks/advisory-dash" />;
  }

  if (toError) {
    return <Redirect to="/bcparks/error" />;
  }

  return (
    <main>
      <Header
        header={{
          name: "",
        }}
      />
      <br />
      <div className="AdvisorySummary" data-testid="AdvisorySummary">
        <div className="container">
          {isLoadingPage && (
            <div className="page-loader">
              <Loader page />
            </div>
          )}
          {!isLoadingPage && (
            <div className="container-fluid">
              <Alert severity="success">
                {confirmationText ||
                  "Your advisory has been updated successfully!"}
              </Alert>
              <br />
              <div className="row">
                <div className="col-lg-5 col-md-6 col-12 ad-label">
                  Headline
                </div>
                <div className="col-lg-7 col-md-6 col-12">{advisory.title}</div>
              </div>
              <div className="row">
                <div className="col-lg-5 col-md-6 col-12 ad-label">
                  Description
                </div>
                <div className="col-lg-7 col-md-6 col-12">
                  {advisory.description}
                </div>
              </div>
              <div className="row">
                <div className="col-lg-5 col-md-6 col-12 ad-label">
                  Access Status
                </div>
                <div className="col-lg-7 col-md-6 col-12">
                  {advisory.accessStatus.accessStatus}
                </div>
              </div>
              <div className="row">
                <div className="col-lg-5 col-md-6 col-12 ad-label">
                  Event Type
                </div>
                <div className="col-lg-7 col-md-6 col-12">
                  {advisory.eventType.eventType}
                </div>
              </div>
              <div className="row">
                <div className="col-lg-5 col-md-6 col-12 ad-label">Urgency</div>
                <div className="col-lg-7 col-md-6 col-12">
                  {advisory.urgency.urgency}
                </div>
              </div>
              <div className="row">
                <div className="col-lg-5 col-md-6 col-12 ad-label">
                  Advisory Status
                </div>
                <div className="col-lg-7 col-md-6 col-12">
                  {advisory.advisoryStatus.advisoryStatus}
                </div>
              </div>
              {advisory.regions.length > 0 && (
                <div className="row">
                  <div className="col-lg-5 col-md-6 col-12 ad-label">
                    Regions
                  </div>
                  <div className="col-lg-7 col-md-6 col-12">
                    {advisory.regions.map((r) => (
                      <div key={r.id}>{r.regionName}</div>
                    ))}
                  </div>
                </div>
              )}
              {advisory.sections.length > 0 && (
                <div className="row">
                  <div className="col-lg-5 col-md-6 col-12 ad-label">
                    Sections
                  </div>
                  <div className="col-lg-7 col-md-6 col-12">
                    {advisory.sections.map((s) => (
                      <div key={s.id}>{s.sectionName}</div>
                    ))}
                  </div>
                </div>
              )}
              {advisory.managementAreas.length > 0 && (
                <div className="row">
                  <div className="col-lg-5 col-md-6 col-12 ad-label">
                    Management Areas
                  </div>
                  <div className="col-lg-7 col-md-6 col-12">
                    {advisory.managementAreas.map((m) => (
                      <div key={m.id}>{m.managementAreaName}</div>
                    ))}
                  </div>
                </div>
              )}
              <div className="row">
                <div className="col-lg-5 col-md-6 col-12 ad-label">
                  Protected Areas{" "}
                  <FileCopyOutlinedIcon
                    className="copyIcon"
                    onClick={() => {
                      const type = "text/html";
                      const blob = new Blob([pageUrls], { type });
                      let data = [new ClipboardItem({ [type]: blob })];
                      navigator.clipboard.write(data);
                      handleOpenSnackBar();
                    }}
                  />
                </div>
                <div className="col-lg-7 col-md-6 col-12">
                  {advisory.protectedAreas.map((p) => (
                    <div key={p.id}>
                      <a
                        href={
                          isPublished
                            ? p.url
                            : p.url.replace("bcparks", "test.bcparks")
                        }
                        rel="noreferrer"
                        target="_blank"
                        className="ad-anchor"
                      >
                        {p.protectedAreaName}{" "}
                        <LaunchIcon className="launchIcon" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12 col-md-12 col-sm-12 button-row">
                  <br />
                  <Button
                    label="Back to Dashboard"
                    styling="bcgov-normal-blue btn"
                    onClick={() => {
                      setToDashboard(true);
                    }}
                  />
                </div>
              </div>
              <Snackbar
                open={openSnackBar}
                autoHideDuration={3000}
                onClose={handleCloseSnackBar}
              >
                <Alert onClose={handleCloseSnackBar} severity="info">
                  Protected Area urls copied to clipboard
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
  }).isRequired,
};
