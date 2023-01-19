import { useState, useEffect } from "react";
import * as cheerio from "cheerio";

export const useContent = (contentHtml) => {
  const { introHtml={} } = contentHtml;
  const [title, setTitle] = useState("");
  let $ = cheerio.load(introHtml);

  let getIframe = $("iframe");
  let media = $(".media");

  const getURL = getIframe.attr("src");

  const srcId = getURL?.split("/");
  const id_end = srcId && srcId[srcId?.length - 1];

  useEffect(() => {
    if (id_end) {
      const vidurl = `https://www.youtube.com/watch?v=${id_end}`;

      fetch(`https://noembed.com/embed?dataType=json&url=${vidurl}`)
        .then((response) => response.json())
        .then((data) => {
            setTitle(data.title);
        })
        .catch((error) => console.error(error));
    }
  }, [id_end]);

  if (title) {
    getIframe.attr("id", title);
  }

  const start = introHtml.indexOf("<figure");
  const end = introHtml.indexOf("</figure>");

  const videoMarkup = introHtml.slice(start, end);

  const content =
    start >= 0 &&
    end >= 0 &&
    introHtml.replace(videoMarkup, media.html());

  return { introHtml : content };
};
