/*
 * ============================================================
 * STRAPI 5 LIFECYCLE HOOKS - MIGRATED TO DOCUMENT SERVICE
 * ============================================================
 *
 * NOTE: This lifecycle logic has been migrated to Document Service Middleware
 * in src/index.js as recommended by Strapi v5 migration guide.
 *
 * This file is kept for reference but the main logic now runs through the
 * centralized middleware to properly handle Draft & Publish and i18n features.
 *
 * Migration Guide: https://docs.strapi.io/cms/migration/v4-to-v5/breaking-changes/lifecycle-hooks-document-service
 * Document Service Middlewares: https://docs.strapi.io/cms/api/document-service/middlewares
 *
 * ============================================================
 */

"use strict";

const updateName = async (data, where) => {
	if (where) {
		const documentId = where.documentId
		const parkGuideline = await strapi.documents("api::park-guideline.park-guideline").findOne({
			documentId, populate: '*'
		})
		const protectedArea = parkGuideline.protectedArea
		const site = parkGuideline.site
		const guidelineType = parkGuideline.guidelineType

		data.name = ""
		if (protectedArea) {
			data.name = protectedArea.orcs
		}
		if (site) {
			data.name = site.orcsSiteNumber
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

