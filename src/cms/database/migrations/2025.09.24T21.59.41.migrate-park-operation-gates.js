"use strict";

async function up(knex) {
  // Check if both tables exist before proceeding
  if (
    !(await knex.schema.hasTable("park_operations")) ||
    !(await knex.schema.hasTable("park_gates"))
  ) {
    return;
  }

  console.log("Migrating gate data from park-operations to park-gates...");

  // Get all park operations with gate-related data
  const parkOperations = await strapi.db
    .query("api::park-operation.park-operation")
    .findMany({
      select: [
        "id",
        "hasParkGate",
        "gateOpenTime",
        "gateCloseTime",
        "gateOpensAtDawn",
        "gateClosesAtDusk",
        "gateOpen24Hours",
        "gateNote",
      ],
      populate: {
        protectedArea: {
          select: ["id"],
        },
      },
      limit: 10000,
    });

  console.log(`Found ${parkOperations.length} park operations to process`);

  let migratedCount = 0;

  await strapi.db.transaction(async () => {
    for (const operation of parkOperations) {
      // Only migrate if there's gate-related data
      const hasGateData =
        operation.hasParkGate ||
        operation.gateOpenTime ||
        operation.gateCloseTime ||
        operation.gateOpensAtDawn ||
        operation.gateClosesAtDusk ||
        operation.gateOpen24Hours ||
        operation.gateNote;

      // Skip if no gate data or no protected area
      if (!hasGateData || !operation.protectedArea) {
        continue;
      }

      try {
        // Check if park-gate already exists for this protected area
        const existingGate = await strapi.db
          .query("api::park-gate.park-gate")
          .findOne({
            where: {
              protectedArea: operation.protectedArea.id,
            },
          });

        // Skip if gate already exists
        if (existingGate) {
          continue;
        }

        // Create new park-gate record
        await strapi.db.query("api::park-gate.park-gate").create({
          data: {
            hasGate: operation.hasParkGate ?? null,
            gateOpenTime: operation.gateOpenTime ?? null,
            gateCloseTime: operation.gateCloseTime ?? null,
            gateOpensAtDawn: operation.gateOpensAtDawn ?? null,
            gateClosesAtDusk: operation.gateClosesAtDusk ?? null,
            gateOpen24Hours: operation.gateOpen24Hours ?? null,
            gateNote: operation.gateNote ?? null,
            protectedArea: operation.protectedArea.id,
            publishedAt: new Date().toISOString(),
          },
        });

        migratedCount++;
      } catch (error) {
        console.error(
          `Failed to migrate gate data for operation ${operation.id}:`,
          error
        );
      }
    }
  });

  console.log(`Successfully migrated ${migratedCount} park gate records`);
}

module.exports = { up };
