"use strict";

// feature_id values for park features that can have dates spanning 2 years
const featureIds = [
  "41_271", // Cultus Lake / Maple Bay Cabins / All cabins
  "41_876", // Cultus Lake / Maple Bay day-use area / Picnic area
  "7_360", // Garibaldi / Red Heather campground / All sites
  "7_449", // Garibaldi / Taylor Meadows campground / All sites
  "33_57", // EC Manning / Cambie Creek groupsite / All sites
  "33_248", // EC Manning / (no area) / Lightning Lake day-use area
  "5_313", // Mount Assiniboine / Og Lake Campground / All sites
  "5_263", // Mount Assiniboine / Magog Lake Campground / All sites
  "5_792", // Mount Assiniboine / Porcupine Campground / All sites
  "314_476", // Porteau Cove / Porteau Cove walk-in sites / All sites
  "314_914", // Porteau Cove / Porteau Cove Campground vehicle accessible sites / All sites
  "409_185", // Ts'ilos Park / Gwe Da Ts'ih Campground / All sites
];

module.exports = {
  async up(knex) {
    // Skip if the collection table doesn't exist
    if (!(await knex.schema.hasTable("park_features"))) return;

    // Add the new column if it doesn't exist
    // Strapi maps datesCanSpan2years to dates_can_span_2_years
    if (
      !(await knex.schema.hasColumn("park_features", "dates_can_span_2_years"))
    ) {
      await knex.schema.table("park_features", (table) => {
        table.boolean("dates_can_span_2_years").notNullable().defaultTo(false);
      });
    }

    // Update the specified features to have their datesCanSpan2years value set to true
    await knex("park_features")
      .whereIn("feature_id", featureIds)
      .update({ dates_can_span_2_years: true });
  },
};
