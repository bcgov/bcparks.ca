"use strict";

/*
 Renames gate time columns in the "park_gates" table:
 - "gateOpenTime" to "gateOpenHoursStartTime"
 - "gateCloseTime" to "gateOpenHoursEndTime"
*/

module.exports = {
  async up(knex) {
    if (await knex.schema.hasColumn("park_gates", "gate_open_time")) {
      await knex.schema.table("park_gates", (table) => {
        table.renameColumn("gate_open_time", "gate_open_hours_start_time");
      });
    }

    if (await knex.schema.hasColumn("park_gates", "gate_close_time")) {
      await knex.schema.table("park_gates", (table) => {
        table.renameColumn("gate_close_time", "gate_open_hours_end_time");
      });
    }
  },
};
