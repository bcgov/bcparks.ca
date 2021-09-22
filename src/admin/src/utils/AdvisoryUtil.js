import moment from "moment";
import { apiAxios, axios } from "../axios_config";
import {
  addProtectedAreas,
  addProtectedAreasFromArea,
  removeProtectedAreas,
  removeProtectedAreasFromArea,
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

export function getLocationSelection(
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
) {
  const selProtectedAreas = [];
  const selRegions = [];
  const selSections = [];
  const selManagementAreas = [];
  const selSites = [];
  const selFireCentres = [];
  const selFireZones = [];
  setAreaValues(
    selectedProtectedAreas,
    selProtectedAreas,
    null,
    null,
    null,
    null
  );
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
  setAreaValues(selectedSites, selSites, selProtectedAreas, null, null, null);
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
  return {
    selProtectedAreas,
    selRegions,
    selSections,
    selManagementAreas,
    selSites,
    selFireCentres,
    selFireZones,
  };
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
      if (a.type === "managementArea" || a.type === "fireZone") {
        addProtectedAreas(
          a.obj.protectedAreas,
          sites,
          selProtectedAreas,
          selSites
        );
      } else if (a.type === "site") {
        selProtectedAreas.push(a.obj.protectedArea.id);
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

const removeAreaValues = (
  existingAreas,
  selectedAreas,
  areaList,
  sites,
  updatedProtectedAreas,
  updatedSites
) => {
  if (existingAreas && existingAreas.length > 0) {
    existingAreas.forEach((a) => {
      if (!selectedAreas.includes(a)) {
        if (a.type === "managementArea" || a.type === "fireZone") {
          let response = removeProtectedAreas(
            a.obj.protectedAreas,
            updatedProtectedAreas,
            sites,
            updatedSites
          );
          updatedProtectedAreas = response.updatedProtectedAreas;
          updatedSites = response.updatedSites;
        } else if (a.type === "site") {
          updatedProtectedAreas = updatedProtectedAreas.filter(
            (p) => a.obj.protectedArea.id !== p.value
          );
        } else if (a.type === "region" || a.type === "section") {
          let response = removeProtectedAreasFromArea(
            a.obj,
            "managementAreas",
            updatedProtectedAreas,
            areaList,
            sites,
            updatedSites
          );
          updatedProtectedAreas = response.updatedProtectedAreas;
          updatedSites = response.updatedSites;
        } else if (a.type === "fireCentre") {
          let response = removeProtectedAreasFromArea(
            a.obj,
            "fireZones",
            updatedProtectedAreas,
            areaList,
            sites,
            updatedSites
          );
          updatedProtectedAreas = response.updatedProtectedAreas;
          updatedSites = response.updatedSites;
        }
      }
    });
  }
  return {
    updatedProtectedAreas: updatedProtectedAreas,
    updatedSites: updatedSites,
  };
};

export function removeLocations(
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
) {
  let updatedProtectedAreas = selectedProtectedAreas;
  let updatedSites = selectedSites;
  let response = removeAreaValues(
    existingRegions,
    selectedRegions,
    managementAreas,
    sites,
    updatedProtectedAreas,
    updatedSites
  );
  updatedProtectedAreas = response.updatedProtectedAreas;
  updatedSites = response.updatedSites;
  response = removeAreaValues(
    existingSections,
    selectedSections,
    managementAreas,
    sites,
    updatedProtectedAreas,
    updatedSites
  );
  updatedProtectedAreas = response.updatedProtectedAreas;
  updatedSites = response.updatedSites;
  response = removeAreaValues(
    existingManagementAreas,
    selectedManagementAreas,
    null,
    sites,
    updatedProtectedAreas,
    updatedSites
  );
  updatedProtectedAreas = response.updatedProtectedAreas;
  updatedSites = response.updatedSites;
  response = removeAreaValues(
    existingSites,
    selectedSites,
    null,
    null,
    updatedProtectedAreas,
    updatedSites
  );
  updatedProtectedAreas = response.updatedProtectedAreas;
  updatedSites = response.updatedSites;
  response = removeAreaValues(
    existingFireCentres,
    selectedFireCentres,
    fireZones,
    sites,
    updatedProtectedAreas,
    updatedSites
  );
  updatedProtectedAreas = response.updatedProtectedAreas;
  updatedSites = response.updatedSites;
  response = removeAreaValues(
    existingFireZones,
    selectedFireZones,
    null,
    sites,
    updatedProtectedAreas,
    updatedSites
  );
  updatedProtectedAreas = response.updatedProtectedAreas;
  updatedSites = response.updatedSites;
  return { updatedProtectedAreas, updatedSites };
}

export function calculateIsStatHoliday(
  setIsStatHoliday,
  cmsData,
  setCmsData,
  token
) {
  if (!cmsData.statutoryHolidays) {
    Promise.resolve(
      apiAxios
        .get(`api/get/statutory-holidays`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const statData = res.data.data;
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
              const statInfo = { data: res.data };
              setIsStatHoliday(calculateStatHoliday(res.data));
              const data = cmsData;
              data.statutoryHolidays = res.data;
              setCmsData(data);
              // Write Statutory Data to CMS cache
              apiAxios
                .put(`api/update/statutory-holidays`, statInfo, {
                  headers: { Authorization: `Bearer ${token}` },
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
