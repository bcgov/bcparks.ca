"use strict";

const rstCategoryByTitle = {
  "Avalanche - Closure": "Environmental",
  "Construction / rehabilitation - Closure": "Access",
  "Danger trees - Closure": "Public safety",
  "Flood - Closure": "Environmental",
  "General public safety - Closure": "Public safety",
  "Landslide - Closure": "Environmental",
  "Public safety assessment - Closure": "Public safety",
  "Road damage - Warning": "Access",
  "Road washout - Closure": "Access",
  "Seasonal - Closure": "Seasonal restrictions",
  "Seasonal not maintained - Warning": "Seasonal restrictions",
  "Wildfire - Closure": "Environmental",
  "Wildlife - Closure": "Environmental",
};

module.exports = {
  async up(knex) {
    if (await knex.schema.hasTable("standard_messages")) {
      // create the group_label column if it doesn't exist
      if (!(await knex.schema.hasColumn("standard_messages", "group_label"))) {
        await knex.schema.table("standard_messages", (table) => {
          table.string("group_label");
        });
      }

      // split BCP titles
      await knex.raw(`
        UPDATE standard_messages
        SET
          group_label = trim(split_part(title, ' - ', 1)),
          title = trim(split_part(title, ' - ', 2))
        WHERE scope = 'BCP'
          AND title LIKE '% - %'
      `);

      // Boil water advisory fix
      await knex("standard_messages")
        .where({ scope: "BCP", title: "Boil water advisory" })
        .update({ group_label: "Public safety" });

      // RST updates
      for (const [title, group_label] of Object.entries(rstCategoryByTitle)) {
        await knex("standard_messages")
          .whereRaw("scope = 'RST' AND lower(trim(title)) = lower(?)", [title])
          .update({
            group_label,
            title,
          });
      }
    }
  },
};
