"use strict";

/*
This migration adds new event types to the event_types table and populates
new fields on existing records.
*/

const existingItems = [
  {
    category: "Access and facilities",
    group_label: "Access",
    event_type: "Access restricted",
    description:
      "Access to a specific park, area, trail, or facility is limited (e.g., permits, escorts, time windows) for safety, cultural, wildlife, or operational reasons.",
    scope: "Both",
  },
  {
    category: "People",
    group_label: "Activities",
    event_type: "Anchorage",
    description:
      "Guidance or restrictions on where and how vessels may anchor or use mooring buoys within marine park areas.",
    scope: "Both",
  },
  {
    category: "Access and facilities",
    group_label: "Area closures",
    event_type: "Area closure",
    description:
      "A defined area, site, or trail is closed—temporarily or until further notice—due to hazards, protection needs, or operations.",
    scope: "Both",
  },
  {
    category: "Ecological",
    group_label: "Natural disasters and emergencies",
    event_type: "Avalanche",
    description:
      "Advisory that avalanche hazards exist and visitors must check forecasts and use appropriate winter backcountry caution.",
    scope: "Both",
  },
  {
    category: "Ecological",
    group_label: "Natural disasters and emergencies",
    event_type: "Avalanche hazard",
    description:
      "Advisory that avalanche hazards exist and visitors must check forecasts and use appropriate winter backcountry caution.",
    scope: "Both",
  },
  {
    category: "Access and facilities",
    group_label: "Facilities",
    event_type: "Boat launch",
    description:
      "Status changes, restrictions, or closures affecting boat launch facilities and associated access/parking.",
    scope: "Both",
  },
  {
    category: "Ecological",
    group_label: "Human health",
    event_type: "Boil water advisory",
    description:
      "Drinking water must be boiled, filtered, or treated before use due to water‑quality concerns.",
    scope: "BCP",
  },
  {
    category: "Access and facilities",
    group_label: "Access",
    event_type: "Boundary adjustment",
    description:
      "Notification of changes to a park/protected area boundary or alignment.",
    scope: "Both",
  },
  {
    category: "Ecological",
    group_label: "Hazards",
    event_type: "Bridge outage",
    description:
      "A bridge is unsafe, damaged, or removed, altering route access until repairs or replacement occur.",
    scope: "Both",
  },
  {
    category: "People",
    group_label: "Activities",
    event_type: "Campfires",
    description:
      "Restrictions or prohibitions on campfires/open burning, typically during elevated wildfire risk.",
    scope: "Both",
  },
  {
    category: "People",
    group_label: "Park management",
    event_type: "Campground capacity",
    description:
      "Information on seasonal capacity, availability, or operating status of campgrounds (e.g., winter operations, early openings).",
    scope: "Both",
  },
  {
    category: "Access and facilities",
    group_label: "Area closures",
    event_type: "Campground closure",
    description:
      "Full or partial campground closures due to hazards, maintenance, damage, seasonality, or project work.",
    scope: "Both",
  },
  {
    category: "Access and facilities",
    group_label: "Construction/maintenance",
    event_type: "Campground expansion",
    description:
      "Announcements of new campsites or expansions to increase capacity and improve facilities.",
    scope: "BCP",
  },
  {
    category: "Access and facilities",
    group_label: "Facilities",
    event_type: "Campground infrastructure",
    description:
      "Construction or upgrades to campground infrastructure (e.g., service centers, utilities) that affect use.",
    scope: "BCP",
  },
  {
    category: "Access and facilities",
    group_label: "Construction/maintenance",
    event_type: "Campground maintenance",
    description:
      "Routine or scheduled maintenance in campgrounds that may cause noise, delays, or temporary facility outages.",
    scope: "Both",
  },
  {
    category: "People",
    group_label: "Activities",
    event_type: "Camping",
    description:
      "General rules, availability, and limitations for camping (frontcountry/backcountry), including what is or isn’t permitted.",
    scope: "Both",
  },
  {
    category: "Access and facilities",
    group_label: "Construction/maintenance",
    event_type: "Construction",
    description:
      "Project work (trail, road, facility) that may cause detours, reduced access, noise, or temporary closures.",
    scope: "Both",
  },
  {
    category: "People",
    group_label: "Community",
    event_type: "Cultural",
    description:
      "Notices tied to Indigenous cultural values/management, including closures or protocols to protect cultural heritage.",
    scope: "Both",
  },
  {
    category: "Access and facilities",
    group_label: "Access",
    event_type: "Day-use passes",
    description:
      "Requirement to obtain a (free) day‑use pass to manage visitor volumes for specific dates/areas.",
    scope: "BCP",
  },
  {
    category: "Access and facilities",
    group_label: "Facilities",
    event_type: "Dock closure",
    description:
      "A dock is closed or limited for safety, damage, or maintenance reasons, affecting boating access.",
    scope: "Both",
  },
  {
    category: "Ecological",
    group_label: "Human health",
    event_type: "Drinking water",
    description:
      "Potable water availability has changed (e.g., taps off, bring your own) due to outages or system issues.",
    scope: "BCP",
  },
  {
    category: "Ecological",
    group_label: "Environment and wildlife",
    event_type: "Ecosystem protection",
    description:
      "Visitor rules and advisories to protect sensitive habitats/species or water quality (e.g., leash pets, no discharge).",
    scope: "BCP",
  },
  {
    category: "Ecological",
    group_label: "Environment and wildlife",
    event_type: "Ecosystem restoration project",
    description:
      "Active habitat restoration works (e.g., wetland/forest treatments) with related temporary restrictions.",
    scope: "BCP",
  },
  {
    category: "People",
    group_label: "Community",
    event_type: "Event",
    description:
      "Information about park‑led programs, celebrations, or community events held in or about the park.",
    scope: "Both",
  },
  {
    category: "Access and facilities",
    group_label: "Facilities",
    event_type: "Facilities unavailable",
    description:
      "Amenities (e.g., water if available, washrooms, sani‑stations, pumps) are temporarily unavailable due to outages or repairs.",
    scope: "Both",
  },
  {
    category: "Access and facilities",
    group_label: "Facilities",
    event_type: "Facility closure",
    description:
      "A specific facility (e.g., hut, cabin, building, washroom) is closed until further notice.",
    scope: "BCP",
  },
  {
    category: "Access and facilities",
    group_label: "Facilities",
    event_type: "Facility out of service",
    description:
      "A particular piece of infrastructure is not operational (e.g., water system, toilet, cable car) pending repair.",
    scope: "BCP",
  },
  {
    category: "Access and facilities",
    group_label: "Facilities",
    event_type: "Facility reopening",
    description:
      "Announcement that a previously closed area or facility has reopened to visitors.",
    scope: "Both",
  },
  {
    category: "People",
    group_label: "Community",
    event_type: "Feedback",
    description:
      "Request for visitor input (surveys, comment forms) to inform park operations or planning.",
    scope: "BCP",
  },
  {
    category: "Ecological",
    group_label: "Natural disasters and emergencies",
    event_type: "Flood",
    description:
      "Active or forecast flooding affecting safety, access, or operations within the park.",
    scope: "Both",
  },
  {
    category: "Ecological",
    group_label: "Natural disasters and emergencies",
    event_type: "Flood damage",
    description:
      "Flood‑related damage (e.g., washed‑out bridges/roads) causing closures, detours, or hazards.",
    scope: "Both",
  },
  {
    category: "Ecological",
    group_label: "Hazards",
    event_type: "Freshet",
    description:
      "Seasonal high‑water conditions (spring runoff) requiring caution and occasionally limiting access.",
    scope: "Both",
  },
  {
    category: "Ecological",
    group_label: "Natural disasters and emergencies",
    event_type: "Freshet",
    description:
      "Seasonal high‑water conditions (spring runoff) requiring caution and occasionally limiting access.",
    scope: "Both",
  },
  {
    category: "Access and facilities",
    group_label: "Area closures",
    event_type: "Gate closure",
    description:
      "Vehicle gates are closed (often seasonally), restricting motorized access; foot access may remain.",
    scope: "Both",
  },
  {
    category: "People",
    group_label: "Activities",
    event_type: "Group camping",
    description:
      "Details on group site availability, reservations, and related rules.",
    scope: "Both",
  },
  {
    category: "Ecological",
    group_label: "Hazards",
    event_type: "Hazard conditions",
    description:
      "General advisories about significant hazards (water, terrain, industrial activity) requiring heightened caution.",
    scope: "Both",
  },
  {
    category: "Ecological",
    group_label: "Hazards",
    event_type: "Hazard facility",
    description:
      "A specific facility poses a temporary hazard to users (e.g., obstructions or unsafe operating conditions).",
    scope: "Both",
  },
  {
    category: "Ecological",
    group_label: "Hazards",
    event_type: "Hazard trees",
    description:
      "Danger from unstable/damaged trees prompting closures, decommissioning, or caution.",
    scope: "Both",
  },
  {
    category: "People",
    group_label: "Activities",
    event_type: "Horseback riding",
    description:
      "Guidance or restrictions for equestrian use of park trails/facilities (inferred where descriptions were absent).",
    scope: "Both",
  },
  {
    category: "Access and facilities",
    group_label: "Access",
    event_type: "Hours of operation",
    description:
      "Park/day‑use hours and curfews, including overnight parking/use prohibitions.",
    scope: "BCP",
  },
  {
    category: "Ecological",
    group_label: "Weather and seasonal",
    event_type: "Icy conditions",
    description:
      "Ice or frost present on surfaces, creating slippery and potentially hazardous travel conditions.",
    scope: "Both",
  },
  {
    category: "Ecological",
    group_label: "Natural disasters and emergencies",
    event_type: "Landslide",
    description:
      "Landslide activity leading to closures, detours, or travel advisories.",
    scope: "Both",
  },
  {
    category: "People",
    group_label: "Activities",
    event_type: "Motorized boats prohibited",
    description:
      "Notice that motorized vessels are not permitted in a park/waterbody to protect values or comply with regulation.",
    scope: "Both",
  },
  {
    category: "People",
    group_label: "Activities",
    event_type: "Camping prohibited",
    description:
      "Reminder that camping and/or campfires are not permitted at any time in the specified park/area.",
    scope: "Both",
  },
  {
    category: "People",
    group_label: "Public behaviour",
    event_type: "Noise",
    description:
      "Alerts about potential noise (e.g., trains, industrial operations, helicopters) that may disturb visitors and posted quiet hours.",
    scope: "Both",
  },
  {
    category: "People",
    group_label: "Activities",
    event_type: "Off-road vehicles",
    description:
      "Rules on ORV registration, permitted routes, and enforcement of off‑road restrictions.",
    scope: "Both",
  },
  {
    category: "Ecological",
    group_label: "Human health",
    event_type: "Pandemic",
    description:
      "COVID‑19 related closures/partial closures, local access restrictions, and public‑health protocols.",
    scope: "Both",
  },
  {
    category: "Access and facilities",
    group_label: "Access",
    event_type: "Park access",
    description:
      "Access conditions to a park (e.g., road deactivation, 4x4 only, seasonal limitations, ferry schedules).",
    scope: "Both",
  },
  {
    category: "Access and facilities",
    group_label: "Area closures",
    event_type: "Park closure",
    description:
      "Full park closure under regulation for safety, wildfire, flood, cultural, or community reasons.",
    scope: "Both",
  },
  {
    category: "Access and facilities",
    group_label: "Construction/maintenance",
    event_type: "Park maintenance",
    description:
      "Park‑wide maintenance activities that may reduce services or cause short closures.",
    scope: "Both",
  },
  {
    category: "People",
    group_label: "Park management",
    event_type: "Park management",
    description:
      "Governance/management updates (e.g., co‑management with First Nations, title areas, policies).",
    scope: "BCP",
  },
  {
    category: "People",
    group_label: "Park management",
    event_type: "Park name",
    description:
      "Announcement of an official renaming to reflect Indigenous names or correct nomenclature.",
    scope: "Both",
  },
  {
    category: "People",
    group_label: "Park management",
    event_type: "Park policy",
    description:
      "Policy reminders (e.g., alcohol/smoking rules, commercial use requirements) applicable in the park.",
    scope: "Both",
  },
  {
    category: "Access and facilities",
    group_label: "Access",
    event_type: "Parking",
    description:
      "Parking rules, capacity/overflow information, and towing enforcement for illegal parking.",
    scope: "Both",
  },
  {
    category: "Access and facilities",
    group_label: "Access",
    event_type: "Parking lot access",
    description:
      "Status or restrictions for specific parking lots/access roads (e.g., closures, seasonal limits).",
    scope: "Both",
  },
  {
    category: "People",
    group_label: "Public behaviour",
    event_type: "Pets",
    description:
      "Pet policies and seasonal restrictions (e.g., leash rules, beach closures, wildlife protection).",
    scope: "Both",
  },
  {
    category: "Ecological",
    group_label: "Environment and wildlife",
    event_type: "Prescribed burn",
    description:
      "Planned burning for ecosystem restoration or fuel reduction, often with smoke advisories.",
    scope: "Both",
  },
  {
    category: "Access and facilities",
    group_label: "Area closures",
    event_type: "Private land / off-limits",
    description:
      "Reminder that certain routes/areas cross private land and are not open to public access.",
    scope: "Both",
  },
  {
    category: "People",
    group_label: "Community",
    event_type: "Public consultation",
    description:
      "Invitations to provide input on plans/strategies or share comments to improve management.",
    scope: "Both",
  },
  {
    category: "People",
    group_label: "Park management",
    event_type: "Regulations",
    description:
      "Special regulations in specific areas or seasons (e.g., guided‑only access, closures).",
    scope: "Both",
  },
  {
    category: "People",
    group_label: "Park management",
    event_type: "Reservations",
    description:
      "Information about reservation systems, booking windows, and newly reservable facilities.",
    scope: "Both",
  },
  {
    category: "Access and facilities",
    group_label: "Access",
    event_type: "Road closure",
    description:
      "Road or bridge closures affecting resource access due to construction, washouts, landslides, or safety.",
    scope: "Both",
  },
  {
    category: "Access and facilities",
    group_label: "Access",
    event_type: "Road conditions",
    description:
      "Current conditions on park/forest service roads (e.g., deactivated, 4x4 only, rough).",
    scope: "Both",
  },
  {
    category: "Access and facilities",
    group_label: "Construction/maintenance",
    event_type: "Road construction",
    description:
      "Road building or upgrades with traffic control, delays, and temporary restrictions.",
    scope: "Both",
  },
  {
    category: "Access and facilities",
    group_label: "Access",
    event_type: "Road hazards",
    description:
      "Specific road hazards (washouts, narrow grades, rockfall) requiring extra caution.",
    scope: "Both",
  },
  {
    category: "Ecological",
    group_label: "Hazards",
    event_type: "Road hazards",
    description:
      "Specific road hazards (washouts, narrow grades, rockfall) requiring extra caution.",
    scope: "Both",
  },
  {
    category: "Access and facilities",
    group_label: "Access",
    event_type: "Road inaccessible",
    description:
      "A segment is impassable or deactivated with no vehicle access.",
    scope: "Both",
  },
  {
    category: "Ecological",
    group_label: "Natural disasters and emergencies",
    event_type: "Rockfall hazard",
    description:
      "Rockfall risk leading to closures or travel restrictions in affected zones.",
    scope: "Both",
  },
  {
    category: "Access and facilities",
    group_label: "Area closures",
    event_type: "Scheduled closure",
    description:
      "Announced, time‑bounded closures for operations or partner‑led restrictions.",
    scope: "Both",
  },
  {
    category: "Ecological",
    group_label: "Hazards",
    event_type: "Shellfish",
    description:
      "Public‑health advisory to check federal shellfish‑harvest closures before collecting/consuming.",
    scope: "Both",
  },
  {
    category: "Ecological",
    group_label: "Human health",
    event_type: "Shellfish",
    description:
      "Public‑health advisory to check federal shellfish‑harvest closures before collecting/consuming.",
    scope: "Both",
  },
  {
    category: "People",
    group_label: "Activities",
    event_type: "Snowmobiles",
    description:
      "Where/when snowmobiling is permitted and the associated safety/avalanche requirements.",
    scope: "Both",
  },
  {
    category: "Ecological",
    group_label: "Weather and seasonal",
    event_type: "Spring conditions",
    description:
      "Variable spring trail/snow conditions that require preparation and caution.",
    scope: "Both",
  },
  {
    category: "Ecological",
    group_label: "Weather and seasonal",
    event_type: "Storm damage",
    description:
      "Storm‑related blowdown/washouts that affect trails, access, or facilities.",
    scope: "Both",
  },
  {
    category: "People",
    group_label: "Public behaviour",
    event_type: "Thieves",
    description:
      "Crime‑prevention reminders to secure vehicles/belongings and report incidents.",
    scope: "Both",
  },
  {
    category: "Access and facilities",
    group_label: "Area closures",
    event_type: "Trail closure",
    description:
      "Full or partial trail closures for hazards, construction, wildlife, or protection needs.",
    scope: "Both",
  },
  {
    category: "Ecological",
    group_label: "Hazards",
    event_type: "Trail conditions",
    description:
      "Current trail conditions and seasonal hazards affecting safe travel.",
    scope: "Both",
  },
  {
    category: "Access and facilities",
    group_label: "Construction/maintenance",
    event_type: "Trail construction",
    description:
      "New builds or rehabilitation projects with detours and short‑term closures.",
    scope: "Both",
  },
  {
    category: "Access and facilities",
    group_label: "Construction/maintenance",
    event_type: "Trail maintenance",
    description:
      "Routine maintenance activities that may temporarily limit access.",
    scope: "Both",
  },
  {
    category: "People",
    group_label: "Community",
    event_type: "Volunteer",
    description: "Opportunities for volunteer hosts/stewards and how to apply.",
    scope: "Both",
  },
  {
    category: "Ecological",
    group_label: "Human health",
    event_type: "Water quality",
    description:
      "Public‑health notices for cyanobacteria/blue‑green algae and other water‑quality issues.",
    scope: "Both",
  },
  {
    category: "Ecological",
    group_label: "Weather and seasonal",
    event_type: "Weather",
    description:
      "Seasonal and weather‑driven condition updates and where to check forecasts.",
    scope: "Both",
  },
  {
    category: "Ecological",
    group_label: "Wildfire",
    event_type: "Wildfire",
    description:
      "Active wildfire information (including evacuation alerts/orders) and related closures.",
    scope: "Both",
  },
  {
    category: "Ecological",
    group_label: "Wildfire",
    event_type: "Wildfire damage",
    description:
      "Hazards and closures due to areas burned by wildfire (e.g., danger trees, unstable slopes).",
    scope: "Both",
  },
  {
    category: "Ecological",
    group_label: "Wildfire",
    event_type: "Wildfire fuel management",
    description:
      "Fuel‑reduction treatments/prescribed activities to lower fire risk in and around parks.",
    scope: "Both",
  },
  {
    category: "Ecological",
    group_label: "Wildfire",
    event_type: "Wildfire nearby",
    description:
      "Nearby wildfires producing smoke/evacuation advisories that may impact park use.",
    scope: "Both",
  },
  {
    category: "Ecological",
    group_label: "Wildfire",
    event_type: "Wildfire risk",
    description:
      "Proactive restrictions and public‑safety notices during high fire danger (e.g., fire bans).",
    scope: "Both",
  },
  {
    category: "Ecological",
    group_label: "Wildfire",
    event_type: "Wildfire tree assessment",
    description:
      "Danger‑tree or post‑fire tree assessments and the associated public hazards.",
    scope: "Both",
  },
  {
    category: "Ecological",
    group_label: "Environment and wildlife",
    event_type: "Wildlife",
    description:
      "Wildlife‑safety advisories and attractant management (e.g., bears, wolves, cougars, seals).",
    scope: "Both",
  },
  {
    category: "Ecological",
    group_label: "Environment and wildlife",
    event_type: "Wildlife protection",
    description:
      "Measures to protect specific species/habitats with visitor rules (e.g., closures, leash areas).",
    scope: "Both",
  },
  {
    category: "Ecological",
    group_label: "Weather and seasonal",
    event_type: "Windstorm damage",
    description: "Access closures and hazards following severe wind events.",
    scope: "Both",
  },
  {
    category: "Ecological",
    group_label: "Weather and seasonal",
    event_type: "Winter conditions",
    description:
      "Winter access and snow/ice hazards, including chain requirements and avalanche cautions.",
    scope: "Both",
  },
  {
    category: "Public safety",
    group_label: "Public safety",
    event_type: "Public safety",
    description:
      "Safety bulletins about hazards (e.g., UXO, mine traffic, theft) and required precautions.",
    scope: "Both",
  },
];

