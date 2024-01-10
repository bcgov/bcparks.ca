import React, { useState } from "react";
import PropTypes from "prop-types";
import "./AdvisoryForm.css";
import { Button } from "../../shared/button/Button";
import {
  TextField,
  ButtonGroup,
  Radio,
  Checkbox,
  FormControl,
  FormHelperText,
  Button as Btn
} from "@material-ui/core";
import MomentUtils from "@date-io/moment";
import {
  TimePicker,
  KeyboardDateTimePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import Select from "react-select";
import WarningIcon from "@material-ui/icons/Warning";
import CloseIcon from "@material-ui/icons/Close";
import HelpIcon from "@material-ui/icons/Help";
import CheckIcon from "@material-ui/icons/Check";
import VisibilityToggle from "../../base/visibilityToggle/VisibilityToggle";
import {
  validateOptionalNumber,
  validateRequiredText,
  validateRequiredSelect,
  validateRequiredDate,
  validateOptionalDate,
  validAdvisoryData,
} from "../../../validators/AdvisoryValidator";

import PrivateElement from "../../../auth/PrivateElement";
import LightTooltip from "../../shared/tooltip/LightTooltip";
import AdvisoryAreaPicker from "../advisoryAreaPicker/AdvisoryAreaPicker";

export default function AdvisoryForm({
  mode,
  data: {
    ticketNumber,
    setTicketNumber,
    listingRank,
    setListingRank,
    headline,
    setHeadline,
    eventType,
    eventTypes,
    setEventType,
    accessStatus,
    accessStatuses,
    setAccessStatus,
    description,
    setDescription,
    standardMessages,
    selectedStandardMessages,
    setSelectedStandardMessages,
    protectedAreas,
    selectedProtectedAreas,
    setSelectedProtectedAreas,
    regions,
    selectedRegions,
    setSelectedRegions,
    sections,
    selectedSections,
    setSelectedSections,
    managementAreas,
    selectedManagementAreas,
    setSelectedManagementAreas,
    sites,
    selectedSites,
    setSelectedSites,
    fireCentres,
    selectedFireCentres,
    setSelectedFireCentres,
    fireZones,
    selectedFireZones,
    setSelectedFireZones,
    urgencies,
    urgency,
    setUrgency,
    isSafetyRelated,
    setIsSafetyRelated,
    isReservationAffected,
    setIsReservationAffected,
    advisoryDate,
    handleAdvisoryDateChange,
    displayAdvisoryDate,
    setDisplayAdvisoryDate,
    startDate,
    setStartDate,
    displayStartDate,
    setDisplayStartDate,
    endDate,
    setEndDate,
    displayEndDate,
    setDisplayEndDate,
    updatedDate,
    setUpdatedDate,
    displayUpdatedDate,
    setDisplayUpdatedDate,
    expiryDate,
    setExpiryDate,
    handleDurationIntervalChange,
    handleDurationUnitChange,
    linksRef,
    linkTypes,
    removeLink,
    updateLink,
    addLink,
    handleFileCapture,
    notes,
    setNotes,
    submittedBy,
    setSubmittedBy,
    advisoryStatuses,
    advisoryStatus,
    setAdvisoryStatus,
    isStatHoliday,
    isAfterHours,
    isAfterHourPublish,
    setIsAfterHourPublish,
    saveAdvisory,
    isSubmitting,
    isSavingDraft,
    updateAdvisory,
    formError,
    setFormError,
  },
}) {
  const [protectedAreaError, setProtectedAreaError] = useState("");
  const [eventTypeError, setEventTypeError] = useState("");
  const [urgencyError, setUrgencyError] = useState("");
  const [advisoryStatusError, setAdvisoryStatusError] = useState("");
  // const [ticketNumberError, setTicketNumberError] = useState("");
  const [headlineError, setHeadlineError] = useState("");
  const [advisoryDateError, setAdvisoryDateError] = useState("");
  const [startDateError, setStartDateError] = useState("");
  const [endDateError, setEndDateError] = useState("");
  const [expiryDateError, setExpiryDateError] = useState("");
  const [updatedDateError, setUpdatedDateError] = useState("");
  const [submittedByError, setSubmittedByError] = useState("");
  const [listingRankError, setListingRankError] = useState("");

  const advisoryData = {
    listingRank: { value: listingRank, setError: setListingRankError, text: "listing rank" },
    // ticketNumber: { value: ticketNumber, setError: setTicketNumberError },
    headline: { value: headline, setError: setHeadlineError, text: "headline" },
    eventType: {
      value: eventType,
      setError: setEventTypeError,
      text: "event type",
    },
    protectedArea: {
      value: [
        selectedProtectedAreas,
        selectedRegions,
        selectedSections,
        selectedManagementAreas,
        selectedFireCentres,
        selectedFireZones,
        selectedSites,
      ],
      setError: setProtectedAreaError,
      text: "at least one affected area",
    },
    urgency: { value: urgency, setError: setUrgencyError, text: "urgency" },
    advisoryDate: { value: advisoryDate, setError: setAdvisoryDateError },
    startDate: { value: startDate, setError: setStartDateError },
    endDate: { value: endDate, setError: setEndDateError },
    expiryDate: { value: expiryDate, setError: setExpiryDateError },
    updatedDate: { value: updatedDate, setError: setUpdatedDateError },
    submittedBy: {
      value: submittedBy,
      setError: setSubmittedByError,
      text: "requested by",
    },
    advisoryStatus: {
      value: advisoryStatus,
      setError: setAdvisoryStatusError,
      text: "advisory status",
    },
    formError: setFormError,
  };

  const headlineInput = {
    id: "headline",
    required: false,
    placeholder: "Advisory Headline",
  };
  const descriptionInput = {
    id: "description",
    required: true,
    placeholder: "Description of advisory",
  };
  const linkTitleInput = {
    id: "link",
    required: false,
    placeholder: "Link Title",
  };
  const linkUrlInput = {
    id: "url",
    required: false,
    placeholder: "URL",
  };
  const notesInput = {
    id: "notes",
    required: false,
    placeholder: "Notes",
  };

  const submitterInput = {
    id: "submitter",
    required: false,
    placeholder: "Advisory requested by",
  };

  // const ticketNumberInput = {
  //   id: "ticketNumber",
  //   required: false,
  //   placeholder: "Discover Camping Ticket Number",
  // };

  const listingRankInput = {
    id: "listing",
    required: true,
    placeholder: "Listing Rank",
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

  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <form className="mt-5">
        <div className="container-fluid ad-form">
          <div className="row heading">
            Affected area
          </div>
          <AdvisoryAreaPicker
            data={{
              protectedAreas,
              selectedProtectedAreas,
              setSelectedProtectedAreas,
              regions,
              selectedRegions,
              setSelectedRegions,
              sections,
              selectedSections,
              setSelectedSections,
              managementAreas,
              selectedManagementAreas,
              setSelectedManagementAreas,
              sites,
              selectedSites,
              setSelectedSites,
              fireCentres,
              selectedFireCentres,
              setSelectedFireCentres,
              fireZones,
              selectedFireZones,
              setSelectedFireZones,
              advisoryData,
              protectedAreaError
            }}
          />
          <div className="row heading">
            Advisory content
          </div>
          <div className="row">
            <div className="col-lg-3 col-md-4 col-sm-12 ad-label bcgov-required">
              Headline
            </div>
            <div className="col-lg-7 col-md-8 col-sm-12">
              <TextField
                value={headline}
                onChange={(event) => {
                  setHeadline(event.target.value);
                }}
                className="bcgov-input"
                variant="outlined"
                inputProps={{ maxLength: 255 }}
                InputProps={{ ...headlineInput }}
                error={headlineError !== ""}
                helperText={headlineError}
                onBlur={() => {
                  validateRequiredText(advisoryData.headline);
                }}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-lg-3 col-md-4 col-sm-12 ad-label bcgov-required">
              Event type
              <LightTooltip
                arrow
                title="Please select the most appropriate event type that your advisory falls under, this does impact the front-end. 
                For example, freshet and wildfire event types load conditional content to their respective flood and wildfire pages."
              >
                <HelpIcon className="helpIcon" />
              </LightTooltip>
            </div>
            <div className="col-lg-7 col-md-8 col-sm-12">
              <FormControl
                variant="outlined"
                className={`bcgov-select-form ${eventTypeError !== "" ? "bcgov-select-error" : ""
                  }`}
                error
              >
                <Select
                  options={eventTypes}
                  value={eventTypes.filter((e) => e.value === eventType)}
                  onChange={(e) => setEventType(e ? e.value : 0)}
                  placeholder="Select an event type"
                  className="bcgov-select"
                  onBlur={() => {
                    validateRequiredSelect(advisoryData.eventType);
                  }}
                  isClearable
                />
                <FormHelperText>{eventTypeError}</FormHelperText>
              </FormControl>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-3 col-md-4 col-sm-12 ad-label bcgov-required">
              Urgency level
              <LightTooltip
                arrow
                title="Dependant on your advisory, the urgency level can be used to prioritize your alert above existing alerts for the same park page.
                Ie, assigning a high urgency re wildfire closure will place that advisory at the top."
              >
                <HelpIcon className="helpIcon" />
              </LightTooltip>
            </div>
            <div className="col-lg-7 col-md-8 col-sm-12">
              <FormControl error>
                <ButtonGroup
                  className="ad-btn-group urgency-btn-group"
                  variant="outlined"
                  aria-label="outlined primary button group"
                >
                  {urgencies.map((u) => (
                    <Btn
                      key={u.value}
                      onClick={() => {
                        setUrgency(u.value);
                      }}
                      className={urgency === u.value && `btn-urgency-${urgency}`}
                      style={{ textTransform: 'none' }}
                    >
                      {urgency === u.value && <CheckIcon />}
                      {u.label}
                    </Btn>
                  ))}
                </ButtonGroup>
                <div className="urgency-helper-text mt-1">
                  {urgency === 1 && (
                    <small>Medium urgency for safety and health related</small>
                  )}
                  {urgency === 2 && (
                    <small>Low urgency for discretion and warnings</small>
                  )}
                  {urgency === 3 && (
                    <small>High urgency for immediate danger and closures</small>
                  )}
                </div>
                <FormHelperText>{urgencyError}</FormHelperText>
              </FormControl>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-3 col-md-4 col-sm-12 ad-label">
              Listing rank
              <LightTooltip
                arrow
                title="Advisories, by default, are listed by date in descending order. 
                Listing Rank is a number that is used to override the chronological sort order for advisories. 
                A higher listing rank number will give the advisory a higher priority in the list."
              >
                <HelpIcon className="helpIcon" />
              </LightTooltip>
            </div>
            <div className="col-lg-7 col-md-8 col-sm-12">
              <TextField
                value={listingRank}
                onChange={(event) => {
                  setListingRank(event.target.value);
                }}
                className="bcgov-input"
                variant="outlined"
                InputProps={{ ...listingRankInput }}
                error={listingRankError !== ""}
                helperText={listingRankError}
                onBlur={() => {
                  validateOptionalNumber(advisoryData.listingRank);
                }}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-lg-3 col-md-4 col-sm-12 ad-label">
              Park access status
              <LightTooltip
                arrow
                title="This applies any applicable symbols or icons relating to the park access status to the advisory.
                Such as full closure or partial closure icons."
              >
                <HelpIcon className="helpIcon" />
              </LightTooltip>
            </div>
            <div className="col-lg-7 col-md-8 col-sm-12">
              <Select
                options={accessStatuses}
                value={accessStatuses.filter((e) => e.value === accessStatus)}
                onChange={(e) => setAccessStatus(e ? e.value : 0)}
                placeholder="Select an access status"
                className="bcgov-select"
                isClearable
              />
            </div>
          </div>
          <div className="row">
            <div className="col-lg-3 col-md-4 col-sm-12 ad-label">
              Standard message(s)
              <LightTooltip
                arrow
                title="Standard messages are chosen from a list of generic, pre-defined and approved messages. 
                This content will be added below any text entered in the description on the park page.
                There is no requirement to have both a description and standard messaging."
              >
                <HelpIcon className="helpIcon" />
              </LightTooltip>
            </div>
            <div className="col-lg-7 col-md-8 col-sm-12">
              <Select
                options={standardMessages}
                value={selectedStandardMessages}
                onChange={(e) => {
                  setSelectedStandardMessages(e);
                }}
                placeholder="Add standard message"
                className="bcgov-select"
                isMulti
                isClearable
              />
            </div>
          </div>
          <div className="row">
            <div className="col-lg-3 col-md-4 col-sm-12 ad-label">
              Description
            </div>
            <div className="col-lg-7 col-md-8 col-sm-12">
              <TextField
                value={description}
                onChange={(event) => {
                  setDescription(event.target.value);
                }}
                multiline
                rows={4}
                rowsMax={10}
                className="bcgov-input"
                variant="outlined"
                InputProps={{ ...descriptionInput }}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-lg-3 col-md-4 col-sm-12 ad-label">
              Standard message preview
            </div>
            <div className="col-lg-7 col-md-8 col-sm-12">
              <TextField
                // value={description}
                // onChange={(event) => {
                //   setDescription(event.target.value);
                // }}
                multiline
                rows={4}
                rowsMax={10}
                className="bcgov-input"
                variant="outlined"
              // InputProps={{ ...descriptionInput }}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-lg-3 col-md-4 col-sm-12 ad-label">
              Add supporting information
            </div>
            <div className="col-lg-7 col-md-8 col-sm-12">
              {linksRef.current.map((l, idx) => (
                <div key={idx} className="field-bg-grey">
                  <div className="row">
                    <div className="col-12 col-lg-3 col-md-2 ad-label">
                      Type
                    </div>
                    <div className="col-12 col-lg-9 col-md-8 ad-flex">
                      <Select
                        options={linkTypes}
                        onChange={(e) => {
                          updateLink(idx, "type", e.value);
                        }}
                        value={linkTypes.filter((o) => o.value === l.type)}
                        className="ad-link-select bcgov-select"
                        placeholder="Link or document type"
                      />
                      <div
                        className="ad-link-close ad-add-link pointer div-btn"
                        tabIndex="0"
                        onClick={() => {
                          removeLink(idx);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            removeLink(idx);
                          }
                        }}
                      >
                        <CloseIcon />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12 col-lg-3 col-md-2 ad-label">
                      Title
                    </div>
                    <div className="col-12 col-lg-9 col-md-8">
                      <TextField
                        value={l.title}
                        onChange={(event) => {
                          updateLink(idx, "title", event.target.value);
                        }}
                        className="bcgov-input"
                        variant="outlined"
                        InputProps={{ ...linkTitleInput }}
                        error={l.url !== "" && l.title === ""}
                        helperText={(l.url && !l.title) ? "Please enter link title too" : ""}
                      />
                    </div>
                  </div>
                  {l.format === "url" && (
                    <div className="row">
                      <div className="col-12 col-lg-3 col-md-2 ad-label">
                        URL
                      </div>
                      <div className="col-12 col-lg-9 col-md-8">
                        <TextField
                          value={l.file ? l.file.url : l.url}
                          onChange={(event) => {
                            updateLink(idx, "url", event.target.value);
                          }}
                          className="bcgov-input"
                          variant="outlined"
                          InputProps={{ ...linkUrlInput }}
                          error={l.title !== "" && l.url === ""}
                          helperText={(l.title && !l.url) ? "Please enter URL too" : ""}
                        />
                      </div>
                    </div>
                  )}
                  {l.format === "file" && (
                    <div className="row">
                      <div className="col-12 col-lg-3 col-md-2 ad-label">
                        File
                      </div>
                      <div className="col-12 col-lg-9 col-md-8 ad-flex">
                        <TextField
                          value={l.file ? l.file.name : ""}
                          className="bcgov-input mr10"
                          variant="outlined"
                          placeholder="Select files for upload"
                        />
                        <Btn
                          variant="contained"
                          component="label"
                          className="bcgov-normal-blue btn transform-none ad-upload-btn"
                        >
                          Browse
                          <input
                            type="file"
                            accept=".jpg,.gif,.png,.gif,.pdf"
                            hidden
                            onChange={({ target }) => {
                              handleFileCapture(target.files, idx);
                            }}
                          />
                        </Btn>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <button
                tabIndex="0"
                className="ad-add-link pointer div-btn"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    addLink("file");
                  }
                }}
                onClick={() => {
                  addLink("file");
                }}
              >
                + Upload file
              </button>
              <span>OR</span>
              <button
                tabIndex="0"
                className="ad-add-link pointer div-btn"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    addLink("url");
                  }
                }}
                onClick={() => {
                  addLink("url");
                }}
              >
                + Add URL
              </button>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-3 col-md-4 col-sm-12 ad-label">
              Event dates
            </div>
            <div className="col-lg-7 col-md-8 col-sm-12">
              <div className="field-bg-grey">
                <div className="row">
                  <div className="col-12 col-lg-3 col-md-4 ad-label">
                    Start date
                  </div>
                  <div className="col-12 col-lg-5 col-md-8">
                    <KeyboardDateTimePicker
                      id="startDate"
                      value={startDate}
                      onChange={setStartDate}
                      format="MMMM DD, yyyy hh:mm A"
                      className={`bcgov-datepicker-wrapper ${startDateError !== ""
                        ? "bcgov-datepicker-wrapper-error"
                        : ""
                        }`}
                      error={startDateError !== ""}
                      helperText={startDateError}
                      onBlur={() => {
                        validateOptionalDate(advisoryData.startDate);
                      }}
                    />
                  </div>
                  <div className="col-12 col-lg-1 col-md-4 ad-label">
                    Time
                  </div>
                  <div className="col-12 col-lg-3 col-md-8">
                    <TimePicker
                      className={`bcgov-datepicker-wrapper ${startDateError !== ""
                        ? "bcgov-datepicker-wrapper-error"
                        : ""
                        }`}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 col-lg-3 col-md-4 ad-label">
                    Duration
                  </div>
                  <div className="col-12 col-lg-5 col-md-8 ad-flex">
                    <Select
                      options={intervals}
                      onChange={handleDurationIntervalChange}
                      placeholder="Select"
                      className="pbm3 ad-interval-select bcgov-select"
                    />
                    <Select
                      options={intervalUnits}
                      onChange={handleDurationUnitChange}
                      placeholder="Select"
                      className="ad-interval-select bcgov-select"
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 col-lg-3 col-md-4 ad-label">
                    End date
                  </div>
                  <div className="col-12 col-lg-5 col-md-8">
                    <KeyboardDateTimePicker
                      id="endDate"
                      value={endDate}
                      onChange={setEndDate}
                      format="MMMM DD, yyyy hh:mm A"
                      className={`bcgov-datepicker-wrapper ${endDateError !== ""
                        ? "bcgov-datepicker-wrapper-error"
                        : ""
                        }`}
                      error={endDateError !== ""}
                      helperText={endDateError}
                      onBlur={() => {
                        validateOptionalDate(advisoryData.endDate);
                      }}
                      minDate={startDate}
                      minDateMessage="End date should not be before Advisory date"
                    />
                  </div>
                  <div className="col-12 col-lg-1 col-md-4 ad-label">
                    Time
                  </div>
                  <div className="col-12 col-lg-3 col-md-8">
                    <TimePicker
                      className={`bcgov-datepicker-wrapper ${endDateError !== ""
                        ? "bcgov-datepicker-wrapper-error"
                        : ""
                        }`}
                    />
                  </div>
                </div>
                {mode === "update" && (
                  <div className="row">
                    <div className="col-12 col-lg-3 col-md-4 ad-label">
                      Updated date
                    </div>
                    <div className="col-12 col-lg-5 col-md-8">
                      <KeyboardDateTimePicker
                        id="updatedDate"
                        value={updatedDate}
                        onChange={setUpdatedDate}
                        format="MMMM DD, yyyy hh:mm A"
                        className={`bcgov-datepicker-wrapper ${updatedDateError !== ""
                          ? "bcgov-datepicker-wrapper-error"
                          : ""
                          }`}
                        error={updatedDateError !== ""}
                        helperText={updatedDateError}
                        onBlur={() => {
                          validateOptionalDate(
                            advisoryData.updatedDate
                          );
                        }}
                      />
                    </div>
                    <div className="col-12 col-lg-1 col-md-4 ad-label">
                      Time
                    </div>
                    <div className="col-12 col-lg-3 col-md-8">
                      <TimePicker
                        className={`bcgov-datepicker-wrapper ${updatedDateError !== ""
                          ? "bcgov-datepicker-wrapper-error"
                          : ""
                          }`}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-3 col-md-4 col-sm-12 ad-label">
              Displayed date
            </div>
            <div className="col-lg-7 col-md-8 col-sm-12">
              <Select
                // options={standardMessages}
                // value={selectedStandardMessages}
                // onChange={(e) => {
                //   setSelectedStandardMessages(e);
                // }}
                placeholder="Posted date"
                className="bcgov-select"
                isMulti
                isClearable
              />
            </div>
          </div>
          {/* DC Ticket Number can be removed */}
          {/* <div className="row">
            <div className="col-lg-4 col-md-4 col-sm-12 ad-label">
              DC Ticket Number
            </div>
            <div className="col-lg-7 col-md-8 col-sm-12">
              <TextField
                value={ticketNumber}
                onChange={(event) => {
                  setTicketNumber(event.target.value);
                }}
                className="bcgov-input"
                variant="outlined"
                InputProps={{ ...ticketNumberInput }}
                error={ticketNumberError !== ""}
                helperText={ticketNumberError}
                onBlur={() => {
                  validateOptionalNumber(advisoryData.ticketNumber);
                }}
              />
            </div>
          </div> */}
          <div className="row heading">
            Internal details
          </div>
          <div className="row">
            <div className="col-lg-3 col-md-4 col-sm-12 ad-label">
              Post dates
            </div>
            <div className="col-lg-7 col-md-8 col-sm-12">
              <div className="field-bg-grey">
                <div className="row">
                  <div className="col-12 col-lg-3 col-md-4 ad-label bcgov-required">
                    Posting date
                  </div>
                  <div className="col-12 col-lg-5 col-md-8">
                    <KeyboardDateTimePicker
                      id="advisoryDate"
                      value={advisoryDate}
                      onChange={handleAdvisoryDateChange}
                      format="MMMM DD, yyyy hh:mm A"
                      className={`bcgov-datepicker-wrapper ${advisoryDateError !== ""
                        ? "bcgov-datepicker-wrapper-error"
                        : ""
                        }`}
                      error={advisoryDateError !== ""}
                      helperText={advisoryDateError}
                      onBlur={() => {
                        validateRequiredDate(advisoryData.advisoryDate);
                      }}
                    />
                  </div>
                  <div className="col-12 col-lg-1 col-md-4 ad-label">
                    Time
                  </div>
                  <div className="col-12 col-lg-3 col-md-8">
                    <TimePicker
                      className={`bcgov-datepicker-wrapper ${advisoryDateError !== ""
                        ? "bcgov-datepicker-wrapper-error"
                        : ""
                        }`}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 col-lg-3 col-md-4 ad-label">
                    Expiry date
                  </div>
                  <div className="col-12 col-lg-5 col-md-8">
                    <KeyboardDateTimePicker
                      id="expiryDate"
                      value={expiryDate}
                      onChange={setExpiryDate}
                      format="MMMM DD, yyyy hh:mm A"
                      className={`bcgov-datepicker-wrapper  mr40 ${expiryDateError !== ""
                        ? "bcgov-datepicker-wrapper-error"
                        : ""
                        }`}
                      error={expiryDateError !== ""}
                      helperText={expiryDateError}
                      onBlur={() => {
                        validateOptionalDate(advisoryData.expiryDate);
                      }}
                      minDate={startDate}
                      minDateMessage="Expiry date should not be before Advisory date"
                    />
                  </div>
                  <div className="col-12 col-lg-1 col-md-4 ad-label">
                    Time
                  </div>
                  <div className="col-12 col-lg-3 col-md-8">
                    <TimePicker
                      className={`bcgov-datepicker-wrapper  mr40 ${expiryDateError !== ""
                        ? "bcgov-datepicker-wrapper-error"
                        : ""
                        }`}
                    />
                  </div>
                </div>
                {mode === "update" && (
                  <div className="row">
                    <div className="col-12 col-lg-3 col-md-4 ad-label">
                      Updated date
                    </div>
                    <div className="col-12 col-lg-5 col-md-8">
                      <KeyboardDateTimePicker
                        id="updatedDate"
                        value={updatedDate}
                        onChange={setUpdatedDate}
                        format="MMMM DD, yyyy hh:mm A"
                        className={`bcgov-datepicker-wrapper ${updatedDateError !== ""
                          ? "bcgov-datepicker-wrapper-error"
                          : ""
                          }`}
                        error={updatedDateError !== ""}
                        helperText={updatedDateError}
                        onBlur={() => {
                          validateOptionalDate(
                            advisoryData.updatedDate
                          );
                        }}
                      />
                    </div>
                    <div className="col-12 col-lg-1 col-md-4 ad-label">
                      Time
                    </div>
                    <div className="col-12 col-lg-3 col-md-8">
                      <TimePicker
                        className={`bcgov-datepicker-wrapper ${updatedDateError !== ""
                          ? "bcgov-datepicker-wrapper-error"
                          : ""
                          }`}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-3 col-md-4 col-sm-12 ad-label bcgov-required">
              Advisory status
            </div>
            <div className="col-lg-7 col-md-8 col-sm-12">
              <FormControl
                variant="outlined"
                className={`bcgov-select-form ${advisoryStatusError !== "" ? "bcgov-select-error" : ""
                  }`}
                error
              >
                <Select
                  options={advisoryStatuses}
                  value={advisoryStatuses.filter(
                    (a) => a.value === advisoryStatus
                  )}
                  onChange={(e) => setAdvisoryStatus(e ? e.value : 0)}
                  placeholder="Select an advisory status"
                  className="bcgov-select"
                  onBlur={() => {
                    validateRequiredSelect(advisoryData.advisoryStatus);
                  }}
                  isClearable
                />
                <FormHelperText>{advisoryStatusError}</FormHelperText>
              </FormControl>
            </div>
          </div>
          {PrivateElement(["approver"]) && (
            <>
              <div className="row">
                <div className="col-lg-3 col-md-4 col-sm-12 ad-label bcgov-required">
                  Requested by
                </div>
                <div className="col-lg-7 col-md-8 col-sm-12">
                  <TextField
                    value={submittedBy}
                    onChange={(event) => {
                      setSubmittedBy(event.target.value);
                    }}
                    className="bcgov-input"
                    variant="outlined"
                    InputProps={{ ...submitterInput }}
                    error={submittedByError !== ""}
                    helperText={submittedByError}
                    onBlur={() => {
                      validateRequiredText(advisoryData.submittedBy);
                    }}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-lg-3 col-md-4 col-sm-6 col-6 ad-label">
                  Public safety related
                </div>
                <div className="col-lg-7 col-md-8 col-sm-6 col-6">
                  <Checkbox
                    checked={isSafetyRelated}
                    onChange={(e) => {
                      setIsSafetyRelated(e.target.checked);
                    }}
                    inputProps={{ "aria-label": "safety related" }}
                  />
                </div>
              </div>
              {/* Reservations Affected can be removed */}
              {/* <div className="row">
                <div className="col-lg-3 col-md-4 col-sm-6 col-6 ad-label">
                  Reservations Affected
                </div>
                <div className="col-lg-7 col-md-8 col-sm-6 col-6">
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
              </div> */}
              <div className="row">
                <div className="col-lg-3 col-md-4 col-sm-12 ad-label">
                  Internal notes
                </div>
                <div className="col-lg-7 col-md-8 col-sm-12">
                  <TextField
                    value={notes}
                    onChange={(event) => {
                      setNotes(event.target.value);
                    }}
                    className="bcgov-input"
                    variant="outlined"
                    InputProps={{ ...notesInput }}
                  />
                </div>
              </div>
            </>
          )}
          {!PrivateElement(["approver"]) && (isStatHoliday || isAfterHours) && (
            <div className="ad-af-hour-box">
              <div className="row">
                <div className="col-lg-3 col-md-4 col-sm-12 ad-label">
                </div>
                <div className="col-lg-7 col-md-8 col-sm-12">
                  <div className="d-flex field-bg-blue">
                    <WarningIcon className="warningIcon" />
                    <div className="ml-3">
                      <p>
                        <b>This is an after-hours advisory</b><br />
                        The web team's business hours are<br />
                        Monday to Friday, 8:30AM – 4:30PM.
                      </p>
                      <div className="d-flex mt-3">
                        <Radio
                          checked={isAfterHourPublish}
                          onChange={() => {
                            setIsAfterHourPublish(true);
                          }}
                          value="Publish"
                          name="after-hour-submission"
                          inputProps={{ "aria-label": "Publish immediately" }}
                          className="mr-2"
                        />
                        <p><b className="required">Urgent/safety-related.</b> Publish immediately.</p>
                      </div>
                      <div className="d-flex mt-3">
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
                          className="mr-2"
                        />
                        <p><b>Advisory is not urgent.</b> Submit for web team review.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <br />
          <div className="row">
            <div className="col-lg-3 col-md-4"></div>
            <div className="col-lg-7 col-md-8 col-sm-12 ad-form-error">
              <FormControl error>
                <FormHelperText>{formError}</FormHelperText>
              </FormControl>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-3 col-md-4"></div>
            <div className="col-lg-7 col-md-8 col-sm-12 ad-btn-group">
              {!PrivateElement(["approver"]) && (
                <>
                  {mode === "create" && (
                    <>
                      <Button
                        label={(isStatHoliday || isAfterHours) ? "Submit" : "Submit for approval"}
                        styling="bcgov-normal-blue btn"
                        onClick={() => {
                          if (validAdvisoryData(advisoryData, linksRef, false, mode)) {
                            saveAdvisory("submit");
                          }
                        }}
                        hasLoader={isSubmitting}
                      />
                      <Button
                        label="Save draft"
                        styling="bcgov-normal-white btn"
                        onClick={() => {
                          if (validAdvisoryData(advisoryData, linksRef, false, mode)) {
                            saveAdvisory("draft");
                          }
                        }}
                        hasLoader={isSavingDraft}
                      />
                    </>
                  )}
                  {mode === "update" && (
                    <>
                      <Button
                        label={(isStatHoliday || isAfterHours) ? "Submit" : "Submit for approval"}
                        styling="bcgov-normal-blue btn"
                        onClick={() => {
                          if (validAdvisoryData(advisoryData, linksRef, false, mode)) {
                            updateAdvisory("submit");
                          }
                        }}
                        hasLoader={isSubmitting}
                      />
                      <Button
                        label="Save draft"
                        styling="bcgov-normal-white btn"
                        onClick={() => {
                          if (validAdvisoryData(advisoryData, linksRef, false, mode)) {
                            updateAdvisory("draft");
                          }
                        }}
                        hasLoader={isSavingDraft}
                      />
                    </>
                  )}
                </>
              )}
              {PrivateElement(["approver"]) && (
                <>
                  {mode === "create" && (
                    <Button
                      label="Create advisory"
                      styling="bcgov-normal-blue btn"
                      onClick={() => {
                        if (validAdvisoryData(advisoryData, linksRef, true, mode)) {
                          saveAdvisory();
                        }
                      }}
                      hasLoader={isSubmitting}
                    />
                  )}
                  {mode === "update" && (
                    <Button
                      label="Update advisory"
                      styling="bcgov-normal-blue btn"
                      onClick={() => {
                        if (validAdvisoryData(advisoryData, linksRef, true, mode)) {
                          updateAdvisory();
                        }
                      }}
                      hasLoader={isSubmitting}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </form>
    </MuiPickersUtilsProvider>
  );
}

AdvisoryForm.propTypes = {
  mode: PropTypes.string.isRequired,
  data: PropTypes.shape({
    ticketNumber: PropTypes.string,
    setTicketNumber: PropTypes.func.isRequired,
    listingRank: PropTypes.number,
    setListingRank: PropTypes.func.isRequired,
    headline: PropTypes.string,
    setHeadline: PropTypes.func.isRequired,
    eventType: PropTypes.number,
    eventTypes: PropTypes.array.isRequired,
    setEventType: PropTypes.func.isRequired,
    accessStatus: PropTypes.number,
    accessStatuses: PropTypes.array.isRequired,
    setAccessStatus: PropTypes.func.isRequired,
    description: PropTypes.string,
    setDescription: PropTypes.func.isRequired,
    standardMessages: PropTypes.array.isRequired,
    selectedStandardMessages: PropTypes.array,
    setSelectedStandardMessages: PropTypes.func.isRequired,
    protectedAreas: PropTypes.array.isRequired,
    selectedProtectedAreas: PropTypes.array,
    setSelectedProtectedAreas: PropTypes.func.isRequired,
    regions: PropTypes.array.isRequired,
    selectedRegions: PropTypes.array,
    setSelectedRegions: PropTypes.func.isRequired,
    sections: PropTypes.array.isRequired,
    selectedSections: PropTypes.array,
    setSelectedSections: PropTypes.func.isRequired,
    managementAreas: PropTypes.array.isRequired,
    selectedManagementAreas: PropTypes.array,
    setSelectedManagementAreas: PropTypes.func.isRequired,
    sites: PropTypes.array.isRequired,
    selectedSites: PropTypes.array,
    setSelectedSites: PropTypes.func.isRequired,
    fireCentres: PropTypes.array.isRequired,
    selectedFireCentres: PropTypes.array,
    setSelectedFireCentres: PropTypes.func.isRequired,
    fireZones: PropTypes.array.isRequired,
    selectedFireZones: PropTypes.array,
    setSelectedFireZones: PropTypes.func.isRequired,
    urgencies: PropTypes.array.isRequired,
    urgency: PropTypes.number,
    setUrgency: PropTypes.func.isRequired,
    isSafetyRelated: PropTypes.bool,
    setIsSafetyRelated: PropTypes.func.isRequired,
    isReservationAffected: PropTypes.bool,
    setIsReservationAffected: PropTypes.func.isRequired,
    advisoryDate: PropTypes.object,
    handleAdvisoryDateChange: PropTypes.func.isRequired,
    displayAdvisoryDate: PropTypes.bool,
    setDisplayAdvisoryDate: PropTypes.func.isRequired,
    startDate: PropTypes.object,
    setStartDate: PropTypes.func.isRequired,
    displayStartDate: PropTypes.bool,
    setDisplayStartDate: PropTypes.func.isRequired,
    endDate: PropTypes.object,
    setEndDate: PropTypes.func.isRequired,
    displayEndDate: PropTypes.bool,
    setDisplayEndDate: PropTypes.func.isRequired,
    updatedDate: PropTypes.object,
    setUpdatedDate: PropTypes.func.isRequired,
    displayUpdatedDate: PropTypes.bool,
    setDisplayUpdatedDate: PropTypes.func.isRequired,
    expiryDate: PropTypes.object,
    setExpiryDate: PropTypes.func.isRequired,
    handleDurationIntervalChange: PropTypes.func.isRequired,
    handleDurationUnitChange: PropTypes.func.isRequired,
    linksRef: PropTypes.object.isRequired,
    linkTypes: PropTypes.array.isRequired,
    removeLink: PropTypes.func.isRequired,
    updateLink: PropTypes.func.isRequired,
    addLink: PropTypes.func.isRequired,
    handleFileCapture: PropTypes.func.isRequired,
    notes: PropTypes.string,
    setNotes: PropTypes.func.isRequired,
    submittedBy: PropTypes.string,
    setSubmittedBy: PropTypes.func.isRequired,
    advisoryStatuses: PropTypes.array.isRequired,
    advisoryStatus: PropTypes.number,
    setAdvisoryStatus: PropTypes.func.isRequired,
    isStatHoliday: PropTypes.bool,
    isAfterHours: PropTypes.bool,
    isAfterHourPublish: PropTypes.bool,
    setIsAfterHourPublish: PropTypes.func.isRequired,
    saveAdvisory: PropTypes.func.isRequired,
    isSubmitting: PropTypes.bool,
    isSavingDraft: PropTypes.bool,
    updateAdvisory: PropTypes.func.isRequired,
    formError: PropTypes.string,
    setFormError: PropTypes.func.isRequired,
  }).isRequired,
};
