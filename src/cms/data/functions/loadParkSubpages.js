const fs = require("fs");

const loadParkSubpages = async () => {
  var jsonData = fs.readFileSync("./data/park-sub-pages.json", "utf8");
  const parkSubpagesData = JSON.parse(jsonData)["parkSubpages"];
  strapi.log.info(`loading park subpages...`);

  for (const page of parkSubpagesData) {
    const protectedArea = await strapi.services["protected-area"].findOne({
      orcs: page.orcs
    });

    const strapiData =
    {
      slug: page.slug,
      protectedArea: protectedArea?.id,
      title: page.heading,
      oldUrl: page.oldUrl,
      content: [
        {
          "__component": "parks.html-area",
          "HTML": page.content
        }
      ],
      seo: {
        metaTitle: page.title
      }
    };
    await strapi.services["park-sub-page"].create(strapiData);
  }
  strapi.log.info("loading park subpages completed...");
};

module.exports = {
  loadParkSubpages,
};
