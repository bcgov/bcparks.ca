"use strict";

const updateName = async (data, where) => {
    if (where) {
        const id = where.id
        const parkContact = await strapi.entityService.findOne(
            "api::park-contact.park-contact", id, { populate: '*' }
        )
        let protectedArea = parkContact.protectedArea
        const parkOperatorContact = parkContact.parkOperatorContact

        // Check if new protectedArea is being added
        if (data?.protectedArea?.connect?.length > 0) {
          protectedArea = await strapi.entityService.findOne(
            "api::protected-area.protected-area", data?.protectedArea.connect[0].id
          )
        // Check if current protectedArea is being removed
        } else if (data?.protectedArea?.disconnect?.length > 0) {
          protectedArea = { orcs: 0 }
        }

        data.name = ""
        if (protectedArea) {
            data.name = protectedArea.orcs
        } else {
            data.name = 0
        }
        if (parkOperatorContact) {
            data.name += ":"
            data.name += parkOperatorContact.defaultTitle
        } else {
            data.name += ":"
            data.name += data.title || parkContact.title
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
