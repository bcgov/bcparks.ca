import { test as base, expect } from '@playwright/test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';

// Pauses the whole test run while a server under test (bcparks.ca or the
// Strapi API) is unreachable, which happens when GitHub Actions runners are
// rate limited. A spec imports `test` and `expect` from here instead of
// '@playwright/test', and calls pauseTests() when a request fails with
// isUnreachableError(); every worker then waits before its next test. One worker checks a server that's down every 30 seconds, and
// tests resume when every server that failed responds. If one outage lasts
// longer than MAX_PAUSE_MS, the run stops pausing, so it can finish within the
// workflow's time limit.
//
// Playwright replaces a worker process after a test fails, so the state is
// kept in files in STATE_DIR (one per run, see playwright.config.js): a
// "down-<host>" file for each server that's down, "probe.lock" while a worker
// is checking, and "gave-up" once an outage has run too long.
const STATE_DIR = process.env.E2E_NETWORK_PAUSE_DIR ?? path.join(os.tmpdir(), 'bcparks-e2e-network-pause');
const PROBE_LOCK = path.join(STATE_DIR, 'probe.lock');
const GAVE_UP = path.join(STATE_DIR, 'gave-up');
const PROBE_INTERVAL_MS = 30000;
const POLL_INTERVAL_MS = 2000;
const MAX_PAUSE_MS = 15 * 60 * 1000;

// Timeouts and network errors from Playwright and Node, and the connection
// errors that Chromium, Firefox and WebKit report in navigation errors
const UNREACHABLE =
    /Timeout \d+ms exceeded|Request timed out after \d+ms|net::ERR_|NS_ERROR_CONNECTION_REFUSED|NS_ERROR_NET_RESET|NS_ERROR_NET_TIMEOUT|Could not connect to the server|Connection refused|The request timed out|network connection was lost|ECONNREFUSED|ECONNRESET|ETIMEDOUT|EAI_AGAIN|ENOTFOUND|socket hang up/i;

/**
 * Checks whether an error thrown by a Playwright request or navigation means
 * the server couldn't be reached (a timeout or network error), rather than a
 * problem with the page content.
 * @param {unknown} error error thrown by page.goto, request.get, etc.
 * @returns {boolean} true if the server couldn't be reached
 */
export function isUnreachableError(error) {
    return error?.name === 'TimeoutError' || UNREACHABLE.test(String(error?.message));
}

/**
 * Pauses the test run until the server at `url` responds again.
 * @param {string} reason why the server is considered down, for the log
 * @param {string} url URL that couldn't be loaded
 * @returns {void}
 */
export function pauseTests(reason, url) {
    const { origin, host } = new URL(url);
    const marker = path.join(STATE_DIR, `down-${encodeURIComponent(host)}`);
    if (!fs.existsSync(GAVE_UP) && writeOnce(marker, JSON.stringify({ origin, since: Date.now() }))) {
        console.log(`Network error (${reason}). Pausing all tests until ${origin} responds.`);
    }
}

/**
 * Playwright test that waits, before each test, while the run is paused.
 * Specs that use the network pause import test and expect from here.
 */
export const test = base.extend({
    // Runs for every test. Its own timeout keeps the waiting out of the test timeout.
    waitWhileNetworkPaused: [
        async ({}, use) => {
            await waitWhilePaused();
            await use();
        },
        { auto: true, timeout: MAX_PAUSE_MS + 60000 },
    ],
});

export { expect };

/**
 * Waits while the test run is paused. One worker at a time checks a server
 * that's down, every PROBE_INTERVAL_MS; the others only watch the files.
 * @returns {Promise<void>} resolves when no servers are down, or the outage
 * has lasted longer than MAX_PAUSE_MS
 */
async function waitWhilePaused() {
    for (let down = downServers(); down.length > 0 && !fs.existsSync(GAVE_UP); down = downServers()) {
        const since = Math.min(...down.map((server) => server.since));
        if (Date.now() - since > MAX_PAUSE_MS) {
            if (writeOnce(GAVE_UP, '')) {
                console.log(`Still no response after ${MAX_PAUSE_MS / 60000} minutes. No more pauses in this run.`);
            }
            return;
        }
        if (writeOnce(PROBE_LOCK, '')) {
            try {
                await sleep(PROBE_INTERVAL_MS);
                await probe(since);
            } finally {
                fs.rmSync(PROBE_LOCK, { force: true });
            }
        } else {
            // Take over a lock left behind by a worker that stopped
            const lockAge = Date.now() - (fs.statSync(PROBE_LOCK, { throwIfNoEntry: false })?.mtimeMs ?? Date.now());
            if (lockAge > PROBE_INTERVAL_MS * 3) {
                fs.rmSync(PROBE_LOCK, { force: true });
            }
            await sleep(POLL_INTERVAL_MS);
        }
    }
}

/**
 * Checks the first server that's still down, with one request, and stops
 * waiting for it if it responds.
 * @param {number} since when the outage started, for the log
 * @returns {Promise<void>}
 */
async function probe(since) {
    const [server] = downServers();
    if (!server || !(await responds(server.origin))) {
        return;
    }
    fs.rmSync(server.file, { force: true });
    const stillDown = downServers().map((s) => s.origin);
    console.log(
        stillDown.length > 0
            ? `${server.origin} responds again. Still waiting for ${stillDown.join(', ')}.`
            : `${server.origin} responds again after ${Math.round((Date.now() - since) / 1000)} seconds. Resuming tests.`,
    );
}

/**
 * Lists the servers that are down.
 * @returns {{file: string, origin: string, since: number}[]} servers, in a stable order
 */
function downServers() {
    const names = fs.existsSync(STATE_DIR) ? fs.readdirSync(STATE_DIR) : [];
    return names
        .filter((name) => name.startsWith('down-'))
        .sort()
        .map((name) => {
            const file = path.join(STATE_DIR, name);
            try {
                return { file, ...JSON.parse(fs.readFileSync(file, 'utf8')) };
            } catch {
                // Being written or just removed by another worker
                return { file, origin: `https://${decodeURIComponent(name.slice(5))}`, since: Date.now() };
            }
        });
}

/**
 * Creates a file in STATE_DIR, unless it already exists.
 * @param {string} file path of the file
 * @param {string} contents file contents
 * @returns {boolean} true if this call created the file
 */
function writeOnce(file, contents) {
    fs.mkdirSync(STATE_DIR, { recursive: true });
    try {
        fs.writeFileSync(file, contents, { flag: 'wx' });
        return true;
    } catch (error) {
        if (error.code !== 'EEXIST') {
            throw error;
        }
        return false;
    }
}

/**
 * Sends one request to a server to see whether it responds again.
 * @param {string} origin server origin, e.g. https://bcparks.ca
 * @returns {Promise<boolean>} true if the server responds without a 429 or 5xx
 */
async function responds(origin) {
    try {
        const response = await fetch(`${origin}/`, { signal: AbortSignal.timeout(10000) });
        return response.status < 500 && response.status !== 429;
    } catch {
        return false;
    }
}
