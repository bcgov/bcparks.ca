"use strict";

const updateName = async (data, where) => {
    if (where) {
        const id = where.id
        const parkContact = await strapi.entityService.findOne(
            "api::park-contact.park-contact", id, { populate: '*' }
        )
        const protectedArea = parkContact.protectedArea
        const facilityOperatorContact = parkContact.facilityOperatorContact

        data.name = ""
        if (protectedArea) {
            data.name = protectedArea.orcs
        }
        if (facilityOperatorContact) {
            data.name += ":"
            data.name += facilityOperatorContact.defaultTitle
        } else {
            data.name += ":"
            data.name += data.title
        }
    }
    return data
};

module.exports = {
    async beforeCreate(event) {
        let { data, where } = event.params;
        data = await updateName(data, where);
    },
    async beforeUpdate(event) {
        let { data, where } = event.params;
        data = await updateName(data, where);
    },
};
