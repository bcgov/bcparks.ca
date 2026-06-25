"use strict";

/*
This migration adds new event types to the event_types table and populates
new fields on existing records.
*/

const data = [
  {
    eventType: "Access restricted",
    description:
      "Access to a specific park, area, trail, or facility is limited (e.g., permits, escorts, time windows) for safety, cultural, wildlife, or operational reasons.",
    scope: "Both",
  },
  {
    eventType: "Anchorage",
    description:
      "Guidance or restrictions on where and how vessels may anchor or use mooring buoys within marine park areas.",
    scope: "Both",
  },
  {
    eventType: "Area closure",
    description:
      "A defined area, site, or trail is closed—temporarily or until further notice—due to hazards, protection needs, or operations.",
    scope: "Both",
  },
  {
    eventType: "Avalanche",
    description:
      "Advisory that avalanche hazards exist and visitors must check forecasts and use appropriate winter backcountry caution.",
    scope: "Both",
  },
  {
    eventType: "Avalanche hazard",
    description:
      "Advisory that avalanche hazards exist and visitors must check forecasts and use appropriate winter backcountry caution.",
    scope: "Both",
  },
  {
    eventType: "Boat launch",
    description:
      "Status changes, restrictions, or closures affecting boat launch facilities and associated access/parking.",
    scope: "Both",
  },
  {
    eventType: "Boil water advisory",
    description:
      "Drinking water must be boiled, filtered, or treated before use due to water‑quality concerns.",
    scope: "BCP",
  },
  {
    eventType: "Boundary adjustment",
    description:
      "Notification of changes to a park/protected area boundary or alignment.",
    scope: "Both",
  },
  {
    eventType: "Bridge outage",
    description:
      "A bridge is unsafe, damaged, or removed, altering route access until repairs or replacement occur.",
    scope: "Both",
  },
  {
    eventType: "Campfires",
    description:
      "Restrictions or prohibitions on campfires/open burning, typically during elevated wildfire risk.",
    scope: "Both",
  },
  {
    eventType: "Campground capacity",
    description:
      "Information on seasonal capacity, availability, or operating status of campgrounds (e.g., winter operations, early openings).",
    scope: "Both",
  },
  {
    eventType: "Campground closure",
    description:
      "Full or partial campground closures due to hazards, maintenance, damage, seasonality, or project work.",
    scope: "Both",
  },
  {
    eventType: "Campground expansion",
    description:
      "Announcements of new campsites or expansions to increase capacity and improve facilities.",
    scope: "BCP",
  },
  {
    eventType: "Campground infrastructure",
    description:
      "Construction or upgrades to campground infrastructure (e.g., service centers, utilities) that affect use.",
    scope: "BCP",
  },
  {
    eventType: "Campground maintenance",
    description:
      "Routine or scheduled maintenance in campgrounds that may cause noise, delays, or temporary facility outages.",
    scope: "Both",
  },
  {
    eventType: "Camping",
    description:
      "General rules, availability, and limitations for camping (frontcountry/backcountry), including what is or isn’t permitted.",
    scope: "Both",
  },
  {
    eventType: "Construction",
    description:
      "Project work (trail, road, facility) that may cause detours, reduced access, noise, or temporary closures.",
    scope: "Both",
  },
  {
    eventType: "Cultural",
    description:
      "Notices tied to Indigenous cultural values/management, including closures or protocols to protect cultural heritage.",
    scope: "Both",
  },
  {
    eventType: "Day-use passes",
    description:
      "Requirement to obtain a (free) day‑use pass to manage visitor volumes for specific dates/areas.",
    scope: "BCP",
  },
  {
    eventType: "Dock closure",
    description:
      "A dock is closed or limited for safety, damage, or maintenance reasons, affecting boating access.",
    scope: "Both",
  },
  {
    eventType: "Drinking water",
    description:
      "Potable water availability has changed (e.g., taps off, bring your own) due to outages or system issues.",
    scope: "BCP",
  },
  {
    eventType: "Ecosystem protection",
    description:
      "Visitor rules and advisories to protect sensitive habitats/species or water quality (e.g., leash pets, no discharge).",
    scope: "BCP",
  },
  {
    eventType: "Ecosystem restoration project",
    description:
      "Active habitat restoration works (e.g., wetland/forest treatments) with related temporary restrictions.",
    scope: "BCP",
  },
  {
    eventType: "Event",
    description:
      "Information about park‑led programs, celebrations, or community events held in or about the park.",
    scope: "Both",
  },
  {
    eventType: "Facilities unavailable",
    description:
      "Amenities (e.g., water if available, washrooms, sani‑stations, pumps) are temporarily unavailable due to outages or repairs.",
    scope: "Both",
  },
  {
    eventType: "Facility closure",
    description:
      "A specific facility (e.g., hut, cabin, building, washroom) is closed until further notice.",
    scope: "BCP",
  },
  {
    eventType: "Facility out of service",
    description:
      "A particular piece of infrastructure is not operational (e.g., water system, toilet, cable car) pending repair.",
    scope: "BCP",
  },
  {
    eventType: "Facility reopening",
    description:
      "Announcement that a previously closed area or facility has reopened to visitors.",
    scope: "Both",
  },
  {
    eventType: "Feedback",
    description:
      "Request for visitor input (surveys, comment forms) to inform park operations or planning.",
    scope: "BCP",
  },
  {
    eventType: "Flood",
    description:
      "Active or forecast flooding affecting safety, access, or operations within the park.",
    scope: "Both",
  },
  {
    eventType: "Flood damage",
    description:
      "Flood‑related damage (e.g., washed‑out bridges/roads) causing closures, detours, or hazards.",
    scope: "Both",
  },
  {
    eventType: "Freshet",
    description:
      "Seasonal high‑water conditions (spring runoff) requiring caution and occasionally limiting access.",
    scope: "Both",
  },
  {
    eventType: "Freshet",
    description:
      "Seasonal high‑water conditions (spring runoff) requiring caution and occasionally limiting access.",
    scope: "Both",
  },
  {
    eventType: "Gate closure",
    description:
      "Vehicle gates are closed (often seasonally), restricting motorized access; foot access may remain.",
    scope: "Both",
  },
  {
    eventType: "Group camping",
    description:
      "Details on group site availability, reservations, and related rules.",
    scope: "Both",
  },
  {
    eventType: "Hazard conditions",
    description:
      "General advisories about significant hazards (water, terrain, industrial activity) requiring heightened caution.",
    scope: "Both",
  },
  {
    eventType: "Hazard facility",
    description:
      "A specific facility poses a temporary hazard to users (e.g., obstructions or unsafe operating conditions).",
    scope: "Both",
  },
  {
    eventType: "Hazard trees",
    description:
      "Danger from unstable/damaged trees prompting closures, decommissioning, or caution.",
    scope: "Both",
  },
  {
    eventType: "Horseback riding",
    description:
      "Guidance or restrictions for equestrian use of park trails/facilities (inferred where descriptions were absent).",
    scope: "Both",
  },
  {
    eventType: "Hours of operation",
    description:
      "Park/day‑use hours and curfews, including overnight parking/use prohibitions.",
    scope: "BCP",
  },
  {
    eventType: "Icy conditions",
    description:
      "Ice or frost present on surfaces, creating slippery and potentially hazardous travel conditions.",
    scope: "Both",
  },
  {
    eventType: "Landslide",
    description:
      "Landslide activity leading to closures, detours, or travel advisories.",
    scope: "Both",
  },
  {
    eventType: "Motorized boats prohibited",
    description:
      "Notice that motorized vessels are not permitted in a park/waterbody to protect values or comply with regulation.",
    scope: "Both",
  },
  {
    eventType: "Camping prohibited",
    description:
      "Reminder that camping and/or campfires are not permitted at any time in the specified park/area.",
    scope: "Both",
  },
  {
    eventType: "Noise",
    description:
      "Alerts about potential noise (e.g., trains, industrial operations, helicopters) that may disturb visitors and posted quiet hours.",
    scope: "Both",
  },
  {
    eventType: "Off-road vehicles",
    description:
      "Rules on ORV registration, permitted routes, and enforcement of off‑road restrictions.",
    scope: "Both",
  },
  {
    eventType: "Pandemic",
    description:
      "COVID‑19 related closures/partial closures, local access restrictions, and public‑health protocols.",
    scope: "Both",
  },
  {
    eventType: "Park access",
    description:
      "Access conditions to a park (e.g., road deactivation, 4x4 only, seasonal limitations, ferry schedules).",
    scope: "Both",
  },
  {
    eventType: "Park closure",
    description:
      "Full park closure under regulation for safety, wildfire, flood, cultural, or community reasons.",
    scope: "Both",
  },
  {
    eventType: "Park maintenance",
    description:
      "Park‑wide maintenance activities that may reduce services or cause short closures.",
    scope: "Both",
  },
  {
    eventType: "Park management",
    description:
      "Governance/management updates (e.g., co‑management with First Nations, title areas, policies).",
    scope: "BCP",
  },
  {
    eventType: "Park name",
    description:
      "Announcement of an official renaming to reflect Indigenous names or correct nomenclature.",
    scope: "Both",
  },
  {
    eventType: "Park policy",
    description:
      "Policy reminders (e.g., alcohol/smoking rules, commercial use requirements) applicable in the park.",
    scope: "Both",
  },
  {
    eventType: "Parking",
    description:
      "Parking rules, capacity/overflow information, and towing enforcement for illegal parking.",
    scope: "Both",
  },
  {
    eventType: "Parking lot access",
    description:
      "Status or restrictions for specific parking lots/access roads (e.g., closures, seasonal limits).",
    scope: "Both",
  },
  {
    eventType: "Pets",
    description:
      "Pet policies and seasonal restrictions (e.g., leash rules, beach closures, wildlife protection).",
    scope: "Both",
  },
  {
    eventType: "Prescribed burn",
    description:
      "Planned burning for ecosystem restoration or fuel reduction, often with smoke advisories.",
    scope: "Both",
  },
  {
    eventType: "Private land / off-limits",
    description:
      "Reminder that certain routes/areas cross private land and are not open to public access.",
    scope: "Both",
  },
  {
    eventType: "Public consultation",
    description:
      "Invitations to provide input on plans/strategies or share comments to improve management.",
    scope: "Both",
  },
  {
    eventType: "Regulations",
    description:
      "Special regulations in specific areas or seasons (e.g., guided‑only access, closures).",
    scope: "Both",
  },
  {
    eventType: "Reservations",
    description:
      "Information about reservation systems, booking windows, and newly reservable facilities.",
    scope: "Both",
  },
  {
    eventType: "Road closure",
    description:
      "Road or bridge closures affecting resource access due to construction, washouts, landslides, or safety.",
    scope: "Both",
  },
  {
    eventType: "Road conditions",
    description:
      "Current conditions on park/forest service roads (e.g., deactivated, 4x4 only, rough).",
    scope: "Both",
  },
  {
    eventType: "Road construction",
    description:
      "Road building or upgrades with traffic control, delays, and temporary restrictions.",
    scope: "Both",
  },
  {
    eventType: "Road hazards",
    description:
      "Specific road hazards (washouts, narrow grades, rockfall) requiring extra caution.",
    scope: "Both",
  },
  {
    eventType: "Road inaccessible",
    description:
      "A segment is impassable or deactivated with no vehicle access.",
    scope: "Both",
  },
  {
    eventType: "Rockfall hazard",
    description:
      "Rockfall risk leading to closures or travel restrictions in affected zones.",
    scope: "Both",
  },
  {
    eventType: "Scheduled closure",
    description:
      "Announced, time‑bounded closures for operations or partner‑led restrictions.",
    scope: "Both",
  },
  {
    eventType: "Shellfish",
    description:
      "Public‑health advisory to check federal shellfish‑harvest closures before collecting/consuming.",
    scope: "Both",
  },
  {
    eventType: "Snowmobiles",
    description:
      "Where/when snowmobiling is permitted and the associated safety/avalanche requirements.",
    scope: "Both",
  },
  {
    eventType: "Spring conditions",
    description:
      "Variable spring trail/snow conditions that require preparation and caution.",
    scope: "Both",
  },
  {
    eventType: "Storm damage",
    description:
      "Storm‑related blowdown/washouts that affect trails, access, or facilities.",
    scope: "Both",
  },
  {
    eventType: "Thieves",
    description:
      "Crime‑prevention reminders to secure vehicles/belongings and report incidents.",
    scope: "Both",
  },
  {
    eventType: "Trail closure",
    description:
      "Full or partial trail closures for hazards, construction, wildlife, or protection needs.",
    scope: "Both",
  },
  {
    eventType: "Trail conditions",
    description:
      "Current trail conditions and seasonal hazards affecting safe travel.",
    scope: "Both",
  },
  {
    eventType: "Trail construction",
    description:
      "New builds or rehabilitation projects with detours and short‑term closures.",
    scope: "Both",
  },
  {
    eventType: "Trail maintenance",
    description:
      "Routine maintenance activities that may temporarily limit access.",
    scope: "Both",
  },
  {
    eventType: "Volunteer",
    description: "Opportunities for volunteer hosts/stewards and how to apply.",
    scope: "Both",
  },
  {
    eventType: "Water quality",
    description:
      "Public‑health notices for cyanobacteria/blue‑green algae and other water‑quality issues.",
    scope: "Both",
  },
  {
    eventType: "Weather",
    description:
      "Seasonal and weather‑driven condition updates and where to check forecasts.",
    scope: "Both",
  },
  {
    eventType: "Wildfire",
    description:
      "Active wildfire information (including evacuation alerts/orders) and related closures.",
    scope: "Both",
  },
  {
    eventType: "Wildfire damage",
    description:
      "Hazards and closures due to areas burned by wildfire (e.g., danger trees, unstable slopes).",
    scope: "Both",
  },
  {
    eventType: "Wildfire fuel management",
    description:
      "Fuel‑reduction treatments/prescribed activities to lower fire risk in and around parks.",
    scope: "Both",
  },
  {
    eventType: "Wildfire nearby",
    description:
      "Nearby wildfires producing smoke/evacuation advisories that may impact park use.",
    scope: "Both",
  },
  {
    eventType: "Wildfire risk",
    description:
      "Proactive restrictions and public‑safety notices during high fire danger (e.g., fire bans).",
    scope: "Both",
  },
  {
    eventType: "Wildfire tree assessment",
    description:
      "Danger‑tree or post‑fire tree assessments and the associated public hazards.",
    scope: "Both",
  },
  {
    eventType: "Wildlife",
    description:
      "Wildlife‑safety advisories and attractant management (e.g., bears, wolves, cougars, seals).",
    scope: "Both",
  },
  {
    eventType: "Wildlife protection",
    description:
      "Measures to protect specific species/habitats with visitor rules (e.g., closures, leash areas).",
    scope: "Both",
  },
  {
    eventType: "Windstorm damage",
    description: "Access closures and hazards following severe wind events.",
    scope: "Both",
  },
  {
    eventType: "Winter conditions",
    description:
      "Winter access and snow/ice hazards, including chain requirements and avalanche cautions.",
    scope: "Both",
  },
  {
    eventType: "Public safety",
    description:
      "Safety bulletins about hazards (e.g., UXO, mine traffic, theft) and required precautions.",
    scope: "Both",
  },
  {
    eventType: "Tsunami",
    description:
      "A tsunami hazard requiring evacuation, restricted access, or heightened safety measures.",
    scope: "Both",
  },
  {
    eventType: "Park re-opening",
    description:
      "Notice that a park/area has reopened for day‑use or camping after a closure.",
    scope: "Both",
  },
  {
    eventType: "Blowdown",
    description: "Trees down or overhead danger or wind event",
    scope: "RST",
  },
  {
    eventType: "Catastrophic event",
    description: "Entire site has been destroyed or greater portion unsafe",
    scope: "Both",
  },
  {
    eventType: "Closure area restriction",
    description:
      "Restriction due to emergency services restricting tourist travel",
    scope: "RST",
  },
  {
    eventType: "Damaged unsafe infrastructure",
    description: "Damaged unsafe infrastructure",
    scope: "Both",
  },
  {
    eventType: "Environmental related",
    description:
      "Due to larger ecological perspective, by other agencies or RSTBC",
    scope: "RST",
  },
  {
    eventType: "Fire rehabilitation",
    description: "Fire Rehabilitation",
    scope: "Both",
  },
  {
    eventType: "Fire suppression activity",
    description: "Fire Suppression Activity",
    scope: "Both",
  },
  {
    eventType: "Forest health",
    description: "Insect or other infestation",
    scope: "Both",
  },
  {
    eventType: "Human health",
    description: "Any issue specific to human health",
    scope: "Both",
  },
  {
    eventType: "Industrial activity",
    description:
      "Industrial activities causing dangerous conditions for public access",
    scope: "Both",
  },
  {
    eventType: "Investigation",
    description: "Closed due to legal C&E or Police investigations",
    scope: "RST",
  },
  {
    eventType: "Maintenance",
    description: "Repair or enhancement to site or trail",
    scope: "RST",
  },
  {
    eventType: "Road washout",
    description: "Road Washout",
    scope: "Both",
  },
  {
    eventType: "Seasonal",
    description: "Operating season ended",
    scope: "Both",
  },
  {
    eventType: "Trail access",
    description: "Trail is impacted",
    scope: "Both",
  },
  {
    eventType: "Wildfire closure year",
    description: "For planning purposes and forest recovery",
    scope: "RST",
  },
  {
    eventType: "Shellfish",
    description:
      "Public‑health advisory to check federal shellfish‑harvest closures before collecting/consuming.",
    scope: "Both",
  },
];

