/**
 * Builds the full advisory description by wrapping the advisory's own
 * description and appending the description of each linked standard message
 * in the order they were added. Messages without a description are skipped.
 * Does not mutate the entity.
 */
function buildDescriptionWithStandardMessages(entity) {
  const { description = "", standardMessages } = entity;
  let content = description ? `<div>${description}</div>` : "";
  const messages = (standardMessages ?? []).filter((m) => m.description);
  if (messages.length > 0) {
    content += messages.map((m) => `<div>${m.description}</div>`).join(" ");
  }
  return content.trim();
}

/**
 * Returns a Strapi populate value that also loads the description of each
 * standard message, preserving whatever else the caller asked to populate.
 */
function addStandardMessagesPopulate(populate) {
  const standardMessages = {
    fields: ["description"],
  };

  if (populate === "*") {
    return populate;
  }

  if (!populate) {
    return { standardMessages };
  }

  if (typeof populate === "string" || Array.isArray(populate)) {
    // Keep the array form so dotted paths like "sites.protectedArea" still
    // populate nested relations. Populating standardMessages without a field
    // restriction loads every field the description helper needs.
    const names = typeof populate === "string" ? populate.split(",") : populate;
    const trimmedNames = names
      .map((name) => name.trim())
      .filter((name) => name && name !== "standardMessages");
    return [...trimmedNames, "standardMessages"];
  }

  return { ...populate, standardMessages };
}

module.exports = {
  buildDescriptionWithStandardMessages,
  addStandardMessagesPopulate,
};
