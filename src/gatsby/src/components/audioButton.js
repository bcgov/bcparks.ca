import React, { useState, useEffect, useRef } from "react"
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

export default function AudioButton({ audio }) {
  // refs and states
  const audioRef = useRef(null)
  const [trackSrc, setTrackSrc] = useState("")
  const [expanded, setExpanded] = useState(false)
  const [isPlayerVisible, setIsPlayerVisible] = useState(false)

  // functions
  const createVttContent = transcript => {
    return `WEBVTT\n\n1\n00:00:00.000 --> 00:00:10.000\n${transcript}`
  }
  const createBlobUrl = content => {
    const blob = new Blob([content], { type: "text/vtt" })
    return URL.createObjectURL(blob)
  }
  const handlePlay = () => {
    setIsPlayerVisible(true)
    if (audioRef.current) {
      audioRef.current.play()
    }
  }

  // effects
  useEffect(() => {
    if (audio?.transcript.data?.transcript.length) {
      const vttContent = createVttContent(audio.transcript.data.transcript)
      const url = createBlobUrl(vttContent)
      setTrackSrc(url)
      return () => {
        URL.revokeObjectURL(url)
      }
    }
  }, [audio?.transcript.data?.transcript])

  return (
    <>
      {audio.audioClipType === "Park name" && (
        <div className="audio-container park-name">
          <button
            aria-label="Play park name audio"
            onClick={handlePlay}
            className="btn-audio"
          >
            <FontAwesomeIcon icon={faVolumeHigh} />
          </button>
        </div>
      )}
      {audio.audioClipType === "Place name" && (
        <div className="audio-container place-name">
          <div className="audio-container--left">
            <button
              aria-label="Play park name audio"
              onClick={handlePlay}
              className="btn-audio"
            >
              <FontAwesomeIcon icon={faVolumeHigh} />
            </button>
          </div>
          <div className="audio-container--right">
            <p>
              <b>{audio.title}</b>
            </p>
            <p>
              <small>
                Spoken in the {audio.languageName} language, by{" "}
                {audio.speakerName}, {audio.speakerTitle}, of the{" "}
                {audio.firstNationName}
              </small>
            </p>
            {expanded && (
              <div className="mb-3">
                <p>
                  <small>
                    <b>Transcript</b>
                  </small>
                </p>
                <small>
                  <HtmlContent>{audio.transcript.data.transcript}</HtmlContent>
                </small>
              </div>
            )}
            {audio.transcript && (
              <button
                aria-label={
                  expanded
                    ? `Hide transcript for ${audio.title}`
                    : `Show transcript for ${audio.title}`
                }
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
            )}
          </div>
        </div>
      )}
      {isPlayerVisible && (
        <div className="audio-player">
          <div className="audio-player-container">
            <div className="audio-player-container--left">
              <p>
                <b>{audio.title}</b>
              </p>
              <p>
                <small>
                  Spoken in the {audio.languageName} language, by{" "}
                  {audio.speakerName}, {audio.speakerTitle}, of the{" "}
                  {audio.firstNationName}
                </small>
              </p>
            </div>
            <div className="audio-player-container--right">
              <AudioPlayer src={audio.url} />
            </div>
          </div>
          <button
            aria-label="Close audio player"
            className="btn btn-x"
            onClick={() => setIsPlayerVisible(false)}
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
      )}
    </>
  )
}
