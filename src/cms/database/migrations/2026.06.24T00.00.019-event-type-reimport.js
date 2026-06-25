"use strict";

const subCategories = [
  { category: "Access and facilities", subCategory: "Access" },
  { category: "Access and facilities", subCategory: "Area closures" },
  { category: "Access and facilities", subCategory: "Facilities" },
  {
    category: "Access and facilities",
    subCategory: "Construction/maintenance",
  },
  { category: "Ecological", subCategory: "Natural disasters and emergencies" },
  { category: "Ecological", subCategory: "Hazards" },
  { category: "Ecological", subCategory: "Human health" },
  { category: "Ecological", subCategory: "Wildfire" },
  { category: "Ecological", subCategory: "Environment and wildlife" },
  { category: "Ecological", subCategory: "Weather and seasonal" },
  { category: "People", subCategory: "Activities" },
  { category: "People", subCategory: "Park management" },
  { category: "People", subCategory: "Community" },
  { category: "People", subCategory: "Public behaviour" },
];

const eventTypes = [
  {
    subCategory: "Access",
    eventType: "Access restricted",
  },
  {
    subCategory: "Activities",
    eventType: "Anchorage",
  },
  {
    subCategory: "Area closures",
    eventType: "Area closure",
  },
  {
    subCategory: "Natural disasters and emergencies",
    eventType: "Avalanche",
  },
  {
    subCategory: "Natural disasters and emergencies",
    eventType: "Avalanche hazard",
  },
  {
    subCategory: "Hazards",
    eventType: "Blowdown",
  },
  {
    subCategory: "Facilities",
    eventType: "Boat launch",
  },
  {
    subCategory: "Human health",
    eventType: "Boil water advisory",
  },
  {
    subCategory: "Access",
    eventType: "Boundary adjustment",
  },
  {
    subCategory: "Hazards",
    eventType: "Bridge outage",
  },
  {
    subCategory: "Activities",
    eventType: "Campfires",
  },
  {
    subCategory: "Park management",
    eventType: "Campground capacity",
  },
  {
    subCategory: "Area closures",
    eventType: "Campground closure",
  },
  {
    subCategory: "Construction/maintenance",
    eventType: "Campground expansion",
  },
  {
    subCategory: "Facilities",
    eventType: "Campground infrastructure",
  },
  {
    subCategory: "Construction/maintenance",
    eventType: "Campground maintenance",
  },
  {
    subCategory: "Activities",
    eventType: "Camping",
  },
  {
    subCategory: "Natural disasters and emergencies",
    eventType: "Catastrophic event",
  },
  {
    subCategory: "Wildfire",
    eventType: "Closure area restriction",
  },
  {
    subCategory: "Construction/maintenance",
    eventType: "Construction",
  },
  {
    subCategory: "Community",
    eventType: "Cultural",
  },
  {
    subCategory: "Hazards",
    eventType: "Damaged unsafe infrastructure",
  },
  {
    subCategory: "Access",
    eventType: "Day-use passes",
  },
  {
    subCategory: "Facilities",
    eventType: "Dock closure",
  },
  {
    subCategory: "Human health",
    eventType: "Drinking water",
  },
  {
    subCategory: "Environment and wildlife",
    eventType: "Ecosystem protection",
  },
  {
    subCategory: "Environment and wildlife",
    eventType: "Ecosystem restoration project",
  },
  {
    subCategory: "Environment and wildlife",
    eventType: "Environmental related",
  },
  {
    subCategory: "Community",
    eventType: "Event",
  },
  {
    subCategory: "Facilities",
    eventType: "Facilities unavailable",
  },
  {
    subCategory: "Facilities",
    eventType: "Facility closure",
  },
  {
    subCategory: "Facilities",
    eventType: "Facility out of service",
  },
  {
    subCategory: "Facilities",
    eventType: "Facility reopening",
  },
  {
    subCategory: "Community",
    eventType: "Feedback",
  },
  {
    subCategory: "Wildfire",
    eventType: "Fire rehabilitation",
  },
  {
    subCategory: "Wildfire",
    eventType: "Fire suppression activity",
  },
  {
    subCategory: "Natural disasters and emergencies",
    eventType: "Flood",
  },
  {
    subCategory: "Natural disasters and emergencies",
    eventType: "Flood damage",
  },
  {
    subCategory: "Environment and wildlife",
    eventType: "Forest health",
  },
  {
    subCategory: "Hazards",
    eventType: "Freshet",
  },
  {
    subCategory: "Natural disasters and emergencies",
    eventType: "Freshet",
  },
  {
    subCategory: "Area closures",
    eventType: "Gate closure",
  },
  {
    subCategory: "Activities",
    eventType: "Group camping",
  },
  {
    subCategory: "Hazards",
    eventType: "Hazard conditions",
  },
  {
    subCategory: "Hazards",
    eventType: "Hazard facility",
  },
  {
    subCategory: "Hazards",
    eventType: "Hazard trees",
  },
  {
    subCategory: "Activities",
    eventType: "Horseback riding",
  },
  {
    subCategory: "Access",
    eventType: "Hours of operation",
  },
  {
    subCategory: "Human health",
    eventType: "Human health",
  },
  {
    subCategory: "Weather and seasonal",
    eventType: "Icy conditions",
  },
  {
    subCategory: "Construction/maintenance",
    eventType: "Industrial activity",
  },
  {
    subCategory: "Public behaviour",
    eventType: "Investigation",
  },
  {
    subCategory: "Natural disasters and emergencies",
    eventType: "Landslide",
  },
  {
    subCategory: "Construction/maintenance",
    eventType: "Maintenance",
  },
  {
    subCategory: "Activities",
    eventType: "Motorized boats prohibited",
  },
  {
    subCategory: "Activities",
    eventType: "Camping prohibited",
  },
  {
    subCategory: "Public behaviour",
    eventType: "Noise",
  },
  {
    subCategory: "Activities",
    eventType: "Off-road vehicles",
  },
  {
    subCategory: "Human health",
    eventType: "Pandemic",
  },
  {
    subCategory: "Access",
    eventType: "Park access",
  },
  {
    subCategory: "Area closures",
    eventType: "Park closure",
  },
  {
    subCategory: "Construction/maintenance",
    eventType: "Park maintenance",
  },
  {
    subCategory: "Park management",
    eventType: "Park management",
  },
  {
    subCategory: "Park management",
    eventType: "Park name",
  },
  {
    subCategory: "Access",
    eventType: "Park re-opening",
  },
  {
    subCategory: "Park management",
    eventType: "Park policy",
  },
  {
    subCategory: "Access",
    eventType: "Parking",
  },
  {
    subCategory: "Access",
    eventType: "Parking lot access",
  },
  {
    subCategory: "Public behaviour",
    eventType: "Pets",
  },
  {
    subCategory: "Environment and wildlife",
    eventType: "Prescribed burn",
  },
  {
    subCategory: "Area closures",
    eventType: "Private land / off-limits",
  },
  {
    subCategory: "Community",
    eventType: "Public consultation",
  },
  {
    subCategory: "Park management",
    eventType: "Regulations",
  },
  {
    subCategory: "Park management",
    eventType: "Reservations",
  },
  {
    subCategory: "Access",
    eventType: "Road closure",
  },
  {
    subCategory: "Access",
    eventType: "Road conditions",
  },
  {
    subCategory: "Construction/maintenance",
    eventType: "Road construction",
  },
  {
    subCategory: "Access",
    eventType: "Road hazards",
  },
  {
    subCategory: "Hazards",
    eventType: "Road hazards",
  },
  {
    subCategory: "Access",
    eventType: "Road inaccessible",
  },
  {
    subCategory: "Access",
    eventType: "Road washout",
  },
  {
    subCategory: "Natural disasters and emergencies",
    eventType: "Rockfall hazard",
  },
  {
    subCategory: "Area closures",
    eventType: "Scheduled closure",
  },
  {
    subCategory: "Weather and seasonal",
    eventType: "Seasonal",
  },
  {
    subCategory: "Hazards",
    eventType: "Shellfish",
  },
  {
    subCategory: "Human health",
    eventType: "Shellfish",
  },
  {
    subCategory: "Activities",
    eventType: "Snowmobiles",
  },
  {
    subCategory: "Weather and seasonal",
    eventType: "Spring conditions",
  },
  {
    subCategory: "Weather and seasonal",
    eventType: "Storm damage",
  },
  {
    subCategory: "Public behaviour",
    eventType: "Thieves",
  },
  {
    subCategory: "Access",
    eventType: "Trail access",
  },
  {
    subCategory: "Area closures",
    eventType: "Trail closure",
  },
  {
    subCategory: "Hazards",
    eventType: "Trail conditions",
  },
  {
    subCategory: "Construction/maintenance",
    eventType: "Trail construction",
  },
  {
    subCategory: "Construction/maintenance",
    eventType: "Trail maintenance",
  },
  {
    subCategory: "Natural disasters and emergencies",
    eventType: "Tsunami",
  },
  {
    subCategory: "Community",
    eventType: "Volunteer",
  },
  {
    subCategory: "Human health",
    eventType: "Water quality",
  },
  {
    subCategory: "Weather and seasonal",
    eventType: "Weather",
  },
  {
    subCategory: "Wildfire",
    eventType: "Wildfire",
  },
  {
    subCategory: "Wildfire",
    eventType: "Wildfire closure year",
  },
  {
    subCategory: "Wildfire",
    eventType: "Wildfire damage",
  },
  {
    subCategory: "Wildfire",
    eventType: "Wildfire fuel management",
  },
  {
    subCategory: "Wildfire",
    eventType: "Wildfire nearby",
  },
  {
    subCategory: "Wildfire",
    eventType: "Wildfire risk",
  },
  {
    subCategory: "Wildfire",
    eventType: "Wildfire tree assessment",
  },
  {
    subCategory: "Environment and wildlife",
    eventType: "Wildlife",
  },
  {
    subCategory: "Environment and wildlife",
    eventType: "Wildlife protection",
  },
  {
    subCategory: "Weather and seasonal",
    eventType: "Windstorm damage",
  },
  {
    subCategory: "Weather and seasonal",
    eventType: "Winter conditions",
  },
  {
    subCategory: "Hazards",
    eventType: "Public safety",
  },
];

