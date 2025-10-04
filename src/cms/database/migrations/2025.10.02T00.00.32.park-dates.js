"use strict";

// Imported from DOOT backend/tasks/populate-previous-dates/previous-dates.json
const tierDates = [
  {
    orcs: 45,
    operatingYear: 2025,
    dateType: "Tier 2",
    startDate: "2025-03-14",
    endDate: "2025-06-12",
  },
  {
    orcs: 45,
    operatingYear: 2025,
    dateType: "Tier 1",
    startDate: "2025-06-13",
    endDate: "2025-09-06",
  },
  {
    orcs: 45,
    operatingYear: 2025,
    dateType: "Tier 2",
    startDate: "2025-09-07",
    endDate: "2025-10-30",
  },
  {
    orcs: 307,
    operatingYear: 2025,
    dateType: "Tier 1",
    startDate: "2025-03-21",
    endDate: "2025-10-13",
  },
  {
    orcs: 54,
    operatingYear: 2025,
    dateType: "Tier 2",
    startDate: "2025-03-28",
    endDate: "2025-06-10",
  },
  {
    orcs: 54,
    operatingYear: 2025,
    dateType: "Tier 1",
    startDate: "2025-06-11",
    endDate: "2025-09-01",
  },
  {
    orcs: 54,
    operatingYear: 2025,
    dateType: "Tier 2",
    startDate: "2025-09-02",
    endDate: "2025-10-13",
  },
  {
    orcs: 210,
    operatingYear: 2025,
    dateType: "Tier 2",
    startDate: "2025-01-01",
    endDate: "2025-05-09",
  },
  {
    orcs: 210,
    operatingYear: 2025,
    dateType: "Tier 1",
    startDate: "2025-05-10",
    endDate: "2025-08-31",
  },
  {
    orcs: 210,
    operatingYear: 2025,
    dateType: "Tier 2",
    startDate: "2025-09-01",
    endDate: "2025-12-31",
  },
  {
    orcs: 8,
    operatingYear: 2025,
    dateType: "Tier 2",
    startDate: "2025-02-28",
    endDate: "2025-11-30",
  },
  {
    orcs: 235,
    operatingYear: 2025,
    dateType: "Tier 2",
    startDate: "2025-05-05",
    endDate: "2025-06-24",
  },
  {
    orcs: 235,
    operatingYear: 2025,
    dateType: "Tier 1",
    startDate: "2025-06-25",
    endDate: "2025-09-01",
  },
  {
    orcs: 235,
    operatingYear: 2025,
    dateType: "Tier 2",
    startDate: "2025-09-02",
    endDate: "2025-10-01",
  },
  {
    orcs: 193,
    operatingYear: 2025,
    dateType: "Tier 2",
    startDate: "2025-04-11",
    endDate: "2025-05-15",
  },
  {
    orcs: 193,
    operatingYear: 2025,
    dateType: "Tier 1",
    startDate: "2025-05-16",
    endDate: "2025-09-01",
  },
  {
    orcs: 193,
    operatingYear: 2025,
    dateType: "Tier 2",
    startDate: "2025-09-02",
    endDate: "2025-10-12",
  },
  {
    orcs: 90,
    operatingYear: 2025,
    dateType: "Tier 1",
    startDate: "2025-03-14",
    endDate: "2025-11-02",
  },
  {
    orcs: 314,
    operatingYear: 2025,
    dateType: "Tier 1",
    startDate: "2025-01-01",
    endDate: "2025-12-31",
  },
  {
    orcs: 41,
    operatingYear: 2025,
    dateType: "Tier 2",
    startDate: "2025-01-01",
    endDate: "2025-03-27",
  },
  {
    orcs: 41,
    operatingYear: 2025,
    dateType: "Tier 1",
    startDate: "2025-03-28",
    endDate: "2025-11-16",
  },
  {
    orcs: 41,
    operatingYear: 2025,
    dateType: "Tier 2",
    startDate: "2025-11-17",
    endDate: "2025-12-31",
  },
  {
    orcs: 89,
    operatingYear: 2025,
    dateType: "Tier 1",
    startDate: "2025-05-01",
    endDate: "2025-10-12",
  },
  {
    orcs: 96,
    operatingYear: 2025,
    dateType: "Tier 2",
    startDate: "2025-05-02",
    endDate: "2025-05-15",
  },
  {
    orcs: 96,
    operatingYear: 2025,
    dateType: "Tier 1",
    startDate: "2025-05-16",
    endDate: "2025-09-01",
  },
  {
    orcs: 96,
    operatingYear: 2025,
    dateType: "Tier 2",
    startDate: "2025-09-02",
    endDate: "2025-09-13",
  },
];

