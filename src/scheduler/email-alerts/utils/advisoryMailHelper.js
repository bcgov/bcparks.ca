const { cmsAxios } = require("../../shared/axiosConfig");
const qs = require("qs");
const { parseJSON } = require("date-fns");
const { formatInTimeZone } = require("date-fns-tz");

/**
 * Retrieves the latest advisory revision and its related email data from Strapi.
 *
 * @param {number|string} advisoryNumber Advisory number to retrieve.
 * @returns {Promise<Object[]>} Matching advisory records.
 */
const getAdvisoryInfo = async function (advisoryNumber) {
  const advisoryFilter = qs.stringify(
    {
      populate: {
        fireCentres: { fields: ["fireCentreName"] },
        fireZones: { fields: ["fireZoneName"] },
        naturalResourceDistricts: { fields: ["naturalResourceDistrictName"] },
        links: {
          fields: ["title", "url"],
        },
        managementAreas: { fields: ["managementAreaName"] },
        protectedAreas: { fields: ["protectedAreaName", "slug"] },
        regions: { fields: ["regionName"] },
        sections: { fields: ["sectionName"] },
        sites: {
          fields: ["siteName", "slug"],
          populate: { protectedArea: { fields: "slug" } },
        },
        recreationResources: {
          fields: ["resourceName", "recResourceId", "isDisplayed"],
        },
        standardMessages: { fields: ["description"] },
        urgency: { fields: ["urgency"] },
      },
      filters: {
        $and: [{ isLatestRevision: true }, { advisoryNumber: advisoryNumber }],
      },
    },
    {
      encodeValuesOnly: true,
    },
  );
  const advisoryQuery = `/api/public-advisory-audits?${advisoryFilter}`;
  const response = await cmsAxios.get(advisoryQuery, {
    headers: { Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}` },
  });
  return response.data.data;
};

/**
 * Builds the display label and formatted date for an advisory.
 *
 * The first enabled date display option is used, in priority order:
 * advisory date, updated date, effective date range, and effective date.
 *
 * @param {Object} advisory Advisory record containing date values and display flags.
 * @returns {{dateLabel: string, dateString: string}} Display date information.
 */
const getAdvisoryDateInfo = function (advisory) {
  const tz = "America/Dawson_Creek";
  const fmt = "MMMM dd, yyyy hh:mm a";

  // Posting date
  if (advisory.isAdvisoryDateDisplayed) {
    return {
      dateLabel: "Posted",
      dateString: formatInTimeZone(parseJSON(advisory.advisoryDate), tz, fmt),
    };
  }

  // Updated date
  if (advisory.isUpdatedDateDisplayed && advisory.updatedDate) {
    return {
      dateLabel: "Updated",
      dateString: formatInTimeZone(parseJSON(advisory.updatedDate), tz, fmt),
    };
  }

  // Event date range
  if (
    advisory.isEffectiveDateDisplayed &&
    advisory.effectiveDate &&
    advisory.isEndDateDisplayed &&
    advisory.endDate
  ) {
    return {
      dateLabel: "In effect",
      dateString: `${formatInTimeZone(
        parseJSON(advisory.effectiveDate),
        tz,
        fmt,
      )} to ${formatInTimeZone(parseJSON(advisory.endDate), tz, fmt)}`,
    };
  }

  // Start date
  if (advisory.isEffectiveDateDisplayed && advisory.effectiveDate) {
    return {
      dateLabel: "In effect",
      dateString: formatInTimeZone(parseJSON(advisory.effectiveDate), tz, fmt),
    };
  }

  // No date
  return {
    dateLabel: "",
    dateString: "",
  };
};

module.exports = {
  getAdvisoryInfo,
  getAdvisoryDateInfo,
};
