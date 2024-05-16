import React, { useState, useEffect } from "react";
import { Redirect, useLocation, useParams, useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import { cmsAxios } from "../../../axios_config";
import { useKeycloak } from "@react-keycloak/web";
import "./AdvisorySummary.css";
import Header from "../../composite/header/Header";
import { Loader } from "../../shared/loader/Loader";
import Alert from "@material-ui/lab/Alert";
import { Snackbar, Link } from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { Button } from "../../shared/button/Button";
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
  const history = useHistory();
  const { confirmationText, index } = useLocation();
  const [isCurrentlyPublished, setIsCurrentlyPublished] = useState(false);
  const [showOriginalAdvisory, setShowOriginalAdvisory] = useState(false);
  const [currentAdvisory, setCurrentAdvisory] = useState({});
  const [currentParkUrls, setCurrentParkUrls] = useState("");
  const [currentSiteUrls, setCurrentSiteUrls] = useState("");

  useEffect(() => {
    if (!isLoadingPage) {
      if (showOriginalAdvisory) {
        Promise.all([
          cmsAxios.get(`/public-advisories/${advisory.advisoryNumber}?populate=*`),
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
                  : p.url.replace("bcparks", "www.bcparks");
                return parkUrlInfo.push(url);
              } else {
                return parkUrlInfo.push(p.protectedAreaName);
              }
            });
            const parkUrlText = parkUrlInfo.join("<br/>");
            setCurrentParkUrls(parkUrlText);
            advisoryData.sites.map((s) => {
              if (s.url) {
                const url = isAdvisoryPublished
                  ? s.url
                  : s.url.replace("bcparks", "www.bcparks");
                return siteUrlInfo.push(url);
              } else {
                return siteUrlInfo.push(s.siteName);
              }
            });
            const siteUrlText = siteUrlInfo.join("\n");
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
        cmsAxios.get(
          `public-advisory-audits/${id}?publicationState=preview&populate=*`,
          {
            headers: { Authorization: `Bearer ${keycloak.token}` }
          }),
        getLinkTypes(cmsData, setCmsData),
      ])
        .then((res) => {
          const advisoryData = res[0].data.data;
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
                : p.url.replace("bcparks", "www.bcparks");
              return parkUrlInfo.push(url);
            } else {
              return parkUrlInfo.push(p.protectedAreaName);
            }
          });
          const parkUrlText = parkUrlInfo.join("\n");
          setParkUrls(parkUrlText);
          setIsPublished(isAdvisoryPublished);
          advisoryData.sites.map((s) => {
            if (s.url) {
              const url = isAdvisoryPublished
                ? s.url
                : s.url.replace("bcparks", "www.bcparks");
              return siteUrlInfo.push(url);
            } else {
              return siteUrlInfo.push(s.siteName);
            }
          });
          const siteUrlText = siteUrlInfo.join("\n");
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

  const handleMenuChange = (event, val) => {
    switch (val) {
      case 0:
        history.push('/advisories');
        break;
      case 1:
        history.push('/park-access-status');
        break;
      case 2:
        history.push('/activities-and-facilities');
        break;
      default:
        history.push('/');
    }
  };

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
          pathname: `/advisories`,
          index: index >= 0 ? index : 0,
        }}
      />
    );
  }

  if (toUpdate) {
    return <Redirect push to={`/update-advisory/${id}`} />;
  }

  if (toError) {
    return <Redirect push to="/error" />;
  }

  return (
    <main>
      <Header handleTabChange={handleMenuChange} />
      <div className="AdvisorySummary" data-testid="AdvisorySummary">
        <div className="container">
          {isLoadingPage && (
            <div className="page-loader">
              <Loader page />
            </div>
          )}
          {!isLoadingPage && (
            <div>
              <div>
                <div className="container-fluid">
                  <button
                    type="button"
                    className="btn btn-link btn-back mt-4"
                    onClick={() => {
                      setToDashboard(true);
                    }}>
                    <ArrowBackIcon />
                    Back to public advisories
                  </button>
                </div>
                {!showOriginalAdvisory && (
                  <div className="container-fluid ad-summary mt-4">
                    {confirmationText && (
                      <Alert severity="success">{confirmationText}</Alert>
                    )}
                    {isCurrentlyPublished && (
                      <div className="container-fluid ad-right mt-4">
                        <Link
                          component="button"
                          onClick={() => {
                            setShowOriginalAdvisory(true);
                          }}
                        >
                          View published version
                        </Link>
                      </div>
                    )}
                    <div className="mt-5 container-fluid ad-form">
                      <div className="row title">
                        <div className="col-md-8 col-12">
                          <p>Advisory #{advisory.advisoryNumber}</p>
                          <h2>{advisory.title}</h2>
                        </div>
                        <div className="col-md-4 col-12 d-flex align-items-center justify-content-end">
                          <Button
                            label="Edit advisory"
                            styling="bcgov-normal-blue btn mt10"
                            onClick={() => {
                              setToUpdate(true);
                            }}
                          />
                        </div>
                      </div>
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
        <br />
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
