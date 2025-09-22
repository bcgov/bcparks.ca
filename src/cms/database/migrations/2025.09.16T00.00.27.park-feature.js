"use strict";

// This array came from https://raw.githubusercontent.com/bcgov/bcparks-staff-portal/refs/heads/main/backend/strapi-sync/create-multiple-item-campgrounds.js
// orcsAreaNumber was added for the operations in this script based on a mapping from
// https://raw.githubusercontent.com/bcgov/bcparks.ca/refs/heads/alpha/src/cms/database/migrations/2025.09.05T00.00.24.park-area.js
const multiItemAreas = [
  {
    campgroundName: "Alice Lake Campground",
    items: [
      {
        strapiName: "Alice Lake Campground A sites 1-55",
        newName: "Campground A sites 1-55",
        featureId: "90_60",
      },
      {
        strapiName: "Alice Lake Campground B sites 56-96",
        newName: "Campground B sites 56-96",
        featureId: "90_61",
      },
    ],
    orcs: 90,
    orcsAreaNumber: "90-1",
  },
  {
    campgroundName: "Alice Lake Groupsites",
    items: [
      {
        strapiName: "Alice Lake groupsite A",
        newName: "Groupsite A",
        featureId: "90_177",
      },
      {
        strapiName: "Alice Lake groupsite B",
        newName: "Groupsite B",
        featureId: "90_178",
      },
    ],
    orcs: 90,
    orcsAreaNumber: "90-2",
  },
  {
    campgroundName: "Berg Lake Trail",
    items: [
      {
        strapiName: "Berg Lake Trail - Kinney Lake Campground",
        newName: "Kinney Lake Campground",
        featureId: "2_23",
      },
      {
        strapiName: "Berg Lake Trail - Whitehorn Campground",
        newName: "Whitehorn Campground",
        featureId: "2_27",
      },
    ],
    orcs: 2,
    orcsAreaNumber: "2-1",
  },
  {
    campgroundName: "Big Bar Lake Campground",
    items: [
      {
        strapiName: "Big Bar Lake Lakeside Campground",
        newName: "Lakeside Campground",
        featureId: "213_29",
      },
      {
        strapiName: "Big Bar Lake Upper Campground",
        newName: "Upper Campground",
        featureId: "213_30",
      },
    ],
    orcs: 213,
  },
  {
    campgroundName: "Bighorn Campground",
    items: [
      {
        strapiName: "Bighorn Campground electrified sites 62-70",
        newName: "Electrified sites 62-70",
        featureId: "202_31",
      },
      {
        strapiName: "Bighorn Campground sites 71-86",
        newName: "Sites 71-86",
        featureId: "202_32",
      },
    ],
    orcs: 202,
    orcsAreaNumber: "202-1",
  },
  {
    campgroundName: "Birkenhead Campground",
    items: [
      {
        strapiName: "Birkenhead Campground sites 1-78",
        newName: "Sites 1-78",
        featureId: "152_34",
      },
      {
        strapiName: "Birkenhead Campground high-density sites",
        newName: "High-density campsites",
        featureId: "152_35",
      },
    ],
    orcs: 152,
    orcsAreaNumber: "152-1",
  },
  {
    campgroundName: "Cathedral backcountry",
    items: [
      {
        strapiName: "Cathedral other backcountry",
        newName: "Other backcountry",
        featureId: "199_65",
      },
      {
        strapiName: "Cathedral core area backcountry",
        newName: "Core area",
        featureId: "199_66",
      },
      {
        strapiName: "Ashnola Forest Service Road",
        newName: "Ashnola Forest Service Road",
        featureId: "199_11",
      },
    ],
    orcs: 199,
    orcsAreaNumber: "199-2",
  },
  {
    campgroundName: "Furlong Bay Campground",
    items: [
      {
        strapiName: "Furlong Bay Campground sites 1-85",
        newName: "Sites 1-85",
        featureId: "70_132",
      },
      {
        strapiName: "Furlong Bay Campground sites 86-164",
        newName: "Sites 86-164",
        featureId: "70_133",
      },
    ],
    orcs: 70,
    orcsAreaNumber: "70-1",
  },
  {
    campgroundName: "Honeymoon Bay Groupsites",
    items: [
      {
        strapiName: "Honeymoon Bay groupsite A",
        newName: "Groupsite A",
        featureId: "41_200",
      },
      {
        strapiName: "Honeymoon Bay groupsite B",
        newName: "Groupsite B",
        featureId: "41_201",
      },
    ],
    orcs: 41,
    orcsAreaNumber: "41-4",
  },
  {
    campgroundName: "Kettle River Campground",
    items: [
      {
        strapiName: "Kettle River Campground sites 1-9, 21-44, 61-114",
        newName: "Sites 1-9, 21-44, 61-114",
        featureId: "236_753",
      },
      {
        strapiName: "Kettle River Campground sites 10-20, 45-60",
        newName: "Sites 10-20, 45-60",
        featureId: "236_226",
      },
    ],
    orcs: 236,
    orcsAreaNumber: "236-1",
  },
  {
    campgroundName: "Lightning Lake Campground",
    items: [
      {
        strapiName: "Lightning Lake Campground (Large Loop)",
        newName: "Large Loop",
        featureId: "33_246",
      },
      {
        strapiName: "Lightning Lake Campground (Small Loop)",
        newName: "Small Loop",
        featureId: "33_247",
      },
    ],
    orcs: 33,
    orcsAreaNumber: "33-5",
  },
  {
    campgroundName: "Little Qualicum Falls Campground",
    items: [
      {
        strapiName: "Little Qualicum Falls Lower Campground",
        newName: "Lower Campground",
        featureId: "30_258",
      },
      {
        strapiName: "Little Qualicum Falls Upper Campground",
        newName: "Upper Campground",
        featureId: "30_462",
      },
    ],
    orcs: 30,
    orcsAreaNumber: "30-1",
  },
  {
    campgroundName: "Lone Duck Groupsites",
    items: [
      {
        strapiName: "Lone Duck groupsite 1",
        newName: "Groupsite 1",
        featureId: "33_252",
      },
      {
        strapiName: "Lone Duck groupsite 2",
        newName: "Groupsite 2",
        featureId: "33_253",
      },
    ],
    orcs: 33,
    orcsAreaNumber: "33-6",
  },
  {
    campgroundName: "Maple Bay Campground",
    items: [
      {
        strapiName: "Maple Bay Campground sites 1-65",
        newName: "Sites 1-65",
        featureId: "41_272",
      },
      {
        strapiName: "Maple Bay Campground sites 66-97",
        newName: "Sites 66-97",
        featureId: "41_273",
      },
    ],
    orcs: 41,
    orcsAreaNumber: "41-5",
  },
  {
    campgroundName: "Miracle Beach Campground",
    items: [
      {
        strapiName: "Miracle Beach Campground Overflow",
        newName: "Overflow",
        featureId: "45_922",
      },
      {
        strapiName: "Miracle Beach Campground sites 1-25",
        newName: "Sites 1-25",
        featureId: "45_915",
      },
      {
        strapiName: "Miracle Beach Campground sites 101-201",
        newName: "Sites 101-201",
        featureId: "45_281",
      },
      {
        strapiName: "Miracle Beach Campground sites 26-100",
        newName: "Sites 26-100",
        featureId: "45_285",
      },
    ],
    orcs: 45,
    orcsAreaNumber: "45-2",
  },
  {
    campgroundName: "Okanagan Lake Campground",
    items: [
      {
        strapiName: "Okanagan Lake North Campground sites 1-81",
        newName: "North Campground sites 1-81",
        featureId: "54_533",
      },
      {
        strapiName: "Okanagan Lake South Campground sites 1-88",
        newName: "South Campground sites 1-88",
        featureId: "54_539",
      },
    ],
    orcs: 54,
  },
  {
    campgroundName: "Porpoise Bay Campground",
    items: [
      {
        strapiName: "Porpoise Bay Campground sites 1-30",
        newName: "Sites 1-30",
        featureId: "221_343",
      },
      {
        strapiName: "Porpoise Bay Campground sites 31-84",
        newName: "Sites 31-84",
        featureId: "221_342",
      },
    ],
    orcs: 221,
    orcsAreaNumber: "221-1",
  },
  {
    campgroundName: "Quinsam Campground",
    items: [
      {
        strapiName: "Quinsam Campground sites 1-15",
        newName: "Sites 1-15",
        featureId: "28_535",
      },
      {
        strapiName: "Quinsam Campground sites 16-70",
        newName: "Sites 16-70",
        featureId: "28_536",
      },
      {
        strapiName: "Quinsam Campground sites 71-122",
        newName: "Sites 71-122",
        featureId: "28_537",
      },
    ],
    orcs: 28,
    orcsAreaNumber: "28-1",
  },
  {
    campgroundName: "Rathtrevor Beach Campground",
    items: [
      {
        strapiName: "Rathtrevor Beach Campground sites 1-174",
        newName: "Sites 1-174",
        featureId: "193_101",
      },
      {
        strapiName: "Rathtrevor Beach Campground sites 175-226",
        newName: "Sites 175-226",
        featureId: "193_255",
      },
    ],
    orcs: 193,
    orcsAreaNumber: "193-1",
  },
  {
    campgroundName: "Robson River Campground",
    items: [
      {
        strapiName: "Robson River Campground 1-20",
        newName: "Sites 1-20",
        featureId: "2_367",
      },
      {
        strapiName: "Robson River Campground electrified sites 21-40",
        newName: "Electrified sites 21-40",
        featureId: "2_368",
      },
    ],
    orcs: 2,
    orcsAreaNumber: "2-5",
  },
  {
    campgroundName: "Roche Lake Campground",
    items: [
      {
        strapiName: "Roche Lake North Campground",
        newName: "North Campground",
        featureId: "6892_369",
      },
      {
        strapiName: "Roche Lake West Campground",
        newName: "West Campground",
        featureId: "6892_370",
      },
    ],
    orcs: 6892,
  },
  {
    campgroundName: "Sandspit Campground",
    items: [
      {
        strapiName: "Sandspit Campground lanes 1-3, sites 1-52",
        newName: "Lanes 1-3, Sites 1-52",
        featureId: "52_381",
      },
      {
        strapiName: "Sandspit Campground lanes 4-6, sites 53-113",
        newName: "Lanes 4-6, Sites 53-113",
        featureId: "52_382",
      },
    ],
    orcs: 52,
    orcsAreaNumber: "52-7",
  },
  {
    campgroundName: "Shuswap Lake Campground",
    items: [
      {
        strapiName: "Shuswap Lake Campground sites 1-78, 246-330",
        newName: "Sites 1-78, 246-330",
        featureId: "89_754",
      },
      {
        strapiName: "Shuswap Lake Campground sites 79-245",
        newName: "Sites 79-245",
        featureId: "89_755",
      },
      {
        strapiName: "Shuswap Lake overflow sites",
        newName: "Overflow sites",
        featureId: "89_322",
      },
    ],
    orcs: 89,
    orcsAreaNumber: "89-2",
  },
  {
    campgroundName: "Sproat Lake Campground",
    items: [
      {
        strapiName: "Sproat Lake Lower Campground",
        newName: "Lower Campground",
        featureId: "182_259",
      },
      {
        strapiName: "Sproat Lake Upper Campground",
        newName: "Upper Campground",
        featureId: "182_463",
      },
    ],
    orcs: 182,
    orcsAreaNumber: "182-1",
  },
  {
    campgroundName: "sẃiẃs Campground",
    items: [
      {
        strapiName: "sẃiẃs Campground sites 1-41",
        newName: "Sites 1-41",
        featureId: "142_380",
      },
      {
        strapiName: "sẃiẃs Campground overflow sites",
        newName: "Overflow sites",
        featureId: "142_319",
      },
    ],
    orcs: 142,
    orcsAreaNumber: "142-1",
  },
  {
    campgroundName: "Texas Creek Campground",
    items: [
      {
        strapiName: "Texas Creek Campground site 1-10 and 35-63",
        newName: "Sites 1-10 and 35-63",
        featureId: "9549_451",
      },
      {
        strapiName: "Texas Creek Campground sites 11-34",
        newName: "Sites 11-34",
        featureId: "9549_398",
      },
    ],
    orcs: 9549,
    orcsAreaNumber: "9549-1",
  },
  {
    campgroundName: "West Side Groupsites",
    items: [
      {
        strapiName: "West Side groupsite A",
        newName: "Groupsite A",
        featureId: "41_484",
      },
      {
        strapiName: "West Side groupsite B",
        newName: "Groupsite B",
        featureId: "41_485",
      },
    ],
    orcs: 41,
    orcsAreaNumber: "41-6",
  },
  {
    campgroundName: "White Spruce Island",
    items: [
      {
        strapiName: "White Spruce Island North",
        newName: "North",
        featureId: "251_489",
      },
      {
        strapiName: "White Spruce Island South",
        newName: "South",
        featureId: "251_490",
      },
    ],
    orcs: 251,
  },
];

