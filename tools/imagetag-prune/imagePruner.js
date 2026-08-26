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
 * Gatsby rollback images (<gatsbyRollbackImageName>:rollbackYYYYMMDDTHHMM) use separate
 * retention rules:
 * - Days 0-3: keep every image
 * - Days 4-14: keep only the first image created each day
 * - Older than 14 days: delete, while keeping a minimum number of builds
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
    gatsbyKeepAllDays = 3,
    gatsbyKeepFirstDailyUntilDays = 14,
    gatsbyMinBuildsToKeep = 5,
    gatsbyRollbackImageName = "public-main",
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
    this.gatsbyKeepAllDays = gatsbyKeepAllDays;
    this.gatsbyKeepFirstDailyUntilDays = gatsbyKeepFirstDailyUntilDays;
    this.gatsbyMinBuildsToKeep = gatsbyMinBuildsToKeep;
    this.gatsbyRollbackImageName = gatsbyRollbackImageName;

    this.dryRun = dryRun;

    this.releaseTagsToKeep = [];
    this.gitHashTagsToKeep = [];
    this.artifactTagsToDelete = [];
    this.gatsbyTagsToDelete = [];
    this.gatsbyRollbackBuildsSeen = 0;
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

    // Loop through items oldest->newest and mark the first Gatsby rollback tag created each day.
    // The rollback tag timestamp is already in Vancouver local time.
    const firstGatsbyBuildDaysSeen = new Set();
    for (let i = sortedItems.length - 1; i >= 0; i -= 1) {
      const item = sortedItems[i];
      if (item.imageName === this.gatsbyRollbackImageName) {
        const match = /^rollback(\d{8})T\d{4}$/i.exec(item.tag);
        const buildDate = match ? match[1] : null;
        if (!buildDate) {
          item.firstGatsbyBuildOfTheDay = false;
          continue;
        }
        if (!firstGatsbyBuildDaysSeen.has(buildDate)) {
          firstGatsbyBuildDaysSeen.add(buildDate);
          item.firstGatsbyBuildOfTheDay = true;
        } else {
          item.firstGatsbyBuildOfTheDay = false;
        }
      }
    }

    for (const item of sortedItems) {
      if (this.#shouldCleanBuildArtifactImage(item.imageName, item.tag)) {
        this.artifactTagsToDelete.push({
          imageName: item.imageName,
          tagName: item.tag,
        });
      }
      if (this.#shouldCleanGatsbyRollbackImage(item)) {
        this.gatsbyTagsToDelete.push({
          imageName: item.imageName,
          tagName: item.tag,
        });
      }
    }
  }

  #shouldCleanBuildArtifactImage(name, tag) {
    // Gatsby rollback imagestream is handled separately in #shouldCleanGatsbyRollbackImage
    if (name === this.gatsbyRollbackImageName) {
      return false;
    }

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

  #shouldCleanGatsbyRollbackImage(item) {
    if (item.imageName !== this.gatsbyRollbackImageName) {
      return false;
    }

    // keep dev/test/prod/latest tags
    if (this.imageTagsToIgnore.includes(item.tag)) {
      return false;
    }

    // Only apply Gatsby retention rules to rollback tags.
    if (!/^rollback\d{8}T\d{4}$/i.test(item.tag)) {
      return false;
    }

    this.gatsbyRollbackBuildsSeen += 1;

    const now = Date.now();
    const itemAgeInDays = Math.floor(
      (now - item.creationTimestamp.getTime()) / (1000 * 60 * 60 * 24),
    );

    // Days 0-3: keep every image
    if (itemAgeInDays <= this.gatsbyKeepAllDays) {
      return false;
    }

    // Days 4-14: keep only the first image created each day
    if (itemAgeInDays <= this.gatsbyKeepFirstDailyUntilDays && item.firstGatsbyBuildOfTheDay) {
      return false;
    }

    // Keep at least N rollback builds overall.
    const buildsRetainedSoFar = this.gatsbyRollbackBuildsSeen - this.gatsbyTagsToDelete.length;
    if (buildsRetainedSoFar <= this.gatsbyMinBuildsToKeep) {
      return false;
    }

    return true;
  }

  async #deleteImageTags() {
    if (this.dryRun) {
      console.log(
        "This is only a dryrun, nothing will be removed.  Set dry run env to false to perform actual deletions.\n",
      );
    }
    console.log(
      `${this.artifactTagsToDelete.length} build artifact image tags matched prune criteria\n`,
    );
    console.log(
      `${this.gatsbyTagsToDelete.length} Gatsby rollback image tags matched prune criteria\n`,
    );

    const imageTagsToDelete = this.artifactTagsToDelete.concat(this.gatsbyTagsToDelete);

    for (const tag of imageTagsToDelete) {
      console.log(`${this.dryRun ? "--DRY-RUN--" : ""}Deleting ${tag.imageName}:${tag.tagName}`);
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
