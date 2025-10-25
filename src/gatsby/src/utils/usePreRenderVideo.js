import { useState, useEffect, useCallback, useRef } from "react";
import * as cheerio from "cheerio";

const slugify = require("slugify");

export const usePreRenderVideo = (content) => {
  const [list, setList] = useState([]);
  const [htmlContent, setHtmlContent] = useState('');
  const $ref = useRef(null);

  const fetchData = useCallback(async () => {
    if (content) {
      $ref.current = cheerio.load(content);
      const media = $ref.current("figure.media");

      setList([]);
      const fetchPromises = [];

      media.each((index, el) => {
        const $el = cheerio.load(el);
        const getIframe = $el("iframe").attr("src")?.split("/");
        const url = getIframe && getIframe[getIframe?.length - 1];

        if (url) {
          const fetchPromise = fetch(
            `https://noembed.com/embed?dataType=json&url=https://www.youtube.com/watch?v=${url}`
          )
          .then(response => response.json())
          .then(data => data.title);

          fetchPromises.push(fetchPromise);
        }
      });

      // Wait for all promises and set the list
      const titles = await Promise.all(fetchPromises);
      setList(titles);
    }
  }, [content]);

  useEffect(() => {
    if (content) fetchData();
  }, [content, fetchData]);

  useEffect(() => {
    if (content && list.length) {
      const $ = cheerio.load(content);

      $("iframe").each((index, video) => {
        const title = list[index];
        if (title) {
          $(video).attr("id", slugify(title, { lower: true }));
          $(video).attr("title", title);
        }
      });

      setHtmlContent($.html());
    }
  }, [content, list]);

  return { htmlContent: htmlContent || null };
};
