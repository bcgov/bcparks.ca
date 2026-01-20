"use strict";

/**
 * Strapi 5 lifecycle hooks for Document Service
 * Migration Guide: https://docs.strapi.io/cms/migration/v4-to-v5/breaking-changes/lifecycle-hooks-document-service
 * Document Service API: https://docs.strapi.io/cms/api/document-service
 */

const format = require("date-fns/format");
const utcToZonedTime = require("date-fns-tz/utcToZonedTime");

const formatDateToPacificTime = (dateString) => {
  // Strapi returns the date in ISO format e.g. 2025-01-01T00:00:00.000Z
  // Convert dateString to Pacific Time
  const pacificTime = utcToZonedTime(dateString, "America/Los_Angeles");
  // Format the date in YYYY-MM-DD e.g. 2025-01-01
  return format(pacificTime, "yyyy-MM-dd");
};

module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;
    const createdDate = formatDateToPacificTime(data.createdAt);
    if (data.isActive === true) {
      data.activeDate = createdDate;
    }
  },
  async beforeUpdate(event) {
    const { data } = event.params;
    const updatedDate = formatDateToPacificTime(data.updatedAt);
    if (data.isActive === true) {
      data.activeDate = updatedDate;
    }
    if (data.isActive === false && data.activeDate) {
      data.inactiveDate = updatedDate;
    }
  },
};
