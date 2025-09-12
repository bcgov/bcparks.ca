"use strict";

const rows = [
  { dateTypeId: 1, dateType: "Gate" },
  { dateTypeId: 2, dateType: "Tier 1" },
  { dateTypeId: 3, dateType: "Tier 2" },
  { dateTypeId: 4, dateType: "Winter fee" },
  { dateTypeId: 5, dateType: "Day-use pass" },
  { dateTypeId: 6, dateType: "Operation" },
  { dateTypeId: 7, dateType: "Reservation" },
  { dateTypeId: 8, dateType: "Backcountry registration" },
  { dateTypeId: 9, dateType: "First come, first served" },
  { dateTypeId: 10, dateType: "Full services and fees" },
];

module.exports = {
  async up(knex) {
    if (await knex.schema.hasTable("park_date_types")) {
      await strapi.db.transaction(async () => {
        for (const row of rows) {
          try {
            await strapi.entityService.create(
              "api::park-date-type.park-date-type",
              {
                data: {
                  dateTypeId: row.dateTypeId,
                  dateType: row.dateType,
                  publishedAt: new Date().toISOString(),
                },
              }
            );
          } catch (error) {
            console.error(`Failed to insert: ${row}`, error);
          }
        }
      });
    }
  },
};
