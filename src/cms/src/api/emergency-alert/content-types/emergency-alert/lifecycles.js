"use strict";

module.exports = {
    beforeCreate(event) {
        const { data } = event.params
        const date = new Date(data.createdAt)
        const createdDate = date.toISOString().split('T')[0]
        if (data.isActive === true) {
            data.activeDate = createdDate
        }
    },
    beforeUpdate(event) {
        const { data } = event.params
        const date = new Date(data.updatedAt)
        const updatedDate = date.toISOString().split('T')[0]
        if (data.isActive === true) {
            data.activeDate = updatedDate
        }
        if (data.isActive === false && data.activeDate) {
            data.inactiveDate = updatedDate
        }
    }
}