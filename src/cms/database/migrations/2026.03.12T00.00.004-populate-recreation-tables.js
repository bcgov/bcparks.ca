"use strict";

module.exports = {
  async up(knex) {
    if (await knex.schema.hasTable("recreation_districts")) {
      await knex.raw(`DELETE FROM recreation_districts;`);

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

      await strapi.db
        .query("api::recreation-district.recreation-district")
        .createMany({ data });
    }

    if (await knex.schema.hasTable("recreation_resource_types")) {
      await knex.raw(`DELETE FROM recreation_resource_types;`);

      const data = [
        { resourceTypeCode: "IF", resourceType: "Interpretive forest" },
        { resourceTypeCode: "RR", resourceType: "Recreation reserve" },
        { resourceTypeCode: "RTR", resourceType: "Recreation trail" },
        { resourceTypeCode: "SIT", resourceType: "Recreation site" },
      ];

      await strapi.db
        .query("api::recreation-resource-type.recreation-resource-type")
        .createMany({ data });
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
