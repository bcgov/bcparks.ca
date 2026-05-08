"use strict";

const data = [
  {
    orcsFeatureNumber: "188-1",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "199-4",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "199-6",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "199-7",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "199-8",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "261-5",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "9451-1",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "9812-1",
    hasDates: false,
  },
];

const falseList = data
  .filter((item) => !item.hasDates)
  .map((item) => `'${item.orcsFeatureNumber}'`)
  .join(", ");

module.exports = {
  async up(knex) {
    if (
      (await knex.schema.hasTable("park_features")) &&
      (await knex.schema.hasColumn("park_features", "has_dates"))
    ) {
      // set everything to true first
      await knex.raw(`UPDATE park_features SET has_dates = true`);

      // then set to false for the specific features
      await knex.raw(
        `UPDATE park_features SET has_dates = false WHERE orcs_feature_number IN (${falseList})`,
      );
    }
  },
};
