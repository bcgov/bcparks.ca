'use strict'

const rows = [
  {
    "id": 1,
    "city_name": "100 Mile House",
    "latitude": 51.6439705,
    "longitude": -121.2950097,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 2,
    "city_name": "105 Mile House",
    "latitude": 51.7,
    "longitude": -121.316667,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 3,
    "city_name": "108 Mile Ranch",
    "latitude": 51.750319,
    "longitude": -121.3454781,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 3
  },
  {
    "id": 4,
    "city_name": "111 Mile House",
    "latitude": 51.7747839,
    "longitude": -121.391316,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 5,
    "city_name": "114 Mile House",
    "latitude": 51.804034,
    "longitude": -121.433165,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 6,
    "city_name": "122 Mile House",
    "latitude": 51.850005,
    "longitude": -121.586053,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 7,
    "city_name": "127 Mile House",
    "latitude": 51.884755,
    "longitude": -121.673016,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 8,
    "city_name": "141 Mile House",
    "latitude": 52.006773,
    "longitude": -121.863141,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 9,
    "city_name": "150 Mile House",
    "latitude": 52.104057,
    "longitude": -121.928257,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 10,
    "city_name": "40 Mile Flats",
    "latitude": 57.9375,
    "longitude": -130.033333,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 11,
    "city_name": "70 Mile House",
    "latitude": 51.303136,
    "longitude": -121.3957691,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 12,
    "city_name": "93 Mile House",
    "latitude": 51.566667,
    "longitude": -121.3333329,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 13,
    "city_name": "Abbotsford",
    "latitude": 49.0504377,
    "longitude": -122.3044697,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 1
  },
  {
    "id": 14,
    "city_name": "Abbott Heights",
    "latitude": 52.9747343,
    "longitude": -122.526817,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 15,
    "city_name": "Adams Lake",
    "latitude": 51.1746684,
    "longitude": -119.5707686,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 16,
    "city_name": "Agassiz",
    "latitude": 49.2389409,
    "longitude": -121.7658827,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 17,
    "city_name": "Agate",
    "latitude": 50.270852,
    "longitude": -121.1277779,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 18,
    "city_name": "Ahbau",
    "latitude": 53.2983792,
    "longitude": -122.0893296,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 19,
    "city_name": "Ahousat",
    "latitude": 49.2761659,
    "longitude": -126.0563673,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 20,
    "city_name": "Ainsworth",
    "latitude": 49.733978,
    "longitude": -116.91023,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 21,
    "city_name": "Ainsworth Hot Springs",
    "latitude": 49.733978,
    "longitude": -116.91023,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 22,
    "city_name": "Aiyansh",
    "latitude": 55.20578,
    "longitude": -129.07833,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 23,
    "city_name": "Akiskinook",
    "latitude": 50.4733635,
    "longitude": -115.9889748,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 24,
    "city_name": "Alamo",
    "latitude": 49.2877251,
    "longitude": -123.1139605,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 25,
    "city_name": "Albas",
    "latitude": 51.2,
    "longitude": -119.016667,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 26,
    "city_name": "Alberni",
    "latitude": 49.2655249,
    "longitude": -124.813532,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 27,
    "city_name": "Albert Canyon",
    "latitude": 51.1362,
    "longitude": -117.8573,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 28,
    "city_name": "Albert Head",
    "latitude": 48.388162,
    "longitude": -123.505321,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 29,
    "city_name": "Albion",
    "latitude": 49.183295,
    "longitude": -122.556863,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 30,
    "city_name": "Albreda",
    "latitude": 52.6572513,
    "longitude": -119.1943113,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 31,
    "city_name": "Aldergrove",
    "latitude": 49.0580516,
    "longitude": -122.4706669,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 3
  },
  {
    "id": 32,
    "city_name": "Alert Bay",
    "latitude": 50.5844855,
    "longitude": -126.9254094,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 33,
    "city_name": "Alexandria",
    "latitude": 52.6332629,
    "longitude": -122.4523446,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 34,
    "city_name": "Alexis Creek",
    "latitude": 52.082986,
    "longitude": -123.277992,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 35,
    "city_name": "Aleza Lake",
    "latitude": 54.116667,
    "longitude": -122.033333,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 36,
    "city_name": "Alice Arm",
    "latitude": 55.482822,
    "longitude": -129.4899691,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 37,
    "city_name": "Alice Siding",
    "latitude": 49.120654,
    "longitude": -116.523693,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 38,
    "city_name": "Alkali Lake",
    "latitude": 51.788563,
    "longitude": -122.2283371,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 39,
    "city_name": "Allenby",
    "latitude": 49.4166669,
    "longitude": -120.516667,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 40,
    "city_name": "Alliford Bay",
    "latitude": 53.2,
    "longitude": -131.9833329,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 41,
    "city_name": "Allison Lake",
    "latitude": 49.68914,
    "longitude": -120.602292,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 42,
    "city_name": "Almond Gardens",
    "latitude": 49.016024,
    "longitude": -118.498443,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 43,
    "city_name": "Alpine Meadows",
    "latitude": 50.145516,
    "longitude": -122.965375,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 44,
    "city_name": "Alta Lake",
    "latitude": 50.1167848,
    "longitude": -122.9815293,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 45,
    "city_name": "Altona",
    "latitude": 56.877725,
    "longitude": -120.954506,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 46,
    "city_name": "Alvin",
    "latitude": 49.60741,
    "longitude": -122.633752,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 47,
    "city_name": "Ambleside",
    "latitude": 49.3282979,
    "longitude": -123.156729,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 48,
    "city_name": "Amsbury",
    "latitude": 51.1679201,
    "longitude": -1.7629783,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 49,
    "city_name": "Anaconda",
    "latitude": 49.0786159,
    "longitude": -118.684499,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 50,
    "city_name": "Anahim Lake",
    "latitude": 52.466667,
    "longitude": -125.316667,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 51,
    "city_name": "Anderson",
    "latitude": 50.635632,
    "longitude": -122.4127528,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 52,
    "city_name": "Anderson Subdivision",
    "latitude": 50.635632,
    "longitude": -122.4127528,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 53,
    "city_name": "Andimaul",
    "latitude": 55.0875897,
    "longitude": -127.8317772,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 54,
    "city_name": "Anglemont",
    "latitude": 50.964704,
    "longitude": -119.163761,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 55,
    "city_name": "Angusmac",
    "latitude": 53.7266683,
    "longitude": -127.6476205,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 56,
    "city_name": "Anmore",
    "latitude": 49.314625,
    "longitude": -122.8556687,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 57,
    "city_name": "Anniedale",
    "latitude": 49.172719,
    "longitude": -122.7238031,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 58,
    "city_name": "Anvil Island",
    "latitude": 49.5142739,
    "longitude": -123.3054159,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 59,
    "city_name": "Anyox",
    "latitude": 55.415909,
    "longitude": -129.8296048,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 60,
    "city_name": "Anzac",
    "latitude": 54.766667,
    "longitude": -122.5,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 61,
    "city_name": "Appledale",
    "latitude": 49.642901,
    "longitude": -117.5314539,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 62,
    "city_name": "Applegrove",
    "latitude": 49.790308,
    "longitude": -118.078544,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 63,
    "city_name": "Arbutus",
    "latitude": 48.6925481,
    "longitude": -123.5399202,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 64,
    "city_name": "Arbutus Ridge",
    "latitude": 49.253611,
    "longitude": -123.1604311,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 65,
    "city_name": "Arden Park",
    "latitude": 53.7266683,
    "longitude": -127.6476205,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 66,
    "city_name": "Ardmore",
    "latitude": 48.638881,
    "longitude": -123.463841,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 67,
    "city_name": "Argenta",
    "latitude": 50.160737,
    "longitude": -116.917903,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 68,
    "city_name": "Armstrong",
    "latitude": 50.4476983,
    "longitude": -119.1969938,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 69,
    "city_name": "Arnold",
    "latitude": 49.007829,
    "longitude": -122.1505341,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 70,
    "city_name": "Arras",
    "latitude": 55.754089,
    "longitude": -120.524384,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 71,
    "city_name": "Arrow Creek",
    "latitude": 49.133657,
    "longitude": -116.446142,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 72,
    "city_name": "Arrow Park",
    "latitude": 50.116667,
    "longitude": -117.9,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 73,
    "city_name": "Arrowhead",
    "latitude": 50.711111,
    "longitude": -117.920833,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 74,
    "city_name": "Arrowsmith",
    "latitude": 49.2184021,
    "longitude": -124.542808,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 75,
    "city_name": "Arrowview Heights",
    "latitude": 49.242122,
    "longitude": -124.768975,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 76,
    "city_name": "Ashcroft",
    "latitude": 50.7259246,
    "longitude": -121.2804736,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 77,
    "city_name": "Ashton Creek",
    "latitude": 50.555859,
    "longitude": -119.014228,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 78,
    "city_name": "Aspen Grove",
    "latitude": 49.930292,
    "longitude": -120.629654,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 79,
    "city_name": "Atchelitz",
    "latitude": 49.118362,
    "longitude": -122.006722,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 80,
    "city_name": "Athalmer",
    "latitude": 50.517378,
    "longitude": -116.036891,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 81,
    "city_name": "Atlin",
    "latitude": 59.578028,
    "longitude": -133.689524,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 82,
    "city_name": "Atluck",
    "latitude": 50.190389,
    "longitude": -126.998979,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 83,
    "city_name": "Atnarko",
    "latitude": 52.4,
    "longitude": -125.8333331,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 84,
    "city_name": "Attachie",
    "latitude": 56.218805,
    "longitude": -121.4332079,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 85,
    "city_name": "Austin Heights",
    "latitude": 49.250627,
    "longitude": -122.869158,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 86,
    "city_name": "Australian",
    "latitude": 52.733333,
    "longitude": -122.45,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 87,
    "city_name": "Avola",
    "latitude": 51.785209,
    "longitude": -119.3231009,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 88,
    "city_name": "Azouzetta",
    "latitude": 55.387537,
    "longitude": -122.6125555,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 89,
    "city_name": "Baker",
    "latitude": 49.5010369,
    "longitude": -115.584682,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 90,
    "city_name": "Baker Creek",
    "latitude": 52.928741,
    "longitude": -122.996474,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 91,
    "city_name": "Baldonnel",
    "latitude": 56.217228,
    "longitude": -120.6892861,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 92,
    "city_name": "Baldy Hughes",
    "latitude": 53.6164315,
    "longitude": -122.9372276,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 93,
    "city_name": "Balfour",
    "latitude": 49.62475,
    "longitude": -116.9628789,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 94,
    "city_name": "Balmoral",
    "latitude": 50.852507,
    "longitude": -119.354498,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 95,
    "city_name": "Balmoral Beach",
    "latitude": 49.669778,
    "longitude": -124.9023869,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 96,
    "city_name": "Bamberton",
    "latitude": 48.5947109,
    "longitude": -123.527613,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 97,
    "city_name": "Bamfield",
    "latitude": 48.8332891,
    "longitude": -125.142835,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 98,
    "city_name": "Bankeir",
    "latitude": 49.715573,
    "longitude": -120.2333971,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 99,
    "city_name": "Banks Island",
    "latitude": 53.4535898,
    "longitude": -130.1498672,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 100,
    "city_name": "Bargain Harbour",
    "latitude": 49.6090737,
    "longitude": -124.0253624,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 101,
    "city_name": "Bargain Harbour Sechelt Band 24",
    "latitude": 49.6057058,
    "longitude": -124.0215577,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 102,
    "city_name": "Barkerville",
    "latitude": 53.0703513,
    "longitude": -121.5137657,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 103,
    "city_name": "Barlow",
    "latitude": 51.705,
    "longitude": -116.8116665,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 104,
    "city_name": "Barlow Creek",
    "latitude": 53.023183,
    "longitude": -122.446553,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 105,
    "city_name": "Barnet",
    "latitude": 49.3,
    "longitude": -122.916667,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 106,
    "city_name": "Barnhartvale",
    "latitude": 50.6341279,
    "longitude": -120.12526,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 107,
    "city_name": "Barrett Lake",
    "latitude": 54.448508,
    "longitude": -126.748464,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 108,
    "city_name": "Barriere",
    "latitude": 51.1824784,
    "longitude": -120.1237108,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 109,
    "city_name": "Barrowtown",
    "latitude": 49.104066,
    "longitude": -122.0951591,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 110,
    "city_name": "Basford",
    "latitude": 49.2689631,
    "longitude": -123.1321174,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 111,
    "city_name": "Basque",
    "latitude": 49.2301229,
    "longitude": -122.9860767,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 112,
    "city_name": "Bastion Bay",
    "latitude": 50.85,
    "longitude": -119.083333,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 113,
    "city_name": "Batchelor Hills",
    "latitude": 50.715511,
    "longitude": -120.368306,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 114,
    "city_name": "Bates Beach",
    "latitude": 49.7751388,
    "longitude": -124.9759085,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 115,
    "city_name": "Baynes Lake",
    "latitude": 49.233482,
    "longitude": -115.21559,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 116,
    "city_name": "Beach Grove",
    "latitude": 49.0319239,
    "longitude": -123.055374,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 117,
    "city_name": "Beachcomber",
    "latitude": 49.3193375,
    "longitude": -124.3136411,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 118,
    "city_name": "Beachcomber Bay",
    "latitude": 50.2459879,
    "longitude": -119.3770421,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 119,
    "city_name": "Bealby Point",
    "latitude": 49.5176731,
    "longitude": -117.2606983,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 120,
    "city_name": "Bear Camp",
    "latitude": 59.92414,
    "longitude": -136.796737,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 121,
    "city_name": "Bear Creek",
    "latitude": 49.528477,
    "longitude": -121.759864,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 122,
    "city_name": "Bear Flat",
    "latitude": 56.272643,
    "longitude": -121.226963,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 123,
    "city_name": "Bear Lake",
    "latitude": 54.492974,
    "longitude": -122.68306,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 124,
    "city_name": "Beard's Creek",
    "latitude": 55.7596274,
    "longitude": -120.2376623,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 125,
    "city_name": "Beasley",
    "latitude": 49.484768,
    "longitude": -117.458968,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 126,
    "city_name": "Beaton",
    "latitude": 50.735739,
    "longitude": -117.731234,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 127,
    "city_name": "Beatton",
    "latitude": 56.7663396,
    "longitude": -120.8594597,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 128,
    "city_name": "Beatton Ranch",
    "latitude": 56.730591,
    "longitude": -122.5754421,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 129,
    "city_name": "Beaver Cove",
    "latitude": 50.535164,
    "longitude": -126.857835,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 130,
    "city_name": "Beaver Creek",
    "latitude": 49.316623,
    "longitude": -124.900347,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 131,
    "city_name": "Beaver Falls",
    "latitude": 49.079524,
    "longitude": -117.593283,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 132,
    "city_name": "Beaver Lake",
    "latitude": 48.50885,
    "longitude": -123.410607,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 133,
    "city_name": "Beaver Pass House",
    "latitude": 53.079287,
    "longitude": -121.851896,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 134,
    "city_name": "Beaver Point",
    "latitude": 48.768003,
    "longitude": -123.387322,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 135,
    "city_name": "Beaverdell",
    "latitude": 49.434206,
    "longitude": -119.088297,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 136,
    "city_name": "Beaverley",
    "latitude": 53.80926,
    "longitude": -122.881547,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 137,
    "city_name": "Beavermouth",
    "latitude": 52.7263612,
    "longitude": -122.1233689,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 138,
    "city_name": "Becher Bay 2",
    "latitude": 48.3230265,
    "longitude": -123.5927638,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 139,
    "city_name": "Becher House",
    "latitude": 51.95,
    "longitude": -122.5166671,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 140,
    "city_name": "Bedwell Harbour",
    "latitude": 48.745399,
    "longitude": -123.2232071,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 141,
    "city_name": "Belcarra",
    "latitude": 49.3148023,
    "longitude": -122.9255129,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 142,
    "city_name": "Belford",
    "latitude": 49.2887544,
    "longitude": -123.1215934,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 143,
    "city_name": "Bell II",
    "latitude": 56.744444,
    "longitude": -129.794444,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 144,
    "city_name": "Bella Bella",
    "latitude": 52.1605419,
    "longitude": -128.1455793,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 145,
    "city_name": "Bella Coola",
    "latitude": 52.3721277,
    "longitude": -126.7539346,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 146,
    "city_name": "Belleview",
    "latitude": 49.264127,
    "longitude": -123.213345,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 147,
    "city_name": "Bellos",
    "latitude": 49.2564477,
    "longitude": -123.1015629,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 148,
    "city_name": "Belmont Park",
    "latitude": 48.440677,
    "longitude": -123.466617,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 149,
    "city_name": "Belvedere",
    "latitude": 49.2402182,
    "longitude": -122.8782593,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 150,
    "city_name": "Bend",
    "latitude": 53.76432,
    "longitude": -121.058998,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 151,
    "city_name": "Benledi",
    "latitude": 53.7266683,
    "longitude": -127.6476205,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 152,
    "city_name": "Ben-My-Chree",
    "latitude": 59.415951,
    "longitude": -134.4640049,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 153,
    "city_name": "Bennett",
    "latitude": 59.845821,
    "longitude": -134.9928641,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 154,
    "city_name": "Benson Lake",
    "latitude": 50.366667,
    "longitude": -127.233333,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 155,
    "city_name": "Benvoulin",
    "latitude": 49.8635146,
    "longitude": -119.4535877,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 156,
    "city_name": "Beresford",
    "latitude": 50.590607,
    "longitude": -120.253378,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 157,
    "city_name": "Bergs",
    "latitude": 53.144003,
    "longitude": -119.1590527,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 158,
    "city_name": "Beryl Prairie",
    "latitude": 56.084366,
    "longitude": -122.043512,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 159,
    "city_name": "Bessborough",
    "latitude": 55.816667,
    "longitude": -120.5,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 160,
    "city_name": "Bestwick",
    "latitude": 50.565798,
    "longitude": -120.0822091,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 161,
    "city_name": "Bevan",
    "latitude": 49.658564,
    "longitude": -125.089017,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 162,
    "city_name": "Big Bar",
    "latitude": 51.3093492,
    "longitude": -121.7937254,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 163,
    "city_name": "Big Bar Creek",
    "latitude": 51.177983,
    "longitude": -122.077913,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 164,
    "city_name": "Big Bay",
    "latitude": 50.4,
    "longitude": -125.1333329,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 165,
    "city_name": "Big Creek",
    "latitude": 51.716667,
    "longitude": -123.0333331,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 166,
    "city_name": "Big Eddy",
    "latitude": 50.997749,
    "longitude": -118.224907,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 167,
    "city_name": "Big Lake",
    "latitude": 52.3821433,
    "longitude": -121.8381634,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 168,
    "city_name": "Big Lake Ranch",
    "latitude": 52.4166669,
    "longitude": -121.85,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 169,
    "city_name": "Big White Village",
    "latitude": 49.721617,
    "longitude": -118.926575,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 170,
    "city_name": "Billings",
    "latitude": 49.01767,
    "longitude": -118.2281879,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 171,
    "city_name": "Billings Bay",
    "latitude": 49.701459,
    "longitude": -124.1900441,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 172,
    "city_name": "Birch Island",
    "latitude": 51.592765,
    "longitude": -119.894231,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 173,
    "city_name": "Birchbank",
    "latitude": 49.162202,
    "longitude": -117.73158,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 174,
    "city_name": "Birchdale",
    "latitude": 50.035756,
    "longitude": -116.875443,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 175,
    "city_name": "Birchland Manor",
    "latitude": 49.271246,
    "longitude": -122.749135,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 176,
    "city_name": "Birken",
    "latitude": 50.479891,
    "longitude": -122.622092,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 177,
    "city_name": "Black Pines",
    "latitude": 50.9334909,
    "longitude": -120.257842,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 178,
    "city_name": "Blackloam",
    "latitude": 50.649736,
    "longitude": -120.2761459,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 179,
    "city_name": "Blackpool",
    "latitude": 51.6092665,
    "longitude": -120.1101387,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 180,
    "city_name": "Blackstock Subdivision",
    "latitude": 51.6334887,
    "longitude": -121.283977,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 181,
    "city_name": "Blackwater",
    "latitude": 53.283333,
    "longitude": -123.1333331,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 182,
    "city_name": "Blaeberry",
    "latitude": 51.435711,
    "longitude": -117.0680761,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 183,
    "city_name": "Blake",
    "latitude": 49.2862797,
    "longitude": -123.1198975,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 184,
    "city_name": "Blakeburn",
    "latitude": 49.507882,
    "longitude": -120.693448,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 185,
    "city_name": "Blewett",
    "latitude": 49.476405,
    "longitude": -117.4053991,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 186,
    "city_name": "Bligh Island",
    "latitude": 49.6585977,
    "longitude": -126.522439,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 187,
    "city_name": "Blind Bay",
    "latitude": 50.886273,
    "longitude": -119.397706,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 188,
    "city_name": "Blind Channel",
    "latitude": 50.412877,
    "longitude": -125.503265,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 189,
    "city_name": "Bliss Landing",
    "latitude": 50.03571,
    "longitude": -124.815285,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 190,
    "city_name": "Bloedel",
    "latitude": 50.119655,
    "longitude": -125.386921,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 191,
    "city_name": "Blowhole",
    "latitude": 49.829293,
    "longitude": -126.6781352,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 192,
    "city_name": "Blubber Bay",
    "latitude": 49.794706,
    "longitude": -124.6232971,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 193,
    "city_name": "Blucher Hall",
    "latitude": 51.1,
    "longitude": -120.016667,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 194,
    "city_name": "Blue Hills",
    "latitude": 50.102589,
    "longitude": -117.48477,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 195,
    "city_name": "Blue River",
    "latitude": 52.1064649,
    "longitude": -119.3048807,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 196,
    "city_name": "Blue Springs",
    "latitude": 50.25,
    "longitude": -118.8500001,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 197,
    "city_name": "Blueberry Creek",
    "latitude": 49.24665,
    "longitude": -117.6580889,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 198,
    "city_name": "Blueberry Farm",
    "latitude": 49.2307491,
    "longitude": -122.7447856,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 199,
    "city_name": "Blueridge",
    "latitude": 49.328116,
    "longitude": -122.996359,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 200,
    "city_name": "Blunden Harbour",
    "latitude": 50.9114125,
    "longitude": -127.2900832,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 201,
    "city_name": "Boat Basin",
    "latitude": 49.4791669,
    "longitude": -126.425,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 202,
    "city_name": "Boat Harbour",
    "latitude": 49.0910212,
    "longitude": -123.7983535,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 203,
    "city_name": "Bob Quinn Lake",
    "latitude": 56.972222,
    "longitude": -130.247222,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 204,
    "city_name": "Bold Point",
    "latitude": 50.172061,
    "longitude": -125.160964,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 205,
    "city_name": "Bond",
    "latitude": 55.83173,
    "longitude": -121.428802,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 206,
    "city_name": "Bonnet Hill",
    "latitude": 53.898515,
    "longitude": -122.6165809,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 207,
    "city_name": "Bonnington Falls",
    "latitude": 49.463164,
    "longitude": -117.497793,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 208,
    "city_name": "Boothroyd (Part) 8A",
    "latitude": 49.965278,
    "longitude": -121.4833329,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 209,
    "city_name": "Boston Bar",
    "latitude": 49.8634258,
    "longitude": -121.4425737,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 210,
    "city_name": "Boston Flats",
    "latitude": 50.772916,
    "longitude": -121.310398,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 211,
    "city_name": "Boswell",
    "latitude": 49.453918,
    "longitude": -116.762954,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 212,
    "city_name": "Bouchie Lake",
    "latitude": 53.021917,
    "longitude": -122.604882,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 213,
    "city_name": "Boulder",
    "latitude": 58.39796,
    "longitude": -129.00414,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 214,
    "city_name": "Boulder City",
    "latitude": 58.39796,
    "longitude": -129.00414,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 215,
    "city_name": "Boulder Island Sechelt Band 25",
    "latitude": 49.47386,
    "longitude": -123.749355,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 216,
    "city_name": "Boundary Bay",
    "latitude": 49.004716,
    "longitude": -123.036412,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 217,
    "city_name": "Boundary Falls",
    "latitude": 49.0493,
    "longitude": -118.692911,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 218,
    "city_name": "Bowen Island",
    "latitude": 49.3767653,
    "longitude": -123.370154,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 219,
    "city_name": "Bowser",
    "latitude": 49.4389905,
    "longitude": -124.6835177,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 220,
    "city_name": "Box Lake",
    "latitude": 50.2111213,
    "longitude": -117.7192458,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 221,
    "city_name": "Brackendale",
    "latitude": 49.7660145,
    "longitude": -123.1491278,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 222,
    "city_name": "Bradner",
    "latitude": 49.1010099,
    "longitude": -122.4265253,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 223,
    "city_name": "Braeloch",
    "latitude": 49.801471,
    "longitude": -119.5176379,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 224,
    "city_name": "Braemar Heights",
    "latitude": 48.426094,
    "longitude": -123.513024,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 225,
    "city_name": "Braeside",
    "latitude": 54.083333,
    "longitude": -124.25,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 226,
    "city_name": "Bralorne",
    "latitude": 50.77049,
    "longitude": -122.802284,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 227,
    "city_name": "Brandon",
    "latitude": 49.767161,
    "longitude": -117.4646421,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 228,
    "city_name": "Brandywine",
    "latitude": 50.1147222,
    "longitude": -123.2211111,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 229,
    "city_name": "Brauns Island",
    "latitude": 54.5063588,
    "longitude": -128.626818,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 230,
    "city_name": "Brem River",
    "latitude": 50.4384299,
    "longitude": -124.663664,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 231,
    "city_name": "Brennan Creek",
    "latitude": 51.1690901,
    "longitude": -119.6051673,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 232,
    "city_name": "Brentwood Bay",
    "latitude": 48.5724366,
    "longitude": -123.4517571,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 233,
    "city_name": "Brew Bay",
    "latitude": 49.776577,
    "longitude": -124.374728,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 234,
    "city_name": "Brexton",
    "latitude": 50.8356525,
    "longitude": -122.8243267,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 235,
    "city_name": "Briar Ridge",
    "latitude": 55.781299,
    "longitude": -120.043327,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 236,
    "city_name": "Bridal Falls",
    "latitude": 49.191622,
    "longitude": -121.738538,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 237,
    "city_name": "Bridesville",
    "latitude": 49.037014,
    "longitude": -119.1521521,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 238,
    "city_name": "Bridge",
    "latitude": 49.3428609,
    "longitude": -123.1149244,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 239,
    "city_name": "Bridge Lake",
    "latitude": 51.481605,
    "longitude": -120.729613,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 240,
    "city_name": "Brigade Lake",
    "latitude": 50.501119,
    "longitude": -120.315625,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 241,
    "city_name": "Brighouse",
    "latitude": 49.170211,
    "longitude": -123.136457,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 242,
    "city_name": "Brighton Beach",
    "latitude": 49.3606849,
    "longitude": -122.898062,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 243,
    "city_name": "Brilliant",
    "latitude": 49.321423,
    "longitude": -117.642875,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 244,
    "city_name": "Brisco",
    "latitude": 50.826998,
    "longitude": -116.269968,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 245,
    "city_name": "Britannia Beach",
    "latitude": 49.623818,
    "longitude": -123.205511,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 246,
    "city_name": "Broadview",
    "latitude": 50.703353,
    "longitude": -119.245168,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 247,
    "city_name": "Brocklehurst",
    "latitude": 50.710803,
    "longitude": -120.409878,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 248,
    "city_name": "Broman Lake",
    "latitude": 54.416667,
    "longitude": -126.133333,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 249,
    "city_name": "Brookmere",
    "latitude": 49.817787,
    "longitude": -120.872143,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 250,
    "city_name": "Brouse",
    "latitude": 50.232467,
    "longitude": -117.749476,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 251,
    "city_name": "Browns Bay",
    "latitude": 50.1620756,
    "longitude": -125.3734097,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 252,
    "city_name": "Brownsville",
    "latitude": 49.1913466,
    "longitude": -122.8490125,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 253,
    "city_name": "Brunswick",
    "latitude": 53.7266683,
    "longitude": -127.6476205,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 254,
    "city_name": "Bryn",
    "latitude": 48.5611124,
    "longitude": -123.4249641,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 255,
    "city_name": "Buccaneer Bay",
    "latitude": 49.4907709,
    "longitude": -123.9837599,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 256,
    "city_name": "Buckhorn",
    "latitude": 53.792952,
    "longitude": -122.656224,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 257,
    "city_name": "Buckinghorse River",
    "latitude": 57.389395,
    "longitude": -122.85146,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 258,
    "city_name": "Buckley Bay",
    "latitude": 49.523786,
    "longitude": -124.849994,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 259,
    "city_name": "Buffalo Creek",
    "latitude": 51.733333,
    "longitude": -121.15,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 260,
    "city_name": "Buick",
    "latitude": 56.759992,
    "longitude": -121.277624,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 261,
    "city_name": "Bulkley Canyon",
    "latitude": 55.249939,
    "longitude": -127.462502,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 262,
    "city_name": "Bulkley House",
    "latitude": 55.709053,
    "longitude": -126.23826,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 263,
    "city_name": "Bull Harbour",
    "latitude": 50.9166669,
    "longitude": -127.933333,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 264,
    "city_name": "Bull River",
    "latitude": 49.468392,
    "longitude": -115.448522,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 265,
    "city_name": "Buntzen Bay",
    "latitude": 49.385393,
    "longitude": -122.862421,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 266,
    "city_name": "Burke Road",
    "latitude": 49.3075,
    "longitude": -122.7111111,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 267,
    "city_name": "Burkeville",
    "latitude": 49.186692,
    "longitude": -123.150368,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 268,
    "city_name": "Burnaby",
    "latitude": 49.2488091,
    "longitude": -122.9805104,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 1
  },
  {
    "id": 269,
    "city_name": "Burns Lake",
    "latitude": 54.2334148,
    "longitude": -125.763613,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 270,
    "city_name": "Burnt Flats",
    "latitude": 53.7266683,
    "longitude": -127.6476205,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 271,
    "city_name": "Burton",
    "latitude": 49.989551,
    "longitude": -117.877234,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 272,
    "city_name": "Butedale",
    "latitude": 53.15,
    "longitude": -128.7,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 273,
    "city_name": "Cache Creek",
    "latitude": 50.8108099,
    "longitude": -121.3233237,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 274,
    "city_name": "Caesars",
    "latitude": 50.068286,
    "longitude": -119.49662,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 275,
    "city_name": "Cahilty",
    "latitude": 50.953568,
    "longitude": -120.023597,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 276,
    "city_name": "Caithness",
    "latitude": 49.320597,
    "longitude": -115.173513,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 277,
    "city_name": "Cale",
    "latitude": 48.4402358,
    "longitude": -123.3656536,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 278,
    "city_name": "Callison Ranch",
    "latitude": 58.640898,
    "longitude": -131.689146,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 279,
    "city_name": "Cambie",
    "latitude": 49.2402223,
    "longitude": -123.1178489,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 280,
    "city_name": "Camborne",
    "latitude": 50.788025,
    "longitude": -117.647424,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 281,
    "city_name": "Cameron Heights",
    "latitude": 49.2198396,
    "longitude": -124.8059964,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 282,
    "city_name": "Cameron Lake",
    "latitude": 49.2932861,
    "longitude": -124.6330302,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 283,
    "city_name": "Camp McKinney",
    "latitude": 49.117471,
    "longitude": -119.183633,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 284,
    "city_name": "Campbell Creek",
    "latitude": 50.656753,
    "longitude": -120.081568,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 285,
    "city_name": "Campbell Island",
    "latitude": 52.170605,
    "longitude": -128.141156,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 286,
    "city_name": "Campbell River",
    "latitude": 50.0331226,
    "longitude": -125.2733353,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 287,
    "city_name": "Campbellton",
    "latitude": 50.032872,
    "longitude": -125.2628521,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 288,
    "city_name": "Canal Flats",
    "latitude": 50.1547849,
    "longitude": -115.808063,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 289,
    "city_name": "Canford",
    "latitude": 50.141578,
    "longitude": -120.998161,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 290,
    "city_name": "Canim",
    "latitude": 51.880847,
    "longitude": -120.5716928,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 291,
    "city_name": "Canim Lake",
    "latitude": 51.774437,
    "longitude": -120.930601,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 292,
    "city_name": "Canoe",
    "latitude": 50.750796,
    "longitude": -119.2274331,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 293,
    "city_name": "Canoe River",
    "latitude": 52.722858,
    "longitude": -119.273598,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 294,
    "city_name": "Canyon",
    "latitude": 49.0836154,
    "longitude": -116.4477734,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 295,
    "city_name": "Canyon Alpine",
    "latitude": 49.916002,
    "longitude": -121.448357,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 296,
    "city_name": "Canyon Heights",
    "latitude": 49.3551898,
    "longitude": -123.0957866,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 297,
    "city_name": "Canyon Hot Springs",
    "latitude": 51.138439,
    "longitude": -117.858848,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 298,
    "city_name": "Cariboo Meadows",
    "latitude": 58.248688,
    "longitude": -130.6218659,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 299,
    "city_name": "Carlin",
    "latitude": 50.825416,
    "longitude": -119.320403,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 300,
    "city_name": "Carlson",
    "latitude": 54.970833,
    "longitude": -122.570833,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 301,
    "city_name": "Carmi",
    "latitude": 49.495488,
    "longitude": -119.12278,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 302,
    "city_name": "Carmi Subdivision",
    "latitude": 49.495488,
    "longitude": -119.12278,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 303,
    "city_name": "Carnaby",
    "latitude": 55.175403,
    "longitude": -127.756678,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 304,
    "city_name": "Carp",
    "latitude": 49.2623104,
    "longitude": -123.095829,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 305,
    "city_name": "Carrolls Landing",
    "latitude": 50.027944,
    "longitude": -117.897703,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 306,
    "city_name": "Carrs",
    "latitude": 50.11654,
    "longitude": -119.46196,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 307,
    "city_name": "Carrs Landing",
    "latitude": 50.11654,
    "longitude": -119.46196,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 308,
    "city_name": "Carson",
    "latitude": 49.0012339,
    "longitude": -118.492215,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 309,
    "city_name": "Cascade",
    "latitude": 49.016667,
    "longitude": -118.2,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 310,
    "city_name": "Casino",
    "latitude": 49.056627,
    "longitude": -117.655495,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 311,
    "city_name": "Cassiar",
    "latitude": 59.28215,
    "longitude": -129.8168949,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 312,
    "city_name": "Cassidy",
    "latitude": 49.0538587,
    "longitude": -123.8838125,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 313,
    "city_name": "Cassin",
    "latitude": 53.7266683,
    "longitude": -127.6476205,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 314,
    "city_name": "Castle Rock",
    "latitude": 52.533333,
    "longitude": -122.4833331,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 315,
    "city_name": "Castledale",
    "latitude": 51.02305,
    "longitude": -116.522547,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 316,
    "city_name": "Castlegar",
    "latitude": 49.3237408,
    "longitude": -117.6593341,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 317,
    "city_name": "Caswell",
    "latitude": 53.7266683,
    "longitude": -127.6476205,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 318,
    "city_name": "Cathedral",
    "latitude": 48.4222786,
    "longitude": -123.3594756,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 319,
    "city_name": "Caulfeild",
    "latitude": 49.35,
    "longitude": -123.25,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 320,
    "city_name": "Cawston",
    "latitude": 49.1794814,
    "longitude": -119.7575417,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 321,
    "city_name": "Caycuse",
    "latitude": 48.884741,
    "longitude": -124.366099,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 322,
    "city_name": "Cecil Lake",
    "latitude": 56.304706,
    "longitude": -120.575253,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 323,
    "city_name": "Cedar",
    "latitude": 49.115469,
    "longitude": -123.86428,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 324,
    "city_name": "Cedar Grove",
    "latitude": 50.135812,
    "longitude": -119.453293,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 325,
    "city_name": "Cedar Heights Estates",
    "latitude": 53.7266683,
    "longitude": -127.6476205,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 326,
    "city_name": "Cedarside",
    "latitude": 52.783333,
    "longitude": -119.25,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 327,
    "city_name": "Cedarvale",
    "latitude": 55.015954,
    "longitude": -128.32244,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 328,
    "city_name": "Ceepeecee",
    "latitude": 49.869926,
    "longitude": -126.697565,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 329,
    "city_name": "Celista",
    "latitude": 50.943942,
    "longitude": -119.349578,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 330,
    "city_name": "Central Saanich",
    "latitude": 48.5703549,
    "longitude": -123.3998135,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 331,
    "city_name": "Centreville",
    "latitude": 59.271649,
    "longitude": -129.403727,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 332,
    "city_name": "Chaatl",
    "latitude": 53.106836,
    "longitude": -132.5229671,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 333,
    "city_name": "Chain Lake",
    "latitude": 49.6988986,
    "longitude": -120.2740008,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 334,
    "city_name": "Chamiss Bay",
    "latitude": 50.065081,
    "longitude": -127.284252,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 335,
    "city_name": "Channel Ridge",
    "latitude": 48.8865445,
    "longitude": -123.5667962,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 336,
    "city_name": "Chapman Camp",
    "latitude": 49.6652462,
    "longitude": -115.9679293,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 337,
    "city_name": "Chapmans",
    "latitude": 49.71824,
    "longitude": -121.421041,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 338,
    "city_name": "Charella Garden",
    "latitude": 53.880157,
    "longitude": -122.788736,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 339,
    "city_name": "Charles",
    "latitude": 49.2496622,
    "longitude": -123.0947997,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 340,
    "city_name": "Charlie Lake",
    "latitude": 56.279902,
    "longitude": -120.9634091,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 341,
    "city_name": "Charlotte Lake",
    "latitude": 52.225,
    "longitude": -125.3000001,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 342,
    "city_name": "Chase",
    "latitude": 50.8188483,
    "longitude": -119.6845191,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 343,
    "city_name": "Chase River",
    "latitude": 49.13077,
    "longitude": -123.921338,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 344,
    "city_name": "Chasm",
    "latitude": 51.216667,
    "longitude": -121.483333,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 345,
    "city_name": "Chaumox",
    "latitude": 49.948109,
    "longitude": -121.483359,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 346,
    "city_name": "Cheakamus",
    "latitude": 49.830228,
    "longitude": -123.13461,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 347,
    "city_name": "Cheam View",
    "latitude": 49.251849,
    "longitude": -121.67915,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 348,
    "city_name": "Cheekye",
    "latitude": 49.799064,
    "longitude": -123.154936,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 349,
    "city_name": "Chelohsin Sechelt Band 13",
    "latitude": 49.4741736,
    "longitude": -123.7545601,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 350,
    "city_name": "Chemainus",
    "latitude": 48.9301648,
    "longitude": -123.7344815,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 351,
    "city_name": "Cherry Point",
    "latitude": 48.7218193,
    "longitude": -123.5811913,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 352,
    "city_name": "Cherryville",
    "latitude": 50.2467479,
    "longitude": -118.629853,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 353,
    "city_name": "Ches-la-kee 3",
    "latitude": 50.5630961,
    "longitude": -126.9841895,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 354,
    "city_name": "Cheslatta",
    "latitude": 53.816667,
    "longitude": -125.8,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 355,
    "city_name": "Chetarpe",
    "latitude": 49.25,
    "longitude": -126,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 356,
    "city_name": "Chetwynd",
    "latitude": 55.6976802,
    "longitude": -121.6296734,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 357,
    "city_name": "Chezacut",
    "latitude": 52.405291,
    "longitude": -124.0208599,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 358,
    "city_name": "Chickwat Sechelt Band 9",
    "latitude": 49.8222876,
    "longitude": -123.7095368,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 359,
    "city_name": "Chilanko Forks",
    "latitude": 52.112068,
    "longitude": -124.064853,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 360,
    "city_name": "Chilcotin Forest",
    "latitude": 52.114909,
    "longitude": -122.565999,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 361,
    "city_name": "Chilliwack",
    "latitude": 49.1579401,
    "longitude": -121.9514666,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 1
  },
  {
    "id": 362,
    "city_name": "Chilton Subdivision",
    "latitude": 55.7532683,
    "longitude": -120.2723551,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 363,
    "city_name": "Chimney Valley",
    "latitude": 52.0647822,
    "longitude": -122.1681213,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 364,
    "city_name": "China Bar",
    "latitude": 53.7266683,
    "longitude": -127.6476205,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 365,
    "city_name": "Chinook Cove",
    "latitude": 51.23762,
    "longitude": -120.1622999,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 366,
    "city_name": "Choate",
    "latitude": 49.470958,
    "longitude": -121.426066,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 367,
    "city_name": "Chopaka",
    "latitude": 49.000588,
    "longitude": -119.726345,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 368,
    "city_name": "Christian Valley",
    "latitude": 49.545423,
    "longitude": -118.808853,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 369,
    "city_name": "Christina Lake",
    "latitude": 49.041715,
    "longitude": -118.2120721,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 370,
    "city_name": "Chu Chua",
    "latitude": 51.355012,
    "longitude": -120.159544,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 371,
    "city_name": "Church House",
    "latitude": 50.333333,
    "longitude": -125.0666671,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 372,
    "city_name": "Chute Lake",
    "latitude": 49.692308,
    "longitude": -119.535275,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 373,
    "city_name": "Cinema",
    "latitude": 53.234594,
    "longitude": -122.446586,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 374,
    "city_name": "Cinnabar Valley",
    "latitude": 49.107942,
    "longitude": -123.920943,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 375,
    "city_name": "Cisco",
    "latitude": 49.2862797,
    "longitude": -123.1198975,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 376,
    "city_name": "Clairmont",
    "latitude": 56.255228,
    "longitude": -120.9001419,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 377,
    "city_name": "Clapperton",
    "latitude": 50.333333,
    "longitude": -121.216667,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 378,
    "city_name": "Clayburn",
    "latitude": 49.081921,
    "longitude": -122.260951,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 379,
    "city_name": "Clayhurst",
    "latitude": 56.188434,
    "longitude": -120.0318009,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 380,
    "city_name": "Clayoquot",
    "latitude": 49.1573644,
    "longitude": -125.9322765,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 381,
    "city_name": "Cleagh Creek",
    "latitude": 50.4767769,
    "longitude": -127.7528781,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 382,
    "city_name": "Clearbrook",
    "latitude": 49.0515175,
    "longitude": -122.3267648,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 383,
    "city_name": "Clearwater",
    "latitude": 51.6510712,
    "longitude": -120.0381726,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 384,
    "city_name": "Clemina East",
    "latitude": 52.5678489,
    "longitude": -119.1007275,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 385,
    "city_name": "Clemina West",
    "latitude": 53.7266683,
    "longitude": -127.6476205,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 386,
    "city_name": "Clemretta",
    "latitude": 54.006166,
    "longitude": -126.2850581,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 387,
    "city_name": "Cleveland Park",
    "latitude": 49.358972,
    "longitude": -123.106382,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 388,
    "city_name": "Cliffside",
    "latitude": 48.617256,
    "longitude": -123.628522,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 389,
    "city_name": "Clinton",
    "latitude": 51.0926994,
    "longitude": -121.5865308,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 390,
    "city_name": "Clode",
    "latitude": 53.7266683,
    "longitude": -127.6476205,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 391,
    "city_name": "Clo-oose",
    "latitude": 48.6533779,
    "longitude": -124.804508,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 392,
    "city_name": "Coal Harbour",
    "latitude": 50.599568,
    "longitude": -127.583335,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 393,
    "city_name": "Coal Island",
    "latitude": 48.6861071,
    "longitude": -123.3773219,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 394,
    "city_name": "Coal River",
    "latitude": 59.65,
    "longitude": -126.933333,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 395,
    "city_name": "Coalmont",
    "latitude": 49.507882,
    "longitude": -120.693448,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 396,
    "city_name": "Cobble Hill",
    "latitude": 48.6883499,
    "longitude": -123.603089,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 397,
    "city_name": "Cody",
    "latitude": 49.975126,
    "longitude": -117.196865,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 398,
    "city_name": "Cokato",
    "latitude": 49.468357,
    "longitude": -115.066006,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 399,
    "city_name": "Cokoqueneets Sechelt Band 23",
    "latitude": 49.47386,
    "longitude": -123.749355,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 400,
    "city_name": "Coldspring House",
    "latitude": 53.017331,
    "longitude": -122.0818801,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 401,
    "city_name": "Coldstream",
    "latitude": 50.2240647,
    "longitude": -119.168328,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 402,
    "city_name": "Coldwell Beach",
    "latitude": 49.40075,
    "longitude": -122.889186,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 403,
    "city_name": "Colebank",
    "latitude": 53.4623607,
    "longitude": -122.5930532,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 404,
    "city_name": "Colebrook",
    "latitude": 49.1014429,
    "longitude": -122.8738335,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 405,
    "city_name": "College Heights",
    "latitude": 53.8636566,
    "longitude": -122.7669328,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 406,
    "city_name": "Collettville",
    "latitude": 50.106439,
    "longitude": -120.807665,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 407,
    "city_name": "Colleymount",
    "latitude": 54.033333,
    "longitude": -126.15,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 408,
    "city_name": "Colquitz",
    "latitude": 48.480109,
    "longitude": -123.40978,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 409,
    "city_name": "Columbia Gardens",
    "latitude": 49.068416,
    "longitude": -117.589496,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 410,
    "city_name": "Columere Park",
    "latitude": 50.2926456,
    "longitude": -115.8736042,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 411,
    "city_name": "Colvalli",
    "latitude": 49.371705,
    "longitude": -115.3804958,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 412,
    "city_name": "Colwood",
    "latitude": 48.4287565,
    "longitude": -123.4888933,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 413,
    "city_name": "Comer",
    "latitude": 53.7266683,
    "longitude": -127.6476205,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 414,
    "city_name": "Commodore Heights",
    "latitude": 52.166257,
    "longitude": -122.137645,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 415,
    "city_name": "Comox",
    "latitude": 49.6735133,
    "longitude": -124.9282659,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 416,
    "city_name": "Connaught Heights",
    "latitude": 49.201563,
    "longitude": -122.946741,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 417,
    "city_name": "Conrad",
    "latitude": 50.7376677,
    "longitude": -116.766327,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 418,
    "city_name": "Coombe",
    "latitude": 49.3055,
    "longitude": -124.428831,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 419,
    "city_name": "Coombs",
    "latitude": 49.3055,
    "longitude": -124.428831,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 420,
    "city_name": "Cooper Creek",
    "latitude": 50.2,
    "longitude": -116.966667,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 421,
    "city_name": "Copper City",
    "latitude": 50.503126,
    "longitude": -116.027699,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 422,
    "city_name": "Copper Cove",
    "latitude": 53.7266683,
    "longitude": -127.6476205,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 423,
    "city_name": "Copper Creek",
    "latitude": 50.790253,
    "longitude": -120.767329,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 424,
    "city_name": "Copper Mountain",
    "latitude": 49.330292,
    "longitude": -120.536201,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 425,
    "city_name": "Coquitlam",
    "latitude": 49.2837626,
    "longitude": -122.7932065,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 1
  },
  {
    "id": 426,
    "city_name": "Coral Beach",
    "latitude": 50.1339428,
    "longitude": -119.4534506,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 427,
    "city_name": "Corbin",
    "latitude": 49.515442,
    "longitude": -114.656063,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 428,
    "city_name": "Cordova Bay",
    "latitude": 48.5179793,
    "longitude": -123.3670582,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 429,
    "city_name": "Cormorant Island",
    "latitude": 50.5851966,
    "longitude": -126.9202353,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 430,
    "city_name": "Corra Linn",
    "latitude": 49.471304,
    "longitude": -117.4699249,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 431,
    "city_name": "Cortes Bay",
    "latitude": 50.067358,
    "longitude": -124.940641,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 432,
    "city_name": "Cortes Island",
    "latitude": 50.1167278,
    "longitude": -124.9489278,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 433,
    "city_name": "Cottonwood",
    "latitude": 53.055189,
    "longitude": -122.1741779,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 434,
    "city_name": "Cottonwood Flats",
    "latitude": 53.055189,
    "longitude": -122.1741779,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 435,
    "city_name": "Couldwell Subdivision",
    "latitude": 53.7266683,
    "longitude": -127.6476205,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 436,
    "city_name": "Courtenay",
    "latitude": 49.6841391,
    "longitude": -124.9904494,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 437,
    "city_name": "Coutlee",
    "latitude": 50.126202,
    "longitude": -120.825879,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 438,
    "city_name": "Cove Cliff",
    "latitude": 49.323074,
    "longitude": -122.953543,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 439,
    "city_name": "Cowans Point",
    "latitude": 49.341644,
    "longitude": -123.369833,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 440,
    "city_name": "Cowichan Bay",
    "latitude": 48.7373094,
    "longitude": -123.6215502,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 3
  },
  {
    "id": 441,
    "city_name": "Coykendahl",
    "latitude": 53.7266683,
    "longitude": -127.6476205,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 442,
    "city_name": "Coyle",
    "latitude": 50.152531,
    "longitude": -120.875397,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 443,
    "city_name": "Cracroft",
    "latitude": 50.533333,
    "longitude": -126.383333,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 444,
    "city_name": "Craigellachie",
    "latitude": 50.969555,
    "longitude": -118.731025,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 445,
    "city_name": "Cranberry",
    "latitude": 49.87325,
    "longitude": -124.5259021,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 446,
    "city_name": "Cranberry Junction",
    "latitude": 55.599165,
    "longitude": -128.538878,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 447,
    "city_name": "Cranbrook",
    "latitude": 49.5129678,
    "longitude": -115.7694002,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 448,
    "city_name": "Crawford Bay",
    "latitude": 49.681288,
    "longitude": -116.82423,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 449,
    "city_name": "Creekside",
    "latitude": 50.399733,
    "longitude": -122.702899,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 450,
    "city_name": "Creighton Valley",
    "latitude": 50.212448,
    "longitude": -118.776192,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 451,
    "city_name": "Crescent Bay",
    "latitude": 49.6081969,
    "longitude": -117.144004,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 452,
    "city_name": "Crescent Beach",
    "latitude": 49.0520009,
    "longitude": -122.885091,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 453,
    "city_name": "Crescent Spur",
    "latitude": 53.583333,
    "longitude": -120.683333,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 454,
    "city_name": "Crescent Valley",
    "latitude": 49.4463401,
    "longitude": -117.5577899,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 455,
    "city_name": "Creston",
    "latitude": 49.0955401,
    "longitude": -116.5135079,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 456,
    "city_name": "Crestwood Subdivision",
    "latitude": 48.5237648,
    "longitude": -123.5250035,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 457,
    "city_name": "Criss Creek",
    "latitude": 51.043401,
    "longitude": -120.729653,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 458,
    "city_name": "Crofton",
    "latitude": 48.863844,
    "longitude": -123.6457976,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 3
  },
  {
    "id": 459,
    "city_name": "Crowsnest",
    "latitude": 49.297829,
    "longitude": -117.7745064,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 460,
    "city_name": "Croydon",
    "latitude": 53.066667,
    "longitude": -119.716667,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 461,
    "city_name": "Crysdale",
    "latitude": 55.9383333,
    "longitude": -123.4211111,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 462,
    "city_name": "Cultus Lake",
    "latitude": 49.0678959,
    "longitude": -121.9762054,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 3
  },
  {
    "id": 463,
    "city_name": "Cumberland",
    "latitude": 49.618806,
    "longitude": -125.0312689,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 3
  },
  {
    "id": 464,
    "city_name": "Cumshewa",
    "latitude": 53.04383,
    "longitude": -131.6848259,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 465,
    "city_name": "Curzon",
    "latitude": 49.075062,
    "longitude": -116.14068,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 466,
    "city_name": "Cypress Park",
    "latitude": 49.3462559,
    "longitude": -123.249229,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 467,
    "city_name": "Daajing Giids",
    "latitude": 53.2549952,
    "longitude": -132.0868676,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 468,
    "city_name": "Dallas",
    "latitude": 50.65291,
    "longitude": -120.0680347,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 469,
    "city_name": "Danskin",
    "latitude": 53.988889,
    "longitude": -125.7916669,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 470,
    "city_name": "D'Arcy",
    "latitude": 50.553902,
    "longitude": -122.4788831,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 471,
    "city_name": "D'Arcy Island",
    "latitude": 48.5672251,
    "longitude": -123.279095,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 472,
    "city_name": "Darfield",
    "latitude": 51.295727,
    "longitude": -120.181728,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 473,
    "city_name": "Darrell Bay",
    "latitude": 49.669064,
    "longitude": -123.1662999,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 474,
    "city_name": "Dashwood",
    "latitude": 49.366195,
    "longitude": -124.5189479,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 475,
    "city_name": "Davidson",
    "latitude": 49.283484,
    "longitude": -123.117176,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 476,
    "city_name": "Davis Bay",
    "latitude": 49.443348,
    "longitude": -123.724804,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 477,
    "city_name": "Dawson Creek",
    "latitude": 55.7596274,
    "longitude": -120.2376623,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 478,
    "city_name": "Dawsons Landing",
    "latitude": 51.5760835,
    "longitude": -127.5910853,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 479,
    "city_name": "Days Ranch",
    "latitude": 58.032937,
    "longitude": -130.889883,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 480,
    "city_name": "Day's Subdivision",
    "latitude": 53.7266683,
    "longitude": -127.6476205,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 481,
    "city_name": "De Courcy Island",
    "latitude": 49.1007546,
    "longitude": -123.7436353,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 482,
    "city_name": "Deadtree Point",
    "latitude": 53.7266683,
    "longitude": -127.6476205,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 483,
    "city_name": "Deadwood",
    "latitude": 49.099491,
    "longitude": -118.701372,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 484,
    "city_name": "Dease Lake",
    "latitude": 58.43741,
    "longitude": -129.9993781,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 485,
    "city_name": "Decker Lake",
    "latitude": 54.293395,
    "longitude": -125.833358,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 486,
    "city_name": "Deep Bay",
    "latitude": 49.453162,
    "longitude": -124.710948,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 487,
    "city_name": "Deep Cove",
    "latitude": 49.326817,
    "longitude": -122.9519941,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 488,
    "city_name": "Deep Creek",
    "latitude": 50.617886,
    "longitude": -119.2157041,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 489,
    "city_name": "Deer Park",
    "latitude": 49.416217,
    "longitude": -118.039438,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 490,
    "city_name": "Deerholme",
    "latitude": 48.750862,
    "longitude": -123.76158,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 491,
    "city_name": "Defot",
    "latitude": 58.9,
    "longitude": -130.4499999,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 492,
    "city_name": "Deka Lake",
    "latitude": 51.60903,
    "longitude": -120.8533521,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 493,
    "city_name": "Del Oro Subdivision",
    "latitude": 49.09637,
    "longitude": -119.562622,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 494,
    "city_name": "Delkatla",
    "latitude": 54.016667,
    "longitude": -132.133333,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 495,
    "city_name": "Delta",
    "latitude": 49.0952155,
    "longitude": -123.0264758,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 1
  },
  {
    "id": 496,
    "city_name": "Demean",
    "latitude": 53.7266683,
    "longitude": -127.6476205,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 497,
    "city_name": "Denman Island",
    "latitude": 49.5629711,
    "longitude": -124.7981005,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 498,
    "city_name": "Dentville",
    "latitude": 49.718223,
    "longitude": -123.147909,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 499,
    "city_name": "Departure Bay",
    "latitude": 49.1993259,
    "longitude": -123.9593708,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 500,
    "city_name": "Deroche",
    "latitude": 49.188179,
    "longitude": -122.072985,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 501,
    "city_name": "Devine",
    "latitude": 50.523349,
    "longitude": -122.490449,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 502,
    "city_name": "Dewdney",
    "latitude": 49.164808,
    "longitude": -122.196549,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 503,
    "city_name": "Dewey",
    "latitude": 54.03252,
    "longitude": -121.711601,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 504,
    "city_name": "Digby Island",
    "latitude": 54.2945969,
    "longitude": -130.4233874,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 505,
    "city_name": "Doe River",
    "latitude": 55.999766,
    "longitude": -120.088384,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 506,
    "city_name": "Dogpatch",
    "latitude": 49.275301,
    "longitude": -122.7303971,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 507,
    "city_name": "Dogwood Valley",
    "latitude": 49.484665,
    "longitude": -121.4219259,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 508,
    "city_name": "Doig River",
    "latitude": 56.577522,
    "longitude": -120.496455,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 509,
    "city_name": "Dokie",
    "latitude": 55.701412,
    "longitude": -122.2876167,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 510,
    "city_name": "Dokie Siding",
    "latitude": 55.649766,
    "longitude": -121.734602,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 511,
    "city_name": "Dolan Road Subdivision",
    "latitude": 50.9329023,
    "longitude": -119.2516777,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 512,
    "city_name": "Dollarton",
    "latitude": 49.3079139,
    "longitude": -122.953057,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 513,
    "city_name": "Dolphin Beach",
    "latitude": 49.285805,
    "longitude": -124.14299,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 514,
    "city_name": "Dolphin Island",
    "latitude": 53.7740643,
    "longitude": -130.4408425,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 515,
    "city_name": "Dome Creek",
    "latitude": 53.750223,
    "longitude": -121.0345609,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 516,
    "city_name": "Donald",
    "latitude": 51.492841,
    "longitude": -117.176223,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 517,
    "city_name": "Donald Landing",
    "latitude": 54.483333,
    "longitude": -125.6500001,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 518,
    "city_name": "Donnely Landing",
    "latitude": 49.625127,
    "longitude": -124.04137,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 519,
    "city_name": "Doriston",
    "latitude": 49.7107816,
    "longitude": -123.8946952,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 520,
    "city_name": "Dorreen",
    "latitude": 54.838889,
    "longitude": -128.3458329,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 521,
    "city_name": "Dot",
    "latitude": 50.23392,
    "longitude": -121.100922,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 522,
    "city_name": "Douglas",
    "latitude": 49.766667,
    "longitude": -122.166667,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 523,
    "city_name": "Douglas Hill Estates",
    "latitude": 49.0056264,
    "longitude": -122.7451575,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 524,
    "city_name": "Douglas Lake",
    "latitude": 50.166632,
    "longitude": -120.217676,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 525,
    "city_name": "Dove Creek",
    "latitude": 49.7246489,
    "longitude": -125.0582013,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 526,
    "city_name": "Downie",
    "latitude": 50.9899926,
    "longitude": -118.1914687,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 527,
    "city_name": "Dragon",
    "latitude": 52.881908,
    "longitude": -122.451202,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 528,
    "city_name": "Drew Harbour",
    "latitude": 50.0944856,
    "longitude": -125.1914406,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 529,
    "city_name": "Drewry",
    "latitude": 49.4152266,
    "longitude": -116.811336,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 530,
    "city_name": "Driftwood Creek",
    "latitude": 54.816178,
    "longitude": -127.077801,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 531,
    "city_name": "Dry Gulch",
    "latitude": 50.5821619,
    "longitude": -116.0384379,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 532,
    "city_name": "DuBose",
    "latitude": 53.5975,
    "longitude": -127.8880555,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 533,
    "city_name": "Duck Range",
    "latitude": 50.619531,
    "longitude": -119.828335,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 534,
    "city_name": "Dufferin",
    "latitude": 50.6601961,
    "longitude": -120.3857857,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 535,
    "city_name": "Dugan Lake",
    "latitude": 52.165487,
    "longitude": -121.924588,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 536,
    "city_name": "Duncan",
    "latitude": 48.7786908,
    "longitude": -123.7079417,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 537,
    "city_name": "Duncan Bay",
    "latitude": 50.069333,
    "longitude": -125.284734,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 538,
    "city_name": "Duncanby Landing",
    "latitude": 51.4056757,
    "longitude": -127.645006,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 539,
    "city_name": "Dunkley",
    "latitude": 53.283333,
    "longitude": -122.466667,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 540,
    "city_name": "Dunsmuir",
    "latitude": 49.38584,
    "longitude": -124.611987,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 541,
    "city_name": "Dunster",
    "latitude": 53.1198152,
    "longitude": -119.827689,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 542,
    "city_name": "Durieu",
    "latitude": 49.216828,
    "longitude": -122.236298,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 543,
    "city_name": "Dutch Lake",
    "latitude": 51.6505502,
    "longitude": -120.0578496,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 544,
    "city_name": "Eagle Bay",
    "latitude": 50.932532,
    "longitude": -119.2136759,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 545,
    "city_name": "Eagle Bluff",
    "latitude": 49.263889,
    "longitude": -119.502778,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 546,
    "city_name": "Eagle Creek",
    "latitude": 51.864516,
    "longitude": -120.866204,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 547,
    "city_name": "Eagle Harbour",
    "latitude": 49.353651,
    "longitude": -123.261872,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 548,
    "city_name": "Eagle Heights",
    "latitude": 48.75877,
    "longitude": -123.697709,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 549,
    "city_name": "Earls Cove",
    "latitude": 49.750973,
    "longitude": -124.005678,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 550,
    "city_name": "East Arrow Park",
    "latitude": 50.089908,
    "longitude": -117.918026,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 551,
    "city_name": "East Kelowna",
    "latitude": 49.8599109,
    "longitude": -119.423812,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 552,
    "city_name": "East Osoyoos",
    "latitude": 49.028252,
    "longitude": -119.440872,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 553,
    "city_name": "East Pine",
    "latitude": 55.716183,
    "longitude": -121.216169,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 554,
    "city_name": "East Sooke",
    "latitude": 48.366615,
    "longitude": -123.706823,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 555,
    "city_name": "East Thurlow Island",
    "latitude": 50.3824934,
    "longitude": -125.43728,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 556,
    "city_name": "East Trail",
    "latitude": 49.0980914,
    "longitude": -117.6859382,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 557,
    "city_name": "East Wellington",
    "latitude": 49.173997,
    "longitude": -124.01695,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 558,
    "city_name": "Eastbourne",
    "latitude": 49.395289,
    "longitude": -123.4349671,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 559,
    "city_name": "Eastgate",
    "latitude": 49.1374923,
    "longitude": -120.6156561,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 560,
    "city_name": "Echo Bay",
    "latitude": 50.7508,
    "longitude": -126.49755,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 561,
    "city_name": "Ecoole",
    "latitude": 48.968845,
    "longitude": -125.056692,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 562,
    "city_name": "Eddontenajon",
    "latitude": 57.817687,
    "longitude": -129.963909,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 563,
    "city_name": "Eddy",
    "latitude": 53.23627,
    "longitude": -120.069538,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 564,
    "city_name": "Edelweiss",
    "latitude": 51.31109,
    "longitude": -116.970287,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 565,
    "city_name": "Edgewater",
    "latitude": 50.6995093,
    "longitude": -116.1319634,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 566,
    "city_name": "Edgewood",
    "latitude": 49.782931,
    "longitude": -118.141641,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 567,
    "city_name": "Egmont",
    "latitude": 49.75,
    "longitude": -123.933333,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 568,
    "city_name": "Egmont Sechelt Band 26",
    "latitude": 49.7612662,
    "longitude": -123.9235145,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 569,
    "city_name": "Ehatisaht",
    "latitude": 49.9851035,
    "longitude": -126.859324,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 570,
    "city_name": "Eholt",
    "latitude": 49.154051,
    "longitude": -118.546135,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 571,
    "city_name": "Ekins Point",
    "latitude": 49.5324014,
    "longitude": -123.3808252,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 572,
    "city_name": "Ekwan",
    "latitude": 58.5052234,
    "longitude": -120.6796248,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 573,
    "city_name": "Elephant Crossing",
    "latitude": 50.6651436,
    "longitude": -128.0610507,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 574,
    "city_name": "Elk Bay",
    "latitude": 50.277342,
    "longitude": -125.4388059,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 575,
    "city_name": "Elk Prairie",
    "latitude": 49.762644,
    "longitude": -114.888279,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 576,
    "city_name": "Elkford",
    "latitude": 50.024565,
    "longitude": -114.92353,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 577,
    "city_name": "Elko",
    "latitude": 49.299036,
    "longitude": -115.110965,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 578,
    "city_name": "Elkview",
    "latitude": 50.024565,
    "longitude": -114.92353,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 579,
    "city_name": "Elleh",
    "latitude": 58.4764524,
    "longitude": -121.2969772,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 580,
    "city_name": "Ellison",
    "latitude": 49.939901,
    "longitude": -119.3641549,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 581,
    "city_name": "Elphinstone",
    "latitude": 49.392862,
    "longitude": -123.5294399,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 582,
    "city_name": "Encombe",
    "latitude": 54.0625691,
    "longitude": -124.7259761,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 583,
    "city_name": "Endako",
    "latitude": 54.0856688,
    "longitude": -125.0211534,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 584,
    "city_name": "Enderby",
    "latitude": 50.5508499,
    "longitude": -119.1396705,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 585,
    "city_name": "Engen",
    "latitude": 54.026871,
    "longitude": -124.316087,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 586,
    "city_name": "Engineer",
    "latitude": 59.489846,
    "longitude": -134.239954,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 587,
    "city_name": "Enterprise",
    "latitude": 51.966667,
    "longitude": -121.816667,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 588,
    "city_name": "Erickson",
    "latitude": 49.0912298,
    "longitude": -116.4661136,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 589,
    "city_name": "Erie",
    "latitude": 49.191999,
    "longitude": -117.334761,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 590,
    "city_name": "Errington",
    "latitude": 49.2894701,
    "longitude": -124.3591725,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 591,
    "city_name": "Esler",
    "latitude": 52.09934,
    "longitude": -122.18123,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 592,
    "city_name": "Esperanza",
    "latitude": 49.8737712,
    "longitude": -126.7414828,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 593,
    "city_name": "Espinosa Inlet",
    "latitude": 53.7266683,
    "longitude": -127.6476205,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 594,
    "city_name": "Esquimalt",
    "latitude": 48.435842,
    "longitude": -123.4112341,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 595,
    "city_name": "Estevan Point",
    "latitude": 49.383484,
    "longitude": -126.544725,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 596,
    "city_name": "Evans",
    "latitude": 49.811354,
    "longitude": -123.1735153,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 597,
    "city_name": "Evelyn",
    "latitude": 54.878891,
    "longitude": -127.2584,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 598,
    "city_name": "Evergreen Acres",
    "latitude": 51.64613,
    "longitude": -120.020482,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 599,
    "city_name": "Ewing",
    "latitude": 50.168042,
    "longitude": -119.5071939,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 600,
    "city_name": "Exeter",
    "latitude": 51.6527249,
    "longitude": -121.327046,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 601,
    "city_name": "Exlou",
    "latitude": 51.116667,
    "longitude": -120.1333329,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 602,
    "city_name": "Exstew",
    "latitude": 54.5239004,
    "longitude": -129.2050261,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 603,
    "city_name": "Extension",
    "latitude": 49.100173,
    "longitude": -123.95709,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 604,
    "city_name": "Fair Harbour",
    "latitude": 50.0604393,
    "longitude": -127.1159337,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 605,
    "city_name": "Fairbridge",
    "latitude": 48.7414,
    "longitude": -123.698883,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 606,
    "city_name": "Fairmont",
    "latitude": 50.335927,
    "longitude": -115.8511861,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 607,
    "city_name": "Fairmont Hot Springs",
    "latitude": 50.335927,
    "longitude": -115.8511861,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 608,
    "city_name": "Fairview",
    "latitude": 49.174553,
    "longitude": -119.601993,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 609,
    "city_name": "Fairview Subdivision",
    "latitude": 49.2634966,
    "longitude": -123.1313336,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 610,
    "city_name": "Falkland",
    "latitude": 50.500051,
    "longitude": -119.5527621,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 611,
    "city_name": "Falls",
    "latitude": 54.7838615,
    "longitude": -121.1911153,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 612,
    "city_name": "Falls Creek",
    "latitude": 50.066667,
    "longitude": -121.55,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 613,
    "city_name": "Fallsway",
    "latitude": 51.5866718,
    "longitude": -121.1629196,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 614,
    "city_name": "False Bay",
    "latitude": 49.490951,
    "longitude": -124.3492699,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 615,
    "city_name": "Fanny Bay",
    "latitude": 49.494669,
    "longitude": -124.819853,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 616,
    "city_name": "Farmington",
    "latitude": 55.905428,
    "longitude": -120.505851,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 617,
    "city_name": "Farrell Creek",
    "latitude": 56.176766,
    "longitude": -121.5763311,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 618,
    "city_name": "Farron",
    "latitude": 53.7266683,
    "longitude": -127.6476205,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 619,
    "city_name": "Faulder",
    "latitude": 53.7266683,
    "longitude": -127.6476205,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 620,
    "city_name": "Fauquier",
    "latitude": 49.871992,
    "longitude": -118.074253,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 621,
    "city_name": "Federal Ranch",
    "latitude": 56.4,
    "longitude": -122.3833331,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 622,
    "city_name": "Fellers Heights",
    "latitude": 55.599663,
    "longitude": -120.566858,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 623,
    "city_name": "Fenwick",
    "latitude": 48.4464265,
    "longitude": -123.3772877,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 624,
    "city_name": "Ferguson",
    "latitude": 50.676557,
    "longitude": -117.477665,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 625,
    "city_name": "Ferndale",
    "latitude": 53.983333,
    "longitude": -122.483333,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 626,
    "city_name": "Fernie",
    "latitude": 49.5040452,
    "longitude": -115.0630649,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 627,
    "city_name": "Fernwood",
    "latitude": 48.43048,
    "longitude": -123.345181,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 628,
    "city_name": "Field",
    "latitude": 51.394953,
    "longitude": -116.4900226,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 629,
    "city_name": "Fife",
    "latitude": 49.060142,
    "longitude": -118.2116981,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 630,
    "city_name": "Fifth Cabin",
    "latitude": 56.433333,
    "longitude": -127.9500001,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 631,
    "city_name": "Fill",
    "latitude": 53.7266683,
    "longitude": -127.6476205,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 632,
    "city_name": "Finmoore",
    "latitude": 53.97493,
    "longitude": -123.6102981,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 633,
    "city_name": "Fintry",
    "latitude": 50.137639,
    "longitude": -119.495877,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 634,
    "city_name": "Fireside",
    "latitude": 59.666676,
    "longitude": -127.1424199,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 635,
    "city_name": "Firvale",
    "latitude": 52.433333,
    "longitude": -126.283333,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 636,
    "city_name": "Fitzwilliam",
    "latitude": 52.8305555,
    "longitude": -118.4569445,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 637,
    "city_name": "Five Mile",
    "latitude": 50.6666669,
    "longitude": -117.45,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 638,
    "city_name": "Flathead",
    "latitude": 49.360196,
    "longitude": -114.621225,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 639,
    "city_name": "Flatrock",
    "latitude": 56.266667,
    "longitude": -120.2833329,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 640,
    "city_name": "Fleetwood",
    "latitude": 49.164085,
    "longitude": -122.795712,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 641,
    "city_name": "Fleming",
    "latitude": 49.22576,
    "longitude": -123.0766804,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 642,
    "city_name": "Floods",
    "latitude": 49.36632,
    "longitude": -121.510744,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 643,
    "city_name": "Flores Island",
    "latitude": 49.335442,
    "longitude": -126.1380093,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 644,
    "city_name": "Flying U",
    "latitude": 51.423116,
    "longitude": -121.2155961,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 645,
    "city_name": "Fontas",
    "latitude": 58.283333,
    "longitude": -121.733333,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 646,
    "city_name": "Forde",
    "latitude": 51.457835,
    "longitude": -117.110771,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 647,
    "city_name": "Fording",
    "latitude": 50.1892057,
    "longitude": -114.8791528,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 648,
    "city_name": "Foreman",
    "latitude": 53.9445,
    "longitude": -122.6618809,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 649,
    "city_name": "Forest Grove",
    "latitude": 51.7671149,
    "longitude": -121.098162,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 650,
    "city_name": "Forest Hills",
    "latitude": 49.3420992,
    "longitude": -123.096864,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 651,
    "city_name": "Forest Knolls",
    "latitude": 49.14819,
    "longitude": -122.581088,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 652,
    "city_name": "Forestdale",
    "latitude": 54.416667,
    "longitude": -126.2,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 653,
    "city_name": "Fort Babine",
    "latitude": 55.3222287,
    "longitude": -126.6266212,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 654,
    "city_name": "Fort Fraser",
    "latitude": 54.061971,
    "longitude": -124.552796,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 655,
    "city_name": "Fort Langley",
    "latitude": 49.16837,
    "longitude": -122.579975,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 656,
    "city_name": "Fort Nelson",
    "latitude": 58.8050174,
    "longitude": -122.697236,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 3
  },
  {
    "id": 657,
    "city_name": "Fort Nelson 2",
    "latitude": 58.7764028,
    "longitude": -122.5417583,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 658,
    "city_name": "Fort Rupert",
    "latitude": 50.697544,
    "longitude": -127.425581,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 659,
    "city_name": "Fort St. James",
    "latitude": 54.4425721,
    "longitude": -124.2510474,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 660,
    "city_name": "Fort St. John",
    "latitude": 56.252423,
    "longitude": -120.846409,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 661,
    "city_name": "Fort Steele",
    "latitude": 49.615543,
    "longitude": -115.630071,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 662,
    "city_name": "Foss",
    "latitude": 53.7266683,
    "longitude": -127.6476205,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 663,
    "city_name": "Foster",
    "latitude": 49.105462,
    "longitude": -122.6507322,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 664,
    "city_name": "Fosthall",
    "latitude": 50.35,
    "longitude": -117.933333,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 665,
    "city_name": "Fountain",
    "latitude": 50.75216,
    "longitude": -121.8933241,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 666,
    "city_name": "Fountain Valley",
    "latitude": 50.734201,
    "longitude": -121.862486,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 667,
    "city_name": "Fourth Cabin",
    "latitude": 56.249444,
    "longitude": -127.933333,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 668,
    "city_name": "Fowler",
    "latitude": 56.842247,
    "longitude": -131.7713521,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 669,
    "city_name": "Fox Mountain",
    "latitude": 52.1487143,
    "longitude": -122.0943353,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 670,
    "city_name": "Francis Lake",
    "latitude": 49.3444384,
    "longitude": -121.8500261,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 671,
    "city_name": "Francis Peninsula",
    "latitude": 49.6178666,
    "longitude": -124.0577165,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 672,
    "city_name": "Franklin Camp",
    "latitude": 53.7266683,
    "longitude": -127.6476205,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 673,
    "city_name": "Fraser",
    "latitude": 59.717115,
    "longitude": -135.049219,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 674,
    "city_name": "Fraser Heights",
    "latitude": 49.204254,
    "longitude": -122.7849241,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 675,
    "city_name": "Fraser Lake",
    "latitude": 54.0562303,
    "longitude": -124.849555,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 676,
    "city_name": "Fraserview",
    "latitude": 49.2202898,
    "longitude": -123.065868,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 677,
    "city_name": "Frederick",
    "latitude": 50.4833472,
    "longitude": -125.2668415,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 678,
    "city_name": "French Creek",
    "latitude": 49.341372,
    "longitude": -124.355087,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 679,
    "city_name": "Fruitvale",
    "latitude": 49.1137024,
    "longitude": -117.5487834,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 680,
    "city_name": "Fry Creek",
    "latitude": 50.058889,
    "longitude": -116.875858,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 681,
    "city_name": "Fulford Harbour",
    "latitude": 48.771358,
    "longitude": -123.449449,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 682,
    "city_name": "Furry Creek",
    "latitude": 49.583333,
    "longitude": -123.211111,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 683,
    "city_name": "Gabriola",
    "latitude": 49.1702377,
    "longitude": -123.8468027,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 684,
    "city_name": "Gabriola Island",
    "latitude": 49.1577754,
    "longitude": -123.7893349,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 685,
    "city_name": "Galena",
    "latitude": 50.616667,
    "longitude": -117.8666669,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 686,
    "city_name": "Galiano",
    "latitude": 48.8822639,
    "longitude": -123.3510011,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 687,
    "city_name": "Galiano Island",
    "latitude": 48.9236469,
    "longitude": -123.441472,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 688,
    "city_name": "Gallagher Lake",
    "latitude": 49.240156,
    "longitude": -119.5210208,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 689,
    "city_name": "Galloway",
    "latitude": 49.374638,
    "longitude": -115.225735,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 690,
    "city_name": "Gambier Harbour",
    "latitude": 49.4390855,
    "longitude": -123.4382788,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 691,
    "city_name": "Gang Ranch",
    "latitude": 51.55,
    "longitude": -122.333333,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 692,
    "city_name": "Ganges",
    "latitude": 48.8544259,
    "longitude": -123.5005072,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 693,
    "city_name": "Garbitt",
    "latitude": 53.7266683,
    "longitude": -127.6476205,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 694,
    "city_name": "Garden Bay",
    "latitude": 49.63406,
    "longitude": -124.028113,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 695,
    "city_name": "Garden Village",
    "latitude": 49.238696,
    "longitude": -123.009773,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 696,
    "city_name": "Garibaldi",
    "latitude": 49.971041,
    "longitude": -123.142923,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 697,
    "city_name": "Garibaldi Estates",
    "latitude": 49.7005169,
    "longitude": -123.15922,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 698,
    "city_name": "Garibaldi Highlands",
    "latitude": 49.7426133,
    "longitude": -123.1218908,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 699,
    "city_name": "Garnet Rock Trailer Court",
    "latitude": 49.7878026,
    "longitude": -124.4596371,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 700,
    "city_name": "Garnet Valley",
    "latitude": 49.638485,
    "longitude": -119.7102839,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 701,
    "city_name": "Gates",
    "latitude": 50.508527,
    "longitude": -122.533086,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 702,
    "city_name": "Gateway",
    "latitude": 51.6817459,
    "longitude": -121.213043,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 703,
    "city_name": "Gellatly",
    "latitude": 49.812837,
    "longitude": -119.626843,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 704,
    "city_name": "Genelle",
    "latitude": 49.2162667,
    "longitude": -117.6902542,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 705,
    "city_name": "Genoa Bay",
    "latitude": 48.75784,
    "longitude": -123.600738,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 706,
    "city_name": "George River",
    "latitude": 50.557463,
    "longitude": -125.519448,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 707,
    "city_name": "Georgetown Mills",
    "latitude": 54.471383,
    "longitude": -130.3996209,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 708,
    "city_name": "Germansen Landing",
    "latitude": 55.783333,
    "longitude": -124.7,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 709,
    "city_name": "Gerow Island",
    "latitude": 54.2238157,
    "longitude": -125.7694376,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 710,
    "city_name": "Gerrard",
    "latitude": 50.509091,
    "longitude": -117.276036,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 711,
    "city_name": "Gibbs",
    "latitude": 53.7266683,
    "longitude": -127.6476205,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 712,
    "city_name": "Gibraltar",
    "latitude": 52.5298908,
    "longitude": -122.2863939,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 713,
    "city_name": "Gibson Creek",
    "latitude": 49.361296,
    "longitude": -117.670373,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 714,
    "city_name": "Gibsons",
    "latitude": 49.3974171,
    "longitude": -123.5152222,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 715,
    "city_name": "Gifford",
    "latitude": 49.104724,
    "longitude": -122.341009,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 716,
    "city_name": "Gill Island",
    "latitude": 53.1839458,
    "longitude": -129.2766359,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 717,
    "city_name": "Gillies Bay",
    "latitude": 49.681509,
    "longitude": -124.484791,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 718,
    "city_name": "Gilpin",
    "latitude": 49.009901,
    "longitude": -118.317514,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 719,
    "city_name": "Giscome",
    "latitude": 54.066667,
    "longitude": -122.366667,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 720,
    "city_name": "Gitanyow",
    "latitude": 55.26577,
    "longitude": -128.0655448,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 721,
    "city_name": "Gitwinksihlkw",
    "latitude": 55.191753,
    "longitude": -129.2213341,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 722,
    "city_name": "Glacier",
    "latitude": 51.2657809,
    "longitude": -117.516296,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 723,
    "city_name": "Glacier Gulch",
    "latitude": 54.8263969,
    "longitude": -127.2305873,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 724,
    "city_name": "Glade",
    "latitude": 49.400172,
    "longitude": -117.5343931,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 725,
    "city_name": "Gladwin",
    "latitude": 49.057429,
    "longitude": -122.3156017,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 726,
    "city_name": "Gleam",
    "latitude": 49.2046,
    "longitude": -123.124717,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 727,
    "city_name": "Glen Fraser",
    "latitude": 59.717115,
    "longitude": -135.049219,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 728,
    "city_name": "Glen Lake",
    "latitude": 48.433483,
    "longitude": -123.52636,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 729,
    "city_name": "Glen Valley",
    "latitude": 49.161867,
    "longitude": -122.473495,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 730,
    "city_name": "Glen Vowell",
    "latitude": 55.3119575,
    "longitude": -127.6788854,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 731,
    "city_name": "Glenannan",
    "latitude": 54.010787,
    "longitude": -125.025138,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 732,
    "city_name": "Glenbank",
    "latitude": 50.2536,
    "longitude": -117.790585,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 733,
    "city_name": "Glenbrooke North",
    "latitude": 49.219585,
    "longitude": -122.9178391,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 734,
    "city_name": "Glendale",
    "latitude": 52.1484949,
    "longitude": -122.165685,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 735,
    "city_name": "Gleneagles",
    "latitude": 49.367233,
    "longitude": -123.28142,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 736,
    "city_name": "Gleneden",
    "latitude": 50.728962,
    "longitude": -119.3428119,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 737,
    "city_name": "Glenemma",
    "latitude": 50.470425,
    "longitude": -119.354711,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 738,
    "city_name": "Glenlily",
    "latitude": 49.050135,
    "longitude": -116.16402,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 739,
    "city_name": "Glenmerry",
    "latitude": 49.099447,
    "longitude": -117.663155,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 740,
    "city_name": "Glenmore",
    "latitude": 49.898479,
    "longitude": -119.4552539,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 741,
    "city_name": "Glenogle",
    "latitude": 51.3460457,
    "longitude": -116.9479482,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 742,
    "city_name": "Glenora",
    "latitude": 57.837863,
    "longitude": -131.386695,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 743,
    "city_name": "Glenrosa",
    "latitude": 49.8336759,
    "longitude": -119.660518,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 744,
    "city_name": "Glentanna",
    "latitude": 54.866667,
    "longitude": -127.133333,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 745,
    "city_name": "Glimpse Lake",
    "latitude": 50.2477861,
    "longitude": -120.2732427,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 746,
    "city_name": "Goat River",
    "latitude": 53.53038,
    "longitude": -120.5950011,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 747,
    "city_name": "Goatfell",
    "latitude": 53.7266683,
    "longitude": -127.6476205,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 748,
    "city_name": "Gold Bridge",
    "latitude": 50.851194,
    "longitude": -122.839148,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 749,
    "city_name": "Gold River",
    "latitude": 49.7781637,
    "longitude": -126.0496148,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 750,
    "city_name": "Golden",
    "latitude": 51.2961188,
    "longitude": -116.9631367,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 751,
    "city_name": "Good Hope",
    "latitude": 59.281944,
    "longitude": -129.302778,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 752,
    "city_name": "Good Hope Lake",
    "latitude": 59.281944,
    "longitude": -129.302778,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 753,
    "city_name": "Goodlow",
    "latitude": 56.333333,
    "longitude": -120.133333,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 754,
    "city_name": "Goose Bay",
    "latitude": 51.380688,
    "longitude": -127.6570751,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 755,
    "city_name": "Gordon River",
    "latitude": 48.766667,
    "longitude": -124.333333,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 756,
    "city_name": "Gorge Harbour",
    "latitude": 50.1027088,
    "longitude": -125.0246492,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 757,
    "city_name": "Gosnell",
    "latitude": 53.7266683,
    "longitude": -127.6476205,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 758,
    "city_name": "Gossen Creek",
    "latitude": 54.5737959,
    "longitude": -128.4232442,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 759,
    "city_name": "Gossip Island",
    "latitude": 48.8901891,
    "longitude": -123.3207164,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 760,
    "city_name": "Gower Point",
    "latitude": 49.3862371,
    "longitude": -123.5332046,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 761,
    "city_name": "Graham",
    "latitude": 53.4317595,
    "longitude": -132.2621738,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 762,
    "city_name": "Graham Island",
    "latitude": 53.4317595,
    "longitude": -132.2621738,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 763,
    "city_name": "Gramsons",
    "latitude": 50.4491129,
    "longitude": -122.68765,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 764,
    "city_name": "Grand Forks",
    "latitude": 49.0300946,
    "longitude": -118.4451392,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 765,
    "city_name": "Grand Haven",
    "latitude": 56.239042,
    "longitude": -120.9001569,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 766,
    "city_name": "Grand Rapids",
    "latitude": 54.783333,
    "longitude": -124.8833329,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 767,
    "city_name": "Grand Trunk",
    "latitude": 53.8950961,
    "longitude": -122.7628796,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 768,
    "city_name": "Granduc",
    "latitude": 56.233333,
    "longitude": -130.1,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 769,
    "city_name": "Grandview Bench",
    "latitude": 50.65,
    "longitude": -119.15,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 770,
    "city_name": "Granisle",
    "latitude": 54.8845648,
    "longitude": -126.207158,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 771,
    "city_name": "Granite",
    "latitude": 49.492608,
    "longitude": -117.3695059,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 772,
    "city_name": "Granite Bay",
    "latitude": 50.236061,
    "longitude": -125.302275,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 773,
    "city_name": "Granite Falls",
    "latitude": 49.3747201,
    "longitude": -122.880095,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 774,
    "city_name": "Grant Brook",
    "latitude": 53.7266683,
    "longitude": -127.6476205,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 775,
    "city_name": "Grantham",
    "latitude": 49.76726,
    "longitude": -125.027025,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 776,
    "city_name": "Granthams Landing",
    "latitude": 49.413141,
    "longitude": -123.494103,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 777,
    "city_name": "Grasmere",
    "latitude": 49.099084,
    "longitude": -115.0838111,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 778,
    "city_name": "Grassy Plains",
    "latitude": 53.971874,
    "longitude": -125.8840671,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 779,
    "city_name": "Gravelle Ferry",
    "latitude": 49.2881159,
    "longitude": -123.1159381,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 780,
    "city_name": "Gray Creek",
    "latitude": 49.630122,
    "longitude": -116.784215,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 781,
    "city_name": "Great Central",
    "latitude": 49.323498,
    "longitude": -124.991758,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 782,
    "city_name": "Great Central Lake",
    "latitude": 49.370134,
    "longitude": -125.2049559,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 783,
    "city_name": "Greata",
    "latitude": 49.702654,
    "longitude": -119.742816,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 784,
    "city_name": "Green Cove",
    "latitude": 48.991071,
    "longitude": -124.978727,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 785,
    "city_name": "Green River",
    "latitude": 50.255068,
    "longitude": -122.8591203,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 786,
    "city_name": "Greendale",
    "latitude": 49.1201135,
    "longitude": -122.04558,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 787,
    "city_name": "Greenhills",
    "latitude": 50.0846392,
    "longitude": -114.871226,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 788,
    "city_name": "Greening",
    "latitude": 53.7266683,
    "longitude": -127.6476205,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 789,
    "city_name": "Greenville",
    "latitude": 55.032217,
    "longitude": -129.58121,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 790,
    "city_name": "Greenwood",
    "latitude": 49.0878955,
    "longitude": -118.6780998,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 791,
    "city_name": "Griffith",
    "latitude": 48.4341237,
    "longitude": -123.3914713,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 792,
    "city_name": "Grindrod",
    "latitude": 50.628095,
    "longitude": -119.123451,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 793,
    "city_name": "Groundbirch",
    "latitude": 55.781294,
    "longitude": -120.923192,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 794,
    "city_name": "Gun Lake",
    "latitude": 50.8731716,
    "longitude": -122.8782929,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 795,
    "city_name": "Gundy",
    "latitude": 55.606954,
    "longitude": -120.007125,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 796,
    "city_name": "Hagensborg",
    "latitude": 52.3908829,
    "longitude": -126.5422539,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 797,
    "city_name": "Hagwilget",
    "latitude": 55.258108,
    "longitude": -127.6031539,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 798,
    "city_name": "Haig",
    "latitude": 49.399414,
    "longitude": -121.4531641,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 799,
    "city_name": "Haina",
    "latitude": 53.2128758,
    "longitude": -132.0388007,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 800,
    "city_name": "Haisla",
    "latitude": 53.980374,
    "longitude": -128.648857,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 801,
    "city_name": "Halfmoon Bay",
    "latitude": 49.513965,
    "longitude": -123.905929,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 802,
    "city_name": "Halfway Ranch",
    "latitude": 56.494369,
    "longitude": -122.038773,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 803,
    "city_name": "Hall",
    "latitude": 49.3763379,
    "longitude": -117.2403369,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 804,
    "city_name": "Hanbury",
    "latitude": 49.4448526,
    "longitude": -123.6528625,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 805,
    "city_name": "Hanceville",
    "latitude": 51.919444,
    "longitude": -123.041667,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 806,
    "city_name": "Hansard",
    "latitude": 54.084209,
    "longitude": -121.863403,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 807,
    "city_name": "Happy Valley",
    "latitude": 48.416151,
    "longitude": -123.533169,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 808,
    "city_name": "Harbour Chines",
    "latitude": 49.267341,
    "longitude": -122.850204,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 809,
    "city_name": "Harbour Village",
    "latitude": 49.270865,
    "longitude": -122.809809,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 810,
    "city_name": "Hardwicke Island",
    "latitude": 50.4396712,
    "longitude": -125.8462694,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 811,
    "city_name": "Harmac",
    "latitude": 49.135467,
    "longitude": -123.858157,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 812,
    "city_name": "Harmer",
    "latitude": 49.178958,
    "longitude": -122.9372689,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 813,
    "city_name": "Harrison Hot Springs",
    "latitude": 49.3024727,
    "longitude": -121.7853114,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 814,
    "city_name": "Harrison Mills",
    "latitude": 49.241664,
    "longitude": -121.9458751,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 815,
    "city_name": "Harrogate",
    "latitude": 50.980883,
    "longitude": -116.4487609,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 816,
    "city_name": "Harrop",
    "latitude": 49.603512,
    "longitude": -117.061311,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 817,
    "city_name": "Hart Highlands",
    "latitude": 53.975,
    "longitude": -122.789766,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 818,
    "city_name": "Hartley Bay",
    "latitude": 53.423919,
    "longitude": -129.2535101,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 819,
    "city_name": "Harvey",
    "latitude": 49.2538576,
    "longitude": -122.738904,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 820,
    "city_name": "Harwood Island",
    "latitude": 49.8645426,
    "longitude": -124.6458321,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 821,
    "city_name": "Hasler Flat",
    "latitude": 55.608421,
    "longitude": -121.972089,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 822,
    "city_name": "Hastings-Sunrise",
    "latitude": 49.281126,
    "longitude": -123.044077,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 823,
    "city_name": "Hatzic",
    "latitude": 49.14963,
    "longitude": -122.255254,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 824,
    "city_name": "Hawkins Lake Subdivision",
    "latitude": 51.845661,
    "longitude": -120.9304694,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 825,
    "city_name": "Hawks",
    "latitude": 49.2393205,
    "longitude": -123.1270623,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 826,
    "city_name": "Haysport",
    "latitude": 54.182709,
    "longitude": -130.013504,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 827,
    "city_name": "Hayward",
    "latitude": 49.2019239,
    "longitude": -122.3875927,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 828,
    "city_name": "Hazelmere",
    "latitude": 49.031196,
    "longitude": -122.713393,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 829,
    "city_name": "Hazelton",
    "latitude": 55.2568166,
    "longitude": -127.6720019,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 830,
    "city_name": "Headquarters",
    "latitude": 49.764533,
    "longitude": -125.1116921,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 831,
    "city_name": "Headwaters Ranch",
    "latitude": 53.7266683,
    "longitude": -127.6476205,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 832,
    "city_name": "Health Bay",
    "latitude": 50.7,
    "longitude": -126.6,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 833,
    "city_name": "Hecate",
    "latitude": 49.850769,
    "longitude": -126.7461009,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 834,
    "city_name": "Hector",
    "latitude": 49.8645338,
    "longitude": -119.4909504,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 835,
    "city_name": "Hedley",
    "latitude": 49.357177,
    "longitude": -120.076544,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 836,
    "city_name": "Heffley Creek",
    "latitude": 50.8603971,
    "longitude": -120.2649133,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 837,
    "city_name": "Hells Gate",
    "latitude": 49.780665,
    "longitude": -121.451615,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 838,
    "city_name": "Hemlock Valley",
    "latitude": 49.376709,
    "longitude": -121.934807,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 839,
    "city_name": "Hendrix Lake",
    "latitude": 52.091965,
    "longitude": -120.7935249,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 840,
    "city_name": "Heriot Bay",
    "latitude": 50.1006379,
    "longitude": -125.216888,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 841,
    "city_name": "Hernando Island",
    "latitude": 49.9817276,
    "longitude": -124.9164341,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 842,
    "city_name": "Hesquiat",
    "latitude": 49.39422,
    "longitude": -126.4655751,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 843,
    "city_name": "Heydon Bay",
    "latitude": 50.583333,
    "longitude": -125.583333,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 844,
    "city_name": "Hickethier Ranch",
    "latitude": 56.512206,
    "longitude": -122.218456,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 845,
    "city_name": "Hicks",
    "latitude": 49.3401532,
    "longitude": -121.6994357,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 846,
    "city_name": "Highlands",
    "latitude": 48.5184625,
    "longitude": -123.4895031,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 847,
    "city_name": "Hillbank",
    "latitude": 48.7163115,
    "longitude": -123.6439571,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 848,
    "city_name": "Hillcrest",
    "latitude": 48.8,
    "longitude": -123.8,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 849,
    "city_name": "Hilliers",
    "latitude": 49.311453,
    "longitude": -124.48811,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 850,
    "city_name": "Hills",
    "latitude": 50.102589,
    "longitude": -117.48477,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 851,
    "city_name": "Hippa",
    "latitude": 53.53183,
    "longitude": -132.9586,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 852,
    "city_name": "Hiusta Meadow",
    "latitude": 58.041176,
    "longitude": -130.9465129,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 853,
    "city_name": "Hixon",
    "latitude": 53.416942,
    "longitude": -122.582528,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 854,
    "city_name": "Hkusam",
    "latitude": 50.383333,
    "longitude": -125.916667,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 855,
    "city_name": "Hodda",
    "latitude": 54.8943443,
    "longitude": -122.7919639,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 856,
    "city_name": "Holachten 8",
    "latitude": 49.2049293,
    "longitude": -122.0294141,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 857,
    "city_name": "Holberg",
    "latitude": 50.652272,
    "longitude": -128.0252939,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 858,
    "city_name": "Hollyburn",
    "latitude": 49.334523,
    "longitude": -123.156982,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 859,
    "city_name": "Holmwood",
    "latitude": 50.616667,
    "longitude": -119.95,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 860,
    "city_name": "Homfray Creek",
    "latitude": 50.3,
    "longitude": -124.633333,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 861,
    "city_name": "Honeymoon Bay",
    "latitude": 48.815585,
    "longitude": -124.170934,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 862,
    "city_name": "Honeymoon Creek",
    "latitude": 55.7596274,
    "longitude": -120.2376623,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 863,
    "city_name": "Hope",
    "latitude": 49.379491,
    "longitude": -121.4416917,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 864,
    "city_name": "Hope Bay",
    "latitude": 48.8026802,
    "longitude": -123.276987,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 865,
    "city_name": "Hope Island",
    "latitude": 50.9187195,
    "longitude": -127.8769597,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 866,
    "city_name": "Hopetown",
    "latitude": 50.924875,
    "longitude": -126.817695,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 867,
    "city_name": "Hopkins Landing",
    "latitude": 49.429255,
    "longitude": -123.480212,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 868,
    "city_name": "Hornby Island",
    "latitude": 49.5353712,
    "longitude": -124.6758784,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 869,
    "city_name": "Horse Creek",
    "latitude": 52.6857744,
    "longitude": -119.0319836,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 870,
    "city_name": "Horsefly",
    "latitude": 52.33273,
    "longitude": -121.417202,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 871,
    "city_name": "Hosmer",
    "latitude": 49.5885048,
    "longitude": -114.9615989,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 872,
    "city_name": "Hot Springs Cove",
    "latitude": 49.3683298,
    "longitude": -126.2723705,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 873,
    "city_name": "Houston",
    "latitude": 54.3979972,
    "longitude": -126.6482087,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 874,
    "city_name": "Howser",
    "latitude": 50.301146,
    "longitude": -116.9482161,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 875,
    "city_name": "Huble",
    "latitude": 54.210125,
    "longitude": -122.538609,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 876,
    "city_name": "Hudson's Hope",
    "latitude": 56.0357172,
    "longitude": -121.9038286,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 877,
    "city_name": "Hulatt",
    "latitude": 53.957588,
    "longitude": -123.762299,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 878,
    "city_name": "Hulcross",
    "latitude": 53.7266683,
    "longitude": -127.6476205,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 879,
    "city_name": "Hullcar",
    "latitude": 50.5,
    "longitude": -119.266667,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 880,
    "city_name": "Humpback Bay",
    "latitude": 53.9934291,
    "longitude": -130.4875214,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 881,
    "city_name": "Hunaechin Sechelt Band 11",
    "latitude": 50.2147321,
    "longitude": -123.9713352,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 882,
    "city_name": "Huntingdon",
    "latitude": 49.004121,
    "longitude": -122.2652403,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 883,
    "city_name": "Huntington",
    "latitude": 49.004121,
    "longitude": -122.2652403,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 884,
    "city_name": "Hunts Inlet",
    "latitude": 54.070717,
    "longitude": -130.448296,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 885,
    "city_name": "Hupel",
    "latitude": 50.616667,
    "longitude": -118.766667,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 886,
    "city_name": "Huscroft",
    "latitude": 49.014557,
    "longitude": -116.46739,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 887,
    "city_name": "Hutchinson",
    "latitude": 49.283155,
    "longitude": -123.1123026,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 888,
    "city_name": "Hutchison",
    "latitude": 49.283155,
    "longitude": -123.1123026,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 889,
    "city_name": "Hutton",
    "latitude": 53.981499,
    "longitude": -121.618103,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 890,
    "city_name": "Hyacinthe Bay",
    "latitude": 50.105421,
    "longitude": -125.2207766,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 891,
    "city_name": "Hyde Creek",
    "latitude": 50.583333,
    "longitude": -126.9999999,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 892,
    "city_name": "Hydraulic",
    "latitude": 52.616667,
    "longitude": -121.7,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 893,
    "city_name": "Hyland Post",
    "latitude": 57.650718,
    "longitude": -128.163209,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 894,
    "city_name": "Illecillewaet",
    "latitude": 51.221789,
    "longitude": -117.4215346,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 895,
    "city_name": "Imperial Ranchettes",
    "latitude": 53.7266683,
    "longitude": -127.6476205,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 896,
    "city_name": "Indian Rock",
    "latitude": 49.6546335,
    "longitude": -119.6287165,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 897,
    "city_name": "Ingenika Mine",
    "latitude": 56.696914,
    "longitude": -125.169901,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 898,
    "city_name": "Inkaneep",
    "latitude": 49.122614,
    "longitude": -119.509009,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 899,
    "city_name": "Inkitsaph",
    "latitude": 53.7266683,
    "longitude": -127.6476205,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 900,
    "city_name": "Invermere",
    "latitude": 50.5064562,
    "longitude": -116.0291433,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 901,
    "city_name": "Irvine",
    "latitude": 49.2831515,
    "longitude": -122.7603217,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 902,
    "city_name": "Irvines Landing",
    "latitude": 49.6329236,
    "longitude": -124.0575314,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 903,
    "city_name": "Iskut",
    "latitude": 57.833333,
    "longitude": -129.9833328,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 904,
    "city_name": "Island Cache",
    "latitude": 53.925305,
    "longitude": -122.739274,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 905,
    "city_name": "Isle Pierre",
    "latitude": 53.960566,
    "longitude": -123.234075,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 906,
    "city_name": "Jackfish Lake Subdivision",
    "latitude": 55.8844543,
    "longitude": -121.4090871,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 907,
    "city_name": "Jackman",
    "latitude": 52.9333606,
    "longitude": -119.3898153,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 908,
    "city_name": "Jackson Bay",
    "latitude": 50.514716,
    "longitude": -125.755104,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 909,
    "city_name": "Jacksons",
    "latitude": 57.616667,
    "longitude": -131.6833329,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 910,
    "city_name": "Jade City",
    "latitude": 59.258333,
    "longitude": -129.625,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 911,
    "city_name": "Jaffray",
    "latitude": 49.3708364,
    "longitude": -115.3019374,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 912,
    "city_name": "Jaleslie",
    "latitude": 49.2611461,
    "longitude": -123.1260327,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 913,
    "city_name": "James Island",
    "latitude": 48.6047009,
    "longitude": -123.3459708,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 914,
    "city_name": "Jayem",
    "latitude": 53.7266683,
    "longitude": -127.6476205,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 915,
    "city_name": "Jedway",
    "latitude": 52.3,
    "longitude": -131.2166671,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 916,
    "city_name": "Jellicoe",
    "latitude": 49.675937,
    "longitude": -120.282421,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 917,
    "city_name": "Jersey",
    "latitude": 49.1,
    "longitude": -117.2333329,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 918,
    "city_name": "Jervis Inlet",
    "latitude": 50.0560375,
    "longitude": -123.8145253,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 919,
    "city_name": "Jesmond",
    "latitude": 51.2485139,
    "longitude": -121.9566722,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 920,
    "city_name": "Jeune Landing",
    "latitude": 50.442893,
    "longitude": -127.4949369,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 921,
    "city_name": "Jim Smith Lake and Area",
    "latitude": 49.4822616,
    "longitude": -115.8465284,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 922,
    "city_name": "Johnson",
    "latitude": 49.409161,
    "longitude": -122.857668,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 923,
    "city_name": "Johnsons Landing",
    "latitude": 50.0803325,
    "longitude": -116.8791676,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 924,
    "city_name": "Jordan River",
    "latitude": 48.420459,
    "longitude": -124.044797,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 925,
    "city_name": "June Springs Estates",
    "latitude": 49.8128342,
    "longitude": -119.3835179,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 926,
    "city_name": "Juniper Ridge",
    "latitude": 50.6630211,
    "longitude": -120.2507928,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 927,
    "city_name": "Jura",
    "latitude": 49.533974,
    "longitude": -120.449418,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 928,
    "city_name": "Juskatla",
    "latitude": 53.6142502,
    "longitude": -132.312129,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 929,
    "city_name": "Kahntah",
    "latitude": 58.35614,
    "longitude": -120.9081901,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 930,
    "city_name": "Kahntah 3",
    "latitude": 58.3557043,
    "longitude": -120.9070516,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 931,
    "city_name": "Kaisun",
    "latitude": 53.0328014,
    "longitude": -132.4499879,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 932,
    "city_name": "Kakawis",
    "latitude": 49.188256,
    "longitude": -125.914074,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 933,
    "city_name": "Kalamalka",
    "latitude": 50.173685,
    "longitude": -119.330827,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 934,
    "city_name": "Kaleden",
    "latitude": 49.397805,
    "longitude": -119.6051351,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 935,
    "city_name": "Kaleva",
    "latitude": 50.6247184,
    "longitude": -126.9728561,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 936,
    "city_name": "Kallum",
    "latitude": 51.7386617,
    "longitude": -121.3630725,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 937,
    "city_name": "Kamloops",
    "latitude": 50.674522,
    "longitude": -120.3272675,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 1
  },
  {
    "id": 938,
    "city_name": "Kanaka",
    "latitude": 53.7266683,
    "longitude": -127.6476205,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 939,
    "city_name": "Kanaka Bar",
    "latitude": 50.115318,
    "longitude": -121.563842,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 940,
    "city_name": "Kaslo",
    "latitude": 49.9142499,
    "longitude": -116.9154503,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 941,
    "city_name": "Katz",
    "latitude": 49.3686135,
    "longitude": -121.5512291,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 942,
    "city_name": "Keating",
    "latitude": 48.56512,
    "longitude": -123.403472,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 943,
    "city_name": "Keats Island",
    "latitude": 49.3984929,
    "longitude": -123.4507319,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 944,
    "city_name": "Kedleston",
    "latitude": 50.31614,
    "longitude": -119.198396,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 945,
    "city_name": "Keefers",
    "latitude": 50.02459,
    "longitude": -121.530998,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 946,
    "city_name": "Keekwillie Trailer Park",
    "latitude": 49.2487935,
    "longitude": -122.9113808,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 947,
    "city_name": "Keithley Creek",
    "latitude": 52.766667,
    "longitude": -121.416667,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 948,
    "city_name": "Kelowna",
    "latitude": 49.8879519,
    "longitude": -119.4960106,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 1
  },
  {
    "id": 949,
    "city_name": "Kemano",
    "latitude": 53.560594,
    "longitude": -127.9397731,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 950,
    "city_name": "Kemano Beach",
    "latitude": 53.483333,
    "longitude": -128.116667,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 951,
    "city_name": "Kendrick Camp",
    "latitude": 49.741667,
    "longitude": -126.65,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 952,
    "city_name": "Kennedy",
    "latitude": 55.102188,
    "longitude": -122.797203,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 953,
    "city_name": "Kent",
    "latitude": 49.2515745,
    "longitude": -121.8553025,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 954,
    "city_name": "Keremeos",
    "latitude": 49.2024624,
    "longitude": -119.8294828,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 955,
    "city_name": "Kerr Creek",
    "latitude": 49.042179,
    "longitude": -118.746408,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 956,
    "city_name": "Kersley",
    "latitude": 52.818813,
    "longitude": -122.418658,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 957,
    "city_name": "Kettle Valley",
    "latitude": 49.056813,
    "longitude": -118.943446,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 958,
    "city_name": "Kidd",
    "latitude": 49.135531,
    "longitude": -123.103821,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 959,
    "city_name": "Kilbella Bay",
    "latitude": 51.7,
    "longitude": -127.333333,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 960,
    "city_name": "Kildala Arm",
    "latitude": 53.833333,
    "longitude": -128.4833329,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 961,
    "city_name": "Kildonan",
    "latitude": 49.003956,
    "longitude": -124.991681,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 962,
    "city_name": "Kilgard",
    "latitude": 49.067743,
    "longitude": -122.19357,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 963,
    "city_name": "Kilkerran",
    "latitude": 55.839841,
    "longitude": -120.27089,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 964,
    "city_name": "Killiney Beach",
    "latitude": 50.185915,
    "longitude": -119.505553,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 965,
    "city_name": "Killy",
    "latitude": 53.7266683,
    "longitude": -127.6476205,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 966,
    "city_name": "Kimberley",
    "latitude": 49.6651567,
    "longitude": -115.9967207,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 967,
    "city_name": "Kimsquit",
    "latitude": 52.833333,
    "longitude": -126.95,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 968,
    "city_name": "Kincolith",
    "latitude": 54.994444,
    "longitude": -129.9541671,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 969,
    "city_name": "Kingcome",
    "latitude": 50.966667,
    "longitude": -126.183333,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 970,
    "city_name": "Kingcome Inlet",
    "latitude": 50.95,
    "longitude": -126.2,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 971,
    "city_name": "Kingfisher",
    "latitude": 50.616667,
    "longitude": -118.733333,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 972,
    "city_name": "Kingsgate",
    "latitude": 49.006039,
    "longitude": -116.180387,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 973,
    "city_name": "Kingsvale",
    "latitude": 49.91135,
    "longitude": -120.906998,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 974,
    "city_name": "Kinnaird",
    "latitude": 49.27753,
    "longitude": -117.6486559,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 975,
    "city_name": "Kiskatinaw",
    "latitude": 55.6193298,
    "longitude": -120.479629,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 976,
    "city_name": "Kispiox",
    "latitude": 55.349017,
    "longitude": -127.6877799,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 977,
    "city_name": "Kispiox Valley",
    "latitude": 55.3030708,
    "longitude": -127.6919287,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 978,
    "city_name": "Kissick",
    "latitude": 53.7266683,
    "longitude": -127.6476205,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 979,
    "city_name": "Kitamaat Village",
    "latitude": 53.974585,
    "longitude": -128.647123,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 980,
    "city_name": "Kitchener",
    "latitude": 49.157992,
    "longitude": -116.335749,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 981,
    "city_name": "Kitimat",
    "latitude": 54.049366,
    "longitude": -128.6283529,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 982,
    "city_name": "Kitkatla",
    "latitude": 53.79448,
    "longitude": -130.4332191,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 983,
    "city_name": "Kitsault",
    "latitude": 55.454649,
    "longitude": -129.472385,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 984,
    "city_name": "Kitseguecla",
    "latitude": 55.083333,
    "longitude": -127.8333329,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 985,
    "city_name": "Kitselas",
    "latitude": 54.565681,
    "longitude": -128.462799,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 986,
    "city_name": "Kitsumkalum",
    "latitude": 54.518018,
    "longitude": -128.6371399,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 987,
    "city_name": "Kitty Coleman",
    "latitude": 49.788592,
    "longitude": -124.995709,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 988,
    "city_name": "Kitwanga",
    "latitude": 55.111672,
    "longitude": -128.0267756,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 989,
    "city_name": "Kiusta",
    "latitude": 54.1769399,
    "longitude": -133.0233669,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 990,
    "city_name": "Klaalth Sechelt Band 5",
    "latitude": 49.5036114,
    "longitude": -123.7470259,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 991,
    "city_name": "Klayekwim Sechelt Band 6",
    "latitude": 49.4741736,
    "longitude": -123.7545601,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 992,
    "city_name": "Klayekwim Sechelt Band 6A",
    "latitude": 49.7661436,
    "longitude": -123.7142631,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 993,
    "city_name": "Klayekwim Sechelt Band 7",
    "latitude": 49.7766969,
    "longitude": -123.7259765,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 994,
    "city_name": "Klayekwim Sechelt Band 8",
    "latitude": 49.7913516,
    "longitude": -123.7252393,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 995,
    "city_name": "Kleecoot",
    "latitude": 49.297288,
    "longitude": -124.948252,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 996,
    "city_name": "Kleena Kleene",
    "latitude": 51.936494,
    "longitude": -124.801922,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 997,
    "city_name": "Kleindale",
    "latitude": 49.633333,
    "longitude": -123.966667,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 998,
    "city_name": "Klemtu",
    "latitude": 52.5936331,
    "longitude": -128.5241004,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 999,
    "city_name": "Klua",
    "latitude": 58.11834,
    "longitude": -122.3521014,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1000,
    "city_name": "Knockholt",
    "latitude": 51.311086,
    "longitude": 0.1062,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1001,
    "city_name": "Knutsford",
    "latitude": 50.6334657,
    "longitude": -120.3141559,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 1002,
    "city_name": "Kobes",
    "latitude": 56.638889,
    "longitude": -121.65,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1003,
    "city_name": "Kokish",
    "latitude": 50.533333,
    "longitude": -126.85,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1004,
    "city_name": "Koksilah",
    "latitude": 48.758618,
    "longitude": -123.682508,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1005,
    "city_name": "Kootenay Bay",
    "latitude": 49.678417,
    "longitude": -116.870564,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1006,
    "city_name": "Kootenay Crossing",
    "latitude": 50.883351,
    "longitude": -116.049325,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1007,
    "city_name": "Kootenay Landing",
    "latitude": 50.0993712,
    "longitude": -115.7574143,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1008,
    "city_name": "Koster",
    "latitude": 53.7266683,
    "longitude": -127.6476205,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1009,
    "city_name": "Kragmont",
    "latitude": 49.174438,
    "longitude": -115.217632,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1010,
    "city_name": "Krestova",
    "latitude": 49.444242,
    "longitude": -117.58367,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1011,
    "city_name": "Kuldo",
    "latitude": 55.865834,
    "longitude": -127.902837,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1012,
    "city_name": "Kulkayu 4",
    "latitude": 53.4227131,
    "longitude": -129.263339,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1013,
    "city_name": "Kung",
    "latitude": 54.0501014,
    "longitude": -132.570432,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1014,
    "city_name": "Kuper Island",
    "latitude": 48.9703723,
    "longitude": -123.6446011,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1015,
    "city_name": "Kuskonook",
    "latitude": 49.300157,
    "longitude": -116.662017,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1016,
    "city_name": "Kwinitsa",
    "latitude": 54.3137181,
    "longitude": -130.3309406,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1017,
    "city_name": "Kye Bay",
    "latitude": 49.7025031,
    "longitude": -124.8674291,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1018,
    "city_name": "Kyuquot",
    "latitude": 50.0306331,
    "longitude": -127.3788125,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1019,
    "city_name": "Lac la Hache",
    "latitude": 51.812737,
    "longitude": -121.4720029,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1020,
    "city_name": "Lac Le Jeune",
    "latitude": 50.487363,
    "longitude": -120.495422,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1021,
    "city_name": "Lachkaltsap 9",
    "latitude": 53.7266683,
    "longitude": -127.6476205,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1022,
    "city_name": "Ladysmith",
    "latitude": 48.99534,
    "longitude": -123.8161,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 1023,
    "city_name": "Lafferty",
    "latitude": 53.7266683,
    "longitude": -127.6476205,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1024,
    "city_name": "Laidlaw",
    "latitude": 49.324288,
    "longitude": -121.615215,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1025,
    "city_name": "Lakahahmen 11",
    "latitude": 49.1842638,
    "longitude": -122.0756713,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1026,
    "city_name": "Lake Buntzen",
    "latitude": 49.375901,
    "longitude": -122.867806,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1027,
    "city_name": "Lake Country",
    "latitude": 50.0548556,
    "longitude": -119.4147883,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1028,
    "city_name": "Lake Cowichan",
    "latitude": 48.8258118,
    "longitude": -124.054167,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 1029,
    "city_name": "Lake Errock",
    "latitude": 49.220123,
    "longitude": -122.0112629,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1030,
    "city_name": "Lake Kathlyn",
    "latitude": 54.822355,
    "longitude": -127.219989,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1031,
    "city_name": "Lakelse",
    "latitude": 54.383333,
    "longitude": -128.516667,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1032,
    "city_name": "Lakelse Lake",
    "latitude": 54.370323,
    "longitude": -128.530987,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1033,
    "city_name": "Laketon",
    "latitude": 58.698054,
    "longitude": -130.1089589,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1034,
    "city_name": "Lakeview Heights",
    "latitude": 49.865994,
    "longitude": -119.53516,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1035,
    "city_name": "Lamming Mills",
    "latitude": 53.35,
    "longitude": -120.266667,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1036,
    "city_name": "Lang Bay",
    "latitude": 49.780189,
    "longitude": -124.350535,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1037,
    "city_name": "Langdale",
    "latitude": 49.433873,
    "longitude": -123.479057,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1038,
    "city_name": "Langford",
    "latitude": 48.4474626,
    "longitude": -123.4956337,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 1039,
    "city_name": "Langley",
    "latitude": 49.1041779,
    "longitude": -122.6603519,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 1
  },
  {
    "id": 1040,
    "city_name": "Lantzville",
    "latitude": 49.2506156,
    "longitude": -124.075031,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1041,
    "city_name": "Larch Hill",
    "latitude": 50.708848,
    "longitude": -119.135613,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1042,
    "city_name": "Lardeau",
    "latitude": 50.146025,
    "longitude": -116.954625,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1043,
    "city_name": "Larkin",
    "latitude": 49.2583176,
    "longitude": -123.2481377,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1044,
    "city_name": "Larsons Landing",
    "latitude": 49.983333,
    "longitude": -124.683333,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1045,
    "city_name": "Lasha",
    "latitude": 53.7266683,
    "longitude": -127.6476205,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1046,
    "city_name": "Lasqueti",
    "latitude": 49.483333,
    "longitude": -124.266667,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1047,
    "city_name": "Lasqueti Island",
    "latitude": 49.483333,
    "longitude": -124.266667,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1048,
    "city_name": "Lauretta",
    "latitude": 53.7266683,
    "longitude": -127.6476205,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1049,
    "city_name": "Lavington",
    "latitude": 50.23639,
    "longitude": -119.107243,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1050,
    "city_name": "Lawnhill",
    "latitude": 53.402108,
    "longitude": -131.9263869,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1051,
    "city_name": "Lax Kw'alaams",
    "latitude": 54.554381,
    "longitude": -130.43393,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1052,
    "city_name": "Lazo",
    "latitude": 49.7137664,
    "longitude": -124.910051,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1053,
    "city_name": "Leanchoil",
    "latitude": 51.2961188,
    "longitude": -116.9631367,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1054,
    "city_name": "Lebahdo",
    "latitude": 49.59214,
    "longitude": -117.5881859,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1055,
    "city_name": "Lee Creek",
    "latitude": 50.903539,
    "longitude": -119.5534689,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1056,
    "city_name": "Leechtown",
    "latitude": 48.493955,
    "longitude": -123.712449,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1057,
    "city_name": "Lees Corner",
    "latitude": 51.941465,
    "longitude": -123.100902,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1058,
    "city_name": "Legrand",
    "latitude": 53.405892,
    "longitude": -120.389518,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1059,
    "city_name": "Lejac",
    "latitude": 54.05657,
    "longitude": -124.737967,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1060,
    "city_name": "Lemon Creek",
    "latitude": 49.701882,
    "longitude": -117.489883,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1061,
    "city_name": "Lemoray",
    "latitude": 55.537789,
    "longitude": -122.483789,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1062,
    "city_name": "Lempriere",
    "latitude": 52.450172,
    "longitude": -119.132446,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1063,
    "city_name": "Leo Creek",
    "latitude": 55.08546,
    "longitude": -125.546578,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1064,
    "city_name": "Lexau Ranch",
    "latitude": 56.510006,
    "longitude": -122.1142301,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1065,
    "city_name": "Liard River",
    "latitude": 59.416667,
    "longitude": -126.083333,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1066,
    "city_name": "Liard River 3",
    "latitude": 59.9315819,
    "longitude": -128.5061617,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1067,
    "city_name": "Liersch",
    "latitude": 53.7266683,
    "longitude": -127.6476205,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1068,
    "city_name": "Lighthouse Point",
    "latitude": 48.870756,
    "longitude": -123.288866,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1069,
    "city_name": "Likely",
    "latitude": 52.616667,
    "longitude": -121.5500001,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1070,
    "city_name": "Lillooet",
    "latitude": 50.6863017,
    "longitude": -121.9367502,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 1071,
    "city_name": "Lily Lake",
    "latitude": 53.916667,
    "longitude": -124.5499999,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1072,
    "city_name": "Lime",
    "latitude": 49.2749176,
    "longitude": -123.1224948,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1073,
    "city_name": "Lincoln Park",
    "latitude": 49.278505,
    "longitude": -122.740491,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1074,
    "city_name": "Lindell Beach",
    "latitude": 49.034456,
    "longitude": -122.015837,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1075,
    "city_name": "Lindeman",
    "latitude": 59.7850441,
    "longitude": -135.087443,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1076,
    "city_name": "Line Creek",
    "latitude": 49.952283,
    "longitude": -114.7556627,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1077,
    "city_name": "Lions Bay",
    "latitude": 49.4592529,
    "longitude": -123.234139,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 3
  },
  {
    "id": 1078,
    "city_name": "Lister",
    "latitude": 49.050396,
    "longitude": -116.469498,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1079,
    "city_name": "Little Fort",
    "latitude": 51.4239653,
    "longitude": -120.2053428,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1080,
    "city_name": "Little River",
    "latitude": 49.734223,
    "longitude": -124.909888,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1081,
    "city_name": "Little Zeballos",
    "latitude": 49.988982,
    "longitude": -126.8532628,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1082,
    "city_name": "Lockeport",
    "latitude": 52.71788,
    "longitude": -131.8348921,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1083,
    "city_name": "Log Cabin",
    "latitude": 49.1322567,
    "longitude": -121.9400029,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1084,
    "city_name": "Logan Lake",
    "latitude": 50.4986205,
    "longitude": -121.0328413,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 1085,
    "city_name": "Lone Butte",
    "latitude": 51.554651,
    "longitude": -121.20105,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1086,
    "city_name": "Lone Prairie",
    "latitude": 55.567681,
    "longitude": -121.384058,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1087,
    "city_name": "Long Harbour",
    "latitude": 48.85,
    "longitude": -123.45,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1088,
    "city_name": "Longbeach",
    "latitude": 49.0688558,
    "longitude": -125.7538321,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1089,
    "city_name": "Longworth",
    "latitude": 53.916667,
    "longitude": -121.466667,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1090,
    "city_name": "Loon Lake",
    "latitude": 51.1238076,
    "longitude": -121.2053841,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1091,
    "city_name": "Loon Lake Subdivision",
    "latitude": 51.1238076,
    "longitude": -121.2053841,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1092,
    "city_name": "Loos",
    "latitude": 53.5997,
    "longitude": -120.702366,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1093,
    "city_name": "Louis Creek",
    "latitude": 51.138241,
    "longitude": -120.122278,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1094,
    "city_name": "Louise Island",
    "latitude": 52.9512936,
    "longitude": -131.7317657,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1095,
    "city_name": "Lower China Creek",
    "latitude": 49.215685,
    "longitude": -117.6833971,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1096,
    "city_name": "Lower Nicola",
    "latitude": 50.156549,
    "longitude": -120.8797919,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1097,
    "city_name": "Lower Post",
    "latitude": 59.923837,
    "longitude": -128.4863905,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1098,
    "city_name": "Lucas",
    "latitude": 49.6986969,
    "longitude": -123.1530568,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1099,
    "city_name": "Lucerne",
    "latitude": 52.85,
    "longitude": -118.55,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1100,
    "city_name": "Lulu Upper Similkameen Band 5",
    "latitude": 49.4026983,
    "longitude": -120.2282011,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1101,
    "city_name": "Lumberton",
    "latitude": 49.4242009,
    "longitude": -115.880233,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1102,
    "city_name": "Lumby",
    "latitude": 50.250699,
    "longitude": -118.967831,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 1103,
    "city_name": "Lund",
    "latitude": 49.9817127,
    "longitude": -124.7590955,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1104,
    "city_name": "Lust Subdivision",
    "latitude": 52.95378,
    "longitude": -122.4429219,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1105,
    "city_name": "Luxor",
    "latitude": 49.2678118,
    "longitude": -123.0086702,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1106,
    "city_name": "Lyell Island",
    "latitude": 52.6594626,
    "longitude": -131.531895,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1107,
    "city_name": "Lynx Creek",
    "latitude": 56.069238,
    "longitude": -121.8347701,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1108,
    "city_name": "Lytton",
    "latitude": 50.233258,
    "longitude": -121.581404,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 1109,
    "city_name": "Lytton 27B",
    "latitude": 50.2418155,
    "longitude": -121.6001709,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1110,
    "city_name": "Mabel Lake",
    "latitude": 50.5612599,
    "longitude": -118.7359302,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1111,
    "city_name": "Macalister",
    "latitude": 52.45,
    "longitude": -122.4,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1112,
    "city_name": "Macdonald",
    "latitude": 49.17759,
    "longitude": -123.1335939,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1113,
    "city_name": "Mackenzie",
    "latitude": 55.338446,
    "longitude": -123.0948068,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 1114,
    "city_name": "Mackin",
    "latitude": 49.2377686,
    "longitude": -122.8633377,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1115,
    "city_name": "MacNeill",
    "latitude": 50.590142,
    "longitude": -127.0847551,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1116,
    "city_name": "Madeira Park",
    "latitude": 49.617717,
    "longitude": -124.021013,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 1117,
    "city_name": "Magic Lake Estates",
    "latitude": 48.7613499,
    "longitude": -123.283821,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1118,
    "city_name": "Magna Bay",
    "latitude": 50.9651179,
    "longitude": -119.282764,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1119,
    "city_name": "Magnum Mine",
    "latitude": 58.5,
    "longitude": -125.166667,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1120,
    "city_name": "Mahatta River",
    "latitude": 50.457536,
    "longitude": -127.8016959,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1121,
    "city_name": "Mahmalillikullah",
    "latitude": 50.6214999,
    "longitude": -126.5715223,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1122,
    "city_name": "Mahood Falls",
    "latitude": 51.838738,
    "longitude": -120.64945,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1123,
    "city_name": "Makinson",
    "latitude": 50.067839,
    "longitude": -117.910786,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1124,
    "city_name": "Malahat",
    "latitude": 48.544839,
    "longitude": -123.5645412,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1125,
    "city_name": "Malakwa",
    "latitude": 50.938046,
    "longitude": -118.7944749,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1126,
    "city_name": "Malcolm Island",
    "latitude": 50.6447542,
    "longitude": -126.9948139,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1127,
    "city_name": "Malibu",
    "latitude": 50.165042,
    "longitude": -123.858264,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1128,
    "city_name": "Mamalilaculla",
    "latitude": 50.615768,
    "longitude": -126.5754009,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1129,
    "city_name": "Mammel Subdivision",
    "latitude": 53.7266683,
    "longitude": -127.6476205,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1130,
    "city_name": "Manning",
    "latitude": 49.0689289,
    "longitude": -120.9149345,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1131,
    "city_name": "Manning Park",
    "latitude": 49.064647,
    "longitude": -120.781581,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1132,
    "city_name": "Manson Creek",
    "latitude": 55.671712,
    "longitude": -124.487338,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1133,
    "city_name": "Mansons Landing",
    "latitude": 50.063706,
    "longitude": -124.981603,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1134,
    "city_name": "Mapes",
    "latitude": 53.883333,
    "longitude": -123.8666671,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1135,
    "city_name": "Maple Bay",
    "latitude": 48.817237,
    "longitude": -123.61511,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1136,
    "city_name": "Maple Ridge",
    "latitude": 49.2193226,
    "longitude": -122.5983981,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 1
  },
  {
    "id": 1137,
    "city_name": "Mara",
    "latitude": 50.7840144,
    "longitude": -119.0105146,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1138,
    "city_name": "Marblehead",
    "latitude": 50.25,
    "longitude": -116.966667,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1139,
    "city_name": "Margaret Bay",
    "latitude": 51.33292,
    "longitude": -127.489197,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1140,
    "city_name": "Marguerite",
    "latitude": 52.501475,
    "longitude": -122.4302779,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1141,
    "city_name": "Marigold",
    "latitude": 48.469782,
    "longitude": -123.388767,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1142,
    "city_name": "Marilla",
    "latitude": 53.701279,
    "longitude": -125.847423,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1143,
    "city_name": "Marktosis",
    "latitude": 49.2822034,
    "longitude": -126.0729446,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1144,
    "city_name": "Marne",
    "latitude": 48.4084366,
    "longitude": -123.3242669,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1145,
    "city_name": "Marron Valley",
    "latitude": 49.367931,
    "longitude": -119.673452,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1146,
    "city_name": "Marsh Creek Area",
    "latitude": 49.1448284,
    "longitude": -117.5199906,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1147,
    "city_name": "Martel",
    "latitude": 53.7266683,
    "longitude": -127.6476205,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1148,
    "city_name": "Marten Lake",
    "latitude": 50.0504912,
    "longitude": -116.5538606,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1149,
    "city_name": "Martin Prairie",
    "latitude": 50.6640749,
    "longitude": -119.812005,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1150,
    "city_name": "Martin Valley",
    "latitude": 49.7899414,
    "longitude": -119.5422662,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1151,
    "city_name": "Martinson",
    "latitude": 53.7266683,
    "longitude": -127.6476205,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1152,
    "city_name": "Marysville",
    "latitude": 49.6346194,
    "longitude": -115.9532473,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1153,
    "city_name": "Mason Creek",
    "latitude": 57.333333,
    "longitude": -122.783333,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1154,
    "city_name": "Masset",
    "latitude": 54.0114581,
    "longitude": -132.1471978,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 1155,
    "city_name": "Matilpi",
    "latitude": 50.55,
    "longitude": -126.183333,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1156,
    "city_name": "Matsqui Main 2",
    "latitude": 49.1082279,
    "longitude": -122.3489709,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1157,
    "city_name": "Maurelle Island",
    "latitude": 50.2839008,
    "longitude": -125.1446928,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1158,
    "city_name": "Mayne Island",
    "latitude": 48.8476105,
    "longitude": -123.2838913,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 1159,
    "city_name": "Mayook",
    "latitude": 49.483407,
    "longitude": -115.570803,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1160,
    "city_name": "McAbee",
    "latitude": 53.7266683,
    "longitude": -127.6476205,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1161,
    "city_name": "McBride",
    "latitude": 53.301347,
    "longitude": -120.168461,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 1162,
    "city_name": "McCabe",
    "latitude": 53.7266683,
    "longitude": -127.6476205,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1163,
    "city_name": "McCall",
    "latitude": 48.5018135,
    "longitude": -123.3843295,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1164,
    "city_name": "McCalls Landing",
    "latitude": 49.994952,
    "longitude": -124.015899,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1165,
    "city_name": "McConnel",
    "latitude": 49.157532,
    "longitude": -116.3367,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1166,
    "city_name": "McCracken",
    "latitude": 50.6727193,
    "longitude": -120.2946439,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1167,
    "city_name": "McCulloch",
    "latitude": 49.796409,
    "longitude": -119.19611,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1168,
    "city_name": "McDame",
    "latitude": 59.186423,
    "longitude": -129.2266129,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1169,
    "city_name": "McDonalds Landing",
    "latitude": 54,
    "longitude": -126.033333,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1170,
    "city_name": "McGillivray",
    "latitude": 50.6186972,
    "longitude": -122.4315096,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1171,
    "city_name": "McGregor",
    "latitude": 54.083333,
    "longitude": -121.8333329,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1172,
    "city_name": "McGuire",
    "latitude": 50.7038441,
    "longitude": -119.2766986,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1173,
    "city_name": "McKearney Ranch",
    "latitude": 56.630953,
    "longitude": -122.450263,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1174,
    "city_name": "McKinley Landing",
    "latitude": 49.960807,
    "longitude": -119.460056,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1175,
    "city_name": "McLean Ranch",
    "latitude": 56.513767,
    "longitude": -122.1444499,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1176,
    "city_name": "McLeese Lake",
    "latitude": 52.415371,
    "longitude": -122.289717,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1177,
    "city_name": "McLeod",
    "latitude": 54.993075,
    "longitude": -123.043873,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1178,
    "city_name": "McLeod Lake",
    "latitude": 54.993075,
    "longitude": -123.043873,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1179,
    "city_name": "McLeod Subdivision",
    "latitude": 53.7266683,
    "longitude": -127.6476205,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1180,
    "city_name": "McLure",
    "latitude": 51.05,
    "longitude": -120.233333,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1181,
    "city_name": "McMillan Island 6",
    "latitude": 49.1759118,
    "longitude": -122.56444,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1182,
    "city_name": "McMurdo",
    "latitude": 51.150756,
    "longitude": -116.767246,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1183,
    "city_name": "McMurphy",
    "latitude": 51.6672889,
    "longitude": -119.515984,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1184,
    "city_name": "McNab Creek",
    "latitude": 49.557069,
    "longitude": -123.3957229,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1185,
    "city_name": "Meachen",
    "latitude": 49.623159,
    "longitude": -116.267654,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1186,
    "city_name": "Meadow Creek",
    "latitude": 50.233333,
    "longitude": -116.983333,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1187,
    "city_name": "Meadows",
    "latitude": 49.2190648,
    "longitude": -122.6895165,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1188,
    "city_name": "Meares Island",
    "latitude": 49.1752746,
    "longitude": -125.8390856,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1189,
    "city_name": "Meem Quam Leese",
    "latitude": 50.619444,
    "longitude": -126.575,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1190,
    "city_name": "Meldrum",
    "latitude": 52.2029625,
    "longitude": -122.5360913,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1191,
    "city_name": "Meldrum Creek",
    "latitude": 52.110047,
    "longitude": -122.341299,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1192,
    "city_name": "Merritt",
    "latitude": 50.1113079,
    "longitude": -120.7862222,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 1193,
    "city_name": "Merton",
    "latitude": 54.5114474,
    "longitude": -122.9876873,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1194,
    "city_name": "Merville",
    "latitude": 49.79243,
    "longitude": -125.04846,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1195,
    "city_name": "Mesachie Lake",
    "latitude": 48.808933,
    "longitude": -124.124293,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1196,
    "city_name": "Messiter",
    "latitude": 51.9302917,
    "longitude": -119.3583487,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1197,
    "city_name": "Metchosin",
    "latitude": 48.382005,
    "longitude": -123.53785,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 1198,
    "city_name": "Metlakatla",
    "latitude": 54.337324,
    "longitude": -130.444669,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1199,
    "city_name": "Meziadin Junction",
    "latitude": 56.101389,
    "longitude": -129.3,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1200,
    "city_name": "Meziadin Subdivision",
    "latitude": 56.101389,
    "longitude": -129.3,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1201,
    "city_name": "Mica Creek",
    "latitude": 52.0058999,
    "longitude": -118.564275,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1202,
    "city_name": "Middlegate",
    "latitude": 49.219301,
    "longitude": -122.964741,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1203,
    "city_name": "Midway",
    "latitude": 49.0102185,
    "longitude": -118.7743535,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 1204,
    "city_name": "Mile 19 Overhead",
    "latitude": 53.7266683,
    "longitude": -127.6476205,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1205,
    "city_name": "Mile 62 1/2",
    "latitude": 56.371537,
    "longitude": -121.070046,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1206,
    "city_name": "Miller's Landing",
    "latitude": 49.3897369,
    "longitude": -123.329585,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 3
  },
  {
    "id": 1207,
    "city_name": "Millstream",
    "latitude": 48.494844,
    "longitude": -123.531205,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1208,
    "city_name": "Milnes Landing",
    "latitude": 48.392937,
    "longitude": -123.701406,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1209,
    "city_name": "Minaty Bay",
    "latitude": 49.612029,
    "longitude": -123.2134771,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1210,
    "city_name": "Minstrel Island",
    "latitude": 50.6202885,
    "longitude": -126.3231047,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1211,
    "city_name": "Minto Landing",
    "latitude": 49.198206,
    "longitude": -121.948762,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1212,
    "city_name": "Miocene",
    "latitude": 52.240633,
    "longitude": -121.7915299,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1213,
    "city_name": "Miracle Valley",
    "latitude": 49.255835,
    "longitude": -122.2476251,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1214,
    "city_name": "Mirror Lake",
    "latitude": 49.883176,
    "longitude": -116.899124,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1215,
    "city_name": "Missezula Lake",
    "latitude": 49.7814984,
    "longitude": -120.5109468,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1216,
    "city_name": "Mission",
    "latitude": 49.1329272,
    "longitude": -122.3261603,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 1217,
    "city_name": "Mission Island 2",
    "latitude": 49.1329272,
    "longitude": -122.3261603,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1218,
    "city_name": "Mitchell Bay",
    "latitude": 50.633333,
    "longitude": -126.85,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1219,
    "city_name": "Miworth",
    "latitude": 53.9574751,
    "longitude": -122.928676,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1220,
    "city_name": "Moberly",
    "latitude": 55.8233319,
    "longitude": -121.7888866,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1221,
    "city_name": "Moberly Lake",
    "latitude": 55.8233319,
    "longitude": -121.7888866,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1222,
    "city_name": "Moffat",
    "latitude": 52.2808179,
    "longitude": -121.4621364,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1223,
    "city_name": "Moha",
    "latitude": 50.872222,
    "longitude": -122.169444,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1224,
    "city_name": "Monias",
    "latitude": 56.0551787,
    "longitude": -121.239595,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1225,
    "city_name": "Mons",
    "latitude": 49.2534465,
    "longitude": -123.0301804,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1226,
    "city_name": "Montague Harbour",
    "latitude": 48.8924435,
    "longitude": -123.3894132,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1227,
    "city_name": "Monte Creek",
    "latitude": 50.64894,
    "longitude": -119.9564311,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 1228,
    "city_name": "Monte Lake",
    "latitude": 50.526671,
    "longitude": -119.827305,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1229,
    "city_name": "Montney",
    "latitude": 56.450045,
    "longitude": -120.926468,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1230,
    "city_name": "Montrose",
    "latitude": 49.0789717,
    "longitude": -117.5923651,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1231,
    "city_name": "Moose Heights",
    "latitude": 53.083551,
    "longitude": -122.4982269,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1232,
    "city_name": "Mooyah Bay",
    "latitude": 49.6322099,
    "longitude": -126.4580875,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1233,
    "city_name": "Moran",
    "latitude": 49.3697902,
    "longitude": -125.0259321,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1234,
    "city_name": "Moresby Camp",
    "latitude": 53.048796,
    "longitude": -132.0318999,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1235,
    "city_name": "Morey",
    "latitude": 53.7266683,
    "longitude": -127.6476205,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1236,
    "city_name": "Moricetown",
    "latitude": 55.033333,
    "longitude": -127.333333,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1237,
    "city_name": "Morrissey",
    "latitude": 49.392589,
    "longitude": -115.0141459,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1238,
    "city_name": "Mount Baldy",
    "latitude": 49.151417,
    "longitude": -119.2403279,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1239,
    "city_name": "Mount Currie",
    "latitude": 50.3163843,
    "longitude": -122.7173501,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1240,
    "city_name": "Mount Lehman",
    "latitude": 49.116741,
    "longitude": -122.4042878,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1241,
    "city_name": "Mount Robson",
    "latitude": 53.033859,
    "longitude": -119.231587,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1242,
    "city_name": "Mountain Station",
    "latitude": 49.484858,
    "longitude": -117.285835,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1243,
    "city_name": "Moyie",
    "latitude": 49.288053,
    "longitude": -115.833511,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1244,
    "city_name": "Mud River",
    "latitude": 53.766667,
    "longitude": -123.016667,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1245,
    "city_name": "Muncho Lake",
    "latitude": 58.926463,
    "longitude": -125.771076,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1246,
    "city_name": "Munro",
    "latitude": 48.4251848,
    "longitude": -123.3680609,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1247,
    "city_name": "Munroe",
    "latitude": 49.347072,
    "longitude": -122.6847183,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1248,
    "city_name": "Murdale",
    "latitude": 56.533333,
    "longitude": -121,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1249,
    "city_name": "Musgrave Landing",
    "latitude": 48.751919,
    "longitude": -123.545025,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1250,
    "city_name": "Muskwa",
    "latitude": 58.762522,
    "longitude": -122.6743869,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1251,
    "city_name": "Myra",
    "latitude": 49.803899,
    "longitude": -119.31185,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1252,
    "city_name": "Myrtle Point",
    "latitude": 49.798032,
    "longitude": -124.481112,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1253,
    "city_name": "Nadu",
    "latitude": 53.849772,
    "longitude": -132.115688,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1254,
    "city_name": "Nahmint",
    "latitude": 49.05,
    "longitude": -124.866667,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1255,
    "city_name": "Nahun",
    "latitude": 50.083326,
    "longitude": -119.498311,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1256,
    "city_name": "Nakusp",
    "latitude": 50.2398537,
    "longitude": -117.8011055,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 1257,
    "city_name": "Nalos Landing",
    "latitude": 53.7266683,
    "longitude": -127.6476205,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1258,
    "city_name": "Namu",
    "latitude": 51.8613857,
    "longitude": -127.8671337,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1259,
    "city_name": "Nanaimo",
    "latitude": 49.1658836,
    "longitude": -123.9400648,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 1
  },
  {
    "id": 1260,
    "city_name": "Nanoose Bay",
    "latitude": 49.2723165,
    "longitude": -124.1930531,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1261,
    "city_name": "Naramata",
    "latitude": 49.5962947,
    "longitude": -119.5956537,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 1262,
    "city_name": "Narcosli Creek",
    "latitude": 52.73888,
    "longitude": -122.5247381,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1263,
    "city_name": "Nasookin Road Subdivision",
    "latitude": 49.5407508,
    "longitude": -117.2624005,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1264,
    "city_name": "Nass Camp",
    "latitude": 55.282358,
    "longitude": -128.9931519,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1265,
    "city_name": "Natal",
    "latitude": 49.7897222,
    "longitude": -114.8238888,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1266,
    "city_name": "Nazko",
    "latitude": 53,
    "longitude": -123.616667,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1267,
    "city_name": "Nechako Centre",
    "latitude": 53.9651789,
    "longitude": -123.7222156,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1268,
    "city_name": "Nedoats 11",
    "latitude": 55.047307,
    "longitude": -126.3244548,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1269,
    "city_name": "Needles",
    "latitude": 49.874409,
    "longitude": -118.097549,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1270,
    "city_name": "Needley",
    "latitude": 53.7266683,
    "longitude": -127.6476205,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1271,
    "city_name": "Nelson",
    "latitude": 49.4928119,
    "longitude": -117.2948343,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 1272,
    "city_name": "Nelson Forks",
    "latitude": 59.497361,
    "longitude": -124.0085451,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1273,
    "city_name": "Nelson Island",
    "latitude": 49.7264515,
    "longitude": -124.1102331,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1274,
    "city_name": "Nelway",
    "latitude": 49.000447,
    "longitude": -117.299432,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1275,
    "city_name": "Nemiah Valley",
    "latitude": 51.483333,
    "longitude": -123.8833329,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1276,
    "city_name": "New Aiyansh",
    "latitude": 55.20578,
    "longitude": -129.07833,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1277,
    "city_name": "New Barkerville",
    "latitude": 53.0703513,
    "longitude": -121.5137657,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1278,
    "city_name": "New Bella Bella",
    "latitude": 52.20301,
    "longitude": -128.3383137,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1279,
    "city_name": "New Brighton",
    "latitude": 49.450159,
    "longitude": -123.4372871,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1280,
    "city_name": "New Clew",
    "latitude": 53.025879,
    "longitude": -131.781177,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1281,
    "city_name": "New Denver",
    "latitude": 49.99129,
    "longitude": -117.3720711,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1282,
    "city_name": "New Hazelton",
    "latitude": 55.247553,
    "longitude": -127.591578,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 1283,
    "city_name": "New Settlement",
    "latitude": 49.4166669,
    "longitude": -117.6166669,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1284,
    "city_name": "New Westminster",
    "latitude": 49.2057179,
    "longitude": -122.910956,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 1
  },
  {
    "id": 1285,
    "city_name": "Newcastle",
    "latitude": 49.181264,
    "longitude": -123.921879,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1286,
    "city_name": "Newgate",
    "latitude": 49.025716,
    "longitude": -115.197493,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1287,
    "city_name": "Newlands",
    "latitude": 54.1,
    "longitude": -122.2,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1288,
    "city_name": "Niagara",
    "latitude": 49.106313,
    "longitude": -118.466454,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1289,
    "city_name": "Nichol",
    "latitude": 49.5961973,
    "longitude": -119.5766683,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1290,
    "city_name": "Nicholson",
    "latitude": 51.2447783,
    "longitude": -116.9108391,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1291,
    "city_name": "Nicks Island",
    "latitude": 49.1207226,
    "longitude": -116.5969274,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1292,
    "city_name": "Nicola",
    "latitude": 50.163604,
    "longitude": -120.670557,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1293,
    "city_name": "Nicomen",
    "latitude": 49.2052777,
    "longitude": -122.12,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1294,
    "city_name": "Nig",
    "latitude": 57.133865,
    "longitude": -121.299249,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1295,
    "city_name": "Nigei Island",
    "latitude": 50.8797341,
    "longitude": -127.7234318,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1296,
    "city_name": "Nimpkish",
    "latitude": 50.332817,
    "longitude": -126.916935,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1297,
    "city_name": "Nimpkish Heights",
    "latitude": 50.566667,
    "longitude": -127,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1298,
    "city_name": "Nimpo Lake",
    "latitude": 52.333333,
    "longitude": -125.1500001,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1299,
    "city_name": "Ninstints",
    "latitude": 52.1,
    "longitude": -131.2166669,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1300,
    "city_name": "Niteal",
    "latitude": 53.7266683,
    "longitude": -127.6476205,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1301,
    "city_name": "Nootka",
    "latitude": 49.6842999,
    "longitude": -126.7894679,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1302,
    "city_name": "Nootka Island",
    "latitude": 49.6842999,
    "longitude": -126.7894679,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1303,
    "city_name": "Noralee",
    "latitude": 53.984195,
    "longitude": -126.433459,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1304,
    "city_name": "Norgate",
    "latitude": 49.322175,
    "longitude": -123.117561,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1305,
    "city_name": "Norlake",
    "latitude": 53.7266683,
    "longitude": -127.6476205,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1306,
    "city_name": "North Bend",
    "latitude": 49.882363,
    "longitude": -121.4558121,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1307,
    "city_name": "North Bonaparte",
    "latitude": 51.4,
    "longitude": -120.9166669,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1308,
    "city_name": "North Bulkley",
    "latitude": 54.483333,
    "longitude": -126.4833329,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1309,
    "city_name": "North Campbell River",
    "latitude": 50.052098,
    "longitude": -125.267304,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1310,
    "city_name": "North Cowichan",
    "latitude": 48.8428574,
    "longitude": -123.7044012,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 1311,
    "city_name": "North Galiano",
    "latitude": 48.9947099,
    "longitude": -123.5836656,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1312,
    "city_name": "North Kamloops",
    "latitude": 50.699279,
    "longitude": -120.3628221,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1313,
    "city_name": "North Nechako",
    "latitude": 53.9623637,
    "longitude": -122.8301001,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1314,
    "city_name": "North Pender Island",
    "latitude": 48.7866869,
    "longitude": -123.2893996,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1315,
    "city_name": "North Pine",
    "latitude": 56.420944,
    "longitude": -120.768367,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1316,
    "city_name": "North Poplar",
    "latitude": 49.0304688,
    "longitude": -122.3645051,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1317,
    "city_name": "North Saanich",
    "latitude": 48.6197483,
    "longitude": -123.4169098,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1318,
    "city_name": "North Star",
    "latitude": 49.3431921,
    "longitude": -115.2629821,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1319,
    "city_name": "North Vancouver",
    "latitude": 49.3199816,
    "longitude": -123.0724139,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 1320,
    "city_name": "Northfield",
    "latitude": 49.1919871,
    "longitude": -123.9867694,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1321,
    "city_name": "Northridge",
    "latitude": 49.702818,
    "longitude": -123.1384319,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1322,
    "city_name": "Norton",
    "latitude": 49.2812537,
    "longitude": -123.1162442,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1323,
    "city_name": "Notch Hill",
    "latitude": 50.85,
    "longitude": -119.433333,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1324,
    "city_name": "Nuchatlitz",
    "latitude": 49.8069489,
    "longitude": -126.9633782,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1325,
    "city_name": "Nukko Lake",
    "latitude": 54.083308,
    "longitude": -122.987465,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1326,
    "city_name": "Nulki",
    "latitude": 53.917135,
    "longitude": -124.2011289,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1327,
    "city_name": "Nursery",
    "latitude": 49.016667,
    "longitude": -118.4000001,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1328,
    "city_name": "Oak Bay",
    "latitude": 48.4264814,
    "longitude": -123.3141267,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 1329,
    "city_name": "Oak Hills",
    "latitude": 50.74518,
    "longitude": -120.35418,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1330,
    "city_name": "Oalthkyim Sechelt Band 4",
    "latitude": 49.5097946,
    "longitude": -123.7972687,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1331,
    "city_name": "Oasis",
    "latitude": 49.135216,
    "longitude": -117.7466549,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1332,
    "city_name": "Ocean Falls",
    "latitude": 52.354021,
    "longitude": -127.693746,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1333,
    "city_name": "Ocean Grove",
    "latitude": 49.950451,
    "longitude": -125.200831,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1334,
    "city_name": "O'Dell",
    "latitude": 53.7266683,
    "longitude": -127.6476205,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1335,
    "city_name": "Ogden",
    "latitude": 50.791327,
    "longitude": -122.831068,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1336,
    "city_name": "Okanagan Centre",
    "latitude": 50.045814,
    "longitude": -119.449845,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1337,
    "city_name": "Okanagan Falls",
    "latitude": 49.344885,
    "longitude": -119.5714929,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 1338,
    "city_name": "Okanagan Landing",
    "latitude": 50.239576,
    "longitude": -119.3388541,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1339,
    "city_name": "Okanagan Mission",
    "latitude": 49.822947,
    "longitude": -119.488761,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1340,
    "city_name": "O'Keefe",
    "latitude": 50.3647941,
    "longitude": -119.2811785,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1341,
    "city_name": "Olalla",
    "latitude": 49.260835,
    "longitude": -119.828762,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1342,
    "city_name": "Old Bella Bella",
    "latitude": 52.153924,
    "longitude": -128.1209571,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1343,
    "city_name": "Old Remo",
    "latitude": 54.47123,
    "longitude": -128.7102159,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1344,
    "city_name": "Old Town",
    "latitude": 49.549669,
    "longitude": -115.966677,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1345,
    "city_name": "Oliver",
    "latitude": 49.1823264,
    "longitude": -119.550428,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 1346,
    "city_name": "Oliver's Landing",
    "latitude": 49.583333,
    "longitude": -123.2208331,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1347,
    "city_name": "Olson",
    "latitude": 49.0486129,
    "longitude": -122.786857,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1348,
    "city_name": "Onward",
    "latitude": 53.7266683,
    "longitude": -127.6476205,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1349,
    "city_name": "Oona River",
    "latitude": 53.949473,
    "longitude": -130.259568,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1350,
    "city_name": "Ootischenia",
    "latitude": 49.283698,
    "longitude": -117.631439,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1351,
    "city_name": "Ootischenia Flats",
    "latitude": 49.283698,
    "longitude": -117.631439,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1352,
    "city_name": "Ootsa Lake",
    "latitude": 53.806821,
    "longitude": -126.042532,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1353,
    "city_name": "Opitsat",
    "latitude": 49.173504,
    "longitude": -125.90717,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1354,
    "city_name": "Osborn",
    "latitude": 56.603488,
    "longitude": -120.3804599,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1355,
    "city_name": "Osborn Bay",
    "latitude": 48.8647603,
    "longitude": -123.6378415,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1356,
    "city_name": "Osland",
    "latitude": 54.137204,
    "longitude": -130.160619,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1357,
    "city_name": "Osoyoos",
    "latitude": 49.032304,
    "longitude": -119.468163,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 1358,
    "city_name": "Osprey Lake",
    "latitude": 49.712762,
    "longitude": -120.2062635,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1359,
    "city_name": "Othello",
    "latitude": 49.380349,
    "longitude": -121.358322,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1360,
    "city_name": "Otter Bay",
    "latitude": 48.801034,
    "longitude": -123.315844,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1361,
    "city_name": "Otway",
    "latitude": 53.971055,
    "longitude": -122.873161,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1362,
    "city_name": "Oweekeno",
    "latitude": 51.680556,
    "longitude": -127.225,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1363,
    "city_name": "Owen Bay",
    "latitude": 50.316667,
    "longitude": -125.2166671,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1364,
    "city_name": "Owl Creek",
    "latitude": 50.34751,
    "longitude": -122.733194,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1365,
    "city_name": "Oyama",
    "latitude": 50.1106178,
    "longitude": -119.3872402,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1366,
    "city_name": "Oyster River",
    "latitude": 49.873264,
    "longitude": -125.132104,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1367,
    "city_name": "Pacific",
    "latitude": 54.76844,
    "longitude": -128.275454,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1368,
    "city_name": "Paldi",
    "latitude": 48.790476,
    "longitude": -123.852285,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1369,
    "city_name": "Palling",
    "latitude": 54.35,
    "longitude": -125.8833331,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1370,
    "city_name": "Palliser",
    "latitude": 50.7001072,
    "longitude": -115.3853176,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1371,
    "city_name": "Panorama",
    "latitude": 50.4583706,
    "longitude": -116.2384659,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 1372,
    "city_name": "Panorama Subdivision",
    "latitude": 50.4583706,
    "longitude": -116.2384659,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1373,
    "city_name": "Paradise Point",
    "latitude": 50.799636,
    "longitude": -119.1696229,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1374,
    "city_name": "Paradise Valley",
    "latitude": 49.819809,
    "longitude": -123.1555168,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1375,
    "city_name": "Park Siding",
    "latitude": 49.173674,
    "longitude": -117.495296,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1376,
    "city_name": "Parkland",
    "latitude": 55.912567,
    "longitude": -120.57115,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1377,
    "city_name": "Parksville",
    "latitude": 49.3193375,
    "longitude": -124.3136411,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 1378,
    "city_name": "Parson",
    "latitude": 51.070135,
    "longitude": -116.634861,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1379,
    "city_name": "Pasley Island",
    "latitude": 49.366334,
    "longitude": -123.4613322,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1380,
    "city_name": "Pass Creek",
    "latitude": 49.388589,
    "longitude": -117.679178,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1381,
    "city_name": "Passmore",
    "latitude": 49.537594,
    "longitude": -117.644185,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1382,
    "city_name": "Paterson",
    "latitude": 49.006832,
    "longitude": -117.83438,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1383,
    "city_name": "Paul Lake",
    "latitude": 50.7395537,
    "longitude": -120.1174855,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1384,
    "city_name": "Paulson",
    "latitude": 49.203633,
    "longitude": -118.117098,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1385,
    "city_name": "Pavey",
    "latitude": 53.7266683,
    "longitude": -127.6476205,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1386,
    "city_name": "Pavilion",
    "latitude": 50.883894,
    "longitude": -121.822792,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1387,
    "city_name": "Paxton Valley",
    "latitude": 50.5586486,
    "longitude": -119.7191967,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1388,
    "city_name": "Paykulkum Sechelt Band 14",
    "latitude": 49.4741736,
    "longitude": -123.7545601,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1389,
    "city_name": "Peachland",
    "latitude": 49.7702994,
    "longitude": -119.74079,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 1390,
    "city_name": "Peejay",
    "latitude": 56.884459,
    "longitude": -120.616075,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1391,
    "city_name": "Pemberton",
    "latitude": 50.322028,
    "longitude": -122.8050498,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 1392,
    "city_name": "Pemberton Heights",
    "latitude": 49.32767,
    "longitude": -123.107655,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1393,
    "city_name": "Pemberton Meadows",
    "latitude": 50.442341,
    "longitude": -122.91377,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1394,
    "city_name": "Pender Island",
    "latitude": 48.7866869,
    "longitude": -123.2893996,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 1395,
    "city_name": "Pendleton Bay",
    "latitude": 54.516667,
    "longitude": -125.7166669,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1396,
    "city_name": "Pennington",
    "latitude": 49.4991381,
    "longitude": -119.5937077,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1397,
    "city_name": "Penny",
    "latitude": 53.8433618,
    "longitude": -121.2924098,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1398,
    "city_name": "Penticton",
    "latitude": 49.4991381,
    "longitude": -119.5937077,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 1399,
    "city_name": "Perow",
    "latitude": 54.516667,
    "longitude": -126.4333329,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1400,
    "city_name": "Perrys",
    "latitude": 49.668741,
    "longitude": -117.5036989,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1401,
    "city_name": "Peterson",
    "latitude": 49.2861863,
    "longitude": -123.1254321,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1402,
    "city_name": "Phillips Arm",
    "latitude": 50.552082,
    "longitude": -125.3532439,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1403,
    "city_name": "Phoenix",
    "latitude": 49.098458,
    "longitude": -118.590177,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1404,
    "city_name": "Piers Island",
    "latitude": 48.7039068,
    "longitude": -123.4134259,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1405,
    "city_name": "Pilot Bay",
    "latitude": 49.6572059,
    "longitude": -116.8764681,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1406,
    "city_name": "Pinantan Lake",
    "latitude": 50.724929,
    "longitude": -120.033542,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1407,
    "city_name": "Pinchi",
    "latitude": 54.566667,
    "longitude": -124.5,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1408,
    "city_name": "Pinchi Lake",
    "latitude": 54.627956,
    "longitude": -124.404853,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1409,
    "city_name": "Pinegrove",
    "latitude": 53.066667,
    "longitude": -121.95,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1410,
    "city_name": "Pinesul",
    "latitude": 53.7266683,
    "longitude": -127.6476205,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1411,
    "city_name": "Pinewood Subdivision",
    "latitude": 53.8920922,
    "longitude": -122.7880811,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1412,
    "city_name": "Pink Mountain",
    "latitude": 57.0713888,
    "longitude": -122.8747222,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1413,
    "city_name": "Pioneer Mine",
    "latitude": 50.757384,
    "longitude": -122.780449,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1414,
    "city_name": "Pitquah",
    "latitude": 53.7266683,
    "longitude": -127.6476205,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1415,
    "city_name": "Pitt Meadows",
    "latitude": 49.2190648,
    "longitude": -122.6895165,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 1416,
    "city_name": "Pixie Beach",
    "latitude": 50.071336,
    "longitude": -119.44508,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1417,
    "city_name": "Playmor Junction",
    "latitude": 49.45,
    "longitude": -117.533333,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1418,
    "city_name": "Pleasant Camp",
    "latitude": 59.504408,
    "longitude": -136.463234,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1419,
    "city_name": "Plumper Harbour",
    "latitude": 49.683333,
    "longitude": -126.633333,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1420,
    "city_name": "Point Holmes",
    "latitude": 49.692328,
    "longitude": -124.8682237,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1421,
    "city_name": "Polley",
    "latitude": 52.5566666,
    "longitude": -121.6358333,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1422,
    "city_name": "Pope Landing",
    "latitude": 49.619812,
    "longitude": -124.0600719,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1423,
    "city_name": "Popkum",
    "latitude": 49.203594,
    "longitude": -121.738439,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1424,
    "city_name": "Poplar Creek",
    "latitude": 50.4166669,
    "longitude": -117.133333,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1425,
    "city_name": "Poplar Grove",
    "latitude": 49.5123363,
    "longitude": -119.5738472,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1426,
    "city_name": "Porcher Island",
    "latitude": 53.9934291,
    "longitude": -130.4875214,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1427,
    "city_name": "Porpoise Bay",
    "latitude": 49.5065188,
    "longitude": -123.7469444,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1428,
    "city_name": "Port Alberni",
    "latitude": 49.2338882,
    "longitude": -124.8055494,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 1429,
    "city_name": "Port Albion",
    "latitude": 48.951935,
    "longitude": -125.5450221,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1430,
    "city_name": "Port Alice",
    "latitude": 50.4254289,
    "longitude": -127.4877075,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 1431,
    "city_name": "Port Clements",
    "latitude": 53.6887137,
    "longitude": -132.1847553,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1432,
    "city_name": "Port Coquitlam",
    "latitude": 49.2628382,
    "longitude": -122.7810708,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 1
  },
  {
    "id": 1433,
    "city_name": "Port Douglas",
    "latitude": 49.766667,
    "longitude": -122.166667,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1434,
    "city_name": "Port Edward",
    "latitude": 54.1956849,
    "longitude": -130.1153024,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1435,
    "city_name": "Port Essington",
    "latitude": 54.15,
    "longitude": -129.966667,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1436,
    "city_name": "Port Hammond - Haney",
    "latitude": 49.2170148,
    "longitude": -122.6227601,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1437,
    "city_name": "Port Hardy",
    "latitude": 50.7123867,
    "longitude": -127.460393,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 1438,
    "city_name": "Port Kells",
    "latitude": 49.170087,
    "longitude": -122.705324,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1439,
    "city_name": "Port McNeill",
    "latitude": 50.590142,
    "longitude": -127.0847551,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 1440,
    "city_name": "Port Mellon",
    "latitude": 49.5217479,
    "longitude": -123.4880589,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1441,
    "city_name": "Port Moody",
    "latitude": 49.2849107,
    "longitude": -122.8677562,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 1442,
    "city_name": "Port Neville",
    "latitude": 50.4929341,
    "longitude": -126.0858154,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1443,
    "city_name": "Port Renfrew",
    "latitude": 48.552966,
    "longitude": -124.422299,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 1444,
    "city_name": "Port Simpson",
    "latitude": 54.554381,
    "longitude": -130.43393,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1445,
    "city_name": "Port Washington",
    "latitude": 48.815559,
    "longitude": -123.318612,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1446,
    "city_name": "Porteau",
    "latitude": 49.557304,
    "longitude": -123.232734,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1447,
    "city_name": "Porteous",
    "latitude": 53.7266683,
    "longitude": -127.6476205,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1448,
    "city_name": "Porter Landing",
    "latitude": 58.800907,
    "longitude": -130.101152,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1449,
    "city_name": "Portland Island",
    "latitude": 48.721447,
    "longitude": -123.3770195,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1450,
    "city_name": "Porto Rico",
    "latitude": 49.331291,
    "longitude": -117.244673,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1451,
    "city_name": "Poser",
    "latitude": 53.7266683,
    "longitude": -127.6476205,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1452,
    "city_name": "Postill",
    "latitude": 49.9928879,
    "longitude": -119.2090493,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1453,
    "city_name": "Potter",
    "latitude": 49.0888788,
    "longitude": -122.6923915,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1454,
    "city_name": "Pouce Coupe",
    "latitude": 55.7161664,
    "longitude": -120.1338865,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1455,
    "city_name": "Powell River",
    "latitude": 49.8352352,
    "longitude": -124.5247061,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 1456,
    "city_name": "Powers Addition",
    "latitude": 53.7266683,
    "longitude": -127.6476205,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1457,
    "city_name": "Prairie Valley",
    "latitude": 49.594305,
    "longitude": -119.70566,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1458,
    "city_name": "Premier",
    "latitude": 56.050921,
    "longitude": -130.028249,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1459,
    "city_name": "Premier Lake",
    "latitude": 49.95,
    "longitude": -115.65,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1460,
    "city_name": "Prespatou",
    "latitude": 56.92158,
    "longitude": -121.0607481,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1461,
    "city_name": "Pressy Lake",
    "latitude": 51.3754309,
    "longitude": -121.0374781,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1462,
    "city_name": "Prince George",
    "latitude": 53.9170641,
    "longitude": -122.7496693,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 1
  },
  {
    "id": 1463,
    "city_name": "Prince Rupert",
    "latitude": 54.3150367,
    "longitude": -130.3208187,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 1464,
    "city_name": "Princeton",
    "latitude": 49.4589588,
    "longitude": -120.5061567,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 1465,
    "city_name": "Pritchard",
    "latitude": 50.6864291,
    "longitude": -119.8190069,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1466,
    "city_name": "Procter",
    "latitude": 49.618452,
    "longitude": -116.959232,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1467,
    "city_name": "Progress",
    "latitude": 55.782474,
    "longitude": -120.7161309,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1468,
    "city_name": "Promontory",
    "latitude": 49.1038053,
    "longitude": -121.9351391,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1469,
    "city_name": "Prophet River",
    "latitude": 58.090975,
    "longitude": -122.7095109,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1470,
    "city_name": "Prospect Lake",
    "latitude": 48.523842,
    "longitude": -123.438695,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1471,
    "city_name": "Protection Island",
    "latitude": 49.1796297,
    "longitude": -123.9198495,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1472,
    "city_name": "Punchaw",
    "latitude": 53.433333,
    "longitude": -123.1833329,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1473,
    "city_name": "Puntledge",
    "latitude": 49.660904,
    "longitude": -125.0568021,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 3
  },
  {
    "id": 1474,
    "city_name": "Purden Lake",
    "latitude": 53.9214966,
    "longitude": -121.9041388,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1475,
    "city_name": "Pyramid",
    "latitude": 49.1093202,
    "longitude": -116.5227438,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1476,
    "city_name": "Quadra Island",
    "latitude": 50.2057635,
    "longitude": -125.2682421,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 1477,
    "city_name": "Qualicum Bay",
    "latitude": 49.396248,
    "longitude": -124.610053,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1478,
    "city_name": "Qualicum Beach",
    "latitude": 49.3482346,
    "longitude": -124.4428262,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 1479,
    "city_name": "Quamichan",
    "latitude": 48.8044491,
    "longitude": -123.6577671,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1480,
    "city_name": "Quathiaski Cove",
    "latitude": 50.051056,
    "longitude": -125.2185621,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 1481,
    "city_name": "Quatsino",
    "latitude": 50.535387,
    "longitude": -127.654504,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1482,
    "city_name": "Quaw",
    "latitude": 54.9378862,
    "longitude": -122.9787857,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1483,
    "city_name": "Queen Charlotte City",
    "latitude": 53.2549952,
    "longitude": -132.0868676,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1484,
    "city_name": "Queens Bay",
    "latitude": 49.65673,
    "longitude": -116.932872,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1485,
    "city_name": "Queens Cove",
    "latitude": 49.884993,
    "longitude": -126.985584,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1486,
    "city_name": "Quesnel",
    "latitude": 52.9817372,
    "longitude": -122.4949058,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 1487,
    "city_name": "Quesnel Canyon",
    "latitude": 52.9970227,
    "longitude": -122.3921974,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1488,
    "city_name": "Quesnel Forks",
    "latitude": 52.6666669,
    "longitude": -121.666667,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1489,
    "city_name": "Quesnel View",
    "latitude": 52.954444,
    "longitude": -122.517734,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1490,
    "city_name": "Quick",
    "latitude": 54.695016,
    "longitude": -127.04761,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1491,
    "city_name": "Quilchena",
    "latitude": 50.171252,
    "longitude": -120.491475,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1492,
    "city_name": "Quinsam",
    "latitude": 49.983168,
    "longitude": -125.4325859,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1493,
    "city_name": "Radium",
    "latitude": 50.6200385,
    "longitude": -116.0733586,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1494,
    "city_name": "Radium Hot Springs",
    "latitude": 50.6200385,
    "longitude": -116.0733586,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 1495,
    "city_name": "Raft River",
    "latitude": 51.6868484,
    "longitude": -119.7645482,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1496,
    "city_name": "Rail Lake",
    "latitude": 51.9435151,
    "longitude": -121.4692406,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1497,
    "city_name": "Rainy Hollow",
    "latitude": 59.55,
    "longitude": -136.5333331,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1498,
    "city_name": "Ranchero",
    "latitude": 50.6521789,
    "longitude": -119.1934641,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1499,
    "city_name": "Raspberry",
    "latitude": 49.334123,
    "longitude": -117.6576161,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1500,
    "city_name": "Raush Valley",
    "latitude": 53.153525,
    "longitude": -119.9173894,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1501,
    "city_name": "Rayleigh",
    "latitude": 50.8152093,
    "longitude": -120.3074348,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 3
  },
  {
    "id": 1502,
    "city_name": "Read Island",
    "latitude": 50.1868849,
    "longitude": -125.091656,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1503,
    "city_name": "Reclaim",
    "latitude": 49.2720389,
    "longitude": -123.0761415,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1504,
    "city_name": "Red Bluff",
    "latitude": 52.9643609,
    "longitude": -122.4675381,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1505,
    "city_name": "Red Mountain",
    "latitude": 49.0919444,
    "longitude": -117.8211111,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1506,
    "city_name": "Red Pass",
    "latitude": 52.9867872,
    "longitude": -119.0084552,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1507,
    "city_name": "Red Rock",
    "latitude": 53.680113,
    "longitude": -122.672359,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1508,
    "city_name": "Red Rose",
    "latitude": 55.132173,
    "longitude": -127.625854,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1509,
    "city_name": "Redgrave",
    "latitude": 52.361491,
    "longitude": 1.001518,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1510,
    "city_name": "Redroofs",
    "latitude": 49.498988,
    "longitude": -123.909926,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1511,
    "city_name": "Redstone",
    "latitude": 52.124665,
    "longitude": -123.681047,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1512,
    "city_name": "Refuge Cove",
    "latitude": 50.1237487,
    "longitude": -124.8390156,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1513,
    "city_name": "Reid Lake",
    "latitude": 53.966667,
    "longitude": -123.1000001,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1514,
    "city_name": "Remac",
    "latitude": 49.029226,
    "longitude": -117.386555,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1515,
    "city_name": "Remo",
    "latitude": 54.483333,
    "longitude": -128.7166669,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1516,
    "city_name": "Renata",
    "latitude": 49.433203,
    "longitude": -118.104138,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1517,
    "city_name": "Retallack",
    "latitude": 50.042169,
    "longitude": -117.1476449,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1518,
    "city_name": "Retaskit",
    "latitude": 49.8121465,
    "longitude": -124.5241712,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1519,
    "city_name": "Revelstoke",
    "latitude": 50.998115,
    "longitude": -118.195672,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 1520,
    "city_name": "Rhone",
    "latitude": 49.227431,
    "longitude": -119.019141,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1521,
    "city_name": "Rich Bar",
    "latitude": 52.915703,
    "longitude": -122.4563269,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1522,
    "city_name": "Richmond",
    "latitude": 49.1665898,
    "longitude": -123.133569,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 1
  },
  {
    "id": 1523,
    "city_name": "Rider",
    "latitude": 49.144797,
    "longitude": -122.849772,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1524,
    "city_name": "Ridgedale",
    "latitude": 49.125513,
    "longitude": -122.238633,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1525,
    "city_name": "Ridley",
    "latitude": 54.2245579,
    "longitude": -130.3250453,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1526,
    "city_name": "Riley",
    "latitude": 49.240486,
    "longitude": -123.101472,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1527,
    "city_name": "Riondel",
    "latitude": 49.763677,
    "longitude": -116.856438,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1528,
    "city_name": "Riske Creek",
    "latitude": 51.968415,
    "longitude": -122.529743,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1529,
    "city_name": "Ritchie",
    "latitude": 49.1396888,
    "longitude": -122.0581203,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1530,
    "city_name": "River Jordan",
    "latitude": 48.420459,
    "longitude": -124.044797,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1531,
    "city_name": "River Springs",
    "latitude": 49.2896309,
    "longitude": -122.7671465,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1532,
    "city_name": "Rivers Inlet",
    "latitude": 51.683333,
    "longitude": -127.2500001,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1533,
    "city_name": "Riverside",
    "latitude": 49.121827,
    "longitude": -122.300132,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1534,
    "city_name": "Rivervale",
    "latitude": 49.125114,
    "longitude": -117.738265,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1535,
    "city_name": "Roberts Creek",
    "latitude": 49.4301881,
    "longitude": -123.6495116,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 3
  },
  {
    "id": 1536,
    "city_name": "Robin Creek",
    "latitude": 54.6630023,
    "longitude": -126.869183,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1537,
    "city_name": "Robson",
    "latitude": 49.3327426,
    "longitude": -117.689958,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1538,
    "city_name": "Robson West",
    "latitude": 49.3416156,
    "longitude": -117.7230586,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1539,
    "city_name": "Rock Bay",
    "latitude": 50.324603,
    "longitude": -125.4673309,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1540,
    "city_name": "Rock Creek",
    "latitude": 49.0559264,
    "longitude": -118.9976834,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1541,
    "city_name": "Rockyview",
    "latitude": 49.500793,
    "longitude": -115.795038,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1542,
    "city_name": "Roe Lake",
    "latitude": 51.5147509,
    "longitude": -120.83353,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1543,
    "city_name": "Rogers",
    "latitude": 51.483333,
    "longitude": -117.4833331,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1544,
    "city_name": "Rogers Pass",
    "latitude": 51.299982,
    "longitude": -117.518662,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1545,
    "city_name": "Rolla",
    "latitude": 55.897988,
    "longitude": -120.1404949,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1546,
    "city_name": "Roosville",
    "latitude": 49.00072,
    "longitude": -115.0554019,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1547,
    "city_name": "Rose Harbour",
    "latitude": 52.14638,
    "longitude": -131.0765649,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1548,
    "city_name": "Rose Lake",
    "latitude": 54.4,
    "longitude": -126.033333,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1549,
    "city_name": "Rose Prairie",
    "latitude": 56.5066064,
    "longitude": -120.8175452,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1550,
    "city_name": "Rosebery",
    "latitude": 50.033314,
    "longitude": -117.413531,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1551,
    "city_name": "Rosedale",
    "latitude": 49.1783398,
    "longitude": -121.8710926,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 3
  },
  {
    "id": 1552,
    "city_name": "Ross Peak",
    "latitude": 51.245,
    "longitude": -117.56,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1553,
    "city_name": "Ross Spur",
    "latitude": 49.18213,
    "longitude": -117.462639,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1554,
    "city_name": "Rossland",
    "latitude": 49.0781415,
    "longitude": -117.8000037,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 1555,
    "city_name": "Rosswood",
    "latitude": 54.804917,
    "longitude": -128.763918,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1556,
    "city_name": "Round Lake",
    "latitude": 54.666667,
    "longitude": -126.9166671,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1557,
    "city_name": "Round Prairie",
    "latitude": 50.06771,
    "longitude": -114.922772,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1558,
    "city_name": "Roy",
    "latitude": 50.516667,
    "longitude": -125.533333,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1559,
    "city_name": "Royston",
    "latitude": 49.6458193,
    "longitude": -124.9464183,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1560,
    "city_name": "Ruby Creek",
    "latitude": 49.35,
    "longitude": -121.6,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1561,
    "city_name": "Rumble Beach",
    "latitude": 50.429326,
    "longitude": -127.485624,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1562,
    "city_name": "Rupert",
    "latitude": 54.3150367,
    "longitude": -130.3208187,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1563,
    "city_name": "Rushmere",
    "latitude": 50.5064562,
    "longitude": -116.0291433,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1564,
    "city_name": "Rutland",
    "latitude": 49.8900242,
    "longitude": -119.3954476,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1565,
    "city_name": "Ryan",
    "latitude": 49.157589,
    "longitude": -116.0094989,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1566,
    "city_name": "Ryder Lake",
    "latitude": 49.107442,
    "longitude": -121.8939634,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1567,
    "city_name": "Rykerts",
    "latitude": 49.002415,
    "longitude": -116.500006,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1568,
    "city_name": "Saanich",
    "latitude": 48.4592626,
    "longitude": -123.3767223,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 1569,
    "city_name": "Saanichton",
    "latitude": 48.5962689,
    "longitude": -123.4169023,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1570,
    "city_name": "Saddle Rock",
    "latitude": 49.6305481,
    "longitude": -121.3954433,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1571,
    "city_name": "Sahali",
    "latitude": 50.648178,
    "longitude": -120.340229,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1572,
    "city_name": "Sahara Heights",
    "latitude": 49.252987,
    "longitude": -124.788007,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1573,
    "city_name": "Sahtlam",
    "latitude": 48.776335,
    "longitude": -123.807141,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1574,
    "city_name": "Sallahlus Sechelt Band 20",
    "latitude": 49.6169282,
    "longitude": -124.0335296,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1575,
    "city_name": "Sallahlus Sechelt Band 20A",
    "latitude": 49.6198332,
    "longitude": -124.0283244,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1576,
    "city_name": "Salmo",
    "latitude": 49.194892,
    "longitude": -117.2792769,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 1577,
    "city_name": "Salmon Arm",
    "latitude": 50.7001034,
    "longitude": -119.2838443,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 1578,
    "city_name": "Salmon Valley",
    "latitude": 54.099955,
    "longitude": -122.658538,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1579,
    "city_name": "Saloon",
    "latitude": 58.133465,
    "longitude": -131.354463,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1580,
    "city_name": "Salt Spring Island",
    "latitude": 48.8166622,
    "longitude": -123.5088755,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 1581,
    "city_name": "Saltair",
    "latitude": 48.9452039,
    "longitude": -123.7585239,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1582,
    "city_name": "Saltery Bay",
    "latitude": 49.783982,
    "longitude": -124.179438,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1583,
    "city_name": "Salvus",
    "latitude": 53.7266683,
    "longitude": -127.6476205,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1584,
    "city_name": "Samuel Island",
    "latitude": 48.8232677,
    "longitude": -123.2159073,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1585,
    "city_name": "San Josef",
    "latitude": 50.682523,
    "longitude": -128.26685,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1586,
    "city_name": "Sanca",
    "latitude": 49.390147,
    "longitude": -116.7354399,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1587,
    "city_name": "Sanderson Site",
    "latitude": 49.2134839,
    "longitude": -122.8709714,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1588,
    "city_name": "Sandon",
    "latitude": 49.975503,
    "longitude": -117.226963,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1589,
    "city_name": "Sandspit",
    "latitude": 53.243025,
    "longitude": -131.820879,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1590,
    "city_name": "Sandwick",
    "latitude": 49.701352,
    "longitude": -124.982798,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1591,
    "city_name": "Sandy Point",
    "latitude": 49.0298805,
    "longitude": -119.45037,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1592,
    "city_name": "Saratoga Beach",
    "latitude": 49.8653139,
    "longitude": -125.1154266,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1593,
    "city_name": "Sardis",
    "latitude": 49.131222,
    "longitude": -121.960432,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1594,
    "city_name": "Sarita",
    "latitude": 48.883333,
    "longitude": -125.033333,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1595,
    "city_name": "Saseenos",
    "latitude": 48.391134,
    "longitude": -123.667165,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1596,
    "city_name": "Saturna Island",
    "latitude": 48.7820442,
    "longitude": -123.1653007,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1597,
    "city_name": "Saughanaught Sechelt Band 22",
    "latitude": 49.6532647,
    "longitude": -124.067979,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1598,
    "city_name": "Savary Island",
    "latitude": 49.9396805,
    "longitude": -124.8094136,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1599,
    "city_name": "Savona",
    "latitude": 50.7527649,
    "longitude": -120.843769,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1600,
    "city_name": "Savory",
    "latitude": 54.1,
    "longitude": -125.166667,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1601,
    "city_name": "Sawquamain Sechelt Band 19A",
    "latitude": 49.6305604,
    "longitude": -124.0208532,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1602,
    "city_name": "Sayward",
    "latitude": 50.383718,
    "longitude": -125.960212,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 1603,
    "city_name": "Scotch Creek",
    "latitude": 50.903483,
    "longitude": -119.45846,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1604,
    "city_name": "Scotia Bay",
    "latitude": 59.600074,
    "longitude": -133.825184,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1605,
    "city_name": "Scott Cove",
    "latitude": 50.766667,
    "longitude": -126.458333,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1606,
    "city_name": "Scotty Creek",
    "latitude": 49.9285008,
    "longitude": -119.3263514,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1607,
    "city_name": "Seaford",
    "latitude": 50.083333,
    "longitude": -124.9,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1608,
    "city_name": "Seal Bay Subdivision",
    "latitude": 49.4420444,
    "longitude": -122.5555318,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1609,
    "city_name": "Seaside Park",
    "latitude": 49.525524,
    "longitude": -123.481016,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1610,
    "city_name": "Sechelt",
    "latitude": 49.4741736,
    "longitude": -123.7545601,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 1611,
    "city_name": "Sechelt Indian Government District",
    "latitude": 49.4740943,
    "longitude": -123.7545805,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1612,
    "city_name": "Sechelt Sechelt Band 2",
    "latitude": 49.4830488,
    "longitude": -123.7425229,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1613,
    "city_name": "Secret Cove",
    "latitude": 49.533333,
    "longitude": -123.95,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1614,
    "city_name": "Seddall",
    "latitude": 48.9754598,
    "longitude": -125.0550447,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1615,
    "city_name": "Seeney",
    "latitude": 48.6502411,
    "longitude": -123.399005,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1616,
    "city_name": "Sekaleton Sechelt Band 21",
    "latitude": 49.4741736,
    "longitude": -123.7545601,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1617,
    "city_name": "Sekaleton Sechelt Band 21A",
    "latitude": 49.6299351,
    "longitude": -124.050691,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1618,
    "city_name": "Selma Park",
    "latitude": 49.460763,
    "longitude": -123.737597,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1619,
    "city_name": "Semlin",
    "latitude": 49.2714129,
    "longitude": -123.0637922,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1620,
    "city_name": "Septimus",
    "latitude": 49.4805555,
    "longitude": -125.5136111,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1621,
    "city_name": "Seton",
    "latitude": 50.707377,
    "longitude": -122.2895451,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1622,
    "city_name": "Seton Portage",
    "latitude": 50.707377,
    "longitude": -122.2895451,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1623,
    "city_name": "Seven Mile Corner",
    "latitude": 55.897991,
    "longitude": -120.322945,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1624,
    "city_name": "Sewall",
    "latitude": 53.766667,
    "longitude": -132.3,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1625,
    "city_name": "Sewell Inlet",
    "latitude": 52.874187,
    "longitude": -132.002019,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1626,
    "city_name": "Seymour Arm",
    "latitude": 51.237814,
    "longitude": -118.9456681,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1627,
    "city_name": "Seymour Inlet",
    "latitude": 51.0690979,
    "longitude": -127.0054354,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1628,
    "city_name": "Seymour Lake",
    "latitude": 54.750825,
    "longitude": -127.167965,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1629,
    "city_name": "Shady Valley",
    "latitude": 53.986319,
    "longitude": -122.724405,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1630,
    "city_name": "Shalalth",
    "latitude": 50.732205,
    "longitude": -122.232405,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1631,
    "city_name": "Shames",
    "latitude": 54.484131,
    "longitude": -128.9528149,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1632,
    "city_name": "Shannon",
    "latitude": 49.6699686,
    "longitude": -123.15646,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1633,
    "city_name": "Shannon Bay",
    "latitude": 53.644557,
    "longitude": -132.514086,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1634,
    "city_name": "Shannon Creek Sechelt Band 28",
    "latitude": 49.6726389,
    "longitude": -123.16102,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1635,
    "city_name": "Shawl Bay",
    "latitude": 50.8487826,
    "longitude": -126.5589249,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1636,
    "city_name": "Shawnigan Lake",
    "latitude": 48.6511793,
    "longitude": -123.6449962,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 1637,
    "city_name": "Shearer Dale",
    "latitude": 56.066667,
    "longitude": -120.0833331,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1638,
    "city_name": "Shearwater",
    "latitude": 52.148478,
    "longitude": -128.0916,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1639,
    "city_name": "Shelley",
    "latitude": 54.000784,
    "longitude": -122.620081,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1640,
    "city_name": "Shelter Bay",
    "latitude": 50.635541,
    "longitude": -117.9289101,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1641,
    "city_name": "Shelter Point",
    "latitude": 49.9306849,
    "longitude": -125.184946,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1642,
    "city_name": "Sheraton",
    "latitude": 54.166667,
    "longitude": -125.4666671,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1643,
    "city_name": "Shere",
    "latitude": 53.03372,
    "longitude": -119.584316,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1644,
    "city_name": "Sheridan Lake",
    "latitude": 51.532082,
    "longitude": -120.882871,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1645,
    "city_name": "Sheslay",
    "latitude": 58.260261,
    "longitude": -131.7927701,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1646,
    "city_name": "Shingle Creek",
    "latitude": 49.516667,
    "longitude": -119.8,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1647,
    "city_name": "Shirley",
    "latitude": 48.389275,
    "longitude": -123.905092,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1648,
    "city_name": "Shoreacres",
    "latitude": 49.425718,
    "longitude": -117.530042,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1649,
    "city_name": "Shoreholme",
    "latitude": 50.302625,
    "longitude": -117.851722,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1650,
    "city_name": "Shulus",
    "latitude": 50.156549,
    "longitude": -120.8797919,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1651,
    "city_name": "Shushartie",
    "latitude": 50.854135,
    "longitude": -127.855266,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1652,
    "city_name": "Shuswap Falls",
    "latitude": 50.293683,
    "longitude": -118.8153141,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1653,
    "city_name": "Shutty Bench",
    "latitude": 49.9579499,
    "longitude": -116.905241,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1654,
    "city_name": "Sicamous",
    "latitude": 50.8378243,
    "longitude": -118.9768156,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 1655,
    "city_name": "Sidley",
    "latitude": 49.029,
    "longitude": -119.2544946,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1656,
    "city_name": "Sidney",
    "latitude": 48.6502411,
    "longitude": -123.399005,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 1657,
    "city_name": "Sikanni",
    "latitude": 57.233333,
    "longitude": -122.7000001,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1658,
    "city_name": "Sikanni Chief",
    "latitude": 57.233333,
    "longitude": -122.7000001,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1659,
    "city_name": "Silica",
    "latitude": 49.033554,
    "longitude": -117.847372,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1660,
    "city_name": "Silver Lake",
    "latitude": 49.3141173,
    "longitude": -121.4121168,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1661,
    "city_name": "Silver River",
    "latitude": 49.575187,
    "longitude": -121.8199031,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1662,
    "city_name": "Silverdale",
    "latitude": 49.1459297,
    "longitude": -122.4049093,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1663,
    "city_name": "Silverhill",
    "latitude": 49.176271,
    "longitude": -122.3792279,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1664,
    "city_name": "Silverton",
    "latitude": 49.9528617,
    "longitude": -117.3572961,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1665,
    "city_name": "Simpson Ranch",
    "latitude": 56.592609,
    "longitude": -122.4324509,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1666,
    "city_name": "Sinclair Mills",
    "latitude": 54.016026,
    "longitude": -121.670427,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1667,
    "city_name": "Sinkut River",
    "latitude": 53.95,
    "longitude": -123.866667,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1668,
    "city_name": "Sirdar",
    "latitude": 49.236053,
    "longitude": -116.611971,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1669,
    "city_name": "Six Mile Point",
    "latitude": 50.766714,
    "longitude": -119.007147,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1670,
    "city_name": "Skedans",
    "latitude": 52.966667,
    "longitude": -131.616667,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1671,
    "city_name": "Skeena",
    "latitude": 54.24978,
    "longitude": -129.8326649,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1672,
    "city_name": "Skeena Crossing",
    "latitude": 55.098611,
    "longitude": -127.811111,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1673,
    "city_name": "Skidegate",
    "latitude": 53.2665,
    "longitude": -131.9913154,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1674,
    "city_name": "Skidegate Landing",
    "latitude": 53.247222,
    "longitude": -132.0083331,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1675,
    "city_name": "Skooks Landing",
    "latitude": 59.616667,
    "longitude": -127.1166669,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1676,
    "city_name": "Skookumchuck Sechelt Band 27",
    "latitude": 49.7288631,
    "longitude": -123.8991704,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1677,
    "city_name": "Skoonka",
    "latitude": 53.7266683,
    "longitude": -127.6476205,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1678,
    "city_name": "Skwawkweehm Sechelt Band 17",
    "latitude": 49.4741736,
    "longitude": -123.7545601,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1679,
    "city_name": "Skweahm 10",
    "latitude": 49.1717205,
    "longitude": -122.0843285,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1680,
    "city_name": "Slayathlum Sechelt Band 16",
    "latitude": 49.9961818,
    "longitude": -124.0139642,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1681,
    "city_name": "Slesse Park",
    "latitude": 49.076291,
    "longitude": -121.830289,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1682,
    "city_name": "Sliammon",
    "latitude": 49.898488,
    "longitude": -124.603327,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1683,
    "city_name": "Slocan",
    "latitude": 49.762993,
    "longitude": -117.46992,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 1684,
    "city_name": "Slocan Park",
    "latitude": 49.51397,
    "longitude": -117.618387,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1685,
    "city_name": "Smeshalin Sechelt Band 18",
    "latitude": 49.6425704,
    "longitude": -123.9843683,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1686,
    "city_name": "Smith River",
    "latitude": 59.882287,
    "longitude": -126.432997,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1687,
    "city_name": "Smithers",
    "latitude": 54.782355,
    "longitude": -127.1685541,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 1688,
    "city_name": "Smithers Landing",
    "latitude": 55.050009,
    "longitude": -126.514467,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1689,
    "city_name": "Snake Fort Nelson Band 5",
    "latitude": 59.0398766,
    "longitude": -122.4570401,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1690,
    "city_name": "Snake River",
    "latitude": 59.033333,
    "longitude": -122.45,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1691,
    "city_name": "Snyder",
    "latitude": 53.7266683,
    "longitude": -127.6476205,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1692,
    "city_name": "Soames Point",
    "latitude": 49.4170036,
    "longitude": -123.4831741,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1693,
    "city_name": "Sockeye",
    "latitude": 49.1239663,
    "longitude": -123.1847379,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1694,
    "city_name": "Soda Creek",
    "latitude": 52.35,
    "longitude": -122.2833331,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1695,
    "city_name": "Sointula",
    "latitude": 50.6308641,
    "longitude": -127.017264,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1696,
    "city_name": "Solly",
    "latitude": 49.2646392,
    "longitude": -123.1126133,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1697,
    "city_name": "Solsqua",
    "latitude": 50.858677,
    "longitude": -118.953572,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1698,
    "city_name": "Somenos",
    "latitude": 48.81418,
    "longitude": -123.736086,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1699,
    "city_name": "Sonora Island",
    "latitude": 50.3596385,
    "longitude": -125.2319104,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1700,
    "city_name": "Sooke",
    "latitude": 48.3740346,
    "longitude": -123.7355539,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 1701,
    "city_name": "Sorrento",
    "latitude": 50.87686,
    "longitude": -119.469938,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 1702,
    "city_name": "South Bentinck",
    "latitude": 52.045342,
    "longitude": -126.668081,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1703,
    "city_name": "South Canoe",
    "latitude": 50.699858,
    "longitude": -119.215827,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1704,
    "city_name": "South Dawson",
    "latitude": 55.735453,
    "longitude": -120.349382,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1705,
    "city_name": "South Fort George",
    "latitude": 53.895532,
    "longitude": -122.7413469,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1706,
    "city_name": "South Hazelton",
    "latitude": 55.233333,
    "longitude": -127.6666669,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1707,
    "city_name": "South Lakeside",
    "latitude": 52.11067,
    "longitude": -122.088061,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1708,
    "city_name": "South Lakeside (Williams Lake)",
    "latitude": 52.11067,
    "longitude": -122.088061,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1709,
    "city_name": "South Pender Island",
    "latitude": 48.7499457,
    "longitude": -123.2110296,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1710,
    "city_name": "South Poplar",
    "latitude": 49.016894,
    "longitude": -122.3151851,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1711,
    "city_name": "South Shalalth",
    "latitude": 50.728281,
    "longitude": -122.244441,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1712,
    "city_name": "South Slocan",
    "latitude": 49.4576298,
    "longitude": -117.5237637,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1713,
    "city_name": "South Slope",
    "latitude": 49.2144754,
    "longitude": -123.0023565,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1714,
    "city_name": "South Sumas",
    "latitude": 49.118352,
    "longitude": -121.992072,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1715,
    "city_name": "South Taylor",
    "latitude": 56.147131,
    "longitude": -120.6761561,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1716,
    "city_name": "South Thormanby Island",
    "latitude": 49.4984943,
    "longitude": -123.9794558,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1717,
    "city_name": "South Wellington",
    "latitude": 49.105313,
    "longitude": -123.894489,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1718,
    "city_name": "Southbank",
    "latitude": 54.016667,
    "longitude": -125.766667,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1719,
    "city_name": "Soyandostar 2",
    "latitude": 53.7266683,
    "longitude": -127.6476205,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1720,
    "city_name": "Spallumcheen",
    "latitude": 50.4279241,
    "longitude": -119.2469274,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 1721,
    "city_name": "Sparwood",
    "latitude": 49.7344685,
    "longitude": -114.8796552,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 1722,
    "city_name": "Spatsum",
    "latitude": 50.55,
    "longitude": -121.3,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1723,
    "city_name": "Spences Bridge",
    "latitude": 50.414053,
    "longitude": -121.359529,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1724,
    "city_name": "Sperling",
    "latitude": 49.852485,
    "longitude": -119.4658249,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1725,
    "city_name": "Spicer",
    "latitude": 53.7266683,
    "longitude": -127.6476205,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1726,
    "city_name": "Spillamacheen",
    "latitude": 50.905829,
    "longitude": -116.365237,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1727,
    "city_name": "Springfield Ranch",
    "latitude": 52.2735658,
    "longitude": -122.249958,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1728,
    "city_name": "Springhouse",
    "latitude": 51.962193,
    "longitude": -122.142324,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1729,
    "city_name": "Sproat Lake",
    "latitude": 49.2667081,
    "longitude": -125.0368939,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1730,
    "city_name": "Sproatt",
    "latitude": 50.08657,
    "longitude": -123.037183,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1731,
    "city_name": "Sproule Creek",
    "latitude": 49.5055987,
    "longitude": -117.4001141,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1732,
    "city_name": "Spur Valley Subdivision",
    "latitude": 50.760868,
    "longitude": -116.20249,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1733,
    "city_name": "Spuzzum",
    "latitude": 49.675172,
    "longitude": -121.418656,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1734,
    "city_name": "Squamish",
    "latitude": 49.7016339,
    "longitude": -123.1558121,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 1735,
    "city_name": "Squawkum Creek 3",
    "latitude": 49.244679,
    "longitude": -122.0011084,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1736,
    "city_name": "Squeah",
    "latitude": 49.501916,
    "longitude": -121.41981,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1737,
    "city_name": "Squilax",
    "latitude": 50.871401,
    "longitude": -119.6055429,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1738,
    "city_name": "Squirrel Cove",
    "latitude": 50.116667,
    "longitude": -124.916667,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1739,
    "city_name": "St. Andrews",
    "latitude": 49.2812948,
    "longitude": -123.1267862,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1740,
    "city_name": "St. Eugene Mission",
    "latitude": 49.5875978,
    "longitude": -115.7559557,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1741,
    "city_name": "St. Ives",
    "latitude": 50.9789249,
    "longitude": -119.103617,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1742,
    "city_name": "St. Joseph Mission",
    "latitude": 49.139802,
    "longitude": -122.3229408,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1743,
    "city_name": "St. Mary Lake",
    "latitude": 48.8889648,
    "longitude": -123.5429622,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1744,
    "city_name": "St. Vincent Bay",
    "latitude": 54.151369,
    "longitude": -111.278133,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1745,
    "city_name": "Stanley",
    "latitude": 53.033333,
    "longitude": -121.716667,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1746,
    "city_name": "Star Subdivision",
    "latitude": 50.3597927,
    "longitude": -119.0588591,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1747,
    "city_name": "Starks",
    "latitude": 49.2572656,
    "longitude": -123.139092,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1748,
    "city_name": "Stave Falls",
    "latitude": 49.229304,
    "longitude": -122.357305,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1749,
    "city_name": "Steamboat",
    "latitude": 58.683333,
    "longitude": -123.7166671,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1750,
    "city_name": "Steelhead",
    "latitude": 49.219355,
    "longitude": -122.315097,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1751,
    "city_name": "Stellako",
    "latitude": 54.046676,
    "longitude": -124.897698,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1752,
    "city_name": "Stephen",
    "latitude": 51.45,
    "longitude": -116.2999999,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1753,
    "city_name": "Stepping Stones Estates",
    "latitude": 49.2138652,
    "longitude": -119.5415094,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1754,
    "city_name": "Stewardson Inlet",
    "latitude": 49.421371,
    "longitude": -126.315341,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1755,
    "city_name": "Stewart",
    "latitude": 55.9413124,
    "longitude": -129.9878921,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 1756,
    "city_name": "Stikine",
    "latitude": 56.695618,
    "longitude": -131.8074291,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1757,
    "city_name": "Still Creek",
    "latitude": 49.2446331,
    "longitude": -122.9347508,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1758,
    "city_name": "Stockett",
    "latitude": 53.7266683,
    "longitude": -127.6476205,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1759,
    "city_name": "Stoner",
    "latitude": 53.630507,
    "longitude": -122.663428,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1760,
    "city_name": "Stones Bay",
    "latitude": 54.4395202,
    "longitude": -124.2505059,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1761,
    "city_name": "Stoney Creek",
    "latitude": 53.943958,
    "longitude": -124.116742,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1762,
    "city_name": "Stories Beach",
    "latitude": 49.919444,
    "longitude": -125.186111,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1763,
    "city_name": "Stout",
    "latitude": 49.274059,
    "longitude": -123.069704,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1764,
    "city_name": "Straiton",
    "latitude": 49.079808,
    "longitude": -122.20559,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1765,
    "city_name": "Strathcona Lodge",
    "latitude": 49.8922192,
    "longitude": -125.6528069,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1766,
    "city_name": "Strathnaver",
    "latitude": 53.283512,
    "longitude": -122.494913,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1767,
    "city_name": "Streatham",
    "latitude": 53.833333,
    "longitude": -126.25,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1768,
    "city_name": "Stuart Island",
    "latitude": 50.3929727,
    "longitude": -125.1186076,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1769,
    "city_name": "Stuart River",
    "latitude": 54.2024151,
    "longitude": -123.8758206,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1770,
    "city_name": "Stuie",
    "latitude": 52.369857,
    "longitude": -126.065858,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1771,
    "city_name": "Stump Lake",
    "latitude": 50.3931479,
    "longitude": -120.327697,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1772,
    "city_name": "Sturdies Bay",
    "latitude": 48.8788025,
    "longitude": -123.3177664,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1773,
    "city_name": "Suahbin Sechelt Band 19",
    "latitude": 49.6322203,
    "longitude": -124.0246544,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1774,
    "city_name": "Sugarcane",
    "latitude": 52.1,
    "longitude": -121.983333,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1775,
    "city_name": "Sullivan Bay",
    "latitude": 50.883333,
    "longitude": -126.816667,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1776,
    "city_name": "Summerland",
    "latitude": 49.6073297,
    "longitude": -119.6768815,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 1777,
    "city_name": "Sun Peaks",
    "latitude": 50.877459,
    "longitude": -119.910142,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 1778,
    "city_name": "Sundance",
    "latitude": 49.089348,
    "longitude": -123.041458,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1779,
    "city_name": "Sundance Subdivision",
    "latitude": 50.090996,
    "longitude": -122.9951899,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1780,
    "city_name": "Sunningdale",
    "latitude": 49.116128,
    "longitude": -117.718234,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1781,
    "city_name": "Sunnybrae",
    "latitude": 50.773318,
    "longitude": -119.2716811,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1782,
    "city_name": "Sunnyside",
    "latitude": 54.654156,
    "longitude": -124.7070759,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1783,
    "city_name": "Sunrise Valley",
    "latitude": 55.866667,
    "longitude": -120.666667,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1784,
    "city_name": "Sunset Beach",
    "latitude": 49.398404,
    "longitude": -123.248231,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1785,
    "city_name": "Sunset Prairie",
    "latitude": 55.853457,
    "longitude": -120.7668681,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1786,
    "city_name": "Sunshine Bay",
    "latitude": 49.6087,
    "longitude": -117.005232,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1787,
    "city_name": "Sunshine Valley",
    "latitude": 49.274439,
    "longitude": -121.2318899,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1788,
    "city_name": "Suquash",
    "latitude": 50.633333,
    "longitude": -127.25,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1789,
    "city_name": "Surge Narrows",
    "latitude": 50.235329,
    "longitude": -125.0982801,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1790,
    "city_name": "Surprise",
    "latitude": 59.625932,
    "longitude": -133.4168469,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1791,
    "city_name": "Surrey",
    "latitude": 49.1913466,
    "longitude": -122.8490125,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 1
  },
  {
    "id": 1792,
    "city_name": "Swansea",
    "latitude": 50.5083011,
    "longitude": -115.9528264,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1793,
    "city_name": "Swartz Bay",
    "latitude": 48.6879967,
    "longitude": -123.4146546,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1794,
    "city_name": "Swaycalse Sechelt Band 3",
    "latitude": 49.4911403,
    "longitude": -123.7668847,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1795,
    "city_name": "Swaywelat Sechelt Band 12",
    "latitude": 49.4741736,
    "longitude": -123.7545601,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1796,
    "city_name": "Sweetsbridge",
    "latitude": 49.3428609,
    "longitude": -123.1149244,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1797,
    "city_name": "Sweetwater",
    "latitude": 55.912564,
    "longitude": -120.4405461,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1798,
    "city_name": "Swift",
    "latitude": 48.4296485,
    "longitude": -123.3710216,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1799,
    "city_name": "Swiftwater",
    "latitude": 49.1540577,
    "longitude": -121.9507004,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1800,
    "city_name": "Sydney Island",
    "latitude": 48.6003054,
    "longitude": -123.290831,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1801,
    "city_name": "Ta Ta Creek",
    "latitude": 49.783029,
    "longitude": -115.785787,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1802,
    "city_name": "Tabor",
    "latitude": 49.0468028,
    "longitude": -122.3389941,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1803,
    "city_name": "Tacheeda",
    "latitude": 54.7002772,
    "longitude": -122.5435981,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1804,
    "city_name": "Tachie",
    "latitude": 54.656916,
    "longitude": -124.7417319,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1805,
    "city_name": "Tadanac",
    "latitude": 49.109519,
    "longitude": -117.719289,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1806,
    "city_name": "Taft",
    "latitude": 50.996052,
    "longitude": -118.640602,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1807,
    "city_name": "Taghum",
    "latitude": 49.491006,
    "longitude": -117.3969301,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1808,
    "city_name": "Tahltan",
    "latitude": 58.003239,
    "longitude": -130.997305,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1809,
    "city_name": "Tahsis",
    "latitude": 49.927861,
    "longitude": -126.656541,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 1810,
    "city_name": "Takla Landing",
    "latitude": 55.4828875,
    "longitude": -125.9677772,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 1811,
    "city_name": "Taku",
    "latitude": 59.633333,
    "longitude": -133.8500001,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1812,
    "city_name": "Takysie Lake",
    "latitude": 53.898399,
    "longitude": -125.8713559,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1813,
    "city_name": "Tallheo",
    "latitude": 52.388688,
    "longitude": -126.836364,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1814,
    "city_name": "Tamarack",
    "latitude": 49.2597298,
    "longitude": -123.2463444,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1815,
    "city_name": "Tamarisk",
    "latitude": 50.091405,
    "longitude": -123.007409,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1816,
    "city_name": "Tantalus Acres",
    "latitude": 49.8102827,
    "longitude": -123.1981339,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1817,
    "city_name": "Tanu",
    "latitude": 53.025879,
    "longitude": -131.781177,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1818,
    "city_name": "Tappen",
    "latitude": 50.782998,
    "longitude": -119.334404,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1819,
    "city_name": "Tarrys",
    "latitude": 49.377724,
    "longitude": -117.557987,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1820,
    "city_name": "Tasu",
    "latitude": 52.75922,
    "longitude": -132.0383,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1821,
    "city_name": "Tatalrose",
    "latitude": 53.983333,
    "longitude": -125.983333,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1822,
    "city_name": "Tatla Lake",
    "latitude": 51.905156,
    "longitude": -124.597755,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1823,
    "city_name": "Tatlow",
    "latitude": 54.7,
    "longitude": -127.1166671,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1824,
    "city_name": "Tatogga",
    "latitude": 57.734175,
    "longitude": -129.982887,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1825,
    "city_name": "Tatton",
    "latitude": 51.716667,
    "longitude": -121.366667,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1826,
    "city_name": "Taverna",
    "latitude": 49.0903434,
    "longitude": -123.0835052,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1827,
    "city_name": "Taylor",
    "latitude": 56.1525689,
    "longitude": -120.6814069,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1828,
    "city_name": "Tchahchelailthtenum Sechelt Band 10",
    "latitude": 49.7245055,
    "longitude": -123.8655399,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1829,
    "city_name": "Tchesinkut Lake",
    "latitude": 54.083333,
    "longitude": -125.733333,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1830,
    "city_name": "Teakerne Arm",
    "latitude": 50.185961,
    "longitude": -124.816185,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1831,
    "city_name": "Telachick",
    "latitude": 53.862313,
    "longitude": -123.1795009,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1832,
    "city_name": "Telegraph Cove",
    "latitude": 50.5492459,
    "longitude": -126.832251,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1833,
    "city_name": "Telegraph Creek",
    "latitude": 57.90293,
    "longitude": -131.159156,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1834,
    "city_name": "Telkwa",
    "latitude": 54.695016,
    "longitude": -127.04761,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 3
  },
  {
    "id": 1835,
    "city_name": "Ten Mile Lake",
    "latitude": 53.083168,
    "longitude": -122.432854,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1836,
    "city_name": "Terrace",
    "latitude": 54.5181925,
    "longitude": -128.6031539,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 1837,
    "city_name": "Tete Jaune",
    "latitude": 52.965885,
    "longitude": -119.43007,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1838,
    "city_name": "Tete Jaune Cache",
    "latitude": 52.965885,
    "longitude": -119.43007,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1839,
    "city_name": "Texada Island",
    "latitude": 49.6596634,
    "longitude": -124.4121947,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 1840,
    "city_name": "Theodosia Arm",
    "latitude": 50.0601569,
    "longitude": -124.6927371,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1841,
    "city_name": "Thetis Island",
    "latitude": 48.9986363,
    "longitude": -123.6812002,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1842,
    "city_name": "Thompson",
    "latitude": 50.5136032,
    "longitude": -121.2775127,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1843,
    "city_name": "Thompson River Estates",
    "latitude": 50.5136032,
    "longitude": -121.2775127,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1844,
    "city_name": "Thompson Sound",
    "latitude": 50.802874,
    "longitude": -126.012082,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1845,
    "city_name": "Thornhill",
    "latitude": 54.513787,
    "longitude": -128.5401111,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1846,
    "city_name": "Three Forks",
    "latitude": 50.013059,
    "longitude": -117.28516,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1847,
    "city_name": "Three Valley",
    "latitude": 50.9333408,
    "longitude": -118.445714,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1848,
    "city_name": "Thrums",
    "latitude": 49.354177,
    "longitude": -117.57777,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1849,
    "city_name": "Thunder River",
    "latitude": 52.232482,
    "longitude": -119.2168049,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1850,
    "city_name": "Thunderbird",
    "latitude": 49.1318603,
    "longitude": -122.5441266,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1851,
    "city_name": "Thurlow",
    "latitude": 50.45,
    "longitude": -125.3666669,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1852,
    "city_name": "Thurston Harbour",
    "latitude": 52.833333,
    "longitude": -131.75,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1853,
    "city_name": "Tibbets",
    "latitude": 53.7266683,
    "longitude": -127.6476205,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1854,
    "city_name": "Tiilis Landing",
    "latitude": 50.9087249,
    "longitude": -119.084746,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1855,
    "city_name": "Tillicum",
    "latitude": 48.447719,
    "longitude": -123.400378,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1856,
    "city_name": "Tintagel",
    "latitude": 54.2,
    "longitude": -125.083333,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1857,
    "city_name": "Tipella",
    "latitude": 49.736036,
    "longitude": -122.147218,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1858,
    "city_name": "Tisdall",
    "latitude": 52.2406986,
    "longitude": -121.0183303,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1859,
    "city_name": "Tlell",
    "latitude": 53.5629769,
    "longitude": -131.9289541,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1860,
    "city_name": "Toad River",
    "latitude": 58.847789,
    "longitude": -125.2317241,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1861,
    "city_name": "Toby Creek",
    "latitude": 50.339865,
    "longitude": -116.424919,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1862,
    "city_name": "Tochty",
    "latitude": 53.7266683,
    "longitude": -127.6476205,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1863,
    "city_name": "Tofino",
    "latitude": 49.1529842,
    "longitude": -125.9066184,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 1864,
    "city_name": "Toketic",
    "latitude": 53.7266683,
    "longitude": -127.6476205,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1865,
    "city_name": "Tomslake",
    "latitude": 55.555446,
    "longitude": -120.076197,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1866,
    "city_name": "Topley",
    "latitude": 54.505051,
    "longitude": -126.296656,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1867,
    "city_name": "Torrent",
    "latitude": 49.2325279,
    "longitude": -122.82292,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1868,
    "city_name": "Towdystan",
    "latitude": 52.2611913,
    "longitude": -125.0897914,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1869,
    "city_name": "Tower Lake",
    "latitude": 56.016667,
    "longitude": -120.5666671,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1870,
    "city_name": "Townsend",
    "latitude": 49.284756,
    "longitude": -123.1121501,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1871,
    "city_name": "Tracard",
    "latitude": 53.7266683,
    "longitude": -127.6476205,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1872,
    "city_name": "Traders Cove",
    "latitude": 49.941208,
    "longitude": -119.504483,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1873,
    "city_name": "Trafalgar",
    "latitude": 48.4083191,
    "longitude": -123.319692,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1874,
    "city_name": "Trail",
    "latitude": 49.0965676,
    "longitude": -117.71173,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 1875,
    "city_name": "Tranquille",
    "latitude": 50.725166,
    "longitude": -120.507131,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1876,
    "city_name": "Tremblay",
    "latitude": 49.2690026,
    "longitude": -123.1389606,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1877,
    "city_name": "Trembleur",
    "latitude": 54.8567773,
    "longitude": -125.0982735,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1878,
    "city_name": "Trepanier",
    "latitude": 49.788837,
    "longitude": -119.708012,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1879,
    "city_name": "Trevor Channel",
    "latitude": 53.7266683,
    "longitude": -127.6476205,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1880,
    "city_name": "Trinity Valley",
    "latitude": 50.4,
    "longitude": -118.916667,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1881,
    "city_name": "Trout Creek",
    "latitude": 49.571837,
    "longitude": -119.630862,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1882,
    "city_name": "Trout Lake",
    "latitude": 50.651292,
    "longitude": -117.540371,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1883,
    "city_name": "Trutch",
    "latitude": 57.733333,
    "longitude": -122.95,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1884,
    "city_name": "Tsawcome Sechelt Band 1",
    "latitude": 49.4384141,
    "longitude": -123.7160038,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1885,
    "city_name": "Tsawwassen",
    "latitude": 49.004489,
    "longitude": -123.089368,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 3
  },
  {
    "id": 1886,
    "city_name": "Tsay Keh Dene",
    "latitude": 56.906111,
    "longitude": -124.9649999,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1887,
    "city_name": "Tsimpsean 2 North Part",
    "latitude": 54.3666667,
    "longitude": -130.25,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1888,
    "city_name": "Tsolum River",
    "latitude": 49.6958142,
    "longitude": -124.9942722,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1889,
    "city_name": "Tsooahdie Sechelt Band 15",
    "latitude": 50.0959594,
    "longitude": -123.7416786,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1890,
    "city_name": "Tulameen",
    "latitude": 49.54586,
    "longitude": -120.76024,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1891,
    "city_name": "Tulsequah",
    "latitude": 58.645396,
    "longitude": -133.5401029,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1892,
    "city_name": "Tumbler Ridge",
    "latitude": 55.125795,
    "longitude": -120.993154,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 1893,
    "city_name": "Tupper",
    "latitude": 55.512426,
    "longitude": -120.037882,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1894,
    "city_name": "Turner Subdivision",
    "latitude": 53.7266683,
    "longitude": -127.6476205,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1895,
    "city_name": "Turtle Valley",
    "latitude": 50.806971,
    "longitude": -119.59754,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1896,
    "city_name": "Tuwanek",
    "latitude": 49.55,
    "longitude": -123.75,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1897,
    "city_name": "Twidwell Bend",
    "latitude": 55.616667,
    "longitude": -121.566667,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1898,
    "city_name": "Twin Bays",
    "latitude": 49.3402409,
    "longitude": -116.716888,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1899,
    "city_name": "Twin Butte",
    "latitude": 51.0077777,
    "longitude": -117.9783332,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1900,
    "city_name": "Twin Creeks",
    "latitude": 49.4794259,
    "longitude": -123.4853411,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1901,
    "city_name": "Twin Islands",
    "latitude": 50.0261235,
    "longitude": -124.9317342,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1902,
    "city_name": "Two Mile",
    "latitude": 55.266667,
    "longitude": -127.6166669,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1903,
    "city_name": "Two Mile Hazelton",
    "latitude": 55.2568166,
    "longitude": -127.6720019,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1904,
    "city_name": "Two Rivers",
    "latitude": 56.183248,
    "longitude": -120.531269,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1905,
    "city_name": "Tye",
    "latitude": 49.326481,
    "longitude": -116.792372,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1906,
    "city_name": "Tyee",
    "latitude": 49.2534128,
    "longitude": -123.0740134,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1907,
    "city_name": "Tzouhalem",
    "latitude": 48.779446,
    "longitude": -123.649468,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1908,
    "city_name": "Tzuhalem",
    "latitude": 48.779446,
    "longitude": -123.649468,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1909,
    "city_name": "Ucluelet",
    "latitude": 48.9415997,
    "longitude": -125.5463446,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 1910,
    "city_name": "Ulkatcho",
    "latitude": 53,
    "longitude": -125.7,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1911,
    "city_name": "Union Bay",
    "latitude": 49.5809036,
    "longitude": -124.8844979,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1912,
    "city_name": "Upper Bench",
    "latitude": 49.5003501,
    "longitude": -119.5672309,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1913,
    "city_name": "Upper China Creek",
    "latitude": 49.216667,
    "longitude": -117.7,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1914,
    "city_name": "Upper Cutbank",
    "latitude": 55.520189,
    "longitude": -120.4395519,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1915,
    "city_name": "Upper Fraser",
    "latitude": 54.111782,
    "longitude": -121.9321979,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1916,
    "city_name": "Upper Halfway",
    "latitude": 56.512217,
    "longitude": -121.9654869,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1917,
    "city_name": "Upper Sumas 6",
    "latitude": 49.067743,
    "longitude": -122.19357,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1918,
    "city_name": "Urling",
    "latitude": 53.674469,
    "longitude": -120.8703,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1919,
    "city_name": "Urquhart",
    "latitude": 49.6763888,
    "longitude": -125.8969444,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1920,
    "city_name": "Usk",
    "latitude": 54.636167,
    "longitude": -128.4117189,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1921,
    "city_name": "Valdes Island",
    "latitude": 49.0730059,
    "longitude": -123.6504918,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1922,
    "city_name": "Valemount",
    "latitude": 52.83122,
    "longitude": -119.264311,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 1923,
    "city_name": "Valhalla",
    "latitude": 49.8,
    "longitude": -117.6666667,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1924,
    "city_name": "Valley View",
    "latitude": 55.985259,
    "longitude": -120.2448711,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1925,
    "city_name": "Valleycliffe",
    "latitude": 49.70178,
    "longitude": -123.12567,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1926,
    "city_name": "Valleyview",
    "latitude": 55.985259,
    "longitude": -120.2448711,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1927,
    "city_name": "Vallican",
    "latitude": 49.559334,
    "longitude": -117.6507209,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1928,
    "city_name": "Van Anda",
    "latitude": 49.756122,
    "longitude": -124.554059,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1929,
    "city_name": "Vancouver",
    "latitude": 49.2827291,
    "longitude": -123.1207375,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 1
  },
  {
    "id": 1930,
    "city_name": "Vanderhoof",
    "latitude": 54.0139798,
    "longitude": -124.0129801,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 1931,
    "city_name": "Vanway",
    "latitude": 53.857956,
    "longitude": -122.816032,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1932,
    "city_name": "Vargas Island",
    "latitude": 49.1911218,
    "longitude": -125.9892639,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1933,
    "city_name": "Vaseaux Lake",
    "latitude": 49.2898482,
    "longitude": -119.5304443,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1934,
    "city_name": "Vaucroft Beach",
    "latitude": 49.5070643,
    "longitude": -123.9993615,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1935,
    "city_name": "Vavenby",
    "latitude": 51.578841,
    "longitude": -119.7179271,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1936,
    "city_name": "Vedder Crossing",
    "latitude": 49.1038704,
    "longitude": -121.9625821,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1937,
    "city_name": "Vermilion Crossing",
    "latitude": 51.024858,
    "longitude": -115.979586,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1938,
    "city_name": "Vernon",
    "latitude": 50.2670137,
    "longitude": -119.2720107,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 1939,
    "city_name": "Vesuvius",
    "latitude": 48.883629,
    "longitude": -123.56922,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1940,
    "city_name": "Victoria",
    "latitude": 48.4284207,
    "longitude": -123.3656444,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 1
  },
  {
    "id": 1941,
    "city_name": "Victoria Lake",
    "latitude": 50.3668131,
    "longitude": -127.3783179,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1942,
    "city_name": "Vidette",
    "latitude": 51.1666669,
    "longitude": -120.9,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1943,
    "city_name": "View Royal",
    "latitude": 48.4527663,
    "longitude": -123.4348032,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 3
  },
  {
    "id": 1944,
    "city_name": "Vinsulla",
    "latitude": 50.919378,
    "longitude": -120.2353211,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1945,
    "city_name": "Von Zuben",
    "latitude": 53.7266683,
    "longitude": -127.6476205,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1946,
    "city_name": "Vye",
    "latitude": 49.0160833,
    "longitude": -122.2745844,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1947,
    "city_name": "Wabi",
    "latitude": 49.3047448,
    "longitude": -124.4235919,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1948,
    "city_name": "Wabron",
    "latitude": 53.7266683,
    "longitude": -127.6476205,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1949,
    "city_name": "Wadhams",
    "latitude": 51.516667,
    "longitude": -127.5,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1950,
    "city_name": "Waglisla",
    "latitude": 52.1605419,
    "longitude": -128.1455793,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1951,
    "city_name": "Wagner Ranch",
    "latitude": 56.514952,
    "longitude": -122.239737,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1952,
    "city_name": "Wakely",
    "latitude": 53.7266683,
    "longitude": -127.6476205,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1953,
    "city_name": "Walcott",
    "latitude": 54.51746,
    "longitude": -126.850332,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1954,
    "city_name": "Walhachin",
    "latitude": 50.754262,
    "longitude": -120.989949,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1955,
    "city_name": "Walker",
    "latitude": 49.3276553,
    "longitude": -123.1557987,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1956,
    "city_name": "Walkers",
    "latitude": 49.708371,
    "longitude": -116.864327,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1957,
    "city_name": "Wall Beach",
    "latitude": 49.3009249,
    "longitude": -124.222053,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1958,
    "city_name": "Waneta",
    "latitude": 49.003918,
    "longitude": -117.6119155,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1959,
    "city_name": "Wanklyn",
    "latitude": 53.7266683,
    "longitude": -127.6476205,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1960,
    "city_name": "Wardner",
    "latitude": 49.417837,
    "longitude": -115.421878,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1961,
    "city_name": "Ware",
    "latitude": 57.4230262,
    "longitude": -125.6270035,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1962,
    "city_name": "Warfield",
    "latitude": 49.095465,
    "longitude": -117.7534689,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1963,
    "city_name": "Warner Bay",
    "latitude": 51.047179,
    "longitude": -127.100043,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1964,
    "city_name": "Wasa",
    "latitude": 49.7684629,
    "longitude": -115.737462,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1965,
    "city_name": "Wasa Lake",
    "latitude": 49.780209,
    "longitude": -115.7357135,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1966,
    "city_name": "Watson",
    "latitude": 49.263641,
    "longitude": -123.109646,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1967,
    "city_name": "Watson Island",
    "latitude": 50.9324723,
    "longitude": -126.8181841,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1968,
    "city_name": "Websters Corners",
    "latitude": 49.220456,
    "longitude": -122.5125589,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1969,
    "city_name": "Wedeene",
    "latitude": 54.0476357,
    "longitude": -128.6538837,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1970,
    "city_name": "Wedge",
    "latitude": 50.1330555,
    "longitude": -122.7933333,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1971,
    "city_name": "Wedgwood",
    "latitude": 49.2823496,
    "longitude": -123.1227821,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1972,
    "city_name": "Weewanie",
    "latitude": 53.683333,
    "longitude": -128.783333,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1973,
    "city_name": "Welcome Beach",
    "latitude": 49.4884513,
    "longitude": -123.9045196,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 3
  },
  {
    "id": 1974,
    "city_name": "Wellington",
    "latitude": 49.2141515,
    "longitude": -124.043906,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1975,
    "city_name": "Wells",
    "latitude": 53.0859739,
    "longitude": -121.6244178,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 1976,
    "city_name": "Weneez",
    "latitude": 53.966667,
    "longitude": -123.983333,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1977,
    "city_name": "West Bench",
    "latitude": 49.4961709,
    "longitude": -119.629931,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1978,
    "city_name": "West Fernie",
    "latitude": 49.5013242,
    "longitude": -115.0749768,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1979,
    "city_name": "West Heights",
    "latitude": 49.140187,
    "longitude": -122.338372,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1980,
    "city_name": "West Kelowna",
    "latitude": 49.86299,
    "longitude": -119.56891,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 1981,
    "city_name": "West Landing",
    "latitude": 55.465312,
    "longitude": -126.00265,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1982,
    "city_name": "West Mara Lake",
    "latitude": 50.7840144,
    "longitude": -119.0105146,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1983,
    "city_name": "West Midway",
    "latitude": 49.0118991,
    "longitude": -118.8214656,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1984,
    "city_name": "West Sechelt",
    "latitude": 49.4741736,
    "longitude": -123.7545601,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1985,
    "city_name": "West Thurlow Island",
    "latitude": 50.4121882,
    "longitude": -125.5886169,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1986,
    "city_name": "West Trail",
    "latitude": 49.092297,
    "longitude": -117.708329,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1987,
    "city_name": "West Vancouver",
    "latitude": 49.3286251,
    "longitude": -123.1601982,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 1988,
    "city_name": "Westbank",
    "latitude": 49.8313652,
    "longitude": -119.6281931,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1989,
    "city_name": "Westbridge",
    "latitude": 49.170418,
    "longitude": -118.975194,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1990,
    "city_name": "Westholme",
    "latitude": 48.866749,
    "longitude": -123.7005989,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1991,
    "city_name": "Westley",
    "latitude": 49.2032286,
    "longitude": -122.9066971,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1992,
    "city_name": "Westply",
    "latitude": 53.7266683,
    "longitude": -127.6476205,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1993,
    "city_name": "Westside",
    "latitude": 49.863612,
    "longitude": -119.5644584,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1994,
    "city_name": "Westsyde",
    "latitude": 50.7575138,
    "longitude": -120.3490077,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1995,
    "city_name": "Westview",
    "latitude": 49.836543,
    "longitude": -124.5271939,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1996,
    "city_name": "Westwold",
    "latitude": 50.4723,
    "longitude": -119.773993,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1997,
    "city_name": "Whaletown",
    "latitude": 50.105079,
    "longitude": -125.043559,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1998,
    "city_name": "Whiplash Ranch",
    "latitude": 53.7266683,
    "longitude": -127.6476205,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 1999,
    "city_name": "Whisky Creek",
    "latitude": 49.308333,
    "longitude": -124.505556,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 2000,
    "city_name": "Whistler",
    "latitude": 50.1163196,
    "longitude": -122.9573563,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 1
  },
  {
    "id": 2001,
    "city_name": "Whistler Creek",
    "latitude": 50.093591,
    "longitude": -122.994939,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 2002,
    "city_name": "White Lake",
    "latitude": 50.882026,
    "longitude": -119.299486,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 2003,
    "city_name": "White Pass",
    "latitude": 59.6247222,
    "longitude": -135.1380556,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 2004,
    "city_name": "White Rock",
    "latitude": 49.0253085,
    "longitude": -122.802962,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 2005,
    "city_name": "Whitecroft",
    "latitude": 50.8622921,
    "longitude": -119.9720284,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 2006,
    "city_name": "Whonnock",
    "latitude": 49.176467,
    "longitude": -122.468939,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 2007,
    "city_name": "Whyac",
    "latitude": 48.671362,
    "longitude": -124.847778,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 2008,
    "city_name": "Wildwood",
    "latitude": 49.889594,
    "longitude": -124.5522991,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 2009,
    "city_name": "Wildwood Subdivision",
    "latitude": 49.3391671,
    "longitude": -123.1411039,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 2010,
    "city_name": "Wiley",
    "latitude": 54.515044,
    "longitude": -126.336944,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 2011,
    "city_name": "Williams Beach",
    "latitude": 49.821091,
    "longitude": -125.0509071,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 2012,
    "city_name": "Williams Lake",
    "latitude": 52.1416736,
    "longitude": -122.1416885,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 2013,
    "city_name": "Williams Landing",
    "latitude": 49.4395605,
    "longitude": -122.5137142,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 2014,
    "city_name": "Williamsons Landing",
    "latitude": 49.455679,
    "longitude": -123.474495,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 2015,
    "city_name": "Willow Brook",
    "latitude": 49.266492,
    "longitude": -119.592269,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 2016,
    "city_name": "Willow Flats",
    "latitude": 53.7266683,
    "longitude": -127.6476205,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 2017,
    "city_name": "Willow Point",
    "latitude": 49.570313,
    "longitude": -117.2362259,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 2018,
    "city_name": "Willow Ranch",
    "latitude": 52.8173313,
    "longitude": -119.2943464,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 2019,
    "city_name": "Willow River",
    "latitude": 54.075643,
    "longitude": -122.474036,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 2020,
    "city_name": "Willow Valley",
    "latitude": 55.85,
    "longitude": -120.8666671,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 2021,
    "city_name": "Willowvale",
    "latitude": 54.033333,
    "longitude": -124.45,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 2022,
    "city_name": "Wilmer",
    "latitude": 50.5382419,
    "longitude": -116.0654809,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 2023,
    "city_name": "Wilson Creek",
    "latitude": 49.44743,
    "longitude": -123.711635,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 2024,
    "city_name": "Wilson Landing",
    "latitude": 49.983524,
    "longitude": -119.4956879,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 2025,
    "city_name": "Windermere",
    "latitude": 50.462525,
    "longitude": -115.9886462,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 3
  },
  {
    "id": 2026,
    "city_name": "Windy",
    "latitude": 51.8676786,
    "longitude": -118.1509206,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 2027,
    "city_name": "Winfield",
    "latitude": 50.0220455,
    "longitude": -119.4052664,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 2028,
    "city_name": "Wingdam",
    "latitude": 53.05,
    "longitude": -121.9666669,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 2029,
    "city_name": "Winlaw",
    "latitude": 49.610414,
    "longitude": -117.563463,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 2
  },
  {
    "id": 2030,
    "city_name": "Winter Harbour",
    "latitude": 50.52424,
    "longitude": -128.028259,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 2031,
    "city_name": "Wistaria",
    "latitude": 53.85,
    "longitude": -126.266667,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 2032,
    "city_name": "Wolf",
    "latitude": 51.4133975,
    "longitude": -117.0094569,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 2033,
    "city_name": "Wolfenden",
    "latitude": 50.4272222,
    "longitude": -127.5663887,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 2034,
    "city_name": "Wolverine",
    "latitude": 55.8333333,
    "longitude": -124.2666667,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 2035,
    "city_name": "Wonowon",
    "latitude": 56.730259,
    "longitude": -121.808989,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 2036,
    "city_name": "Woodcock",
    "latitude": 55.065845,
    "longitude": -128.234018,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 2037,
    "city_name": "Woodfibre",
    "latitude": 49.667145,
    "longitude": -123.251134,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 2038,
    "city_name": "Woodmere",
    "latitude": 54.679876,
    "longitude": -126.9633431,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 2039,
    "city_name": "Woodpecker",
    "latitude": 53.523428,
    "longitude": -122.642526,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 2040,
    "city_name": "Woods Landing",
    "latitude": 51.070832,
    "longitude": -119.056108,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 2041,
    "city_name": "Woodsdale",
    "latitude": 50.049268,
    "longitude": -119.389937,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 2042,
    "city_name": "Worth",
    "latitude": 49.532677,
    "longitude": -119.5675724,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 2043,
    "city_name": "Woss",
    "latitude": 50.215414,
    "longitude": -126.5893911,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 2044,
    "city_name": "Wright",
    "latitude": 51.866667,
    "longitude": -121.666667,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 2045,
    "city_name": "Wycliffe",
    "latitude": 49.598173,
    "longitude": -115.867148,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 2046,
    "city_name": "Wyman",
    "latitude": 49.3281718,
    "longitude": -123.1557815,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 2047,
    "city_name": "Wynndel",
    "latitude": 49.1807329,
    "longitude": -116.555034,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 2048,
    "city_name": "Yaculta",
    "latitude": 50.022019,
    "longitude": -125.196191,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 2049,
    "city_name": "Yahk",
    "latitude": 49.0867938,
    "longitude": -116.0883997,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 2050,
    "city_name": "Yaku",
    "latitude": 54.1808,
    "longitude": -133.0272764,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 2051,
    "city_name": "Yale",
    "latitude": 49.561062,
    "longitude": -121.4291721,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 3
  },
  {
    "id": 2052,
    "city_name": "Yankee Flats",
    "latitude": 50.516667,
    "longitude": -119.3666671,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 2053,
    "city_name": "Yarksis",
    "latitude": 49.166766,
    "longitude": -125.971069,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 2054,
    "city_name": "Yarrow",
    "latitude": 49.0821013,
    "longitude": -122.0647472,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 3
  },
  {
    "id": 2055,
    "city_name": "Yekooche",
    "latitude": 54.6,
    "longitude": -125.075,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 2056,
    "city_name": "Yellow Point",
    "latitude": 49.0724665,
    "longitude": -123.8009079,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 2057,
    "city_name": "Yellowhead",
    "latitude": 53.8621179,
    "longitude": -123.2343249,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 2058,
    "city_name": "Yennadon",
    "latitude": 49.235076,
    "longitude": -122.579395,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 2059,
    "city_name": "Ymir",
    "latitude": 49.284569,
    "longitude": -117.218357,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 2060,
    "city_name": "Yoho",
    "latitude": 51.4666667,
    "longitude": -116.5833333,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 2061,
    "city_name": "Youbou",
    "latitude": 48.8667023,
    "longitude": -124.2000107,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 2062,
    "city_name": "Yreka",
    "latitude": 50.4644772,
    "longitude": -127.5613786,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 2063,
    "city_name": "Yuquot",
    "latitude": 49.591767,
    "longitude": -126.618654,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 2064,
    "city_name": "Zamora",
    "latitude": 49.15378,
    "longitude": -118.98176,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 2065,
    "city_name": "Zeballos",
    "latitude": 49.981803,
    "longitude": -126.845404,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 2066,
    "city_name": "Zeke",
    "latitude": 53.7266683,
    "longitude": -127.6476205,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  },
  {
    "id": 2067,
    "city_name": "Zincton",
    "latitude": 50.038231,
    "longitude": -117.2054319,
    "created_at": "2023-10-17T18:25:43.511Z",
    "published_at": "2023-10-17T18:25:43.511Z",
    "rank": 5
  }
]

async function up(knex) {

  let i, j, rowsToInsert, chunk = 200;

  // insert rows in 200 row batches
  if (await knex.schema.hasTable('search_cities')) {
    await knex.transaction(async trx => {
      for (i = 0, j = rows.length; i < j; i += chunk) {
        rowsToInsert = rows.slice(i, i + chunk);
        await trx('search_cities').insert(rowsToInsert);
      }
    });
  }
}

module.exports = { up };