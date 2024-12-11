"use strict";

const formatDateToPacificTime = (dateString) => {
  const date = new Date(dateString)
  const localDate = date.toLocaleDateString('en-CA', { timeZone: 'America/Los_Angeles' })
  return new Date(localDate).toISOString().split('T')[0]
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
