import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';

// Pauses the whole test run when bcparks.ca stops responding, which happens
// when GitHub Actions runners are rate limited. Once a network error is seen,
// every worker waits before its next test, and one worker checks BASE_URL
// every 30 seconds. When it responds again, all workers carry on. This repeats
// every time the run is blocked.
//
// Workers are separate processes, so they share the paused state through a
// file. playwright.config.js gives each run its own file.
const BREAKER_FILE =
    process.env.E2E_BREAKER_FILE ?? path.join(os.tmpdir(), 'bcparks-e2e-breaker.json');
const PROBE_LOCK_FILE = `${BREAKER_FILE}.probe`;

// Time between checks of BASE_URL while paused: one request at a time
const PROBE_INTERVAL_MS = 30000;
// How often waiting workers look at the shared file (no network request)
const POLL_INTERVAL_MS = 2000;
// Give up waiting after this long, and let the tests run (and fail)
export const MAX_PAUSE_MS = 15 * 60 * 1000;

// Network errors that mean the server isn't responding, in Chromium, Firefox,
// WebKit and Node. Deliberately aborted requests (net::ERR_FAILED) don't match.
const NETWORK_ERROR =
    /ERR_CONNECTION_REFUSED|ERR_CONNECTION_RESET|ERR_CONNECTION_CLOSED|ERR_CONNECTION_TIMED_OUT|ERR_TIMED_OUT|ERR_EMPTY_RESPONSE|NS_ERROR_CONNECTION_REFUSED|NS_ERROR_NET_RESET|NS_ERROR_NET_TIMEOUT|Could not connect to the server|Connection refused|The request timed out|network connection was lost|ECONNREFUSED|ECONNRESET|ETIMEDOUT|socket hang up/i;

/**
 * Checks whether an error message is a network error from a server that isn't
 * responding.
 * @param {string|undefined} message error text from a failed request
 * @returns {boolean} true for refused, reset or timed out connections
 */
export function isNetworkError(message) {
    return NETWORK_ERROR.test(String(message ?? ''));
}

/**
 * Checks whether a URL is on the site or the Strapi API under test, rather
 * than a third-party site.
 * @param {string} url request URL
 * @returns {boolean} true if the URL's host is BASE_URL's or CMS_URL's
 */
export function isSiteUrl(url) {
    const hosts = [process.env.BASE_URL, process.env.CMS_URL]
        .filter(Boolean)
        .map((siteUrl) => new URL(siteUrl).host);
    try {
        return hosts.includes(new URL(url).host);
    } catch {
        return false;
    }
}

/**
 * Pauses the test run. Only the first call logs; later calls while paused do
 * nothing.
 * @param {string} reason the network error that caused the pause
 * @returns {void}
 */
export function pauseTests(reason) {
    try {
        fs.writeFileSync(BREAKER_FILE, JSON.stringify({ since: Date.now(), reason }), { flag: 'wx' });
        console.log(
            `Network error (${reason}). Pausing all tests, and checking ${process.env.BASE_URL} every ${PROBE_INTERVAL_MS / 1000} seconds until it responds.`,
        );
    } catch (error) {
        if (error.code !== 'EEXIST') {
            throw error;
        }
    }
}

/**
 * Waits while the test run is paused. One worker at a time checks BASE_URL,
 * once every PROBE_INTERVAL_MS; the others only watch the shared file.
 * @returns {Promise<void>} resolves when the run is no longer paused, or after MAX_PAUSE_MS
 */
export async function waitWhilePaused() {
    const start = Date.now();
    while (fs.existsSync(BREAKER_FILE)) {
        if (Date.now() - start > MAX_PAUSE_MS) {
            console.log(`Still paused after ${MAX_PAUSE_MS / 60000} minutes; running the next test anyway.`);
            return;
        }
        if (takeProbeLock()) {
            try {
                await sleep(PROBE_INTERVAL_MS);
                if (fs.existsSync(BREAKER_FILE) && (await siteResponds())) {
                    const { since } = JSON.parse(fs.readFileSync(BREAKER_FILE, 'utf8'));
                    fs.rmSync(BREAKER_FILE, { force: true });
                    console.log(
                        `${process.env.BASE_URL} responds again after ${Math.round((Date.now() - since) / 1000)} seconds. Resuming tests.`,
                    );
                }
            } finally {
                fs.rmSync(PROBE_LOCK_FILE, { force: true });
            }
        } else {
            await sleep(POLL_INTERVAL_MS);
        }
    }
}

/**
 * Makes this worker the one that checks BASE_URL, unless another worker
 * already is. A lock left behind by a worker that stopped is taken over.
 * @returns {boolean} true if this worker holds the lock
 */
function takeProbeLock() {
    try {
        fs.writeFileSync(PROBE_LOCK_FILE, String(process.pid), { flag: 'wx' });
        return true;
    } catch (error) {
        if (error.code !== 'EEXIST') {
            throw error;
        }
        const age = Date.now() - fs.statSync(PROBE_LOCK_FILE, { throwIfNoEntry: false })?.mtimeMs;
        if (age > PROBE_INTERVAL_MS * 3) {
            fs.rmSync(PROBE_LOCK_FILE, { force: true });
        }
        return false;
    }
}

/**
 * Sends one request to BASE_URL to see whether the site responds again.
 * @returns {Promise<boolean>} true if the site responds without a 429 or 5xx
 */
async function siteResponds() {
    try {
        const response = await fetch(process.env.BASE_URL, { signal: AbortSignal.timeout(10000) });
        return response.status < 500 && response.status !== 429;
    } catch {
        return false;
    }
}
