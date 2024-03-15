'use strict'

const rows = [
  {
    "orcs": "1",
    "district": "Campbell River Natural Resource District"
  },
  {
    "orcs": "1",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "2",
    "district": "Prince George Natural Resource District"
  },
  {
    "orcs": "3",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "4",
    "district": "Selkirk Natural Resource District"
  },
  {
    "orcs": "5",
    "district": "Rocky Mountain Natural Resource District"
  },
  {
    "orcs": "5",
    "district": "Selkirk Natural Resource District"
  },
  {
    "orcs": "6",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "7",
    "district": "Chilliwack Natural Resource District"
  },
  {
    "orcs": "7",
    "district": "Sea to Sky Natural Resource District"
  },
  {
    "orcs": "8",
    "district": "Chilliwack Natural Resource District"
  },
  {
    "orcs": "8",
    "district": "Sea to Sky Natural Resource District"
  },
  {
    "orcs": "9",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "10",
    "district": "Selkirk Natural Resource District"
  },
  {
    "orcs": "11",
    "district": "Okanagan Shuswap Natural Resource District"
  },
  {
    "orcs": "12",
    "district": "Selkirk Natural Resource District"
  },
  {
    "orcs": "13",
    "district": "Nadina Natural Resource District"
  },
  {
    "orcs": "14",
    "district": "Peace Natural Resource District"
  },
  {
    "orcs": "15",
    "district": "Chilliwack Natural Resource District"
  },
  {
    "orcs": "16",
    "district": "Peace Natural Resource District"
  },
  {
    "orcs": "17",
    "district": "Selkirk Natural Resource District"
  },
  {
    "orcs": "19",
    "district": "Cariboo-Chilcotin Natural Resource District"
  },
  {
    "orcs": "19",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "19",
    "district": "Nadina Natural Resource District"
  },
  {
    "orcs": "19",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "20",
    "district": "Okanagan Shuswap Natural Resource District"
  },
  {
    "orcs": "21",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "22",
    "district": "Okanagan Shuswap Natural Resource District"
  },
  {
    "orcs": "23",
    "district": "Chilliwack Natural Resource District"
  },
  {
    "orcs": "24",
    "district": "100 Mile House Natural Resource District"
  },
  {
    "orcs": "24",
    "district": "Cariboo-Chilcotin Natural Resource District"
  },
  {
    "orcs": "24",
    "district": "Prince George Natural Resource District"
  },
  {
    "orcs": "24",
    "district": "Thompson Rivers Natural Resource District"
  },
  {
    "orcs": "25",
    "district": "Rocky Mountain Natural Resource District"
  },
  {
    "orcs": "26",
    "district": "100 Mile House Natural Resource District"
  },
  {
    "orcs": "27",
    "district": "Okanagan Shuswap Natural Resource District"
  },
  {
    "orcs": "28",
    "district": "Campbell River Natural Resource District"
  },
  {
    "orcs": "29",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "30",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "31",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "32",
    "district": "Quesnel Natural Resource District"
  },
  {
    "orcs": "33",
    "district": "Cascades Natural Resource District"
  },
  {
    "orcs": "33",
    "district": "Chilliwack Natural Resource District"
  },
  {
    "orcs": "34",
    "district": "Selkirk Natural Resource District"
  },
  {
    "orcs": "35",
    "district": "Okanagan Shuswap Natural Resource District"
  },
  {
    "orcs": "36",
    "district": "Campbell River Natural Resource District"
  },
  {
    "orcs": "37",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "38",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "39",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "40",
    "district": "Sunshine Coast Natural Resource District"
  },
  {
    "orcs": "41",
    "district": "Chilliwack Natural Resource District"
  },
  {
    "orcs": "43",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "44",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "45",
    "district": "Campbell River Natural Resource District"
  },
  {
    "orcs": "46",
    "district": "Cascades Natural Resource District"
  },
  {
    "orcs": "47",
    "district": "Nadina Natural Resource District"
  },
  {
    "orcs": "48",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "49",
    "district": "Chilliwack Natural Resource District"
  },
  {
    "orcs": "50",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "51",
    "district": "Selkirk Natural Resource District"
  },
  {
    "orcs": "52",
    "district": "Selkirk Natural Resource District"
  },
  {
    "orcs": "53",
    "district": "Rocky Mountain Natural Resource District"
  },
  {
    "orcs": "54",
    "district": "Okanagan Shuswap Natural Resource District"
  },
  {
    "orcs": "55",
    "district": "Mackenzie Natural Resource District"
  },
  {
    "orcs": "56",
    "district": "Selkirk Natural Resource District"
  },
  {
    "orcs": "57",
    "district": "100 Mile House Natural Resource District"
  },
  {
    "orcs": "58",
    "district": "Cascades Natural Resource District"
  },
  {
    "orcs": "59",
    "district": "100 Mile House Natural Resource District"
  },
  {
    "orcs": "60",
    "district": "Prince George Natural Resource District"
  },
  {
    "orcs": "60",
    "district": "Quesnel Natural Resource District"
  },
  {
    "orcs": "61",
    "district": "Rocky Mountain Natural Resource District"
  },
  {
    "orcs": "62",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "63",
    "district": "Cascades Natural Resource District"
  },
  {
    "orcs": "64",
    "district": "Okanagan Shuswap Natural Resource District"
  },
  {
    "orcs": "65",
    "district": "Rocky Mountain Natural Resource District"
  },
  {
    "orcs": "66",
    "district": "Selkirk Natural Resource District"
  },
  {
    "orcs": "67",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "68",
    "district": "100 Mile House Natural Resource District"
  },
  {
    "orcs": "69",
    "district": "Thompson Rivers Natural Resource District"
  },
  {
    "orcs": "70",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "71",
    "district": "Okanagan Shuswap Natural Resource District"
  },
  {
    "orcs": "72",
    "district": "Chilliwack Natural Resource District"
  },
  {
    "orcs": "73",
    "district": "Okanagan Shuswap Natural Resource District"
  },
  {
    "orcs": "74",
    "district": "Skeena Stikine Natural Resource District"
  },
  {
    "orcs": "75",
    "district": "Cascades Natural Resource District"
  },
  {
    "orcs": "76",
    "district": "Cascades Natural Resource District"
  },
  {
    "orcs": "77",
    "district": "Okanagan Shuswap Natural Resource District"
  },
  {
    "orcs": "78",
    "district": "Prince George Natural Resource District"
  },
  {
    "orcs": "79",
    "district": "Selkirk Natural Resource District"
  },
  {
    "orcs": "80",
    "district": "Okanagan Shuswap Natural Resource District"
  },
  {
    "orcs": "81",
    "district": "Chilliwack Natural Resource District"
  },
  {
    "orcs": "82",
    "district": "100 Mile House Natural Resource District"
  },
  {
    "orcs": "84",
    "district": "Skeena Stikine Natural Resource District"
  },
  {
    "orcs": "85",
    "district": "Okanagan Shuswap Natural Resource District"
  },
  {
    "orcs": "86",
    "district": "Okanagan Shuswap Natural Resource District"
  },
  {
    "orcs": "87",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "89",
    "district": "Okanagan Shuswap Natural Resource District"
  },
  {
    "orcs": "90",
    "district": "Sea to Sky Natural Resource District"
  },
  {
    "orcs": "92",
    "district": "Fort Nelson Natural Resource District"
  },
  {
    "orcs": "93",
    "district": "Fort Nelson Natural Resource District"
  },
  {
    "orcs": "94",
    "district": "Fort Nelson Natural Resource District"
  },
  {
    "orcs": "95",
    "district": "Sunshine Coast Natural Resource District"
  },
  {
    "orcs": "96",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "98",
    "district": "Rocky Mountain Natural Resource District"
  },
  {
    "orcs": "102",
    "district": "Rocky Mountain Natural Resource District"
  },
  {
    "orcs": "104",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "105",
    "district": "Rocky Mountain Natural Resource District"
  },
  {
    "orcs": "106",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "108",
    "district": "Rocky Mountain Natural Resource District"
  },
  {
    "orcs": "109",
    "district": "Campbell River Natural Resource District"
  },
  {
    "orcs": "110",
    "district": "Selkirk Natural Resource District"
  },
  {
    "orcs": "111",
    "district": "100 Mile House Natural Resource District"
  },
  {
    "orcs": "112",
    "district": "Selkirk Natural Resource District"
  },
  {
    "orcs": "113",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "114",
    "district": "Rocky Mountain Natural Resource District"
  },
  {
    "orcs": "115",
    "district": "Stuart Nechako Natural Resource District"
  },
  {
    "orcs": "116",
    "district": "Sunshine Coast Natural Resource District"
  },
  {
    "orcs": "117",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "118",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "119",
    "district": "Cascades Natural Resource District"
  },
  {
    "orcs": "120",
    "district": "Rocky Mountain Natural Resource District"
  },
  {
    "orcs": "121",
    "district": "Rocky Mountain Natural Resource District"
  },
  {
    "orcs": "122",
    "district": "Chilliwack Natural Resource District"
  },
  {
    "orcs": "123",
    "district": "Okanagan Shuswap Natural Resource District"
  },
  {
    "orcs": "124",
    "district": "Chilliwack Natural Resource District"
  },
  {
    "orcs": "127",
    "district": "Thompson Rivers Natural Resource District"
  },
  {
    "orcs": "129",
    "district": "Prince George Natural Resource District"
  },
  {
    "orcs": "129",
    "district": "Quesnel Natural Resource District"
  },
  {
    "orcs": "130",
    "district": "Selkirk Natural Resource District"
  },
  {
    "orcs": "131",
    "district": "Campbell River Natural Resource District"
  },
  {
    "orcs": "133",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "135",
    "district": "Cariboo-Chilcotin Natural Resource District"
  },
  {
    "orcs": "136",
    "district": "Quesnel Natural Resource District"
  },
  {
    "orcs": "137",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "139",
    "district": "Okanagan Shuswap Natural Resource District"
  },
  {
    "orcs": "140",
    "district": "Peace Natural Resource District"
  },
  {
    "orcs": "141",
    "district": "Sea to Sky Natural Resource District"
  },
  {
    "orcs": "142",
    "district": "Okanagan Shuswap Natural Resource District"
  },
  {
    "orcs": "143",
    "district": "Okanagan Shuswap Natural Resource District"
  },
  {
    "orcs": "143",
    "district": "Selkirk Natural Resource District"
  },
  {
    "orcs": "144",
    "district": "Rocky Mountain Natural Resource District"
  },
  {
    "orcs": "145",
    "district": "Sunshine Coast Natural Resource District"
  },
  {
    "orcs": "146",
    "district": "Cascades Natural Resource District"
  },
  {
    "orcs": "150",
    "district": "Chilliwack Natural Resource District"
  },
  {
    "orcs": "151",
    "district": "Chilliwack Natural Resource District"
  },
  {
    "orcs": "152",
    "district": "Sea to Sky Natural Resource District"
  },
  {
    "orcs": "153",
    "district": "Selkirk Natural Resource District"
  },
  {
    "orcs": "154",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "155",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "156",
    "district": "Selkirk Natural Resource District"
  },
  {
    "orcs": "158",
    "district": "Chilliwack Natural Resource District"
  },
  {
    "orcs": "159",
    "district": "Skeena Stikine Natural Resource District"
  },
  {
    "orcs": "160",
    "district": "Nadina Natural Resource District"
  },
  {
    "orcs": "161",
    "district": "Peace Natural Resource District"
  },
  {
    "orcs": "162",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "163",
    "district": "Selkirk Natural Resource District"
  },
  {
    "orcs": "164",
    "district": "Selkirk Natural Resource District"
  },
  {
    "orcs": "165",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "166",
    "district": "Chilliwack Natural Resource District"
  },
  {
    "orcs": "167",
    "district": "Okanagan Shuswap Natural Resource District"
  },
  {
    "orcs": "169",
    "district": "Selkirk Natural Resource District"
  },
  {
    "orcs": "170",
    "district": "100 Mile House Natural Resource District"
  },
  {
    "orcs": "172",
    "district": "Selkirk Natural Resource District"
  },
  {
    "orcs": "173",
    "district": "Sunshine Coast Natural Resource District"
  },
  {
    "orcs": "174",
    "district": "Selkirk Natural Resource District"
  },
  {
    "orcs": "177",
    "district": "Prince George Natural Resource District"
  },
  {
    "orcs": "178",
    "district": "Skeena Stikine Natural Resource District"
  },
  {
    "orcs": "179",
    "district": "Sea to Sky Natural Resource District"
  },
  {
    "orcs": "180",
    "district": "Campbell River Natural Resource District"
  },
  {
    "orcs": "181",
    "district": "Peace Natural Resource District"
  },
  {
    "orcs": "182",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "183",
    "district": "Cascades Natural Resource District"
  },
  {
    "orcs": "183",
    "district": "Thompson Rivers Natural Resource District"
  },
  {
    "orcs": "185",
    "district": "Selkirk Natural Resource District"
  },
  {
    "orcs": "186",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "187",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "188",
    "district": "Campbell River Natural Resource District"
  },
  {
    "orcs": "189",
    "district": "Campbell River Natural Resource District"
  },
  {
    "orcs": "190",
    "district": "Campbell River Natural Resource District"
  },
  {
    "orcs": "192",
    "district": "Skeena Stikine Natural Resource District"
  },
  {
    "orcs": "193",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "195",
    "district": "Thompson Rivers Natural Resource District"
  },
  {
    "orcs": "196",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "198",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "199",
    "district": "Okanagan Shuswap Natural Resource District"
  },
  {
    "orcs": "200",
    "district": "Chilliwack Natural Resource District"
  },
  {
    "orcs": "201",
    "district": "Okanagan Shuswap Natural Resource District"
  },
  {
    "orcs": "202",
    "district": "Selkirk Natural Resource District"
  },
  {
    "orcs": "203",
    "district": "Sunshine Coast Natural Resource District"
  },
  {
    "orcs": "204",
    "district": "Okanagan Shuswap Natural Resource District"
  },
  {
    "orcs": "206",
    "district": "Rocky Mountain Natural Resource District"
  },
  {
    "orcs": "206",
    "district": "Selkirk Natural Resource District"
  },
  {
    "orcs": "210",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "211",
    "district": "Quesnel Natural Resource District"
  },
  {
    "orcs": "212",
    "district": "Okanagan Shuswap Natural Resource District"
  },
  {
    "orcs": "213",
    "district": "100 Mile House Natural Resource District"
  },
  {
    "orcs": "214",
    "district": "Peace Natural Resource District"
  },
  {
    "orcs": "215",
    "district": "Campbell River Natural Resource District"
  },
  {
    "orcs": "216",
    "district": "Selkirk Natural Resource District"
  },
  {
    "orcs": "217",
    "district": "100 Mile House Natural Resource District"
  },
  {
    "orcs": "218",
    "district": "Okanagan Shuswap Natural Resource District"
  },
  {
    "orcs": "220",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "221",
    "district": "Sunshine Coast Natural Resource District"
  },
  {
    "orcs": "222",
    "district": "Peace Natural Resource District"
  },
  {
    "orcs": "223",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "224",
    "district": "Cariboo-Chilcotin Natural Resource District"
  },
  {
    "orcs": "225",
    "district": "Selkirk Natural Resource District"
  },
  {
    "orcs": "226",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "227",
    "district": "Sunshine Coast Natural Resource District"
  },
  {
    "orcs": "228",
    "district": "Sunshine Coast Natural Resource District"
  },
  {
    "orcs": "229",
    "district": "Prince George Natural Resource District"
  },
  {
    "orcs": "230",
    "district": "Stuart Nechako Natural Resource District"
  },
  {
    "orcs": "231",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "232",
    "district": "Selkirk Natural Resource District"
  },
  {
    "orcs": "233",
    "district": "Cascades Natural Resource District"
  },
  {
    "orcs": "234",
    "district": "Stuart Nechako Natural Resource District"
  },
  {
    "orcs": "235",
    "district": "Rocky Mountain Natural Resource District"
  },
  {
    "orcs": "236",
    "district": "Selkirk Natural Resource District"
  },
  {
    "orcs": "237",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "238",
    "district": "Skeena Stikine Natural Resource District"
  },
  {
    "orcs": "240",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "241",
    "district": "Okanagan Shuswap Natural Resource District"
  },
  {
    "orcs": "242",
    "district": "Sea to Sky Natural Resource District"
  },
  {
    "orcs": "243",
    "district": "Sunshine Coast Natural Resource District"
  },
  {
    "orcs": "244",
    "district": "Selkirk Natural Resource District"
  },
  {
    "orcs": "245",
    "district": "Chilliwack Natural Resource District"
  },
  {
    "orcs": "246",
    "district": "Skeena Stikine Natural Resource District"
  },
  {
    "orcs": "247",
    "district": "Rocky Mountain Natural Resource District"
  },
  {
    "orcs": "250",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "251",
    "district": "Mackenzie Natural Resource District"
  },
  {
    "orcs": "251",
    "district": "Prince George Natural Resource District"
  },
  {
    "orcs": "252",
    "district": "Sunshine Coast Natural Resource District"
  },
  {
    "orcs": "253",
    "district": "Rocky Mountain Natural Resource District"
  },
  {
    "orcs": "254",
    "district": "Fort Nelson Natural Resource District"
  },
  {
    "orcs": "254",
    "district": "Mackenzie Natural Resource District"
  },
  {
    "orcs": "255",
    "district": "Haida Gwaii Natural Resource District"
  },
  {
    "orcs": "256",
    "district": "Rocky Mountain Natural Resource District"
  },
  {
    "orcs": "257",
    "district": "Mackenzie Natural Resource District"
  },
  {
    "orcs": "257",
    "district": "Stuart Nechako Natural Resource District"
  },
  {
    "orcs": "258",
    "district": "Chilliwack Natural Resource District"
  },
  {
    "orcs": "259",
    "district": "Okanagan Shuswap Natural Resource District"
  },
  {
    "orcs": "261",
    "district": "Chilliwack Natural Resource District"
  },
  {
    "orcs": "262",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "263",
    "district": "Skeena Stikine Natural Resource District"
  },
  {
    "orcs": "264",
    "district": "Sunshine Coast Natural Resource District"
  },
  {
    "orcs": "265",
    "district": "Campbell River Natural Resource District"
  },
  {
    "orcs": "266",
    "district": "Skeena Stikine Natural Resource District"
  },
  {
    "orcs": "267",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "268",
    "district": "Cariboo-Chilcotin Natural Resource District"
  },
  {
    "orcs": "269",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "272",
    "district": "Okanagan Shuswap Natural Resource District"
  },
  {
    "orcs": "273",
    "district": "100 Mile House Natural Resource District"
  },
  {
    "orcs": "275",
    "district": "Thompson Rivers Natural Resource District"
  },
  {
    "orcs": "276",
    "district": "Okanagan Shuswap Natural Resource District"
  },
  {
    "orcs": "277",
    "district": "Okanagan Shuswap Natural Resource District"
  },
  {
    "orcs": "278",
    "district": "Chilliwack Natural Resource District"
  },
  {
    "orcs": "278",
    "district": "Sea to Sky Natural Resource District"
  },
  {
    "orcs": "279",
    "district": "Mackenzie Natural Resource District"
  },
  {
    "orcs": "279",
    "district": "Skeena Stikine Natural Resource District"
  },
  {
    "orcs": "279",
    "district": "Stuart Nechako Natural Resource District"
  },
  {
    "orcs": "280",
    "district": "Fort Nelson Natural Resource District"
  },
  {
    "orcs": "281",
    "district": "Okanagan Shuswap Natural Resource District"
  },
  {
    "orcs": "281",
    "district": "Thompson Rivers Natural Resource District"
  },
  {
    "orcs": "282",
    "district": "Rocky Mountain Natural Resource District"
  },
  {
    "orcs": "283",
    "district": "Campbell River Natural Resource District"
  },
  {
    "orcs": "283",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "286",
    "district": "Peace Natural Resource District"
  },
  {
    "orcs": "287",
    "district": "Rocky Mountain Natural Resource District"
  },
  {
    "orcs": "288",
    "district": "Nadina Natural Resource District"
  },
  {
    "orcs": "289",
    "district": "Peace Natural Resource District"
  },
  {
    "orcs": "290",
    "district": "Chilliwack Natural Resource District"
  },
  {
    "orcs": "292",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "293",
    "district": "Rocky Mountain Natural Resource District"
  },
  {
    "orcs": "294",
    "district": "Sunshine Coast Natural Resource District"
  },
  {
    "orcs": "295",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "296",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "299",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "300",
    "district": "Okanagan Shuswap Natural Resource District"
  },
  {
    "orcs": "301",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "302",
    "district": "Quesnel Natural Resource District"
  },
  {
    "orcs": "303",
    "district": "Sunshine Coast Natural Resource District"
  },
  {
    "orcs": "305",
    "district": "Prince George Natural Resource District"
  },
  {
    "orcs": "306",
    "district": "Cascades Natural Resource District"
  },
  {
    "orcs": "307",
    "district": "Okanagan Shuswap Natural Resource District"
  },
  {
    "orcs": "308",
    "district": "Selkirk Natural Resource District"
  },
  {
    "orcs": "310",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "311",
    "district": "Selkirk Natural Resource District"
  },
  {
    "orcs": "313",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "314",
    "district": "Sea to Sky Natural Resource District"
  },
  {
    "orcs": "315",
    "district": "Peace Natural Resource District"
  },
  {
    "orcs": "315",
    "district": "Prince George Natural Resource District"
  },
  {
    "orcs": "316",
    "district": "Peace Natural Resource District"
  },
  {
    "orcs": "317",
    "district": "Mackenzie Natural Resource District"
  },
  {
    "orcs": "318",
    "district": "Prince George Natural Resource District"
  },
  {
    "orcs": "319",
    "district": "Selkirk Natural Resource District"
  },
  {
    "orcs": "320",
    "district": "Nadina Natural Resource District"
  },
  {
    "orcs": "321",
    "district": "Haida Gwaii Natural Resource District"
  },
  {
    "orcs": "322",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "323",
    "district": "Selkirk Natural Resource District"
  },
  {
    "orcs": "324",
    "district": "Selkirk Natural Resource District"
  },
  {
    "orcs": "325",
    "district": "Prince George Natural Resource District"
  },
  {
    "orcs": "326",
    "district": "Peace Natural Resource District"
  },
  {
    "orcs": "327",
    "district": "Selkirk Natural Resource District"
  },
  {
    "orcs": "328",
    "district": "Fort Nelson Natural Resource District"
  },
  {
    "orcs": "329",
    "district": "Skeena Stikine Natural Resource District"
  },
  {
    "orcs": "330",
    "district": "Chilliwack Natural Resource District"
  },
  {
    "orcs": "331",
    "district": "Sea to Sky Natural Resource District"
  },
  {
    "orcs": "333",
    "district": "Sunshine Coast Natural Resource District"
  },
  {
    "orcs": "334",
    "district": "Cascades Natural Resource District"
  },
  {
    "orcs": "335",
    "district": "Chilliwack Natural Resource District"
  },
  {
    "orcs": "336",
    "district": "Chilliwack Natural Resource District"
  },
  {
    "orcs": "338",
    "district": "Rocky Mountain Natural Resource District"
  },
  {
    "orcs": "339",
    "district": "Campbell River Natural Resource District"
  },
  {
    "orcs": "339",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "340",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "341",
    "district": "Fort Nelson Natural Resource District"
  },
  {
    "orcs": "341",
    "district": "Mackenzie Natural Resource District"
  },
  {
    "orcs": "343",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "343",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "344",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "345",
    "district": "Peace Natural Resource District"
  },
  {
    "orcs": "345",
    "district": "Prince George Natural Resource District"
  },
  {
    "orcs": "347",
    "district": "Skeena Stikine Natural Resource District"
  },
  {
    "orcs": "348",
    "district": "Campbell River Natural Resource District"
  },
  {
    "orcs": "351",
    "district": "Cascades Natural Resource District"
  },
  {
    "orcs": "351",
    "district": "Chilliwack Natural Resource District"
  },
  {
    "orcs": "353",
    "district": "Thompson Rivers Natural Resource District"
  },
  {
    "orcs": "355",
    "district": "Prince George Natural Resource District"
  },
  {
    "orcs": "356",
    "district": "Skeena Stikine Natural Resource District"
  },
  {
    "orcs": "357",
    "district": "Selkirk Natural Resource District"
  },
  {
    "orcs": "358",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "361",
    "district": "Thompson Rivers Natural Resource District"
  },
  {
    "orcs": "362",
    "district": "Rocky Mountain Natural Resource District"
  },
  {
    "orcs": "363",
    "district": "Cascades Natural Resource District"
  },
  {
    "orcs": "363",
    "district": "Sea to Sky Natural Resource District"
  },
  {
    "orcs": "365",
    "district": "Sunshine Coast Natural Resource District"
  },
  {
    "orcs": "366",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "367",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "369",
    "district": "Thompson Rivers Natural Resource District"
  },
  {
    "orcs": "370",
    "district": "Stuart Nechako Natural Resource District"
  },
  {
    "orcs": "371",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "372",
    "district": "Sunshine Coast Natural Resource District"
  },
  {
    "orcs": "373",
    "district": "Sunshine Coast Natural Resource District"
  },
  {
    "orcs": "374",
    "district": "Campbell River Natural Resource District"
  },
  {
    "orcs": "375",
    "district": "Sunshine Coast Natural Resource District"
  },
  {
    "orcs": "376",
    "district": "Sunshine Coast Natural Resource District"
  },
  {
    "orcs": "377",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "378",
    "district": "Okanagan Shuswap Natural Resource District"
  },
  {
    "orcs": "379",
    "district": "Sunshine Coast Natural Resource District"
  },
  {
    "orcs": "380",
    "district": "Nadina Natural Resource District"
  },
  {
    "orcs": "381",
    "district": "Sea to Sky Natural Resource District"
  },
  {
    "orcs": "382",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "383",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "384",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "385",
    "district": "Prince George Natural Resource District"
  },
  {
    "orcs": "386",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "388",
    "district": "Sunshine Coast Natural Resource District"
  },
  {
    "orcs": "389",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "390",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "391",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "392",
    "district": "Sunshine Coast Natural Resource District"
  },
  {
    "orcs": "393",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "394",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "395",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "396",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "397",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "398",
    "district": "Cariboo-Chilcotin Natural Resource District"
  },
  {
    "orcs": "400",
    "district": "Nadina Natural Resource District"
  },
  {
    "orcs": "400",
    "district": "Skeena Stikine Natural Resource District"
  },
  {
    "orcs": "401",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "402",
    "district": "Cascades Natural Resource District"
  },
  {
    "orcs": "402",
    "district": "Sea to Sky Natural Resource District"
  },
  {
    "orcs": "403",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "404",
    "district": "Selkirk Natural Resource District"
  },
  {
    "orcs": "405",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "406",
    "district": "Stuart Nechako Natural Resource District"
  },
  {
    "orcs": "407",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "408",
    "district": "Thompson Rivers Natural Resource District"
  },
  {
    "orcs": "409",
    "district": "Cariboo-Chilcotin Natural Resource District"
  },
  {
    "orcs": "409",
    "district": "Cascades Natural Resource District"
  },
  {
    "orcs": "409",
    "district": "Sunshine Coast Natural Resource District"
  },
  {
    "orcs": "410",
    "district": "Skeena Stikine Natural Resource District"
  },
  {
    "orcs": "411",
    "district": "Sunshine Coast Natural Resource District"
  },
  {
    "orcs": "412",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "414",
    "district": "Sea to Sky Natural Resource District"
  },
  {
    "orcs": "415",
    "district": "Prince George Natural Resource District"
  },
  {
    "orcs": "416",
    "district": "Prince George Natural Resource District"
  },
  {
    "orcs": "421",
    "district": "Peace Natural Resource District"
  },
  {
    "orcs": "422",
    "district": "Prince George Natural Resource District"
  },
  {
    "orcs": "425",
    "district": "Prince George Natural Resource District"
  },
  {
    "orcs": "426",
    "district": "Fort Nelson Natural Resource District"
  },
  {
    "orcs": "426",
    "district": "Mackenzie Natural Resource District"
  },
  {
    "orcs": "427",
    "district": "Skeena Stikine Natural Resource District"
  },
  {
    "orcs": "428",
    "district": "Skeena Stikine Natural Resource District"
  },
  {
    "orcs": "429",
    "district": "Mackenzie Natural Resource District"
  },
  {
    "orcs": "429",
    "district": "Skeena Stikine Natural Resource District"
  },
  {
    "orcs": "430",
    "district": "Skeena Stikine Natural Resource District"
  },
  {
    "orcs": "431",
    "district": "Skeena Stikine Natural Resource District"
  },
  {
    "orcs": "432",
    "district": "Skeena Stikine Natural Resource District"
  },
  {
    "orcs": "433",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "433",
    "district": "Skeena Stikine Natural Resource District"
  },
  {
    "orcs": "434",
    "district": "Skeena Stikine Natural Resource District"
  },
  {
    "orcs": "435",
    "district": "Mackenzie Natural Resource District"
  },
  {
    "orcs": "436",
    "district": "Mackenzie Natural Resource District"
  },
  {
    "orcs": "436",
    "district": "Skeena Stikine Natural Resource District"
  },
  {
    "orcs": "437",
    "district": "Mackenzie Natural Resource District"
  },
  {
    "orcs": "438",
    "district": "Skeena Stikine Natural Resource District"
  },
  {
    "orcs": "440",
    "district": "Okanagan Shuswap Natural Resource District"
  },
  {
    "orcs": "442",
    "district": "Okanagan Shuswap Natural Resource District"
  },
  {
    "orcs": "445",
    "district": "Okanagan Shuswap Natural Resource District"
  },
  {
    "orcs": "446",
    "district": "Okanagan Shuswap Natural Resource District"
  },
  {
    "orcs": "447",
    "district": "Okanagan Shuswap Natural Resource District"
  },
  {
    "orcs": "448",
    "district": "Okanagan Shuswap Natural Resource District"
  },
  {
    "orcs": "449",
    "district": "Okanagan Shuswap Natural Resource District"
  },
  {
    "orcs": "449",
    "district": "Selkirk Natural Resource District"
  },
  {
    "orcs": "449",
    "district": "Thompson Rivers Natural Resource District"
  },
  {
    "orcs": "450",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "453",
    "district": "Okanagan Shuswap Natural Resource District"
  },
  {
    "orcs": "456",
    "district": "Okanagan Shuswap Natural Resource District"
  },
  {
    "orcs": "457",
    "district": "Okanagan Shuswap Natural Resource District"
  },
  {
    "orcs": "457",
    "district": "Selkirk Natural Resource District"
  },
  {
    "orcs": "462",
    "district": "Okanagan Shuswap Natural Resource District"
  },
  {
    "orcs": "463",
    "district": "Okanagan Shuswap Natural Resource District"
  },
  {
    "orcs": "464",
    "district": "Okanagan Shuswap Natural Resource District"
  },
  {
    "orcs": "467",
    "district": "Okanagan Shuswap Natural Resource District"
  },
  {
    "orcs": "468",
    "district": "Okanagan Shuswap Natural Resource District"
  },
  {
    "orcs": "469",
    "district": "Sunshine Coast Natural Resource District"
  },
  {
    "orcs": "470",
    "district": "Skeena Stikine Natural Resource District"
  },
  {
    "orcs": "471",
    "district": "Okanagan Shuswap Natural Resource District"
  },
  {
    "orcs": "472",
    "district": "Campbell River Natural Resource District"
  },
  {
    "orcs": "472",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "474",
    "district": "Cascades Natural Resource District"
  },
  {
    "orcs": "474",
    "district": "Okanagan Shuswap Natural Resource District"
  },
  {
    "orcs": "475",
    "district": "Sunshine Coast Natural Resource District"
  },
  {
    "orcs": "477",
    "district": "Skeena Stikine Natural Resource District"
  },
  {
    "orcs": "481",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "482",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "483",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "484",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "485",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "486",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "487",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "488",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "489",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "490",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "491",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "492",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "500",
    "district": "Cascades Natural Resource District"
  },
  {
    "orcs": "509",
    "district": "Prince George Natural Resource District"
  },
  {
    "orcs": "511",
    "district": "Campbell River Natural Resource District"
  },
  {
    "orcs": "517",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "518",
    "district": "Stuart Nechako Natural Resource District"
  },
  {
    "orcs": "520",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "521",
    "district": "Peace Natural Resource District"
  },
  {
    "orcs": "523",
    "district": "Skeena Stikine Natural Resource District"
  },
  {
    "orcs": "524",
    "district": "Cariboo-Chilcotin Natural Resource District"
  },
  {
    "orcs": "525",
    "district": "Skeena Stikine Natural Resource District"
  },
  {
    "orcs": "527",
    "district": "Selkirk Natural Resource District"
  },
  {
    "orcs": "528",
    "district": "Selkirk Natural Resource District"
  },
  {
    "orcs": "529",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "530",
    "district": "Skeena Stikine Natural Resource District"
  },
  {
    "orcs": "531",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "531",
    "district": "Nadina Natural Resource District"
  },
  {
    "orcs": "532",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "532",
    "district": "Nadina Natural Resource District"
  },
  {
    "orcs": "532",
    "district": "Skeena Stikine Natural Resource District"
  },
  {
    "orcs": "533",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "533",
    "district": "Nadina Natural Resource District"
  },
  {
    "orcs": "534",
    "district": "Nadina Natural Resource District"
  },
  {
    "orcs": "535",
    "district": "Nadina Natural Resource District"
  },
  {
    "orcs": "536",
    "district": "Nadina Natural Resource District"
  },
  {
    "orcs": "537",
    "district": "Nadina Natural Resource District"
  },
  {
    "orcs": "538",
    "district": "Nadina Natural Resource District"
  },
  {
    "orcs": "539",
    "district": "Nadina Natural Resource District"
  },
  {
    "orcs": "540",
    "district": "Nadina Natural Resource District"
  },
  {
    "orcs": "541",
    "district": "Nadina Natural Resource District"
  },
  {
    "orcs": "542",
    "district": "Nadina Natural Resource District"
  },
  {
    "orcs": "543",
    "district": "Nadina Natural Resource District"
  },
  {
    "orcs": "544",
    "district": "Nadina Natural Resource District"
  },
  {
    "orcs": "545",
    "district": "Sea to Sky Natural Resource District"
  },
  {
    "orcs": "546",
    "district": "Cascades Natural Resource District"
  },
  {
    "orcs": "546",
    "district": "Sea to Sky Natural Resource District"
  },
  {
    "orcs": "547",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "549",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "551",
    "district": "Okanagan Shuswap Natural Resource District"
  },
  {
    "orcs": "552",
    "district": "Cascades Natural Resource District"
  },
  {
    "orcs": "552",
    "district": "Sea to Sky Natural Resource District"
  },
  {
    "orcs": "553",
    "district": "Cascades Natural Resource District"
  },
  {
    "orcs": "553",
    "district": "Sea to Sky Natural Resource District"
  },
  {
    "orcs": "554",
    "district": "Sea to Sky Natural Resource District"
  },
  {
    "orcs": "555",
    "district": "Cascades Natural Resource District"
  },
  {
    "orcs": "555",
    "district": "Chilliwack Natural Resource District"
  },
  {
    "orcs": "555",
    "district": "Sea to Sky Natural Resource District"
  },
  {
    "orcs": "556",
    "district": "Sea to Sky Natural Resource District"
  },
  {
    "orcs": "557",
    "district": "Sea to Sky Natural Resource District"
  },
  {
    "orcs": "558",
    "district": "Sea to Sky Natural Resource District"
  },
  {
    "orcs": "559",
    "district": "Haida Gwaii Natural Resource District"
  },
  {
    "orcs": "560",
    "district": "Haida Gwaii Natural Resource District"
  },
  {
    "orcs": "561",
    "district": "Sea to Sky Natural Resource District"
  },
  {
    "orcs": "562",
    "district": "Haida Gwaii Natural Resource District"
  },
  {
    "orcs": "563",
    "district": "Haida Gwaii Natural Resource District"
  },
  {
    "orcs": "564",
    "district": "Haida Gwaii Natural Resource District"
  },
  {
    "orcs": "566",
    "district": "Haida Gwaii Natural Resource District"
  },
  {
    "orcs": "567",
    "district": "Haida Gwaii Natural Resource District"
  },
  {
    "orcs": "568",
    "district": "Skeena Stikine Natural Resource District"
  },
  {
    "orcs": "569",
    "district": "Haida Gwaii Natural Resource District"
  },
  {
    "orcs": "570",
    "district": "Haida Gwaii Natural Resource District"
  },
  {
    "orcs": "571",
    "district": "Haida Gwaii Natural Resource District"
  },
  {
    "orcs": "572",
    "district": "Haida Gwaii Natural Resource District"
  },
  {
    "orcs": "577",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "582",
    "district": "Cariboo-Chilcotin Natural Resource District"
  },
  {
    "orcs": "583",
    "district": "Cariboo-Chilcotin Natural Resource District"
  },
  {
    "orcs": "584",
    "district": "100 Mile House Natural Resource District"
  },
  {
    "orcs": "585",
    "district": "Cariboo-Chilcotin Natural Resource District"
  },
  {
    "orcs": "586",
    "district": "100 Mile House Natural Resource District"
  },
  {
    "orcs": "587",
    "district": "Quesnel Natural Resource District"
  },
  {
    "orcs": "588",
    "district": "Cariboo-Chilcotin Natural Resource District"
  },
  {
    "orcs": "589",
    "district": "Cariboo-Chilcotin Natural Resource District"
  },
  {
    "orcs": "590",
    "district": "Cariboo-Chilcotin Natural Resource District"
  },
  {
    "orcs": "591",
    "district": "Cariboo-Chilcotin Natural Resource District"
  },
  {
    "orcs": "592",
    "district": "Quesnel Natural Resource District"
  },
  {
    "orcs": "593",
    "district": "Fort Nelson Natural Resource District"
  },
  {
    "orcs": "593",
    "district": "Skeena Stikine Natural Resource District"
  },
  {
    "orcs": "596",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "597",
    "district": "Campbell River Natural Resource District"
  },
  {
    "orcs": "598",
    "district": "Cascades Natural Resource District"
  },
  {
    "orcs": "616",
    "district": "Sea to Sky Natural Resource District"
  },
  {
    "orcs": "623",
    "district": "Cascades Natural Resource District"
  },
  {
    "orcs": "624",
    "district": "Cascades Natural Resource District"
  },
  {
    "orcs": "625",
    "district": "Cascades Natural Resource District"
  },
  {
    "orcs": "626",
    "district": "Cascades Natural Resource District"
  },
  {
    "orcs": "627",
    "district": "Cascades Natural Resource District"
  },
  {
    "orcs": "628",
    "district": "100 Mile House Natural Resource District"
  },
  {
    "orcs": "629",
    "district": "100 Mile House Natural Resource District"
  },
  {
    "orcs": "632",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "633",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "634",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "635",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "1000",
    "district": "Campbell River Natural Resource District"
  },
  {
    "orcs": "1000",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "1001",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "1002",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "1003",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "1004",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "1005",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "1006",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "1007",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "1008",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "1009",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "1010",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "1011",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "1012",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "1012",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "1013",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "1013",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "1014",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "1015",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "1016",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "1017",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "1018",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "1019",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "1020",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "1021",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "1022",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "1023",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "1024",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "1025",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "1026",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "1027",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "1028",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "1029",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "1030",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "1030",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "1031",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "1032",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "1033",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "1034",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "1035",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "1036",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "1037",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "1038",
    "district": "Campbell River Natural Resource District"
  },
  {
    "orcs": "1038",
    "district": "Sunshine Coast Natural Resource District"
  },
  {
    "orcs": "1039",
    "district": "Campbell River Natural Resource District"
  },
  {
    "orcs": "1040",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "1041",
    "district": "Campbell River Natural Resource District"
  },
  {
    "orcs": "1042",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "1043",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "1044",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "1045",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "1046",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "1048",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "1049",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "1050",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "1051",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "1052",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "1053",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "1054",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "1055",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "1056",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "1057",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "1058",
    "district": "Campbell River Natural Resource District"
  },
  {
    "orcs": "1059",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "1060",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "1061",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "1062",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "1063",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "1064",
    "district": "Campbell River Natural Resource District"
  },
  {
    "orcs": "1065",
    "district": "Campbell River Natural Resource District"
  },
  {
    "orcs": "1066",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "1067",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "1067",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "1068",
    "district": "Cariboo-Chilcotin Natural Resource District"
  },
  {
    "orcs": "1068",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "1069",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "1070",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "1071",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "1072",
    "district": "Campbell River Natural Resource District"
  },
  {
    "orcs": "1073",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "1074",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "1075",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "1077",
    "district": "Skeena Stikine Natural Resource District"
  },
  {
    "orcs": "1078",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "1079",
    "district": "Skeena Stikine Natural Resource District"
  },
  {
    "orcs": "1080",
    "district": "Skeena Stikine Natural Resource District"
  },
  {
    "orcs": "1081",
    "district": "Skeena Stikine Natural Resource District"
  },
  {
    "orcs": "1083",
    "district": "Skeena Stikine Natural Resource District"
  },
  {
    "orcs": "1084",
    "district": "Cariboo-Chilcotin Natural Resource District"
  },
  {
    "orcs": "1086",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "1087",
    "district": "Cariboo-Chilcotin Natural Resource District"
  },
  {
    "orcs": "1088",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "1089",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "1090",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "1091",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "1092",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "1093",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "1094",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "1095",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "1096",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "1097",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "1098",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "1099",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "1100",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "1101",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "1102",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "1103",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "1104",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "1105",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "1106",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "1108",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "1109",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "1110",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "1111",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "1112",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "1113",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "1114",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "1115",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "1116",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "1117",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "1118",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "1119",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "1120",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "1121",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "1122",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "1123",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "1124",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "1125",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "3001",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "3002",
    "district": "Sunshine Coast Natural Resource District"
  },
  {
    "orcs": "3003",
    "district": "Cascades Natural Resource District"
  },
  {
    "orcs": "3004",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "3005",
    "district": "Okanagan Shuswap Natural Resource District"
  },
  {
    "orcs": "3006",
    "district": "Okanagan Shuswap Natural Resource District"
  },
  {
    "orcs": "3007",
    "district": "Okanagan Shuswap Natural Resource District"
  },
  {
    "orcs": "3008",
    "district": "Peace Natural Resource District"
  },
  {
    "orcs": "3009",
    "district": "Haida Gwaii Natural Resource District"
  },
  {
    "orcs": "3010",
    "district": "Haida Gwaii Natural Resource District"
  },
  {
    "orcs": "3011",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "3012",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "3013",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "3014",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "3016",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "3017",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "3018",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "3019",
    "district": "Rocky Mountain Natural Resource District"
  },
  {
    "orcs": "3020",
    "district": "Rocky Mountain Natural Resource District"
  },
  {
    "orcs": "3021",
    "district": "Chilliwack Natural Resource District"
  },
  {
    "orcs": "3022",
    "district": "Chilliwack Natural Resource District"
  },
  {
    "orcs": "3023",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "3024",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "3025",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "3026",
    "district": "Rocky Mountain Natural Resource District"
  },
  {
    "orcs": "3027",
    "district": "Cascades Natural Resource District"
  },
  {
    "orcs": "3028",
    "district": "Sunshine Coast Natural Resource District"
  },
  {
    "orcs": "3029",
    "district": "Thompson Rivers Natural Resource District"
  },
  {
    "orcs": "3030",
    "district": "Okanagan Shuswap Natural Resource District"
  },
  {
    "orcs": "3031",
    "district": "Selkirk Natural Resource District"
  },
  {
    "orcs": "3032",
    "district": "Selkirk Natural Resource District"
  },
  {
    "orcs": "3033",
    "district": "Okanagan Shuswap Natural Resource District"
  },
  {
    "orcs": "3034",
    "district": "Okanagan Shuswap Natural Resource District"
  },
  {
    "orcs": "3035",
    "district": "Cariboo-Chilcotin Natural Resource District"
  },
  {
    "orcs": "3036",
    "district": "Prince George Natural Resource District"
  },
  {
    "orcs": "3037",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "3038",
    "district": "Stuart Nechako Natural Resource District"
  },
  {
    "orcs": "3039",
    "district": "Prince George Natural Resource District"
  },
  {
    "orcs": "3040",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "3041",
    "district": "Prince George Natural Resource District"
  },
  {
    "orcs": "3042",
    "district": "Okanagan Shuswap Natural Resource District"
  },
  {
    "orcs": "3043",
    "district": "Okanagan Shuswap Natural Resource District"
  },
  {
    "orcs": "3045",
    "district": "Haida Gwaii Natural Resource District"
  },
  {
    "orcs": "3046",
    "district": "Mackenzie Natural Resource District"
  },
  {
    "orcs": "3046",
    "district": "Peace Natural Resource District"
  },
  {
    "orcs": "3047",
    "district": "Fort Nelson Natural Resource District"
  },
  {
    "orcs": "3048",
    "district": "Chilliwack Natural Resource District"
  },
  {
    "orcs": "3049",
    "district": "Okanagan Shuswap Natural Resource District"
  },
  {
    "orcs": "3050",
    "district": "Peace Natural Resource District"
  },
  {
    "orcs": "3051",
    "district": "Okanagan Shuswap Natural Resource District"
  },
  {
    "orcs": "3052",
    "district": "Haida Gwaii Natural Resource District"
  },
  {
    "orcs": "3053",
    "district": "Quesnel Natural Resource District"
  },
  {
    "orcs": "3054",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "3055",
    "district": "Cariboo-Chilcotin Natural Resource District"
  },
  {
    "orcs": "3056",
    "district": "Selkirk Natural Resource District"
  },
  {
    "orcs": "3057",
    "district": "Skeena Stikine Natural Resource District"
  },
  {
    "orcs": "3058",
    "district": "Skeena Stikine Natural Resource District"
  },
  {
    "orcs": "3059",
    "district": "Skeena Stikine Natural Resource District"
  },
  {
    "orcs": "3060",
    "district": "Stuart Nechako Natural Resource District"
  },
  {
    "orcs": "3061",
    "district": "Okanagan Shuswap Natural Resource District"
  },
  {
    "orcs": "3062",
    "district": "Fort Nelson Natural Resource District"
  },
  {
    "orcs": "3063",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "3064",
    "district": "Cariboo-Chilcotin Natural Resource District"
  },
  {
    "orcs": "3064",
    "district": "Quesnel Natural Resource District"
  },
  {
    "orcs": "3065",
    "district": "100 Mile House Natural Resource District"
  },
  {
    "orcs": "3066",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "3067",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "3068",
    "district": "Skeena Stikine Natural Resource District"
  },
  {
    "orcs": "3069",
    "district": "Sea to Sky Natural Resource District"
  },
  {
    "orcs": "3070",
    "district": "Quesnel Natural Resource District"
  },
  {
    "orcs": "3071",
    "district": "Mackenzie Natural Resource District"
  },
  {
    "orcs": "3072",
    "district": "Prince George Natural Resource District"
  },
  {
    "orcs": "3073",
    "district": "Skeena Stikine Natural Resource District"
  },
  {
    "orcs": "3075",
    "district": "Campbell River Natural Resource District"
  },
  {
    "orcs": "3076",
    "district": "Chilliwack Natural Resource District"
  },
  {
    "orcs": "3077",
    "district": "Okanagan Shuswap Natural Resource District"
  },
  {
    "orcs": "3078",
    "district": "Stuart Nechako Natural Resource District"
  },
  {
    "orcs": "3079",
    "district": "Stuart Nechako Natural Resource District"
  },
  {
    "orcs": "3080",
    "district": "Fort Nelson Natural Resource District"
  },
  {
    "orcs": "3081",
    "district": "Nadina Natural Resource District"
  },
  {
    "orcs": "3082",
    "district": "Prince George Natural Resource District"
  },
  {
    "orcs": "3083",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "3084",
    "district": "Prince George Natural Resource District"
  },
  {
    "orcs": "3085",
    "district": "Mackenzie Natural Resource District"
  },
  {
    "orcs": "3086",
    "district": "Stuart Nechako Natural Resource District"
  },
  {
    "orcs": "3087",
    "district": "Mackenzie Natural Resource District"
  },
  {
    "orcs": "3088",
    "district": "Cascades Natural Resource District"
  },
  {
    "orcs": "3089",
    "district": "Chilliwack Natural Resource District"
  },
  {
    "orcs": "3090",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "3091",
    "district": "Mackenzie Natural Resource District"
  },
  {
    "orcs": "3092",
    "district": "Cascades Natural Resource District"
  },
  {
    "orcs": "3093",
    "district": "Haida Gwaii Natural Resource District"
  },
  {
    "orcs": "3094",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "3097",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "3098",
    "district": "Chilliwack Natural Resource District"
  },
  {
    "orcs": "3099",
    "district": "Chilliwack Natural Resource District"
  },
  {
    "orcs": "3100",
    "district": "Okanagan Shuswap Natural Resource District"
  },
  {
    "orcs": "3101",
    "district": "Cariboo-Chilcotin Natural Resource District"
  },
  {
    "orcs": "3102",
    "district": "Skeena Stikine Natural Resource District"
  },
  {
    "orcs": "3103",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "3104",
    "district": "Rocky Mountain Natural Resource District"
  },
  {
    "orcs": "3105",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "3106",
    "district": "Chilliwack Natural Resource District"
  },
  {
    "orcs": "3107",
    "district": "Mackenzie Natural Resource District"
  },
  {
    "orcs": "3108",
    "district": "Okanagan Shuswap Natural Resource District"
  },
  {
    "orcs": "3109",
    "district": "Campbell River Natural Resource District"
  },
  {
    "orcs": "3110",
    "district": "Thompson Rivers Natural Resource District"
  },
  {
    "orcs": "3111",
    "district": "Campbell River Natural Resource District"
  },
  {
    "orcs": "3111",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "3112",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "3113",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "3114",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "3115",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "3116",
    "district": "Chilliwack Natural Resource District"
  },
  {
    "orcs": "3117",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "3118",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "3119",
    "district": "Campbell River Natural Resource District"
  },
  {
    "orcs": "3120",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "3122",
    "district": "Campbell River Natural Resource District"
  },
  {
    "orcs": "3122",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "3123",
    "district": "Campbell River Natural Resource District"
  },
  {
    "orcs": "3124",
    "district": "Campbell River Natural Resource District"
  },
  {
    "orcs": "3125",
    "district": "Campbell River Natural Resource District"
  },
  {
    "orcs": "3125",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "3126",
    "district": "Campbell River Natural Resource District"
  },
  {
    "orcs": "3126",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "3127",
    "district": "Cariboo-Chilcotin Natural Resource District"
  },
  {
    "orcs": "3128",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "3129",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "3130",
    "district": "Okanagan Shuswap Natural Resource District"
  },
  {
    "orcs": "3131",
    "district": "Chilliwack Natural Resource District"
  },
  {
    "orcs": "3132",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "3133",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "3134",
    "district": "Stuart Nechako Natural Resource District"
  },
  {
    "orcs": "3875",
    "district": "Thompson Rivers Natural Resource District"
  },
  {
    "orcs": "3931",
    "district": "Prince George Natural Resource District"
  },
  {
    "orcs": "3932",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "4041",
    "district": "Fort Nelson Natural Resource District"
  },
  {
    "orcs": "4104",
    "district": "Okanagan Shuswap Natural Resource District"
  },
  {
    "orcs": "4214",
    "district": "Prince George Natural Resource District"
  },
  {
    "orcs": "4232",
    "district": "Fort Nelson Natural Resource District"
  },
  {
    "orcs": "4276",
    "district": "Cariboo-Chilcotin Natural Resource District"
  },
  {
    "orcs": "4337",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "4351",
    "district": "Peace Natural Resource District"
  },
  {
    "orcs": "4361",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "4382",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "4433",
    "district": "Thompson Rivers Natural Resource District"
  },
  {
    "orcs": "4448",
    "district": "Skeena Stikine Natural Resource District"
  },
  {
    "orcs": "4455",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "4460",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "4471",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "4981",
    "district": "Peace Natural Resource District"
  },
  {
    "orcs": "4982",
    "district": "Okanagan Shuswap Natural Resource District"
  },
  {
    "orcs": "4983",
    "district": "Prince George Natural Resource District"
  },
  {
    "orcs": "4984",
    "district": "Selkirk Natural Resource District"
  },
  {
    "orcs": "4985",
    "district": "Fort Nelson Natural Resource District"
  },
  {
    "orcs": "4985",
    "district": "Mackenzie Natural Resource District"
  },
  {
    "orcs": "5015",
    "district": "Mackenzie Natural Resource District"
  },
  {
    "orcs": "5018",
    "district": "Mackenzie Natural Resource District"
  },
  {
    "orcs": "5019",
    "district": "Okanagan Shuswap Natural Resource District"
  },
  {
    "orcs": "5020",
    "district": "Stuart Nechako Natural Resource District"
  },
  {
    "orcs": "5022",
    "district": "Fort Nelson Natural Resource District"
  },
  {
    "orcs": "5023",
    "district": "Fort Nelson Natural Resource District"
  },
  {
    "orcs": "5024",
    "district": "Okanagan Shuswap Natural Resource District"
  },
  {
    "orcs": "5025",
    "district": "Chilliwack Natural Resource District"
  },
  {
    "orcs": "5026",
    "district": "Fort Nelson Natural Resource District"
  },
  {
    "orcs": "5027",
    "district": "Mackenzie Natural Resource District"
  },
  {
    "orcs": "5027",
    "district": "Stuart Nechako Natural Resource District"
  },
  {
    "orcs": "5028",
    "district": "Fort Nelson Natural Resource District"
  },
  {
    "orcs": "5029",
    "district": "Prince George Natural Resource District"
  },
  {
    "orcs": "5030",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "5030",
    "district": "Skeena Stikine Natural Resource District"
  },
  {
    "orcs": "5031",
    "district": "Prince George Natural Resource District"
  },
  {
    "orcs": "5032",
    "district": "Stuart Nechako Natural Resource District"
  },
  {
    "orcs": "5033",
    "district": "Nadina Natural Resource District"
  },
  {
    "orcs": "5033",
    "district": "Stuart Nechako Natural Resource District"
  },
  {
    "orcs": "5034",
    "district": "Fort Nelson Natural Resource District"
  },
  {
    "orcs": "5035",
    "district": "Fort Nelson Natural Resource District"
  },
  {
    "orcs": "5036",
    "district": "Nadina Natural Resource District"
  },
  {
    "orcs": "5037",
    "district": "Prince George Natural Resource District"
  },
  {
    "orcs": "5038",
    "district": "Skeena Stikine Natural Resource District"
  },
  {
    "orcs": "5039",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "5040",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "5041",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "5042",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "5043",
    "district": "Prince George Natural Resource District"
  },
  {
    "orcs": "5044",
    "district": "Prince George Natural Resource District"
  },
  {
    "orcs": "6081",
    "district": "Campbell River Natural Resource District"
  },
  {
    "orcs": "6093",
    "district": "Campbell River Natural Resource District"
  },
  {
    "orcs": "6111",
    "district": "Campbell River Natural Resource District"
  },
  {
    "orcs": "6161",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "6197",
    "district": "Sunshine Coast Natural Resource District"
  },
  {
    "orcs": "6268",
    "district": "Sunshine Coast Natural Resource District"
  },
  {
    "orcs": "6301",
    "district": "Sunshine Coast Natural Resource District"
  },
  {
    "orcs": "6328",
    "district": "Sea to Sky Natural Resource District"
  },
  {
    "orcs": "6547",
    "district": "Okanagan Shuswap Natural Resource District"
  },
  {
    "orcs": "6610",
    "district": "Okanagan Shuswap Natural Resource District"
  },
  {
    "orcs": "6624",
    "district": "Okanagan Shuswap Natural Resource District"
  },
  {
    "orcs": "6648",
    "district": "Thompson Rivers Natural Resource District"
  },
  {
    "orcs": "6818",
    "district": "Thompson Rivers Natural Resource District"
  },
  {
    "orcs": "6860",
    "district": "Thompson Rivers Natural Resource District"
  },
  {
    "orcs": "6865",
    "district": "Thompson Rivers Natural Resource District"
  },
  {
    "orcs": "6878",
    "district": "Thompson Rivers Natural Resource District"
  },
  {
    "orcs": "6892",
    "district": "Thompson Rivers Natural Resource District"
  },
  {
    "orcs": "6900",
    "district": "Thompson Rivers Natural Resource District"
  },
  {
    "orcs": "6987",
    "district": "Thompson Rivers Natural Resource District"
  },
  {
    "orcs": "6998",
    "district": "Chilliwack Natural Resource District"
  },
  {
    "orcs": "7211",
    "district": "Rocky Mountain Natural Resource District"
  },
  {
    "orcs": "7458",
    "district": "Quesnel Natural Resource District"
  },
  {
    "orcs": "7458",
    "district": "Stuart Nechako Natural Resource District"
  },
  {
    "orcs": "7668",
    "district": "Cariboo-Chilcotin Natural Resource District"
  },
  {
    "orcs": "8053",
    "district": "Prince George Natural Resource District"
  },
  {
    "orcs": "8094",
    "district": "Peace Natural Resource District"
  },
  {
    "orcs": "8097",
    "district": "Peace Natural Resource District"
  },
  {
    "orcs": "8109",
    "district": "Peace Natural Resource District"
  },
  {
    "orcs": "8109",
    "district": "Prince George Natural Resource District"
  },
  {
    "orcs": "8123",
    "district": "Peace Natural Resource District"
  },
  {
    "orcs": "8277",
    "district": "Fort Nelson Natural Resource District"
  },
  {
    "orcs": "8284",
    "district": "Fort Nelson Natural Resource District"
  },
  {
    "orcs": "8288",
    "district": "Fort Nelson Natural Resource District"
  },
  {
    "orcs": "8291",
    "district": "Mackenzie Natural Resource District"
  },
  {
    "orcs": "8297",
    "district": "Fort Nelson Natural Resource District"
  },
  {
    "orcs": "8297",
    "district": "Mackenzie Natural Resource District"
  },
  {
    "orcs": "8297",
    "district": "Skeena Stikine Natural Resource District"
  },
  {
    "orcs": "8299",
    "district": "Fort Nelson Natural Resource District"
  },
  {
    "orcs": "8299",
    "district": "Mackenzie Natural Resource District"
  },
  {
    "orcs": "8299",
    "district": "Peace Natural Resource District"
  },
  {
    "orcs": "8306",
    "district": "Peace Natural Resource District"
  },
  {
    "orcs": "8312",
    "district": "Fort Nelson Natural Resource District"
  },
  {
    "orcs": "8325",
    "district": "Fort Nelson Natural Resource District"
  },
  {
    "orcs": "8330",
    "district": "Fort Nelson Natural Resource District"
  },
  {
    "orcs": "8345",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "8350",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "8379",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "8509",
    "district": "Skeena Stikine Natural Resource District"
  },
  {
    "orcs": "8555",
    "district": "Nadina Natural Resource District"
  },
  {
    "orcs": "8642",
    "district": "Skeena Stikine Natural Resource District"
  },
  {
    "orcs": "8645",
    "district": "Mackenzie Natural Resource District"
  },
  {
    "orcs": "8645",
    "district": "Skeena Stikine Natural Resource District"
  },
  {
    "orcs": "8697",
    "district": "Okanagan Shuswap Natural Resource District"
  },
  {
    "orcs": "8741",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "8741",
    "district": "Skeena Stikine Natural Resource District"
  },
  {
    "orcs": "8774",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "8778",
    "district": "Campbell River Natural Resource District"
  },
  {
    "orcs": "8779",
    "district": "Campbell River Natural Resource District"
  },
  {
    "orcs": "8782",
    "district": "Campbell River Natural Resource District"
  },
  {
    "orcs": "8796",
    "district": "Prince George Natural Resource District"
  },
  {
    "orcs": "8796",
    "district": "Stuart Nechako Natural Resource District"
  },
  {
    "orcs": "8814",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "8966",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "8969",
    "district": "Fort Nelson Natural Resource District"
  },
  {
    "orcs": "9034",
    "district": "Prince George Natural Resource District"
  },
  {
    "orcs": "9066",
    "district": "Cariboo-Chilcotin Natural Resource District"
  },
  {
    "orcs": "9066",
    "district": "Cascades Natural Resource District"
  },
  {
    "orcs": "9077",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "9077",
    "district": "Skeena Stikine Natural Resource District"
  },
  {
    "orcs": "9118",
    "district": "Stuart Nechako Natural Resource District"
  },
  {
    "orcs": "9123",
    "district": "Skeena Stikine Natural Resource District"
  },
  {
    "orcs": "9147",
    "district": "Campbell River Natural Resource District"
  },
  {
    "orcs": "9185",
    "district": "Rocky Mountain Natural Resource District"
  },
  {
    "orcs": "9209",
    "district": "Campbell River Natural Resource District"
  },
  {
    "orcs": "9209",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "9213",
    "district": "Okanagan Shuswap Natural Resource District"
  },
  {
    "orcs": "9218",
    "district": "Thompson Rivers Natural Resource District"
  },
  {
    "orcs": "9229",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "9335",
    "district": "Okanagan Shuswap Natural Resource District"
  },
  {
    "orcs": "9383",
    "district": "Okanagan Shuswap Natural Resource District"
  },
  {
    "orcs": "9398",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "9435",
    "district": "Rocky Mountain Natural Resource District"
  },
  {
    "orcs": "9435",
    "district": "Selkirk Natural Resource District"
  },
  {
    "orcs": "9451",
    "district": "Sea to Sky Natural Resource District"
  },
  {
    "orcs": "9453",
    "district": "Prince George Natural Resource District"
  },
  {
    "orcs": "9456",
    "district": "Cariboo-Chilcotin Natural Resource District"
  },
  {
    "orcs": "9456",
    "district": "Quesnel Natural Resource District"
  },
  {
    "orcs": "9457",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "9457",
    "district": "Nadina Natural Resource District"
  },
  {
    "orcs": "9457",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "9458",
    "district": "Cascades Natural Resource District"
  },
  {
    "orcs": "9458",
    "district": "Chilliwack Natural Resource District"
  },
  {
    "orcs": "9458",
    "district": "Sea to Sky Natural Resource District"
  },
  {
    "orcs": "9459",
    "district": "Campbell River Natural Resource District"
  },
  {
    "orcs": "9459",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "9460",
    "district": "Sunshine Coast Natural Resource District"
  },
  {
    "orcs": "9461",
    "district": "Prince George Natural Resource District"
  },
  {
    "orcs": "9464",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "9465",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "9466",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "9469",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "9471",
    "district": "Campbell River Natural Resource District"
  },
  {
    "orcs": "9471",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "9474",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "9476",
    "district": "Campbell River Natural Resource District"
  },
  {
    "orcs": "9480",
    "district": "100 Mile House Natural Resource District"
  },
  {
    "orcs": "9481",
    "district": "Cariboo-Chilcotin Natural Resource District"
  },
  {
    "orcs": "9481",
    "district": "Sunshine Coast Natural Resource District"
  },
  {
    "orcs": "9482",
    "district": "Cariboo-Chilcotin Natural Resource District"
  },
  {
    "orcs": "9483",
    "district": "100 Mile House Natural Resource District"
  },
  {
    "orcs": "9485",
    "district": "100 Mile House Natural Resource District"
  },
  {
    "orcs": "9489",
    "district": "Cariboo-Chilcotin Natural Resource District"
  },
  {
    "orcs": "9493",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "9494",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "9495",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "9497",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "9498",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "9499",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "9500",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "9501",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "9502",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "9503",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "9504",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "9506",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "9507",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "9508",
    "district": "Chilliwack Natural Resource District"
  },
  {
    "orcs": "9508",
    "district": "Sea to Sky Natural Resource District"
  },
  {
    "orcs": "9509",
    "district": "Chilliwack Natural Resource District"
  },
  {
    "orcs": "9509",
    "district": "Sea to Sky Natural Resource District"
  },
  {
    "orcs": "9510",
    "district": "Mackenzie Natural Resource District"
  },
  {
    "orcs": "9510",
    "district": "Peace Natural Resource District"
  },
  {
    "orcs": "9512",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "9518",
    "district": "Okanagan Shuswap Natural Resource District"
  },
  {
    "orcs": "9518",
    "district": "Selkirk Natural Resource District"
  },
  {
    "orcs": "9522",
    "district": "Skeena Stikine Natural Resource District"
  },
  {
    "orcs": "9532",
    "district": "Campbell River Natural Resource District"
  },
  {
    "orcs": "9532",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "9540",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "9544",
    "district": "Sunshine Coast Natural Resource District"
  },
  {
    "orcs": "9548",
    "district": "Okanagan Shuswap Natural Resource District"
  },
  {
    "orcs": "9548",
    "district": "Selkirk Natural Resource District"
  },
  {
    "orcs": "9549",
    "district": "Selkirk Natural Resource District"
  },
  {
    "orcs": "9550",
    "district": "Rocky Mountain Natural Resource District"
  },
  {
    "orcs": "9550",
    "district": "Selkirk Natural Resource District"
  },
  {
    "orcs": "9551",
    "district": "Rocky Mountain Natural Resource District"
  },
  {
    "orcs": "9551",
    "district": "Selkirk Natural Resource District"
  },
  {
    "orcs": "9552",
    "district": "Selkirk Natural Resource District"
  },
  {
    "orcs": "9553",
    "district": "Selkirk Natural Resource District"
  },
  {
    "orcs": "9554",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "9556",
    "district": "Sea to Sky Natural Resource District"
  },
  {
    "orcs": "9557",
    "district": "100 Mile House Natural Resource District"
  },
  {
    "orcs": "9557",
    "district": "Cascades Natural Resource District"
  },
  {
    "orcs": "9563",
    "district": "Cariboo-Chilcotin Natural Resource District"
  },
  {
    "orcs": "9563",
    "district": "Cascades Natural Resource District"
  },
  {
    "orcs": "9565",
    "district": "Cariboo-Chilcotin Natural Resource District"
  },
  {
    "orcs": "9565",
    "district": "Sunshine Coast Natural Resource District"
  },
  {
    "orcs": "9567",
    "district": "100 Mile House Natural Resource District"
  },
  {
    "orcs": "9567",
    "district": "Thompson Rivers Natural Resource District"
  },
  {
    "orcs": "9571",
    "district": "Skeena Stikine Natural Resource District"
  },
  {
    "orcs": "9582",
    "district": "Okanagan Shuswap Natural Resource District"
  },
  {
    "orcs": "9584",
    "district": "Skeena Stikine Natural Resource District"
  },
  {
    "orcs": "9587",
    "district": "Cascades Natural Resource District"
  },
  {
    "orcs": "9587",
    "district": "Okanagan Shuswap Natural Resource District"
  },
  {
    "orcs": "9590",
    "district": "Cariboo-Chilcotin Natural Resource District"
  },
  {
    "orcs": "9590",
    "district": "Cascades Natural Resource District"
  },
  {
    "orcs": "9596",
    "district": "Thompson Rivers Natural Resource District"
  },
  {
    "orcs": "9597",
    "district": "Mackenzie Natural Resource District"
  },
  {
    "orcs": "9601",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "9604",
    "district": "Coast Mountains Natural Resource District"
  },
  {
    "orcs": "9604",
    "district": "Stuart Nechako Natural Resource District"
  },
  {
    "orcs": "9622",
    "district": "Cariboo-Chilcotin Natural Resource District"
  },
  {
    "orcs": "9622",
    "district": "Prince George Natural Resource District"
  },
  {
    "orcs": "9622",
    "district": "Quesnel Natural Resource District"
  },
  {
    "orcs": "9622",
    "district": "Thompson Rivers Natural Resource District"
  },
  {
    "orcs": "9633",
    "district": "Peace Natural Resource District"
  },
  {
    "orcs": "9658",
    "district": "Stuart Nechako Natural Resource District"
  },
  {
    "orcs": "9679",
    "district": "Cariboo-Chilcotin Natural Resource District"
  },
  {
    "orcs": "9679",
    "district": "Quesnel Natural Resource District"
  },
  {
    "orcs": "9680",
    "district": "Rocky Mountain Natural Resource District"
  },
  {
    "orcs": "9681",
    "district": "Selkirk Natural Resource District"
  },
  {
    "orcs": "9682",
    "district": "100 Mile House Natural Resource District"
  },
  {
    "orcs": "9687",
    "district": "Thompson Rivers Natural Resource District"
  },
  {
    "orcs": "9688",
    "district": "Thompson Rivers Natural Resource District"
  },
  {
    "orcs": "9689",
    "district": "Thompson Rivers Natural Resource District"
  },
  {
    "orcs": "9690",
    "district": "Thompson Rivers Natural Resource District"
  },
  {
    "orcs": "9691",
    "district": "100 Mile House Natural Resource District"
  },
  {
    "orcs": "9691",
    "district": "Thompson Rivers Natural Resource District"
  },
  {
    "orcs": "9693",
    "district": "Thompson Rivers Natural Resource District"
  },
  {
    "orcs": "9694",
    "district": "Thompson Rivers Natural Resource District"
  },
  {
    "orcs": "9695",
    "district": "Thompson Rivers Natural Resource District"
  },
  {
    "orcs": "9696",
    "district": "Thompson Rivers Natural Resource District"
  },
  {
    "orcs": "9698",
    "district": "Thompson Rivers Natural Resource District"
  },
  {
    "orcs": "9711",
    "district": "Okanagan Shuswap Natural Resource District"
  },
  {
    "orcs": "9712",
    "district": "Thompson Rivers Natural Resource District"
  },
  {
    "orcs": "9713",
    "district": "Thompson Rivers Natural Resource District"
  },
  {
    "orcs": "9714",
    "district": "Thompson Rivers Natural Resource District"
  },
  {
    "orcs": "9715",
    "district": "Thompson Rivers Natural Resource District"
  },
  {
    "orcs": "9716",
    "district": "Thompson Rivers Natural Resource District"
  },
  {
    "orcs": "9717",
    "district": "Thompson Rivers Natural Resource District"
  },
  {
    "orcs": "9719",
    "district": "Thompson Rivers Natural Resource District"
  },
  {
    "orcs": "9720",
    "district": "Thompson Rivers Natural Resource District"
  },
  {
    "orcs": "9721",
    "district": "Thompson Rivers Natural Resource District"
  },
  {
    "orcs": "9722",
    "district": "Thompson Rivers Natural Resource District"
  },
  {
    "orcs": "9723",
    "district": "Thompson Rivers Natural Resource District"
  },
  {
    "orcs": "9726",
    "district": "Thompson Rivers Natural Resource District"
  },
  {
    "orcs": "9727",
    "district": "Thompson Rivers Natural Resource District"
  },
  {
    "orcs": "9728",
    "district": "Thompson Rivers Natural Resource District"
  },
  {
    "orcs": "9729",
    "district": "Thompson Rivers Natural Resource District"
  },
  {
    "orcs": "9730",
    "district": "Thompson Rivers Natural Resource District"
  },
  {
    "orcs": "9731",
    "district": "Thompson Rivers Natural Resource District"
  },
  {
    "orcs": "9732",
    "district": "Thompson Rivers Natural Resource District"
  },
  {
    "orcs": "9733",
    "district": "Thompson Rivers Natural Resource District"
  },
  {
    "orcs": "9734",
    "district": "Thompson Rivers Natural Resource District"
  },
  {
    "orcs": "9735",
    "district": "Thompson Rivers Natural Resource District"
  },
  {
    "orcs": "9736",
    "district": "Thompson Rivers Natural Resource District"
  },
  {
    "orcs": "9738",
    "district": "Thompson Rivers Natural Resource District"
  },
  {
    "orcs": "9739",
    "district": "Thompson Rivers Natural Resource District"
  },
  {
    "orcs": "9740",
    "district": "Thompson Rivers Natural Resource District"
  },
  {
    "orcs": "9743",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "9744",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "9745",
    "district": "Campbell River Natural Resource District"
  },
  {
    "orcs": "9746",
    "district": "Campbell River Natural Resource District"
  },
  {
    "orcs": "9747",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "9748",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "9749",
    "district": "Campbell River Natural Resource District"
  },
  {
    "orcs": "9750",
    "district": "Sunshine Coast Natural Resource District"
  },
  {
    "orcs": "9751",
    "district": "Campbell River Natural Resource District"
  },
  {
    "orcs": "9751",
    "district": "Sunshine Coast Natural Resource District"
  },
  {
    "orcs": "9752",
    "district": "Campbell River Natural Resource District"
  },
  {
    "orcs": "9753",
    "district": "Campbell River Natural Resource District"
  },
  {
    "orcs": "9754",
    "district": "Campbell River Natural Resource District"
  },
  {
    "orcs": "9755",
    "district": "Thompson Rivers Natural Resource District"
  },
  {
    "orcs": "9761",
    "district": "Sunshine Coast Natural Resource District"
  },
  {
    "orcs": "9762",
    "district": "Sunshine Coast Natural Resource District"
  },
  {
    "orcs": "9763",
    "district": "Sunshine Coast Natural Resource District"
  },
  {
    "orcs": "9764",
    "district": "Sea to Sky Natural Resource District"
  },
  {
    "orcs": "9764",
    "district": "Sunshine Coast Natural Resource District"
  },
  {
    "orcs": "9765",
    "district": "Sunshine Coast Natural Resource District"
  },
  {
    "orcs": "9767",
    "district": "Sunshine Coast Natural Resource District"
  },
  {
    "orcs": "9768",
    "district": "Sea to Sky Natural Resource District"
  },
  {
    "orcs": "9768",
    "district": "Sunshine Coast Natural Resource District"
  },
  {
    "orcs": "9769",
    "district": "Chilliwack Natural Resource District"
  },
  {
    "orcs": "9773",
    "district": "Rocky Mountain Natural Resource District"
  },
  {
    "orcs": "9777",
    "district": "Nadina Natural Resource District"
  },
  {
    "orcs": "9777",
    "district": "Stuart Nechako Natural Resource District"
  },
  {
    "orcs": "9778",
    "district": "Nadina Natural Resource District"
  },
  {
    "orcs": "9778",
    "district": "Stuart Nechako Natural Resource District"
  },
  {
    "orcs": "9779",
    "district": "Stuart Nechako Natural Resource District"
  },
  {
    "orcs": "9780",
    "district": "Quesnel Natural Resource District"
  },
  {
    "orcs": "9780",
    "district": "Stuart Nechako Natural Resource District"
  },
  {
    "orcs": "9781",
    "district": "Nadina Natural Resource District"
  },
  {
    "orcs": "9781",
    "district": "North Island - Central Coast Natural Resource District"
  },
  {
    "orcs": "9781",
    "district": "Stuart Nechako Natural Resource District"
  },
  {
    "orcs": "9782",
    "district": "Skeena Stikine Natural Resource District"
  },
  {
    "orcs": "9783",
    "district": "Peace Natural Resource District"
  },
  {
    "orcs": "9785",
    "district": "Mackenzie Natural Resource District"
  },
  {
    "orcs": "9785",
    "district": "Peace Natural Resource District"
  },
  {
    "orcs": "9786",
    "district": "Peace Natural Resource District"
  },
  {
    "orcs": "9790",
    "district": "Peace Natural Resource District"
  },
  {
    "orcs": "9792",
    "district": "Prince George Natural Resource District"
  },
  {
    "orcs": "9793",
    "district": "Nadina Natural Resource District"
  },
  {
    "orcs": "9793",
    "district": "Stuart Nechako Natural Resource District"
  },
  {
    "orcs": "9794",
    "district": "Prince George Natural Resource District"
  },
  {
    "orcs": "9795",
    "district": "Prince George Natural Resource District"
  },
  {
    "orcs": "9796",
    "district": "Prince George Natural Resource District"
  },
  {
    "orcs": "9797",
    "district": "Mackenzie Natural Resource District"
  },
  {
    "orcs": "9797",
    "district": "Peace Natural Resource District"
  },
  {
    "orcs": "9799",
    "district": "Fort Nelson Natural Resource District"
  },
  {
    "orcs": "9800",
    "district": "Peace Natural Resource District"
  },
  {
    "orcs": "9801",
    "district": "Prince George Natural Resource District"
  },
  {
    "orcs": "9802",
    "district": "Prince George Natural Resource District"
  },
  {
    "orcs": "9803",
    "district": "Fort Nelson Natural Resource District"
  },
  {
    "orcs": "9805",
    "district": "Prince George Natural Resource District"
  },
  {
    "orcs": "9806",
    "district": "Peace Natural Resource District"
  },
  {
    "orcs": "9808",
    "district": "Stuart Nechako Natural Resource District"
  },
  {
    "orcs": "9809",
    "district": "Stuart Nechako Natural Resource District"
  },
  {
    "orcs": "9810",
    "district": "Stuart Nechako Natural Resource District"
  },
  {
    "orcs": "9812",
    "district": "Mackenzie Natural Resource District"
  },
  {
    "orcs": "9812",
    "district": "Stuart Nechako Natural Resource District"
  },
  {
    "orcs": "9813",
    "district": "Peace Natural Resource District"
  },
  {
    "orcs": "9815",
    "district": "Prince George Natural Resource District"
  },
  {
    "orcs": "9819",
    "district": "Fort Nelson Natural Resource District"
  },
  {
    "orcs": "9820",
    "district": "Fort Nelson Natural Resource District"
  },
  {
    "orcs": "9821",
    "district": "Prince George Natural Resource District"
  },
  {
    "orcs": "9822",
    "district": "Stuart Nechako Natural Resource District"
  },
  {
    "orcs": "9824",
    "district": "Cascades Natural Resource District"
  },
  {
    "orcs": "9824",
    "district": "Chilliwack Natural Resource District"
  },
  {
    "orcs": "9824",
    "district": "Sea to Sky Natural Resource District"
  },
  {
    "orcs": "9825",
    "district": "Sunshine Coast Natural Resource District"
  },
  {
    "orcs": "9828",
    "district": "Fort Nelson Natural Resource District"
  },
  {
    "orcs": "9829",
    "district": "Fort Nelson Natural Resource District"
  },
  {
    "orcs": "9830",
    "district": "Fort Nelson Natural Resource District"
  },
  {
    "orcs": "9841",
    "district": "Chilliwack Natural Resource District"
  },
  {
    "orcs": "9842",
    "district": "Peace Natural Resource District"
  },
  {
    "orcs": "9843",
    "district": "Peace Natural Resource District"
  },
  {
    "orcs": "9846",
    "district": "Skeena Stikine Natural Resource District"
  },
  {
    "orcs": "9847",
    "district": "Skeena Stikine Natural Resource District"
  },
  {
    "orcs": "9848",
    "district": "Skeena Stikine Natural Resource District"
  },
  {
    "orcs": "9849",
    "district": "Skeena Stikine Natural Resource District"
  },
  {
    "orcs": "9851",
    "district": "Skeena Stikine Natural Resource District"
  },
  {
    "orcs": "9855",
    "district": "Prince George Natural Resource District"
  },
  {
    "orcs": "9864",
    "district": "Mackenzie Natural Resource District"
  },
  {
    "orcs": "9866",
    "district": "Nadina Natural Resource District"
  },
  {
    "orcs": "9866",
    "district": "Stuart Nechako Natural Resource District"
  },
  {
    "orcs": "9867",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "9868",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "9869",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "9870",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "9953",
    "district": "Prince George Natural Resource District"
  },
  {
    "orcs": "9955",
    "district": "Peace Natural Resource District"
  },
  {
    "orcs": "9956",
    "district": "Peace Natural Resource District"
  },
  {
    "orcs": "9957",
    "district": "Skeena Stikine Natural Resource District"
  },
  {
    "orcs": "9959",
    "district": "South Island Natural Resource District"
  },
  {
    "orcs": "9960",
    "district": "Selkirk Natural Resource District"
  }
];

