import React, { useState, useEffect, useRef, useMemo } from "react"
import { hydrateRoot, createRoot } from "react-dom/client"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons"
import HtmlContent from "../htmlContent"
import AudioButton from "../audioButton"
import * as cheerio from "cheerio"

export default function ParkOverview({ description, type, audioClips, activeAudio, setActiveAudio }) {
  const [expanded, setExpanded] = useState(false)
  const [height, setHeight] = useState(0)
  const [sectionHeight, setSectionHeight] = useState(0)
  const ref = useRef(null)
  const rootRef = useRef(null)
  const isLong = height >= 300
  const isMedium = height > 260 && height < 300

  const $ = cheerio.load(description)
  $("a").attr("tabindex", "-1")
  const collapsedDescription = $.html()
  const hasHr = $("hr").length > 0
  const hrAtEnd = description.trim().endsWith("<hr>")
  const hasAudioClipPlaceholder = $(".audio-clip").length > 0
  // Check if array contains a "highlights"
  const hasHighlights = (array) => array?.includes("highlights") || false
  // Filter audio clips if it has a "highlights" displayLocation
  const audioClip = useMemo(() => {
    return audioClips?.filter(audio => hasHighlights(audio.displayLocation?.strapi_json_value)) || []
  }, [audioClips])
  // Set the expand condition if 
  // 1 - the description is long or has a <hr> tag
  // 2 - the description is NOT medium
  // 3 - the <hr> tag is NOT at the end of the description or audio clip is present
  const hasExpandCondition = 
    (hasHr || isLong) && !isMedium && (!hrAtEnd || audioClip.length > 0)

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
    let isUnmounting = false
    const audioButtonElement = (
      <AudioButton
        audio={audioClip[0]}
        location="highlights"
        activeAudio={activeAudio}
        setActiveAudio={setActiveAudio}
      />
    )

    const setupAudio = () => {
      if (isUnmounting) return
      if (hasAudioClipPlaceholder && audioClip.length > 0) {
        const placeholder = document.getElementsByClassName("audio-clip")[0]
        if (placeholder) {
          if (rootRef.current) {
            rootRef.current.render(audioButtonElement)
          } else {
            // check if the placeholder has been hydrated
            if (placeholder.hasAttribute("data-reactroot")) {
              rootRef.current = hydrateRoot(
                placeholder,
                audioButtonElement
              )
            // create a new root if the placeholder hasn't been hydrated
            } else {
              rootRef.current = createRoot(placeholder)
              rootRef.current.render(audioButtonElement)
            }
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
        if (rootRef.current) {
          rootRef.current.unmount()
          rootRef.current = null
        }
      })
    }
  }, [hasAudioClipPlaceholder, audioClip, activeAudio, setActiveAudio, expanded])

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
          <AudioButton
            audio={audioClip[0]}
            location="highlights"
            activeAudio={activeAudio}
            setActiveAudio={setActiveAudio}
          />
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
