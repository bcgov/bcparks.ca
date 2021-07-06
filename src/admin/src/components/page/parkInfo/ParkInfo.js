import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./ParkInfo.css";
import { Redirect, useParams, useLocation } from "react-router-dom";
import { Loader } from "shared-components/build/components/loader/Loader";
import { useKeycloak } from "@react-keycloak/web";
import Header from "../../composite/header/Header";
import { cmsAxios, apiAxios } from "../../../axios_config";
import { getRegions, getSections } from "../../../utils/CmsDataUtil";
import { Button } from "shared-components/build/components/button/Button";
import { a11yProps } from "../../../utils/AppUtil";
import {
  Tab,
  Tabs,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  AccordionActions,
  TextField,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import moment from "moment";
import SwitchButton from "../../base/switchButton/SwitchButton";
import TabPanel from "../../base/tabPanel/TabPanel";

export default function ParkInfo({ page: { setError, cmsData, setCmsData } }) {
  const [isLoading, setIsLoading] = useState(true);
  const [toError, setToError] = useState(false);
  const [toDashboard, setToDashboard] = useState(false);
  const [protectedArea, setProtectedArea] = useState();
  const [expandedActivities, setExpandedActivities] = useState([]);
  const [editableActivities, setEditableActivities] = useState([]);
  const [expandedFacilities, setExpandedFacilities] = useState([]);
  const [parkActivities, setParkActivities] = useState([]);
  const [submittingActivities, setSubmittingActivities] = useState([]);
  const { keycloak, initialized } = useKeycloak();
  const { id } = useParams();

  const [tabIndex, setTabIndex] = useState(0);
  const { index } = useLocation();

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
          if (protectedArea.parkActivities) {
            const activities = [];
            protectedArea.parkActivities.map((activity) => {
              return activities.push({
                id: activity.id,
                description: activity.description,
                name: activity.name,
                isActivityOpen: activity.isActivityOpen,
                isActive: activity.isActive,
                protectedArea: activity.protectedArea,
                site: activity.site,
                activityType: activity.activityType,
              });
            });
            setParkActivities([...activities]);
          }
          setProtectedArea(protectedArea);
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

  const handleActivityAccordionChange = (event, isExpanded, activityId) => {
    if (isExpanded) {
      const currentActivities = [...expandedActivities, activityId];
      setExpandedActivities([...currentActivities]);
    } else {
      const currentActivities = expandedActivities.filter(
        (a) => a !== activityId
      );
      setExpandedActivities([...currentActivities]);
    }
  };

  const editActivityDesc = (activityId) => {
    const currentActivities = [...editableActivities, activityId];
    setEditableActivities([...currentActivities]);
  };

  const cancelEditActivityDesc = (activityId) => {
    const currentActivity = parkActivities.filter(
      (a) => a.id === activityId
    )[0];
    const unchangedActivity = protectedArea.parkActivities.filter(
      (a) => a.id === activityId
    )[0];
    console.log(currentActivity, unchangedActivity);
    currentActivity.description = unchangedActivity.description;
    finishEditActivityDesc(activityId);
  };

  const finishEditActivityDesc = (activityId) => {
    const currentActivities = editableActivities.filter(
      (a) => a !== activityId
    );
    setEditableActivities([...currentActivities]);
  };
  const handleActivityDescriptionChange = (event, activityId) => {
    const currentDescriptions = parkActivities;
    currentDescriptions.filter((d) => {
      if (d.id === activityId) {
        d.description = event.target.value;
      }
      return "";
    });
    setParkActivities([...currentDescriptions]);
  };

  const handleActivityDisplayChange = (activityId) => {
    const currentActivities = parkActivities;
    currentActivities.filter((d) => {
      if (d.id === activityId) {
        d.isActive = !d.isActive;
      }
      return "";
    });
    setParkActivities([...currentActivities]);
    saveActivity(activityId);
  };

  const handleSubmitLoader = (activityId) => {
    const currentActivities = [...submittingActivities, activityId];
    setSubmittingActivities([...currentActivities]);
  };

  const saveActivity = (activityId) => {
    const activities = parkActivities.filter((d) => d.id === activityId);
    if (activities.length > 0) {
      const activity = activities[0];
      const parkActivity = {
        name: activity.name,
        description: activity.description,
        isActivityOpen: activity.isActivityOpen,
        isActive: activity.isActive,
        modifiedBy: keycloak.tokenParsed.name,
        modifiedDate: moment().toISOString(),
        protectedArea: activity.protectedArea,
        site: activity.site,
        activityType: activity.activityType,
      };
      apiAxios
        .put(`api/update/park-activities/${activityId}`, parkActivity, {
          headers: { Authorization: `Bearer ${keycloak.idToken}` },
        })
        .then((res) => {
          const currentActivities = submittingActivities.filter(
            (a) => a !== activityId
          );
          setSubmittingActivities([...currentActivities]);
          finishEditActivityDesc(activityId);
        })
        .catch((error) => {
          console.log("error occurred", error);
          setToError(true);
          setError({
            status: 500,
            message: "Could not update activity",
          });
        });
    }
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
            <div className="container-fluid">
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
              <div className="pt10b30">
                <div className="container-fluid">
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
                    {protectedArea.parkActivities &&
                      protectedArea.parkActivities.length > 0 && (
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
                          {protectedArea.parkActivities.map((a) => {
                            const act = parkActivities.filter(
                              (ad) => ad.id === a.id
                            )[0];
                            return (
                              <div
                                className="row pt2b2"
                                key={`activity-${a.id}`}
                              >
                                <div className="col-lg-3 col-md-12 col-12 park-content">
                                  {a.name.split(":")[1]}
                                </div>
                                <div className="col-lg-1 col-md-12 col-12 park-content">
                                  <SwitchButton
                                    checked={act.isActive}
                                    name={`${a.id}-is-active`}
                                    inputProps={{
                                      "aria-label": "active activity",
                                    }}
                                    onChange={() => {
                                      handleActivityDisplayChange(a.id);
                                    }}
                                  />
                                </div>
                                <div className="col-lg-1 col-md-12 col-12 park-content">
                                  <SwitchButton
                                    checked={act.isActivityOpen}
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
                                  <div className="wrap-text">
                                    <Accordion
                                      onChange={(event, isExpanded) => {
                                        handleActivityAccordionChange(
                                          event,
                                          isExpanded,
                                          a.id
                                        );
                                      }}
                                      className="park-desc"
                                    >
                                      <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="activity-description"
                                        id="activity-description"
                                      >
                                        {!expandedActivities.includes(a.id) && (
                                          <div className="">
                                            {act.description
                                              ? act.description.length < 100
                                                ? act.description
                                                : act.description.substring(
                                                    0,
                                                    100
                                                  ) + "..."
                                              : "No description"}
                                          </div>
                                        )}
                                      </AccordionSummary>

                                      <AccordionDetails className="">
                                        {!editableActivities.includes(a.id) && (
                                          <div>
                                            {act.description
                                              ? act.description
                                              : "No description"}
                                          </div>
                                        )}
                                        {editableActivities.includes(a.id) && (
                                          <TextField
                                            multiline
                                            value={act.description || ""}
                                            onChange={(event) => {
                                              handleActivityDescriptionChange(
                                                event,
                                                a.id
                                              );
                                            }}
                                            className="bcgov-input white-background"
                                            variant="outlined"
                                            InputProps={{
                                              id: `activity-${a.id}-desc`,
                                              required: false,
                                              placeholder:
                                                "Enter activity description",
                                            }}
                                          />
                                        )}
                                      </AccordionDetails>
                                      <AccordionActions>
                                        {!editableActivities.includes(a.id) && (
                                          <Button
                                            label="Edit"
                                            styling="bcgov-normal-blue btn mt10"
                                            onClick={() => {
                                              editActivityDesc(a.id);
                                            }}
                                          />
                                        )}
                                        {editableActivities.includes(a.id) && (
                                          <>
                                            <Button
                                              label="Cancel"
                                              styling="bcgov-normal-white btn mt10"
                                              onClick={() => {
                                                cancelEditActivityDesc(a.id);
                                              }}
                                            />
                                            <Button
                                              label="Save"
                                              styling="bcgov-normal-blue btn mt10"
                                              onClick={() => {
                                                handleSubmitLoader(a.id);
                                                saveActivity(a.id);
                                              }}
                                              hasLoader={submittingActivities.includes(
                                                a.id
                                              )}
                                            />
                                          </>
                                        )}
                                      </AccordionActions>
                                    </Accordion>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    {!protectedArea.parkActivities ||
                      (protectedArea.parkActivities.length === 0 && (
                        <div className="park-empty-info">
                          No activities found
                        </div>
                      ))}
                  </TabPanel>
                  <TabPanel value={tabIndex} index={1} label="park-info">
                    {protectedArea.parkFacilities &&
                      protectedArea.parkFacilities.length > 0 && (
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
                          {protectedArea.parkFacilities.map((f) => (
                            <div
                              className="row pt2b2"
                              key={`facilities-${f.id}`}
                            >
                              <div className="col-lg-3 col-md-12 col-12 park-content">
                                {f.name.split(":")[1]}
                              </div>
                              <div className="col-lg-1 col-md-12 col-12 park-content">
                                <SwitchButton
                                  checked={f.isActive}
                                  name={`facility-${f.id}-is-active`}
                                  inputProps={{
                                    "aria-label": "active facility",
                                  }}
                                />
                              </div>
                              <div className="col-lg-1 col-md-12 col-12 park-content">
                                <SwitchButton
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
                        </div>
                      )}
                    {!protectedArea.parkFacilities ||
                      (protectedArea.parkFacilities.length === 0 && (
                        <div className="park-empty-info">
                          No facilities found
                        </div>
                      ))}
                  </TabPanel>
                </div>
              </div>
            </div>
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
