"use strict";

// imported from DOOT backend/tasks/populate-previous-dates/previous-dates.json
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

module.exports = {
  async up(knex) {
    // Park-date-type
    const dateTypeMap = {
      Gate: 1,
      "Tier 1": 2,
      "Tier 2": 3,
      "Winter fee": 4,
      "Day-use pass": 5,
      Operation: 6,
      Reservation: 7,
      "Backcountry registration": 8,
      "First come, first served": 9,
      "Full services and fees": 10,
    };

    // 1. Park-operation-date (park level) -> Park-date
    const parkOperationDates = await knex("park_operation_dates").select("*");
    for (const parkDate of parkOperationDates) {

      // Step 1: Get the link to protected_area
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

      // Step 2: Get the park_operations_protected_area_links record
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

      // Step 3: Get the park_operation
      const parkOperation = await knex("park_operations")
        .where({ id: operationLink.park_operation_id })
        .first();

      const isDateAnnual = parkOperation?.is_date_range_annual || false;

      // Gate dates
      await knex("park_dates").insert({
        operating_year: parkDate.operating_year,
        start_date: parkDate.gate_open_date,
        end_date: parkDate.gate_close_date,
        admin_note: parkDate.admin_note,
        protected_area_id: dateLink.protected_area_id,
        park_date_type_id: dateTypeMap["Gate"],
        // Park-operation-date does not have is_active column, default to true
        is_active: true,
        is_date_annual: isDateAnnual,
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    // 2. Park-operation-sub-area-date (feature level) -> Park-date
    const subAreaDates = await knex("park_operation_sub_area_dates").select(
      "*"
    );
    for (const subAreaDate of subAreaDates) {
      // Find related park_operation_sub_area for hasBackcountryPermits
      const subArea = await knex("park_operation_sub_areas")
        .where({ id: subAreaDate.park_operation_sub_area_id })
        .first();

      // Service Dates
      if (subAreaDate.service_start_date && subAreaDate.service_end_date) {
        await knex("park_dates").insert({
          operating_year: subAreaDate.operating_year,
          start_date: subAreaDate.service_start_date,
          end_date: subAreaDate.service_end_date,
          admin_note: subAreaDate.admin_note,
          park_feature_id: subAreaDate.park_operation_sub_area_id, // or park_area_id if needed
          park_date_type_id: dateTypeMap["Operation"],
          is_active: subAreaDate.is_active,
          // Park-operation-sub-area-date does not have is_date_annual column, default to false
          is_date_annual: false,
          created_at: new Date(),
          updated_at: new Date(),
        });
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
        await knex("park_dates").insert({
          operating_year: subAreaDate.operating_year,
          start_date: subAreaDate.reservation_start_date,
          end_date: subAreaDate.reservation_end_date,
          admin_note: subAreaDate.admin_note,
          park_feature_id: subAreaDate?.park_operation_sub_area_id,
          park_date_type_id: dateTypeId,
          is_active: subAreaDate.is_active,
          // Park-operation-sub-area-date does not have is_date_annual column, default to false
          is_date_annual: false,
          created_at: new Date(),
          updated_at: new Date(),
        });
      }

      // Gate Dates, not used in DOOT
      if (subAreaDate.open_date && subAreaDate.close_date) {
        await knex("park_dates").insert({
          operating_year: subAreaDate.operating_year,
          start_date: subAreaDate.open_date,
          end_date: subAreaDate.close_date,
          admin_note: subAreaDate.admin_note,
          park_feature_id: subAreaDate?.park_operation_sub_area_id,
          park_date_type_id: dateTypeMap["Gate"],
          is_active: subAreaDate.is_active,
          // Park-operation-sub-area-date does not have is_date_annual column, default to false
          is_date_annual: false,
          created_at: new Date(),
          updated_at: new Date(),
        });
      }
    }

    // 3. Park-feature-date (feature level) -> Park-date
    const featureDates = await knex("park_feature_dates").select("*");
    for (const featureDate of featureDates) {
      await knex("park_dates").insert({
        operating_year: featureDate.operating_year,
        start_date: featureDate.start_date,
        end_date: featureDate.end_date,
        admin_note: featureDate.admin_note,
        park_feature_id: featureDate.park_feature_id, // or park_area_id if needed
        park_date_type_id: dateTypeMap[featureDate.date_type],
        is_active: featureDate.is_active,
        // Park-feature-date does not have is_date_annual column, default to false
        is_date_annual: false,
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    // 4. tierDates (park level) -> Park-date
    for (const tierDate of tierDates) {
      // Find protected_area_id using orcs
      const protectedArea = await knex("protected_areas")
        .where({ orcs: tierDate.orcs })
        .first();

      await knex("park_dates").insert({
        operating_year: tierDate.operatingYear,
        start_date: tierDate.startDate,
        end_date: tierDate.endDate,
        protected_area_id: protectedArea ? protectedArea.id : null,
        park_date_type_id: dateTypeMap[tierDate.dateType],
        is_active: true,
        is_date_annual: false,
        created_at: new Date(),
        updated_at: new Date(),
      });
    }
  },
};
