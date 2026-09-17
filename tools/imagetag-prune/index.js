"use strict";

const ImagePruner = require("./imagePruner");
const dotenv = require("dotenv");

dotenv.config({
  path: `.env`,
});

const OPENSHIFT_AUTH_TOKEN = process.env.OPENSHIFT_AUTH_TOKEN;
const OPENSHIFT_API_URL =
  process.env.OPENSHIFT_API_URL ||
  "https://api.gold.devops.gov.bc.ca:6443/apis/image.openshift.io/v1";
const TOOLS_NAMESPACE = process.env.TOOLS_NAMESPACE || "c1643c-tools";

// Regex pattern used to match short git SHA hashes (7 or 8 characters)
const GIT_SHA_HASH_REGEX = process.env.GIT_SHA_HASH_REGEX || "^[0-9a-f]{7,8}$";

// Regex pattern used to match release tags, e.g., v1.12.3
const RELEASE_TAG_REGEX =
  process.env.RELEASE_TAG_REGEX || "^v[0-9]*\\.[0-9]*\\.[0-9]*-?.*";

const IMAGETAGS_TO_KEEP = splitAndTrim(process.env.IMAGETAGS_TO_KEEP) || [
  "latest",
  "dev",
  "test",
  "prod",
];
const IMAGESTREAMS_TO_CLEAN = splitAndTrim(
  process.env.IMAGESTREAMS_TO_CLEAN,
) || [
  "admin-alpha",
  "admin-main",
  "etl-alpha",
  "etl-main",
  "maintenance-alpha",
  "maintenance-main",
  "public-builder-alpha",
  "public-builder-main",
  "public-alpha",
  "public-main",
  "strapi-alpha",
  "strapi-main",
  "scheduler-main",
  "scheduler-alpha",
];

// Always keep the last "NUM_RELEASES_TO_KEEP" tags
const NUM_RELEASES_TO_KEEP = process.env.NUM_RELEASES_TO_KEEP || 10;

// Gatsby rollback retention rules:
// - Days 0-3: keep every image
// - Days 4-14: keep only the first image created each day
// - Older than 14 days: delete
const GATSBY_KEEP_ALL_DAYS = Number(process.env.GATSBY_KEEP_ALL_DAYS || 3);
const GATSBY_KEEP_FIRST_DAILY_UNTIL_DAYS = Number(
  process.env.GATSBY_KEEP_FIRST_DAILY_UNTIL_DAYS || 14,
);
const GATSBY_MIN_BUILDS_TO_KEEP = Number(
  process.env.GATSBY_MIN_BUILDS_TO_KEEP || 5,
);
const GATSBY_ROLLBACK_IMAGESTREAM =
  process.env.GATSBY_ROLLBACK_IMAGESTREAM || "public-main";

const DRY_RUN = process.env.DRY_RUN !== "false";

function splitAndTrim(str) {
  if (str) {
    return str.split(",").map((item) => item.trim());
  }

  return str;
}

const pruner = new ImagePruner({
  openShiftUrl: `${OPENSHIFT_API_URL}/namespaces/${TOOLS_NAMESPACE}/imagestreamtags`,
  openShiftToken: OPENSHIFT_AUTH_TOKEN,
  releaseTagRegex: RELEASE_TAG_REGEX,
  gitShaHashRegex: GIT_SHA_HASH_REGEX,
  imageStreamsToPrune: IMAGESTREAMS_TO_CLEAN,
  imageTagsToIgnore: IMAGETAGS_TO_KEEP,
  numReleasesToKeep: NUM_RELEASES_TO_KEEP,
  gatsbyKeepAllDays: GATSBY_KEEP_ALL_DAYS,
  gatsbyKeepFirstDailyUntilDays: GATSBY_KEEP_FIRST_DAILY_UNTIL_DAYS,
  gatsbyMinBuildsToKeep: GATSBY_MIN_BUILDS_TO_KEEP,
  gatsbyRollbackImageName: GATSBY_ROLLBACK_IMAGESTREAM,
  dryRun: DRY_RUN,
});

pruner.prune();
