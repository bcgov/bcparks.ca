async function getNextAdvisoryNumber() {
  const results = await strapi
    .documents("api::public-advisory-audit.public-advisory-audit")
    .findMany({
      sort: { advisoryNumber: "DESC" },
      limit: 1,
      fields: ["advisoryNumber"],
    });
  let maxAdvisoryNumber = results.length > 0 ? results[0].advisoryNumber : 0;
  if (!maxAdvisoryNumber || maxAdvisoryNumber < 0) maxAdvisoryNumber = 0;
  return ++maxAdvisoryNumber;
}

module.exports = {
  getNextAdvisoryNumber,
};
