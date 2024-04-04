import moment from "moment";
import { cmsAxios, axios } from "../axios_config";
import {
  addProtectedAreas,
  addProtectedAreasFromArea,
} from "./LocationUtil";
import config from "./config";

export function calculateAfterHours(businessHours) {
  const currentDate = moment().format("YYYY-MM-DD");
  const currentDay = moment().format("dddd");
  const businessStartTime = moment(
    currentDate + " " + businessHours["startTime"]
  );
  const businessEndTime = moment(currentDate + " " + businessHours["endTime"]);
  const businessHour = moment().isBetween(businessStartTime, businessEndTime);
  if (!businessHours[currentDay.toLowerCase()] || !businessHour) {
    return true;
  }
  return false;
}

export function calculateStatHoliday(statData) {
  for (let hol of statData["province"]["holidays"]) {
    if (moment(hol["date"]).isSame(Date.now(), "day")) {
      return true;
    }
  }
  return false;
}

function isLatestStatutoryHolidayList(statData) {
  for (let hol of statData["province"]["holidays"]) {
    if (!moment(hol["date"]).isSame(Date.now(), "year")) {
      return false;
    }
  }
  return true;
}

export function getSubmitterAdvisoryFields(
  type,
  advisoryStatuses,
  setConfirmationText
) {
  let status = {};
  let published = null;
  if (type === "draft") {
    status = advisoryStatuses.filter((s) => s.code === "DFT");
    setConfirmationText("Your advisory has been saved successfully!");
  } else if (type === "publish") {
    status = advisoryStatuses.filter((s) => s.code === "PUB");
    setConfirmationText("Your advisory has been published successfully!");
    published = moment().tz("America/Vancouver");
  } else {
    status = advisoryStatuses.filter((s) => s.code === "ARQ");
    setConfirmationText("Your advisory has been sent for review successfully!");
  }
  return { status: status[0]["value"], published: published };
}

export function getApproverAdvisoryFields(code, setConfirmationText) {
  let published = null;
  if (code === "PUB") {
    setConfirmationText("Your advisory has been published successfully!");
    published = moment().tz("America/Vancouver");
  } else {
    setConfirmationText("Your advisory has been saved successfully!");
  }
  return published;
}

export function generateProtectedAreasListForSelectedRelations(
  selectedRegions,
  selectedSections,
  selectedManagementAreas,
  selectedSites,
  selectedFireCentres,
  selectedFireZones,
  selectedNaturalResourceDistricts,
  managementAreas,
  fireZones,
  sites
) {
  const selProtectedAreas = [];
  const selRegions = [];
  const selSections = [];
  const selManagementAreas = [];
  const selSites = [];
  const selFireCentres = [];
  const selFireZones = [];
  const selNaturalResourceDistricts = [];
  setAreaValues(
    selectedRegions,
    selRegions,
    selProtectedAreas,
    selSites,
    sites,
    managementAreas
  );
  setAreaValues(
    selectedSections,
    selSections,
    selProtectedAreas,
    selSites,
    sites,
    managementAreas
  );
  setAreaValues(
    selectedManagementAreas,
    selManagementAreas,
    selProtectedAreas,
    selSites,
    sites,
    null
  );
  setAreaValues(
    selectedSites,
    selSites,
    selProtectedAreas,
    null,
    null,
    null
  );
  setAreaValues(
    selectedFireCentres,
    selFireCentres,
    selProtectedAreas,
    selSites,
    sites,
    fireZones
  );
  setAreaValues(
    selectedFireZones,
    selFireZones,
    selProtectedAreas,
    selSites,
    sites,
    null
  );
  setAreaValues(
    selectedNaturalResourceDistricts,
    selNaturalResourceDistricts,
    selProtectedAreas,
    selSites,
    sites,
    null
  );  
  return selProtectedAreas;
}

const setAreaValues = (
  areas,
  selAreas,
  selProtectedAreas,
  selSites,
  sites,
  areaList
) => {
  if (areas && areas.length > 0) {
    areas.forEach((a) => {
      selAreas.push(a.value);
      if (a.type === "managementArea" || a.type === "fireZone" || a.type === "naturalResourceDistrict") {
        addProtectedAreas(
          a.obj.protectedAreas,
          sites,
          selProtectedAreas,
          selSites
        );
      } else if (a.type === "site") {
        selProtectedAreas.push(a.obj.attributes.protectedArea.data.id);
      } else if (a.type === "region" || a.type === "section") {
        addProtectedAreasFromArea(
          a.obj,
          "managementAreas",
          selProtectedAreas,
          selSites,
          sites,
          areaList
        );
      } else if (a.type === "fireCentre") {
        addProtectedAreasFromArea(
          a.obj,
          "fireZones",
          selProtectedAreas,
          selSites,
          sites,
          areaList
        );
      }
    });
  }
};

export function calculateIsStatHoliday(
  setIsStatHoliday,
  cmsData,
  setCmsData,
  token
) {
  if (!cmsData.statutoryHolidays) {
    Promise.resolve(
      cmsAxios
        .get(`statutory-holiday`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then((res) => {
          const statData = res.data.data.data;
          if (
            !statData ||
            Object.keys(statData).length === 0 ||
            !isLatestStatutoryHolidayList(statData)
          ) {
            throw new Error("Obsolete Holiday List. Reloading...");
          }
          const data = cmsData;
          data.statutoryHolidays = statData;
          setCmsData(data);
          setIsStatHoliday(calculateStatHoliday(statData));
        })
        .catch((err) => {
          console.log(err);
          // Call Statutory Holiday API if CMS cache is not available
          axios
            .get(config.REACT_APP_STAT_HOLIDAY_API)
            .then((res) => {
              setIsStatHoliday(calculateStatHoliday(res.data));
              const data = cmsData;
              data.statutoryHolidays = res.data;
              setCmsData(data);
              // Write Statutory Data to CMS cache
              cmsAxios
                .put(`statutory-holiday`, { "id": 1, "data": { ...res.data } }, {
                  headers: { Authorization: `Bearer ${token}` }
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
  } else {
    setIsStatHoliday(calculateStatHoliday(cmsData.statutoryHolidays));
  }
}
