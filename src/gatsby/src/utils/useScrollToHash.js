import { useEffect } from "react";

/**
 * Scrolls to the element matching the URL hash once the page content is ready.
 *
 * @param {boolean} isReady - true once async page data has finished loading
 * @param {number} delay - milliseconds between attempts to find the target and scroll
 * @param {number} maxAttempts - number of attempts before giving up
 * @returns {void}
 */
export const useScrollToHash = (isReady, delay = 300, maxAttempts = 2) => {
  useEffect(() => {
    // Do nothing if the content isn't loaded or there's no hash in the URL
    if (!isReady || !window.location.hash) return;

    // The target may not exist until a later render, so retry a few times
    let attempts = 0;
    const timer = setInterval(() => {
      attempts += 1;

      try {
        // Find the element corresponding to the hash in the URL
        const element = document.getElementById(
          decodeURIComponent(window.location.hash.slice(1)),
        );

        // If the element exists, scroll to it;
        // otherwise, retry until max attempts is reached
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
          clearInterval(timer);
        } else if (attempts >= maxAttempts) {
          clearInterval(timer);
        }
      } catch {
        // Malformed fragment; give up rather than throwing on every tick
        clearInterval(timer);
      }
    }, delay);

    return () => clearInterval(timer);
  }, [isReady, delay, maxAttempts]);
};
