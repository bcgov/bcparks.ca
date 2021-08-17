import React, { useState, useEffect } from "react";
import { Redirect, useLocation, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import { cmsAxios, apiAxios } from "../../../axios_config";
import { useKeycloak } from "@react-keycloak/web";
import "./AdvisorySummary.css";
import Header from "../../composite/header/Header";
import { Loader } from "shared-components/build/components/loader/Loader";
import Alert from "@material-ui/lab/Alert";
import { Snackbar, Link } from "@material-ui/core";
import { Button } from "shared-components/build/components/button/Button";
import { getLinkTypes } from "../../../utils/CmsDataUtil";
import AdvisorySummaryView from "../../composite/advisorySummaryView/AdvisorySummaryView";

export default function AdvisorySummary({
  page: { setError, cmsData, setCmsData },
}) {
  const { keycloak } = useKeycloak();
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
  const [isCurrentlyPublished, setIsCurrentlyPublished] = useState(false);
  const [showOriginalAdvisory, setShowOriginalAdvisory] = useState(false);
  const [currentAdvisory, setCurrentAdvisory] = useState({});
  const [currentParkUrls, setCurrentParkUrls] = useState("");
  const [currentSiteUrls, setCurrentSiteUrls] = useState("");

  useEffect(() => {
    if (!isLoadingPage && advisory) {
      if (advisory.advisoryStatus.code !== "PUB") {
        Promise.all([
          cmsAxios.get(`/public-advisories/${advisory.advisoryNumber}`),
          getLinkTypes(cmsData, setCmsData),
        ])
          .then((res) => {
            const advisoryData = res[0].data;
            advisoryData.linkTypes = res[1];
            setIsCurrentlyPublished(advisoryData.advisoryStatus.code === "PUB");
            setCurrentAdvisory(advisoryData);
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
            setCurrentParkUrls(parkUrlText);
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
            setCurrentSiteUrls(siteUrlText);
          })
          .catch((error) => {
            //Do nothing
          });
      }
    }
  }, [
    advisory,
    cmsData,
    isLoadingPage,
    setCmsData,
    setCurrentAdvisory,
    setIsCurrentlyPublished,
    setCurrentParkUrls,
    setCurrentSiteUrls,
    showOriginalAdvisory,
  ]);

  useEffect(() => {
    if (parseInt(id)) {
      Promise.all([
        apiAxios.get(
          `api/get/public-advisory-audits/${id}?_publicationState=preview`,
          {
            headers: { Authorization: `Bearer ${keycloak.idToken}` },
          }
        ),
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
    keycloak,
    showOriginalAdvisory,
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
                {!showOriginalAdvisory && (
                  <div className="container-fluid ad-summary col-lg-9 col-md-12 col-12">
                    {confirmationText && (
                      <>
                        <Alert severity="success">{confirmationText}</Alert>
                        <br />
                      </>
                    )}
                    {isCurrentlyPublished && (
                      <div className="row">
                        <div className="col-lg-12 col-md-12 col-12 ad-right">
                          <Link
                            component="button"
                            onClick={() => {
                              setShowOriginalAdvisory(true);
                            }}
                          >
                            View published version
                          </Link>
                        </div>
                      </div>
                    )}
                    <AdvisorySummaryView
                      data={{
                        advisory,
                        isPublished,
                        parkUrls,
                        siteUrls,
                        handleOpenSnackBar,
                        showOriginalAdvisory,
                      }}
                    />
                  </div>
                )}
                {showOriginalAdvisory && (
                  <div className="container-fluid ad-summary col-lg-9 col-md-12 col-12">
                    <div className="row">
                      <div className="col-lg-12 col-md-12 col-12 ad-right">
                        <Link
                          component="button"
                          onClick={() => {
                            setShowOriginalAdvisory(false);
                          }}
                        >
                          View recent update
                        </Link>
                      </div>
                    </div>
                    <AdvisorySummaryView
                      data={{
                        advisory: currentAdvisory,
                        isPublished: isCurrentlyPublished,
                        parkUrls: currentParkUrls,
                        siteUrls: currentSiteUrls,
                        handleOpenSnackBar,
                        showOriginalAdvisory,
                      }}
                    />
                  </div>
                )}
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
