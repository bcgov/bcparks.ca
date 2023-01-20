import { useState, useEffect } from "react";
import * as cheerio from "cheerio";

export const useContent = (contentHtml) => {
  const [title, setTitle] = useState("");
  let video_id;
  let media; 

  if(contentHtml?.introHtml){
    let $ =  cheerio.load(contentHtml?.introHtml);
    let getIframe = $("iframe");
    media = $(".media");

    const getURL = getIframe.attr("src");

    const srcId = getURL?.split("/");
    video_id = srcId && srcId[srcId?.length - 1];
  }

  useEffect(() => {
    if (video_id) {
      const vidurl = `https://www.youtube.com/watch?v=${video_id}`;

      fetch(`https://noembed.com/embed?dataType=json&url=${vidurl}`)
        .then((response) => response.json())
        .then((data) => {
            setTitle(data.title);
        })
        .catch((error) => console.error(error));
    }
  }, [video_id]);

  if (title) {
    getIframe.attr("id", title);
  }

  let content = null;

  if(contentHtml?.introHtml && media){
    const start = contentHtml?.introHtml.indexOf("<figure");
    const end = contentHtml?.introHtml.indexOf("</figure>");

    const videoMarkup = contentHtml?.introHtml.slice(start, end);

    content =
      start >= 0 &&
      end >= 0 &&
      contentHtml?.introHtml.replace(videoMarkup, media.html());
  }

  return { introHtml : content };
};
