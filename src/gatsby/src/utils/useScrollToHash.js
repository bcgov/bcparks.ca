import { useEffect } from "react";

/**
 * Scrolls to the element matching the URL hash once the page content is ready.
 *
 * @param {boolean} isReady - true once dynamically loaded content has rendered
 * @param {number} delay - milliseconds to wait before scrolling, to let layout settle
 * @returns {void}
 */
export const useScrollToHash = (isReady, delay = 500) => {
  useEffect(() => {
    // Do nothing if the content isn't loaded or there's no hash in the URL
    if (!isReady || !window.location.hash) return;

    // Scroll to the target after a delay; it may not exist until a later render
    const timer = setTimeout(() => {
      const element = document.getElementById(
        decodeURIComponent(window.location.hash.slice(1)),
      );

      element?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, delay);

    return () => clearTimeout(timer);
  }, [isReady, delay]);
};
