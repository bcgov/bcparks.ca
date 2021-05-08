import moment from "moment";
import { cmsAxios, apiAxios, axios } from "../axios_config";

export function calculateAfterHours(businessHours) {
  const currentDate = moment().format("YYYY-MM-DD");
  const currentDay = moment().format("dddd");
  const businessStartTime = moment(
    currentDate + " " + businessHours["StartTime"]
  );
  const businessEndTime = moment(currentDate + " " + businessHours["EndTime"]);
  const businessHour = moment().isBetween(businessStartTime, businessEndTime);
  if (!businessHours[currentDay] || !businessHour) {
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

export function getAdvisoryFields(type, advisoryStatuses) {
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
    selAdvisoryStatus: status[0]["obj"],
    confirmationText: confirmationText,
    published: published,
  };
}

export function getUpdateAdvisoryFields(code, isAfterHourPublish) {
  let confirmationText = "";
  let published = null;

  if (code === "DFT") {
    confirmationText = "Your advisory has been saved successfully!";
  } else if (isAfterHourPublish || code === "PUB") {
    confirmationText = "Your advisory has been published successfully!";
    published = moment().tz("America/Vancouver");
  } else {
    confirmationText = "Your advisory has been sent for review successfully!";
  }
  return { confirmationText, published };
}

export function getLocationAreas(locations) {
  const selProtectedAreas = [];
  const selRegions = [];
  const selSections = [];
  const selManagementAreas = [];
  locations.forEach((l) => {
    if (l.type === "protectedArea") {
      selProtectedAreas.push(l.obj);
    } else if (l.type === "region") {
      selRegions.push(l.obj);
    } else if (l.type === "section") {
      selSections.push(l.obj);
    } else if (l.type === "managementArea") {
      selManagementAreas.push(l.obj);
    }
  });
  return {
    selProtectedAreas,
    selRegions,
    selSections,
    selManagementAreas,
  };
}

export function calculateIsStatHoliday(setIsStatHoliday, token) {
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
}
