"use strict";

/*
Populate the new showWithParkName and showIn*Section boolean fields on
audio_clips from the existing displayLocation multi-select values. This is the first step in replacing
strapi-plugin-multi-select with built-in boolean fields.

The columns are created here because Strapi runs migrations before it syncs
the schema, so they need to exist before they can be populated.

Updates are done with knex so both draft and published rows are updated.
*/

// Strapi maps showWithParkName to show_with_park_name, etc.
const COLUMNS_BY_LOCATION = {
  tldr: "show_with_park_name",
  highlights: "show_in_highlights_section",
  history: "show_in_history_section",
  heritage: "show_in_cultural_heritage_section",
};

/**
 * Parses a display_location value into an array of location keys.
 *
 * @param {Array|string|null|undefined} value - The raw display_location value.
 * @returns {Array<string>} The location keys, or an empty array if none.
 */
function parseDisplayLocation(value) {
  if (Array.isArray(value)) {
    return value;
  }
  if (typeof value !== "string" || !value) {
    return [];
  }
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

module.exports = {
  async up(knex) {
    // Skip if the collection table doesn't exist
    if (!(await knex.schema.hasTable("audio_clips"))) return;

    // Skip if Strapi has already dropped the old multi-select column
    if (!(await knex.schema.hasColumn("audio_clips", "display_location"))) {
      return;
    }

    // Add the new columns if they don't exist. Strapi doesn't use DB-level
    // defaults or NOT NULL constraints; it applies schema.json defaults itself.
    for (const column of Object.values(COLUMNS_BY_LOCATION)) {
      if (!(await knex.schema.hasColumn("audio_clips", column))) {
        await knex.schema.table("audio_clips", (table) => {
          table.boolean(column);
        });
      }
    }

    const rows = await knex("audio_clips").select("id", "display_location");

    // Set every column explicitly on every row
    for (const row of rows) {
      const locations = parseDisplayLocation(row.display_location);
      const changes = {};

      for (const [location, column] of Object.entries(COLUMNS_BY_LOCATION)) {
        changes[column] = locations.includes(location);
      }

      await knex("audio_clips").where({ id: row.id }).update(changes);
    }

    strapi.log.info(
      `populate-audio-clip-show-with-fields: updated ${rows.length} audio clips`,
    );
  },
};
