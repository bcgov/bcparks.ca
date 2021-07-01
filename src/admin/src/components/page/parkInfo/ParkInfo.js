import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./ParkInfo.css";
import { Redirect, useParams, useLocation } from "react-router-dom";
import { Loader } from "shared-components/build/components/loader/Loader";
import { useKeycloak } from "@react-keycloak/web";
import Header from "../../composite/header/Header";
import { cmsAxios } from "../../../axios_config";
import { getRegions, getSections } from "../../../utils/CmsDataUtil";
import { Button } from "shared-components/build/components/button/Button";
import { a11yProps } from "../../../utils/AppUtil";
import { Tab, Tabs, Switch } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import TabPanel from "../../base/tabPanel/TabPanel";

export default function ParkInfo({ page: { setError, cmsData, setCmsData } }) {
  const [isLoading, setIsLoading] = useState(true);
  const [toError, setToError] = useState(false);
  const [toDashboard, setToDashboard] = useState(false);
  const [protectedArea, setProtectedArea] = useState();
  const { keycloak, initialized } = useKeycloak();
  const { id } = useParams();

  const [tabIndex, setTabIndex] = useState(0);
  const { index } = useLocation();

  const ButtonSwitch = withStyles((theme) => ({
    root: {
      width: 38,
      height: 22,
      padding: 0,
      margin: theme.spacing(1),
    },
    switchBase: {
      padding: "2px !important",
      "&$checked": {
        transform: "translateX(16px)",
        color: "#036",
        "& + $track": {
          backgroundColor: "#036",
          opacity: 1,
          border: "none",
        },
      },
      "&$focusVisible $thumb": {
        color: "#036",
        border: "6px solid #036",
      },
    },
    thumb: {
      width: 18,
      height: 18,
      color: "#fff",
    },
    track: {
      borderRadius: 26 / 2,
      border: `1px solid #00000033`,
      backgroundColor: "#00000033",
      opacity: 1,
      transition: theme.transitions.create(["background-color", "border"]),
    },
    checked: {},
    focusVisible: {},
  }))(({ classes, ...props }) => {
    return (
      <Switch
        focusVisibleClassName={classes.focusVisible}
        disableRipple
        classes={{
          root: classes.root,
          switchBase: classes.switchBase,
          thumb: classes.thumb,
          track: classes.track,
          checked: classes.checked,
        }}
        {...props}
      />
    );
  });

  // useEffect(() => {
  //   if (!isLoading) {
  //   }
  // }, [isLoading]);

  useEffect(() => {
    if (initialized && keycloak) {
      Promise.all([
        cmsAxios.get(`/protected-areas/${id}`),
        getRegions(cmsData, setCmsData),
        getSections(cmsData, setCmsData),
      ])
        .then((res) => {
          const protectedArea = res[0].data;
          if (protectedArea.managementAreas.length > 0) {
            const managementArea = protectedArea.managementAreas[0];
            protectedArea.managementAreaName =
              managementArea.managementAreaName;
            const region = cmsData.regions.filter(
              (r) => r.id === managementArea.region
            );
            if (region.length > 0) {
              protectedArea.regionName = region[0].regionName;
            }
            const section = cmsData.sections.filter(
              (s) => s.id === managementArea.section
            );
            if (section.length > 0) {
              protectedArea.sectionName = section[0].sectionName;
            }
          }
          setProtectedArea(protectedArea);
          console.log(res[0].data);
          setIsLoading(false);
        })
        .catch(() => {
          setToError(true);
          setError({
            status: 500,
            message: "Error fetching park information",
          });
          setIsLoading(false);
        });
    }
  }, [cmsData, id, initialized, keycloak, setCmsData, setError, setIsLoading]);

  const handleTabChange = (event, val) => {
    setTabIndex(val);
  };

  if (toDashboard) {
    return (
      <Redirect
        to={{
          pathname: `/bcparks/dashboard`,
          index: 1,
        }}
      />
    );
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
      <div className="ParkInfo" data-testid="ParkInfo">
        <div className="container">
          {isLoading && (
            <div className="page-loader">
              <Loader page />
            </div>
          )}
          {!isLoading && (
            <>
              <div className="container-fluid">
                <Button
                  label="Back"
                  styling="bcgov-normal-white btn mt10"
                  onClick={() => {
                    setToDashboard(true);
                  }}
                />
              </div>
              <br />
              <div className="container-fluid">
                <div className="">
                  <h3>{protectedArea.protectedAreaName}</h3>
                  {protectedArea.regionName && (
                    <div>{protectedArea.regionName} Region</div>
                  )}
                  {protectedArea.sectionName && (
                    <div>{protectedArea.sectionName} Section</div>
                  )}
                  {protectedArea.managementAreaName && (
                    <div>
                      {protectedArea.managementAreaName} Management Area
                    </div>
                  )}
                </div>
              </div>
              <div className="container park-tabs mt20">
                <Tabs
                  value={tabIndex}
                  onChange={handleTabChange}
                  aria-label="Park-Info"
                  className="park-tab"
                  variant="fullWidth"
                >
                  <Tab label="Activities" {...a11yProps(0, "park-info")} />
                  <Tab label="Facilities" {...a11yProps(1, "park-info")} />
                </Tabs>
                <TabPanel value={tabIndex} index={0} label="park-info">
                  <div>
                    <div className="row pt2b2">
                      <div className="col-lg-3 col-md-12 col-12 park-header">
                        Activity
                      </div>
                      <div className="col-lg-1 col-md-12 col-12 park-header">
                        Display
                      </div>
                      <div className="col-lg-1 col-md-12 col-12 park-header">
                        Open
                      </div>
                      <div className="col-lg-3 col-md-12 col-12 park-header">
                        Fees
                      </div>
                      <div className="col-lg-4 col-md-12 col-12 park-header no-right-border">
                        Description
                      </div>
                    </div>
                    {protectedArea.parkActivities &&
                      protectedArea.parkActivities.length > 0 && (
                        <>
                          {protectedArea.parkActivities.map((a) => (
                            <div className="row pt2b2" key={`activity-${a.id}`}>
                              <div className="col-lg-3 col-md-12 col-12 park-content">
                                {a.name.split(":")[1]}
                              </div>
                              <div className="col-lg-1 col-md-12 col-12 park-content">
                                <ButtonSwitch
                                  checked={a.isActive}
                                  name={`${a.id}-is-active`}
                                  inputProps={{
                                    "aria-label": "active activity",
                                  }}
                                />
                              </div>
                              <div className="col-lg-1 col-md-12 col-12 park-content">
                                <ButtonSwitch
                                  checked={a.isActivityOpen}
                                  name={`${a.id}-is-open`}
                                  inputProps={{
                                    "aria-label": "open activity",
                                  }}
                                />
                              </div>
                              <div className="col-lg-3 col-md-12 col-12 park-content">
                                Add a fee
                              </div>
                              <div className="col-lg-4 col-md-12 col-12 park-content no-right-border">
                                {a.description}
                              </div>
                            </div>
                          ))}
                        </>
                      )}
                  </div>
                </TabPanel>
                <TabPanel value={tabIndex} index={1} label="park-info">
                  <div>
                    <div className="row pt2b2">
                      <div className="col-lg-3 col-md-12 col-12 park-header">
                        Facilities
                      </div>
                      <div className="col-lg-1 col-md-12 col-12 park-header">
                        Display
                      </div>
                      <div className="col-lg-1 col-md-12 col-12 park-header">
                        Open
                      </div>
                      <div className="col-lg-3 col-md-12 col-12 park-header">
                        Fees
                      </div>
                      <div className="col-lg-4 col-md-12 col-12 park-header no-right-border">
                        Description
                      </div>
                    </div>
                    {protectedArea.parkFacilities &&
                      protectedArea.parkFacilities.length > 0 && (
                        <>
                          {protectedArea.parkFacilities.map((f) => (
                            <div
                              className="row pt2b2"
                              key={`facilities-${f.id}`}
                            >
                              <div className="col-lg-3 col-md-12 col-12 park-content">
                                {f.name.split(":")[1]}
                              </div>
                              <div className="col-lg-1 col-md-12 col-12 park-content">
                                <ButtonSwitch
                                  checked={f.isActive}
                                  name={`facility-${f.id}-is-active`}
                                  inputProps={{
                                    "aria-label": "active facility",
                                  }}
                                />
                              </div>
                              <div className="col-lg-1 col-md-12 col-12 park-content">
                                <ButtonSwitch
                                  checked={f.isFacilityOpen}
                                  name={`facility-${f.id}-is-open`}
                                  inputProps={{
                                    "aria-label": "open facility",
                                  }}
                                />
                              </div>
                              <div className="col-lg-3 col-md-12 col-12 park-content">
                                Add a fee
                              </div>
                              <div className="col-lg-4 col-md-12 col-12 park-content no-right-border">
                                {f.description}
                              </div>
                            </div>
                          ))}
                        </>
                      )}
                  </div>
                </TabPanel>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

ParkInfo.propTypes = {
  page: PropTypes.shape({
    setError: PropTypes.func.isRequired,
    cmsData: PropTypes.object.isRequired,
    setCmsData: PropTypes.func.isRequired,
  }).isRequired,
};
