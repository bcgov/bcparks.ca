import React, { useState, useEffect } from "react";
import { cmsAxios, apiAxios } from "../../../axios_config";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import "./CreateAdvisory.css";
import { Button } from "shared-components/build/components/button/Button";
import { Input } from "shared-components/build/components/input/Input";
import { Dropdown } from "shared-components/build/components/dropdown/Dropdown";
import { TextField, ButtonGroup } from "@material-ui/core";
import Header from "../../composite/header/Header";
import ImageUploader from "react-images-upload";
import Select from "react-select";
import { useKeycloak } from "@react-keycloak/web";

export default function CreateAdvisory({ page: { setError } }) {
  const [protectedAreaNames, setProtectedAreaNames] = useState([]);
  const [eventTypes, setEventTypes] = useState([]);
  const [urgencies, setUrgencies] = useState([]);
  const [toError, setToError] = useState(false);
  const [toHome, setToHome] = useState(false);
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
  const { keycloak } = useKeycloak();

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

  useEffect(() => {
    if (!keycloak.authenticated) {
      setToError(true);
      setError({
        status: 401,
        message: "Login required",
      });
    } else {
      Promise.all([
        cmsAxios.get(`/protectedAreas?_limit=-1&_sort=ProtectedAreaName`),
        cmsAxios.get(`/event-types?_limit=-1&_sort=EventType`),
        cmsAxios.get(`/urgencies?_limit=-1&_sort=id`),
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
          setUrgency(1);
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
    setEventTypes,
    setUrgency,
    setToError,
    setError,
    setToHome,
    keycloak,
  ]);

  const onDrop = (picture) => {
    setPictures([...pictures, picture]);
  };

  const saveAdvisory = () => {
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
      cmsAxios.get(`/advisory-statuses/5`),
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
            setToHome(true);
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

  if (toHome) {
    return <Redirect to="/bcparks" />;
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
                <div className="col-lg-12 col-md-12 col-sm-12">
                  <hr />
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
              <br />
              <div className="row ad-row">
                <div className="col-lg-3 col-md-4"></div>
                <div className="col-lg-8 col-md-8 col-sm-12 button-row ad-row ad-btn-group">
                  <Button
                    label="Submit"
                    styling="bcgov-normal-yellow btn"
                    onClick={() => {
                      saveAdvisory();
                    }}
                  />
                  <Button
                    label="Cancel"
                    styling="bcgov-normal-white btn"
                    onClick={() => {
                      sessionStorage.clear();
                      setToHome(true);
                    }}
                  />
                </div>
              </div>
            </div>
          </form>
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