async function getSubCategoryMap() {
  const subCategories = await strapi
    .documents("api::event-type-sub-category.event-type-sub-category")
    .findMany({
      fields: ["documentId", "subCategory"],
    });
  const subCategoryMap = {};

  for (const existingSubCategory of subCategories) {
    subCategoryMap[existingSubCategory.subCategory] = existingSubCategory;
  }

  return subCategoryMap;
}

module.exports = {
  async up(knex) {
    if (!(await knex.schema.hasTable("event_types"))) {
      return;
    }

    // create event_type_sub_categories if it doesn't exist yet
    if (!(await knex.schema.hasTable("event_type_sub_categories"))) {
      await knex.schema.createTable("event_type_sub_categories", (table) => {
        table.increments("id").primary();
        table.string("document_id", 255);
        table.string("sub_category", 255);
        table.string("category", 255);
        table.timestamp("created_at", { precision: 6 });
        table.timestamp("updated_at", { precision: 6 });
        table.timestamp("published_at", { precision: 6 });
        table
          .integer("created_by_id")
          .references("id")
          .inTable("admin_users")
          .onDelete("SET NULL");
        table
          .integer("updated_by_id")
          .references("id")
          .inTable("admin_users")
          .onDelete("SET NULL");
        table.string("locale", 255);
        table.index(
          ["document_id", "locale", "published_at"],
          "event_type_sub_categories_documents_idx",
        );
        table.index(
          ["created_by_id"],
          "event_type_sub_categories_created_by_id_fk",
        );
        table.index(
          ["updated_by_id"],
          "event_type_sub_categories_updated_by_id_fk",
        );
      });
    }

    // create the link table if it doesn't exist yet
    if (
      !(await knex.schema.hasTable("event_type_sub_categories_event_types_lnk"))
    ) {
      await knex.schema.createTable(
        "event_type_sub_categories_event_types_lnk",
        (table) => {
          table.increments("id").primary();
          table
            .integer("event_type_sub_category_id")
            .references("id")
            .inTable("event_type_sub_categories")
            .onDelete("CASCADE");
          table
            .integer("event_type_id")
            .references("id")
            .inTable("event_types")
            .onDelete("CASCADE");
          table.double("event_type_ord");
          table.double("event_type_sub_category_ord");
          table.unique(["event_type_sub_category_id", "event_type_id"], {
            indexName: "event_type_sub_categories_event_types_lnk_uq",
          });
          table.index(
            ["event_type_sub_category_id"],
            "event_type_sub_categories_event_types_lnk_fk",
          );
          table.index(
            ["event_type_id"],
            "event_type_sub_categories_event_types_lnk_ifk",
          );
          table.index(
            ["event_type_ord"],
            "event_type_sub_categories_event_types_lnk_ofk",
          );
          table.index(
            ["event_type_sub_category_ord"],
            "event_type_sub_categories_event_types_lnk_oifk",
          );
        },
      );
    }

    // upsert sub-categories and connect event types
    {
      let subCategoryMap = await getSubCategoryMap();

      const eventTypeSubCategoryDocuments = strapi.documents(
        "api::event-type-sub-category.event-type-sub-category",
      );

      // loop through the subCategories and upsert
      for (const { category, subCategory } of subCategories) {
        const existingSubCategory = subCategoryMap[subCategory];

        if (existingSubCategory) {
          await eventTypeSubCategoryDocuments.update({
            documentId: existingSubCategory.documentId,
            data: {
              category,
              subCategory,
            },
          });
          continue;
        }

        await eventTypeSubCategoryDocuments.create({
          data: {
            category,
            subCategory,
          },
        });
      }

      // get the map again
      subCategoryMap = await getSubCategoryMap();

      // use knex sql to delete extra eventTypes
      await knex("event_types")
        .whereIn("event_type", ["Freshet", "Road hazards"])
        .andWhere("precedence", null)
        .del();

      // delete the "Shellfish" record with the highest id
      const shellfishRecords = await knex("event_types")
        .where("event_type", "Shellfish")
        .orderBy("id", "desc")
        .select("id");

      if (shellfishRecords.length > 1) {
        await knex("event_types").where("id", shellfishRecords[0].id).del();
      }

      // use `connect()` in the Strapi document api to connect the sub-categories to the event types
      const eventTypeDocuments = strapi.documents("api::event-type.event-type");

      for (const { subCategory, eventType } of eventTypes) {
        const existingSubCategory = subCategoryMap[subCategory];

        if (!existingSubCategory) {
          console.warn(
            `Sub-category "${subCategory}" not found for event type "${eventType}". Skipping...`,
          );
          continue;
        }

        const existingEventType = await eventTypeDocuments.findMany({
          filters: {
            eventType,
          },
          limit: 1,
        });

        if (existingEventType.length === 0) {
          console.warn(
            `Event type "${eventType}" not found for sub-category "${subCategory}". Skipping...`,
          );
          continue;
        }

        await eventTypeDocuments.update({
          documentId: existingEventType[0].documentId,
          data: {
            eventTypeSubCategories: {
              connect: [existingSubCategory.documentId],
            },
          },
        });
      }
    }
  },
};
