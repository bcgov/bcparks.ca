import { useState, useRef, useEffect } from "react";
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
  const [eventType, setEventType] = useState();
  const [accessStatuses, setAccessStatuses] = useState([]);
  const [accessStatus, setAccessStatus] = useState();
  const [urgencies, setUrgencies] = useState([]);
  const [urgency, setUrgency] = useState();
  const [advisoryStatuses, setAdvisoryStatuses] = useState([]);
  const [advisoryStatus, setAdvisoryStatus] = useState();
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
  const [expiryDate, setExpiryDate] = useState(
    moment().tz("America/Vancouver")
  );
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
  const [isConfirmation, setIsConfirmation] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const linksRef = useRef([]);
  const durationUnitRef = useRef("h");
  const durationIntervalRef = useRef(0);
  const advisoryDateRef = useRef(moment().tz("America/Vancouver"));
  const [advisoryId, setAdvisoryId] = useState();

  const { id } = useParams();

  useEffect(() => {
    if (initialized && keycloak) {
      calculateIsStatHoliday(setIsStatHoliday, keycloak.idToken);
    }
  }, [keycloak, initialized, setIsStatHoliday]);

  useEffect(() => {
    if (mode === "update" && !isLoadingData) {
      if (parseInt(id)) {
        cmsAxios
          .get(`/public-advisories/${id}?_publicationState=preview`)
          .then((res) => {
            linksRef.current = [];
            const advisoryData = res.data;
            setHeadline(advisoryData.title || "");
            setDescription(advisoryData.description || "");
            setTicketNumber(advisoryData.dcTicketNumber || "");
            if (advisoryData.isSafetyRelated) {
              setIsSafetyRelated(advisoryData.isSafetyRelated);
            }
            setListingRank(
              advisoryData.listingRank ? "" + advisoryData.listingRank : ""
            );
            setNotes(advisoryData.note || "");
            setSubmittedBy(advisoryData.submittedBy || "");
            if (advisoryData.advisoryDate) {
              setAdvisoryDate(
                moment(advisoryData.advisoryDate).tz("America/Vancouver")
              );
            }
            if (advisoryData.effectiveDate) {
              setStartDate(
                moment(advisoryData.effectiveDate).tz("America/Vancouver")
              );
            }
            if (advisoryData.endDate) {
              setEndDate(moment(advisoryData.endDate).tz("America/Vancouver"));
            }

            if (advisoryData.expiryDate) {
              setExpiryDate(
                moment(advisoryData.expiryDate).tz("America/Vancouver")
              );
            }
            if (advisoryData.updatedDate) {
              setUpdatedDate(
                moment(advisoryData.updatedDate).tz("America/Vancouver")
              );
            }
            if (advisoryData.accessStatus) {
              setAccessStatus(advisoryData.accessStatus.id);
            }
            if (advisoryData.eventType) {
              setEventType(advisoryData.eventType.id);
            }
            if (advisoryData.urgency) {
              setUrgency(advisoryData.urgency.id);
            }
            if (advisoryData.advisoryStatus) {
              setAdvisoryStatus(advisoryData.advisoryStatus.id);
            }
            if (advisoryData.isReservationsAffected) {
              setIsReservationAffected(advisoryData.isReservationsAffected);
            }
            setDisplayAdvisoryDate(
              advisoryData.isAdvisoryDateDisplayed
                ? advisoryData.isAdvisoryDateDisplayed
                : false
            );
            setDisplayStartDate(
              advisoryData.isEffectiveDateDisplayed
                ? advisoryData.isEffectiveDateDisplayed
                : false
            );
            setDisplayEndDate(
              advisoryData.isEndDateDisplayed
                ? advisoryData.isEndDateDisplayed
                : false
            );
            if (advisoryData.isUpdatedDateDisplayed !== null) {
              setDisplayUpdatedDate(advisoryData.isUpdatedDateDisplayed);
            }

            const selLocations = [];
            const protectedAreas = advisoryData.protectedAreas;
            const regions = advisoryData.regions;
            const sections = advisoryData.sections;
            const managementAreas = advisoryData.managementAreas;
            if (protectedAreas) {
              protectedAreas.forEach((p) => {
                selLocations.push(
                  locationOptions.find(
                    (l) => l.value === p.id && l.type === "protectedArea"
                  )
                );
              });
            }
            if (regions) {
              regions.forEach((r) => {
                selLocations.push(
                  locationOptions.find(
                    (l) => l.value === r.id && l.type === "region"
                  )
                );
              });
            }
            if (sections) {
              sections.forEach((s) => {
                selLocations.push(
                  locationOptions.find(
                    (l) => l.value === s.id && l.type === "section"
                  )
                );
              });
            }
            if (managementAreas) {
              managementAreas.forEach((m) => {
                selLocations.push(
                  locationOptions.find(
                    (l) => l.value === m.id && l.type === "managementArea"
                  )
                );
              });
            }
            setLocations([...selLocations]);
            const links = advisoryData.links;
            if (links) {
              links.forEach((l) => {
                linksRef.current = [
                  ...linksRef.current,
                  {
                    type: l.type,
                    title: l.title || "",
                    url: l.url || "",
                    id: l.id,
                    isModified: false,
                  },
                ];
              });
            }
            setLinkIds();
            setIsLoadingPage(false);
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
        setIsLoadingPage(false);
      }
    }
  }, [
    id,
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
    if (initialized && keycloak) {
      Promise.all([
        cmsAxios.get(
          `/protected-areas/names?_limit=-1&_sort=protectedAreaName`
        ),
        cmsAxios.get(`/regions?_limit=-1&_sort=regionName`),
        cmsAxios.get(`/sections?_limit=-1&_sort=sectionName`),
        cmsAxios.get(`/management-areas?_limit=-1&_sort=managementAreaName`),
        cmsAxios.get(`/event-types?_limit=-1&_sort=eventType`),
        cmsAxios.get(`/access-statuses?_limit=-1&_sort=accessStatus`),
        cmsAxios.get(`/urgencies?_limit=-1&_sort=sequence`),
        cmsAxios.get(`/business-hours`),
        cmsAxios.get(`/advisory-statuses?_limit=-1&_sort=code`),
        cmsAxios.get(`/link-types?_limit=-1&_sort=id`),
      ])
        .then((res) => {
          const protectedAreaData = res[0].data;
          const protectedAreas = protectedAreaData.map((p) => ({
            label: p.protectedAreaName,
            value: p.id,
            type: "protectedArea",
          }));
          const regionData = res[1].data;
          const regions = regionData.map((r) => ({
            label: r.regionName,
            value: r.id,
            type: "region",
            obj: r,
          }));
          const sectionData = res[2].data;
          const sections = sectionData.map((s) => ({
            label: s.sectionName,
            value: s.id,
            type: "section",
            obj: s,
          }));
          const managementAreaData = res[3].data;
          const managementAreas = managementAreaData.map((m) => ({
            label: m.managementAreaName,
            value: m.id,
            type: "managementArea",
            obj: m,
          }));
          const eventTypeData = res[4].data;
          const eventTypes = eventTypeData.map((et) => ({
            label: et.eventType,
            value: et.id,
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
            label: a.accessStatus,
            value: a.id,
          }));
          setAccessStatuses([...accessStatuses]);
          const urgencyData = res[6].data;
          const urgencies = urgencyData.map((u) => ({
            label: u.urgency,
            value: u.id,
          }));
          setUrgencies([...urgencies]);

          setIsAfterHours(calculateAfterHours(res[7].data));
          const advisoryStatusData = res[8].data;
          const advisoryStatuses = advisoryStatusData.map((s) => ({
            code: s.code,
            label: s.advisoryStatus,
            value: s.id,
          }));
          setAdvisoryStatuses([...advisoryStatuses]);
          const linkTypeData = res[9].data;
          const linkTypes = linkTypeData.map((lt) => ({
            label: lt.type,
            value: lt.id,
          }));
          setLinkTypes([...linkTypes]);
          if (mode === "create") {
            setUrgency(urgencyData[0].id);
            setIsLoadingPage(false);
          }
          setSubmittedBy(keycloak.tokenParsed.name);
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
    setSubmittedBy,
    mode,
  ]);

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

  const setLinkIds = () => {
    const linkIds = [];
    linksRef.current.forEach((l) => {
      linkIds.push(l.id);
    });
    setLinks(linkIds);
  };

  const addLink = () => {
    linksRef.current = [...linksRef.current, { title: "", url: "" }];
    setLinkIds();
  };

  const updateLink = (index, field, value) => {
    const tempLinks = [...linksRef.current];
    tempLinks[index][field] = value;
    tempLinks[index].isModified = true;
    linksRef.current = [...tempLinks];
    setLinkIds();
  };

  const removeLink = (index) => {
    let tempLinks = linksRef.current.filter((link, idx) => idx !== index);
    linksRef.current = [...tempLinks];
    setLinkIds();
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
      title: link.title,
      url: link.url,
      type: link.type,
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
      title: link.title,
      url: link.url,
      type: link.type,
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
    for (let link of linksRef.current) {
      if (isValidLink(link)) {
        if (parseInt(link.id) > 0) {
          const savedLink = await saveLink(link, link.id);
          savedLinks.push(savedLink.id);
        } else {
          const savedLink = await createLink(link);
          savedLinks.push(savedLink.id);
        }
      }
    }
    return savedLinks;
  };

  const saveAdvisory = (type) => {
    try {
      if (type === "draft") {
        setIsSavingDraft(true);
      } else if (type === "submit") {
        setIsSubmitting(true);
        if (isAfterHourPublish) type = "publish";
      }
      const { selAdvisoryStatus, confirmationText, published } =
        getAdvisoryFields(type, advisoryStatuses);
      setConfirmationText(confirmationText);
      const { selProtectedAreas, selRegions, selSections, selManagementAreas } =
        getLocationAreas(locations, locationOptions);
      Promise.resolve(saveLinks()).then((savedLinks) => {
        const newAdvisory = {
          title: headline,
          description: description,
          dcTicketNumber: ticketNumber,
          isSafetyRelated: isSafetyRelated,
          listingRank: parseInt(listingRank),
          note: notes,
          submittedBy: submittedBy,
          createdDate: moment().toISOString(),
          createdBy: keycloak.tokenParsed.name,
          advisoryDate: advisoryDate,
          effectiveDate: startDate,
          endDate: endDate,
          expiryDate: expiryDate,
          accessStatus: accessStatus,
          eventType: eventType,
          urgency: urgency,
          protectedAreas: selProtectedAreas,
          advisoryStatus: selAdvisoryStatus,
          links: savedLinks,
          regions: selRegions,
          sections: selSections,
          managementAreas: selManagementAreas,
          isReservationsAffected: isReservationAffected,
          isAdvisoryDateDisplayed: displayAdvisoryDate,
          isEffectiveDateDisplayed: displayStartDate,
          isEndDateDisplayed: displayEndDate,
          published_at: published,
          created_by: keycloak.tokenParsed.name,
        };

        apiAxios
          .post(`api/add/public-advisories`, newAdvisory, {
            headers: { Authorization: `Bearer ${keycloak.idToken}` },
          })
          .then((res) => {
            setAdvisoryId(res.data.id);
            setIsSubmitting(false);
            setIsSavingDraft(false);
            setIsConfirmation(true);
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
    } catch (error) {
      console.log("error occurred", error);
      setToError(true);
      setError({
        status: 500,
        message: "Could not process advisory update",
      });
    }
  };

  const updateAdvisory = () => {
    try {
      setIsSubmitting(true);
      const { confirmationText, published } = getUpdateAdvisoryFields(
        advisoryStatus.Code,
        isAfterHourPublish
      );
      setConfirmationText(confirmationText);
      const { selProtectedAreas, selRegions, selSections, selManagementAreas } =
        getLocationAreas(locations, locationOptions);
      Promise.resolve(saveLinks()).then((savedLinks) => {
        const updatedLinks =
          savedLinks.length > 0 ? [...links, ...savedLinks] : links;
        const updatedAdvisory = {
          title: headline,
          description: description,
          dcTicketNumber: ticketNumber,
          isSafetyRelated: isSafetyRelated,
          listingRank: parseInt(listingRank),
          note: notes,
          submittedBy: submittedBy,
          updatedDate: updatedDate,
          modifiedDate: moment().toISOString(),
          modifiedBy: keycloak.tokenParsed.name,
          advisoryDate: advisoryDate,
          effectiveDate: startDate,
          endDate: endDate,
          expiryDate: expiryDate,
          accessStatus: accessStatus,
          eventType: eventType,
          urgency: urgency,
          protectedAreas: selProtectedAreas,
          advisoryStatus: advisoryStatus,
          links: updatedLinks,
          regions: selRegions,
          sections: selSections,
          managementAreas: selManagementAreas,
          isReservationsAffected: isReservationAffected,
          isAdvisoryDateDisplayed: displayAdvisoryDate,
          isEffectiveDateDisplayed: displayStartDate,
          isEndDateDisplayed: displayEndDate,
          isUpdatedDateDisplayed: displayUpdatedDate,
          published_at: published,
          updated_by: keycloak.tokenParsed.name,
        };

        apiAxios
          .put(`api/update/public-advisories/${id}`, updatedAdvisory, {
            headers: { Authorization: `Bearer ${keycloak.idToken}` },
          })
          .then((res) => {
            setAdvisoryId(res.data.id);
            setIsSubmitting(false);
            setIsSavingDraft(false);
            setIsConfirmation(true);
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
    } catch (error) {
      console.log("error occurred", error);
      setToError(true);
      setError({
        status: 500,
        message: "Could not process advisory update",
      });
    }
  };

  if (toDashboard) {
    return <Redirect to="/bcparks/advisory-dash" />;
  }

  if (toError) {
    return <Redirect to="/bcparks/error" />;
  }

  if (isConfirmation) {
    return (
      <Redirect
        to={{
          pathname: `/bcparks/advisory-summary/${advisoryId}`,
          confirmationText: confirmationText,
        }}
      />
    );
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
