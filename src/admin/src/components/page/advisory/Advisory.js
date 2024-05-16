import { useState, useRef, useEffect } from "react";
import { cmsAxios } from "../../../axios_config";
import { Redirect, useParams, useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import "./Advisory.css";
import moment from "moment";
import "moment-timezone";
import { useKeycloak } from "@react-keycloak/web";
import {
  calculateAfterHours,
  getApproverAdvisoryFields,
  getSubmitterAdvisoryFields,
  calculateIsStatHoliday,
} from "../../../utils/AdvisoryUtil";
import AdvisoryForm from "../../composite/advisoryForm/AdvisoryForm";
import Header from "../../composite/header/Header";
import { Loader } from "../../shared/loader/Loader";
import {
  getProtectedAreas,
  getRegions,
  getSections,
  getManagementAreas,
  getSites,
  getFireCentres,
  getFireZones,
  getNaturalResourceDistricts,
  getEventTypes,
  getAccessStatuses,
  getUrgencies,
  getAdvisoryStatuses,
  getLinkTypes,
  getBusinessHours,
  getStandardMessages,
} from "../../../utils/CmsDataUtil";
import { hasRole } from "../../../utils/AuthenticationUtil";
import { labelCompare, camelCaseToSentenceCase } from "../../../utils/AppUtil";
import config from "../../../utils/config";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import qs from "qs";

export default function Advisory({
  mode,
  page: { setError, cmsData, setCmsData },
}) {
  const [revisionNumber, setRevisionNumber] = useState();
  const [standardMessages, setStandardMessages] = useState([]);
  const [selectedStandardMessages, setSelectedStandardMessages] = useState([]);
  const [protectedAreas, setProtectedAreas] = useState([]);
  const [selectedProtectedAreas, setSelectedProtectedAreas] = useState([]);
  const [regions, setRegions] = useState([]);
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedSections, setSelectedSections] = useState([]);
  const [managementAreas, setManagementAreas] = useState([]);
  const [selectedManagementAreas, setSelectedManagementAreas] = useState([]);
  const [sites, setSites] = useState([]);
  const [selectedSites, setSelectedSites] = useState([]);
  const [fireCentres, setFireCentres] = useState([]);
  const [selectedFireCentres, setSelectedFireCentres] = useState([]);
  const [fireZones, setFireZones] = useState([]);
  const [selectedFireZones, setSelectedFireZones] = useState([]);
  const [naturalResourceDistricts, setNaturalResourceDistricts] = useState([]);
  const [selectedNaturalResourceDistricts, setSelectedNaturalResourceDistricts] = useState([]);
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
  const [headline, setHeadline] = useState("");
  const [description, setDescription] = useState("");
  const [isSafetyRelated, setIsSafetyRelated] = useState(false);
  const [advisoryDate, setAdvisoryDate] = useState(
    moment().tz("America/Vancouver").toDate()
  );
  const [displayAdvisoryDate, setDisplayAdvisoryDate] = useState(true);
  const [startDate, setStartDate] = useState(null);
  const [displayStartDate, setDisplayStartDate] = useState(false);
  const [endDate, setEndDate] = useState(null);
  const [displayEndDate, setDisplayEndDate] = useState(false);
  const [expiryDate, setExpiryDate] = useState(null);
  const [updatedDate, setUpdatedDate] = useState(null);
  const [displayUpdatedDate, setDisplayUpdatedDate] = useState(false);
  const [notes, setNotes] = useState("");
  const [submittedBy, setSubmittedBy] = useState("");
  const [submitter, setSubmitter] = useState("")
  const [listingRank, setListingRank] = useState(0);
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
  const advisoryDateRef = useRef(moment().tz("America/Vancouver").toDate());
  const [advisoryId, setAdvisoryId] = useState();
  const [isApprover, setIsApprover] = useState(false);
  const [formError, setFormError] = useState("");

  const { id } = useParams();
  const history = useHistory();

  const query = qs.stringify({
    publicationState: "preview",
    populate: {
      accessStatus: { populate: "*" },
      advisoryStatus: { populate: "*" },
      eventType: { populate: "*" },
      fireCentres: { fields: ["id"] },
      fireZones: { fields: ["id"] },
      naturalResourceDistricts: { fields: ["id"] },
      links: { populate: { type: { populate: "*" }, file: { populate: "*" } } },
      urgency: { populate: "*" },
      managementAreas: { fields: ["id"] },
      protectedAreas: { fields: ["id"] },
      regions: { fields: ["id"] },
      sections: { fields: ["id"] },
      sites: { fields: ["id"] },
      standardMessages: { populate: "*" },
    },
  }, {
    encodeValuesOnly: true,
  });

  useEffect(() => {
    if (initialized && keycloak) {
      Promise.resolve(getBusinessHours(cmsData, setCmsData)).then((res) => {
        setIsAfterHours(calculateAfterHours(res));
      });
      calculateIsStatHoliday(
        setIsStatHoliday,
        cmsData,
        setCmsData,
        keycloak.token
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
        cmsAxios
          .get(
            `public-advisory-audits/${id}?${query}`,
            {
              headers: { Authorization: `Bearer ${keycloak.token}` }
            }
          )
          .then((res) => {
            linksRef.current = [];
            const advisoryData = res.data.data;
            setRevisionNumber(advisoryData.revisionNumber);
            setHeadline(advisoryData.title || "");
            setDescription(advisoryData.description || "");
            if (advisoryData.isSafetyRelated) {
              setIsSafetyRelated(advisoryData.isSafetyRelated);
            }
            setListingRank(
              advisoryData.listingRank ? advisoryData.listingRank : 0
            );
            setNotes(advisoryData.note || "");
            setSubmittedBy(advisoryData.submittedBy || "");
            if (advisoryData.advisoryDate) {
              setAdvisoryDate(
                moment(advisoryData.advisoryDate).tz("America/Vancouver").toDate()
              );
              advisoryDateRef.current =
                moment(advisoryData.advisoryDate).tz("America/Vancouver").toDate();
            }
            if (advisoryData.effectiveDate) {
              setStartDate(
                moment(advisoryData.effectiveDate).tz("America/Vancouver").toDate()
              );
            }
            if (advisoryData.endDate) {
              setEndDate(
                moment(advisoryData.endDate).tz("America/Vancouver").toDate()
              );
            }

            if (advisoryData.expiryDate) {
              setExpiryDate(
                moment(advisoryData.expiryDate).tz("America/Vancouver").toDate()
              );
            }
            if (advisoryData.updatedDate) {
              setUpdatedDate(
                moment(advisoryData.updatedDate).tz("America/Vancouver").toDate()
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
            const naturalResourceDistrictInfo = advisoryData.naturalResourceDistricts;

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
            }
            if (sectionInfo) {
              const selSections = [];
              sectionInfo.forEach((s) => {
                selSections.push(sections.find((l) => l.value === s.id));
              });
              setSelectedSections([...selSections]);
            }
            if (managementAreaInfo) {
              const selManagementAreas = [];
              managementAreaInfo.forEach((m) => {
                selManagementAreas.push(
                  managementAreas.find((l) => l.value === m.id)
                );
              });
              setSelectedManagementAreas([...selManagementAreas]);
            }
            if (siteInfo) {
              const selSites = [];
              siteInfo.forEach((s) => {
                selSites.push(sites.find((l) => l.value === s.id));
              });
              setSelectedSites([...selSites]);
            }
            if (fireCentreInfo) {
              const selFireCentres = [];
              fireCentreInfo.forEach((f) => {
                selFireCentres.push(fireCentres.find((l) => l.value === f.id));
              });
              setSelectedFireCentres([...selFireCentres]);
            }
            if (fireZoneInfo) {
              const selFireZones = [];
              fireZoneInfo.forEach((f) => {
                selFireZones.push(fireZones.find((l) => l.value === f.id));
              });
              setSelectedFireZones([...selFireZones]);
            }
            if (naturalResourceDistrictInfo) {
              const selNaturalResourceDistricts = [];
              naturalResourceDistrictInfo.forEach((f) => {
                selNaturalResourceDistricts.push(naturalResourceDistricts.find((l) => l.value === f.id));
              });
              setSelectedNaturalResourceDistricts([...selNaturalResourceDistricts]);
            }            
            const links = advisoryData.links;
            if (links.length > 0) {
              links.forEach((l) => {
                linksRef.current = [
                  ...linksRef.current,
                  {
                    type: l.type.id,
                    title: l.title || "",
                    url: l.url || "",
                    id: l.id,
                    file: l.file || "",
                    format: l.format || "",
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
    query,
    mode,
    setHeadline,
    setDescription,
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
    naturalResourceDistricts,
    setSelectedNaturalResourceDistricts,
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
        getNaturalResourceDistricts(cmsData, setCmsData),
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
            orcs: p.orcs
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
            label: s?.attributes.protectedArea?.data?.attributes.protectedAreaName + ": " + s.attributes.siteName,
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
          const naturalResourceDistrictData = res[7];
          const naturalResourceDistricts = naturalResourceDistrictData.map((f) => ({
            label: f.naturalResourceDistrictName,
            value: f.id,
            type: "naturalResourceDistrict",
            obj: f,
          }));
          setNaturalResourceDistricts([...naturalResourceDistricts]);
          const eventTypeData = res[8];
          const eventTypes = eventTypeData.map((et) => ({
            label: et.eventType,
            value: et.id,
          }));
          setEventTypes([...eventTypes]);
          const accessStatusData = res[9];
          const accessStatuses = accessStatusData.map((a) => ({
            label: a.accessStatus,
            value: a.id,
          }));
          setAccessStatuses([...accessStatuses]);
          const accessStatus = accessStatuses.filter((a) => a.label === "Open");
          setAccessStatus(accessStatus[0].value);
          const urgencyData = res[10];
          const urgencies = urgencyData.map((u) => ({
            label: u.urgency,
            value: u.id,
            sequence: u.sequence
          }));
          setUrgencies([...urgencies]);
          const advisoryStatusData = res[11];
          const restrictedAdvisoryStatusCodes = ["INA", "APR"];
          const desiredOrder = ['PUB', 'INA', 'DFT', 'APR', 'ARQ'];
          const tempAdvisoryStatuses = advisoryStatusData.map((s) => {
            let result = {};
            if (restrictedAdvisoryStatusCodes.includes(s.code) && approver) {
              result = {
                code: s.code,
                label: camelCaseToSentenceCase(s.advisoryStatus),
                value: s.id,
              };
            } else if (!restrictedAdvisoryStatusCodes.includes(s.code)) {
              result = {
                code: s.code,
                label: camelCaseToSentenceCase(s.advisoryStatus),
                value: s.id,
              };
            }
            return result;
          });
          const sortedStatus = tempAdvisoryStatuses.sort(
            (a, b) => desiredOrder.indexOf(a.code) - desiredOrder.indexOf(b.code)
          );
          const advisoryStatuses = sortedStatus.filter(
            (s) => s !== null
          );
          setAdvisoryStatuses([...advisoryStatuses]);
          const linkTypeData = res[12];
          const linkTypes = linkTypeData.map((lt) => ({
            label: lt.type,
            value: lt.id,
          }));
          setLinkTypes([...linkTypes]);
          const standardMessageData = res[13];
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
            setStartDate(moment().tz("America/Vancouver").toDate());
            setIsLoadingPage(false);
          }
          setSubmitter(keycloak.tokenParsed.name);
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
    setNaturalResourceDistricts,
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

  const handleMenuChange = (event, val) => {
    switch (val) {
      case 0:
        history.push('/advisories');
        break;
      case 1:
        history.push('/park-access-status');
        break;
      case 2:
        history.push('/activities-and-facilities');
        break;
      default:
        history.push('/');
    }
  };

  const handleAdvisoryDateChange = (e) => {
    setAdvisoryDate(e);
    advisoryDateRef.current = e;
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

  const addLink = (format) => {
    linksRef.current = [
      ...linksRef.current,
      { title: "", url: "", format: format },
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
        data: {
          title: link.title,
          url: link.url.startsWith("http") ? link.url : "https://" + link.url,
          type: link.type,
        }
      }
      const res = await cmsAxios
        .post(`links`, linkRequest, {
          headers: { Authorization: `Bearer ${keycloak.token}` }
        })
        .catch((error) => {
          console.log("error occurred", error);
          setToError(true);
          setError({
            status: 500,
            message: "Could not process advisory update",
          });
        });
      return res.data.data;
    }
  };

  const saveLink = async (link, id) => {
    if (link.isFileModified) {
      const res = await saveMediaAttachment(id, link);
      return res;
    } else {
      const linkRequest = {
        data: {
          title: link.title,
          url: link.url.startsWith("http") ? link.url : "https://" + link.url,
          type: link.type,
        }
      };
      const res = await cmsAxios
        .put(`links/${id}`, linkRequest, {
          headers: { Authorization: `Bearer ${keycloak.token}` }
        })
        .catch((error) => {
          console.log("error occurred", error);
          setToError(true);
          setError({
            status: 500,
            message: "Could not process advisory update",
          });
        });
      return res.data.data;
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

      const selProtectedAreas = selectedProtectedAreas.map(x => x.value);
      const selRegions = selectedRegions.map(x => x.value);
      const selSections = selectedSections.map(x => x.value);
      const selManagementAreas = selectedManagementAreas.map(x => x.value);
      const selSites = selectedSites.map(x => x.value);
      const selFireCentres = selectedFireCentres.map(x => x.value);
      const selFireZones = selectedFireZones.map(x => x.value);
      const selNaturalResourceDistricts = selectedNaturalResourceDistricts.map(x => x.value);

      Promise.resolve(saveLinks()).then((savedLinks) => {
        const newAdvisory = {
          title: headline,
          description: description,
          revisionNumber: revisionNumber,
          isSafetyRelated: isSafetyRelated,
          listingRank: listingRank ? parseInt(listingRank) : 0,
          note: notes,
          submittedBy: submittedBy ? submittedBy : submitter,
          createdDate: moment().toISOString(),
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
          naturalResourceDistricts: selNaturalResourceDistricts,
          isAdvisoryDateDisplayed: displayAdvisoryDate,
          isEffectiveDateDisplayed: displayStartDate,
          isEndDateDisplayed: displayEndDate,
          published_at: new Date(),
          isLatestRevision: true,
          createdByName: keycloak.tokenParsed.name,
          createdByRole: isApprover ? "approver" : "submitter",
          isUrgentAfterHours: !isApprover && (isAfterHours || isStatHoliday) && isAfterHourPublish
        };

        cmsAxios // -audit OR -audits
          .post(`public-advisory-audits`, { data: newAdvisory }, {
            headers: { Authorization: `Bearer ${keycloak.token}` }
          })
          .then((res) => {
            setAdvisoryId(res.data.data.id);
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
      const selProtectedAreas = selectedProtectedAreas.map(x => x.value);
      const selRegions = selectedRegions.map(x => x.value);
      const selSections = selectedSections.map(x => x.value);
      const selManagementAreas = selectedManagementAreas.map(x => x.value);
      const selSites = selectedSites.map(x => x.value);
      const selFireCentres = selectedFireCentres.map(x => x.value);
      const selFireZones = selectedFireZones.map(x => x.value);
      const selNaturalResourceDistricts = selectedNaturalResourceDistricts.map(x => x.value);

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
            revisionNumber: revisionNumber,
            isSafetyRelated: isSafetyRelated,
            listingRank: listingRank ? parseInt(listingRank) : 0,
            note: notes,
            submittedBy: submittedBy,
            updatedDate: updatedDate,
            modifiedDate: moment().toISOString(),
            modifiedBy: keycloak.tokenParsed.name,
            modifiedByRole: isApprover ? "approver" : "submitter",
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
            naturalResourceDistricts: selNaturalResourceDistricts,
            isAdvisoryDateDisplayed: displayAdvisoryDate,
            isEffectiveDateDisplayed: displayStartDate,
            isEndDateDisplayed: displayEndDate,
            isUpdatedDateDisplayed: displayUpdatedDate,
            publishedAt: new Date(),
            isLatestRevision: true
          };

          if (!isApprover && (isAfterHours || isStatHoliday) && isAfterHourPublish) {
            updatedAdvisory.isUrgentAfterHours = true;
          }

          cmsAxios
            .put(`public-advisory-audits/${id}`, { data: updatedAdvisory }, {
              headers: { Authorization: `Bearer ${keycloak.token}` }
            })
            .then((res) => {
              setAdvisoryId(res.data.data.id);
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
      data: {
        type: link.type,
        title: link.title,
      }
    };
    const res = await cmsAxios
      .post(`links`, linkRequest, {
        headers: { Authorization: `Bearer ${keycloak.token}` }
      })
      .catch((error) => {
        console.log("error occurred", error);
        setToError(true);
        setError({
          status: 500,
          message: "Could not save attachments",
        });
      });
    return res.data.data.id;
  };

  const updateMediaLink = async (media, id, link) => {
    const isProtocolExist = /(https|http?)/gi;

    const path = media.url?.match(isProtocolExist);
    const getUrl = path?.length ? media.url : config.REACT_APP_CMS_BASE_URL + media.url

    const linkRequest = {
      data: {
        title: link.title ? link.title : media.name,
        type: link.type,
        url: getUrl,
      }
    };

    const res = await cmsAxios
      .put(`links/${id}`, linkRequest, {
        headers: { Authorization: `Bearer ${keycloak.token}` }
      })
      .catch((error) => {
        console.log("error occurred", error);
        setToError(true);
        setError({
          status: 500,
          message: "Could not save attachments",
        });
      });
    return res.data.data;
  };

  const saveMediaAttachment = async (id, link) => {
    const mediaResponse = await uploadMedia(id, link.file);
    const updateLinkResponse = await updateMediaLink(mediaResponse, id, link);
    return updateLinkResponse;
  };

  const uploadMedia = async (id, file) => {
    const data = {};
    const fileForm = new FormData();
    data["refId"] = id;
    data["ref"] = "link";
    data["field"] = "file";
    fileForm.append("files", file);
    fileForm.append("data", JSON.stringify(data));

    const res = await cmsAxios
      .post(`upload`, fileForm, { // or { 'data': fileForm }
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${keycloak.token}`,
        }
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
          pathname: `/advisories`,
          index: 0,
        }}
      />
    );
  }

  if (toError) {
    return <Redirect push to="/error" />;
  }

  if (isConfirmation) {
    return (
      <Redirect
        push
        to={{
          pathname: `/advisory-summary/${advisoryId}`,
          confirmationText: confirmationText,
          index: 0,
        }}
      />
    );
  }

  return (
    <main>
      <Header handleTabChange={handleMenuChange} />
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
                <button
                  type="button"
                  className="btn btn-link btn-back mt-4"
                  onClick={() => {
                    setToBack();
                    sessionStorage.clear();
                  }}>
                  <ArrowBackIcon className="mr-1" />
                  Back to {mode === "create" ? "public advisories" : "advisory preview"}
                </button>
                <h2 className="mt-5 mb-0">
                  {mode === "create" ? "Create a new" : "Edit"} advisory
                </h2>
                <small className="small-text">
                  <span className="required">*</span> indicates a required field
                </small>
              </div>
              <AdvisoryForm
                mode={mode}
                data={{
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
                  naturalResourceDistricts,
                  selectedNaturalResourceDistricts,
                  setSelectedNaturalResourceDistricts,
                  urgencies,
                  urgency,
                  setUrgency,
                  isSafetyRelated,
                  setIsSafetyRelated,
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