"use strict";

const messages = [
  {
    scope: "RST",
    title: "Avalanche - Closure",
    precedence: 18,
    eventType: "Avalanche hazard",
    description:
      'In the interest of public safety, Recreation Sites and Trails BC has closed this site or trail until further notice due to avalanche hazards.<br><br>\nGet up-to-date information from other official sources, such as <a href="https://avalanche.ca/map">Avalanche Canada</a>, the <a href="https://www.ubcm.ca/about-ubcm/member-directory">local regional district</a>, and <a href="https://www.drivebc.ca/">DriveBC</a>.<br><br>\nYou can search for other recreation sites and trails that remain open through the <a href="https://www.sitesandtrailsbc.ca/search">find a site or trail</a> page.',
  },
  {
    scope: "RST",
    title: "Construction / Rehabilitation - Closure",
    precedence: 19,
    eventType: "Construction",
    description:
      'In the interest of public safety, Recreation Sites and Trails BC has closed this site or trail until further notice to allow construction and rehabilitation work to proceed safely.<br><br>\n\nYou can search for other recreation sites and trails that remain open through the <a href="https://www.sitesandtrailsbc.ca/search">find a site or trail</a> page.',
  },
  {
    scope: "RST",
    title: "Danger Trees - Closure",
    precedence: 20,
    eventType: "Hazard trees",
    description:
      'In the interest of public safety, Recreation Sites and Trails BC advises to avoid this site or trail due to the presence of hazardous trees. Unstable or damaged trees may pose potential risks to the public.<br><br>\nYou can search for other recreation sites and trails that remain open through the <a href="https://www.sitesandtrailsbc.ca/search">find a site or trail</a> page.',
  },
  {
    scope: "RST",
    title: "Flood - Closure",
    precedence: 21,
    eventType: "Flood",
    description:
      'In the interest of public safety, Recreation Sites and Trails BC has closed this site or trail until further notice due to flooding.<br><br>\nGet up-to-date information from other official sources, such as the <a href="https://bcrfc.env.gov.bc.ca/warnings/index.htm">BC River Forecast Centre</a>, the <a href="https://www.ubcm.ca/about-ubcm/member-directory">local regional district</a>, and <a href="https://www.drivebc.ca/">DriveBC</a>.<br><br>\nYou can search for other recreation sites and trails that remain open through the <a href="https://www.sitesandtrailsbc.ca/search">find a site or trail</a> page.',
  },
  {
    scope: "RST",
    title: "General Public Safety - Closure",
    precedence: 22,
    eventType: "Public safety",
    description:
      'In the interest of public safety, Recreation Sites and Trails BC has closed this site or trail until further notice.<br><br>\nConditions in the area may pose a risk to public safety. Get up-to-date information from other official sources, such as the <a href="https://www.ubcm.ca/about-ubcm/member-directory">local regional district</a> and <a href="https://www.drivebc.ca/">DriveBC</a>.<br><br>\nYou can search for other recreation sites and trails that remain open through the <a href="https://www.sitesandtrailsbc.ca/search">find a site or trail</a> page.',
  },
  {
    scope: "RST",
    title: "Landslide - Closure",
    precedence: 23,
    eventType: "Landslide",
    description:
      'In the interest of public safety, Recreation Sites and Trails BC has closed this site or trail until further notice due to landslide hazards.<br><br>\n\nGet up-to-date information from other official sources, such as the <a href="https://www.ubcm.ca/about-ubcm/member-directory">local regional district</a> and <a href="https://www.drivebc.ca/">DriveBC</a>.<br><br>\n\nYou can search for other recreation sites and trails that remain open through the <a href="https://www.sitesandtrailsbc.ca/search">find a site or trail</a> page.',
  },
  {
    scope: "RST",
    title: "Public Safety Assessment - Closure",
    precedence: 24,
    eventType: "Public safety",
    description:
      'In the interest of public safety, Recreation Sites and Trails BC has closed this site or trail while a public safety assessment is underway.<br><br>\nAn assessment is being conducted to better understand potential risks to the public. Get up-to-date information from other official sources, such as the <a href="https://www.ubcm.ca/about-ubcm/member-directory">local regional district</a> and <a href="https://www.drivebc.ca/">DriveBC</a>.<br><br>\nYou can search for other recreation sites and trails that remain open through the <a href="https://www.sitesandtrailsbc.ca/search">find a site or trail</a> page.',
  },
  {
    scope: "RST",
    title: "Road Damage - Warning",
    precedence: 25,
    eventType: "Road conditions",
    description:
      'In the interest of public safety, Recreation Sites and Trails BC advises that access to this site or trail is currently impacted due to road damage.<br><br>\nLearn more about Ministry of Forests’ <a href="https://www2.gov.bc.ca/gov/content/industry/natural-resource-use/resource-roads/local-road-safety-information">resource road safety</a>  or get up-to-date information from other official sources, such as the <a href="https://www.ubcm.ca/about-ubcm/member-directory">local regional district</a> and <a href="https://www.drivebc.ca/">DriveBC</a>.<br><br>\nYou can search for other recreation sites and trails that remain open through the <a href="https://www.sitesandtrailsbc.ca/search">find a site or trail</a> page.',
  },
  {
    scope: "RST",
    title: "Road Washout - Closure",
    precedence: 26,
    eventType: "Road closure",
    description:
      'In the interest of public safety, Recreation Sites and Trails BC has closed this site or trail until further notice due to a road washout.<br><br>\nLearn more about Ministry of Forests’ <a href="https://www2.gov.bc.ca/gov/content/industry/natural-resource-use/resource-roads/local-road-safety-information">resource road safety</a> or get up-to-date information from <a href="https://www.drivebc.ca/">DriveBC</a>.<br><br>\nYou can search for other recreation sites and trails that remain open through the <a href="https://www.sitesandtrailsbc.ca/search">find a site or trail</a> page.',
  },
  {
    scope: "RST",
    title: "Seasonal - Closure",
    precedence: 27,
    eventType: "Gate closure",
    description:
      'Recreation Sites and Trails BC has closed this site or trail for the season.<br><br>\nYou can search for other recreation sites and trails that remain open through the <a href="https://www.sitesandtrailsbc.ca/search">find a site or trail</a> page.',
  },
  {
    scope: "RST",
    title: "Seasonal Not Maintained - Warning",
    precedence: 28,
    eventType: "Winter conditions",
    description:
      'This site or trail remains open but is not maintained for the season.<br><br>\nVisitors should expect reduced services, including limited outhouse servicing and general site maintenance. Please use caution and be prepared, as conditions may change without notice.<br><br>\nYou can search for other recreation sites and trails that remain open through the <a href="https://www.sitesandtrailsbc.ca/search">find a site or trail</a> page.',
  },
  {
    scope: "RST",
    title: "Wildfire - Closure",
    precedence: 29,
    eventType: "Wildfire nearby",
    description:
      'In the interest of public safety, Recreation Sites and Trails BC has closed this site or trail until further notice due to wildfire activity in the area.<br><br>\n\nGet up-to-date information from other official sources, such as the <a href="https://www2.gov.bc.ca/gov/content/safety/wildfire-status">BC Wildfire Service</a> through the <a href="https://wildfiresituation.nrs.gov.bc.ca/mapBC">Wildfires Map</a>, the <a href="https://www.ubcm.ca/about-ubcm/member-directory">local regional district</a>, and <a href="https://www.drivebc.ca/">DriveBC</a>.<br><br>\nYou can search for other recreation sites and trails that remain open through the <a href="https://www.sitesandtrailsbc.ca/search">find a site or trail</a> page.',
  },
  {
    scope: "RST",
    title: "Wildlife - Closure",
    precedence: 30,
    eventType: "Wildlife",
    description:
      'In the interest of public safety, Recreation Sites and Trails BC has closed this site or trail until further notice due to a <a href="https://www2.gov.bc.ca/gov/content/environment/plants-animals-ecosystems/wildlife/human-wildlife-conflict">human-wildlife conflict</a>.<br><br>\n\nGet up-to-date information from other official sources, such as the <a href="https://www2.gov.bc.ca/gov/content/environment/natural-resource-stewardship/natural-resource-law-enforcement/conservation-officer-service">BC Conservation Officer Service</a>.<br><br>\n\nYou can search for other recreation sites and trails that remain open through the <a href="https://www.sitesandtrailsbc.ca/search">find a site or trail</a> page.',
  },
];

module.exports = {
  async up(knex) {
    if (await knex.schema.hasTable("standard_messages")) {
      // create a map of event type names (eventType field) to documentIds
      const eventTypes = await knex("event_types").select(
        "document_id",
        "event_type",
      );
      const eventTypeMap = {};
      eventTypes.forEach((et) => {
        eventTypeMap[et.event_type] = et.document_id;
      });

      for (const message of messages) {
        const { scope, title, precedence, eventType, description } = message;
        const eventTypeDocId = eventTypeMap[eventType];
        if (!eventTypeDocId) {
          strapi.log.warn(
            `Event type "${eventType}" not found for message "${title}". Skipping...`,
          );
          continue;
        }

        // use the Strapi document service to create the standard message
        await strapi
          .documents("api::standard-message.standard-message")
          .create({
            data: {
              scope,
              title,
              precedence,
              description,
              eventType: eventTypeDocId,
            },
          });
      }
    }
  },
};
