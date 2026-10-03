import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';

// Pauses the whole test run when bcparks.ca or the Strapi API stops
// responding, which happens when GitHub Actions runners are rate limited.
// After a network error, every worker waits before its next test, and one
// worker checks a server that's down every 30 seconds. Tests resume when every
// server that failed responds. If one outage lasts longer than MAX_PAUSE_MS,
// the run stops pausing, so it can finish within the workflow's time limit.
//
// Workers are separate processes, so they share state through files in
// STATE_DIR (one per run, see playwright.config.js): a "down-<host>" file for
// each server that's down, "probe.lock" while a worker is checking, and
// "gave-up" once an outage has run too long.
const STATE_DIR = process.env.E2E_BREAKER_DIR ?? path.join(os.tmpdir(), 'bcparks-e2e-breaker');
const PROBE_LOCK = path.join(STATE_DIR, 'probe.lock');
const GAVE_UP = path.join(STATE_DIR, 'gave-up');
const PROBE_INTERVAL_MS = 30000;
const POLL_INTERVAL_MS = 2000;
export const MAX_PAUSE_MS = 15 * 60 * 1000;

// Network errors from a server that isn't responding, in Chromium, Firefox,
// WebKit and Node. Deliberately aborted requests (net::ERR_FAILED) don't match.
const NETWORK_ERROR =
    /ERR_CONNECTION_REFUSED|ERR_CONNECTION_RESET|ERR_CONNECTION_CLOSED|ERR_CONNECTION_TIMED_OUT|ERR_TIMED_OUT|ERR_EMPTY_RESPONSE|NS_ERROR_CONNECTION_REFUSED|NS_ERROR_NET_RESET|NS_ERROR_NET_TIMEOUT|Could not connect to the server|Connection refused|The request timed out|network connection was lost|ECONNREFUSED|ECONNRESET|ETIMEDOUT|socket hang up/i;

/**
 * Checks whether an error message means the server isn't responding.
 * @param {string|undefined} message error text from a failed request
 * @returns {boolean} true for refused, reset or timed out connections
 */
export function isNetworkError(message) {
    return NETWORK_ERROR.test(String(message ?? ''));
}

/**
 * Checks whether a URL is on the site or the Strapi API under test.
 * @param {string} url request URL
 * @returns {boolean} true if the URL's host is BASE_URL's or CMS_URL's
 */
export function isSiteUrl(url) {
    const hosts = [process.env.BASE_URL, process.env.CMS_URL].filter(Boolean).map((u) => new URL(u).host);
    return URL.canParse(url) && hosts.includes(new URL(url).host);
}

/**
 * Pauses the test run until the server at `url` responds again.
 * @param {string} reason the network error that caused the pause
 * @param {string} url URL of the request that failed
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
 * Waits while the test run is paused. One worker at a time checks a server
 * that's down, every PROBE_INTERVAL_MS; the others only watch the files.
 * @returns {Promise<void>} resolves when no servers are down, or the outage
 * has lasted longer than MAX_PAUSE_MS
 */
export async function waitWhilePaused() {
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
