"use strict";

const OLD_TABLE = "legacy_redirects";
const NEW_TABLE = "redirects";
const OLD_UID = "api::legacy-redirect.legacy-redirect";
const NEW_UID = "api::redirect.redirect";
const CONFIG_KEY = "plugin_content_manager_configuration_content_types::";

/**
 * Replaces the old content type UID at the start of a column's value.
 * @param {import("knex").Knex} knex - The configured database connection.
 * @param {string} tableName - The table to update.
 * @param {string} columnName - The column holding the UID.
 * @returns {Promise<void>} Resolves when matching rows have been updated.
 */
async function replaceUid(knex, tableName, columnName) {
  const rows = await knex(tableName)
    .select("id", columnName)
    .where(columnName, "like", `${OLD_UID}%`);

  for (const row of rows) {
    await knex(tableName)
      .where("id", row.id)
      .update({ [columnName]: row[columnName].replace(OLD_UID, NEW_UID) });
  }
}

module.exports = {
  /**
   * Renames the legacy-redirect collection to redirect before Strapi syncs the
   * updated schema, so the data, permissions and admin settings are kept.
   * @param {import("knex").Knex} knex - The configured database connection.
   * @returns {Promise<void>} Resolves when the collection has been renamed.
   */
  async up(knex) {
    if (
      !(await knex.schema.hasTable(OLD_TABLE)) ||
      (await knex.schema.hasTable(NEW_TABLE))
    ) {
      return;
    }

    await knex.schema.renameTable(OLD_TABLE, NEW_TABLE);

    // Rename the indexes, constraints and sequence too, otherwise Strapi
    // adds new ones alongside the old ones
    const indexes = await knex("pg_indexes")
      .select("indexname")
      .where("tablename", NEW_TABLE);

    for (const { indexname } of indexes) {
      await knex.raw("ALTER INDEX ?? RENAME TO ??", [
        indexname,
        indexname.replace(OLD_TABLE, NEW_TABLE),
      ]);
    }

    const constraints = await knex("pg_constraint")
      .select("conname")
      .where("conrelid", knex.raw("?::regclass", [NEW_TABLE]))
      .andWhere("contype", "f");

    for (const { conname } of constraints) {
      await knex.raw("ALTER TABLE ?? RENAME CONSTRAINT ?? TO ??", [
        NEW_TABLE,
        conname,
        conname.replace(OLD_TABLE, NEW_TABLE),
      ]);
    }

    await knex.raw("ALTER SEQUENCE ?? RENAME TO ??", [
      `${OLD_TABLE}_id_seq`,
      `${NEW_TABLE}_id_seq`,
    ]);

    // Permissions and admin settings are stored by content type UID
    await replaceUid(knex, "up_permissions", "action");
    await replaceUid(knex, "admin_permissions", "subject");
    await replaceUid(knex, "strapi_api_token_permissions", "action");

    // The admin's list and edit view settings, matched by the uid inside the value
    const config = await knex("strapi_core_store_settings")
      .where("key", `${CONFIG_KEY}${OLD_UID}`)
      .first();

    if (config) {
      await knex("strapi_core_store_settings")
        .where("id", config.id)
        .update({
          key: `${CONFIG_KEY}${NEW_UID}`,
          value: config.value.replace(OLD_UID, NEW_UID),
        });
    }
  },
};