// Helper function to insert park date and its relations
async function insertParkDate(knex, dateData, relations) {
  try {
    const [newParkDate] = await knex("park_dates")
      .insert({
        ...dateData,
        published_at: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning("id");

    // Insert relations
    for (const [table, data] of Object.entries(relations)) {
      await knex(table).insert({ park_date_id: newParkDate.id, ...data });
    }

    return newParkDate;
  } catch (error) {
    console.error("Failed to insert park date:", error);
    throw error;
  }
}

module.exports = {
  async up(knex) {
    // Park-date-type
    const dateTypes = await knex("park_date_types").select("id", "date_type");
    const dateTypeMap = {};
    dateTypes.forEach((type) => {
      dateTypeMap[type.date_type] = type.id;
    });

    // 1. Park-operation-date (park level) -> Park-date
    const parkOperationDates = await knex("park_operation_dates").select("*");
    for (const parkDate of parkOperationDates) {
      // Get the link to protected_area
      const dateLink = await knex("park_operation_dates_protected_area_links")
        .where({ park_operation_date_id: parkDate.id })
        .first();

      if (!dateLink) {
        console.warn(
          "No protected_area link for park_operation_date id:",
          parkDate.id
        );
        continue;
      }

      // Get the park_operations_protected_area_links record
      const operationLink = await knex("park_operations_protected_area_links")
        .where({ protected_area_id: dateLink.protected_area_id })
        .first();

      if (!operationLink) {
        console.warn(
          "No park_operation link for protected_area id:",
          dateLink.protected_area_id
        );
        continue;
      }

      // Get the park_operation
      const parkOperation = await knex("park_operations")
        .where({ id: operationLink.park_operation_id })
        .first();

      const isDateAnnual = parkOperation?.is_date_range_annual || false;

      // Gate dates
      await insertParkDate(
        knex,
        {
          operating_year: parkDate.operating_year,
          start_date: parkDate.gate_open_date,
          end_date: parkDate.gate_close_date,
          admin_note: parkDate.admin_note,
          // Park-operation-date does not have is_active column, default to true
          is_active: true,
          is_date_annual: isDateAnnual,
        },
        {
          park_dates_protected_area_links: {
            protected_area_id: dateLink.protected_area_id,
          },
          park_dates_park_date_type_links: {
            park_date_type_id: dateTypeMap["Gate"],
          },
        }
      );
    }

    // 2. Park-operation-sub-area-date (feature level) -> Park-date
    const subAreaDates = await knex("park_operation_sub_area_dates").select(
      "*"
    );
    for (const subAreaDate of subAreaDates) {
      // Get the link to park_operation_sub_area via link table
      const subAreaLink = await knex(
        "park_operation_sub_area_dates_park_operation_sub_area_links"
      )
        .where({ park_operation_sub_area_date_id: subAreaDate.id })
        .first();

      if (!subAreaLink) {
        console.warn(
          "No park_operation_sub_area link for park_operation_sub_area_date id:",
          subAreaDate.id
        );
        continue;
      }

      // Find related park_operation_sub_area for hasBackcountryPermits
      const subArea = await knex("park_operation_sub_areas")
        .where({ id: subAreaLink.park_operation_sub_area_id })
        .first();

      if (!subArea || !subArea.feature_id) {
        console.warn(
          `No sub_area or feature_id found for sub_area id: ${subAreaLink.park_operation_sub_area_id}`
        );
        continue;
      }

      // Find the corresponding park_feature using feature_id
      const parkFeature = await knex("park_features")
        .where({ feature_id: subArea.feature_id })
        .first();

      if (!parkFeature) {
        console.warn(
          `No park_feature found for feature_id: ${subArea.feature_id}`
        );
        continue;
      }

      // Service Dates
      if (subAreaDate.service_start_date && subAreaDate.service_end_date) {
        await insertParkDate(
          knex,
          {
            operating_year: subAreaDate.operating_year,
            start_date: subAreaDate.service_start_date,
            end_date: subAreaDate.service_end_date,
            admin_note: subAreaDate.admin_note,
            is_active: subAreaDate.is_active,
            // Park-operation-sub-area-date does not have is_date_annual column, default to false
            is_date_annual: false,
          },
          {
            park_dates_park_feature_links: {
              park_feature_id: parkFeature.id,
            },
            park_dates_park_date_type_links: {
              park_date_type_id: dateTypeMap["Operation"],
            },
          }
        );
      }

      // Reservation Dates
      if (
        subAreaDate.reservation_start_date &&
        subAreaDate.reservation_end_date
      ) {
        let dateTypeId = dateTypeMap["Reservation"];
        if (subArea?.has_backcountry_permits) {
          dateTypeId = dateTypeMap["Backcountry registration"];
        }

        await insertParkDate(
          knex,
          {
            operating_year: subAreaDate.operating_year,
            start_date: subAreaDate.reservation_start_date,
            end_date: subAreaDate.reservation_end_date,
            admin_note: subAreaDate.admin_note,
            is_active: subAreaDate.is_active,
            // Park-operation-sub-area-date does not have is_date_annual column, default to false
            is_date_annual: false,
          },
          {
            park_dates_park_feature_links: {
              park_feature_id: parkFeature.id,
            },
            park_dates_park_date_type_links: {
              park_date_type_id: dateTypeId,
            },
          }
        );
      }

      // Gate Dates, but not used in DOOT
      if (subAreaDate.open_date && subAreaDate.close_date) {
        await insertParkDate(
          knex,
          {
            operating_year: subAreaDate.operating_year,
            start_date: subAreaDate.open_date,
            end_date: subAreaDate.close_date,
            admin_note: subAreaDate.admin_note,
            is_active: subAreaDate.is_active,
            // Park-operation-sub-area-date does not have is_date_annual column, default to false
            is_date_annual: false,
          },
          {
            park_dates_park_feature_links: {
              park_feature_id: parkFeature.id,
            },
            park_dates_park_date_type_links: {
              park_date_type_id: dateTypeMap["Gate"],
            },
          }
        );
      }
    }

    // 3. Park-feature-date (feature level) -> Park-date
    const featureDates = await knex("park_feature_dates").select("*");
    for (const featureDate of featureDates) {
      if (!featureDate.date_type) {
        console.warn(
          `Skipping park_feature_date id ${featureDate.id}: missing date_type`
        );
        continue;
      }

      const dateTypeId = dateTypeMap[featureDate.date_type];
      if (!dateTypeId) {
        console.warn(
          `Skipping park_feature_date id ${featureDate.id}: unknown date_type "${featureDate.date_type}"`
        );
        console.warn(
          `Available date types: ${Object.keys(dateTypeMap).join(", ")}`
        );
        continue;
      }

      await insertParkDate(
        knex,
        {
          operating_year: featureDate.operating_year,
          start_date: featureDate.start_date,
          end_date: featureDate.end_date,
          admin_note: featureDate.admin_note,
          is_active: featureDate.is_active,
          // Park-feature-date does not have is_date_annual column, default to false
          is_date_annual: false,
        },
        {
          park_dates_park_feature_links: {
            park_feature_id: featureDate.park_feature_id,
          },
          park_dates_park_date_type_links: {
            park_date_type_id: dateTypeId,
          },
        }
      );
    }

    // 4. tierDates (park level) -> Park-date
    for (const tierDate of tierDates) {
      // Find protected_area_id using orcs
      const protectedArea = await knex("protected_areas")
        .where({ orcs: tierDate.orcs })
        .first();

      if (!protectedArea) {
        console.warn(`No protected area found for orcs: ${tierDate.orcs}`);
        continue;
      }

      await insertParkDate(
        knex,
        {
          operating_year: tierDate.operatingYear,
          start_date: tierDate.startDate,
          end_date: tierDate.endDate,
          is_active: true, // Default value
          is_date_annual: false, // Default value
        },
        {
          park_dates_protected_area_links: {
            protected_area_id: protectedArea.id,
          },
          park_dates_park_date_type_links: {
            park_date_type_id: dateTypeMap[tierDate.dateType],
          },
        }
      );
    }
  },
};