// This array came from https://raw.githubusercontent.com/bcgov/bcparks-staff-portal/refs/heads/main/backend/strapi-sync/create-single-item-campgrounds.js
// orcsAreaNumber was added for the operations in this script based on a mapping from
// https://raw.githubusercontent.com/bcgov/bcparks.ca/refs/heads/alpha/src/cms/database/migrations/2025.09.05T00.00.24.park-area.js
const singleItemAreas = [
  {
    campgroundName: "8 Mile Log Cabin",
    items: [
      {
        featureName: "All sites",
        featureId: "9815_1",
      },
    ],
    orcs: 9815,
  },
  {
    campgroundName: "Agate Beach Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "255_2",
      },
    ],
    orcs: 255,
    orcsAreaNumber: "255-1",
  },
  {
    campgroundName: "Akamina Creek backcountry",
    items: [
      {
        featureName: "All sites",
        featureId: "338_3",
      },
    ],
    orcs: 338,
    orcsAreaNumber: "338-1",
  },
  {
    campgroundName: "Alces Lake Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "287_5",
      },
    ],
    orcs: 287,
    orcsAreaNumber: "287-1",
  },
  {
    campgroundName: "Alice Lake walk-in sites",
    items: [
      {
        featureName: "All sites",
        featureId: "90_469",
      },
    ],
    orcs: 90,
  },
  {
    campgroundName: "Allison Lake Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "119_6",
      },
    ],
    orcs: 119,
    orcsAreaNumber: "119-1",
  },
  {
    campgroundName: "Alouette Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "8_7",
      },
    ],
    orcs: 8,
    orcsAreaNumber: "8-1",
  },
  {
    campgroundName: "Alouette groupsite",
    items: [
      {
        featureName: "All sites",
        featureId: "8_8",
      },
    ],
    orcs: 8,
    orcsAreaNumber: "8-2",
  },
  {
    campgroundName: "Applebee Dome Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "206_9",
      },
    ],
    orcs: 206,
    orcsAreaNumber: "206-1",
  },
  {
    campgroundName: "Arrowhead Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "273_10",
      },
    ],
    orcs: 273,
    orcsAreaNumber: "273-1",
  },
  {
    campgroundName: "Ashnola Forest Service Road",
    items: [
      {
        featureName: "All sites",
        featureId: "199_11",
      },
    ],
    orcs: 199,
    orcsAreaNumber: "199-1",
  },
  {
    campgroundName: "Atnarko Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "19_12",
      },
    ],
    orcs: 19,
    orcsAreaNumber: "19-1",
  },
  {
    campgroundName: "Azure Lake backcountry",
    items: [
      {
        featureName: "All sites",
        featureId: "24_13",
      },
    ],
    orcs: 24,
  },
  {
    campgroundName: "Balsam Island",
    items: [
      {
        featureName: "All sites",
        featureId: "251_14",
      },
    ],
    orcs: 251,
    orcsAreaNumber: "251-1",
  },
  {
    campgroundName: "Bamberton Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "117_15",
      },
    ],
    orcs: 117,
    orcsAreaNumber: "117-1",
  },
  {
    campgroundName: "Bastion Mountain Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "276_16",
      },
    ],
    orcs: 276,
    orcsAreaNumber: "276-1",
  },
  {
    campgroundName: "Bear Creek Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "307_912",
      },
    ],
    orcs: 307,
    orcsAreaNumber: "307-1",
  },
  {
    campgroundName: "Beatton Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "14_17",
      },
    ],
    orcs: 14,
    orcsAreaNumber: "14-1",
  },
  {
    campgroundName: "Beaumont Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "115_18",
      },
    ],
    orcs: 115,
    orcsAreaNumber: "115-1",
  },
  {
    campgroundName: "Beaver Creek Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "169_615",
      },
    ],
    orcs: 169,
  },
  {
    campgroundName: "Bedwell Lake and Baby Bedwell Lake",
    items: [
      {
        featureName: "All sites",
        featureId: "1_842",
      },
    ],
    orcs: 1,
  },
  {
    campgroundName: "Bench Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "200_19",
      },
    ],
    orcs: 200,
    orcsAreaNumber: "200-1",
  },
  {
    campgroundName: "Bert's Cabin (includes three tent pads)",
    items: [
      {
        featureName: "All sites",
        featureId: "251_28",
      },
    ],
    orcs: 251,
  },
  {
    campgroundName: "Big Bunsby marine-accessible camping",
    items: [
      {
        featureName: "All sites",
        featureId: "8779_532",
      },
    ],
    orcs: 8779,
  },
  {
    campgroundName: "Bishop Creek Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "9509_759",
      },
    ],
    orcs: 9509,
  },
  {
    campgroundName: "Black Prince Cabin",
    items: [
      {
        featureName: "All sites",
        featureId: "27_36",
      },
    ],
    orcs: 27,
  },
  {
    campgroundName: "Blanket Creek groupsites",
    items: [
      {
        featureName: "All sites",
        featureId: "323_179",
      },
    ],
    orcs: 323,
    orcsAreaNumber: "323-2",
  },
  {
    campgroundName: "Blanket Creek sites 1-105",
    items: [
      {
        featureName: "All sites",
        featureId: "323_394",
      },
    ],
    orcs: 323,
    orcsAreaNumber: "323-1",
  },
  {
    campgroundName: "Blue Earth Lake Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "6900_37",
      },
    ],
    orcs: 6900,
    orcsAreaNumber: "6900-1",
  },
  {
    campgroundName: "Bold Head",
    items: [
      {
        featureName: "All sites",
        featureId: "252_39",
      },
    ],
    orcs: 252,
  },
  {
    campgroundName: "Boulder Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "206_40",
      },
    ],
    orcs: 206,
  },
  {
    campgroundName: "Boundary Creek Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "56_41",
      },
    ],
    orcs: 56,
    orcsAreaNumber: "56-1",
  },
  {
    campgroundName: "Bowron Lake Backcountry Canoe Circuit",
    items: [
      {
        featureName: "All sites",
        featureId: "129_44",
      },
    ],
    orcs: 129,
  },
  {
    campgroundName: "Bowron Lake Backcountry Canoe Circuit cabins",
    items: [
      {
        featureName: "All sites",
        featureId: "129_42",
      },
    ],
    orcs: 129,
  },
  {
    campgroundName: "Bowron Lake Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "129_43",
      },
    ],
    orcs: 129,
    orcsAreaNumber: "129-1",
  },
  {
    campgroundName: "Boya Lake Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "178_46",
      },
    ],
    orcs: 178,
    orcsAreaNumber: "178-1",
  },
  {
    campgroundName: "Bridge Lake Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "57_47",
      },
    ],
    orcs: 57,
    orcsAreaNumber: "57-1",
  },
  {
    campgroundName: "Bridge Lake walk-in sites",
    items: [
      {
        featureName: "All sites",
        featureId: "57_470",
      },
    ],
    orcs: 57,
  },
  {
    campgroundName: "Bromley Rock Campground sites 1-17",
    items: [
      {
        featureName: "All sites",
        featureId: "58_538",
      },
    ],
    orcs: 58,
    orcsAreaNumber: "58-1",
  },
  {
    campgroundName: "Buckhorn Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "33_793",
      },
    ],
    orcs: 33,
    orcsAreaNumber: "33-3",
  },
  {
    campgroundName: "Buckinghorse River Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "214_49",
      },
    ],
    orcs: 214,
    orcsAreaNumber: "214-1",
  },
  {
    campgroundName: "Bull Canyon Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "398_50",
      },
    ],
    orcs: 398,
    orcsAreaNumber: "398-1",
  },
  {
    campgroundName: "Bush Creek Site",
    items: [
      {
        featureName: "All sites",
        featureId: "361_51",
      },
    ],
    orcs: 361,
    orcsAreaNumber: "361-1",
  },
  {
    campgroundName: "Buttle Lake Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "1_52",
      },
    ],
    orcs: 1,
    orcsAreaNumber: "1-1",
  },
  {
    campgroundName: "Buttle Lake and Upper Campbell marine sites",
    items: [
      {
        featureName: "All sites",
        featureId: "1_498",
      },
    ],
    orcs: 1,
  },
  {
    campgroundName: "Cambie Creek (groupsite 3)",
    items: [
      {
        featureName: "All sites",
        featureId: "33_57",
      },
    ],
    orcs: 33,
    orcsAreaNumber: "33-1",
  },
  {
    campgroundName: "Cape Scott backcountry",
    items: [
      {
        featureName: "All sites",
        featureId: "250_62",
      },
    ],
    orcs: 250,
    orcsAreaNumber: "250-1",
  },
  {
    campgroundName: "Carmanah Walbran backcountry",
    items: [
      {
        featureName: "All sites",
        featureId: "383_63",
      },
    ],
    orcs: 383,
    orcsAreaNumber: "383-1",
  },
  {
    campgroundName: "Carp Lake (Kettle Bay) Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "251_64",
      },
    ],
    orcs: 251,
  },
  {
    campgroundName: "Cave Creek backcountry",
    items: [
      {
        featureName: "All sites",
        featureId: "287_67",
      },
    ],
    orcs: 287,
    orcsAreaNumber: "287-6",
  },
  {
    campgroundName: "Cedar Point Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "135_68",
      },
    ],
    orcs: 135,
  },
  {
    campgroundName: "Champion Lakes Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "51_69",
      },
    ],
    orcs: 51,
    orcsAreaNumber: "51-1",
  },
  {
    campgroundName: "Charlie Lake Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "161_70",
      },
    ],
    orcs: 161,
    orcsAreaNumber: "161-1",
  },
  {
    campgroundName: "Cheakamus Lake Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "7_71",
      },
    ],
    orcs: 7,
    orcsAreaNumber: "7-1",
  },
  {
    campgroundName: "Chilliwack Lake backcountry",
    items: [
      {
        featureName: "All sites",
        featureId: "258_72",
      },
    ],
    orcs: 258,
    orcsAreaNumber: "258-1",
  },
  {
    campgroundName: "China Beach Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "9398_73",
      },
    ],
    orcs: 9398,
    orcsAreaNumber: "9398-1",
  },
  {
    campgroundName: "Cinnemousun Narrows marine-accessible camping",
    items: [
      {
        featureName: "All sites",
        featureId: "85_74",
      },
    ],
    orcs: 85,
    orcsAreaNumber: "85-1",
  },
  {
    campgroundName: "Cinnemousun Narrows shelters",
    items: [
      {
        featureName: "All sites",
        featureId: "85_387",
      },
    ],
    orcs: 85,
  },
  {
    campgroundName: "Clear Creek Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "41_75",
      },
    ],
    orcs: 41,
    orcsAreaNumber: "41-1",
  },
  {
    campgroundName: "Clearwater Lake Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "24_77",
      },
    ],
    orcs: 24,
    orcsAreaNumber: "24-1",
  },
  {
    campgroundName: "Clearwater Lake backcountry",
    items: [
      {
        featureName: "All sites",
        featureId: "24_76",
      },
    ],
    orcs: 24,
  },
  {
    campgroundName: "Coldspring Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "33_78",
      },
    ],
    orcs: 33,
    orcsAreaNumber: "33-2",
  },
  {
    campgroundName: "Conkle Lake Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "244_79",
      },
    ],
    orcs: 244,
    orcsAreaNumber: "244-1",
  },
  {
    campgroundName: "Conkle Lake groupsites",
    items: [
      {
        featureName: "All sites",
        featureId: "244_80",
      },
    ],
    orcs: 244,
    orcsAreaNumber: "244-1",
  },
  {
    campgroundName: "Conrad Kain Hut",
    items: [
      {
        featureName: "All sites",
        featureId: "206_82",
      },
    ],
    orcs: 206,
  },
  {
    campgroundName: "Crooked River Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "177_83",
      },
    ],
    orcs: 177,
    orcsAreaNumber: "177-1",
  },
  {
    campgroundName: "Croteau Lake backcountry groupsite",
    items: [
      {
        featureName: "All sites",
        featureId: "1_84",
      },
    ],
    orcs: 1,
    orcsAreaNumber: "1-2",
  },
  {
    campgroundName: "Dark Creek Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "9508_752",
      },
    ],
    orcs: 9508,
  },
  {
    campgroundName: "Davis Creek Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "357_86",
      },
    ],
    orcs: 357,
    orcsAreaNumber: "357-1",
  },
  {
    campgroundName: "Delta Grove Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "41_95",
      },
    ],
    orcs: 41,
    orcsAreaNumber: "41-2",
  },
  {
    campgroundName: "Denetiah Lake Cabin",
    items: [
      {
        featureName: "All sites",
        featureId: "8297_96",
      },
    ],
    orcs: 8297,
  },
  {
    campgroundName: "Dionisio Point backcountry",
    items: [
      {
        featureName: "All sites",
        featureId: "384_97",
      },
    ],
    orcs: 384,
    orcsAreaNumber: "384-1",
  },
  {
    campgroundName: "Discovery Island backcountry",
    items: [
      {
        featureName: "All sites",
        featureId: "237_98",
      },
    ],
    orcs: 237,
    orcsAreaNumber: "237-1",
  },
  {
    campgroundName: "Downing Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "217_99",
      },
    ],
    orcs: 217,
    orcsAreaNumber: "217-1",
  },
  {
    campgroundName: "Driftwood Bay groupsite",
    items: [
      {
        featureName: "All sites",
        featureId: "1_100",
      },
    ],
    orcs: 1,
    orcsAreaNumber: "1-3",
  },
  {
    campgroundName: "Dry Gulch Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "61_104",
      },
    ],
    orcs: 61,
    orcsAreaNumber: "61-1",
  },
  {
    campgroundName: "Duu Guusd Campsite",
    items: [
      {
        featureName: "All sites",
        featureId: "559_465",
      },
    ],
    orcs: 559,
  },
  {
    campgroundName: "East Curme Island",
    items: [
      {
        featureName: "All sites",
        featureId: "252_106",
      },
    ],
    orcs: 252,
    orcsAreaNumber: "252-1",
  },
  {
    campgroundName: "Elfin Lakes Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "7_107",
      },
    ],
    orcs: 7,
    orcsAreaNumber: "7-2",
  },
  {
    campgroundName: "Elfin Lakes Shelter",
    items: [
      {
        featureName: "All sites",
        featureId: "7_108",
      },
    ],
    orcs: 7,
  },
  {
    campgroundName: "Elk Lakes Cabin",
    items: [
      {
        featureName: "All sites",
        featureId: "253_110",
      },
    ],
    orcs: 253,
  },
  {
    campgroundName: "Elk Lakes backcountry",
    items: [
      {
        featureName: "All sites",
        featureId: "253_109",
      },
    ],
    orcs: 253,
    orcsAreaNumber: "253-1",
  },
  {
    campgroundName: "Elk River",
    items: [
      {
        featureName: "All sites",
        featureId: "1_502",
      },
    ],
    orcs: 1,
  },
  {
    campgroundName: "Ellison Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "139_917",
      },
    ],
    orcs: 139,
    orcsAreaNumber: "139-1",
  },
  {
    campgroundName: "Emerald Bay Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "273_910",
      },
    ],
    orcs: 273,
    orcsAreaNumber: "273-2",
  },
  {
    campgroundName: "Emory Creek Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "81_116",
      },
    ],
    orcs: 81,
  },
  {
    campgroundName: "Englishman River Falls Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "29_117",
      },
    ],
    orcs: 29,
    orcsAreaNumber: "29-1",
  },
  {
    campgroundName: "Entrance Bay Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "41_118",
      },
    ],
    orcs: 41,
    orcsAreaNumber: "41-3",
  },
  {
    campgroundName: "Falls Creek Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "24_119",
      },
    ],
    orcs: 24,
    orcsAreaNumber: "24-2",
  },
  {
    campgroundName: "Feather Cove",
    items: [
      {
        featureName: "All sites",
        featureId: "6268_120",
      },
    ],
    orcs: 6268,
  },
  {
    campgroundName: "Fillongley Campground sites 1-10",
    items: [
      {
        featureName: "All sites",
        featureId: "48_121",
      },
    ],
    orcs: 48,
    orcsAreaNumber: "48-1",
  },
  {
    campgroundName: "Fintry Campground sites 1-160",
    items: [
      {
        featureName: "All sites",
        featureId: "9213_921",
      },
    ],
    orcs: 9213,
  },
  {
    campgroundName: "Fintry groupsites",
    items: [
      {
        featureName: "All sites",
        featureId: "9213_123",
      },
    ],
    orcs: 9213,
    orcsAreaNumber: "9213-2",
  },
  {
    campgroundName: "Fish Lake Cabin",
    items: [
      {
        featureName: "All sites",
        featureId: "247_125",
      },
    ],
    orcs: 247,
  },
  {
    campgroundName: "Fisheries Pool Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "19_126",
      },
    ],
    orcs: 19,
    orcsAreaNumber: "19-2",
  },
  {
    campgroundName: "Flora Loop",
    items: [
      {
        featureName: "All sites",
        featureId: "258_127",
      },
    ],
    orcs: 258,
  },
  {
    campgroundName: "Flores Island backcountry",
    items: [
      {
        featureName: "All sites",
        featureId: "9497_128",
      },
    ],
    orcs: 9497,
    orcsAreaNumber: "9497-1",
  },
  {
    campgroundName: "French Beach Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "262_129",
      },
    ],
    orcs: 262,
    orcsAreaNumber: "262-2",
  },
  {
    campgroundName: "French Beach groupsite",
    items: [
      {
        featureName: "All sites",
        featureId: "262_130",
      },
    ],
    orcs: 262,
    orcsAreaNumber: "262-1",
  },
  {
    campgroundName: "Friends Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "52_131",
      },
    ],
    orcs: 52,
    orcsAreaNumber: "52-1",
  },
  {
    campgroundName: "Frosty Creek Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "33_795",
      },
    ],
    orcs: 33,
  },
  {
    campgroundName: "Garibaldi Lake Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "7_134",
      },
    ],
    orcs: 7,
    orcsAreaNumber: "7-3",
  },
  {
    campgroundName: "Gibson marine backcountry",
    items: [
      {
        featureName: "All sites",
        featureId: "196_135",
      },
    ],
    orcs: 196,
    orcsAreaNumber: "196-1",
  },
  {
    campgroundName: "Gold Creek Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "8_138",
      },
    ],
    orcs: 8,
    orcsAreaNumber: "8-3",
  },
  {
    campgroundName: "Golden Ears backcountry",
    items: [
      {
        featureName: "All sites",
        featureId: "8_139",
      },
    ],
    orcs: 8,
    orcsAreaNumber: "8-4",
  },
  {
    campgroundName: "Golden Ears groupsite",
    items: [
      {
        featureName: "All sites",
        featureId: "8_140",
      },
    ],
    orcs: 8,
    orcsAreaNumber: "8-5",
  },
  {
    campgroundName: "Golden Ears marine backcountry",
    items: [
      {
        featureName: "All sites",
        featureId: "8_141",
      },
    ],
    orcs: 8,
    orcsAreaNumber: "8-6",
  },
  {
    campgroundName: "Goldminer Groupsite",
    items: [
      {
        featureName: "All sites",
        featureId: "96_611",
      },
    ],
    orcs: 96,
  },
  {
    campgroundName: "Goldpan Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "63_142",
      },
    ],
    orcs: 63,
    orcsAreaNumber: "63-1",
  },
  {
    campgroundName: "Goldstream Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "96_143",
      },
    ],
    orcs: 96,
    orcsAreaNumber: "96-1",
  },
  {
    campgroundName: "Gordon Bay Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "210_145",
      },
    ],
    orcs: 210,
    orcsAreaNumber: "210-1",
  },
  {
    campgroundName: "Gordon Bay groupsite",
    items: [
      {
        featureName: "All sites",
        featureId: "210_146",
      },
    ],
    orcs: 210,
    orcsAreaNumber: "210-2",
  },
  {
    campgroundName: "Grace Harbour",
    items: [
      {
        featureName: "All sites",
        featureId: "252_147",
      },
    ],
    orcs: 252,
  },
  {
    campgroundName: "Granite Falls Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "9509_750",
      },
    ],
    orcs: 9509,
  },
  {
    campgroundName: "Greendrop Loop",
    items: [
      {
        featureName: "All sites",
        featureId: "258_150",
      },
    ],
    orcs: 258,
  },
  {
    campgroundName: "Grizzly Den Cabin",
    items: [
      {
        featureName: "All sites",
        featureId: "9815_151",
      },
    ],
    orcs: 9815,
  },
  {
    campgroundName: "Groupsite G1",
    items: [
      {
        featureName: "All sites",
        featureId: "52_180",
      },
    ],
    orcs: 52,
    orcsAreaNumber: "52-3",
  },
  {
    campgroundName: "Gwe Da Ts'ih Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "409_185",
      },
    ],
    orcs: 409,
  },
  {
    campgroundName: "Gwillim Lake Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "222_187",
      },
    ],
    orcs: 222,
    orcsAreaNumber: "222-1",
  },
  {
    campgroundName: "Halkett Bay marine backcountry",
    items: [
      {
        featureName: "All sites",
        featureId: "365_189",
      },
    ],
    orcs: 365,
    orcsAreaNumber: "365-1",
  },
  {
    campgroundName: "Hampton Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "33_190",
      },
    ],
    orcs: 33,
    orcsAreaNumber: "33-4",
  },
  {
    campgroundName: "Hare Point",
    items: [
      {
        featureName: "All sites",
        featureId: "252_191",
      },
    ],
    orcs: 252,
  },
  {
    campgroundName: "Helm Creek Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "7_192",
      },
    ],
    orcs: 7,
    orcsAreaNumber: "7-5",
  },
  {
    campgroundName: "Hicks Lake Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "200_196",
      },
    ],
    orcs: 200,
    orcsAreaNumber: "200-3",
  },
  {
    campgroundName: "Hicks Lake groupsite",
    items: [
      {
        featureName: "All sites",
        featureId: "200_197",
      },
    ],
    orcs: 200,
    orcsAreaNumber: "200-2",
  },
  {
    campgroundName: "Home Basin Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "287_198",
      },
    ],
    orcs: 287,
    orcsAreaNumber: "287-2",
  },
  {
    campgroundName: "Homestead Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "276_199",
      },
    ],
    orcs: 276,
    orcsAreaNumber: "276-2",
  },
  {
    campgroundName: "Hook (Deep) Bay",
    items: [
      {
        featureName: "All sites",
        featureId: "400_831",
      },
    ],
    orcs: 400,
  },
  {
    campgroundName: "Horsefly Lake Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "268_202",
      },
    ],
    orcs: 268,
    orcsAreaNumber: "268-1",
  },
  {
    campgroundName: "Horsefly Lake walk-in sites",
    items: [
      {
        featureName: "All sites",
        featureId: "268_472",
      },
    ],
    orcs: 268,
  },
  {
    campgroundName: "Horseshoe Bend groupsite",
    items: [
      {
        featureName: "All sites",
        featureId: "6161_203",
      },
    ],
    orcs: 6161,
    orcsAreaNumber: "6161-1",
  },
  {
    campgroundName: "Horseshoe Lake Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "6892_204",
      },
    ],
    orcs: 6892,
    orcsAreaNumber: "6892-1",
  },
  {
    campgroundName: "Inkaneep Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "64_205",
      },
    ],
    orcs: 64,
    orcsAreaNumber: "64-1",
  },
  {
    campgroundName: "Inland Lake Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "6197_207",
      },
    ],
    orcs: 6197,
    orcsAreaNumber: "6197-2",
  },
  {
    campgroundName: "Inland Lake backcountry",
    items: [
      {
        featureName: "All sites",
        featureId: "6197_206",
      },
    ],
    orcs: 6197,
    orcsAreaNumber: "6197-1",
  },
  {
    campgroundName: "Inlet Creek Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "287_208",
      },
    ],
    orcs: 287,
    orcsAreaNumber: "287-3",
  },
  {
    campgroundName: "Jedediah Island marine backcountry",
    items: [
      {
        featureName: "All sites",
        featureId: "9512_211",
      },
    ],
    orcs: 9512,
    orcsAreaNumber: "9512-1",
  },
  {
    campgroundName: "Jewel Lake Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "319_212",
      },
    ],
    orcs: 319,
  },
  {
    campgroundName: "Jimsmith Lake Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "65_213",
      },
    ],
    orcs: 65,
    orcsAreaNumber: "65-1",
  },
  {
    campgroundName: "Joffre Lakes Backcountry Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "363_215",
      },
    ],
    orcs: 363,
    orcsAreaNumber: "363-1",
  },
  {
    campgroundName: "Johnstone Creek Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "66_216",
      },
    ],
    orcs: 66,
  },
  {
    campgroundName: "Juan de Fuca Marine Trail backcountry",
    items: [
      {
        featureName: "All sites",
        featureId: "9398_217",
      },
    ],
    orcs: 9398,
    orcsAreaNumber: "9398-2",
  },
  {
    campgroundName: "Juniper Beach Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "369_911",
      },
    ],
    orcs: 369,
    orcsAreaNumber: "369-1",
  },
  {
    campgroundName: "Kalispell Trail Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "235_222",
      },
    ],
    orcs: 235,
    orcsAreaNumber: "235-1",
  },
  {
    campgroundName: "Karst Creek groupsite",
    items: [
      {
        featureName: "All sites",
        featureId: "1_223",
      },
    ],
    orcs: 1,
    orcsAreaNumber: "1-4",
  },
  {
    campgroundName: "Kekuli Bay Campground sites 1-73",
    items: [
      {
        featureName: "All sites",
        featureId: "378_530",
      },
    ],
    orcs: 378,
    orcsAreaNumber: "378-1",
  },
  {
    campgroundName: "Kekuli Bay walk-in sites 74-77",
    items: [
      {
        featureName: "All sites",
        featureId: "378_467",
      },
    ],
    orcs: 378,
  },
  {
    campgroundName: "Kentucky-Alleyne Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "306_224",
      },
    ],
    orcs: 306,
    orcsAreaNumber: "306-2",
  },
  {
    campgroundName: "Kentucky-Alleyne groupsite",
    items: [
      {
        featureName: "All sites",
        featureId: "306_225",
      },
    ],
    orcs: 306,
    orcsAreaNumber: "306-1",
  },
  {
    campgroundName: "Kettle River groupsite",
    items: [
      {
        featureName: "All sites",
        featureId: "236_227",
      },
    ],
    orcs: 236,
    orcsAreaNumber: "236-2",
  },
  {
    campgroundName: "Kicking Horse Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "33_794",
      },
    ],
    orcs: 33,
  },
  {
    campgroundName: "Kikomun groupsites",
    items: [
      {
        featureName: "All sites",
        featureId: "235_229",
      },
    ],
    orcs: 235,
    orcsAreaNumber: "235-3",
  },
  {
    campgroundName: "Kilby Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "245_230",
      },
    ],
    orcs: 245,
  },
  {
    campgroundName: "Kinaskan Lake Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "356_231",
      },
    ],
    orcs: 356,
    orcsAreaNumber: "356-1",
  },
  {
    campgroundName: "Kiskatinaw Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "140_232",
      },
    ],
    orcs: 140,
    orcsAreaNumber: "140-1",
  },
  {
    campgroundName: "Kitty Coleman Beach Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "36_233",
      },
    ],
    orcs: 36,
  },
  {
    campgroundName: "Kitty Coleman Beach groupsite",
    items: [
      {
        featureName: "All sites",
        featureId: "36_234",
      },
    ],
    orcs: 36,
  },
  {
    campgroundName: "Kleanza Creek Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "67_235",
      },
    ],
    orcs: 67,
    orcsAreaNumber: "67-1",
  },
  {
    campgroundName: "Kokanee Glacier Cabin",
    items: [
      {
        featureName: "All sites",
        featureId: "4_237",
      },
    ],
    orcs: 4,
  },
  {
    campgroundName: "Kokanee Glacier backcountry",
    items: [
      {
        featureName: "All sites",
        featureId: "4_236",
      },
    ],
    orcs: 4,
    orcsAreaNumber: "4-1",
  },
  {
    campgroundName: "Kootenay Lake groupsite",
    items: [
      {
        featureName: "All sites",
        featureId: "357_166",
      },
    ],
    orcs: 357,
  },
  {
    campgroundName: "Lac La Hache Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "68_238",
      },
    ],
    orcs: 68,
    orcsAreaNumber: "68-1",
  },
  {
    campgroundName: "Lac Le Jeune Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "69_239",
      },
    ],
    orcs: 69,
    orcsAreaNumber: "69-1",
  },
  {
    campgroundName: "Lakelse Lake groupsite",
    items: [
      {
        featureName: "All sites",
        featureId: "70_167",
      },
    ],
    orcs: 70,
  },
  {
    campgroundName: "Lakeside (Deer Lake) Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "200_240",
      },
    ],
    orcs: 200,
    orcsAreaNumber: "200-4",
  },
  {
    campgroundName: "Lakeside Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "136_241",
      },
    ],
    orcs: 136,
    orcsAreaNumber: "136-1",
  },
  {
    campgroundName: "Leighton Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "6878_242",
      },
    ],
    orcs: 6878,
    orcsAreaNumber: "6878-1",
  },
  {
    campgroundName: "Leighton North Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "6878_244",
      },
    ],
    orcs: 6878,
    orcsAreaNumber: "6878-2",
  },
  {
    campgroundName: "Liard River Hot Springs Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "92_245",
      },
    ],
    orcs: 92,
    orcsAreaNumber: "92-1",
  },
  {
    campgroundName: "Lindeman Loop",
    items: [
      {
        featureName: "All sites",
        featureId: "258_250",
      },
    ],
    orcs: 258,
  },
  {
    campgroundName: "Lockhart Beach Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "12_251",
      },
    ],
    orcs: 12,
    orcsAreaNumber: "12-1",
  },
  {
    campgroundName: "Lost Ledge Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "357_256",
      },
    ],
    orcs: 357,
    orcsAreaNumber: "357-3",
  },
  {
    campgroundName: "Loveland Bay Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "189_257",
      },
    ],
    orcs: 189,
    orcsAreaNumber: "189-1",
  },
  {
    campgroundName: "Loveland Bay groupsites",
    items: [
      {
        featureName: "All sites",
        featureId: "189_181",
      },
    ],
    orcs: 189,
    orcsAreaNumber: "189-2",
  },
  {
    campgroundName: "Lucerne Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "2_260",
      },
    ],
    orcs: 2,
    orcsAreaNumber: "2-2",
  },
  {
    campgroundName: "Mabel Lake groupsite",
    items: [
      {
        featureName: "All sites",
        featureId: "241_168",
      },
    ],
    orcs: 241,
    orcsAreaNumber: "241-2",
  },
  {
    campgroundName: "MacDonald Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "93_261",
      },
    ],
    orcs: 93,
  },
  {
    campgroundName: "Magog Lake",
    items: [
      {
        featureName: "All sites",
        featureId: "5_263",
      },
    ],
    orcs: 5,
    orcsAreaNumber: "5-1",
  },
  {
    campgroundName: "Mahood Lake Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "24_265",
      },
    ],
    orcs: 24,
    orcsAreaNumber: "24-3",
  },
  {
    campgroundName: "Mahood Lake backcountry",
    items: [
      {
        featureName: "All sites",
        featureId: "24_264",
      },
    ],
    orcs: 24,
  },
  {
    campgroundName: "Mahood Lake groupsites",
    items: [
      {
        featureName: "All sites",
        featureId: "24_266",
      },
    ],
    orcs: 24,
    orcsAreaNumber: "24-4",
  },
  {
    campgroundName: "Main Campground sites 1-61",
    items: [
      {
        featureName: "All sites",
        featureId: "202_267",
      },
    ],
    orcs: 202,
    orcsAreaNumber: "202-2",
  },
  {
    campgroundName: "Main Lake backcountry",
    items: [
      {
        featureName: "All sites",
        featureId: "6093_268",
      },
    ],
    orcs: 6093,
    orcsAreaNumber: "6093-1",
  },
  {
    campgroundName: "Maple Bay Campground Cabins",
    items: [
      {
        featureName: "All sites",
        featureId: "41_271",
      },
    ],
    orcs: 41,
  },
  {
    campgroundName: "Marble Canyon Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "183_274",
      },
    ],
    orcs: 183,
    orcsAreaNumber: "183-1",
  },
  {
    campgroundName: "Martha Creek Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "404_913",
      },
    ],
    orcs: 404,
    orcsAreaNumber: "404-1",
  },
  {
    campgroundName: "McDonald Creek Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "324_363",
      },
    ],
    orcs: 324,
    orcsAreaNumber: "324-1",
  },
  {
    campgroundName: "Mermaid Cove Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "145_277",
      },
    ],
    orcs: 145,
    orcsAreaNumber: "145-1",
  },
  {
    campgroundName: "Meziadin Lake Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "358_278",
      },
    ],
    orcs: 358,
    orcsAreaNumber: "358-1",
  },
  {
    campgroundName: "Middle Copeland Island",
    items: [
      {
        featureName: "All sites",
        featureId: "228_279",
      },
    ],
    orcs: 228,
  },
  {
    campgroundName: "Midge Creek backcountry",
    items: [
      {
        featureName: "All sites",
        featureId: "357_280",
      },
    ],
    orcs: 357,
    orcsAreaNumber: "357-4",
  },
  {
    campgroundName: "Miracle Beach groupsite",
    items: [
      {
        featureName: "All sites",
        featureId: "45_169",
      },
    ],
    orcs: 45,
    orcsAreaNumber: "45-1",
  },
  {
    campgroundName: "Misty Meadows Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "255_286",
      },
    ],
    orcs: 255,
    orcsAreaNumber: "255-2",
  },
  {
    campgroundName: "Misty Meadows Groupsite",
    items: [
      {
        featureName: "All sites",
        featureId: "255_648",
      },
    ],
    orcs: 255,
  },
  {
    campgroundName: "Moberly Lake Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "181_287",
      },
    ],
    orcs: 181,
    orcsAreaNumber: "181-1",
  },
  {
    campgroundName: "Momich River Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "9693_288",
      },
    ],
    orcs: 9693,
    orcsAreaNumber: "9693-1",
  },
  {
    campgroundName: "Monashee Loop sites 1-36",
    items: [
      {
        featureName: "All sites",
        featureId: "241_290",
      },
    ],
    orcs: 241,
    orcsAreaNumber: "241-1",
  },
  {
    campgroundName: "Monashee backcountry",
    items: [
      {
        featureName: "All sites",
        featureId: "143_289",
      },
    ],
    orcs: 143,
    orcsAreaNumber: "143-1",
  },
  {
    campgroundName: "Monck Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "46_291",
      },
    ],
    orcs: 46,
    orcsAreaNumber: "46-1",
  },
  {
    campgroundName: "Monkman Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "315_292",
      },
    ],
    orcs: 315,
    orcsAreaNumber: "315-1",
  },
  {
    campgroundName: "Montague Harbour Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "104_293",
      },
    ],
    orcs: 104,
    orcsAreaNumber: "104-2",
  },
  {
    campgroundName: "Montague Harbour groupsite",
    items: [
      {
        featureName: "All sites",
        featureId: "104_170",
      },
    ],
    orcs: 104,
    orcsAreaNumber: "104-1",
  },
  {
    campgroundName: "Morton Lake Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "190_294",
      },
    ],
    orcs: 190,
    orcsAreaNumber: "190-1",
  },
  {
    campgroundName: "Mount Fernie Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "105_295",
      },
    ],
    orcs: 105,
    orcsAreaNumber: "105-1",
  },
  {
    campgroundName: "Mount Seymour backcountry",
    items: [
      {
        featureName: "All sites",
        featureId: "15_577",
      },
    ],
    orcs: 15,
  },
  {
    campgroundName: "Mount Seymour groupsite",
    items: [
      {
        featureName: "All sites",
        featureId: "15_171",
      },
    ],
    orcs: 15,
    orcsAreaNumber: "15-1",
  },
  {
    campgroundName: "Moyie Lake Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "108_296",
      },
    ],
    orcs: 108,
    orcsAreaNumber: "108-1",
  },
  {
    campgroundName: "Mule Deer Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "33_297",
      },
    ],
    orcs: 33,
    orcsAreaNumber: "33-7",
  },
  {
    campgroundName: "Murtle Lake backcountry",
    items: [
      {
        featureName: "All sites",
        featureId: "24_298",
      },
    ],
    orcs: 24,
  },
  {
    campgroundName: "Mᑫuqᵂin wilderness camping",
    items: [
      {
        featureName: "All sites",
        featureId: "339_540",
      },
    ],
    orcs: 339,
  },
  {
    campgroundName: "Nairn Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "179_299",
      },
    ],
    orcs: 179,
    orcsAreaNumber: "179-1",
  },
  {
    campgroundName: "Naiset Huts",
    items: [
      {
        featureName: "All sites",
        featureId: "5_300",
      },
    ],
    orcs: 5,
  },
  {
    campgroundName: "Nancy Greene Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "232_301",
      },
    ],
    orcs: 232,
    orcsAreaNumber: "232-1",
  },
  {
    campgroundName: "Newcastle Island Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "133_302",
      },
    ],
    orcs: 133,
    orcsAreaNumber: "133-2",
  },
  {
    campgroundName: "Niskonlith Lake Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "275_303",
      },
    ],
    orcs: 275,
    orcsAreaNumber: "275-1",
  },
  {
    campgroundName: "Norbury Lake Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "98_304",
      },
    ],
    orcs: 98,
    orcsAreaNumber: "98-1",
  },
  {
    campgroundName: "North Beach Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "8_305",
      },
    ],
    orcs: 8,
    orcsAreaNumber: "8-7",
  },
  {
    campgroundName: "North Copeland Island",
    items: [
      {
        featureName: "All sites",
        featureId: "228_308",
      },
    ],
    orcs: 228,
    orcsAreaNumber: "228-1",
  },
  {
    campgroundName: "North Thompson River Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "195_309",
      },
    ],
    orcs: 195,
    orcsAreaNumber: "195-1",
  },
  {
    campgroundName: "North Twin Island Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "9509_749",
      },
    ],
    orcs: 9509,
  },
  {
    campgroundName: "Nu Chugh Beniz Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "409_310",
      },
    ],
    orcs: 409,
  },
  {
    campgroundName: "Og Lake",
    items: [
      {
        featureName: "All sites",
        featureId: "5_313",
      },
    ],
    orcs: 5,
    orcsAreaNumber: "5-2",
  },
  {
    campgroundName: "Okanagan Lake South Campground walk-in sites 89-96",
    items: [
      {
        featureName: "All sites",
        featureId: "54_424",
      },
    ],
    orcs: 54,
  },
  {
    campgroundName: "Okanagan wilderness and boat-access camping",
    items: [
      {
        featureName: "All sites",
        featureId: "259_493",
      },
    ],
    orcs: 259,
  },
  {
    campgroundName: "Okeover Arm",
    items: [
      {
        featureName: "All sites",
        featureId: "294_314",
      },
    ],
    orcs: 294,
    orcsAreaNumber: "294-1",
  },
  {
    campgroundName: "Olympic Legacy Cabins",
    items: [
      {
        featureName: "All sites",
        featureId: "314_315",
      },
    ],
    orcs: 314,
  },
  {
    campgroundName: "Osprey Point Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "52_317",
      },
    ],
    orcs: 52,
    orcsAreaNumber: "52-5",
  },
  {
    campgroundName: "Osprey Point Campground G2",
    items: [
      {
        featureName: "All sites",
        featureId: "52_316",
      },
    ],
    orcs: 52,
  },
  {
    campgroundName: "Other E.C. Manning backcountry",
    items: [
      {
        featureName: "All sites",
        featureId: "33_105",
      },
    ],
    orcs: 33,
  },
  {
    campgroundName:
      "Other Mount Robson backcountry (Mount Fitzwilliam and Moose River Trail)",
    items: [
      {
        featureName: "All sites",
        featureId: "2_318",
      },
    ],
    orcs: 2,
  },
  {
    campgroundName: "Otter Lake Campground sites 1-45",
    items: [
      {
        featureName: "All sites",
        featureId: "146_534",
      },
    ],
    orcs: 146,
  },
  {
    campgroundName: "O’Brien Meadows",
    items: [
      {
        featureName: "All sites",
        featureId: "5_311",
      },
    ],
    orcs: 5,
  },
  {
    campgroundName: "O’Brien Meadows Horse Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "5_312",
      },
    ],
    orcs: 5,
  },
  {
    campgroundName: "Paarens Beach Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "234_323",
      },
    ],
    orcs: 234,
    orcsAreaNumber: "234-1",
  },
  {
    campgroundName: "Packrat Point Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "287_324",
      },
    ],
    orcs: 287,
    orcsAreaNumber: "287-4",
  },
  {
    campgroundName: "Paleface Loop",
    items: [
      {
        featureName: "All sites",
        featureId: "258_325",
      },
    ],
    orcs: 258,
    orcsAreaNumber: "258-2",
  },
  {
    campgroundName: "Paradise Meadows area",
    items: [
      {
        featureName: "All sites",
        featureId: "1_503",
      },
    ],
    orcs: 1,
    orcsAreaNumber: "1-6",
  },
  {
    campgroundName: "Paul Lake Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "127_326",
      },
    ],
    orcs: 127,
    orcsAreaNumber: "127-2",
  },
  {
    campgroundName: "Paul Lake groupsite",
    items: [
      {
        featureName: "All sites",
        featureId: "127_327",
      },
    ],
    orcs: 127,
    orcsAreaNumber: "127-1",
  },
  {
    campgroundName: "Pendleton Bay",
    items: [
      {
        featureName: "All sites",
        featureId: "400_830",
      },
    ],
    orcs: 400,
  },
  {
    campgroundName: "Pierre Creek",
    items: [
      {
        featureName: "All sites",
        featureId: "400_833",
      },
    ],
    orcs: 400,
  },
  {
    campgroundName: "Pilot Bay backcountry",
    items: [
      {
        featureName: "All sites",
        featureId: "163_334",
      },
    ],
    orcs: 163,
    orcsAreaNumber: "163-1",
  },
  {
    campgroundName: "Pinkut Creek",
    items: [
      {
        featureName: "All sites",
        featureId: "400_832",
      },
    ],
    orcs: 400,
  },
  {
    campgroundName: "Pirates Cove backcountry",
    items: [
      {
        featureName: "All sites",
        featureId: "198_335",
      },
    ],
    orcs: 198,
    orcsAreaNumber: "198-1",
  },
  {
    campgroundName: "Plumper Cove marine-accessible camping",
    items: [
      {
        featureName: "All sites",
        featureId: "116_473",
      },
    ],
    orcs: 116,
  },
  {
    campgroundName: "Police Meadows Cabin",
    items: [
      {
        featureName: "All sites",
        featureId: "5_339",
      },
    ],
    orcs: 5,
  },
  {
    campgroundName: "Ponderosa Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "235_340",
      },
    ],
    orcs: 235,
    orcsAreaNumber: "235-4",
  },
  {
    campgroundName: "Ponderosa Campground Cabins",
    items: [
      {
        featureName: "All sites",
        featureId: "235_341",
      },
    ],
    orcs: 235,
  },
  {
    campgroundName: "Porcupine Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "5_792",
      },
    ],
    orcs: 5,
  },
  {
    campgroundName: "Porpoise Bay cyclist-only walk-in sites",
    items: [
      {
        featureName: "All sites",
        featureId: "221_85",
      },
    ],
    orcs: 221,
  },
  {
    campgroundName: "Porpoise Bay groupsite",
    items: [
      {
        featureName: "All sites",
        featureId: "221_173",
      },
    ],
    orcs: 221,
    orcsAreaNumber: "221-2",
  },
  {
    campgroundName: "Porteau Cove Campground vehicle accessible sites",
    items: [
      {
        featureName: "All sites",
        featureId: "314_914",
      },
    ],
    orcs: 314,
    orcsAreaNumber: "314-1",
  },
  {
    campgroundName: "Porteau Cove walk-in sites",
    items: [
      {
        featureName: "All sites",
        featureId: "314_476",
      },
    ],
    orcs: 314,
  },
  {
    campgroundName: "Premier Lake Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "25_344",
      },
    ],
    orcs: 25,
    orcsAreaNumber: "25-1",
  },
  {
    campgroundName: "Prospector Groupsite ",
    items: [
      {
        featureName: "All sites",
        featureId: "96_610",
      },
    ],
    orcs: 96,
  },
  {
    campgroundName: "Prudhomme Lake Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "162_346",
      },
    ],
    orcs: 162,
    orcsAreaNumber: "162-1",
  },
  {
    campgroundName: "Purden Lake Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "229_347",
      },
    ],
    orcs: 229,
    orcsAreaNumber: "229-1",
  },
  {
    campgroundName: "Pyramid Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "24_348",
      },
    ],
    orcs: 24,
  },
  {
    campgroundName: "R.C. Hind Hut",
    items: [
      {
        featureName: "All sites",
        featureId: "5_352",
      },
    ],
    orcs: 5,
  },
  {
    campgroundName: "Radium Loop",
    items: [
      {
        featureName: "All sites",
        featureId: "258_353",
      },
    ],
    orcs: 258,
  },
  {
    campgroundName: "Raft Cove backcountry",
    items: [
      {
        featureName: "All sites",
        featureId: "377_354",
      },
    ],
    orcs: 377,
    orcsAreaNumber: "377-1",
  },
  {
    campgroundName: "Ralph River Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "1_355",
      },
    ],
    orcs: 1,
    orcsAreaNumber: "1-5",
  },
  {
    campgroundName: "Rampart Ponds Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "7_356",
      },
    ],
    orcs: 7,
    orcsAreaNumber: "7-6",
  },
  {
    campgroundName: "Rathtrevor Beach groupsites",
    items: [
      {
        featureName: "All sites",
        featureId: "193_182",
      },
    ],
    orcs: 193,
    orcsAreaNumber: "193-2",
  },
  {
    campgroundName: "Rathtrevor Beach walk-in sites",
    items: [
      {
        featureName: "All sites",
        featureId: "193_474",
      },
    ],
    orcs: 193,
  },
  {
    campgroundName: "Raven Lake Cabin",
    items: [
      {
        featureName: "All sites",
        featureId: "9815_357",
      },
    ],
    orcs: 9815,
  },
  {
    campgroundName: "Red Bluff Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "288_358",
      },
    ],
    orcs: 288,
    orcsAreaNumber: "288-2",
  },
  {
    campgroundName: "Red Heather Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "7_360",
      },
    ],
    orcs: 7,
    orcsAreaNumber: "7-7",
  },
  {
    campgroundName: "Redfish Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "52_361",
      },
    ],
    orcs: 52,
    orcsAreaNumber: "52-6",
  },
  {
    campgroundName: "Reinecker Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "276_362",
      },
    ],
    orcs: 276,
    orcsAreaNumber: "276-3",
  },
  {
    campgroundName: "Roberts Creek Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "40_364",
      },
    ],
    orcs: 40,
    orcsAreaNumber: "40-1",
  },
  {
    campgroundName: "Robson Meadows Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "2_365",
      },
    ],
    orcs: 2,
    orcsAreaNumber: "2-3",
  },
  {
    campgroundName: "Robson Meadows groupsite",
    items: [
      {
        featureName: "All sites",
        featureId: "2_366",
      },
    ],
    orcs: 2,
    orcsAreaNumber: "2-4",
  },
  {
    campgroundName: "Rolley Lake Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "122_371",
      },
    ],
    orcs: 122,
    orcsAreaNumber: "122-1",
  },
  {
    campgroundName: "Roscoe Bay",
    items: [
      {
        featureName: "All sites",
        featureId: "373_372",
      },
    ],
    orcs: 373,
    orcsAreaNumber: "373-1",
  },
  {
    campgroundName: "Rosebery Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "110_373",
      },
    ],
    orcs: 110,
    orcsAreaNumber: "110-1",
  },
  {
    campgroundName: "Ross Lake Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "261_374",
      },
    ],
    orcs: 261,
    orcsAreaNumber: "261-2",
  },
  {
    campgroundName: "Ross Lake groupsite",
    items: [
      {
        featureName: "All sites",
        featureId: "261_375",
      },
    ],
    orcs: 261,
    orcsAreaNumber: "261-1",
  },
  {
    campgroundName: "Ruckle Campground RV sites",
    items: [
      {
        featureName: "All sites",
        featureId: "267_379",
      },
    ],
    orcs: 267,
  },
  {
    campgroundName: "Ruckle Campground walk-in sites",
    items: [
      {
        featureName: "All sites",
        featureId: "267_376",
      },
    ],
    orcs: 267,
    orcsAreaNumber: "267-1",
  },
  {
    campgroundName: "Ruckle groupsites",
    items: [
      {
        featureName: "All sites",
        featureId: "267_183",
      },
    ],
    orcs: 267,
    orcsAreaNumber: "267-2",
  },
  {
    campgroundName: "Russet Lake Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "7_377",
      },
    ],
    orcs: 7,
    orcsAreaNumber: "7-8",
  },
  {
    campgroundName: "Sandpoint",
    items: [
      {
        featureName: "All sites",
        featureId: "400_834",
      },
    ],
    orcs: 400,
  },
  {
    campgroundName: "Sarah Point",
    items: [
      {
        featureName: "All sites",
        featureId: "6268_383",
      },
    ],
    orcs: 6268,
  },
  {
    campgroundName: "Schoen Lake Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "283_384",
      },
    ],
    orcs: 283,
    orcsAreaNumber: "283-1",
  },
  {
    campgroundName: "Seeley Lake Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "74_385",
      },
    ],
    orcs: 74,
    orcsAreaNumber: "74-1",
  },
  {
    campgroundName: "Shelter Bay Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "308_386",
      },
    ],
    orcs: 308,
    orcsAreaNumber: "308-1",
  },
  {
    campgroundName: "Shuswap Lake groupsite",
    items: [
      {
        featureName: "All sites",
        featureId: "89_174",
      },
    ],
    orcs: 89,
    orcsAreaNumber: "89-1",
  },
  {
    campgroundName: "Silver Beach Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "212_389",
      },
    ],
    orcs: 212,
    orcsAreaNumber: "212-1",
  },
  {
    campgroundName: "Silver Lake Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "158_390",
      },
    ],
    orcs: 158,
    orcsAreaNumber: "158-1",
  },
  {
    campgroundName: "Silver Spray Cabin",
    items: [
      {
        featureName: "All sites",
        featureId: "4_391",
      },
    ],
    orcs: 4,
  },
  {
    campgroundName: "Singing Creek Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "7_392",
      },
    ],
    orcs: 7,
    orcsAreaNumber: "7-9",
  },
  {
    campgroundName: "Skagit Valley wilderness",
    items: [
      {
        featureName: "All sites",
        featureId: "261_415",
      },
    ],
    orcs: 261,
  },
  {
    campgroundName: "Skihist Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "75_416",
      },
    ],
    orcs: 75,
    orcsAreaNumber: "75-1",
  },
  {
    campgroundName: "Skyview RV Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "33_417",
      },
    ],
    orcs: 33,
  },
  {
    campgroundName: "Smelt Bay Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "243_418",
      },
    ],
    orcs: 243,
    orcsAreaNumber: "243-1",
  },
  {
    campgroundName: "Smithers Landing",
    items: [
      {
        featureName: "All sites",
        featureId: "400_829",
      },
    ],
    orcs: 400,
  },
  {
    campgroundName: "Snowmobile Chalet",
    items: [
      {
        featureName: "All sites",
        featureId: "27_419",
      },
    ],
    orcs: 27,
  },
  {
    campgroundName: "South Curme Island",
    items: [
      {
        featureName: "All sites",
        featureId: "252_425",
      },
    ],
    orcs: 252,
  },
  {
    campgroundName: "Sowchea Bay Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "370_426",
      },
    ],
    orcs: 370,
    orcsAreaNumber: "370-1",
  },
  {
    campgroundName: "Spirea Island",
    items: [
      {
        featureName: "All sites",
        featureId: "251_427",
      },
    ],
    orcs: 251,
    orcsAreaNumber: "251-2",
  },
  {
    campgroundName: "Stamp River Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "31_428",
      },
    ],
    orcs: 31,
    orcsAreaNumber: "31-1",
  },
  {
    campgroundName: "Stawamus Chief drive-in sites",
    items: [
      {
        featureName: "All sites",
        featureId: "6328_102",
      },
    ],
    orcs: 6328,
  },
  {
    campgroundName: "Stawamus Chief walk-in sites",
    items: [
      {
        featureName: "All sites",
        featureId: "6328_475",
      },
    ],
    orcs: 6328,
  },
  {
    campgroundName: "Steelhead Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "408_429",
      },
    ],
    orcs: 408,
    orcsAreaNumber: "408-1",
  },
  {
    campgroundName: "Stemwinder Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "76_916",
      },
    ],
    orcs: 76,
    orcsAreaNumber: "76-1",
  },
  {
    campgroundName: "Stoltz Pool Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "6161_430",
      },
    ],
    orcs: 6161,
    orcsAreaNumber: "6161-3",
  },
  {
    campgroundName: "Stoltz Pool groupsite",
    items: [
      {
        featureName: "All sites",
        featureId: "6161_431",
      },
    ],
    orcs: 6161,
    orcsAreaNumber: "6161-2",
  },
  {
    campgroundName: "Strawberry Flats Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "93_433",
      },
    ],
    orcs: 93,
  },
  {
    campgroundName: "Sturgeon Point groupsite",
    items: [
      {
        featureName: "All sites",
        featureId: "202_436",
      },
    ],
    orcs: 202,
    orcsAreaNumber: "202-3",
  },
  {
    campgroundName: "Summit Lake Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "156_438",
      },
    ],
    orcs: 156,
    orcsAreaNumber: "156-1",
  },
  {
    campgroundName: "Summit Lake Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "94_437",
      },
    ],
    orcs: 94,
    orcsAreaNumber: "94-1",
  },
  {
    campgroundName: "Sunset View Campground sites 1-54",
    items: [
      {
        featureName: "All sites",
        featureId: "273_439",
      },
    ],
    orcs: 273,
    orcsAreaNumber: "273-3",
  },
  {
    campgroundName: "Sunset View groupsite",
    items: [
      {
        featureName: "All sites",
        featureId: "273_441",
      },
    ],
    orcs: 273,
    orcsAreaNumber: "273-4",
  },
  {
    campgroundName: "Sunset View walk-in sites",
    items: [
      {
        featureName: "All sites",
        featureId: "273_442",
      },
    ],
    orcs: 273,
  },
  {
    campgroundName: "Surprise Creek Cabin",
    items: [
      {
        featureName: "All sites",
        featureId: "5_443",
      },
    ],
    orcs: 5,
  },
  {
    campgroundName: "Surveyors Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "235_444",
      },
    ],
    orcs: 235,
    orcsAreaNumber: "235-5",
  },
  {
    campgroundName: "Swan Lake Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "16_445",
      },
    ],
    orcs: 16,
    orcsAreaNumber: "16-1",
  },
  {
    campgroundName: "Taylor Arm groupsites G1-G3",
    items: [
      {
        featureName: "All sites",
        featureId: "296_184",
      },
    ],
    orcs: 296,
    orcsAreaNumber: "296-1",
  },
  {
    campgroundName: "Taylor Creek Loop sites 85-114",
    items: [
      {
        featureName: "All sites",
        featureId: "241_448",
      },
    ],
    orcs: 241,
  },
  {
    campgroundName: "Taylor Meadows Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "7_449",
      },
    ],
    orcs: 7,
    orcsAreaNumber: "7-10",
  },
  {
    campgroundName: "Tenedos Bay",
    items: [
      {
        featureName: "All sites",
        featureId: "252_450",
      },
    ],
    orcs: 252,
  },
  {
    campgroundName: "Top of the World backcountry",
    items: [
      {
        featureName: "All sites",
        featureId: "247_452",
      },
    ],
    orcs: 247,
    orcsAreaNumber: "247-1",
  },
  {
    campgroundName: "Touring Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "136_453",
      },
    ],
    orcs: 136,
  },
  {
    campgroundName: "Trinity Loop sites 37-84",
    items: [
      {
        featureName: "All sites",
        featureId: "241_455",
      },
    ],
    orcs: 241,
  },
  {
    campgroundName: "Trophy Mountain backcountry",
    items: [
      {
        featureName: "All sites",
        featureId: "24_456",
      },
    ],
    orcs: 24,
    orcsAreaNumber: "24-5",
  },
  {
    campgroundName: "Ts'il?os backcountry",
    items: [
      {
        featureName: "All sites",
        featureId: "409_457",
      },
    ],
    orcs: 409,
  },
  {
    campgroundName: "Tudyah Lake Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "317_458",
      },
    ],
    orcs: 317,
  },
  {
    campgroundName: "Tunkwa Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "6878_459",
      },
    ],
    orcs: 6878,
    orcsAreaNumber: "6878-3",
  },
  {
    campgroundName: "Tweedsmuir backcountry",
    items: [
      {
        featureName: "All sites",
        featureId: "19_460",
      },
    ],
    orcs: 19,
    orcsAreaNumber: "19-3",
  },
  {
    campgroundName: "Tyhee Lake Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "84_461",
      },
    ],
    orcs: 84,
    orcsAreaNumber: "84-2",
  },
  {
    campgroundName: "Tyhee Lake groupsite",
    items: [
      {
        featureName: "All sites",
        featureId: "84_175",
      },
    ],
    orcs: 84,
    orcsAreaNumber: "84-1",
  },
  {
    campgroundName: "Vaseux Lake Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "77_464",
      },
    ],
    orcs: 77,
    orcsAreaNumber: "77-1",
  },
  {
    campgroundName: "Vetter Creek Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "386_466",
      },
    ],
    orcs: 386,
    orcsAreaNumber: "386-1",
  },
  {
    campgroundName: "Wallace Island backcountry",
    items: [
      {
        featureName: "All sites",
        featureId: "382_477",
      },
    ],
    orcs: 382,
    orcsAreaNumber: "382-1",
  },
  {
    campgroundName: "War Lake Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "251_479",
      },
    ],
    orcs: 251,
  },
  {
    campgroundName: "Wasa Lake Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "53_480",
      },
    ],
    orcs: 53,
    orcsAreaNumber: "53-1",
  },
  {
    campgroundName: "Wedgemount Lake Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "7_482",
      },
    ],
    orcs: 7,
    orcsAreaNumber: "7-11",
  },
  {
    campgroundName: "West Curme Island",
    items: [
      {
        featureName: "All sites",
        featureId: "252_483",
      },
    ],
    orcs: 252,
  },
  {
    campgroundName: "Whiskers Point Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "78_486",
      },
    ],
    orcs: 78,
    orcsAreaNumber: "78-1",
  },
  {
    campgroundName: "White Lake Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "167_487",
      },
    ],
    orcs: 167,
    orcsAreaNumber: "167-1",
  },
  {
    campgroundName: "White River Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "287_488",
      },
    ],
    orcs: 287,
    orcsAreaNumber: "287-5",
  },
  {
    campgroundName: "Whitworth Horse Camp",
    items: [
      {
        featureName: "All sites",
        featureId: "261_491",
      },
    ],
    orcs: 261,
  },
  {
    campgroundName: "Widgeon Creek Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "9508_751",
      },
    ],
    orcs: 9508,
  },
  {
    campgroundName: "Wilderness Camping Area",
    items: [
      {
        featureName: "All sites",
        featureId: "7_492",
      },
    ],
    orcs: 7,
    orcsAreaNumber: "7-4",
  },
  {
    campgroundName: "Woodbury Cabin",
    items: [
      {
        featureName: "All sites",
        featureId: "4_494",
      },
    ],
    orcs: 4,
  },
  {
    campgroundName: "Woodlands groupsite",
    items: [
      {
        featureName: "All sites",
        featureId: "8_613",
      },
    ],
    orcs: 8,
  },
  {
    campgroundName: "Yahk Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "79_495",
      },
    ],
    orcs: 79,
    orcsAreaNumber: "79-1",
  },
  {
    campgroundName: "sx̌ʷəx̌ʷnitkʷ Campground",
    items: [
      {
        featureName: "All sites",
        featureId: "73_446",
      },
    ],
    orcs: 73,
    orcsAreaNumber: "73-1",
  },
];

