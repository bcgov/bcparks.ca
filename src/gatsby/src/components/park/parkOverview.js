import React, { useState, useEffect, useRef, useMemo } from "react"
import { hydrateRoot, createRoot } from "react-dom/client"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons"
import HtmlContent from "../htmlContent"
import AudioButton from "../audioButton"
import * as cheerio from "cheerio"

export default function ParkOverview({ description, type, audioClips }) {
  const [expanded, setExpanded] = useState(false)
  const [height, setHeight] = useState(0)
  const [sectionHeight, setSectionHeight] = useState(0)
  const ref = useRef(null)
  const isLong = height >= 300
  const isMedium = height > 260 && height < 300

  const $ = cheerio.load(description)
  $("a").attr("tabindex", "-1")
  const collapsedDescription = $.html()
  const hasHr = $("hr").length > 0
  const hrAtEnd = description.trim().endsWith("<hr>")
  const hasExpandCondition = (hasHr || isLong) && !isMedium && !hrAtEnd
  const hasAudioClipPlaceholder = $(".audio-clip").length > 0
    // Check if array contains a "highlights"
    const hasHighlights = (array) => array?.includes("highlights") || false
    // Filter audio clips if it has a "highlights" displayLocation
    const audioClip = useMemo(() => {
      return audioClips?.filter(audio => hasHighlights(audio.displayLocation?.strapi_json_value)) || []
    }, [audioClips])

  useEffect(() => {
    if (!hasHr && ref.current.clientHeight > 260) {
      setHeight(ref.current.clientHeight)
    }
  }, [hasHr, expanded])

  useEffect(() => {
    const h2 = document.querySelector("h2.section-heading")
    const hr = document.querySelector("hr")
    // height from the <h2> to the <hr>
    const height =
      hr?.getBoundingClientRect().top - h2.getBoundingClientRect().top
    setSectionHeight(height)
  }, [])

  // inject audio button into the placeholder
  // the placeholder needs to be hydrated since audio button has event listeners
  useEffect(() => {
    if (typeof window === "undefined") return
    let root = null
    let isUnmounting = false

    const setupAudio = () => {
      if (isUnmounting) return
      // check if the placeholder exists and if there is an audio clip
      if (hasAudioClipPlaceholder && audioClip.length > 0) {
        const placeholder = document.getElementsByClassName("audio-clip")[0]
        if (placeholder) {
          placeholder.innerHTML = ""
          // check if the placeholder has been hydrated
          if (placeholder.hasAttribute("data-reactroot")) {
            root = hydrateRoot(
              placeholder,
              <AudioButton audio={audioClip[0]} location="highlights" />
            )
          // create a new root if the placeholder hasn't been hydrated
          } else {
            root = createRoot(placeholder)
            root.render(<AudioButton audio={audioClip[0]} location="highlights" />)
          }
        }
      }
    }
    const timer = setTimeout(setupAudio, 0)
    // cleanup function
    return () => {
      isUnmounting = true
      clearTimeout(timer)
      // unmount the root if it exists
      requestAnimationFrame(() => {
        if (root) {
          root.unmount()
        }
      })
    }
  }, [hasAudioClipPlaceholder, audioClip])

  return (
    <div id="highlights" className="anchor-link">
      <div
        ref={ref}
        className={`expandable-description ${
          expanded ? "expanded" : "collapsed"
        } ${hasExpandCondition && "gradient"}`}
        style={{
          maxHeight: expanded
            ? "none"
            : `${hasHr ? sectionHeight : isLong ? 260 : 300}px`,
        }}
      >
        {/* id="park-overview-container" should be removed once it's removed from the contents */}
        <h2 id="park-overview-container" className="section-heading">
          Highlights in this {type}
        </h2>
        {/* let voiceover skip reading content if it is not expanded */}
        <HtmlContent ariaHidden={hasExpandCondition && !expanded} className="park-overview-html">
          {hasExpandCondition ? (expanded ? description : collapsedDescription) : description}
        </HtmlContent>
        {/* display audio button at the bottom if it doesn't have the placeholder */}
        {!hasAudioClipPlaceholder && audioClip.length > 0 ? (
          <AudioButton audio={audioClip[0]} location="highlights" />
        ) : (
          ""
        )}
      </div>
      {hasExpandCondition && (
        <button
          className="btn btn-link park-overview-link expand-icon"
          aria-expanded={expanded}
          aria-label={
            expanded ? "Show fewer highlights" : "Show more highlights"
          }
          onClick={() => {
            setExpanded(!expanded)
          }}
        >
          {expanded ? (
            <>
              Show less <FontAwesomeIcon icon={faChevronUp} />
            </>
          ) : (
            <>
              Show more <FontAwesomeIcon icon={faChevronDown} />
            </>
          )}
        </button>
      )}
    </div>
  )
}
