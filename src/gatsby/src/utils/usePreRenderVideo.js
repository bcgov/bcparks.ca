import { useState, useEffect, useCallback } from "react";
import * as cheerio from "cheerio";

const slugify = require("slugify");

/**
 * Custom hook that processes HTML content containing YouTube video embeds.
 * Fetches video titles from YouTube via noembed API and adds them as
 * id and title attributes to iframe elements for accessibility and analytics tracking.
 *
 * @param {string} content - HTML content containing figure.media elements with YouTube iframes
 * @returns {Object} - { htmlContent: processed HTML with video titles, or original content if no videos found }
 */
export const usePreRenderVideo = (content = "") => {
  // Processed HTML content with video titles added, or original content
  const [htmlContent, setHtmlContent] = useState(content);

  /**
   * Fetches video titles for all YouTube iframes found in content.
   * Extracts video IDs from iframe src URLs and calls noembed API for titles.
   * @returns {Promise<string[]>} Array of video titles (with null for failed requests)
   */
  const fetchVideoTitles = useCallback(async () => {
    if (!content) return [];

    // Parse the HTML content to find video elements
    const $ = cheerio.load(content);
    const mediaElements = $("figure.media");
    const fetchPromises = [];

    // Process each media element to extract YouTube video URLs
    mediaElements.each((index, element) => {
      const $element = $(element);
      const iframeSrc = $element.find("iframe").attr("src");

      // Extract YouTube video ID from URL (last segment after splitting by "/")
      const urlSegments = iframeSrc?.split("/");
      const videoId = urlSegments?.at(-1);

      if (videoId) {
        // Fetch video title from noembed API (YouTube metadata service)
        const titlePromise = fetch(
          `https://noembed.com/embed?dataType=json&url=https://www.youtube.com/watch?v=${videoId}`
        )
        .then(response => response.json())
        .then(data => data.title)
        .catch(() => null); // Return null for failed requests to maintain array indices

        fetchPromises.push(titlePromise);
      }
    });

    // Wait for all API calls to complete and return results
    // Note: Array may have null values for failed requests to preserve iframe order
    return await Promise.all(fetchPromises);
  }, [content]);

  /**
   * Processes content by fetching video titles and updating HTML.
   * Updates htmlContent state - either with processed content or original content.
   * Runs when content changes.
   */
  useEffect(() => {
    const processContent = async () => {
      if (!content) return;

      // Fetch video titles
      const videoTitles = await fetchVideoTitles();

      // Skip processing if no video titles found
      if (!videoTitles.length) return;

      // Parse content and apply video titles to iframes
      const $ = cheerio.load(content);

      $("iframe").each((index, iframe) => {
        const videoTitle = videoTitles[index];

        if (videoTitle) {
          // Create ID slug from video title for analytics tracking
          $(iframe).attr("id", slugify(videoTitle, { lower: true }));

          // Add title attribute for accessibility (screen readers)
          $(iframe).attr("title", videoTitle);
        }
      });

      // Update state with the modified HTML
      setHtmlContent($.html());
    };

    processContent();
  }, [content, fetchVideoTitles]);

  return {
    htmlContent
  };
};