// Helper function to find a parkArea by its orcsAreaNumber
async function findAreaByOrcsAreaNumber(orcsAreaNumber) {
  const areas = await strapi.entityService.findMany(
    "api::park-area.park-area",
    {
      filters: { orcsAreaNumber: orcsAreaNumber },
    }
  );
  return areas.length > 0 ? areas[0] : null;
}

module.exports = {
  async up(knex) {
    if (await knex.schema.hasTable("park_features")) {
      // Get all the records from park-feature-types and put them into a map by name
      const featureTypes = await strapi.entityService.findMany(
        "api::park-feature-type.park-feature-type",
        {
          fields: ["id", "parkFeatureType"],
        }
      );
      const featureTypeMap = new Map(
        featureTypes.map((type) => [type.parkFeatureType, type.id])
      );

      // Fetch all records from park-operation-sub-area
      // Order by protectedArea.orcs and then by parkSubArea
      const parkSubAreas = (
        await strapi.entityService.findMany(
          "api::park-operation-sub-area.park-operation-sub-area",
          {
            populate: {
              protectedArea: true,
              parkSubAreaType: true,
              site: true,
            },
          }
        )
      ).sort((a, b) => {
        const orcsA = Number(a.protectedArea?.orcs) || 0;
        const orcsB = Number(b.protectedArea?.orcs) || 0;
        if (orcsA !== orcsB) return orcsA - orcsB;
        return (a.parkSubArea || "").localeCompare(b.parkSubArea || "");
      });

      // List of fields shared between park-operation-sub-area and park-feature
      // We will use this list to copy values from park-operation-sub-area to
      // park-feature. These are specifically fields that have no special business
      // rules for copying, and are simple fields (not relations)
      const sharedFields = [
        "adminNote",
        "backcountrySites",
        "boatAccessSites",
        "boatLaunches",
        "cabins",
        "closureAffectsAccessStatus",
        "doubleSites",
        "electrifiedSites",
        "frontcountrySites",
        "groupSite",
        "groupSitesReservable",
        "hasBackcountryGroupReservations",
        "hasBackcountryPermits",
        "hasBackcountryReservations",
        "hasBackcountryShelterReservations",
        "hasBackcountryWildernessReservations",
        "hasCanoeCircuitReservations",
        "hasFirstComeFirstServed",
        "hasFrontcountryCabinReservations",
        "hasFrontcountryGroupReservations",
        "hasFrontcountryReservations",
        "hasGroupPicnicReservations",
        "hasReservations",
        "hasWinterFee",
        "horseSites",
        "huts",
        "inReservationSystem",
        "isActive",
        "isCleanAirSite",
        "isOpen",
        "longStaySites",
        "nonReservableSites",
        "offSeasonNote",
        "offSeasonUse",
        "operationNote",
        "parkAccessUnitId",
        "pullThroughSites",
        "registrationNote",
        "reservationNote",
        "reservableSites",
        "rvSites",
        "rvSitesReservable",
        "shelters",
        "totalCapacity",
        "vehicleSites",
        "vehicleSitesReservable",
        "walkInSites",
        "walkInSitesReservable",
        "wildernessSites",
        "yurts",
      ];

      // These variables are for tracking the index used for orcsFeatureNumber.
      // This logic is also tied to the sort order for parkSubAreas above.
      let previousProtectedAreaId = null;
      let counter = 1;

      // For each parkSubArea, create a new record in park-features
      for (const record of parkSubAreas) {
        // Copy all the simple fields without special business rules from park-operation-sub-area
        // to park-feature
        const sharedData = Object.fromEntries(
          sharedFields
            .filter((field) => record[field] !== undefined)
            .map((field) => [field, record[field]])
        );

        let parkArea = undefined;

        // This is the fallback for cases when no mapping is found in the arrays above
        // and not parkArea is being linked to the new parkFeature record.
        let featureName = record.parkSubArea;

        // Check if record.featureId matches a featureId value in multiItemAreas
        const multiItemArea = multiItemAreas.find(
          (area) =>
            area.orcs === record.protectedArea?.orcs &&
            area.items.some((item) => item.featureId === record.featureId)
        );

        if (multiItemArea) {
          // get the orcsAreaNumber for the matching item
          const orcsAreaNumber = multiItemArea.orcsAreaNumber;
          if (orcsAreaNumber) {
            // get the record for park-area that matches the orcsAreaNumber
            parkArea = await findAreaByOrcsAreaNumber(orcsAreaNumber);

            // get the newName for the matching item
            featureName = multiItemArea.items.find(
              (item) => item.featureId === record.featureId
            )?.newName;
          }
        } else {
          // Check if record.featureId matches a featureId value in singleItemAreas
          const singleItemArea = singleItemAreas.find(
            (area) =>
              area.orcs === record.protectedArea?.orcs &&
              area.items.some((item) => item.featureId === record.featureId)
          );

          if (singleItemArea) {
            // get the orcsAreaNumber for the matching item
            const orcsAreaNumber = singleItemArea.orcsAreaNumber;
            if (orcsAreaNumber) {
              // get the record for park-area that matches the orcsAreaNumber
              parkArea = await findAreaByOrcsAreaNumber(orcsAreaNumber);

              // this is a special name used for single feature campgrounds
              featureName = "All sites";
            }
          }
        }

        // get a list of all parkOperationSubAreas and populate the parkSubAreaType
        const parkOperationSubAreas = await strapi.entityService.findMany(
          "api::park-operation-sub-area.park-operation-sub-area",
          {
            filters: {
              protectedArea: record.protectedArea.id,
            },
            populate: { parkSubAreaType: true },
          }
        );

        // Logic for orcsFeatureNumber. We will end up with slightly different values
        // on different environments, but eventually everything will be restored
        // with copies of the production database.
        if (record.protectedArea.id !== previousProtectedAreaId) {
          counter = 1;
        } else {
          counter++;
        }
        previousProtectedAreaId = record.protectedArea.id;

        // combine the sharedData with fields that have relationships and special business rules
        // to create the final data for the new park-feature record
        const parkFeatureData = {
          ...sharedData,
          parkFeature: featureName,
          publishedAt: new Date().toISOString(),
          featureId:
            record.featureId ?? `${record.protectedArea.orcs}_${record.id}`,
          orcsFeatureNumber: `${record.protectedArea.orcs}-${counter}`,
          protectedArea: record.protectedArea
            ? { connect: [{ id: record.protectedArea.id }] }
            : undefined,
          site: record.site ? { connect: [{ id: record.site.id }] } : undefined,
          parkArea: parkArea ? { connect: [{ id: parkArea.id }] } : undefined,
          parkFeatureType: record.parkSubAreaType
            ? {
                connect: [
                  {
                    id: featureTypeMap.get(record.parkSubAreaType.subAreaType),
                  },
                ],
              }
            : undefined,
        };

        // Create the new park-feature record
        await strapi.entityService.create("api::park-feature.park-feature", {
          data: parkFeatureData,
        });
      }
    }
  },
};
