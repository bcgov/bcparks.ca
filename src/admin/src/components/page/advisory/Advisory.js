import React, { useState, useRef, useEffect } from "react";
import { cmsAxios, apiAxios, axios } from "../../../axios_config";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import "./Advisory.css";
import { Button } from "shared-components/build/components/button/Button";
import { Input } from "shared-components/build/components/input/Input";
import {
  ButtonGroup,
  Radio,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";

import {
  KeyboardDateTimePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import Header from "../../composite/header/Header";
import ImageUploader from "react-images-upload";
import Select from "react-select";
import moment from "moment";
import "moment-timezone";
import { useKeycloak } from "@react-keycloak/web";
import { Loader } from "shared-components/build/components/loader/Loader";
import WarningIcon from "@material-ui/icons/Warning";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import CloseIcon from "@material-ui/icons/Close";
import AddIcon from "@material-ui/icons/Add";
import VisibilityToggle from "../../base/visibilityToggle/VisibilityToggle";

export default function Advisory({ mode, page: { setError } }) {
  const [protectedAreas, setProtectedAreas] = useState([]);
  const [regions, setRegions] = useState([]);
  const [sections, setSections] = useState([]);
  const [managementAreas, setManagementAreas] = useState([]);
  const [locations, setLocations] = useState([]);
  const [eventTypes, setEventTypes] = useState([]);
  const [eventType, setEventType] = useState({});
  const [accessStatuses, setAccessStatuses] = useState();
  const [accessStatus, setAccessStatus] = useState({});
  const [urgencies, setUrgencies] = useState([]);
  const [urgency, setUrgency] = useState({});
  const [advisoryStatuses, setAdvisoryStatuses] = useState([]);
  const [advisoryStatus, setAdvisoryStatus] = useState({});
  const [linkTypes, setLinkTypes] = useState();
  const [links, setLinks] = useState([]);
  const [ticketNumber, setTicketNumber] = useState();
  const [headline, setHeadline] = useState();
  const [description, setDescription] = useState();
  const [isSafetyRelated, setIsSafetyRelated] = useState(false);
  const [isReservationAffected, setIsReservationAffected] = useState(false);
  const [advisoryDate, setAdvisoryDate] = useState(
    moment().tz("America/Vancouver")
  );
  const [displayAdvisoryDate, setDisplayAdvisoryDate] = useState(false);
  const [startDate, setStartDate] = useState(moment().tz("America/Vancouver"));
  const [displayStartDate, setDisplayStartDate] = useState(false);
  const [endDate, setEndDate] = useState(moment().tz("America/Vancouver"));
  const [displayEndDate, setDisplayEndDate] = useState(false);
  const [expiryDate, setExpiryDate] = useState(
    moment().tz("America/Vancouver")
  );
  const [displayUpdatedDate, setDisplayUpdatedDate] = useState(false);
  const [pictures, setPictures] = useState([]);
  const [notes, setNotes] = useState();
  const [toError, setToError] = useState(false);
  const [toDashboard, setToDashboard] = useState(false);
  const { keycloak, initialized } = useKeycloak();
  const [isLoading, setIsLoading] = useState(true);
  const [isStatHoliday, setIsStatHoliday] = useState(false);
  const [isAfterHours, setIsAfterHours] = useState(false);
  const [isAfterHourPublish, setIsAfterHourPublish] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [confirmationText, setConfirmationText] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const [savedLinks, setSavedLinks] = useState([]);
  const linksRef = useRef([]);
  const durationUnitRef = useRef("h");
  const durationIntervalRef = useRef(0);
  const advisoryDateRef = useRef(moment().tz("America/Vancouver"));

  const headlineInput = {
    label: "",
    id: "headline",
    isReadOnly: false,
    isRequired: false,
    placeholder: "Advisory Headline",
  };
  const linkTitleInput = {
    label: "",
    id: "link",
    isReadOnly: false,
    isRequired: false,
    placeholder: "Link Title",
  };
  const linkUrlInput = {
    label: "",
    id: "url",
    isReadOnly: false,
    isRequired: false,
    placeholder: "URL",
  };
  const notesInput = {
    label: "",
    id: "notes",
    isReadOnly: false,
    isRequired: false,
    placeholder: "Notes",
  };

  const ticketNumberInput = {
    label: "",
    id: "ticketNumber",
    isReadOnly: false,
    isRequired: false,
    placeholder: "Discover Camping Ticket Number",
  };

  const intervals = [
    { label: "Two", value: 2 },
    { label: "Three", value: 3 },
    { label: "Four", value: 4 },
    { label: "Five", value: 5 },
  ];

  // Moment Intervals ref: https://momentjscom.readthedocs.io/en/latest/moment/03-manipulating/01-add/
  const intervalUnits = [
    { label: "Hours", value: "h" },
    { label: "Days", value: "d" },
    { label: "Weeks", value: "w" },
    { label: "Months", value: "M" },
  ];

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
        cmsAxios.get(`/access-statuses?_limit=-1&_sort=AccessStatus`),
        cmsAxios.get(`/urgencies?_limit=-1&_sort=Sequence`),
        cmsAxios.get(`/business-hours`),
        cmsAxios.get(`/advisory-statuses?_limit=-1&_sort=Code`),
        cmsAxios.get(`/link-types?_limit=-1&_sort=id`),
      ])
        .then((res) => {
          const protectedAreaData = res[0].data;
          const protectedAreas = protectedAreaData.map((p) => ({
            label: p.ProtectedAreaName,
            value: p.ORCS,
            obj: p,
          }));
          setProtectedAreas([...protectedAreas]);
          const eventTypeData = res[1].data;
          const eventTypes = eventTypeData.map((et) => ({
            label: et.EventType,
            value: et.id,
            obj: et,
          }));
          setEventTypes([...eventTypes]);
          const accessStatusData = res[2].data;
          const accessStatuses = accessStatusData.map((a) => ({
            label: a.AccessStatus,
            value: a.id,
            obj: a,
          }));
          setAccessStatuses([...accessStatuses]);
          const urgencyData = res[3].data;
          const urgencies = urgencyData.map((u) => ({
            label: u.Urgency,
            value: u.id,
            obj: u,
          }));
          setUrgencies([...urgencies]);
          setUrgency(urgencyData[0]);
          setIsAfterHours(calculateAfterHours(res[4].data));

          const advisoryStatusData = res[5].data;
          const advisoryStatuses = advisoryStatusData.map((s) => ({
            code: s.Code,
            label: s.AdvisoryStatus,
            value: s.id,
            obj: s,
          }));
          setAdvisoryStatuses([...advisoryStatuses]);
          const linkTypeData = res[6].data;
          const linkTypes = linkTypeData.map((lt) => ({
            label: lt.Type,
            value: lt.id,
            obj: lt,
          }));
          setLinkTypes([...linkTypes]);
          linksRef.current = [{ type: "", title: "", url: "" }];
          setLinks(linksRef.current);
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
    setProtectedAreas,
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
    setLinks,
  ]);

  const closeConfirmation = () => {
    setIsConfirmationOpen(false);
    setToDashboard(true);
  };

  const onDrop = (picture) => {
    setPictures([...pictures, picture]);
  };

  const handleDurationIntervalChange = (e) => {
    durationIntervalRef.current = e.value;
    calculateExpiryDate();
  };

  const handleDurationUnitChange = (e) => {
    durationUnitRef.current = e.value;
    calculateExpiryDate();
  };

  const handleAdvisoryDateChange = (e) => {
    setAdvisoryDate(e);
    advisoryDateRef.current = e;
    if (durationIntervalRef.current > 0) {
      calculateExpiryDate();
    }
  };

  const addLink = () => {
    linksRef.current = [...linksRef.current, { type: "", title: "", url: "" }];
    setLinks(linksRef.current);
  };

  const updateLink = (index, field, value) => {
    const tempLinks = [...linksRef.current];
    tempLinks[index][field] = value;
    linksRef.current = [...tempLinks];
    setLinks(linksRef.current);
  };

  const removeLink = (index) => {
    let tempLinks = linksRef.current.filter((link, idx) => idx !== index);
    linksRef.current = [...tempLinks];
    setLinks(linksRef.current);
  };

  const calculateExpiryDate = () => {
    setExpiryDate(
      moment(advisoryDateRef.current).add(
        durationIntervalRef.current,
        durationUnitRef.current
      )
    );
  };

  const getAdvisoryFields = (type) => {
    let status = {};
    let confirmationText = "";
    let published = null;
    if (type === "submit") {
      status = advisoryStatuses.filter((s) => s.code === "ARQ");
      confirmationText = "Your advisory has been sent for review successfully!";
    } else if (type === "draft") {
      status = advisoryStatuses.filter((s) => s.code === "DFT");
      confirmationText = "Your advisory has been saved successfully!";
    } else if (type === "publish") {
      status = advisoryStatuses.filter((s) => s.code === "PUB");
      confirmationText = "Your advisory has been published successfully!";
      published = moment().tz("America/Vancouver");
    }
    return {
      advisoryStatus: status[0]["obj"],
      confirmationText: confirmationText,
      published: published,
    };
  };

  const isValidLink = (link) => {
    if (link.title !== "" && link.url !== "") {
      return true;
    }
    return false;
  };

  const saveLink = async (link) => {
    const linkRequest = {
      Title: link.title,
      URL: link.url,
      Type: link.type,
    };
    const res = await apiAxios
      .post(`api/add/links`, linkRequest, {
        headers: { Authorization: `Bearer ${keycloak.idToken}` },
      })
      .catch((error) => {
        console.log("error occurred", error);
      });
    return res.data;
  };

  const saveLinks = async () => {
    const savedLinks = [];
    for (let link of links) {
      if (isValidLink(link)) {
        const savedLink = await saveLink(link);
        savedLinks.push(savedLink);
      }
    }
    return savedLinks;
  };

  const saveAdvisory = (type) => {
    if (type === "draft") {
      setIsSavingDraft(true);
    } else if (type === "submit") {
      setIsSubmitting(true);
      if (isAfterHourPublish) type = "publish";
    }
    const { advisoryStatus, confirmationText, published } = getAdvisoryFields(
      type
    );
    setConfirmationText(confirmationText);
    Promise.resolve(saveLinks()).then((savedLinks) => {
      const newAdvisory = {
        Title: headline,
        Description: description,
        DCTicketNumber: parseInt(ticketNumber),
        Alert: isSafetyRelated,
        Approved: false,
        Note: notes,
        SubmittedBy: keycloak.tokenParsed.name,
        CreatedDate: moment().toISOString(),
        CreatedBy: keycloak.tokenParsed.name,
        AdvisoryDate: advisoryDate,
        EffectiveDate: startDate,
        EndDate: endDate,
        ExpiryDate: expiryDate,
        access_status: accessStatus,
        event_type: eventType,
        urgency: urgency,
        protected_areas: locations,
        advisory_status: advisoryStatus,
        links: savedLinks,
        regions: [],
        section: [],
        management_area: [],
        fire_zones: [],
        ReservationsAffected: isReservationAffected,
        published_at: published,
      };

      apiAxios
        .post(`api/add/public-advisories`, newAdvisory, {
          headers: { Authorization: `Bearer ${keycloak.idToken}` },
        })
        .then(() => {
          setIsConfirmationOpen(true);
          setIsSubmitting(false);
          setIsSavingDraft(false);
        })
        .catch((error) => {
          console.log("error occurred", error);
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
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <main>
        <Header
          header={{
            name: "",
          }}
        />
        <br />
        <div className="Advisory" data-testid="Advisory">
          <div className="container">
            {isLoading && (
              <div className="page-loader">
                <Loader page />
              </div>
            )}
            {!isLoading && (
              <form>
                <div className="container-fluid ad-form">
                  <div className="row">
                    <div className="col-lg-4 col-md-4 col-sm-12 ad-label">
                      DC Ticket Number
                    </div>
                    <div className="col-lg-7 col-md-8 col-sm-12">
                      <Input
                        input={{
                          ...ticketNumberInput,
                          styling: "bcgov-editable-white",
                        }}
                        onChange={(event) => {
                          setTicketNumber(event);
                        }}
                      />
                    </div>
                  </div>
                  <div className="row">
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
                  <div className="row">
                    <div className="col-lg-4 col-md-4 col-sm-12 ad-label">
                      Event type
                    </div>
                    <div className="col-lg-7 col-md-8 col-sm-12">
                      <Select
                        options={eventTypes}
                        onChange={(e) => setEventType(e.obj)}
                        placeholder="Select an event type"
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-4 col-md-4 col-sm-12 ad-label">
                      Access Status
                    </div>
                    <div className="col-lg-7 col-md-8 col-sm-12">
                      <Select
                        options={accessStatuses}
                        onChange={(e) => setAccessStatus(e.obj)}
                        placeholder="Select an access status"
                      />
                    </div>
                  </div>
                  <div className="row">
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
                  <div className="row">
                    <div className="col-lg-4 col-md-4 col-sm-12 ad-label">
                      Location
                    </div>
                    <div className="col-lg-7 col-md-8 col-sm-12">
                      <Select
                        options={protectedAreas}
                        onChange={(e) => {
                          setLocations(e.map((o) => o.obj));
                        }}
                        placeholder="Select a Park"
                        isMulti="true"
                      />
                    </div>
                  </div>
                  <div className="row">
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
                              urgency === u.obj
                                ? "bcgov-normal-blue btn"
                                : "bcgov-normal-white btn"
                            }
                            onClick={() => {
                              setUrgency(u.obj);
                            }}
                          />
                        ))}
                      </ButtonGroup>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-4 col-md-4 col-sm-12 ad-label">
                      Safety related
                    </div>
                    <div className="col-lg-8 col-md-8 col-sm-12">
                      <Checkbox
                        checked={isSafetyRelated}
                        onChange={(e) => {
                          setIsSafetyRelated(e.target.checked);
                        }}
                        inputProps={{ "aria-label": "safety related" }}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-4 col-md-4 col-sm-12 ad-label">
                      Reservation affected
                    </div>
                    <div className="col-lg-8 col-md-8 col-sm-12">
                      <Checkbox
                        checked={isReservationAffected}
                        onChange={(e) => {
                          setIsReservationAffected(e.target.checked);
                        }}
                        inputProps={{
                          "aria-label": "Discover camping affected",
                        }}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-4 col-md-4 col-sm-12 ad-label">
                      Effective date
                    </div>
                    <div className="col-lg-8 col-md-8 col-sm-12">
                      <div className="field-bg-blue">
                        <div className="ad-field ad-flex-wrap ad-flex">
                          <div className="col-lg-8 col-md-12 col-sm-12">
                            <div className="row">
                              <div className="col-lg-12 col-md-12 col-sm-12 plr0">
                                <div className="ad-flex">
                                  <div className="p10 col-lg-3 col-md-3 col-sm-12 ad-date-label">
                                    Advisory date
                                  </div>
                                  <div className="col-lg-9 col-md-9 col-sm-12 ad-flex-date">
                                    <KeyboardDateTimePicker
                                      id="advisoryDate"
                                      value={advisoryDate}
                                      onChange={handleAdvisoryDateChange}
                                      format="MMMM DD, yyyy hh:mm A"
                                      className="react-datepicker-wrapper"
                                    />
                                    <VisibilityToggle
                                      toggle={{
                                        toggleState: displayAdvisoryDate,
                                        setToggleState: setDisplayAdvisoryDate,
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-lg-12 col-md-12 col-sm-12 plr0">
                                <div className="ad-flex">
                                  <div className="p10 col-lg-3 col-md-3 col-sm-12 ad-date-label">
                                    Start date
                                  </div>
                                  <div className="col-lg-9 col-md-9 col-sm-12 ad-flex-date">
                                    <KeyboardDateTimePicker
                                      id="startDate"
                                      value={startDate}
                                      onChange={setStartDate}
                                      format="MMMM DD, yyyy hh:mm A"
                                      className="react-datepicker-wrapper"
                                    />
                                    <VisibilityToggle
                                      toggle={{
                                        toggleState: displayStartDate,
                                        setToggleState: setDisplayStartDate,
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-lg-12 col-md-12 col-sm-12 plr0">
                                <div className="ad-flex">
                                  <div className="p10 col-lg-3 col-md-3 col-sm-12 ad-date-label">
                                    End date
                                  </div>
                                  <div className="col-lg-9 col-md-9 col-sm-12 ad-flex-date">
                                    <KeyboardDateTimePicker
                                      id="endDate"
                                      value={endDate}
                                      onChange={setEndDate}
                                      format="MMMM DD, yyyy hh:mm A"
                                      className="react-datepicker-wrapper"
                                    />
                                    <VisibilityToggle
                                      toggle={{
                                        toggleState: displayEndDate,
                                        setToggleState: setDisplayEndDate,
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-lg-12 col-md-12 col-sm-12 plr0">
                                <div className="ad-flex">
                                  <div className="p10 col-lg-3 col-md-3 col-sm-12 ad-date-label">
                                    Expiry date
                                  </div>
                                  <div className="col-lg-9 col-md-9 col-sm-12 ad-flex-date">
                                    <KeyboardDateTimePicker
                                      id="expiryDate"
                                      value={expiryDate}
                                      onChange={setExpiryDate}
                                      format="MMMM DD, yyyy hh:mm A"
                                      className="react-datepicker-wrapper mr40"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-4 col-md-12 col-sm-12 plr0 ad-auto-margin">
                            <div className="ad-flex">
                              <div className="p10 col-lg-4 col-md-3 col-sm-12 ad-date-label">
                                Duration
                              </div>
                              <div className="p10 ml15 col-lg-8 col-md-6 col-sm-8 ptm3 ad-interval-box">
                                <Select
                                  options={intervals}
                                  onChange={handleDurationIntervalChange}
                                  placeholder="Select"
                                  className="pbm3 ad-interval-select"
                                />
                                <Select
                                  options={intervalUnits}
                                  onChange={handleDurationUnitChange}
                                  placeholder="Select"
                                  className="ad-interval-select"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
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
                  <div className="row ">
                    <div className="col-lg-4 col-md-4 col-sm-12 ad-label">
                      Links
                    </div>
                    <div className="col-lg-7 col-md-8 col-sm-12">
                      {linksRef.current.map((l, idx) => (
                        <div key={idx}>
                          <div className="ad-link-flex">
                            <Select
                              options={linkTypes}
                              onChange={(e) => {
                                updateLink(idx, "type", e.obj);
                              }}
                              value={linkTypes.filter((o) => o.obj === l.type)}
                              className="ad-link-select"
                              placeholder="Select a link type"
                            />
                            <div className="ad-link-close ad-add-link">
                              <CloseIcon
                                className="pointer"
                                onClick={() => {
                                  removeLink(idx);
                                }}
                              />
                            </div>
                          </div>
                          <div className="ad-link-group">
                            <Input
                              input={{
                                ...linkTitleInput,
                                styling: "bcgov-editable-white",
                                value: l.title,
                              }}
                              onChange={(e) => {
                                updateLink(idx, "title", e);
                              }}
                            />
                            <Input
                              input={{
                                ...linkUrlInput,
                                styling: "bcgov-editable-white",
                                value: l.url,
                              }}
                              onChange={(e) => {
                                updateLink(idx, "url", e);
                              }}
                            />
                          </div>
                        </div>
                      ))}
                      <div
                        className="ad-add-link pointer"
                        onClick={() => {
                          addLink();
                        }}
                      >
                        <AddIcon />
                      </div>
                    </div>
                  </div>
                  <div className="row">
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
                  {mode === "update" && (
                    <div className="row">
                      <div className="col-lg-4 col-md-4 col-sm-12 ad-label">
                        Advisory status
                      </div>
                      <div className="col-lg-7 col-md-8 col-sm-12">
                        <Select
                          options={advisoryStatuses}
                          onChange={(e) => setAdvisoryStatus(e.obj)}
                          placeholder="Select an advisory status"
                        />
                      </div>
                    </div>
                  )}
                  {(isStatHoliday || isAfterHours) && (
                    <div className="ad-af-hour-box">
                      <div className="row">
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
                      <div className="row">
                        <div className="col-lg-3 col-md-4 col-sm-12 ad-label">
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
                        <div className="col-lg-9 col-md-8 col-sm-12">
                          <p>
                            Advisory is urgent/safety-related. Publish
                            immediately.
                          </p>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-3 col-md-4 col-sm-12 ad-label">
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
                        <div className="col-lg-9 col-md-8 col-sm-12">
                          <p>
                            Advisory is not urgent. Submit for web team review.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  <br />
                  <div className="row">
                    <div className="col-lg-4 col-md-4"></div>
                    <div className="col-lg-8 col-md-8 col-sm-12 button-row ad-btn-group">
                      <Button
                        label="Submit"
                        styling="bcgov-normal-yellow btn"
                        onClick={() => {
                          saveAdvisory("submit");
                        }}
                        hasLoader={isSubmitting}
                      />
                      <Button
                        label="Save Draft"
                        styling="bcgov-normal-light btn"
                        onClick={() => {
                          saveAdvisory("draft");
                        }}
                        hasLoader={isSavingDraft}
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
                <Dialog
                  open={isConfirmationOpen}
                  onClose={() => {
                    setIsConfirmationOpen(false);
                  }}
                  disableBackdropClick
                  disableEscapeKeyDown
                >
                  <DialogContent>
                    <DialogTitle id="ad-confirm-title">
                      <CloseIcon
                        className="pointer"
                        onClick={() => {
                          closeConfirmation();
                        }}
                      />
                    </DialogTitle>
                    <DialogContentText id="ad-confirm">
                      <CheckCircleOutlineIcon className="checkIcon" />
                      <br />
                      <span>
                        Thank you! <br />
                        {confirmationText}
                        <br />
                      </span>
                      The business hours for the web team is Mon - Fri 8.30 am
                      to 4.30 pm.
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions className="button-row ad-btn-row ad-btn-group">
                    <Button
                      label="Close"
                      styling="bcgov-normal-white btn"
                      onClick={() => {
                        closeConfirmation();
                      }}
                    />
                  </DialogActions>
                  <br />
                </Dialog>
              </form>
            )}
          </div>
          <br />
        </div>
      </main>
    </MuiPickersUtilsProvider>
  );
}

Advisory.propTypes = {
  mode: PropTypes.string.isRequired,
  page: PropTypes.shape({
    setError: PropTypes.func.isRequired,
  }).isRequired,
};
