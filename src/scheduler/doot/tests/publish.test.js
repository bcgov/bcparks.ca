const assert = require("node:assert/strict");

/**
 * Runs one DOOT publish message against mocked scheduler dependencies.
 *
 * @param {object} item DOOT message item
 * @param {object|null} initialGate Existing park-gate record, or null if none exists
 * @param {object[]} dates Existing Strapi date records
 * @returns {Promise<object>} Resulting gate, dates, requests, errors, and removed queue IDs
 */
async function publishItem(item, initialGate, dates = []) {
  let gate = initialGate && { ...initialGate };
  let remainingDates = [...dates];
  const requests = [];
  const errors = [];
  const removedQueueIds = [];
  let queueReads = 0;
  jest.resetModules();
  const modules = {
    "../../shared/logging": {
      getLogger: () => ({
        info: () => {},
        error: (error) => errors.push(error),
      }),
    },
    "../../shared/taskQueue": {
      readQueue: async () =>
        queueReads++ === 0 ? [{ documentId: "task-1", jsonData: [item] }] : [],
      removeFromQueue: async (ids) => removedQueueIds.push(...ids),
    },
    "../../shared/axiosConfig": {
      cmsAxios: {
        get: async (url) => {
          assert.equal(url, "/api/park-dates");
          return { data: { data: remainingDates } };
        },
        put: async (url, body) => {
          requests.push({ method: "put", url, data: body.data });
          assert.equal(url, "/api/park-gates/gate-1");
          gate = { ...gate, ...body.data };
        },
        post: async (url, body) => {
          requests.push({ method: "post", url, data: body.data });
          assert.equal(url, "/api/park-gates");
          gate = { ...body.data };
        },
        delete: async (url) => {
          requests.push({ method: "delete", url });
          remainingDates = remainingDates.filter(
            (date) => `/api/park-dates/${date.documentId}` !== url,
          );
        },
      },
    },
    "../utils/helper": {
      getEntityDocIds: async () => ({
        protectedAreaDocId: "park-1",
        relationName: "park:1",
      }),
      getParkGateDocIds: async () => (gate ? ["gate-1"] : []),
      getDateTypeMap: async () => new Map([[1, "date-type-1"]]),
    },
    "../scripts/splitMessage": { dootSplitMessage: async () => assert.fail() },
  };

  for (const [name, exports] of Object.entries(modules)) {
    jest.doMock(name, () => exports);
  }

  const { dootPublish } = require("../scripts/publish");
  await dootPublish();
  return { gate, remainingDates, requests, errors, removedQueueIds };
}

test("publishing blank gate dates and times preserves the existing note", async () => {
  const result = await publishItem(
    {
      orcs: 1,
      operatingYear: 2027,
      seasonType: "regular",
      gateInfo: {
        hasGate: true,
        gateOpenTime: null,
        gateCloseTime: null,
        gateOpensAtDawn: false,
        gateClosesAtDusk: false,
        gateOpen24Hours: false,
        gateNote: "",
      },
      dateRanges: [
        {
          id: 123,
          dateTypeNumber: 1,
          startDate: null,
          endDate: null,
          isDateAnnual: true,
        },
      ],
    },
    {
      gateNote: "Existing note",
      gateOpenHoursStartTime: "08:00:00",
      gateOpenHoursEndTime: "20:00:00",
    },
    [
      {
        documentId: "date-1",
        sourceDateRangeId: 123,
        parkDateType: { dateTypeNumber: 1 },
      },
    ],
  );

  assert.equal(result.gate.gateNote, "Existing note");
  assert.equal(result.gate.hasGate, true);
  assert.equal(result.gate.gateOpenHoursStartTime, null);
  assert.equal(result.gate.gateOpenHoursEndTime, null);
  assert.equal(result.gate.gateOpen24Hours, false);
  assert.equal(result.gate.gateOpensAtDawn, false);
  assert.equal(result.gate.gateClosesAtDusk, false);
  assert.deepEqual(result.remainingDates, []);
  assert.ok(
    result.requests.some((request) => request.url === "/api/park-dates/date-1"),
  );
  assert.deepEqual(result.errors, []);
  assert.deepEqual(result.removedQueueIds, ["task-1"]);
});

test("missing gate info clears gate hours without clearing the note", async () => {
  const result = await publishItem(
    { orcs: 1 },
    { gateNote: "Existing note", gateOpenHoursStartTime: "08:00:00" },
  );

  assert.equal(result.gate.gateNote, "Existing note");
  assert.equal(result.gate.hasGate, false);
  assert.equal(result.gate.gateOpenHoursStartTime, null);
  assert.deepEqual(result.errors, []);
  assert.deepEqual(result.removedQueueIds, ["task-1"]);
});

test("existing gate notes are not replaced by DOOT gate info", async () => {
  const result = await publishItem(
    { orcs: 1, gateInfo: { hasGate: true, gateNote: "Unexpected note" } },
    { gateNote: "Existing note" },
  );

  assert.equal(result.gate.gateNote, "Existing note");
  assert.deepEqual(result.errors, []);
  assert.deepEqual(result.removedQueueIds, ["task-1"]);
});

test("creating a gate uses DOOT's empty note placeholder", async () => {
  const result = await publishItem(
    { orcs: 1, gateInfo: { hasGate: true, gateNote: "" } },
    null,
  );

  assert.equal(result.gate.gateNote, "");
  assert.equal(result.gate.hasGate, true);
  assert.equal(result.gate.protectedArea, "park-1");
  assert.deepEqual(result.errors, []);
  assert.deepEqual(result.removedQueueIds, ["task-1"]);
});
