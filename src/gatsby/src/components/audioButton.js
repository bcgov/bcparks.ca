import React, { useState, useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faVolumeHigh,
  faChevronUp,
  faChevronDown,
  faXmark,
} from "@fortawesome/free-solid-svg-icons"

import HtmlContent from "./htmlContent"
import AudioPlayer from "./audioPlayer"
import "../styles/audioButton.scss"

function Credit({ audio }) {
  const hasCredit =
    audio?.languageName &&
    audio?.speakerName &&
    audio?.speakerTitle &&
    audio?.firstNationName

  return (
    <div className="credit">
      {audio?.title && (
        <p>
          <b>{audio.title}</b>
        </p>
      )}
      {hasCredit && (
        <p>
          <small>
            Spoken in the {audio.languageName} language, by {audio.speakerName},{" "}
            {audio.speakerTitle}, of the {audio.firstNationName}
          </small>
        </p>
      )}
    </div>
  )
}

export default function AudioButton({ audio }) {
  // refs and states
  const [trackSrc, setTrackSrc] = useState("")
  const [expanded, setExpanded] = useState(false)
  const [isPlayerVisible, setIsPlayerVisible] = useState(false)
  const hasTranscript = audio?.transcript.data?.transcript.length > 0

  // functions
  const stripHtmlTags = html => {
    const div = document.createElement("div")
    div.innerHTML = html
    return div.textContent || div.innerText || ""
  }
  const createVttContent = (transcript, duration) => {
    const plainTextTranscript = stripHtmlTags(transcript)
    return `WEBVTT\n\n1\n00:00:00.000 --> ${duration}\n${plainTextTranscript}`
  }
  const createBlobUrl = content => {
    const blob = new Blob([content], { type: "text/vtt" })
    return URL.createObjectURL(blob)
  }
  // format duration in seconds to HH:MM:SS:mmm
  // e.g. 14.689... > 00:00:14.690
  const formatDuration = time => {
    const minutes = Math.floor(time / 60)
    const seconds = time % 60
    return `00:${minutes.toString().padStart(2, "0")}:
      ${seconds.toFixed(3).padStart(6, "0")}`
  }

  // effects
  useEffect(() => {
    if (hasTranscript && audio?.url) {
      const audioElement = new Audio(audio.url)
      audioElement.addEventListener("loadedmetadata", () => {
        const duration = formatDuration(audioElement.duration)
        const vttContent = createVttContent(
          audio.transcript.data.transcript,
          duration
        )
        const url = createBlobUrl(vttContent)
        setTrackSrc(url)
        return () => {
          URL.revokeObjectURL(url)
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasTranscript, audio?.url])

  return (
    <>
      {/* audio button - display in tldr */}
      {audio.audioClipType === "Park name" && (
        <div className="audio-container park-name">
          <button
            aria-label="Play park name audio"
            onClick={() => setIsPlayerVisible(!isPlayerVisible)}
            className="btn-audio"
          >
            <FontAwesomeIcon icon={faVolumeHigh} />
          </button>
        </div>
      )}
      {/* audio button + credit - display in highlights */}
      {audio.audioClipType !== "Park name" && (
        <div className="audio-container place-name">
          <div className="audio-container--left">
            <button
              aria-label="Play park name audio"
              onClick={() => setIsPlayerVisible(!isPlayerVisible)}
              className="btn-audio"
            >
              <FontAwesomeIcon icon={faVolumeHigh} />
            </button>
          </div>
          <div className="audio-container--right">
            <Credit audio={audio} />
            {hasTranscript && (
              <>
                {expanded && (
                  <div>
                    <p>
                      <small>
                        <b>Transcript</b>
                      </small>
                    </p>
                    <small>
                      <HtmlContent>
                        {audio.transcript.data.transcript}
                      </HtmlContent>
                    </small>
                  </div>
                )}
                <button
                  aria-label={`${expanded ? "Hide" : "Show"} transcript for ${
                    audio.title
                  }`}
                  onClick={() => setExpanded(!expanded)}
                  className="btn btn-link expand-icon transcript-link"
                >
                  {expanded ? (
                    <small>
                      Hide transcript <FontAwesomeIcon icon={faChevronUp} />
                    </small>
                  ) : (
                    <small>
                      Show transcript <FontAwesomeIcon icon={faChevronDown} />
                    </small>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      )}
      {/* audio player */}
      {isPlayerVisible && (
        <div className="audio-player">
          <div className="audio-player-container">
            <div className="audio-player-container--left">
              <Credit audio={audio} />
            </div>
            <div className="audio-player-container--right">
              <AudioPlayer src={audio.url} trackSrc={trackSrc} />
            </div>
          </div>
          <button
            aria-label="Close audio player"
            onClick={() => setIsPlayerVisible(false)}
            className="btn btn-x"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
      )}
    </>
  )
}
