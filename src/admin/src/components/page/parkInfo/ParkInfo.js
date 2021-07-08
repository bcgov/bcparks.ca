import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./ParkInfo.css";
import { Redirect, useParams } from "react-router-dom";
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
  const [editableFacilities, setEditableFacilities] = useState([]);
  const [parkActivities, setParkActivities] = useState([]);
  const [parkFacilities, setParkFacilities] = useState([]);
  const [submittingActivities, setSubmittingActivities] = useState([]);
  const [submittingFacilities, setSubmittingFacilities] = useState([]);
  const [loadParkInfo, setLoadParkInfo] = useState(true);
  const { keycloak, initialized } = useKeycloak();
  const { id } = useParams();

  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    if (initialized && keycloak && loadParkInfo) {
      Promise.all([
        cmsAxios.get(`/protected-areas/${id}`),
        getRegions(cmsData, setCmsData),
        getSections(cmsData, setCmsData),
      ])
        .then((res) => {
          const protectedAreaData = res[0].data;
          if (protectedAreaData.managementAreas.length > 0) {
            const managementArea = protectedAreaData.managementAreas[0];
            protectedAreaData.managementAreaName =
              managementArea.managementAreaName;
            const region = cmsData.regions.filter(
              (r) => r.id === managementArea.region
            );
            if (region.length > 0) {
              protectedAreaData.regionName = region[0].regionName;
            }
            const section = cmsData.sections.filter(
              (s) => s.id === managementArea.section
            );
            if (section.length > 0) {
              protectedAreaData.sectionName = section[0].sectionName;
            }
          }
          if (protectedAreaData.parkActivities) {
            const activities = [];
            protectedAreaData.parkActivities.map((activity) => {
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
          if (protectedAreaData.parkFacilities) {
            const facilities = [];
            protectedAreaData.parkFacilities.map((facility) => {
              return facilities.push({
                id: facility.id,
                description: facility.description,
                name: facility.name,
                isFacilityOpen: facility.isFacilityOpen,
                isActive: facility.isActive,
                protectedArea: facility.protectedArea,
                site: facility.site,
                facilityType: facility.facilityType,
              });
            });
            setParkFacilities([...facilities]);
          }
          setProtectedArea(protectedAreaData);
          setIsLoading(false);
          setLoadParkInfo(false);
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
  }, [
    cmsData,
    id,
    initialized,
    keycloak,
    setCmsData,
    setError,
    setIsLoading,
    loadParkInfo,
    setProtectedArea,
    setToError,
    setLoadParkInfo,
    setParkActivities,
  ]);

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
    currentActivity.description = unchangedActivity.description;
    finishEditActivityDesc(activityId, true);
  };

  const finishEditActivityDesc = (activityId, expand) => {
    const currentActivities = editableActivities.filter(
      (a) => a !== activityId
    );
    setEditableActivities([...currentActivities]);
    handleActivityAccordionChange(null, expand, activityId);
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
    saveActivity(activityId, false);
  };

  const handleActivityOpenChange = (activityId) => {
    const currentActivities = parkActivities;
    currentActivities.filter((d) => {
      if (d.id === activityId) {
        d.isActivityOpen = !d.isActivityOpen;
      }
      return "";
    });
    setParkActivities([...currentActivities]);
    saveActivity(activityId, false);
  };

  const handleActivitySubmitLoader = (activityId) => {
    const currentActivities = [...submittingActivities, activityId];
    setSubmittingActivities([...currentActivities]);
  };

  const saveActivity = (activityId, expand) => {
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
          finishEditActivityDesc(activityId, expand);
          setLoadParkInfo(true);
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

  const handleFacilityAccordionChange = (event, isExpanded, facilityId) => {
    if (isExpanded) {
      const currentFacilities = [...expandedFacilities, facilityId];
      setExpandedFacilities([...currentFacilities]);
    } else {
      const currentFacilities = expandedFacilities.filter(
        (f) => f !== facilityId
      );
      setExpandedFacilities([...currentFacilities]);
    }
  };

  const editFacilityDesc = (facilityId) => {
    const currentFacilities = [...editableFacilities, facilityId];
    setEditableFacilities([...currentFacilities]);
  };

  const cancelEditFacilityDesc = (facilityId) => {
    const currentFacility = parkFacilities.filter(
      (f) => f.id === facilityId
    )[0];
    const unchangedFacility = protectedArea.parkFacilities.filter(
      (f) => f.id === facilityId
    )[0];
    currentFacility.description = unchangedFacility.description;
    finishEditFacilityDesc(facilityId, true);
  };

  const finishEditFacilityDesc = (facilityId, expand) => {
    const currentFacilities = editableFacilities.filter(
      (f) => f !== facilityId
    );
    setEditableFacilities([...currentFacilities]);
    handleFacilityAccordionChange(null, expand, facilityId);
  };
  const handleFacilityDescriptionChange = (event, facilityId) => {
    const currentDescriptions = parkFacilities;
    currentDescriptions.filter((d) => {
      if (d.id === facilityId) {
        d.description = event.target.value;
      }
      return "";
    });
    setParkFacilities([...currentDescriptions]);
  };

  const handleFacilityDisplayChange = (facilityId) => {
    const currentFacilities = parkFacilities;
    currentFacilities.filter((d) => {
      if (d.id === facilityId) {
        d.isActive = !d.isActive;
      }
      return "";
    });
    setParkFacilities([...currentFacilities]);
    saveFacility(facilityId, false);
  };

  const handleFacilityOpenChange = (facilityId) => {
    const currentFacilities = parkFacilities;
    currentFacilities.filter((d) => {
      if (d.id === facilityId) {
        d.isFacilityOpen = !d.isFacilityOpen;
      }
      return "";
    });
    setParkFacilities([...currentFacilities]);
    saveFacility(facilityId, false);
  };

  const handleFacilitySubmitLoader = (facilityId) => {
    const currentFacilities = [...submittingFacilities, facilityId];
    setSubmittingFacilities([...currentFacilities]);
  };

  const saveFacility = (facilityId, expand) => {
    const facilities = parkFacilities.filter((d) => d.id === facilityId);
    if (facilities.length > 0) {
      const facility = facilities[0];
      const parkFacility = {
        name: facility.name,
        description: facility.description,
        isFacilityOpen: facility.isFacilityOpen,
        isActive: facility.isActive,
        modifiedBy: keycloak.tokenParsed.name,
        modifiedDate: moment().toISOString(),
        protectedArea: facility.protectedArea,
        site: facility.site,
        facilityType: facility.facilityType,
      };
      apiAxios
        .put(`api/update/park-facilities/${facilityId}`, parkFacility, {
          headers: { Authorization: `Bearer ${keycloak.idToken}` },
        })
        .then((res) => {
          const currentFacilities = submittingFacilities.filter(
            (f) => f !== facilityId
          );
          setSubmittingFacilities([...currentFacilities]);
          finishEditFacilityDesc(facilityId, expand);
          setLoadParkInfo(true);
        })
        .catch((error) => {
          console.log("error occurred", error);
          setToError(true);
          setError({
            status: 500,
            message: "Could not update facility",
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
      <Header />
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
                                    onChange={() => {
                                      handleActivityOpenChange(a.id);
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
                                      expanded={expandedActivities.includes(
                                        a.id
                                      )}
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
                                                handleActivitySubmitLoader(
                                                  a.id
                                                );
                                                saveActivity(a.id, true);
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
                          {protectedArea.parkFacilities.map((f) => {
                            const facility = parkFacilities.filter(
                              (fa) => fa.id === f.id
                            )[0];
                            return (
                              <div
                                className="row pt2b2"
                                key={`facility-${f.id}`}
                              >
                                <div className="col-lg-3 col-md-12 col-12 park-content">
                                  {f.name.split(":")[1]}
                                </div>
                                <div className="col-lg-1 col-md-12 col-12 park-content">
                                  <SwitchButton
                                    checked={facility.isActive}
                                    name={`${f.id}-is-active`}
                                    inputProps={{
                                      "aria-label": "active facility",
                                    }}
                                    onChange={() => {
                                      handleFacilityDisplayChange(f.id);
                                    }}
                                  />
                                </div>
                                <div className="col-lg-1 col-md-12 col-12 park-content">
                                  <SwitchButton
                                    checked={facility.isFacilityOpen}
                                    name={`${f.id}-is-open`}
                                    inputProps={{
                                      "aria-label": "open facility",
                                    }}
                                    onChange={() => {
                                      handleFacilityOpenChange(f.id);
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
                                        handleFacilityAccordionChange(
                                          event,
                                          isExpanded,
                                          f.id
                                        );
                                      }}
                                      className="park-desc"
                                      expanded={expandedFacilities.includes(
                                        f.id
                                      )}
                                    >
                                      <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="facility-description"
                                        id="facility-description"
                                      >
                                        {!expandedFacilities.includes(f.id) && (
                                          <div className="">
                                            {facility.description
                                              ? facility.description.length <
                                                100
                                                ? facility.description
                                                : facility.description.substring(
                                                    0,
                                                    100
                                                  ) + "..."
                                              : "No description"}
                                          </div>
                                        )}
                                      </AccordionSummary>

                                      <AccordionDetails className="">
                                        {!editableFacilities.includes(f.id) && (
                                          <div>
                                            {facility.description
                                              ? facility.description
                                              : "No description"}
                                          </div>
                                        )}
                                        {editableFacilities.includes(f.id) && (
                                          <TextField
                                            multiline
                                            value={facility.description || ""}
                                            onChange={(event) => {
                                              handleFacilityDescriptionChange(
                                                event,
                                                f.id
                                              );
                                            }}
                                            className="bcgov-input white-background"
                                            variant="outlined"
                                            InputProps={{
                                              id: `facility-${f.id}-desc`,
                                              required: false,
                                              placeholder:
                                                "Enter facility description",
                                            }}
                                          />
                                        )}
                                      </AccordionDetails>
                                      <AccordionActions>
                                        {!editableFacilities.includes(f.id) && (
                                          <Button
                                            label="Edit"
                                            styling="bcgov-normal-blue btn mt10"
                                            onClick={() => {
                                              editFacilityDesc(f.id);
                                            }}
                                          />
                                        )}
                                        {editableFacilities.includes(f.id) && (
                                          <>
                                            <Button
                                              label="Cancel"
                                              styling="bcgov-normal-white btn mt10"
                                              onClick={() => {
                                                cancelEditFacilityDesc(f.id);
                                              }}
                                            />
                                            <Button
                                              label="Save"
                                              styling="bcgov-normal-blue btn mt10"
                                              onClick={() => {
                                                handleFacilitySubmitLoader(
                                                  f.id
                                                );
                                                saveFacility(f.id, true);
                                              }}
                                              hasLoader={submittingFacilities.includes(
                                                f.id
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
