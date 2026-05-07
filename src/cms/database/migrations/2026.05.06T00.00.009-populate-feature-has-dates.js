"use strict";

const data = [
  {
    orcsFeatureNumber: "361-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "338-1",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "330-1",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "90-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "90-2",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "90-3",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "90-4",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "90-5",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "90-6",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "119-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "119-2",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "386-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "49-1",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "308-1",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "400-1",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "400-2",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "400-3",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "400-4",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "400-5",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "400-6",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "117-1",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "117-2",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "307-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "14-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "14-2",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "115-1",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "169-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "213-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "213-2",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "8779-1",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "152-2",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "152-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "323-2",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "323-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "6900-1",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "56-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "129-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "129-3",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "57-1",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "57-2",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "58-3",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "214-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "206-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "206-2",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "206-3",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "398-1",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "9451-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "250-1",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "383-1",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "251-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "251-2",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "251-3",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "251-4",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "251-5",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "251-6",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "251-7",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "199-8",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "199-3",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "199-6",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "199-7",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "199-4",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "199-5",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "135-2",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "51-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "161-2",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "161-3",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "161-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "225-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "85-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "85-2",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "244-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "244-2",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "228-1",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "228-2",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "6161-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "6161-2",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "6161-3",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "177-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "41-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "41-2",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "41-3",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "41-4",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "41-5",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "41-7",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "41-8",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "41-9",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "41-10",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "41-11",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "41-12",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "41-13",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "41-6",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "8297-1",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "252-1",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "252-2",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "252-3",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "252-4",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "252-5",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "252-6",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "252-7",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "299-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "384-1",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "237-1",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "217-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "217-2",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "61-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "559-1",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "33-19",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "33-3",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "33-4",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "33-6",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "33-7",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "33-8",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "33-9",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "33-10",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "33-13",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "33-14",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "33-16",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "33-2",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "33-18",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "33-11",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "28-2",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "28-3",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "28-4",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "253-1",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "253-2",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "139-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "139-5",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "81-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "29-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "62-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "5039-1",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "48-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "9213-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "9213-4",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "9213-9",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "9497-1",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "262-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "262-2",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "7-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "7-2",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "7-3",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "7-5",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "7-6",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "7-7",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "7-8",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "7-9",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "7-11",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "7-12",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "7-13",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "7-15",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "196-1",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "9549-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "9549-2",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "8-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "8-2",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "8-3",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "8-4",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "8-5",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "8-6",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "8-7",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "8-8",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "63-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "96-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "96-2",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "96-4",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "210-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "210-2",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "273-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "273-2",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "273-7",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "273-8",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "273-9",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "273-10",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "273-4",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "222-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "365-1",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "276-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "276-4",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "276-5",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "276-2",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "276-3",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "268-2",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "268-3",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "268-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "64-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "6197-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "6197-2",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "9512-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "319-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "65-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "363-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "66-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "9398-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "9398-2",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "369-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "277-1",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "378-3",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "378-5",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "378-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "306-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "306-2",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "236-2",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "236-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "236-4",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "218-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "218-2",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "218-3",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "235-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "235-2",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "235-3",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "235-5",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "235-4",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "245-1",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "356-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "188-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "140-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "36-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "36-3",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "36-2",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "67-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "52-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "52-2",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "52-5",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "52-6",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "52-7",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "52-8",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "52-9",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "4-1",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "4-2",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "4-3",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "4-4",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "357-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "357-2",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "357-3",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "357-4",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "68-2",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "68-3",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "68-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "69-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "70-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "70-2",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "70-3",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "92-3",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "92-2",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "30-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "30-2",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "12-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "189-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "189-2",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "241-2",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "241-3",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "241-4",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "241-5",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "241-6",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "241-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "6093-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "6268-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "6268-2",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "264-2",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "264-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "20-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "20-2",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "183-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "404-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "404-5",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "324-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "358-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "45-5",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "45-4",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "45-7",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "45-10",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "45-8",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "45-9",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "181-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "181-2",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "9693-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "143-1",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "46-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "315-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "104-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "104-2",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "190-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "5-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "5-2",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "5-3",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "5-4",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "5-5",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "5-7",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "5-8",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "5-9",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "105-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "2-3",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "2-5",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "2-11",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "2-12",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "2-13",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "2-14",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "2-16",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "2-15",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "15-1",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "15-2",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "108-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "93-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "93-2",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "141-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "339-1",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "255-1",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "255-2",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "255-3",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "179-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "232-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "275-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "98-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "195-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "54-2",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "54-7",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "54-8",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "259-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "294-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "9812-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "289-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "146-2",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "234-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "127-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "127-2",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "23-1",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "163-1",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "9508-1",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "9508-2",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "198-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "116-2",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "116-3",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "116-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "116-4",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "221-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "221-2",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "221-3",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "221-4",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "221-5",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "221-6",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "314-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "314-4",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "314-6",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "25-2",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "25-1",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "25-3",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "25-4",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "162-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "229-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "377-1",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "193-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "193-2",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "193-3",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "193-4",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "193-5",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "193-6",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "288-1",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "40-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "40-2",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "6892-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "6892-2",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "6892-3",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "122-1",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "122-2",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "373-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "110-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "267-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "267-2",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "267-3",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "145-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "200-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "200-6",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "200-7",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "200-9",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "200-2",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "200-5",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "200-8",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "200-3",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "9509-1",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "9509-2",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "9509-3",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "133-1",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "133-2",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "283-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "74-1",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "331-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "89-2",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "89-3",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "89-6",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "89-4",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "212-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "158-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "27-1",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "27-2",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "261-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "261-2",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "261-5",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "261-3",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "261-4",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "75-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "75-2",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "243-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "370-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "182-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "182-2",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "31-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "6328-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "6328-2",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "408-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "76-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "94-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "1-4",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "1-5",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "1-6",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "1-7",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "1-8",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "1-12",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "1-13",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "1-14",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "1-3",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "9815-1",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "9815-2",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "9815-3",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "156-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "156-2",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "204-1",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "16-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "16-2",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "16-3",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "142-2",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "258-1",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "258-2",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "258-3",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "258-4",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "258-5",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "258-6",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "73-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "202-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "202-2",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "202-4",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "202-7",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "202-5",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "202-3",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "202-6",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "178-1",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "296-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "136-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "136-3",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "136-4",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "136-2",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "247-1",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "247-2",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "8697-1",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "292-2",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "292-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "409-1",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "409-3",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "409-4",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "409-2",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "317-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "6878-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "6878-3",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "6878-4",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "19-1",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "19-2",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "19-3",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "84-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "84-3",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "84-2",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "77-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "382-1",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "53-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "24-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "24-2",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "24-3",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "24-4",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "24-5",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "24-7",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "24-8",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "24-9",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "24-10",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "24-11",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "24-6",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "305-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "78-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "167-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "287-1",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "287-2",
    hasDates: false,
  },
  {
    orcsFeatureNumber: "287-3",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "287-4",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "287-5",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "287-6",
    hasDates: true,
  },
  {
    orcsFeatureNumber: "79-1",
    hasDates: true,
  },
];

const trueList = data
  .filter((item) => item.hasDates)
  .map((item) => `'${item.orcsFeatureNumber}'`)
  .join(", ");

const falseList = data
  .filter((item) => !item.hasDates)
  .map((item) => `'${item.orcsFeatureNumber}'`)
  .join(", ");

module.exports = {
  async up(knex) {
    if (
      (await knex.schema.hasTable("park_features")) &&
      (await knex.schema.hasColumn("park_features", "has_dates"))
    ) {
      await knex.raw(
        `UPDATE park_features SET has_dates = true WHERE orcs_feature_number IN (${trueList})`,
      );
      await knex.raw(
        `UPDATE park_features SET has_dates = false WHERE orcs_feature_number IN (${falseList})`,
      );
    }
  },
};
