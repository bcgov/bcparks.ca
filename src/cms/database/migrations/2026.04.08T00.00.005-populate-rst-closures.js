"use strict";

// THIS IS TEST DATA FOR V2.5.0 and this migration can be removed for future releases

const closures = [
  {
    rec_resource_id: "REC0002",
    headline: "Closed due to flooding",
    closure_description: null,
  },
  {
    rec_resource_id: "REC0011",
    closure_description:
      'Seasonal Closure, additional information and updates, please visit <a href="https://firesidecamping.ca/" target="_blank">https://firesidecamping.ca//</a>',
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC0013",
    closure_description:
      'Seasonal Closure, additional information and updates, please visit <a href="https://thurston.campchilliwackvalley.ca/" target="_blank">https://thurston.campchilliwackvalley.ca///</a>',
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC0024",
    closure_description:
      'Seasonal Closure, additional information and updates, please visit <a href="https://firesidecamping.ca/" target="_blank">https://firesidecamping.ca//</a>',
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC0039",
    closure_description:
      "The Recreation Site/Trail is closed due impact from 2023 wildfire - rehab needed.",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC0047",
    closure_description:
      "The Recreation Site/Trail is closed due to damage from 2023 wildfire - rehab needed.",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC0048",
    closure_description:
      "The Recreation Site/Trail is closed due to impact from 2023 wildfire - rehab needed.",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC0064",
    closure_description:
      "The Recreation Site/Trail is closed due to extensive damage from 2023 wildfire - No access.",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC0065",
    closure_description:
      'Seasonal Closure.\r\n\r\nvisit <a href="http://www.westharrisonreservations.com" target="_blank">www.westharrisonreservations.com</a> for more information.',
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC0066",
    headline: "Seasonal Closure opening date to be determined Spring 2026",
    closure_description: null,
  },
  {
    rec_resource_id: "REC0067",
    closure_description:
      'Seasonal Closure.\r\n\r\nvisit <a href="http://www.westharrisonreservations.com" target="_blank">www.westharrisonreservations.com</a> for more information.',
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC0071",
    closure_description:
      "The Recreation Site/Trail is closed due to impact from 2023 wildfire - rehab needed.",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC0073",
    closure_description:
      'Seasonal Closure.\r\n\r\nvisit <a href="http://www.westharrisonreservations.com" target="_blank">www.westharrisonreservations.com</a> for more information.',
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC0074",
    closure_description:
      "CLOSED UNTIL FURTHER NOTICE DUE TO\r\n\r\n<BR>INCREASED RISK RESULTING FROM WILDFIRE\r\n\r\n<BR>HIGH RISK OF SLIDE, SLOPE FAILURE & DANGER TREES \r\n\r\n<BR>ABOVE AND ALONGSIDE RECREATION SITE.\r\n\r\nWATER ACCESS ONLY AS TRAIL FROM ROAD CURRENTLY BLOCKED.",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC0075",
    closure_description:
      "CLOSED UNTIL FURTHER NOTICE DUE TO\r\n\r\n<BR>INCREASED RISK RESULTING FROM WILDFIRE.\r\n\r\nRISK OF TREE FAILURE AND INCREASED RISK OF SLIDES.",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC0078",
    closure_description:
      'Seasonal Closure.\r\n\r\nvisit <a href="http://www.westharrisonreservations.com" target="_blank">www.westharrisonreservations.com</a> for more information.',
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC0087",
    headline: "Seasonal Closure opening date to be determined Spring 2026",
    closure_description: null,
  },
  {
    rec_resource_id: "REC0094",
    closure_description:
      "Salsbury Lake Recreation Site is not market ready yet. It is not maintained and there are no structures (outhouses, fire rings). Road is not accessible to site as someone has felled over 20 trees to block access to the road. C&E have been asked to investigate. No time frame on how quickly trees can be cleared and the site re-opened.  There is concern as to why someone is trying to block access to this area.",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC0123",
    closure_description:
      "This site is CLOSED FOR THE SEASON and not being serviced or maintained for public use. Gates are locked. This site is expected to reopen for the 2026 season between May 15 and September 30, 2026",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC0125",
    closure_description:
      "Closed due to recent damage from the atmospheric river.  The access road has been compromised and is not in adequate condition for use.  Repairs will take place as soon as the weather has stabilized.",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC0134",
    closure_description:
      "This site is CLOSED FOR THE SEASON and not being serviced or maintained for public use. Gates are locked.",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC0140",
    closure_description:
      "This site is CLOSED FOR THE SEASON and not being serviced or maintained for public use. The site is expected to reopen for the 2026 season between May 15 and September 8, 2026.",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC0144",
    closure_description:
      "Elk Creek is now closed and gated for the season.  The site will open in May 2026.",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC0151",
    closure_description:
      "This site is closed for safety reasons, effective immediately, until further notice.\r\n15 May, 2025",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC0159",
    closure_description:
      "Campbell Lake Recreation Site is now closed and gated for the season.  The site will open again May 2026.  Shoulder season group rentals are now available.",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC0168",
    headline: "Permanently closed",
    closure_description: null,
  },
  {
    rec_resource_id: "REC0173",
    closure_description:
      "Brewster Lake Recreation Site is now closed and gated for the season.  The site will open again with a host May 2026.  Shoulder season group rentals are now available.",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC0178",
    closure_description:
      "This site remains closed due to unsafe conditions.\r\nUpdate 15 May, 2025",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC0186",
    closure_description:
      "The Stella Bay Rec Site is closed until further notice.  The outhouse on site is condemned and there is no washroom facility available.  Please refrain from using this site until repairs can be made.",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC0188",
    closure_description:
      "Miller Creek Recreation Site is now closed and gated for the season.  The site will open again May 2026. Shoulder season group rentals are now available.",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC0189",
    closure_description:
      "This site is closed for safety reasons, effective immediately, until further notice.\r\n15 May, 2025",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC0195",
    closure_description:
      "Orchard Meadow Recreation Site is now closed and gated for the season.  The site will open again May 2026. Shoulder season group rentals are now available.",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC0205",
    closure_description:
      "This site is CLOSED FOR THE SEASON and not being serviced or maintained for public use. Gates are locked.This site is expected to reopen for the 2026 season between May 1 and October 1, 2026",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC0206",
    closure_description:
      "This site is CLOSED FOR THE SEASON and not being serviced or maintained for public use. Gates are locked. This site is expected to reopen for the 2026 season between May 1 and October 1, 2026",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC0211",
    closure_description:
      "This site is CLOSED FOR THE SEASON and not being serviced or maintained for public use. Gates are locked. This site is expected to reopen for the 2026 season between May 1 and September 30, 2026.",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC0230",
    closure_description:
      "This site is closed due to natural hazards that cannot be mitigated.",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC0236",
    closure_description:
      "SITE CLOSED: Nqw'elqw'elusten (Meager Creek) Hot Springs are within Lil&#787;wat Nation territory. This is a place of cultural and spiritual significance for Lil&#787;wat Nation. The site closure supports the protection of important cultural, environmental, and wildlife values. The Meager Creek Drainage is prone to extremely large landslides, avalanches, and flooding/washouts. The Province will be enforcing this closure and will issue violation tickets to anyone caught ignoring the restrictions.",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC0242",
    closure_description:
      "Marble River Recreation Site is now closed and gated for the season.  The site will open May 2026.",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC0254",
    closure_description:
      "The Recreation Site/Trail is closed due to extensive wildfire damage - No Access",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC0265",
    headline: "This site has been closed due to flooding.",
    closure_description: null,
  },
  {
    rec_resource_id: "REC0266",
    closure_description:
      "Public Notice: Recreation Site Closure ﾖ Hideaway Squamish <BR>\r\n\r\nEffective September 5, 2025, at 16:00, access to the Squamish Hideaway Recreation Site via the Squamish River Forest Service Road at Mud Creek (21 km) will be closed.<BR>\r\n\r\nA temporary culvert was previously installed to maintain access following a recent washout. This structure is now being removed due to safety concerns. The crossing has been assessed as unstable and unsafe for travel.<BR>\r\n\r\nThe closure is expected to remain in effect through the winter season, as weather-related risks and limited access prevent repair work. Conditions will be reassessed in early spring 2026, or sooner if circumstances permit.<BR>\r\n\r\nAccess Restrictions: No vehicle traffic will be permitted beyond the closure point.",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC0268",
    closure_description:
      "This site is CLOSED FOR THE SEASON and not being serviced or maintained for public use. Gates are locked.This site is expected to reopen for the 2026 season between May 1 and October 1, 2026",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC0269",
    closure_description:
      "This site is CLOSED FOR THE SEASON and not being serviced or maintained for public use. Gates are locked.This site is expected to reopen for the 2026 season between May 1 and October 1, 2026",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC0270",
    closure_description:
      "SITE CLOSED - San Juan Campsite has been decommissioned and is closed.",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC0271",
    headline: "SITE CLOSED",
    closure_description: null,
  },
  {
    rec_resource_id: "REC0273",
    closure_description:
      "This site is permanantly closed due to a catastrophic storm event.",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC0274",
    headline: "Site is Closed",
    closure_description: null,
  },
  {
    rec_resource_id: "REC0278",
    closure_description:
      "This site remains closed for safety reasons until further notice.\r\nUpdated 15 May, 2025",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC0281",
    closure_description:
      "Viner Sounds is closed until further notice due to unsafe conditions",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC0287",
    closure_description:
      "Site is closed for overnight camping to address public safety concerns and impacts to the land.",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC0299",
    headline: "Closed due to flooding",
    closure_description: null,
  },
  {
    rec_resource_id: "REC0301",
    closure_description:
      "This site is closed for safety reasons, effective immediately, until further notice.\r\n15 May, 2025",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC0428",
    closure_description:
      "This site is closed for safety reasons, effective immediately, until further notice.\r\n15 May, 2025",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC0433",
    closure_description:
      "This site is closed for safety reasons, effective immediately, until further notice.\r\n15 May, 2025",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC0443",
    closure_description:
      "This site is closed for safety reasons, effective immediately, until further notice.\r\n15 May, 2025",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC0467",
    headline: ".",
    closure_description: null,
  },
  {
    rec_resource_id: "REC0468",
    headline: "Site CLOSED due to hazardous trees.",
    closure_description: null,
  },
  {
    rec_resource_id: "REC0471",
    closure_description:
      "*****Cougar Creek Rec Site and dock are now closed and gated for the season. The site will open with a host in April 2026.",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC0475",
    closure_description:
      "As of February 23, 2026, McCall Flats is currently closed to the public due to theft and vandalism of facilities at the rec site.  It is currently not known when the site will be reopened for public use.",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC0487",
    closure_description:
      "This site is closed for safety reasons, effective immediately, until further notice.\r\n15 May, 2025",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC0496",
    closure_description:
      "This trail is closed for safety reasons, effective immediately, until further notice.\r\n15 May, 2025",
    headline: "Trail is closed",
  },
  {
    rec_resource_id: "REC0519",
    closure_description:
      "Site will be closed for a cultural burn in coordination with the BC Wildfire Service. Burn will be conducted between March 30 and May 13, possibly longer depending on weather, snow, venting conditions, etc. Please follow all posted signage. https://blog.gov.bc.ca/bcwildfire/cultural-burns-planned-near-kispiox/",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC0521",
    closure_description:
      "There is a First Nations gate/blockade at 15 km on the Suskwa FSR, just beyond the bridge. Public access restricted.",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC0532",
    headline: "First Nations gate/blockade at site, public access restricted",
    closure_description: null,
  },
  {
    rec_resource_id: "REC0536",
    closure_description:
      "Site is closed until further notice. Public access restricted due to First Nations cabins/cultural camp, beware of dogs",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC0542",
    closure_description:
      "Binta Lake Recreation Site is closed until further notice to address a significant public safety hazard due to danger tree risk. The Province is working on a solution as a priority item.\r\nPlease visit nearby recreation sites: Uncha, Binta North, and Indian Bay. If you have any questions, please call Recreation Sites and Trails BC at 250-847-6300 or visit https://www.sitesandtrailsbc.ca/search/search-result.aspx?site=REC0542&type=Site for updates.",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC0574",
    closure_description:
      "Kager Lake campground is closed for winter as of November 4, 2025. Campground entrance/exit is blocked off with concrete blocks, there is no vehicle access to campground until spring 2026. The past few years have seen abandoned vehicles left in the campground, vehicles left in the campsite for more than 14 days will be towed and impounded (BKV Towing 250-692-3413). The parking lot, trails, picnic shelter and other infrastructure remain open, unless otherwise posted on site.",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC0587",
    closure_description:
      "Closed temporarily for danger trees. Site will be updated when it is open.",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC0599",
    closure_description:
      "July 24th update, the trail is open! \r\n\r\nUpgrades are done for the 2025 season. \r\nThe lower section of road to approx. 1.5 km is open. Beyond 1.5km the road remains closed and is barricaded with concrete blocks for the remainder of the season to let it set up for long-term use. \r\nAt 1.5 km just before the concrete blocks is parking for 5-6 vehicles plus a few pull outs along the way for one or two vehicles at a time. \r\nThe road has been upgraded to include riprap placed to stabilize the creek bank (washed out in 2022, removing a large section of the road subgrade), culvert install, ditching, re-surfacing, and parking areas widened. \r\nThe lower section of the road is estimated to accommodate 2WD vehicles with good tires. \r\nAny questions, please contact Recreation Site and Trails BC at 250-847-6300.",
    headline: "Trail is closed",
  },
  {
    rec_resource_id: "REC0926",
    closure_description:
      "Seasonal closure November 1 - TBD. Due to avalanche risk at Twin Falls Recreation Site: campground, parking lot and viewing platform are closed during avalanche season (Nov 1 - spring). Travel on trails is not recommended. Use at your own risk. The site is being monitored by avalanche professionals and will open when it is deemed safe.",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC1031",
    closure_description:
      "The Recreation Site/Trail is under Evacuation Alert. In the event of changing\r\nwildfire conditions, visitors at this site may receive limited notice to evacuate. Find\r\nfurther information at www.bcwildfire.ca",
    headline: "Recreation reserve is closed",
  },
  {
    rec_resource_id: "REC1032",
    closure_description:
      "The site is closed due to deactivation of the Teardrop FSR from 59km to 70 km.",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC106440",
    closure_description:
      "Frisby Ridge Mountain Bike Trail is closed annually until July 15 to protect grizzly and caribou habitat.",
    headline: "Trail is closed",
  },
  {
    rec_resource_id: "REC106882",
    headline: "Closed due to fire",
    closure_description: null,
  },
  {
    rec_resource_id: "REC106896",
    closure_description:
      "This site is closed for safety reasons, effective immediately, until further notice.\r\n15 May, 2025",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC107021",
    closure_description:
      "This site is closed for safety reasons, effective immediately, until further notice.\r\n15 May, 2025",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC1110",
    closure_description:
      "Site Open May 01-Sept 15th. \r\n\r\nReservations - you can call on or after May 01 through Sept 15th to book for the 8 sites available for reservation.  Please contact Site Operator Gary Peters directly to discuss booking of sites 1-250-944-0701. Minimum weekend reservation booking 2 nights, except for long weekends which are minimum 3 nights.",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC1123",
    closure_description:
      "All facilities have been removed.  Site is not currently being maintained for recreational purposes.  Site has been significantly impacted by Mountain Pine Beetle.",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC1133",
    closure_description:
      "As of May 2025, this site remains closed due to high volume of danger trees from spruce beetle attack. Please avoid using this site until the hazards have been addressed.",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC1167",
    closure_description:
      "Site closed due to road washout and presence of danger trees in site. Currently no estimated time of reopening. Alternative rec site options in the area include Stony Lake, Ahbau Lake and Naver Creek.",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC1186",
    closure_description:
      "Site currently inaccessible due to washout at 41km on Parsnip West FSR. No estimated time of reopening.",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC1188",
    closure_description:
      "Site closed due to downrating of bridge used to access site. Please avoid using this site until further notice.",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC1191",
    closure_description:
      "Site currently inaccessible due to washout at 41km on Parsnip West FSR. No estimated time of reopening.",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC1192",
    closure_description:
      "Site currently inaccessible due to washout at 41km on Parsnip West FSR. No estimated time of reopening.",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC1245",
    closure_description:
      "The Recreation Site is closed due to an active wildfire in the area. For further information visit www.bcwildfire.ca",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC1316",
    headline: "Blowdown and debris along the trail.",
    closure_description: null,
  },
  {
    rec_resource_id: "REC1335",
    closure_description:
      "The Recreation Site/Trail is closed due to danger trees and excessive blowdown.  A significant risk to public health and safety exists and this trail should not be utilized  or occupied.",
    headline: "Trail is closed",
  },
  {
    rec_resource_id: "REC135758",
    closure_description:
      "The site is closed due to an active wildfire in the area. BC Wildfire Service has put a area restriction order in place.",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC1401",
    closure_description:
      "Site currently inaccessible due to washout at 41km on Parsnip West FSR. No estimated time of reopening.",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC1411",
    closure_description:
      "Site is closed due to an active wildfire in the area and an evacuation Alert is in place.  For further information please go to the BC Wildfire website www.bcwildfire.ca",
    headline: "Recreation reserve is closed",
  },
  {
    rec_resource_id: "REC1412",
    closure_description:
      "Site is closed due to an active wildfire in the area and an evacuation Alert is in place.  For further information please go to the BC Wildfire website www.bcwildfire.ca",
    headline: "Recreation reserve is closed",
  },
  {
    rec_resource_id: "REC1459",
    headline: "Site is closed due to flooding of the Kite road at 2km and 4km.",
    closure_description: null,
  },
  {
    rec_resource_id: "REC1474",
    headline: "Trail closed",
    closure_description: null,
  },
  {
    rec_resource_id: "REC1476",
    closure_description:
      "The Recreation Site/Trail is closed due to an active wildfire in the area. The area is \r\ncurrently under Evacuation order. Find further information at www.bcwildfire.ca",
    headline: "Trail is closed",
  },
  {
    rec_resource_id: "REC1499",
    closure_description:
      "The Recreation Site/Trail is closed due to damage from the 2018 wildfire season.  Excessive blowdown and danger trees make this trail unsafe for use or travel.",
    headline: "Trail is closed",
  },
  {
    rec_resource_id: "REC1533",
    headline: "Campground closed for the season. Opening May 14th 2026",
    closure_description: null,
  },
  {
    rec_resource_id: "REC1534",
    headline: "Campground closed for the season. Opening May 8th 2026.",
    closure_description: null,
  },
  {
    rec_resource_id: "REC1537",
    headline: "BRENNAN CREEK RECREATION SITE IS CLOSED UNTIL FURTHER NOTICE",
    closure_description: null,
  },
  {
    rec_resource_id: "REC154994",
    headline: "Site closed due to flooding",
    closure_description: null,
  },
  {
    rec_resource_id: "REC154996",
    closure_description:
      "Public Notice: Recreation Site Closure - Squamish Elaho <BR><BR>\r\n\r\nEffective September 5, 2025, at 16:00, access to the Squamish Elaho Recreation Site via the Squamish River Forest Service Road at Mud Creek (21 km) will be closed.<BR><BR>\r\n\r\nA temporary culvert was previously installed to maintain access following a recent washout. This structure is now being removed due to safety concerns. The crossing has been assessed as unstable and unsafe for travel.<BR><BR>\r\n\r\nThe closure is expected to remain in effect through the winter season, as weather-related risks and limited access prevent repair work. Conditions will be reassessed in early spring 2026, or sooner if circumstances permit.<BR><BR>\r\n\r\nAccess Restrictions: No vehicle traffic will be permitted beyond the closure point.",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC1557",
    headline: "Campground closed. Opening May 7th 2026",
    closure_description: null,
  },
  {
    rec_resource_id: "REC15780",
    closure_description:
      "Footbridges have been damaged by recent flood events and are unsafe to use.  Trail is closed.",
    headline: "Trail is closed",
  },
  {
    rec_resource_id: "REC16018",
    closure_description:
      "This site is closed for safety reasons, effective immediately, until further notice.\r\n15 May, 2025",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC16024",
    closure_description:
      "This site is closed for safety reasons, effective immediately, until further notice.\r\n15 May, 2025",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC160442",
    closure_description:
      "This site is closed for safety reasons, effective immediately.  The site will not be maintained during this closure and the public are advised to use the space at their own risk.",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC160607",
    headline: "CLOSED - Due to Active Wildfire in area",
    closure_description: null,
  },
  {
    rec_resource_id: "REC160645",
    closure_description:
      "This recreation site is currently CLOSED due to a landslide blocking access on the lower Jordan FSR - east entrance.",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC16077",
    closure_description:
      "Clint Beek Recreation Site is now closed and gated for the season.  The site will open May 2026.",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC16079",
    closure_description:
      "This trail is closed for safety reasons, effective immediately, until further notice.\r\n15 May, 2025",
    headline: "Trail is closed",
  },
  {
    rec_resource_id: "REC16102",
    closure_description:
      "Grant Bay is closed until further notice until the site can be made safe and sanitary for recreational users.",
    headline: "Trail is closed",
  },
  {
    rec_resource_id: "REC16104",
    closure_description:
      "Please note that the Sunshine Coast Trail at Saltery Bay / Jervis Inlet North will be closed BY BC HYDRO to the public from March 2 to June 10, 2026 inclusive, for public safety during active construction. \r\n\r\nAn alternate route will be available at all times. Please use the Saltery Bay FSR to access Rainy Day Lake and the upper trail to Elephant Lake and Lois Lake during this time. \r\n\r\nThis work is necessary for transmission system upgrades under the Jervis Inlet and Agamemnon Power Line Replacement Project. To learn more about this project, please visit bchydro.com/jervisagamemnon.",
    headline: "Trail is closed",
  },
  {
    rec_resource_id: "REC16108",
    closure_description:
      "Winter motorized closure from November 20th thru April 10th annually.",
    headline: "Trail is closed",
  },
  {
    rec_resource_id: "REC164257",
    headline: "CLOSED - Due to Active Wildfire in area",
    closure_description: null,
  },
  {
    rec_resource_id: "REC1660",
    headline: "CLOSED - Due to active wildfire in area",
    closure_description: null,
  },
  {
    rec_resource_id: "REC166414",
    headline: "The Recreation Site is closed due to wildfire rehab needed.",
    closure_description: null,
  },
  {
    rec_resource_id: "REC166988",
    closure_description:
      "This trail is closed due to extensive damage in wet and sensitive areas. This trail is closed to all access due to large mud holes.",
    headline: "Trail is closed",
  },
  {
    rec_resource_id: "REC167598",
    closure_description:
      "The site/trail remains closed for wildfire recovery activities and to prevent negative impacts to ecosystems and wildlife.",
    headline: "Trail is closed",
  },
  {
    rec_resource_id: "REC168676",
    headline: "Site closed due to COVID-19 health and safety concerns.",
    closure_description: null,
  },
  {
    rec_resource_id: "REC169043",
    closure_description:
      'Seasonal Closure.\r\n\r\nvisit <a href="http://www.westharrisonreservations.com" target="_blank">www.westharrisonreservations.com</a> for more information.',
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC169186",
    headline: "Closed due to fire rehabilitation work in the area.",
    closure_description: null,
  },
  {
    rec_resource_id: "REC169532",
    closure_description:
      "Eagle Pass Fire Lookout CLOSED.  Unsafe conditions exist to public.",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC1725",
    headline: "CLOSED - Due to active wildfire in area",
    closure_description: null,
  },
  {
    rec_resource_id: "REC1738",
    headline: "CLOSED - Due to active wildfire in area",
    closure_description: null,
  },
  {
    rec_resource_id: "REC1744",
    closure_description:
      "<br><strong>BRIDGE OUT<br><br><Access to Kidney Lake Recreation Site has been lost due to a failing bridge and road closure.  </strong>",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC1745",
    headline: "Road access has been lost via Cooke Creek Forest Service Road",
    closure_description: null,
  },
  {
    rec_resource_id: "REC1775",
    closure_description:
      'This site remains closed for wildfire recovery activities (for example, danger tree assessing and falling, area assessments, etc) and to prevent negative impacts to ecosystems and wildlife.  <BR>Click here:<a href=https://www2.gov.bc.ca/assets/gov/sports-recreation-arts-and-culture/outdoor-recreation/motor-vehicle-prohibitions/wildfire-closures/mvpr_1_130_white_rock_lake.pdf target="_blank">White Rock Lake Wildfire</a>\r\n<BR> More Information on the motor-vehicle closure and maps can be found: by emailing regional resource management: 2021Wildlife.closures@gov.bc.ca or by calling 778 362-4683. Note that this is an answering service. Staff will return calls within two business days.',
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC1794",
    closure_description:
      'This site remains closed for wildfire recovery activities (for example, danger tree assessing and falling, area assessments, etc) and to prevent negative impacts to ecosystems and wildlife.  <BR>Click here:<a href=https://www2.gov.bc.ca/assets/gov/sports-recreation-arts-and-culture/outdoor-recreation/motor-vehicle-prohibitions/wildfire-closures/mvpr_1_120_sparks_lake.pdf target="_blank">Sparks Wildfire</a>\r\n<BR> More Information on the motor-vehicle closure and maps can be found: by emailing regional resource management: 2021Wildlife.closures@gov.bc.ca or by calling 778 362-4683. Note that this is an answering service. Staff will return calls within two business days.',
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC1796",
    closure_description:
      "The Recreation Site is closed due to an active wildfire in the area. The BC Wildfire Service has implemented an Area Restriction Order under Section 11(1) of the Wildfire Act to address a public safety concern arising from the Sparks Lake Wildfire.?",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC1829",
    closure_description:
      "The recreation site is closed due to wildfire  damage and remains closed until an assessment is completed.",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC1839",
    headline: "Site is Closed",
    closure_description: null,
  },
  {
    rec_resource_id: "REC1857",
    closure_description:
      "This site remains closed for wildfire recovery activities (for example, danger tree assessing and falling, area assessments, etc) and to prevent negative impacts to ecosystems and wildlife.",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC1858",
    closure_description:
      "The Recreation Site is closed due to an active wildfire in the area. The BC Wildfire Service has implemented an Area Restriction Order under Section 11(1) of the Wildfire Act to address a public safety concern arising from the Sparks Lake Wildfire.?",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC1859",
    closure_description:
      "This site remains closed for wildfire recovery activities (for example, danger tree assessing and falling, area assessments, etc) and to prevent negative impacts to ecosystems and wildlife.",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC1909",
    closure_description:
      "Under Section 11(1) of the Wildfire Act, this closure is in place to address a public safety concern arising from the Tremont Wildfire.",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC190937",
    closure_description:
      "The Recreation Site is closed due to an active wildfire in the area. For further information visit www.bcwildfire.ca",
    headline: "Trail is closed",
  },
  {
    rec_resource_id: "REC1923",
    closure_description:
      "The Gorge Creek Trail is currently CLOSED until further notice due to public safety concerns.  Numerous dangerous trees stand in the trail corridor, the bridge over the creek is out due to spring flood damage, also of concern is the safety risk of crossing the Trans Canada Highway to access the trail head.  Please do not cross the highway to the trail.  We endeavor to address these safety concerns and reopen the trail in the future.",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC1961",
    headline: "Site closed due to fallen trees and facility damage.",
    closure_description: null,
  },
  {
    rec_resource_id: "REC1982",
    closure_description:
      'The Skimikin Lake Recreation Trail is closed due to an active wildfire in the area. The BC Wildfire Service has implemented an Area Restriction Order under Section 11(1) of the Wildfire Act to address a public safety concern. Please see <a href="http://bcwildfire.ca/hprScripts/WildfireNews/OneFire.asp?ID=567" target="_blank"> www.bcwildfire.ca </a> for updates.',
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC198435",
    closure_description:
      "This trail network remains closed for wildfire recovery activities (for example, danger tree assessing and falling, area assessments, etc) and to prevent negative impacts to ecosystems and wildlife.",
    headline: "Trail is closed",
  },
  {
    rec_resource_id: "REC198437",
    closure_description:
      "This trail network remains closed for wildfire recovery activities (for example, danger tree assessing and falling, area assessments, etc) and to prevent negative impacts to ecosystems and wildlife.",
    headline: "Trail is closed",
  },
  {
    rec_resource_id: "REC1988",
    closure_description:
      'This site remains closed for wildfire recovery activities (for example, danger tree assessing and falling, area assessments, etc) and to prevent negative impacts to ecosystems and wildlife.  <BR>Click here:<a href=https://www2.gov.bc.ca/assets/gov/sports-recreation-arts-and-culture/outdoor-recreation/motor-vehicle-prohibitions/wildfire-closures/mvpr_1_130_white_rock_lake.pdf target="_blank">White Rock Lake Wildfire</a>\r\n<BR> More Information on the motor-vehicle closure and maps can be found: by emailing regional resource management: 2021Wildlife.closures@gov.bc.ca or by calling 778 362-4683. Note that this is an answering service. Staff will return calls within two business days.',
    headline: "Recreation reserve is closed",
  },
  {
    rec_resource_id: "REC202043",
    headline: "Closed due to COVID-19",
    closure_description: null,
  },
  {
    rec_resource_id: "REC202159",
    closure_description:
      "Avatar Grove (T'l'oqwxwat) Recreation Site is Closed for Public Safety and Environmental Protection.",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC202525",
    closure_description:
      "This trail is closed for safety reasons, effective immediately, until further notice.\r\n15 May, 2025",
    headline: "Trail is closed",
  },
  {
    rec_resource_id: "REC202717",
    closure_description:
      "PUBLIC SAFETY CLOSURE\r\nRecent wildfire activity has destabilized the cliffs above the trail and hot springs. In addition the fire has created a very large number of hazardous trees in the area. RST has determined the risk to public safety from the use of the trail is Extreme. The trail will remain closed until these hazards can be assessed and if possible mitigated.",
    headline: "Trail is closed",
  },
  {
    rec_resource_id: "REC202921",
    closure_description:
      "The Tommy Archie Lake trail is closed due to a bridge closure on the forest service road that provides access to the recreation trail. It is not known yet at this time when the bridge will be reopened. Please observe all posted road closures and signs.",
    headline: "Trail is closed",
  },
  {
    rec_resource_id: "REC202933",
    closure_description:
      "This trail is closed for safety reasons, effective immediately, until further notice.\r\n15 May, 2025",
    headline: "Trail is closed",
  },
  {
    rec_resource_id: "REC203040",
    closure_description:
      "This site is closed for safety reasons, effective immediately, until further notice.\r\n15 May, 2025",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC203883",
    closure_description:
      "This Recreation Trail is closed due to an active wildfire in the area. For further information visit www.bcwildfire.ca",
    headline: "Trail is closed",
  },
  {
    rec_resource_id: "REC204276",
    closure_description:
      "The lookout has been damaged by wildfire.  Danger tree assessments and falling has not occurred so access is not recommended for safety reasons.",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC204278",
    closure_description:
      "Site Closed.\r\nThe lookout has been damaged by wildfire. Danger tree assessments and falling has not occurred so access is not recommended for safety reasons",
    headline: "Trail is closed",
  },
  {
    rec_resource_id: "REC204461",
    closure_description:
      "This site is closed for safety reasons, effective immediately, until further notice.\r\n15 May, 2025",
    headline: "Interpretive forest is closed",
  },
  {
    rec_resource_id: "REC205064",
    closure_description:
      "The Gorge Creek Trail is currently CLOSED until further notice due to public safety concerns. <BR><BR>\r\nNumerous dangerous trees stand in the trail corridor and the bridge over the creek is out due to spring flood damage.  Also of concern is the safety risk of crossing the Trans Canada Highway to access the trail head.  We endeavor to address these safety concerns and reopen the trail in the future.",
    headline: "Trail is closed",
  },
  {
    rec_resource_id: "REC2275",
    closure_description:
      "The Macbeth Icefield trail was severely impacted by wildfire and will remain closed until danger tree assessments and falling can be completed.",
    headline: "Trail is closed",
  },
  {
    rec_resource_id: "REC230063",
    closure_description:
      'This trail network remains closed for wildfire recovery activities (for example, danger tree assessing and falling, area assessments, etc) and to prevent negative impacts to ecosystems and wildlife.  <BR>Click here:<a href=https://www2.gov.bc.ca/assets/gov/sports-recreation-arts-and-culture/outdoor-recreation/motor-vehicle-prohibitions/wildfire-closures/mvpr_1_130_white_rock_lake.pdf target="_blank">White Rock Lake Wildfire</a>\r\n<BR> More Information on the motor-vehicle closure and maps can be found: by emailing regional resource management: 2021Wildlife.closures@gov.bc.ca or by calling 778 362-4683. Note that this is an answering service. Staff will return calls within two business days.',
    headline: "Trail is closed",
  },
  {
    rec_resource_id: "REC230151",
    closure_description:
      'This site remains closed for wildfire recovery activities (for example, danger tree assessing and falling, area assessments, etc) and to prevent negative impacts to ecosystems and wildlife.  <BR>Click here:<a href=https://www2.gov.bc.ca/assets/gov/sports-recreation-arts-and-culture/outdoor-recreation/motor-vehicle-prohibitions/wildfire-closures/mvpr_1_130_white_rock_lake.pdf target="_blank">White Rock Lake Wildfire</a>\r\n<BR> More Information on the motor-vehicle closure and maps can be found: by emailing regional resource management: 2021Wildlife.closures@gov.bc.ca or by calling 778 362-4683. Note that this is an answering service. Staff will return calls within two business days.',
    headline: "Recreation reserve is closed",
  },
  {
    rec_resource_id: "REC230514",
    closure_description:
      "Access to the Watersprite Lake Provincial Recreation Site is partially open.\r\nThe road was previously impassable and remains under repair. Expect delays and temporary holds as crews continue work.",
    headline: "Trail is closed",
  },
  {
    rec_resource_id: "REC231261",
    headline: "Permanently closed",
    closure_description: null,
  },
  {
    rec_resource_id: "REC240834",
    closure_description:
      "This trail network remains closed for wildfire recovery activities (for example, danger tree assessing and falling, area assessments, etc) and to prevent negative impacts to ecosystems and wildlife.",
    headline: "Trail is closed",
  },
  {
    rec_resource_id: "REC241010",
    closure_description:
      'This site remains closed for wildfire recovery activities (for example, danger tree assessing and falling, area assessments, etc) and to prevent negative impacts to ecosystems and wildlife.  <BR>Click here:<a href=https://www2.gov.bc.ca/assets/gov/sports-recreation-arts-and-culture/outdoor-recreation/motor-vehicle-prohibitions/wildfire-closures/mvpr_1_130_white_rock_lake.pdf target="_blank">White Rock Lake Wildfire</a>\r\n<BR> More Information on the motor-vehicle closure and maps can be found: by emailing regional resource management: 2021Wildlife.closures@gov.bc.ca or by calling 778 362-4683. Note that this is an answering service. Staff will return calls within two business days.',
    headline: "Recreation reserve is closed",
  },
  {
    rec_resource_id: "REC2472",
    closure_description:
      "The Mt. Cartier Lookout trail is closed due to the instability of the McKay Creek bridge.",
    headline: "Trail is closed",
  },
  {
    rec_resource_id: "REC247276",
    headline: "Trail closed due to active wildfire",
    closure_description: null,
  },
  {
    rec_resource_id: "REC2486",
    closure_description:
      "The Rocky Point Lake Recreation Site is closed due to extremely bad road conditions.",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC257445",
    closure_description:
      'Seasonal Closure, additional information and updates, please visit <a href="https://stavewestcamping.com/" target="_blank">www.stavewestcamping.com/</a>',
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC257447",
    closure_description:
      'Seasonal Closure, additional information and updates, please visit <a href="https://stavewestcamping.com/" target="_blank">www.stavewestcamping.com/</a>',
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC258591",
    headline: "CLOSED - Due to Active Wildfire in area",
    closure_description: null,
  },
  {
    rec_resource_id: "REC261703",
    closure_description:
      "Pacific Yew Recreation Site is now closed and gated for the season.  The site will open with a host May 2026. Shoulder season group rentals are now available.",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC263130",
    closure_description:
      "Trail closed due to deteriorated and unsafe bridges \r\nUse at own Risk\r\n\r\nRepairs planned for Spring 2026 subject to funding.",
    headline: "Trail is closed",
  },
  {
    rec_resource_id: "REC265953",
    headline: "Closure due to sensitive wildlife activity.",
    closure_description: null,
  },
  {
    rec_resource_id: "REC2683",
    closure_description:
      "The Recreation Site is closed due to an active wildfire in the area. For further information visit www.bcwildfire.ca",
    headline: "Recreation reserve is closed",
  },
  {
    rec_resource_id: "REC270705",
    headline: "Trail closed due to active wildfire",
    closure_description: null,
  },
  {
    rec_resource_id: "REC270721",
    closure_description:
      "The site/trail remains closed for wildfire recovery activities and to prevent negative impacts to ecosystems and wildlife.",
    headline: "Trail is closed",
  },
  {
    rec_resource_id: "REC270750",
    closure_description:
      "The area around Lower Clearwater Lake will be closed to the public on Sunday July 20 between 11am and 4pm as a helicopter is long-lining materials into the area for an infrastructure replacement project.  \r\n\r\nOnion Lake and the Raven Song Trail will remain open to the public during this time.\r\n\r\nPlease avoid the Lower Clearwater Lake area and respect the closure.  Thank you.",
    headline: "Trail is closed",
  },
  {
    rec_resource_id: "REC2844",
    headline: "The Recreation Trail is closed due impacts of wildfire.",
    closure_description: null,
  },
  {
    rec_resource_id: "REC2928",
    closure_description:
      "The Scum Lake Rec Site is closed to the public until further notice.  A bridge that provides access to the site is compromised and unsafe for public use.",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC2988",
    closure_description:
      "The Pendleton Lake Recreation Site is closed due to a bridge closure on the forest service road that provides access to the recreation site. It is not known yet at this time when the bridge will be reopened. Please observe all posted road closures and signs.",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC3032",
    closure_description:
      'Seasonal Closure, additional information and updates, please visit <a href="https://firesidecamping.ca/" target="_blank">https://firesidecamping.ca//</a>',
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC3033",
    closure_description:
      "This site is closed for safety reasons, effective immediately, until further notice.\r\n15 May, 2025",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC3035",
    headline: "Permanently closed",
    closure_description: null,
  },
  {
    rec_resource_id: "REC3053",
    closure_description:
      "Closed until further notice due to the closure of the Rennell Sound Forest Service Road. Damage to major culverts on the Rennell Sound FSR has created unsafe road conditions.",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC3061",
    headline: "Closed until further notice due to damages from flood waters",
    closure_description: null,
  },
  {
    rec_resource_id: "REC3066",
    closure_description:
      "CLOSED UNTIL FURTHER NOTICE DUE TO\r\n\r\n<BR>INCREASED RISK RESULTING FROM WILDFIRE",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC3069",
    headline: "Closed to Flood Damage - No access",
    closure_description: null,
  },
  {
    rec_resource_id: "REC3100",
    closure_description:
      "This trail is closed for safety reasons, effective immediately, until further notice.\r\n15 May, 2025",
    headline: "Trail is closed",
  },
  {
    rec_resource_id: "REC3101",
    closure_description:
      "This trail is closed for safety reasons, effective immediately, until further notice.\r\n15 May, 2025",
    headline: "Trail is closed",
  },
  {
    rec_resource_id: "REC3104",
    closure_description:
      "This trail is closed for safety reasons, effective immediately, until further notice.\r\n15 May, 2025",
    headline: "Trail is closed",
  },
  {
    rec_resource_id: "REC3105",
    closure_description:
      "This trail is closed for safety reasons, effective immediately, until further notice.\r\n15 May, 2025",
    headline: "Trail is closed",
  },
  {
    rec_resource_id: "REC3112",
    closure_description:
      "Closed until further notice due to the closure of the Rennell Sound Forest Service Road. Damage to major culverts on the Rennell Sound FSR has created unsafe road conditions.",
    headline: "Trail is closed",
  },
  {
    rec_resource_id: "REC3113",
    headline: "Seasonal Closure opening date to be determined Spring 2026",
    closure_description: null,
  },
  {
    rec_resource_id: "REC3124",
    closure_description:
      "This site is closed for safety reasons, effective immediately, until further notice.\r\n15 May, 2025",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC3125",
    closure_description:
      "This site is closed for safety reasons, effective immediately, until further notice.\r\n15 May, 2025",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC3126",
    closure_description:
      "This site is closed for safety reasons, effective immediately, until further notice.\r\n15 May, 2025",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC3127",
    closure_description:
      "This site is closed for safety reasons, effective immediately, until further notice.\r\n15 May, 2025",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC3128",
    closure_description:
      "This site is CLOSED FOR THE SEASON and not being serviced or maintained for public use. Gates are locked. This site is expected to reopen for the 2026 Season between May 1 and October 17, 2026.",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC3131",
    headline: "The recreation site is closed, no camping is permitted.",
    closure_description: null,
  },
  {
    rec_resource_id: "REC3173",
    closure_description:
      "This site is closed for safety reasons, effective immediately, until further notice.\r\n15 May, 2025",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC3174",
    closure_description:
      "This site is closed for safety reasons, effective immediately, until further notice.\r\n15 May, 2025",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC3175",
    closure_description:
      "This site is closed for safety reasons, effective immediately, until further notice.\r\n15 May, 2025",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC3177",
    closure_description:
      "This trail is closed for safety reasons, effective immediately, until further notice.\r\n15 May, 2025",
    headline: "Trail is closed",
  },
  {
    rec_resource_id: "REC32107",
    closure_description:
      "The site/trail remains closed for wildfire recovery activities and to prevent negative impacts to ecosystems and wildlife.",
    headline: "Trail is closed",
  },
  {
    rec_resource_id: "REC32116",
    closure_description:
      "NOTICE:   Starr Creek Cabin is currently CLOSED until further notice - due to avalanche risk at current location.",
    headline: "Recreation reserve is closed",
  },
  {
    rec_resource_id: "REC3258",
    closure_description:
      'Seasonal Closure, additional information and updates, please visit <a href="https://stavewestcamping.com/" target="_blank">www.stavewestcamping.com/</a>',
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC32646",
    closure_description:
      "Closed as of October 12, 2025 due to grizzly bear incident in the area. Avoid this area until further notice.",
    headline: "Trail is closed",
  },
  {
    rec_resource_id: "REC32655",
    closure_description:
      "Site currently inaccessible due to washout at 41km on Parsnip West FSR. No estimated time of reopening.",
    headline: "Trail is closed",
  },
  {
    rec_resource_id: "REC32879",
    closure_description:
      "The Recreation Site is closed due to a road washout blocking access to the area.",
    headline: "Trail is closed",
  },
  {
    rec_resource_id: "REC32895",
    closure_description:
      "The Recreation Site is closed due to unknown impacts from a 2021 wildfire in the area.",
    headline: "Trail is closed",
  },
  {
    rec_resource_id: "REC33069",
    closure_description:
      "Cream Puff trail will be temporarily closed for the 2023 season due to residential construction for the Sunstone Subdivision. Active construction with machinery will occur in certain spots, for safety reasons please do not ride the trail during this closure. Expected opening in 2024.",
    headline: "Trail is closed",
  },
  {
    rec_resource_id: "REC3521",
    closure_description:
      "Bridge access to site is closed. Site will reopen when bridge repairs complete.",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC4102",
    closure_description:
      "The Recreation Site/Trail is closed.  Dangerous tree removal is occurring to remove trees killed or badly damaged due to the 2023 wildfire and are at risk of falling without warning.",
    headline: "Trail is closed",
  },
  {
    rec_resource_id: "REC4118",
    closure_description:
      "The Recreation Site/Trail is closed due to an active wildfire in the area. The area is \r\ncurrently under Evacuation order. Find further information at www.bcwildfire.ca",
    headline: "Trail is closed",
  },
  {
    rec_resource_id: "REC4526",
    closure_description:
      "Trail close due to aggressive cougar protecting its kill in the area.",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC4532",
    closure_description:
      "This site remains closed for wildfire recovery activities (for example, danger tree assessing and falling, area assessments, etc) and to prevent negative impacts to ecosystems and wildlife.",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC4669",
    closure_description:
      "This trail is currently closed as it was impacted by the 2023 Wildfire Season.  It will be updated once and assessment is complete.",
    headline: "Trail is closed",
  },
  {
    rec_resource_id: "REC4671",
    closure_description:
      "The recreation site is closed due to flood damage and remains closed until an assessment is completed.",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC4672",
    headline: "Closed due to wildfire.",
    closure_description: null,
  },
  {
    rec_resource_id: "REC4713",
    headline: "CLOSED - Due to Active Wildfire in area",
    closure_description: null,
  },
  {
    rec_resource_id: "REC4716",
    closure_description:
      "This trail network remains closed for wildfire recovery activities (for example, danger tree assessing and falling, area assessments, etc) and to prevent negative impacts to ecosystems and wildlife.",
    headline: "Trail is closed",
  },
  {
    rec_resource_id: "REC5037",
    closure_description:
      "Trail closed due to deteriorated and unsafe bridges \r\nUse at own Risk\r\n\r\nRepairs planned for Spring 2026 subject to funding.",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC5042",
    closure_description:
      "Trail is very badly overgrown and needs to be re flagged and established.",
    headline: "Trail is closed",
  },
  {
    rec_resource_id: "REC5198",
    closure_description:
      "Due to high flooding and landside risk associated with the 2021 wildfires , the site will be closed until November 2024, signs are posted in the field.",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC5199",
    closure_description:
      "Due to high flooding and landside risk associated with the 2021 wildfires , the site will be closed until November 2024, signs are posted in the field.",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC5348",
    closure_description:
      "TRAIL CLOSED until further notice. There is an unsafe section of trail.  Please do not attempt to hike this trail. Also, the bridge over Hell Roaring Creek was removed on October 7th, 2025.",
    headline: "Trail is closed",
  },
  {
    rec_resource_id: "REC5507",
    closure_description:
      "The recreation site is closed due to flood damage and remains closed until an assessment is completed.",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC5539",
    closure_description:
      "Lawless Britton FSR, right above Murphy Lakes is closed due to a severe washout.",
    headline: "Trail is closed",
  },
  {
    rec_resource_id: "REC5542",
    closure_description:
      '<BR> The City of Merritt is undertaking watermain construction on Hamilton Hill Road requiring a road closure from March 21 to April 11, 2024. The road closure may impact use of the trails. More info available on the City of Merritt\'s website:<BR>\r\n<a href="https://www.merritt.ca/gateway286/" target="_blank">https://www.merritt.ca/gateway286/</a>',
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC5595",
    closure_description:
      "The recreation trail is closed due to flooding and safety concerns.",
    headline: "Trail is closed",
  },
  {
    rec_resource_id: "REC5600",
    closure_description:
      "This trail is closed until further notice due to safety concerns associated with the state of the trail.",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC5627",
    closure_description:
      "This site is closed for safety reasons, effective immediately, until further notice.\r\n15 May, 2025",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC5641",
    closure_description:
      "This site is closed for safety reasons, effective immediately, until further notice.\r\n15 May, 2025",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC5647",
    closure_description:
      "This trail is closed for safety reasons, effective immediately, until further notice.\r\n15 May, 2025",
    headline: "Trail is closed",
  },
  {
    rec_resource_id: "REC5662",
    closure_description:
      "The Recreation Site/Trail is closed.  Dangerous tree removal is occurring to remove trees killed or badly damaged due to the 2023 wildfire and are at risk of falling without warning.",
    headline: "Trail is closed",
  },
  {
    rec_resource_id: "REC5663",
    closure_description:
      "The site/trail remains closed for wildfire recovery activities and to prevent negative impacts to ecosystems and wildlife.  Excessive blowdown and danger trees exist and are a threat to human health and safety.\r\n\r\nDangerous tree removal is occurring to remove trees killed or badly damaged due to the 2023 wildfire and are at risk of falling without warning.",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC5668",
    closure_description:
      "The Recreation Site/Trail is closed due to an active wildfire in the area. The area is \r\ncurrently under Evacuation Alert. Find further information at www.bcwildfire.ca",
    headline: "Trail is closed",
  },
  {
    rec_resource_id: "REC5713",
    closure_description:
      "Site currently inaccessible due to washout at 41km on Parsnip West FSR. No estimated time of reopening.",
    headline: "Trail is closed",
  },
  {
    rec_resource_id: "REC5720",
    closure_description:
      "Due to high flooding and landside risk associated with the 2021 wildfires , the site will be closed until November 2024, signs are posted in the field.",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC5752",
    headline: "TRAIL IS CLOSED",
    closure_description: null,
  },
  {
    rec_resource_id: "REC5758",
    closure_description:
      "The Recreation Site/Trail is closed due to an active wildfire in the area. The area is \r\ncurrently under Evacuation Alert. Find further information at www.bcwildfire.ca",
    headline: "Recreation reserve is closed",
  },
  {
    rec_resource_id: "REC5762",
    closure_description:
      "The Recreation Site/Trail is closed \r\ndue to an active wildfire in the area. The BC Wildfire Service has implemented an \r\nArea Restriction Order under Section 11(1) of the Wildfire Act to address a public \r\nsafety concern. Find further information at www.bcwildfire.ca",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC5772",
    closure_description:
      "The Macbeth trail was severely impacted by wildfire and will remain closed until danger tree assessments and falling can be completed.",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC5862",
    closure_description:
      "This site is closed for safety reasons, effective immediately, until further notice.\r\n15 May, 2025",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC5874",
    closure_description:
      "The Recreation Site/Trail is closed due to an active wildfire in the area.",
    headline: "Trail is closed",
  },
  {
    rec_resource_id: "REC5880",
    closure_description:
      "The recreation site is closed due to flood damage and remains closed until an assessment is completed.",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC5896",
    closure_description:
      "This site is closed for safety reasons, effective immediately, until further notice.\r\n15 May, 2025",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC5898",
    closure_description:
      "This site is closed for safety reasons, effective immediately, until further notice.\r\n15 May, 2025",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC5932",
    closure_description:
      "This site is closed for safety reasons, effective immediately, until further notice.\r\n15 May, 2025",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC5937",
    closure_description:
      "Bear Den's Trail is currently impassable due to significant blowdown. For other hiking ideas, please visit: https://beta.sitesandtrailsbc.ca/",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC5940",
    headline: "TRAIL IS CLOSED",
    closure_description: null,
  },
  {
    rec_resource_id: "REC5967",
    closure_description:
      "This site is closed for safety reasons, effective immediately, until further notice.\r\n15 May, 2025",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC5968",
    closure_description:
      "This site is closed for safety reasons, effective immediately, until further notice.\r\n15 May, 2025",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC5969",
    closure_description:
      "This site is closed for safety reasons, effective immediately, until further notice.\r\n15 May, 2025",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC5970",
    closure_description:
      "This site is closed for safety reasons, effective immediately, until further notice.\r\n15 May, 2025",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC5971",
    closure_description:
      "This site is closed for safety reasons, effective immediately, until further notice.\r\n15 May, 2025",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC5974",
    closure_description:
      "This site is closed for safety reasons, effective immediately, until further notice.\r\n15 May, 2025",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC5975",
    closure_description:
      "This site is closed for safety reasons, effective immediately, until further notice.\r\n15 May, 2025",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC5976",
    closure_description:
      "This site is closed for safety reasons, effective immediately, until further notice.\r\n15 May, 2025",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC5977",
    closure_description:
      "This site is closed for safety reasons, effective immediately, until further notice.\r\n15 May, 2025",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC6044",
    closure_description:
      "This site is closed for safety reasons, effective immediately, until further notice.\r\n15 May, 2025",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC6057",
    closure_description:
      "This trail is closed until further notice due to wildfire activity in the area.",
    headline: "Trail is closed",
  },
  {
    rec_resource_id: "REC6081",
    closure_description:
      "This site is closed for safety reasons, effective immediately, until further notice.\r\n15 May, 2025",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC6082",
    headline: "Permanently Closed",
    closure_description: null,
  },
  {
    rec_resource_id: "REC6084",
    headline: "closed due to blowdown",
    closure_description: null,
  },
  {
    rec_resource_id: "REC6093",
    closure_description:
      "This site is closed for safety reasons, effective immediately, until further notice.\r\n15 May, 2025",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC6094",
    closure_description:
      "This site is closed for safety reasons, effective immediately, until further notice.\r\n15 May, 2025",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC6095",
    closure_description:
      "This site is closed for safety reasons, effective immediately, until further notice.\r\n15 May, 2025",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC6132",
    closure_description:
      "This Recreation Trail is closed due to an active wildfire in the area. For further information visit www.bcwildfire.ca",
    headline: "Trail is closed",
  },
  {
    rec_resource_id: "REC6144",
    closure_description:
      "This site is closed for safety reasons, effective immediately, until further notice.\r\n15 May, 2025\r\n\r\n****** Please be advised: 2025 ***** \r\nCedar Lake Recreation Site near Campbell River will be closed from mid-July to mid-August as the Blackwater FSR access will require closure during a Western toadlet migration. The exact dates will depend on the migration start and end. For more information and updates:\r\nhttps://www2.gov.bc.ca/gov/content/industry/natural-resource-use/resource-roads/local-road-safety-information/campbell-river-road-safety-information#restrictions",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC6208",
    closure_description:
      "This site is closed for safety reasons, effective immediately, until further notice.\r\n15 May, 2025",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC6214",
    closure_description:
      "This site is closed for safety reasons, effective immediately, until further notice.\r\n15 May, 2025",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC6215",
    closure_description:
      "This site is closed for safety reasons, effective immediately, until further notice.\r\n15 May, 2025",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC6216",
    closure_description:
      "This trail is closed for safety reasons, effective immediately, until further notice.\r\n15 May, 2025",
    headline: "Trail is closed",
  },
  {
    rec_resource_id: "REC6304",
    closure_description:
      "This site is closed for safety reasons, effective immediately, until further notice.\r\n15 May, 2025",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC6328",
    headline: "CLOSED DUE TO AGGRESSIVE BEAR ACTIVITY IN THE AREA.",
    closure_description: null,
  },
  {
    rec_resource_id: "REC6358",
    closure_description:
      "Trail is CLOSED due to hazards from dead and burned trees, as a result of the Elaho Fire in 2015.  The Elaho Giant Tree has unfortunately been confirmed dead as well.",
    headline: "Trail is closed",
  },
  {
    rec_resource_id: "REC6386",
    closure_description:
      "Ripple (Silver) Lake Rec Site will be closed indefinitely due to extremely high water and flood damage to the rec site.  Please avoid the site to reduce the risk of injury or causing further damage to the site.  We apologize for any inconvenience this may cause.",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC6415",
    closure_description:
      "This site is closed for safety reasons, effective immediately, until further notice.\r\n15 May, 2025",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC6416",
    closure_description:
      "This site is closed for safety reasons, effective immediately, until further notice.\r\n15 May, 2025",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC6427",
    closure_description:
      "This site is closed for safety reasons, effective immediately, until further notice.\r\n15 May, 2025",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC6428",
    headline: "Permanently closed",
    closure_description: null,
  },
  {
    rec_resource_id: "REC6435",
    closure_description:
      "This site is closed for safety reasons, effective immediately, until further notice.\r\n15 May, 2025",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC6436",
    closure_description:
      "This site is closed for safety reasons, effective immediately, until further notice.\r\n15 May, 2025",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC6437",
    closure_description:
      "This site is closed for safety reasons, effective immediately, until further notice.\r\n15 May, 2025\r\n\r\n****** Please be advised: 2025 ***** \r\nCedar Lake Recreation Site near Campbell River will be closed from mid-July to mid-August as the Blackwater FSR access will require closure during a Western toadlet migration. The exact dates will depend on the migration start and end. For more information and updates:\r\nhttps://www2.gov.bc.ca/gov/content/industry/natural-resource-use/resource-roads/local-road-safety-information/campbell-river-road-safety-information#restrictions",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC6446",
    closure_description:
      "This site is closed for safety reasons, effective immediately, until further notice.\r\n15 May, 2025",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC6455",
    closure_description:
      "This site is closed for safety reasons, effective immediately, until further notice.\r\n15 May, 2025",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC6477",
    closure_description:
      "This site is closed for safety reasons, effective immediately, until further notice.\r\n15 May, 2025",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC6484",
    headline: "Site closed indefinitely due to flooding.",
    closure_description: null,
  },
  {
    rec_resource_id: "REC6505",
    closure_description:
      "This site is closed for safety reasons, effective immediately, until further notice.\r\n15 May, 2025",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC6551",
    closure_description:
      "This site is closed for safety reasons, effective immediately, until further notice.\r\n15 May, 2025",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC6571",
    closure_description:
      "This site is closed for safety reasons, effective immediately, until further notice.\r\n15 May, 2025",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC6579",
    headline: "The site/trail is closed due to active wildfire nearby.",
    closure_description: null,
  },
  {
    rec_resource_id: "REC6591",
    closure_description:
      "The Recreation Site is closed due to an active  wildfire in the area. For further information visit www.bcwildfire.ca",
    headline: "Recreatiion reserve is closed",
  },
  {
    rec_resource_id: "REC6613",
    closure_description:
      "This site is closed for safety reasons, effective immediately, until further notice.\r\n15 May, 2025",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC6618",
    closure_description:
      "This site is closed for safety reasons, effective immediately, until further notice.\r\n15 May, 2025",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC6619",
    closure_description:
      "This site is closed for safety reasons, effective immediately, until further notice.\r\n15 May, 2025",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC6636",
    closure_description:
      "This site is closed for safety reasons, effective immediately, until further notice.\r\n15 May, 2025",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC6678",
    closure_description:
      "This site is closed for safety reasons, effective immediately, until further notice.\r\n15 May, 2025",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC6784",
    closure_description:
      "This site is closed until further notice. New natural hazards have been created by the Capricorn Mudslide of August 6, 2010.  This site is no longer safe to use.",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC6802",
    closure_description:
      "The Recreation Site/Trail is closed due to an active wildfire in the area. The area is \r\ncurrently under Evacuation order. Find further information at www.bcwildfire.ca",
    headline: "Trail is closed",
  },
  {
    rec_resource_id: "REC6819",
    closure_description:
      '<BR> The City of Merritt is undertaking watermain construction on Hamilton Hill Road requiring a road closure from March 21 to April 11, 2024. The road closure may impact use of the trails. More info available on the City of Merritt\'s website:<BR>\r\n<a href="https://www.merritt.ca/gateway286/" target="_blank">https://www.merritt.ca/gateway286/</a>',
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC6822",
    closure_description:
      "Trail closed due to bridge issues. Will remain closed until major repairs.",
    headline: "Trail is closed",
  },
  {
    rec_resource_id: "REC6826",
    closure_description:
      "This site is closed for safety reasons, effective immediately, until further notice.\r\n15 May, 2025",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC6851",
    closure_description:
      "Site Closed.  Bonanza Bluffs is a user maintained recreation site that has experienced soil erosion and vegetation damage in sensitive ecosystems from off-trail motorcycle use and garbage accumulation from users.",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC6854",
    closure_description:
      "Site CLOSED for the season. \r\n\r\nNixon Creek will re-open in May 2021. For updates, visit the following online link https://www.grandgetaways.ca/campsites/nixon-creek/",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC6863",
    closure_description:
      "The Recreation Site/Trail is closed due to an active wildfire in the area. The area is \r\ncurrently under Evacuation order. Find further information at www.bcwildfire.ca",
    headline: "Trail is closed",
  },
  {
    rec_resource_id: "REC6905",
    closure_description:
      "The Recreation Trail is closed due to an active wildfire in the area. For further \r\ninformation visit www.bcwildfire.ca",
    headline: "Trail is closed",
  },
  {
    rec_resource_id: "REC6941",
    closure_description:
      "Trails north and west of Porcupine Meadows and Bonaparte Provincial Park remains closed for wildfire recovery activities (for example, danger tree assessing and falling, area assessments, etc) and to prevent negative impacts to ecosystems and wildlife.",
    headline: "Trail is closed",
  },
  {
    rec_resource_id: "REC6959",
    headline: "CLOSED - Due to Active Wildfire in area",
    closure_description: null,
  },
  {
    rec_resource_id: "REC97585",
    closure_description:
      "Harvey Recreation Site was completely washed away by flooding in the fall of 2017.",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC97641",
    closure_description:
      "Site Closed.\r\nThe Recreation Site/Trail is closed due to an active wildfire in the area.",
    headline: "Site is closed",
  },
  {
    rec_resource_id: "REC97838",
    headline: "Closed due to wildfire.",
    closure_description: null,
  },
];

