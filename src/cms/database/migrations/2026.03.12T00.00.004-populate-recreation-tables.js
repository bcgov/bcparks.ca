"use strict";

module.exports = {
  async up(knex) {
    const upsertManyByCode = async ({ uid, codeField, labelField, data }) => {
      for (const row of data) {
        const code = row[codeField];

        const existing = await strapi.db.query(uid).findOne({
          where: { [codeField]: code },
          select: ["id", labelField],
        });

        if (!existing) {
          await strapi.db.query(uid).create({ data: row });
          continue;
        }

        if (existing[labelField] !== row[labelField]) {
          await strapi.db.query(uid).update({
            where: { id: existing.id },
            data: { [labelField]: row[labelField] },
          });
        }
      }
    };

    if (await knex.schema.hasTable("recreation_districts")) {
      // prettier-ignore
      const data = [
        { districtCode: "RDCC", district: "Quesnel-Central Cariboo" },
        { districtCode: "RDCK", district: "Chilliwack" },
        { districtCode: "RDCO", district: "Columbia-Shuswap" },
        { districtCode: "RDCR", district: "Discovery Coast" },
        { districtCode: "RDCS", district: "Cascades" },
        { districtCode: "RDHG", district: "Haida Gwaii" },
        { districtCode: "RDHW", district: "Headwaters" },
        { districtCode: "RDKA", district: "Kamloops" },
        { districtCode: "RDKB", district: "Kootenay-Boundary" },
        { districtCode: "RDKM", district: "North Coast-Kalum-Cassiar" },
        { districtCode: "RDPC", district: "Peace-Ft. Nelson" },
        { districtCode: "RDPG", district: "Prince George-Mackenzie" },
        { districtCode: "RDRN", district: "Rocky Mountain North" },
        { districtCode: "RDRS", district: "Rocky Mountain South" },
        { districtCode: "RDSI", district: "Sunshine Coast/South Island" },
        { districtCode: "RDSQ", district: "Squamish" },
        { districtCode: "RDSS", district: "Nadina-Skeena" },
        { districtCode: "RDVA", district: "Vanderhoof-Ft. St. James" },
        { districtCode: "RDSC", district: "South Cariboo-Chilcotin-Central Coast" },
        { districtCode: "RDON", district: "North Okanagan" },
        { districtCode: "RDBO", district: "Boundary-South Okanagan" },
        { districtCode: "RDMH", district: "100 Mile-Chilcotin" },
        { districtCode: "RDOS", district: "Okanagan" },
        { districtCode: "RDQC", district: "Queen Charlotte Islands (Haida Gwaii)" },
        { districtCode: "RDRM", district: "Rocky Mountain" },
      ];

      await upsertManyByCode({
        uid: "api::recreation-district.recreation-district",
        codeField: "districtCode",
        labelField: "district",
        data,
      });
    }

    if (await knex.schema.hasTable("recreation_resource_types")) {
      // prettier-ignore
      const data = [
        { resourceTypeCode: "IF", resourceType: "Interpretive forest" },
        { resourceTypeCode: "RR", resourceType: "Recreation reserve" },
        { resourceTypeCode: "SIT", resourceType: "Recreation site" },
        { resourceTypeCode: "RTR", resourceType: "Recreation trail reserve" },
        { resourceTypeCode: "TBL", resourceType: "Trail based recreation linear" },
        { resourceTypeCode: "TRB", resourceType: "Trail based recreation area" },
        { resourceTypeCode: "IFT", resourceType: "Interpretive forest trail" },
        { resourceTypeCode: "RTE", resourceType: "Recreation trail established" },
      ];

      await upsertManyByCode({
        uid: "api::recreation-resource-type.recreation-resource-type",
        codeField: "resourceTypeCode",
        labelField: "resourceType",
        data,
      });
    }

    if (
      (await knex.schema.hasTable("access_statuses")) &&
      (await knex.schema.hasColumn("access_statuses", "recreation_status_code"))
    ) {
      await knex.raw(
        `UPDATE access_statuses SET recreation_status_code = 2
         WHERE group_label = 'Closed';`
      );
      await knex.raw(
        `UPDATE access_statuses SET recreation_status_code = 1
         WHERE group_label <> 'Closed';`
      );
    }
  },
};
