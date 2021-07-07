import moment from "moment";
import { apiAxios, axios } from "../axios_config";
import {
  addProtectedAreas,
  addProtectedAreasFromArea,
  removeProtectedAreas,
  removeProtectedAreasFromArea,
} from "./LocationUtil";

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
  fireZones
) {
  const selProtectedAreas = [];
  const selRegions = [];
  const selSections = [];
  const selManagementAreas = [];
  const selSites = [];
  const selFireCentres = [];
  const selFireZones = [];
  setAreaValues(selectedProtectedAreas, selProtectedAreas, null, null);
  setAreaValues(
    selectedRegions,
    selRegions,
    selProtectedAreas,
    managementAreas
  );
  setAreaValues(
    selectedSections,
    selSections,
    selProtectedAreas,
    managementAreas
  );
  setAreaValues(
    selectedManagementAreas,
    selManagementAreas,
    selProtectedAreas,
    null
  );
  setAreaValues(selectedSites, selSites, selProtectedAreas, null);
  setAreaValues(
    selectedFireCentres,
    selFireCentres,
    selProtectedAreas,
    fireZones
  );
  setAreaValues(selectedFireZones, selFireZones, selProtectedAreas, null);
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

const setAreaValues = (areas, selAreas, selProtectedAreas, areaList) => {
  if (areas && areas.length > 0) {
    areas.forEach((a) => {
      selAreas.push(a.value);
      if (a.type === "managementArea" || a.type === "fireZone") {
        addProtectedAreas(a.obj.protectedAreas, selProtectedAreas);
      } else if (a.type === "site") {
        selProtectedAreas.push(a.obj.protectedArea.id);
      } else if (a.type === "region" || a.type === "section") {
        addProtectedAreasFromArea(
          a.obj,
          "managementAreas",
          selProtectedAreas,
          areaList
        );
      } else if (a.type === "fireCentre") {
        addProtectedAreasFromArea(
          a.obj,
          "fireZones",
          selProtectedAreas,
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
  updatedProtectedAreas
) => {
  if (existingAreas && existingAreas.length > 0) {
    existingAreas.forEach((a) => {
      if (!selectedAreas.includes(a)) {
        if (a.type === "managementArea" || a.type === "fireZone") {
          updatedProtectedAreas = removeProtectedAreas(
            a.obj.protectedAreas,
            updatedProtectedAreas
          );
        } else if (a.type === "site") {
          updatedProtectedAreas = updatedProtectedAreas.filter(
            (p) => a.obj.protectedArea.id !== p.value
          );
        } else if (a.type === "region" || a.type === "section") {
          updatedProtectedAreas = removeProtectedAreasFromArea(
            a.obj,
            "managementAreas",
            updatedProtectedAreas,
            areaList
          );
        } else if (a.type === "fireCentre") {
          updatedProtectedAreas = removeProtectedAreasFromArea(
            a.obj,
            "fireZones",
            updatedProtectedAreas,
            areaList
          );
        }
      }
    });
  }
  return updatedProtectedAreas;
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
  fireZones
) {
  let updatedProtectedAreas = selectedProtectedAreas;
  updatedProtectedAreas = removeAreaValues(
    existingRegions,
    selectedRegions,
    managementAreas,
    updatedProtectedAreas
  );

  updatedProtectedAreas = removeAreaValues(
    existingSections,
    selectedSections,
    managementAreas,
    updatedProtectedAreas
  );
  updatedProtectedAreas = removeAreaValues(
    existingManagementAreas,
    selectedManagementAreas,
    null,
    updatedProtectedAreas
  );
  updatedProtectedAreas = removeAreaValues(
    existingSites,
    selectedSites,
    null,
    updatedProtectedAreas
  );
  updatedProtectedAreas = removeAreaValues(
    existingFireCentres,
    selectedFireCentres,
    fireZones,
    updatedProtectedAreas
  );
  updatedProtectedAreas = removeAreaValues(
    existingFireZones,
    selectedFireZones,
    null,
    updatedProtectedAreas
  );
  return updatedProtectedAreas;
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
            .get(process.env.REACT_APP_STAT_HOLIDAY_API)
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