const newItems = [
  {
    category: "Ecological",
    group_label: "Hazards",
    event_type: "Blowdown",
    description: "Trees down or overhead danger or wind event",
    scope: "RST",
  },
  {
    category: "Ecological",
    group_label: "Natural disasters and emergencies",
    event_type: "Catastrophic event",
    description: "Entire site has been destroyed or greater portion unsafe",
    scope: "Both",
  },
  {
    category: "Ecological",
    group_label: "Wildfire",
    event_type: "Closure area restriction",
    description:
      "Restriction due to emergency services restricting tourist travel",
    scope: "RST",
  },
  {
    category: "Ecological",
    group_label: "Hazards",
    event_type: "Damaged unsafe infrastructure",
    description: "Damaged unsafe infrastructure",
    scope: "Both",
  },
  {
    category: "Ecological",
    group_label: "Environment and wildlife",
    event_type: "Environmental related",
    description:
      "Due to larger ecological perspective, by other agencies or RSTBC",
    scope: "RST",
  },
  {
    category: "Ecological",
    group_label: "Wildfire",
    event_type: "Fire rehabilitation",
    description: "Fire Rehabilitation",
    scope: "Both",
  },
  {
    category: "Ecological",
    group_label: "Wildfire",
    event_type: "Fire suppression activity",
    description: "Fire Suppression Activity",
    scope: "Both",
  },
  {
    category: "Ecological",
    group_label: "Environment and wildlife",
    event_type: "Forest health",
    description: "Insect or other infestation",
    scope: "Both",
  },
  {
    category: "Ecological",
    group_label: "Human health",
    event_type: "Human health",
    description: "Any issue specific to human health",
    scope: "Both",
  },
  {
    category: "Access and facilities",
    group_label: "Construction/maintenance",
    event_type: "Industrial activity",
    description:
      "Industrial activities causing dangerous conditions for public access",
    scope: "Both",
  },
  {
    category: "People",
    group_label: "Public behaviour",
    event_type: "Investigation",
    description: "Closed due to legal C&E or Police investigations",
    scope: "RST",
  },
  {
    category: "Access and facilities",
    group_label: "Construction/maintenance",
    event_type: "Maintenance",
    description: "Repair or enhancement to site or trail",
    scope: "RST",
  },
  {
    category: "Access and facilities",
    group_label: "Access",
    event_type: "Park re-opening",
    description:
      "Notice that a park/area has reopened for day‑use or camping after a closure.",
    scope: "Both",
  },
  {
    category: "Access and facilities",
    group_label: "Access",
    event_type: "Road washout",
    description: "Road Washout",
    scope: "Both",
  },
  {
    category: "Ecological",
    group_label: "Weather and seasonal",
    event_type: "Seasonal",
    description: "Operating season ended",
    scope: "Both",
  },
  {
    category: "Access and facilities",
    group_label: "Access",
    event_type: "Trail access",
    description: "Trail is impacted",
    scope: "Both",
  },
  {
    category: "Ecological",
    group_label: "Natural disasters and emergencies",
    event_type: "Tsunami",
    description:
      "A tsunami hazard requiring evacuation, restricted access, or heightened safety measures.",
    scope: "Both",
  },
  {
    category: "Ecological",
    group_label: "Wildfire",
    event_type: "Wildfire closure year",
    description: "For planning purposes and forest recovery",
    scope: "RST",
  },
  {
    category: "Ecological",
    group_label: "Natural disasters and emergencies",
    event_type: "Freshet",
    description:
      "Seasonal high‑water conditions (spring runoff) requiring caution and occasionally limiting access.",
    scope: "Both",
  },
  {
    category: "Ecological",
    group_label: "Hazards",
    event_type: "Road hazards",
    description:
      "Specific road hazards (washouts, narrow grades, rockfall) requiring extra caution.",
    scope: "Both",
  },
  {
    category: "Ecological",
    group_label: "Human health",
    event_type: "Shellfish",
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

  if (!(await knex.schema.hasColumn("event_types", "group_label"))) {
    await knex.schema.table("event_types", (table) => {
      table.string("group_label");
    });
  }

  const makeKey = (event_type, group_label) =>
    `${event_type}::${group_label ?? ""}`;

  const existingEventTypes = await knex("event_types")
    .whereIn(
      "event_type",
      newItems.map((item) => item.event_type),
    )
    .select("event_type", "group_label");

  const existingEventTypeSet = new Set(
    existingEventTypes.map((item) =>
      makeKey(item.event_type, item.group_label),
    ),
  );

  const itemsToInsert = newItems.filter(
    (item) =>
      !existingEventTypeSet.has(makeKey(item.event_type, item.group_label)),
  );

  if (itemsToInsert.length > 0) {
    const eventTypeDocuments = strapi.documents("api::event-type.event-type");

    for (const row of itemsToInsert) {
      await eventTypeDocuments.create({
        data: {
          groupLabel: row.group_label,
          description: row.description,
          scope: row.scope,
          eventType: row.event_type,
        },
      });
    }
  }

  // update existing items
  for (const item of existingItems) {
    const targetRow = await knex("event_types")
      .where({ event_type: item.event_type })
      .orderBy("id", "asc")
      .first("id");

    if (!targetRow) {
      continue;
    }

    await knex("event_types").where({ id: targetRow.id }).update({
      group_label: item.group_label,
      description: item.description,
      scope: item.scope,
      updated_at: knex.fn.now(),
      published_at: knex.fn.now(),
    });
  }
};
