"use strict";

/*
 Updates park_date_types table with missing data from DOOT DateTypes table.
 Rank (sort order) is also being added based on the rules in CMS-1107.
 These fields were added to Strapi so that Strapi can become the source of truth
 for this data.
*/

const rows = [
  {
    id: 4,
    name: "Backcountry registration",
    parkLevel: false,
    description:
      "Enter dates when backcountry permit registration is required either online or at self-registration kiosks. If required year-round, enter Jan 1 to Dec 31.",
    endDateLabel: "Backcountry registration end date",
    featureLevel: true,
    parkAreaLevel: true,
    startDateLabel: "Backcountry registration start date",
    strapiDateTypeId: 8,
    rank: 80,
  },
  {
    id: 5,
    name: "First come, first served",
    parkLevel: false,
    description: "Dates when the campground is FCFS only.",
    endDateLabel: "First come first served end date",
    featureLevel: false,
    parkAreaLevel: true,
    startDateLabel: "First come first served start date",
    strapiDateTypeId: 9,
    rank: 90,
  },
  {
    id: 6,
    name: "Full services and fees",
    parkLevel: false,
    description: "The PO is operating and charging regular fees.",
    endDateLabel: "Full services and fees end date",
    featureLevel: true,
    parkAreaLevel: true,
    startDateLabel: "Full services and fees start date",
    strapiDateTypeId: 10,
    rank: 100,
  },
  {
    id: 8,
    name: "Operation",
    parkLevel: false,
    description:
      "For areas managed by a park operator, this includes all dates when the PO is operating. For non-reservable backcountry and marine-access campgrounds, this includes all dates when camping is allowed, whether a PO is operating or not. For areas not managed by POs, this includes all times when the area is available for public use, and access is not blocked by a gate.",
    endDateLabel: "Service End Date",
    featureLevel: true,
    parkAreaLevel: true,
    startDateLabel: "Service Start Date",
    strapiDateTypeId: 6,
    rank: 60,
  },
  {
    id: 9,
    name: "Reservation",
    parkLevel: false,
    description: "Enter dates when reservations are available.",
    endDateLabel: "Reservation End Date",
    featureLevel: true,
    parkAreaLevel: false,
    startDateLabel: "Reservation Start Date",
    strapiDateTypeId: 7,
    rank: 70,
  },
  {
    id: 10,
    name: "Tier 1",
    parkLevel: true,
    description: "Enter dates when this park accepts same-day reservations.",
    endDateLabel: "Tier 1 end date",
    featureLevel: false,
    parkAreaLevel: false,
    startDateLabel: "Tier 1 start date",
    strapiDateTypeId: 2,
    rank: 20,
  },
  {
    id: 11,
    name: "Tier 2",
    parkLevel: true,
    description:
      "Enter dates when this park requires reservations to be made two-days prior to arrival.",
    endDateLabel: "Tier 2 end date",
    featureLevel: false,
    parkAreaLevel: false,
    startDateLabel: "Tier 2 start date",
    strapiDateTypeId: 3,
    rank: 30,
  },
  {
    id: 7,
    name: "Park gate open",
    parkLevel: true,
    description:
      "Date range when the gate (or gates) is open and allows visitors to access the park by vehicle. If there are multiple gates, enter dates for the earliest gate opening and latest gate closing.",
    endDateLabel: "Park gate open end date",
    featureLevel: false,
    parkAreaLevel: false,
    startDateLabel: "Park gate open start date",
    strapiDateTypeId: 1,
    rank: 10,
  },
  {
    id: 12,
    name: "Winter fee",
    parkLevel: true,
    description: "Reduced services and reduced legislated winter fees.",
    endDateLabel: "Winter end date",
    featureLevel: true,
    parkAreaLevel: false,
    startDateLabel: "Winter start date",
    strapiDateTypeId: 4,
    rank: 40,
  },
];

// Turn the rows into a map by their strapiDateTypeId for easy lookup
const dateTypeMap = rows.reduce((map, dateType) => {
  map[dateType.strapiDateTypeId] = dateType;
  return map;
}, {});

module.exports = {
  async up(knex) {
    // Only proceed if the park_date_types table has a park_level column.
    // All of the new fields are added in the same schema change.
    if (!(await knex.schema.hasColumn("park_date_types", "park_level"))) {
      return;
    }

    // Loop through Strapi park-date-types and update the missing fields with data from DOOT
    const strapiDateTypes = await knex("park_date_types").select("*");

    for (const strapiDateType of strapiDateTypes) {
      const dootDateType = dateTypeMap[strapiDateType.id];
      if (dootDateType) {
        await knex("park_date_types")
          .where({ date_type_id: strapiDateType.date_type_id })
          .update({
            park_level: dootDateType.parkLevel,
            description: dootDateType.description,
            end_date_label: dootDateType.endDateLabel,
            feature_level: dootDateType.featureLevel,
            park_area_level: dootDateType.parkAreaLevel,
            start_date_label: dootDateType.startDateLabel,
            rank: dootDateType.rank,
          });
      }
    }

    // set the new rank field in park_area_type to 0 because it is required
    await knex("park_area_types").update({ rank: 0 });

    // set the new rank field in park_feature_type to 0 because it is required
    await knex("park_feature_types").update({ rank: 0 });
  },
};
