"use strict";

async function up(knex) {
  // Check if both tables exist before proceeding
  if (
    !(await knex.schema.hasTable("park_operation_sub_areas")) ||
    !(await knex.schema.hasTable("park_gates"))
  ) {
    return;
  }

  console.log(
    "Migrating gate data from park-operation-sub-areas to park-gates..."
  );

  // Get all park operation sub areas with gate-related data
  const parkOperationSubAreas = await strapi.db
    .query("api::park-operation-sub-area.park-operation-sub-area")
    .findMany({
      select: [
        "id",
        "hasGate",
        "gateOpenTime",
        "gateCloseTime",
        "gateOpensAtDawn",
        "gateClosesAtDusk",
        "gateOpen24Hours",
        "gateNote",
        "featureId",
      ],
      populate: {
        protectedArea: {
          select: ["id"],
        },
      },
      limit: 10000,
    });

  console.log(
    `Found ${parkOperationSubAreas.length} park operation sub areas to process`
  );

  let migratedCount = 0;

  await strapi.db.transaction(async () => {
    // Fetch the sub-areas from the new Park-features collection,
    // to look up and link the IDs
    const parkFeatures = await strapi.db
      .query("api::park-feature.park-feature")
      .findMany({
        select: ["id", "featureId"],
        where: {
          featureId: {
            $notNull: true,
          },
        },
        limit: 10000,
      });

    // Convert ID pair entities structure to a map for easy lookups
    const parkFeaturesMap = new Map(
      parkFeatures.map((parkFeature) => {
        return [parkFeature.featureId, parkFeature.id];
      })
    );

    for (const subArea of parkOperationSubAreas) {
      // Only migrate if there's gate-related data
      const hasGateData =
        subArea.hasGate ||
        subArea.gateOpenTime ||
        subArea.gateCloseTime ||
        subArea.gateOpensAtDawn ||
        subArea.gateClosesAtDusk ||
        subArea.gateOpen24Hours ||
        subArea.gateNote;

      // Skip if no gate data or no protected area
      if (!hasGateData || !subArea.protectedArea) {
        continue;
      }

      // Look up the ID of the Park-feature record that corresponds to this Sub-area record
      // (If there is one. It may be undefined, depending on data completeness.)
      const parkFeatureId = parkFeaturesMap.get(subArea.featureId);

      try {
        // Create new park-gate record for this park feature (sub-area)
        await strapi.db.query("api::park-gate.park-gate").create({
          data: {
            hasGate: subArea.hasGate ?? null,
            gateOpenTime: subArea.gateOpenTime ?? null,
            gateCloseTime: subArea.gateCloseTime ?? null,
            gateOpensAtDawn: subArea.gateOpensAtDawn ?? null,
            gateClosesAtDusk: subArea.gateClosesAtDusk ?? null,
            gateOpen24Hours: subArea.gateOpen24Hours ?? null,
            gateNote: subArea.gateNote ?? null,
            parkFeature: parkFeatureId ?? null,
            // Only Park-level (Protected Area) gate data will link to Protected Area records
            protectedArea: null,
            publishedAt: new Date().toISOString(),
          },
        });

        migratedCount++;
      } catch (error) {
        console.error(
          `Failed to migrate gate data for sub area ${subArea.id}:`,
          error
        );
      }
    }
  });

  console.log(
    `Successfully migrated ${migratedCount} park gate records from sub areas`
  );
}

module.exports = { up };
