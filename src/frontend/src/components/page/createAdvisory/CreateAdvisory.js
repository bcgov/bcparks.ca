import React, { useState, useEffect } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import "./CreateAdvisory.css";
import { Header } from "shared-components/build/components/header/Header";
import { Button } from "shared-components/build/components/button/Button";
import { Input } from "shared-components/build/components/input/Input";
import { Dropdown } from "shared-components/build/components/dropdown/Dropdown";
import { DatePick } from "shared-components/build/components/date-pick/DatePick";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import ImageUploader from "react-images-upload";

export default function CreateAdvisory({ page: { header, setError } }) {
  const [parkMap, setParkMap] = useState([]);
  const [parkNames, setParkNames] = useState([]);
  const [eventTypeMap, setEventTypeMap] = useState([]);
  const [eventTypes, setEventTypes] = useState([]);
  const [urgencyMap, setUrgencyMap] = useState([]);
  const [urgencies, setUrgencies] = useState([]);
  const [toError, setToError] = useState(false);
  const [toHome, setToHome] = useState(false);
  const [headline, setHeadline] = useState();
  const [eventType, setEventType] = useState();
  const [description, setDescription] = useState();
  const [location, setLocation] = useState();
  const [urgency, setUrgency] = useState();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [expiryDate, setExpiryDate] = useState(new Date());
  const [pictures, setPictures] = useState([]);
  const [links, setLinks] = useState();
  const [notes, setNotes] = useState();
  const [urgencyOption, setUrgencyOption] = useState();

  const headlineInput = {
    label: "",
    id: "headline",
    isReadOnly: false,
    isRequired: false,
  };
  const locationInput = {
    label: "",
    id: "location",
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

  useEffect(() => {
    Promise.all([
      axios.get(`/protectedAreas?_limit=-1`),
      axios.get(`/event-types?_limit=-1`),
      axios.get(`/urgencies?_limit=-1`),
    ])
      .then((res) => {
        const parkData = res[0].data;
        const parkMap = {};
        parkData.map((p) => {
          parkMap[p.ORCS.toString()] = p.ProtectedAreaName;
          return parkMap;
        });
        const parkNames = Object.values(parkMap);
        setParkNames(["Select a Park", ...parkNames]);
        setParkMap(parkMap);
        const eventTypeData = res[1].data;
        const eventTypeMap = {};
        eventTypeData.map((et) => {
          eventTypeMap[et.id.toString()] = et.EventType;
          return eventTypeMap;
        });
        const eventTypes = Object.values(eventTypeMap);
        setEventTypeMap(eventTypeMap);
        setEventTypes(["Select event type", ...eventTypes]);
        const urgencyData = res[2].data;
        const urgencyMap = {};
        urgencyData.map((u) => {
          urgencyMap[u.id.toString()] = u.Urgency;
          return urgencyMap;
        });
        const urgencies = Object.values(urgencyMap);
        setUrgencyMap(urgencyMap);
        setUrgencies([...urgencies]);
        setUrgencyOption(0);
      })
      .catch(() => {
        setToError(true);
        setError({
          status: 500,
          message: "Error occurred",
        });
      });
  }, [
    setParkNames,
    setParkMap,
    setUrgencies,
    setUrgencyMap,
    setEventTypes,
    setEventTypeMap,
    setToError,
    setUrgencyOption,
    setError,
  ]);

  const getKeyByValue = (object, value) => {
    return Object.keys(object).find((key) => object[key] === value);
  };

  const onDrop = (picture) => {
    setPictures([...pictures, picture]);
  };

  const saveAdvisory = () => {
    const eventKey = getKeyByValue(eventTypeMap, eventType);
    const protectedAreaKey = getKeyByValue(parkMap, location);
    const urgencyKey = getKeyByValue(urgencyMap, urgency);
    Promise.all([
      axios.get(`/protectedAreas/${protectedAreaKey}`),
      axios.get(`/event-types/${eventKey}`),
      axios.get(`/urgencies/${urgencyKey}`),
      axios.get(`/advisory-statuses/5`),
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
          event_type: res[1].data,
          urgency: res[2].data,
          advisory_status: res[3].data,
          protected_areas: [res[0].data],
        };
        axios
          .post(`/public-advisories`, newAdvisory)
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
      <Header header={header} />
      <br />
      <div className="CreateAdvisory" data-testid="CreateAdvisory">
        <div className="container">
          <form>
            <div className="container-fluid ad-form">
              <div className="row ad-row">
                <div className="col-lg-4 col-md-4 col-sm-12 ad-label">
                  Headline
                </div>
                <div className="col-lg-7 col-md-8 col-sm-12">
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
                <div className="col-lg-7 col-md-8 col-sm-12">
                  <Dropdown
                    items={eventTypes}
                    onSelect={(event) => {
                      setEventType(event);
                    }}
                  />
                </div>
              </div>
              <div className="row ad-row">
                <div className="col-lg-4 col-md-4 col-sm-12 ad-label">
                  Description
                </div>
                <div className="col-lg-7 col-md-8 col-sm-12">
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
                <div className="col-lg-7 col-md-8 col-sm-12">
                  <Dropdown
                    items={parkNames}
                    onSelect={(event) => {
                      setLocation(event);
                    }}
                  />
                </div>
              </div>
              <div className="row ad-row">
                <div className="col-lg-4 col-md-4 col-sm-12 ad-label">
                  Urgency level
                </div>
                <div className="col-lg-7 col-md-8 col-sm-12">
                  <ButtonGroup
                    className="ad-btn-group"
                    color="primary"
                    aria-label="outlined primary button group"
                  >
                    {urgencies.map((name, index) => (
                      <Button
                        key={name}
                        label={name}
                        styling={
                          urgencyOption === index
                            ? "bcgov-normal-blue btn"
                            : "bcgov-normal-white btn"
                        }
                        onClick={() => {
                          setUrgencyOption(index);
                          setUrgency(name);
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
                <div className="col-lg-7 col-md-8 col-sm-12">
                  <div className="ad-field">
                    <div className="row ad-row ">
                      <div className="col-lg-6 col-md-12 col-sm-12">
                        <div className="ad-flex">
                          <div className="p10 col-lg-2 col-md-3 col-sm-12">
                            Start
                          </div>
                          <div className="col-lg-9 col-md-9 col-sm-12">
                            <DatePick
                              isRequired
                              selectedDate={startDate}
                              setSelectedDate={setStartDate}
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
                      <div className="col-lg-6 col-md-12 col-sm-12">
                        <div className="ad-flex">
                          <div className="p10 col-lg-2 col-md-3 col-sm-12">
                            End
                          </div>
                          <div className="col-lg-9 col-md-9 col-sm-12">
                            <DatePick
                              isRequired
                              selectedDate={endDate}
                              setSelectedDate={setEndDate}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-12 col-sm-12 ptm3">
                        <div className="ad-flex">
                          <div className="p10 col-lg-2 col-md-3 col-sm-12">
                            Expiry
                          </div>
                          <div className="col-lg-9 col-md-9 col-sm-12">
                            <DatePick
                              isRequired
                              selectedDate={expiryDate}
                              setSelectedDate={setExpiryDate}
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
                <div className="col-lg-7 col-md-8 col-sm-12 ">
                  <ImageUploader
                    withIcon={false}
                    onChange={onDrop}
                    imgExtension={[".jpg", ".gif", ".png", ".gif"]}
                    maxFileSize={5242880}
                    withPreview={true}
                    buttonText="Add a photo"
                    buttonClassName="bcgov-normal-blue btn"
                    withLabel={false}
                    className="ad-field"
                  />
                </div>
              </div>
              <div className="row ad-row">
                <div className="col-lg-4 col-md-4 col-sm-12 ad-label">
                  Links
                </div>
                <div className="col-lg-7 col-md-8 col-sm-12">
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
                <div className="col-lg-7 col-md-8 col-sm-12">
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
    header: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};