module.exports = {
  async up(knex) {
    if (
      process.env.STRAPI_ADMIN_ENVIRONMENT !== "prod" &&
      (await knex.schema.hasTable("public_advisory_audits")) &&
      (await knex.schema.hasTable("recreation_resources"))
    ) {
      // use strapi.documents to get all the recreation resources and create a map of recResourceId to documentId
      const recResources = await strapi
        .documents("api::recreation-resource.recreation-resource")
        .findMany({
          fields: ["recResourceId", "documentId"],
          pagination: { limit: 10000 },
        });
      const recResourceMap = {};
      recResources.forEach((recResource) => {
        recResourceMap[recResource.recResourceId] = recResource.documentId;
      });

      // get the documentId of the "Full closure" access status
      const fullClosureAccessStatus = await strapi
        .documents("api::access-status.access-status")
        .findFirst({
          filters: {
            accessStatus: "Full closure",
          },
          fields: ["documentId"],
        });

      // get the documentId of the "High" urgency
      const highUrgency = await strapi
        .documents("api::urgency.urgency")
        .findFirst({
          filters: {
            urgency: "High",
          },
          fields: ["documentId"],
        });

      // get the biggest advisoryNumber from public_advisory_audits
      const latestAdvisory = await strapi
        .documents("api::public-advisory-audit.public-advisory-audit")
        .findFirst({
          sort: { advisoryNumber: "desc" },
          fields: ["advisoryNumber"],
        });
      let latestAdvisoryNumber = latestAdvisory
        ? latestAdvisory.advisoryNumber
        : 0;

      // get the documentId for the "Area closure" event type
      const areaClosureEventType = await strapi
        .documents("api::event-type.event-type")
        .findFirst({
          filters: {
            eventType: "Area closure",
          },
          fields: ["documentId"],
        });

      // get the documentId for the "Published" advisory-status
      const publishedAdvisoryStatus = await strapi
        .documents("api::advisory-status.advisory-status")
        .findFirst({
          filters: {
            advisoryStatus: "Published",
          },
          fields: ["documentId"],
        });

      if (!fullClosureAccessStatus) {
        throw new Error('Access status "Full closure" not found');
      }
      if (!highUrgency) {
        throw new Error('Urgency "High" not found');
      }
      if (!areaClosureEventType) {
        throw new Error('Event type "Area closure" not found');
      }
      if (!publishedAdvisoryStatus) {
        throw new Error('Advisory status "Published" not found');
      }

      // loop through the closures and create a public advisory audit record for each one
      for (const closure of closures) {
        const recreationResourceDocumentId =
          recResourceMap[closure.rec_resource_id];

        if (!recreationResourceDocumentId) {
          strapi.log.warn(
            `Skipping closure for recreation resource ${closure.rec_resource_id}: no matching recreation resource was found in this environment.`
          );
          continue;
        }

        const advisory = {
          recreationResources: [recreationResourceDocumentId],
          title: closure.headline,
          description: closure.closure_description,
          accessStatus: fullClosureAccessStatus?.documentId,
          submittedBy: "Imported",
          modifiedBy: "Imported",
          advisoryDate: new Date(),
          effectiveDate: new Date(),
          createdDate: new Date(),
          modifiedDate: new Date(),
          eventType: areaClosureEventType?.documentId,
          isLatestRevision: true,
          revisionNumber: 1,
          advisoryNumber: latestAdvisoryNumber + 1,
          isSafetyRelated: false,
          listingRank: 0,
          latitude: 0,
          longitude: 0,
          mapZoom: 0,
          isReservationsAffected: false,
          isAdvisoryDateDisplayed: true,
          isEffectiveDateDisplayed: false,
          isEndDateDisplayed: false,
          isUpdatedDateDisplayed: false,
          urgency: highUrgency?.documentId,
          isUrgentAfterHours: false,
          advisoryStatus: publishedAdvisoryStatus?.documentId,
        };

        await strapi
          .documents("api::public-advisory-audit.public-advisory-audit")
          .create({
            data: advisory,
          });

        latestAdvisoryNumber++;
      }
    }
  },
};
