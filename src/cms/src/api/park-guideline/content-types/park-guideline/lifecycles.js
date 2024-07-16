"use strict";

const updateName = async (data, where) => {
	if (where) {
		const id = where.id
		const parkGuideline = await strapi.entityService.findOne(
			"api::park-guideline.park-guideline", id, { populate: '*' }
		)
		const protectedArea = parkGuideline.protectedArea
		const guidelineType = parkGuideline.guidelineType

		data.name = ""
		if (protectedArea) {
			data.name = protectedArea.orcs
		}
		if (guidelineType) {
			data.name += ":"
			data.name += guidelineType.guidelineName;
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
