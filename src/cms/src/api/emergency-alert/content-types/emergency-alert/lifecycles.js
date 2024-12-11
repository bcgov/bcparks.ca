"use strict";

const format = require('date-fns/format')

const formatDateToPacificTime = (dateString) => {
  // Strapi returns the date in ISO format e.g. 2025-01-01T00:00:00.000Z
  // Format the date in YYYY-MM-DD e.g. 2025-01-01
  return format(dateString, 'yyyy-MM-dd', { timeZone: 'America/Los_Angeles' })
}

module.exports = {
    beforeCreate(event) {
        const { data } = event.params
        const createdDate = formatDateToPacificTime(data.createdAt)
        if (data.isActive === true) {
            data.activeDate = createdDate
        }
    },
    beforeUpdate(event) {
        const { data } = event.params
        const updatedDate = formatDateToPacificTime(data.updatedAt)
        if (data.isActive === true) {
            data.activeDate = updatedDate
        }
        if (data.isActive === false && data.activeDate) {
            data.inactiveDate = updatedDate
        }
    }
}
