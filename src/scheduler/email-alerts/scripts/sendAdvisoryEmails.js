const { getLogger } = require('../../shared/logging');
const { cmsAxios } = require('../../shared/axiosConfig');
const { readQueue, removeFromQueue } = require('../../shared/taskQueue');
const qs = require('qs');
const ejs = require('ejs');
const { writeFile } = require('fs');
const { format, parseJSON } = require('date-fns')
const { scriptKeySpecified, noCommandLineArgs } = require('../../shared/commandLine');
const { send } = require('./mailer');

/**
 * Sends queued emails
 */
exports.sendAdvisoryEmails = async function (recentAdvisoryEmails) {

  const THROTTLE_MINUTES = 10; // min. time before sending 2 emails about 1 advisory
  let queue;
  let sent = [];
  const logger = getLogger();

  // get items from the queue with the action 'email advisory'
  try {
    queue = await readQueue("email advisory");
  } catch (error) {
    logger.error(`sendAdvisoryEmails() failed while retrieving 'email advisory' tasks: ${error}`);
    return;
  }

  for (const message of queue) {
    const advisoryNumber = message.attributes?.numericData;
    if (!recentAdvisoryEmails.find(e => e.advisoryNumber === advisoryNumber)) {
      sent.push({ "advisoryNumber": advisoryNumber, "lastEmailSent": new Date().toISOString() });
      const emailInfo = message.attributes?.jsonData;

      const advisoryInfo = await getAdvisoryInfo(advisoryNumber);

      const emailData = {
        ...emailInfo,
        ...{ data: advisoryInfo[0] },
        ...{ postedDate: format(parseJSON(advisoryInfo[0].advisoryDate), "MMMM d, yyyy") },
        ...{ postedTime: format(parseJSON(advisoryInfo[0].advisoryDate), "h:mma").toLowerCase() },
        ...{ environment: "alpha-dev-" } // todo: need to specify which environment
      };

      // render the email template
      const htmlMessageBody = await ejs.renderFile("./email-alerts/templates/public-advisory.ejs", emailData);

      if (scriptKeySpecified("emailtest")) {
        writeFile(`./mail-test-${advisoryNumber}.html`, htmlMessageBody, (err) => {
          if (err) throw err;
        });
      }

      if (scriptKeySpecified("emailsend") || noCommandLineArgs()) {
        if (process.env.EMAIL_ENABLED.toLowerCase() !== "false") {
          await send(emailData.subject, htmlMessageBody, emailData.data.title);
        }
        await removeFromQueue([message.id])
      }
    }
  }

  // prune the list of recentAdvisoryEmails to THROTTLE_MINUTES and return
  const throttleMinutesAgo = new Date(Date.now() - 1000 * 60 * THROTTLE_MINUTES).toISOString();

  return [...recentAdvisoryEmails.filter(a => a.lastEmailSent > throttleMinutesAgo), ...sent];
};

const getAdvisoryInfo = async function (advisoryNumber) {
  const advisoryFilter = qs.stringify({
    publicationState: "preview",
    populate: {
      fireCentres: { fields: ["fireCentreName"] },
      fireZones: { fields: ["fireZoneName"] },
      links: {
        fields: ["title", "url"],
        populate: { type: { fields: ["type"] } }
      },
      managementAreas: { fields: ["managementAreaName"] },
      protectedAreas: { fields: ["protectedAreaName", "slug"] },
      regions: { fields: ["regionName"] },
      sections: { fields: ["sectionName"] },
      sites: {
        fields: ["siteName", "slug"],
        populate: { "protectedArea": { fields: "slug" } }
      },
      standardMessages: { fields: ["description"] },
      urgency: { fields: ["urgency"] }
    },
    filters: {
      $and: [
        { isLatestRevision: true },
        { advisoryNumber: advisoryNumber }
      ]
    }
  }, {
    encodeValuesOnly: true,
  });
  const advisoryQuery = `/api/public-advisory-audits?${advisoryFilter}`;
  const response = await cmsAxios.get(advisoryQuery,
    { headers: { Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}` } }
  );
  return response.data.data;
};