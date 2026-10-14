// Playwright reporter that adds a GitHub error annotation for each failed test,
// from its final retry only. Used in place of the built-in github reporter.
//
// playwright.yaml runs the tests as a Job on OpenShift, not on the GitHub
// Actions runner, so failures are harder to find than in a normal run. The
// test output is streamed into one long workflow step, and the HTML report is
// a zip to download. The annotations on the run summary page are the quickest
// way to see what failed, so they need to be easy to read:
// - The built-in reporter annotates every failed attempt, so with 2 retries a
//   test that always fails shows up three times. This one annotates it once.
// - Paths are relative to the repo root, so annotations link to the right file
//   even though the Job runs the tests in /e2e, outside a GitHub checkout.
//
// It prints GitHub workflow commands (::error) to stdout, which become
// annotations when the Job's log is streamed into the workflow step.

const path = require('path');
const { stripVTControlCharacters } = require('util');

// The tests/e2e folder. Annotation paths are relative to the repo root, so
// they link to the file even though the OpenShift Job runs the tests in /e2e.
const E2E_DIR = path.join(__dirname, '..');

/**
 * Escapes a value for a GitHub workflow command. Properties (file, title, ...)
 * also need `:` and `,` escaped; the message itself does not.
 * @param {string} value text to escape
 * @param {boolean} [isProperty] true to also escape `:` and `,`
 * @returns {string} escaped text
 */
function escape(value, isProperty = false) {
  const escaped = value.replace(/%/g, '%25').replace(/\r/g, '%0D').replace(/\n/g, '%0A');
  return isProperty ? escaped.replace(/:/g, '%3A').replace(/,/g, '%2C') : escaped;
}

/**
 * Adds a GitHub error annotation for each failed test, from its final attempt
 * only. The list and html reporters still show every attempt.
 */
class GitHubFinalAttemptReporter {
  /**
   * Prints the annotations once a test has failed with no retries left.
   * @param {import('@playwright/test/reporter').TestCase} test the test
   * @param {import('@playwright/test/reporter').TestResult} result this attempt's result
   * @returns {void}
   */
  onTestEnd(test, result) {
    if (result.status === test.expectedStatus || result.status === 'skipped') {
      return;
    }
    if (result.retry < test.retries && result.status !== 'interrupted') {
      return; // Playwright will retry
    }
    // titlePath() starts with the root suite, project and file; the
    // annotation already shows the file, so keep the describe and test titles
    const title = test.titlePath().slice(3).join(' › ');
    const attempt = `(attempt ${result.retry + 1} of ${test.retries + 1})`;
    for (const error of result.errors) {
      const location = error.location ?? test.location;
      const file = path.join('tests/e2e', path.relative(E2E_DIR, location.file));
      const properties = [
        `file=${escape(file, true)}`,
        `line=${location.line}`,
        `col=${location.column}`,
        `title=${escape(title, true)}`,
      ].join(',');
      const message = stripVTControlCharacters(error.message ?? error.value ?? 'Test failed');
      console.log(`::error ${properties}::${escape(`${message}\n${attempt}`)}`);
    }
  }
}

module.exports = GitHubFinalAttemptReporter;
