import { useState, useRef, useEffect } from "react";
import { apiAxios } from "../../../axios_config";
import { Redirect, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import "./Advisory.css";
import moment from "moment";
import "moment-timezone";
import { useKeycloak } from "@react-keycloak/web";
import {
  calculateAfterHours,
  getApproverAdvisoryFields,
  getLocationSelection,
  getSubmitterAdvisoryFields,
  calculateIsStatHoliday,
  removeLocations,
} from "../../../utils/AdvisoryUtil";
import AdvisoryForm from "../../composite/advisoryForm/AdvisoryForm";
import Header from "../../composite/header/Header";
import { Loader } from "shared-components/build/components/loader/Loader";
import { Button } from "shared-components/build/components/button/Button";
import {
  getProtectedAreas,
  getRegions,
  getSections,
  getManagementAreas,
  getSites,
  getFireCentres,
  getFireZones,
  getEventTypes,
  getAccessStatuses,
  getUrgencies,
  getAdvisoryStatuses,
  getLinkTypes,
  getBusinessHours,
  getStandardMessages,
} from "../../../utils/CmsDataUtil";
import { hasRole } from "../../../utils/AuthenticationUtil";
import { labelCompare } from "../../../utils/AppUtil";
import config from "../../../utils/config";

export default function Advisory({
  mode,
  page: { setError, cmsData, setCmsData },
}) {
  const [advisoryNumber, setAdvisoryNumber] = useState();
  const [revisionNumber, setRevisionNumber] = useState();
  const [standardMessages, setStandardMessages] = useState([]);
  const [selectedStandardMessages, setSelectedStandardMessages] = useState([]);
  const [protectedAreas, setProtectedAreas] = useState([]);
  const [selectedProtectedAreas, setSelectedProtectedAreas] = useState([]);
  const [regions, setRegions] = useState([]);
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [existingRegions, setExistingRegions] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedSections, setSelectedSections] = useState([]);
  const [existingSections, setExistingSections] = useState([]);
  const [managementAreas, setManagementAreas] = useState([]);
  const [selectedManagementAreas, setSelectedManagementAreas] = useState([]);
  const [existingManagementAreas, setExistingManagementAreas] = useState([]);
  const [sites, setSites] = useState([]);
  const [selectedSites, setSelectedSites] = useState([]);
  const [existingSites, setExistingSites] = useState([]);
  const [fireCentres, setFireCentres] = useState([]);
  const [selectedFireCentres, setSelectedFireCentres] = useState([]);
  const [existingFireCentres, setExistingFireCentres] = useState([]);
  const [fireZones, setFireZones] = useState([]);
  const [selectedFireZones, setSelectedFireZones] = useState([]);
  const [existingFireZones, setExistingFireZones] = useState([]);
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
  const [displayAdvisoryDate, setDisplayAdvisoryDate] = useState(true);
  const [startDate, setStartDate] = useState(moment().tz("America/Vancouver"));
  const [displayStartDate, setDisplayStartDate] = useState(false);
  const [endDate, setEndDate] = useState(null);
  const [displayEndDate, setDisplayEndDate] = useState(false);
  const [expiryDate, setExpiryDate] = useState(null);
  const [updatedDate, setUpdatedDate] = useState(
    moment().tz("America/Vancouver")
  );
  const [displayUpdatedDate, setDisplayUpdatedDate] = useState(false);
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
  const [isApprover, setIsApprover] = useState(false);
  const [formError, setFormError] = useState("");
  const [defaultLinkType, setDefaultLinkType] = useState();

  const { id } = useParams();

  useEffect(() => {
    if (initialized && keycloak) {
      Promise.resolve(getBusinessHours(cmsData, setCmsData)).then((res) => {
        setIsAfterHours(calculateAfterHours(res));
      });
      calculateIsStatHoliday(
        setIsStatHoliday,
        cmsData,
        setCmsData,
        keycloak.idToken
      );
    }
  }, [
    keycloak,
    initialized,
    setIsStatHoliday,
    setIsAfterHours,
    cmsData,
    setCmsData,
  ]);

  useEffect(() => {
    if (mode === "update" && !isLoadingData) {
      if (parseInt(id)) {
        setAdvisoryId(id);
        apiAxios
          .get(
            `api/get/public-advisory-audits/${id}?_publicationState=preview`,
            {
              headers: { Authorization: `Bearer ${keycloak.idToken}` },
            }
          )
          .then((res) => {
            linksRef.current = [];
            const advisoryData = res.data;
            setAdvisoryNumber(advisoryData.advisoryNumber);
            setRevisionNumber(advisoryData.revisionNumber);
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
              advisoryDateRef.current = moment(advisoryData.advisoryDate).tz(
                "America/Vancouver"
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

            const standardMessageInfo = advisoryData.standardMessages;
            const protectedAreaInfo = advisoryData.protectedAreas;
            const regionInfo = advisoryData.regions;
            const sectionInfo = advisoryData.sections;
            const managementAreaInfo = advisoryData.managementAreas;
            const siteInfo = advisoryData.sites;
            const fireCentreInfo = advisoryData.fireCentres;
            const fireZoneInfo = advisoryData.fireZones;

            if (standardMessageInfo) {
              const selStandardMessages = [];
              standardMessageInfo.forEach((p) => {
                selStandardMessages.push(
                  standardMessages.find((l) => l.value === p.id)
                );
              });
              setSelectedStandardMessages([...selStandardMessages]);
            }

            if (protectedAreaInfo) {
              const selProtectedAreas = [];
              protectedAreaInfo.forEach((p) => {
                selProtectedAreas.push(
                  protectedAreas.find((l) => l.value === p.id)
                );
              });
              setSelectedProtectedAreas([...selProtectedAreas]);
            }
            if (regionInfo) {
              const selRegions = [];
              regionInfo.forEach((r) => {
                selRegions.push(regions.find((l) => l.value === r.id));
              });
              setSelectedRegions([...selRegions]);
              setExistingRegions([...selRegions]);
            }
            if (sectionInfo) {
              const selSections = [];
              sectionInfo.forEach((s) => {
                selSections.push(sections.find((l) => l.value === s.id));
              });
              setSelectedSections([...selSections]);
              setExistingSections([...selSections]);
            }
            if (managementAreaInfo) {
              const selManagementAreas = [];
              managementAreaInfo.forEach((m) => {
                selManagementAreas.push(
                  managementAreas.find((l) => l.value === m.id)
                );
              });
              setSelectedManagementAreas([...selManagementAreas]);
              setExistingManagementAreas([...selManagementAreas]);
            }
            if (siteInfo) {
              const selSites = [];
              siteInfo.forEach((s) => {
                selSites.push(sites.find((l) => l.value === s.id));
              });
              setSelectedSites([...selSites]);
              setExistingSites([...selSites]);
            }
            if (fireCentreInfo) {
              const selFireCentres = [];
              fireCentreInfo.forEach((f) => {
                selFireCentres.push(fireCentres.find((l) => l.value === f.id));
              });
              setSelectedFireCentres([...selFireCentres]);
              setExistingFireCentres([...selFireCentres]);
            }
            if (fireZoneInfo) {
              const selFireZones = [];
              fireZoneInfo.forEach((f) => {
                selFireZones.push(fireZones.find((l) => l.value === f.id));
              });
              setSelectedFireZones([...selFireZones]);
              setExistingFireZones([...selFireZones]);
            }
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
                    file: l.file,
                    isModified: false,
                    isFileModified: false,
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
    standardMessages,
    setSelectedStandardMessages,
    protectedAreas,
    setSelectedProtectedAreas,
    regions,
    setSelectedRegions,
    sections,
    setSelectedSections,
    managementAreas,
    setSelectedManagementAreas,
    sites,
    setSelectedSites,
    fireCentres,
    setSelectedFireCentres,
    fireZones,
    setSelectedFireZones,
    keycloak,
  ]);

  useEffect(() => {
    if (initialized && keycloak) {
      const approver = hasRole(initialized, keycloak, ["approver"]);
      setIsApprover(approver);
      Promise.all([
        getProtectedAreas(cmsData, setCmsData),
        getRegions(cmsData, setCmsData),
        getSections(cmsData, setCmsData),
        getManagementAreas(cmsData, setCmsData),
        getSites(cmsData, setCmsData),
        getFireCentres(cmsData, setCmsData),
        getFireZones(cmsData, setCmsData),
        getEventTypes(cmsData, setCmsData),
        getAccessStatuses(cmsData, setCmsData),
        getUrgencies(cmsData, setCmsData),
        getAdvisoryStatuses(cmsData, setCmsData),
        getLinkTypes(cmsData, setCmsData),
        getStandardMessages(cmsData, setCmsData),
      ])
        .then((res) => {
          const protectedAreaData = res[0];
          const protectedAreas = protectedAreaData.map((p) => ({
            label: p.protectedAreaName,
            value: p.id,
            type: "protectedArea",
          }));
          setProtectedAreas([...protectedAreas]);
          const regionData = res[1];
          const regions = regionData.map((r) => ({
            label: r.regionName + " Region",
            value: r.id,
            type: "region",
            obj: r,
          }));
          setRegions([...regions]);
          const sectionData = res[2];
          const sections = sectionData.map((s) => ({
            label: s.sectionName + " Section",
            value: s.id,
            type: "section",
            obj: s,
          }));
          setSections([...sections]);
          const managementAreaData = res[3];
          const managementAreas = managementAreaData.map((m) => ({
            label: m.managementAreaName + " Management Area",
            value: m.id,
            type: "managementArea",
            obj: m,
          }));
          setManagementAreas([...managementAreas]);
          const siteData = res[4];
          const sites = siteData.map((s) => ({
            label: s.protectedArea.protectedAreaName + ": " + s.siteName,
            value: s.id,
            type: "site",
            obj: s,
          }));
          sites.sort(labelCompare);
          setSites([...sites]);
          const fireCentreData = res[5];
          const fireCentres = fireCentreData.map((f) => ({
            label: f.fireCentreName,
            value: f.id,
            type: "fireCentre",
            obj: f,
          }));
          setFireCentres([...fireCentres]);
          const fireZoneData = res[6];
          const fireZones = fireZoneData.map((f) => ({
            label: f.fireZoneName,
            value: f.id,
            type: "fireZone",
            obj: f,
          }));
          setFireZones([...fireZones]);
          const eventTypeData = res[7];
          const eventTypes = eventTypeData.map((et) => ({
            label: et.eventType,
            value: et.id,
          }));
          setEventTypes([...eventTypes]);
          const accessStatusData = res[8];
          const accessStatuses = accessStatusData.map((a) => ({
            label: a.accessStatus,
            value: a.id,
          }));
          setAccessStatuses([...accessStatuses]);
          const accessStatus = accessStatuses.filter((a) => a.label === "Open");
          setAccessStatus(accessStatus[0].value);
          const urgencyData = res[9];
          const urgencies = urgencyData.map((u) => ({
            label: u.urgency,
            value: u.id,
          }));
          setUrgencies([...urgencies]);
          const advisoryStatusData = res[10];
          const restrictedAdvisoryStatusCodes = ["INA", "APR"];
          const tempAdvisoryStatuses = advisoryStatusData.map((s) => {
            let result = null;
            if (restrictedAdvisoryStatusCodes.includes(s.code) && approver) {
              result = {
                code: s.code,
                label: s.advisoryStatus,
                value: s.id,
              };
            } else if (!restrictedAdvisoryStatusCodes.includes(s.code)) {
              result = {
                code: s.code,
                label: s.advisoryStatus,
                value: s.id,
              };
            }
            return result;
          });
          const advisoryStatuses = tempAdvisoryStatuses.filter(
            (s) => s !== null
          );
          setAdvisoryStatuses([...advisoryStatuses]);
          const linkTypeData = res[11];
          const linkTypes = linkTypeData.map((lt) => ({
            label: lt.type,
            value: lt.id,
          }));
          setLinkTypes([...linkTypes]);
          const linkType = linkTypes.filter((l) => l.label === "General");
          if (linkType.length > 0) {
            setDefaultLinkType(linkType[0].value);
          }

          const standardMessageData = res[12];
          const standardMessages = standardMessageData.map((m) => ({
            label: m.title,
            value: m.id,
            type: "standardMessage",
            obj: m,
          }));
          setStandardMessages([...standardMessages]);
          if (mode === "create") {
            const defaultUrgency = urgencies.filter((u) => u.label === "Low");
            if (defaultUrgency.length > 0) {
              setUrgency(defaultUrgency[0].value);
            }
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
    setStandardMessages,
    setProtectedAreas,
    setRegions,
    setSections,
    setManagementAreas,
    setSites,
    setFireCentres,
    setFireZones,
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
    cmsData,
    setCmsData,
    setIsApprover,
  ]);

  const setToBack = () => {
    if (mode === "create") {
      setToDashboard(true);
    } else {
      setIsConfirmation(true);
    }
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
      if (l.id) {
        linkIds.push(l.id);
      }
    });
    setLinks(linkIds);
  };

  const addLink = () => {
    linksRef.current = [
      ...linksRef.current,
      { title: "", url: "", type: defaultLinkType },
    ];
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

  const handleFileCapture = (files, index) => {
    const tempLinks = [...linksRef.current];
    tempLinks[index]["file"] = files[0];
    tempLinks[index].isFileModified = true;
    linksRef.current = [...tempLinks];
    setLinkIds();
  };

  const calculateExpiryDate = () => {
    setEndDate(
      moment(advisoryDateRef.current).add(
        durationIntervalRef.current,
        durationUnitRef.current
      )
    );
  };

  const isValidLink = (link) => {
    if (
      (link.title !== "" && link.url !== "" && link.isModified) ||
      (link.file && link.isFileModified)
    ) {
      return true;
    }
    return false;
  };

  const createLink = async (link) => {
    if (link.isFileModified) {
      const id = await preSaveMediaLink(link);
      const res = await saveMediaAttachment(id, link);
      return res;
    } else {
      const linkRequest = {
        title: link.title,
        url: link.url.startsWith("http") ? link.url : "https://" + link.url,
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
    }
  };

  const saveLink = async (link, id) => {
    if (link.isFileModified) {
      const res = await saveMediaAttachment(id, link);
      return res;
    } else {
      const linkRequest = {
        title: link.title,
        url: link.url.startsWith("http") ? link.url : "https://" + link.url,
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
    }
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

  const getAdvisoryFields = (type) => {
    let publishedDate = null;
    let adStatus = advisoryStatus;
    if (isApprover) {
      setIsSubmitting(true);
      const status = advisoryStatuses.filter((s) => s.value === advisoryStatus);
      publishedDate = getApproverAdvisoryFields(
        status[0]["code"],
        setConfirmationText
      );
    } else {
      if (type === "draft") {
        setIsSavingDraft(true);
      } else if (type === "submit") {
        setIsSubmitting(true);
        if (isAfterHourPublish) type = "publish";
      }
      const { status, published } = getSubmitterAdvisoryFields(
        type,
        advisoryStatuses,
        setConfirmationText
      );
      publishedDate = published;
      adStatus = status;
    }
    return { published: publishedDate, status: adStatus };
  };
  const saveAdvisory = (type) => {
    try {
      const { status } = getAdvisoryFields(type);
      const {
        selProtectedAreas,
        selRegions,
        selSections,
        selManagementAreas,
        selSites,
        selFireCentres,
        selFireZones,
      } = getLocationSelection(
        selectedProtectedAreas,
        selectedRegions,
        selectedSections,
        selectedManagementAreas,
        selectedSites,
        selectedFireCentres,
        selectedFireZones,
        managementAreas,
        fireZones,
        sites
      );
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
          accessStatus: accessStatus ? accessStatus : null,
          eventType: eventType,
          urgency: urgency,
          standardMessages: selectedStandardMessages.map((s) => s.value),
          protectedAreas: selProtectedAreas,
          advisoryStatus: status,
          links: savedLinks,
          regions: selRegions,
          sections: selSections,
          managementAreas: selManagementAreas,
          sites: selSites,
          fireCentres: selFireCentres,
          fireZones: selFireZones,
          isReservationsAffected: isReservationAffected,
          isAdvisoryDateDisplayed: displayAdvisoryDate,
          isEffectiveDateDisplayed: displayStartDate,
          isEndDateDisplayed: displayEndDate,
          published_at: new Date(),
          isLatestRevision: true,
          created_by: keycloak.tokenParsed.name,
        };

        apiAxios
          .post(`api/add/public-advisory-audits`, newAdvisory, {
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

  const updateAdvisory = (type) => {
    try {
      const { status } = getAdvisoryFields(type);
      const { updatedProtectedAreas, updatedSites } = removeLocations(
        selectedProtectedAreas,
        selectedRegions,
        existingRegions,
        selectedSections,
        existingSections,
        selectedManagementAreas,
        existingManagementAreas,
        selectedSites,
        existingSites,
        selectedFireCentres,
        existingFireCentres,
        selectedFireZones,
        existingFireZones,
        managementAreas,
        fireZones,
        sites
      );
      const {
        selProtectedAreas,
        selRegions,
        selSections,
        selManagementAreas,
        selSites,
        selFireCentres,
        selFireZones,
      } = getLocationSelection(
        updatedProtectedAreas,
        selectedRegions,
        selectedSections,
        selectedManagementAreas,
        updatedSites,
        selectedFireCentres,
        selectedFireZones,
        managementAreas,
        fireZones,
        sites
      );

      if (
        (!selProtectedAreas || selProtectedAreas.length === 0) &&
        (!selSites || selSites.length === 0)
      ) {
        setSelectedProtectedAreas([]);
        setSelectedSites([]);
        setIsSubmitting(false);
        setIsSavingDraft(false);
        setFormError("Please select at least one Location!!");
      } else {
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
            standardMessages: selectedStandardMessages.map((s) => s.value),
            protectedAreas: selProtectedAreas,
            advisoryStatus: status,
            links: updatedLinks,
            regions: selRegions,
            sections: selSections,
            managementAreas: selManagementAreas,
            sites: selSites,
            fireCentres: selFireCentres,
            fireZones: selFireZones,
            isReservationsAffected: isReservationAffected,
            isAdvisoryDateDisplayed: displayAdvisoryDate,
            isEffectiveDateDisplayed: displayStartDate,
            isEndDateDisplayed: displayEndDate,
            isUpdatedDateDisplayed: displayUpdatedDate,
            published_at: new Date(),
            isLatestRevision: true,
            updated_by: keycloak.tokenParsed.name,
          };

          apiAxios
            .put(`api/update/public-advisory-audits/${id}`, updatedAdvisory, {
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
      }
    } catch (error) {
      console.log("error occurred", error);
      setToError(true);
      setError({
        status: 500,
        message: "Could not process advisory update",
      });
    }
  };

  const preSaveMediaLink = async (link) => {
    const linkRequest = {
      type: link.type,
      title: link.title,
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
          message: "Could not save attachments",
        });
      });
    return res.data.id;
  };

  const updateMediaLink = async (media, id, link) => {
    const linkRequest = {
      title: link.title ? link.title : media.name,
      type: link.type,
      url: config.REACT_APP_CMS_BASE_URL + media.url,
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
          message: "Could not save attachments",
        });
      });
    return res.data;
  };

  const saveMediaAttachment = async (id, link) => {
    const mediaResponse = await uploadMedia(id, link.file);
    const updateLinkResponse = await updateMediaLink(mediaResponse, id, link);
    return updateLinkResponse;
  };

  const uploadMedia = async (id, file) => {
    const fileForm = new FormData();
    fileForm.append("refId", id);
    fileForm.append("ref", "link");
    fileForm.append("field", "file");
    fileForm.append("files", file);

    const res = await apiAxios
      .post(`api/upload/upload`, fileForm, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${keycloak.idToken}`,
        },
      })
      .catch((error) => {
        console.log("error occurred", error);
        setToError(true);
        setError({
          status: 500,
          message: "Could not save attachments",
        });
      });
    if (res.data.length > 0) {
      return res.data[0];
    } else {
      setToError(true);
      setError({
        status: 500,
        message: "Could not save attachments",
      });
    }
  };

  if (toDashboard) {
    return (
      <Redirect
        push
        to={{
          pathname: `/bcparks/dashboard`,
          index: 0,
        }}
      />
    );
  }

  if (toError) {
    return <Redirect push to="/bcparks/error" />;
  }

  if (isConfirmation) {
    return (
      <Redirect
        push
        to={{
          pathname: `/bcparks/advisory-summary/${advisoryId}`,
          confirmationText: confirmationText,
          index: 0,
        }}
      />
    );
  }

  return (
    <main>
      <Header />
      <br />
      <div className="Advisory" data-testid="Advisory">
        <div className="container">
          {isLoadingPage && (
            <div className="page-loader">
              <Loader page />
            </div>
          )}
          {!isLoadingPage && (
            <>
              <div className="container-fluid">
                <Button
                  label="Back"
                  styling="bcgov-normal-white btn mt10"
                  onClick={() => {
                    setToBack();
                  }}
                />
              </div>
              <AdvisoryForm
                mode={mode}
                data={{
                  advisoryNumber,
                  revisionNumber,
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
                  setToBack,
                  formError,
                  setFormError,
                }}
              />
            </>
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
    cmsData: PropTypes.object.isRequired,
    setCmsData: PropTypes.func.isRequired,
  }).isRequired,
};
