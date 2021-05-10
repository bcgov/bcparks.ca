import React, { useState, useRef, useEffect } from "react";
import { cmsAxios, apiAxios } from "../../../axios_config";
import { Redirect, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import "./Advisory.css";
import moment from "moment";
import "moment-timezone";
import { useKeycloak } from "@react-keycloak/web";
import {
  calculateAfterHours,
  getAdvisoryFields,
  getLocationAreas,
  getUpdateAdvisoryFields,
  calculateIsStatHoliday,
} from "../../../utils/AdvisoryUtils";
import AdvisoryForm from "../../composite/advisoryForm/AdvisoryForm";
import Header from "../../composite/header/Header";
import { Loader } from "shared-components/build/components/loader/Loader";

export default function Advisory({ mode, page: { setError } }) {
  const [locationOptions, setLocationOptions] = useState([]);
  const [locations, setLocations] = useState([]);
  const [eventTypes, setEventTypes] = useState([]);
  const [eventType, setEventType] = useState({});
  const [accessStatuses, setAccessStatuses] = useState([]);
  const [accessStatus, setAccessStatus] = useState({});
  const [urgencies, setUrgencies] = useState([]);
  const [urgency, setUrgency] = useState({});
  const [advisoryStatuses, setAdvisoryStatuses] = useState([]);
  const [advisoryStatus, setAdvisoryStatus] = useState({});
  const [linkTypes, setLinkTypes] = useState([]);
  const [links, setLinks] = useState([]);
  const [ticketNumber, setTicketNumber] = useState("");
  const [headline, setHeadline] = useState("");
  const [description, setDescription] = useState("");
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
  const [expiryDate, setExpiryDate] = useState(null);
  const [updatedDate, setUpdatedDate] = useState(
    moment().tz("America/Vancouver")
  );
  const [displayUpdatedDate, setDisplayUpdatedDate] = useState(false);
  const [pictures, setPictures] = useState([]);
  const [notes, setNotes] = useState("");
  const [submittedBy, setSubmittedBy] = useState("");
  const [listingRank, setListingRank] = useState("");
  const [toError, setToError] = useState(false);
  const [toDashboard, setToDashboard] = useState(false);
  const { keycloak, initialized } = useKeycloak();
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isStatHoliday, setIsStatHoliday] = useState(false);
  const [isAfterHours, setIsAfterHours] = useState(false);
  const [isAfterHourPublish, setIsAfterHourPublish] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const linksRef = useRef([]);
  const durationUnitRef = useRef("h");
  const durationIntervalRef = useRef(0);
  const advisoryDateRef = useRef(moment().tz("America/Vancouver"));

  const { id } = useParams();

  useEffect(() => {
    if (initialized && keycloak.authenticated) {
      calculateIsStatHoliday(setIsStatHoliday, keycloak.idToken);
    }
  }, [keycloak, initialized, setIsStatHoliday]);

  useEffect(() => {
    if (
      initialized &&
      keycloak.authenticated &&
      mode === "update" &&
      !isLoadingData
    ) {
      if (parseInt(id)) {
        cmsAxios
          .get(`/public-advisories/${id}`)
          .then((res) => {
            const advisoryData = res.data;
            setHeadline(advisoryData.Title || "");
            setDescription(advisoryData.Description || "");
            setTicketNumber(advisoryData.DCTicketNumber || "");
            if (advisoryData.Alert) {
              setIsSafetyRelated(advisoryData.Alert);
            }
            setListingRank(advisoryData.ListingRank || "");
            setNotes(advisoryData.Note || "");
            setSubmittedBy(advisoryData.SubmittedBy || "");
            if (advisoryData.AdvisoryDate) {
              setAdvisoryDate(
                moment(advisoryData.AdvisoryDate).tz("America/Vancouver")
              );
            }
            if (advisoryData.EffectiveDate) {
              setStartDate(
                moment(advisoryData.EffectiveDate).tz("America/Vancouver")
              );
            }
            if (advisoryData.EndDate) {
              setEndDate(moment(advisoryData.EndDate).tz("America/Vancouver"));
            }

            if (advisoryData.ExpiryDate) {
              setExpiryDate(
                moment(advisoryData.ExpiryDate).tz("America/Vancouver")
              );
            }
            if (advisoryData.UpdatedDate) {
              setUpdatedDate(
                moment(advisoryData.UpdatedDate).tz("America/Vancouver")
              );
            }
            if (advisoryData.AccessStatus) {
              setAccessStatus(advisoryData.AccessStatus);
            }
            if (advisoryData.EventType) {
              setEventType(advisoryData.EventType);
            }
            if (advisoryData.Urgency) {
              setUrgency(advisoryData.Urgency);
            }
            if (advisoryData.AdvisoryStatus) {
              setAdvisoryStatus(advisoryData.AdvisoryStatus);
            }
            if (advisoryData.ReservationsAffected) {
              setIsReservationAffected(advisoryData.ReservationsAffected);
            }
            setDisplayAdvisoryDate(
              advisoryData.DisplayAdvisoryDate
                ? advisoryData.DisplayAdvisoryDate
                : false
            );
            setDisplayStartDate(
              advisoryData.DisplayEffectiveDate
                ? advisoryData.DisplayEffectiveDate
                : false
            );
            setDisplayEndDate(
              advisoryData.DisplayEndDate ? advisoryData.DisplayEndDate : false
            );
            if (advisoryData.DisplayUpdatedDate !== null) {
              setDisplayUpdatedDate(advisoryData.DisplayUpdatedDate);
            }

            const selLocations = [];
            const protectedAreas = advisoryData.ProtectedAreas;
            const regions = advisoryData.Regions;
            const sections = advisoryData.Sections;
            const managementAreas = advisoryData.ManagementAreas;
            if (protectedAreas) {
              protectedAreas.forEach((p) => {
                selLocations.push(
                  locationOptions.find(
                    (l) => l.value === p.ORCS && l.type === "protectedArea"
                  )
                );
              });
            }
            if (regions) {
              regions.forEach((r) => {
                selLocations.push(
                  locationOptions.find(
                    (l) => l.value === r.RegionNumber && l.type === "region"
                  )
                );
              });
            }
            if (sections) {
              sections.forEach((s) => {
                selLocations.push(
                  locationOptions.find(
                    (l) => l.value === s.SectionNumber && l.type === "section"
                  )
                );
              });
            }
            if (managementAreas) {
              managementAreas.forEach((m) => {
                selLocations.push(
                  locationOptions.find(
                    (l) =>
                      l.value === m.ManagementAreaNumber &&
                      l.type === "managementArea"
                  )
                );
              });
            }
            setLocations([...selLocations]);
            const links = advisoryData.Links;
            if (links) {
              links.forEach((l) => {
                linksRef.current = [
                  ...linksRef.current,
                  {
                    type: l.Type,
                    title: l.Title || "",
                    url: l.URL || "",
                    id: l.id,
                    isModified: false,
                  },
                ];
              });
            }
            setLinks(linksRef.current);
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
      }
      setIsLoadingPage(false);
    }
  }, [
    id,
    initialized,
    keycloak,
    mode,
    setHeadline,
    setDescription,
    setTicketNumber,
    setIsSafetyRelated,
    setListingRank,
    setSubmittedBy,
    setEventType,
    setUrgency,
    setAdvisoryStatus,
    setAdvisoryDate,
    setUpdatedDate,
    setStartDate,
    setEndDate,
    setExpiryDate,
    setAccessStatus,
    setIsReservationAffected,
    setDisplayAdvisoryDate,
    setDisplayStartDate,
    setDisplayEndDate,
    setDisplayUpdatedDate,
    setNotes,
    isLoadingData,
    eventTypes,
    setToError,
    setError,
    locationOptions,
    setLocations,
  ]);

  useEffect(() => {
    if (!initialized) {
      setIsLoadingPage(true);
    } else if (!keycloak.authenticated) {
      setToError(true);
      setError({
        status: 401,
        message: "Login required",
      });
    } else {
      Promise.all([
        cmsAxios.get(`/protectedAreas?_limit=-1&_sort=ProtectedAreaName`),
        cmsAxios.get(`/regions?_limit=-1&_sort=RegionName`),
        cmsAxios.get(`/sections?_limit=-1&_sort=SectionName`),
        cmsAxios.get(`/managementAreas?_limit=-1&_sort=ManagementAreaName`),
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
            type: "protectedArea",
            obj: p,
          }));
          const regionData = res[1].data;
          const regions = regionData.map((r) => ({
            label: r.RegionName,
            value: r.RegionNumber,
            type: "region",
            obj: r,
          }));
          const sectionData = res[2].data;
          const sections = sectionData.map((s) => ({
            label: s.SectionName,
            value: s.SectionNumber,
            type: "section",
            obj: s,
          }));
          const managementAreaData = res[3].data;
          const managementAreas = managementAreaData.map((m) => ({
            label: m.ManagementAreaName,
            value: m.ManagementAreaNumber,
            type: "managementArea",
            obj: m,
          }));
          const eventTypeData = res[4].data;
          const eventTypes = eventTypeData.map((et) => ({
            label: et.EventType,
            value: et.id,
            obj: et,
          }));
          setLocationOptions([
            ...protectedAreas,
            ...managementAreas,
            ...sections,
            ...regions,
          ]);
          setEventTypes([...eventTypes]);
          const accessStatusData = res[5].data;
          const accessStatuses = accessStatusData.map((a) => ({
            label: a.AccessStatus,
            value: a.id,
            obj: a,
          }));
          setAccessStatuses([...accessStatuses]);
          const urgencyData = res[6].data;
          const urgencies = urgencyData.map((u) => ({
            label: u.Urgency,
            value: u.id,
            obj: u,
          }));
          setUrgencies([...urgencies]);

          setIsAfterHours(calculateAfterHours(res[7].data));
          const advisoryStatusData = res[8].data;
          const advisoryStatuses = advisoryStatusData.map((s) => ({
            code: s.Code,
            label: s.AdvisoryStatus,
            value: s.id,
            obj: s,
          }));
          setAdvisoryStatuses([...advisoryStatuses]);
          const linkTypeData = res[9].data;
          const linkTypes = linkTypeData.map((lt) => ({
            label: lt.Type,
            value: lt.id,
            obj: lt,
          }));
          setLinkTypes([...linkTypes]);
          setLinks(linksRef.current);
          if (mode === "create") {
            setUrgency(urgencyData[0]);
            setIsLoadingPage(false);
          }
          setIsLoadingData(false);
        })
        .catch(() => {
          setToError(true);
          setError({
            status: 500,
            message: "Error occurred",
          });
          setIsLoadingData(false);
          setIsLoadingPage(false);
        });
    }
  }, [
    setLocationOptions,
    setUrgencies,
    setAdvisoryStatuses,
    setAccessStatuses,
    setEventTypes,
    setLinkTypes,
    setUrgency,
    setToError,
    setError,
    keycloak,
    initialized,
    setIsLoadingData,
    setIsLoadingPage,
    setIsAfterHours,
    setLinks,
    mode,
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
    linksRef.current = [...linksRef.current, { type: {}, title: "", url: "" }];
    setLinks(linksRef.current);
  };

  const updateLink = (index, field, value) => {
    const tempLinks = [...linksRef.current];
    tempLinks[index][field] = value;
    tempLinks[index].isModified = true;
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

  const isValidLink = (link) => {
    if (link.title !== "" && link.url !== "" && link.isModified) {
      return true;
    }
    return false;
  };

  const createLink = async (link) => {
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
        setToError(true);
        setError({
          status: 500,
          message: "Could not process advisory update",
        });
      });
    return res.data;
  };

  const saveLink = async (link, id) => {
    const linkRequest = {
      Title: link.title,
      URL: link.url,
      Type: link.type,
    };
    const res = await apiAxios
      .put(`api/update/links/${id}`, linkRequest, {
        headers: { Authorization: `Bearer ${keycloak.idToken}` },
      })
      .catch((error) => {
        console.log("error occurred", error);
        setToError(true);
        setError({
          status: 500,
          message: "Could not process advisory update",
        });
      });
    return res.data;
  };

  const saveLinks = async () => {
    const savedLinks = [];
    for (let link of links) {
      if (isValidLink(link)) {
        if (parseInt(link.id) > 0) {
          const savedLink = await saveLink(link, link.id);
          savedLinks.push(savedLink);
        } else {
          const savedLink = await createLink(link);
          savedLinks.push(savedLink);
        }
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
    const {
      selAdvisoryStatus,
      confirmationText,
      published,
    } = getAdvisoryFields(type, advisoryStatuses);
    setConfirmationText(confirmationText);
    const {
      selProtectedAreas,
      selRegions,
      selSections,
      selManagementAreas,
    } = getLocationAreas(locations);
    Promise.resolve(saveLinks()).then((savedLinks) => {
      const newAdvisory = {
        Title: headline,
        Description: description,
        DCTicketNumber: parseInt(ticketNumber),
        Alert: isSafetyRelated,
        Note: notes,
        SubmittedBy: submittedBy,
        CreatedDate: moment().toISOString(),
        CreatedBy: keycloak.tokenParsed.name,
        AdvisoryDate: advisoryDate,
        EffectiveDate: startDate,
        EndDate: endDate,
        ExpiryDate: expiryDate,
        AccessStatus: accessStatus,
        EventType: eventType,
        Urgency: urgency,
        ProtectedAreas: selProtectedAreas,
        AdvisoryStatus: selAdvisoryStatus,
        Links: savedLinks,
        Regions: selRegions,
        Sections: selSections,
        ManagementAreas: selManagementAreas,
        ReservationsAffected: isReservationAffected,
        DisplayAdvisoryDate: displayAdvisoryDate,
        DisplayEffectiveDate: displayStartDate,
        DisplayEndDate: displayEndDate,
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
          setToError(true);
          setError({
            status: 500,
            message: "Could not process advisory update",
          });
        });
    });
  };

  const updateAdvisory = () => {
    setIsSubmitting(true);
    const { confirmationText, published } = getUpdateAdvisoryFields(
      advisoryStatus.Code,
      isAfterHourPublish
    );
    setConfirmationText(confirmationText);
    const {
      selProtectedAreas,
      selRegions,
      selSections,
      selManagementAreas,
    } = getLocationAreas(locations);
    Promise.resolve(saveLinks()).then((savedLinks) => {
      const updatedLinks = savedLinks ? savedLinks : links;
      const updatedAdvisory = {
        Title: headline,
        Description: description,
        DCTicketNumber: parseInt(ticketNumber),
        Alert: isSafetyRelated,
        Note: notes,
        SubmittedBy: submittedBy,
        CreatedDate: moment().toISOString(),
        CreatedBy: keycloak.tokenParsed.name,
        AdvisoryDate: advisoryDate,
        EffectiveDate: startDate,
        EndDate: endDate,
        ExpiryDate: expiryDate,
        AccessStatus: accessStatus,
        EventType: eventType,
        Urgency: urgency,
        ProtectedAreas: selProtectedAreas,
        AdvisoryStatus: advisoryStatus,
        Links: updatedLinks,
        Regions: selRegions,
        Sections: selSections,
        ManagementAreas: selManagementAreas,
        ReservationsAffected: isReservationAffected,
        DisplayAdvisoryDate: displayAdvisoryDate,
        DisplayEffectiveDate: displayStartDate,
        DisplayEndDate: displayEndDate,
        published_at: published,
      };

      apiAxios
        .put(`api/update/public-advisories/${id}`, updatedAdvisory, {
          headers: { Authorization: `Bearer ${keycloak.idToken}` },
        })
        .then(() => {
          setIsConfirmationOpen(true);
          setIsSubmitting(false);
          setIsSavingDraft(false);
        })
        .catch((error) => {
          console.log("error occurred", error);
          setToError(true);
          setError({
            status: 500,
            message: "Could not process advisory update",
          });
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
      <div className="Advisory" data-testid="Advisory">
        <div className="container">
          {isLoadingPage && (
            <div className="page-loader">
              <Loader page />
            </div>
          )}
          {!isLoadingPage && (
            <AdvisoryForm
              mode={mode}
              data={{
                ticketNumber,
                setTicketNumber,
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
                locationOptions,
                locations,
                setLocations,
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
                onDrop,
                linksRef,
                linkTypes,
                removeLink,
                updateLink,
                addLink,
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
                setToDashboard,
                isConfirmationOpen,
                setIsConfirmationOpen,
                confirmationText,
                closeConfirmation,
              }}
            />
          )}
        </div>
        <br />
      </div>
    </main>
  );
}

Advisory.propTypes = {
  mode: PropTypes.string.isRequired,
  page: PropTypes.shape({
    setError: PropTypes.func.isRequired,
  }).isRequired,
};
