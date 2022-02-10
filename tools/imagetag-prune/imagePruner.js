"use strict";

const p = require("phin");

/**
 * Utility class used to retrieve a list of imagestreamtags and determine
 * if they should be pruned.
 *
 * Default behavior is to keep "latest", "dev", "test", and "prod" tags for
 * all images.
 *
 * Default behavior will keep "numReleasesToKeep" number of tags matching the
 * "releaseTagRegex" and "gitShaHashRegex" regex patterns.
 *
 * Dry run will compute imagestreamtags to delete but not actually delete them.
 */
class ImagePruner {
  constructor({
    openShiftUrl,
    openShiftToken,
    releaseTagRegex,
    gitShaHashRegex,
    numReleasesToKeep = 10,
    imageTagsToIgnore = ["latest", "dev", "test", "prod"],
    imageStreamsToPrune = [],
    dryRun = true,
  }) {
    this.openShiftToken = openShiftToken;
    this.openShiftImageTagsUrl = openShiftUrl;

    // Regex pattern used to match release tags
    this.releaseTagRegex = new RegExp(releaseTagRegex, "i");

    // Regex pattern used to match git sha hash
    this.gitShaHashRegex = new RegExp(gitShaHashRegex, "i");

    this.imageStreamsToPrune = imageStreamsToPrune;
    this.imageTagsToIgnore = imageTagsToIgnore;
    this.numReleasesToKeep = numReleasesToKeep;

    this.dryRun = dryRun;

    this.releaseTagsToKeep = [];
    this.gitHashTagsToKeep = [];
    this.imageTagsToDelete = [];
  }

  async prune() {
    if (!this.openShiftToken) {
      throw new Error("OpenShift auth token not set");
    }

    await this.#retrieveOpenShiftImageTags();

    await this.#deleteImageTags();
  }

  async #retrieveOpenShiftImageTags() {
    const res = await p({
      url: this.openShiftImageTagsUrl,
      headers: {
        Authorization: `Bearer ${this.openShiftToken}`,
      },
      parse: "json",
    });

    // Sort the items from newest to oldest
    const sortedItems = res.body.items
      .map((item) => {
        const tokens = item.metadata.name.split(":");
        return {
          imageName: tokens[0],
          tag: tokens[1],
          creationTimestamp: new Date(item.metadata.creationTimestamp),
        };
      })
      .sort((a, b) => b.creationTimestamp - a.creationTimestamp);

    for (const item of sortedItems) {
      if (this.#shouldCleanImage(item.imageName, item.tag)) {
        this.imageTagsToDelete.push({
          imageName: item.imageName,
          tagName: item.tag,
        });
      }
    }
  }

  #shouldCleanImage(name, tag) {
    if (!this.imageStreamsToPrune.includes(name)) {
      return false;
    }

    if (this.imageTagsToIgnore.includes(tag)) {
      return false;
    }

    // Check if tag matches a release tag pattern.
    if (tag.match(this.releaseTagRegex)) {
      // Because multiple images can have the same release tag due to mono repo setup,
      // we want to check if the tag is already in the list of release tags to keep
      if (this.releaseTagsToKeep.includes(tag)) {
        return false;
      }

      // Only keep up to "numReleasesToKeep" release tags
      if (this.releaseTagsToKeep.length < this.numReleasesToKeep) {
        this.releaseTagsToKeep.push(tag);
        return false;
      }
    }

    // Check if tag matches a git hash pattern.
    if (tag.match(this.gitShaHashRegex)) {
      // Because multiple images can have the same git hash due to mono repo setup,
      // we want to check if the tag is already in the list of git hashes to keep
      if (this.gitHashTagsToKeep.includes(tag)) {
        return false;
      }

      // Only keep up to "numReleasesToKeep" git hashes
      if (this.gitHashTagsToKeep.length < this.numReleasesToKeep) {
        this.gitHashTagsToKeep.push(tag);
        return false;
      }
    }

    return true;
  }

  async #deleteImageTags() {
    if (this.dryRun) {
      console.log(
        "This is only a dryrun, nothing will be removed.  Set dry run env to false to perform actual deletions.\n"
      );
    }
    console.log(
      `${this.imageTagsToDelete.length} images tags matched pruned criteria\n`
    );

    for (const tag of this.imageTagsToDelete) {
      console.log(
        `${this.dryRun ? "--DRY-RUN--" : ""}Deleting ${tag.imageName}:${
          tag.tagName
        }`
      );
      if (!this.dryRun) {
        try {
          const res = await p({
            url: `${this.openShiftImageTagsUrl}/${tag.imageName}:${tag.tagName}`,
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${this.openShiftToken}`,
            },
            parse: "json",
          });

          if (res.statusCode !== 200) {
            throw new Error(res.statusMessage);
          }

          console.log(`Deleted ${tag.imageName}:${tag.tagName}`);
        } catch (err) {
          console.error(`Error deleting ${tag.imageName}:${tag.tagName} `, err);
        }
      }
    }
  }
}

module.exports = ImagePruner;
