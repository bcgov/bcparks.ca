"use strict"

async function up(knex) {
  const cheerio = require('cheerio');
  if (await knex.schema.hasColumn('protected_areas', 'history')) {

    const protectedAreas = await strapi.db.query("api::protected-area.protected-area").findMany();

    for (const pa of protectedAreas) {
      let text = (pa.natureAndCulture || "").replace('<p>&nbsp;</p>', '');
      text = text.replace("</strong>&nbsp;</p>", "</strong></p>");
      text = text.replace(":</strong>", "</strong></p><p>");
      text = text.replace(": </strong>", "</strong></p><p>");
      text = text.replace(/<\/strong><br>/g, "</strong></p><p>");

      let matchH3 = false;
      let matchH4 = false;
      let matchP = false;

      const $ = cheerio.load(`<div>${text}</div>`, null, false);
      let contentBlocks = []
      $("div > p > strong").each(function (i, elm) {
        contentBlocks.push($(this).html().replace(": ", "").replace(":", "").replace("&nbsp;", "").toLowerCase())
        matchP = true;
      });
      $("div > h3").each(function (i, elm) {
        contentBlocks.push($(this).html().replace("<strong>", "").replace("</strong>", "").replace(": ", "").replace(":", "").replace("&nbsp;", "").toLowerCase())
        matchH3 = true;
      });
      $("div > h4").each(function (i, elm) {
        contentBlocks.push($(this).html().replace(": ", "").replace(":", "").replace("&nbsp;", "").toLowerCase())
        matchH4 = true;
      });

      let onlyHasWhitelistedCategories = true;

      for (let category of contentBlocks) {
        if (!["conservation", "cultural heritage", "history", "wildlife"].includes(category)) {
          onlyHasWhitelistedCategories = false;
        }
      }

      let hasInvalidStructure = false;
      if (contentBlocks.length > 0 && !text.startsWith("<h3>") && !text.startsWith("<h4>") && !text.startsWith("<p><strong>") && onlyHasWhitelistedCategories) {
        hasInvalidStructure = true;
      }

      let parsedSections = [];
      if (contentBlocks.length > 0 && onlyHasWhitelistedCategories && !hasInvalidStructure) {
        if (matchH3) {
          let parts = text.split("<h3>");
          for (const p1 of parts) {
            let parsedPart = {
              title: p1.split("</h3>")[0],
              text: p1.split("</h3>")[1]
            }
            parsedSections.push(parsedPart)
          }
        }
        if (matchH4 && !matchH3) {
          let parts = text.split("<h4>");
          for (const p2 of parts) {
            let parsedPart = {
              title: p2.split("</h4>")[0],
              text: p2.split("</h4>")[1]
            }
            parsedSections.push(parsedPart)
          }
        }
        if (matchP && !matchH3 && !matchH4) {
          let parts = text.split("<p><strong>");
          for (const p3 of parts) {
            try {
              let parsedPart = {
                title: p3.split("</strong></p>")[0],
                text: p3.split("</strong></p>")[1]
              }
              parsedSections.push(parsedPart)
            } catch (ex) {
              console.log(JSON.stringify(ex))
            }
          }
        }
      }

      if (parsedSections.length) {
        parsedSections.shift();
        const obj = {};
        if (parsedSections.length) {
          for (const section of parsedSections) {
            const fieldName = section.title.toLowerCase().replace(" ", "").replace("culturalheritage", "cultural_heritage").replace("<strong>", "").replace("</strong>", "").replace("&nbsp;", "");
            obj[fieldName] = section.text;
          }
          await knex('protected_areas').where({ id: pa.id }).update(obj);
        }
      }
    }

    await knex.raw("update protected_areas set conservation = nature_and_culture where type = 'Ecological Reserve';");
    await knex.raw("update protected_areas set nature_and_culture = '' where type = 'Ecological Reserve';");

    // todo: this line is disabled to allow QA to compare the fields
    // await knex.raw("update protected_areas set nature_and_culture = '' where conservation <> '' or history <> '' or cultural_heritage <> '' or wildlife <> '';");
  }
}

module.exports = { up };
