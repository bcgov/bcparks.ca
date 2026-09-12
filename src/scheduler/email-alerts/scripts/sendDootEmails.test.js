const assert = require("node:assert/strict");
const { after, before, test } = require("node:test");
const path = require("node:path");
const Module = require("node:module");

require("dotenv").config({
  path: path.resolve(__dirname, "../../.env"),
});

const schedulerDirectory = path.resolve(__dirname, "../..");
const outputFile = path.join(
  schedulerDirectory,
  "mail-test-doot-1234-test-document.html",
);

const originalCwd = process.cwd();
const originalLoad = Module._load;

let sentMail;

const queueMessage = {
  action: "email doot notification",
  documentId: "test-document",
  numericData: 1234,
  jsonData: {
    emailType: "draft-review",
    parkOperatorName: "Example Contributor",
    parkName: "Example Park",
    parkAreaName: null,
    featureName: "Example Feature",
    recipientEmails: ["area-10@example.com"],
    seasonType: "regular",
    operatingYear: 2027,
    seasonFormSlug: "park-area",
    seasonId: 1234,
    isReminder: false,
    triggeredBy:
      "bcparks-staff-portal::backend::routes::api::seasons::season-save",
  },
};

before(() => {
  process.chdir(schedulerDirectory);
  process.env.EMAIL_ENABLED = "true";
  process.argv.push("emailtest");

  Module._load = function (request, parent, isMain) {
    if (request === "../../shared/taskQueue") {
      return {
        readQueue: async () => [queueMessage],
        removeFromQueue: async () => {},
      };
    }

    if (request === "../../shared/logging") {
      return {
        getLogger: () => ({
          error: () => {},
          info: () => {},
          warn: () => {},
        }),
      };
    }

    if (request === "../../shared/commandLine") {
      return {
        scriptKeySpecified: (key) => key === "emailtest",
        noCommandLineArgs: () => false,
      };
    }

    if (request === "../utils/mailer") {
      return {
        send: async (...args) => {
          sentMail = args;
        },
      };
    }

    return originalLoad.call(this, request, parent, isMain);
  };
});

after(() => {
  Module._load = originalLoad;
  process.chdir(originalCwd);
  process.argv.pop();
});

test("renders a DOOT draft-review email from the queued message", async () => {
  const { sendDootEmails } = require("./sendDootEmails");

  await sendDootEmails([]);

  assert.equal(sentMail, undefined);

  const renderedEmail = require("node:fs").readFileSync(outputFile, "utf8");

  assert.match(renderedEmail, /Example Contributor/);
  assert.match(renderedEmail, /Example Park/);
  assert.match(renderedEmail, /Example Feature/);
  assert.match(renderedEmail, /area-10@example\.com/);
});
