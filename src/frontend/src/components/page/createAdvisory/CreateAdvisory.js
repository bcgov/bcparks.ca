import React, { useState, useEffect } from "react";
import { cmsAxios, apiAxios, axios } from "../../../axios_config";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import "./CreateAdvisory.css";
import { Button } from "shared-components/build/components/button/Button";
import { Input } from "shared-components/build/components/input/Input";
import { Dropdown } from "shared-components/build/components/dropdown/Dropdown";
import { TextField, ButtonGroup, Radio } from "@material-ui/core";
import Header from "../../composite/header/Header";
import ImageUploader from "react-images-upload";
import Select from "react-select";
import moment from "moment";
import { useKeycloak } from "@react-keycloak/web";
import { Loader } from "shared-components/build/components/loader/Loader";
import WarningIcon from "@material-ui/icons/Warning";

export default function CreateAdvisory({ page: { setError } }) {
  const [protectedAreaNames, setProtectedAreaNames] = useState([]);
  const [eventTypes, setEventTypes] = useState([]);
  const [urgencies, setUrgencies] = useState([]);
  const [advisoryStatuses, setAdvisoryStatuses] = useState([]);
  const [toError, setToError] = useState(false);
  const [toDashboard, setToDashboard] = useState(false);
  const [headline, setHeadline] = useState();
  const [eventType, setEventType] = useState();
  const [description, setDescription] = useState();
  const [locations, setLocations] = useState([]);
  const [urgency, setUrgency] = useState();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [expiryDate, setExpiryDate] = useState(new Date());
  const [pictures, setPictures] = useState([]);
  const [links, setLinks] = useState();
  const [notes, setNotes] = useState();
  const { keycloak, initialized } = useKeycloak();
  const [isLoading, setIsLoading] = useState(true);
  const [isStatHoliday, setIsStatHoliday] = useState(false);
  const [isAfterHours, setIsAfterHours] = useState(false);
  const [isAfterHourPublish, setIsAfterHourPublish] = useState(false);

  const headlineInput = {
    label: "",
    id: "headline",
    isReadOnly: false,
    isRequired: false,
  };
  const linksInput = {
    label: "",
    id: "link",
    isReadOnly: false,
    isRequired: false,
  };
  const notesInput = {
    label: "",
    id: "notes",
    isReadOnly: false,
    isRequired: false,
  };

  const interval = ["Two", "Three", "Four", "Five"];
  const intervalUnit = ["Hours", "Days", "Weeks", "Months"];

  const currentTime = new Date().toISOString().substring(0, 16);

  const calculateStatHoliday = (statData) => {
    for (let hol of statData["province"]["holidays"]) {
      if (moment(hol["date"]).isSame(Date.now(), "day")) {
        return true;
      }
    }
    return false;
  };

  const calculateAfterHours = (businessHours) => {
    const currentDate = moment().format("YYYY-MM-DD");
    const currentDay = moment().format("dddd");
    const businessStartTime = moment(
      currentDate + " " + businessHours["StartTime"]
    );
    const businessEndTime = moment(
      currentDate + " " + businessHours["EndTime"]
    );
    const businessHour = moment().isBetween(businessStartTime, businessEndTime);
    if (!businessHours[currentDay] || !businessHour) {
      return true;
    }
    return false;
  };

  const isLatestStatutoryHolidayList = (statData) => {
    for (let hol of statData["province"]["holidays"]) {
      if (!moment(hol["date"]).isSame(Date.now(), "year")) {
        return false;
      }
    }
    return true;
  };

  useEffect(() => {
    if (initialized && keycloak.authenticated) {
      Promise.resolve(
        cmsAxios
          .get(`/statutory-holidays`)
          .then((res) => {
            const statData = res.data.Data;
            if (
              Object.keys(statData).length === 0 ||
              !isLatestStatutoryHolidayList(statData)
            ) {
              throw new Error("Obsolete Holiday List");
            }
            setIsStatHoliday(calculateStatHoliday(statData));
          })
          .catch((err) => {
            console.log(err);
            // Call Statutory Holiday API if CMS cache is not available
            axios
              .get(process.env.REACT_APP_STAT_HOLIDAY_API)
              .then((res) => {
                const statInfo = { Data: res.data };
                setIsStatHoliday(calculateStatHoliday(res.data));
                // Write Statutory Data to CMS cache
                apiAxios
                  .put(`api/update/statutory-holidays`, statInfo, {
                    headers: { Authorization: `Bearer ${keycloak.idToken}` },
                  })
                  .catch((error) => {
                    console.log(
                      "error occurred writing statutory holidays to cms",
                      error
                    );
                  });
              })
              .catch((error) => {
                setIsStatHoliday(false);
                console.log(
                  "error occurred fetching statutory holidays from API",
                  error
                );
              });
          })
      );
    }
  }, [keycloak, initialized, setIsStatHoliday]);

  useEffect(() => {
    if (!initialized) {
      setIsLoading(true);
    } else if (!keycloak.authenticated) {
      setToError(true);
      setError({
        status: 401,
        message: "Login required",
      });
    } else {
      Promise.all([
        cmsAxios.get(`/protectedAreas?_limit=-1&_sort=ProtectedAreaName`),
        cmsAxios.get(`/event-types?_limit=-1&_sort=EventType`),
        cmsAxios.get(`/urgencies?_limit=-1&_sort=Sequence`),
        cmsAxios.get(`/business-hours`),
        cmsAxios.get(`/advisory-statuses`),
      ])
        .then((res) => {
          const protectedAreaData = res[0].data;
          const protectedAreaNames = protectedAreaData.map((p) => ({
            label: p.ProtectedAreaName,
            value: p.ORCS,
          }));
          setProtectedAreaNames([...protectedAreaNames]);
          const eventTypeData = res[1].data;
          const eventTypes = eventTypeData.map((et) => ({
            label: et.EventType,
            value: et.id,
          }));
          setEventTypes([...eventTypes]);
          const urgencyData = res[2].data;
          const urgencies = urgencyData.map((u) => ({
            label: u.Urgency,
            value: u.id,
          }));
          setUrgencies([...urgencies]);
          setUrgency(urgencyData[0].id);
          setIsAfterHours(calculateAfterHours(res[3].data));

          const advisoryStatusData = res[4].data;
          const advisoryStatuses = advisoryStatusData.map((s) => ({
            code: s.Code,
            id: s.id,
          }));
          setAdvisoryStatuses([...advisoryStatuses]);
          setIsLoading(false);
        })
        .catch(() => {
          setToError(true);
          setError({
            status: 500,
            message: "Error occurred",
          });
        });
    }
  }, [
    setProtectedAreaNames,
    setUrgencies,
    setAdvisoryStatuses,
    setEventTypes,
    setUrgency,
    setToError,
    setError,
    keycloak,
    initialized,
    setIsLoading,
    setIsAfterHours,
  ]);

  const onDrop = (picture) => {
    setPictures([...pictures, picture]);
  };

  const getAdvisoryStatusId = (type) => {
    let status = {};
    if (type === "submit") {
      status = advisoryStatuses.filter((s) => s.code === "AR");
    } else if (type === "draft") {
      status = advisoryStatuses.filter((s) => s.code === "DFT");
    } else if (type === "publish") {
      status = advisoryStatuses.filter((s) => s.code === "PUB");
    }
    return status[0]["id"];
  };

  const saveAdvisory = (type) => {
    if (type === "submit" && isAfterHourPublish) {
      type = "publish";
    }
    const advisoryStatus = getAdvisoryStatusId(type);
    let protectedAreaQuery = "";
    locations.forEach((loc, index, array) => {
      protectedAreaQuery += `ORCS_in=${loc}`;
      if (!Object.is(array.length - 1, index)) {
        protectedAreaQuery += "&";
      }
    });
    Promise.all([
      cmsAxios.get(`/event-types/${eventType}`),
      cmsAxios.get(`/urgencies/${urgency}`),
      cmsAxios.get(`/advisory-statuses/${advisoryStatus}`),
      cmsAxios.get(`/protectedAreas?${protectedAreaQuery}`),
    ])
      .then((res) => {
        const newAdvisory = {
          AdvisoryDate: startDate,
          EffectiveDate: startDate,
          EndDate: endDate,
          ExpiryDate: expiryDate,
          Title: headline,
          Description: description,
          Note: notes,
          event_type: res[0].data,
          urgency: res[1].data,
          advisory_status: res[2].data,
          protected_areas: res[3].data,
        };
        apiAxios
          .post(`api/add/public-advisories`, newAdvisory, {
            headers: { Authorization: `Bearer ${keycloak.idToken}` },
          })
          .then(() => {
            console.log("New advisory added successfully");
            setToDashboard(true);
          })
          .catch((error) => {
            console.log("error occurred", error);
          });
      })
      .catch(() => {
        setToError(true);
        setError({
          status: 500,
          message: "Error occurred",
        });
      });
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
      <div className="CreateAdvisory" data-testid="CreateAdvisory">
        <div className="container">
          {isLoading && (
            <div className="page-loader">
              <Loader page />
            </div>
          )}
          {!isLoading && (
            <form>
              <div className="container-fluid ad-form">
                <div className="row ad-row">
                  <div className="col-lg-4 col-md-4 col-sm-12 ad-label">
                    Headline
                  </div>
                  <div className="col-lg-8 col-md-8 col-sm-12">
                    <Input
                      input={{
                        ...headlineInput,
                        styling: "bcgov-editable-white",
                      }}
                      onChange={(event) => {
                        setHeadline(event);
                      }}
                    />
                  </div>
                </div>
                <div className="row ad-row">
                  <div className="col-lg-4 col-md-4 col-sm-12 ad-label">
                    Event type
                  </div>
                  <div className="col-lg-8 col-md-8 col-sm-12">
                    <Select
                      options={eventTypes}
                      onChange={(e) => setEventType(e.value)}
                      placeholder="Select an event type"
                      className="bg-blue f-select"
                    />
                  </div>
                </div>
                <div className="row ad-row">
                  <div className="col-lg-4 col-md-4 col-sm-12 ad-label">
                    Description
                  </div>
                  <div className="col-lg-8 col-md-8 col-sm-12">
                    <textarea
                      className="bcgov-text-input"
                      id="description"
                      rows="2"
                      onChange={(event) => {
                        setDescription(event.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className="row ad-row">
                  <div className="col-lg-4 col-md-4 col-sm-12 ad-label">
                    Location
                  </div>
                  <div className="col-lg-8 col-md-8 col-sm-12">
                    <Select
                      options={protectedAreaNames}
                      onChange={(e) => {
                        setLocations(e.map((o) => o.value));
                      }}
                      placeholder="Select a Park"
                      className="bg-blue f-select"
                      isMulti="true"
                    />
                  </div>
                </div>
                <div className="row ad-row">
                  <div className="col-lg-4 col-md-4 col-sm-12 ad-label">
                    Urgency level
                  </div>
                  <div className="col-lg-8 col-md-8 col-sm-12">
                    <ButtonGroup
                      className="ad-btn-group"
                      color="primary"
                      aria-label="outlined primary button group"
                    >
                      {urgencies.map((u) => (
                        <Button
                          key={u.value}
                          label={u.label}
                          styling={
                            urgency === u.value
                              ? "bcgov-normal-blue btn"
                              : "bcgov-normal-white btn"
                          }
                          onClick={() => {
                            setUrgency(u.value);
                          }}
                        />
                      ))}
                    </ButtonGroup>
                  </div>
                </div>
                <div className="row ad-row">
                  <div className="col-lg-4 col-md-4 col-sm-12 ad-label">
                    Effective date
                  </div>
                  <div className="col-lg-8 col-md-8 col-sm-12">
                    <div className="ad-field field-bg-blue">
                      <div className="row ad-row ">
                        <div className="col-lg-6 col-md-12 col-sm-12 pr0">
                          <div className="ad-flex">
                            <div className="p10 col-lg-2 col-md-3 col-sm-12">
                              Start
                            </div>
                            <div className="col-lg-10 col-md-9 col-sm-12">
                              <TextField
                                id="startDate"
                                type="datetime-local"
                                defaultValue={currentTime}
                                className="react-datepicker-wrapper"
                                onChange={(e) => {
                                  setStartDate(e.target.value);
                                }}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-12 col-sm-12">
                          <div className="ad-flex">
                            <div className="p10 col-lg-3 col-md-4 col-sm-12">
                              Duration
                            </div>
                            <div className="p10 col-lg-9 col-md-8 col-sm-12 ad-flex ptm3 ad-interval-box">
                              <Dropdown items={interval} onSelect={() => {}} />
                              <Dropdown
                                items={intervalUnit}
                                onSelect={() => {}}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row ad-row">
                        <div className="col-lg-6 col-md-12 col-sm-12 pr0">
                          <div className="ad-flex">
                            <div className="p10 col-lg-2 col-md-3 col-sm-12">
                              End
                            </div>
                            <div className="col-lg-10 col-md-9 col-sm-12">
                              <TextField
                                id="endDate"
                                type="datetime-local"
                                defaultValue={currentTime}
                                className="react-datepicker-wrapper"
                                onChange={(e) => {
                                  setEndDate(e.target.value);
                                }}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-12 col-sm-12 ptm3 pr0">
                          <div className="ad-flex">
                            <div className="p10 col-lg-2 col-md-3 col-sm-12">
                              Expiry
                            </div>
                            <div className="col-lg-10 col-md-9 col-sm-12">
                              <TextField
                                id="expiryDate"
                                type="datetime-local"
                                defaultValue={currentTime}
                                className="react-datepicker-wrapper"
                                onChange={(e) => {
                                  setExpiryDate(e.target.value);
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row ad-row">
                  <div className="col-lg-4 col-md-4 col-sm-12 ad-label">
                    Photos
                  </div>
                  <div className="col-lg-8 col-md-8 col-sm-12 ">
                    <ImageUploader
                      withIcon={false}
                      onChange={onDrop}
                      imgExtension={[".jpg", ".gif", ".png", ".gif"]}
                      maxFileSize={5242880}
                      withPreview={true}
                      buttonText="Add a photo"
                      buttonClassName="bcgov-normal-blue btn"
                      withLabel={false}
                      className="ad-field bg-blue"
                    />
                  </div>
                </div>
                <div className="row ad-row">
                  <div className="col-lg-4 col-md-4 col-sm-12 ad-label">
                    Links
                  </div>
                  <div className="col-lg-8 col-md-8 col-sm-12">
                    <Input
                      input={{
                        ...linksInput,
                        styling: "bcgov-editable-white",
                      }}
                      onChange={(event) => {
                        setLinks(event);
                      }}
                    />
                  </div>
                </div>
                <div className="row ad-row">
                  <div className="col-lg-4 col-md-4 col-sm-12 ad-label">
                    Internal notes
                  </div>
                  <div className="col-lg-8 col-md-8 col-sm-12">
                    <Input
                      input={{
                        ...notesInput,
                        styling: "bcgov-editable-white",
                      }}
                      onChange={(event) => {
                        setNotes(event);
                      }}
                    />
                  </div>
                </div>
                {(isStatHoliday || isAfterHours) && (
                  <div className="ad-af-hour-box">
                    <div className="row ad-row">
                      <div className="col-lg-4 col-md-4 col-sm-12 ad-label">
                        <WarningIcon className="warningIcon" />
                      </div>
                      <div className="col-lg-8 col-md-8 col-sm-12">
                        <p>
                          <b>
                            This is an after-hours advisory. <br />
                            The web team business hours are Monday to Friday,
                            8:30AM–4:30PM
                          </b>
                        </p>
                      </div>
                    </div>
                    <div className="row ad-row">
                      <div className="col-lg-4 col-md-4 col-sm-12 ad-label">
                        <Radio
                          checked={isAfterHourPublish}
                          onChange={() => {
                            setIsAfterHourPublish(true);
                          }}
                          value="Publish"
                          name="after-hour-submission"
                          inputProps={{ "aria-label": "Publish immediately" }}
                        />
                      </div>
                      <div className="col-lg-8 col-md-8 col-sm-12">
                        <p>
                          Advisory is urgent/safety-related. Publish
                          immediately.
                        </p>
                      </div>
                    </div>
                    <div className="row ad-row">
                      <div className="col-lg-4 col-md-4 col-sm-12 ad-label">
                        <Radio
                          checked={!isAfterHourPublish}
                          onChange={() => {
                            setIsAfterHourPublish(false);
                          }}
                          value="Review"
                          name="after-hour-submission"
                          inputProps={{
                            "aria-label": "Submit for web team review",
                          }}
                        />
                      </div>
                      <div className="col-lg-8 col-md-8 col-sm-12">
                        <p>
                          Advisory is not urgent. Submit for web team review.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                <br />
                <div className="row ad-row">
                  <div className="col-lg-3 col-md-4"></div>
                  <div className="col-lg-8 col-md-8 col-sm-12 button-row ad-row ad-btn-group">
                    <Button
                      label="Submit"
                      styling="bcgov-normal-yellow btn"
                      onClick={() => {
                        saveAdvisory("submit");
                      }}
                    />
                    <Button
                      label="Save Draft"
                      styling="bcgov-normal-light btn"
                      onClick={() => {
                        saveAdvisory("draft");
                      }}
                    />
                    <Button
                      label="Cancel"
                      styling="bcgov-normal-light btn"
                      onClick={() => {
                        sessionStorage.clear();
                        setToDashboard(true);
                      }}
                    />
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
        <br />
      </div>
    </main>
  );
}

CreateAdvisory.propTypes = {
  page: PropTypes.shape({
    setError: PropTypes.func.isRequired,
  }).isRequired,
};
