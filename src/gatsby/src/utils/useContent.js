import { useState, useEffect, useCallback } from "react";
import * as cheerio from "cheerio";

export const useContent = (contentHtml) => {
  const [list, setList] = useState([]);
  const [htmlContent, setHtmlContent] = useState('');

  let $;
  const content = contentHtml?.introHtml.data.introHtml;

  useEffect(() => {
    if (content) {
      $ = cheerio.load(content);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchData = useCallback(() => {
    if (content) {
      const media = $("figure.media");

      return media?.map(async (index, el) => {
        const $ = cheerio.load(el);
        const getIframe = $("iframe").attr("src")?.split("/");

        const v_url = getIframe && getIframe[getIframe?.length - 1];

        const fetchVideo = await fetch(
          `https://noembed.com/embed?dataType=json&url=${`https://www.youtube.com/watch?v=${v_url}`}`
        );
        const response = await fetchVideo.json();

        setList((prev) =>
          prev ? [...prev, response.title] : [response.title]
        );
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  useEffect(() => {
    if (content) fetchData();

    if (content && list.length) {
      const $ = cheerio.load(content);
      // const media = $("figure.media");
      // media.map((index, el) => {
      //   const $ = cheerio.load(el);
      //   $("iframe").attr("id", list[index]);
      // })
      // setHtmlContent($?.html())
      // console.log("htmlContent",htmlContent)

      $("body")
        .toArray()
        .map((element) => {
          return $(element)
            .children("figure.media")
            .each((index, v) => {
              console.log("v", v)
              const findTitleByIndex = list.filter((e, ind) => +ind === +index);
              // console.log("find",findTitleByIndex)

              $(v).attr("id", findTitleByIndex);
              // console.log("v", v)
            });
        });
        setHtmlContent($?.html())
    }
  }, [content, fetchData, list]);

  console.log("htmlContent",htmlContent);

  return { introHtml: htmlContent || null };
};

