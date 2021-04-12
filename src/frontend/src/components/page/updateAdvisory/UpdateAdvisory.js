import React, { useState, useEffect } from "react";
import axios from "axios";
import { Redirect, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import "./UpdateAdvisory.css";
import { Header } from "shared-components/build/components/header/Header";
import { Button } from "shared-components/build/components/button/Button";
import { Input } from "shared-components/build/components/input/Input";
import { Dropdown } from "shared-components/build/components/dropdown/Dropdown";
import { TextField, ButtonGroup } from "@material-ui/core";
import ImageUploader from "react-images-upload";
import Select from "react-select";
import Loading from "../../composite/loading/Loading";

export default function UpdateAdvisory({ page: { header, setError } }) {
  const [isLoading, setIsLoading] = useState(true);
  const [toError, setToError] = useState(false);
  const [toAdvisoryDashboard, setToAdvisoryDashboard] = useState(false);
  const [headline, setHeadline] = useState();
  const [protectedAreaNames, setProtectedAreaNames] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [eventTypes, setEventTypes] = useState([]);
  const [urgencies, setUrgencies] = useState([]);
  const [advisoryStatuses, setAdvisoryStatuses] = useState([]);
  const [eventType, setEventType] = useState(0);
  const [description, setDescription] = useState();
  const [locations, setLocations] = useState([]);
  const [urgency, setUrgency] = useState(0);
  const [advisoryStatus, setAdvisoryStatus] = useState(0);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [expiryDate, setExpiryDate] = useState(new Date());
  const [pictures, setPictures] = useState([]);
  const [links, setLinks] = useState();
  const [notes, setNotes] = useState();

  const { id } = useParams();

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
  const advisoryStatusInput = {
    label: "",
    id: "notes",
    isReadOnly: true,
    isRequired: false,
  };

  const interval = ["Two", "Three", "Four", "Five"];
  const intervalUnit = ["Hours", "Days", "Weeks", "Months"];

  useEffect(() => {
    Promise.all([
      axios.get(`/protectedAreas?_limit=-1&_sort=ProtectedAreaName`),
      axios.get(`/event-types?_limit=-1&_sort=EventType`),
      axios.get(`/urgencies?_limit=-1&_sort=id`),
      axios.get(`/advisory-statuses?_limit=-1&_sort=AdvisoryStatus`),
      axios.get(`/public-advisories/${id}`),
    ]).then((res) => {
      setIsLoading(false);
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

      const advisoryStatusData = res[3].data;
      const advisoryStatuses = advisoryStatusData.map((u) => ({
        label: u.AdvisoryStatus,
        value: u.id,
      }));
      setAdvisoryStatuses([...advisoryStatuses]);

      const publicAdvisoryData = res[4].data;
      console.log(publicAdvisoryData);

      setHeadline(publicAdvisoryData.Title);
      setDescription(publicAdvisoryData.Description);
      if (publicAdvisoryData.event_type)
        setEventType(publicAdvisoryData.event_type.id);

      if (publicAdvisoryData.urgency) setUrgency(publicAdvisoryData.urgency.id);

      if (publicAdvisoryData.advisory_status)
        setAdvisoryStatus(publicAdvisoryData.advisory_status.id);

      if (publicAdvisoryData.AdvisoryDate)
        setStartDate(publicAdvisoryData.AdvisoryDate.substring(0, 16));

      if (publicAdvisoryData.EndDate)
        setEndDate(publicAdvisoryData.EndDate.substring(0, 16));

      if (publicAdvisoryData.ExpiryDate)
        setExpiryDate(publicAdvisoryData.ExpiryDate.substring(0, 16));

      const locations = publicAdvisoryData.protected_areas.map((p) => p.ORCS);
      setLocations([...locations]);

      const selectedLocations = publicAdvisoryData.protected_areas.map((p) => ({
        label: p.ProtectedAreaName,
        value: p.ORCS,
      }));

      setSelectedLocations(selectedLocations);
    });
  }, [
    id,
    setHeadline,
    setProtectedAreaNames,
    setSelectedLocations,
    setUrgencies,
    setEventTypes,
    setUrgency,
    setEventType,
    setStartDate,
    setEndDate,
    setExpiryDate,
    setNotes,
    setLinks,
    setAdvisoryStatus,
    setToError,
    setError,
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
    console.log(protectedAreaQuery);
    Promise.all([
      axios.get(`/event-types/${eventType}`),
      axios.get(`/urgencies/${urgency}`),
      axios.get(`/advisory-statuses/${advisoryStatus}`),
      axios.get(`/protectedAreas?${protectedAreaQuery}`),
    ])
      .then((res) => {
        const publicAdvisory = {
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
        axios
          .put(`/public-advisories/${id}`, publicAdvisory)
          .then(() => {
            setToAdvisoryDashboard(true);
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

  if (toAdvisoryDashboard) {
    return <Redirect to="/bcparks/advisory-dash" />;
  }

  if (toError) {
    return <Redirect to="/bcparks/error" />;
  }

  return (
    <main>
      <Header header={header} />
      <br />
      <div className="container-fluid">
        <h3 className="text-center">Update Advisory</h3>
      </div>
      {isLoading && <Loading />}
      {!isLoading && (
        <div className="UpdateAdvisory" data-testid="UpdateAdvisory">
          <div className="container">
            <hr />
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
                        value: headline,
                      }}
                      onChange={(e) => {
                        setHeadline(e);
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
                      value={eventTypes.filter((o) => o.value === eventType)}
                      onChange={(e) => {
                        setEventType(e.value);
                      }}
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
                      onChange={(e) => {
                        setDescription(e.target.value);
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
                      value={selectedLocations}
                      onChange={(e) => {
                        setLocations(e.map((o) => o.value));
                        setSelectedLocations(e);
                        console.log(locations);
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
                                value={startDate}
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
                                value={endDate}
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
                                value={expiryDate}
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
                        value: links,
                      }}
                      onChange={(e) => {
                        setLinks(e);
                      }}
                    />
                  </div>
                </div>
                <div className="row ad-row">
                  <div className="col-lg-4 col-md-4 col-sm-12 ad-label">
                    Advisory Status
                  </div>
                  <div className="col-lg-8 col-md-8 col-sm-12">
                    <Select
                      options={advisoryStatuses}
                      value={advisoryStatuses.filter(
                        (o) => o.value === advisoryStatus
                      )}
                      onChange={(e) => {
                        setAdvisoryStatus(e.value);
                      }}
                      placeholder="Select an Advisory Status"
                      className="bg-blue f-select"
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
                      onChange={(e) => {
                        setNotes(e);
                      }}
                    />
                  </div>
                </div>
                <br />
                <div className="row ad-row">
                  <div className="col-lg-3 col-md-4"></div>
                  <div className="col-lg-8 col-md-8 col-sm-12 button-row ad-row ad-btn-group">
                    <Button
                      label="Save"
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
                        setToAdvisoryDashboard(true);
                      }}
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
          <br />
        </div>
      )}
    </main>
  );
}

UpdateAdvisory.propTypes = {
  page: PropTypes.shape({
    setError: PropTypes.func.isRequired,
    header: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};
