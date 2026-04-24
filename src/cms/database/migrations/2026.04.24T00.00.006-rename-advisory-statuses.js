"use strict";

module.exports = {
  async up(knex) {
    if (await knex.schema.hasTable("advisory_statuses")) {
      await knex.raw(
        `UPDATE advisory_statuses SET advisory_status = 'Unpublished', code = 'UNP' WHERE code = 'INA';`
      );
      await knex.raw(
        `UPDATE advisory_statuses SET advisory_status = 'HQ Review', code = 'HQR' WHERE code = 'ARQ';`
      );
      await knex.raw(
        `UPDATE advisory_statuses SET advisory_status = 'Scheduled', code = 'SCH' WHERE code = 'APR';`
      );
    }
  },
};