async function up(knex) {

  // insert districts
  if (await knex.schema.hasTable('natural_resource_districts')) {

    // get a mapping of district names to strapi id's
    const nrDistricts = await strapi.db.query("api::natural-resource-district.natural-resource-district").findMany(
      {
        select: ["id", "naturalResourceDistrictName"],
        limit: 2000,
      }
    );
    let districtMap = {};
    for (const d of nrDistricts) {
      districtMap[d.naturalResourceDistrictName] = d.id;
    }

    // get a mapping of orcs to strapi id's
    const protectedAreas = await strapi.db.query("api::protected-area.protected-area").findMany(
      {
        select: ["id", "orcs"],
        limit: 2000,
      }
    );
    let parkMap = {};
    for (const area of protectedAreas) {
      parkMap[area.orcs] = area.id;
    }

    let i, j, rowsToInsert, chunk = 200;

    // insert rows in 200 row batches
    await knex.transaction(async trx => {
      for (i = 0, j = rows.length; i < j; i += chunk) {
        rowsToInsert = rows.slice(i, i + chunk);
        const arr = [];
        for (const d of rowsToInsert) {
          arr.push({ natural_resource_district_id: districtMap[d.district], protected_area_id: parkMap[d.orcs] })
        }
        await trx('natural_resource_districts_protected_areas_links').insert(arr);
      }
    });
  }
}

module.exports = { up };