exports.up = async function (knex) {
  if (!(await knex.schema.hasTable("event_types"))) {
    return;
  }

  // add new columns if they don't exist
  if (!(await knex.schema.hasColumn("event_types", "scope"))) {
    await knex.schema.table("event_types", (table) => {
      table.string("scope");
    });
  }

  // rename items prior to import
  await knex.raw(
    `update event_types set event_type = 'Park re-opening' where event_type = 'Park opening'`,
  );

  // this one is already right on prod but wrong on some dev/staging environments
  await knex.raw(
    `update event_types set event_type = 'Camping prohibited' where event_type = 'No camping'`,
  );

  // create event_type_sub_categories if it doesn't exist yet
  // (required before using the Strapi documents API for event-type, which JOINs this table)
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

  // do an upsert based on eventType using the Strapi documents API
  const eventTypeDocuments = strapi.documents("api::event-type.event-type");

  const existingEventTypes = await eventTypeDocuments.findMany({
    fields: ["documentId", "eventType"],
  });
  const eventTypeMap = {};
  for (const et of existingEventTypes) {
    eventTypeMap[et.eventType] = et;
  }

  for (const { eventType, description, scope } of data) {
    const existing = eventTypeMap[eventType];
    if (existing) {
      await eventTypeDocuments.update({
        documentId: existing.documentId,
        data: { eventType, description, scope },
      });
    } else {
      await eventTypeDocuments.create({
        data: { eventType, description, scope },
      });
    }
  }
};
