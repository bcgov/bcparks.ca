import React, { useState, useRef, useEffect } from "react"
import { Dropdown, ProgressBar } from "react-bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faPlay,
  faPause,
  faVolumeHigh,
  faVolumeMute,
  faEllipsisVertical,
} from "@fortawesome/free-solid-svg-icons"

const CustomToggle = React.forwardRef(({ onClick }, ref) => (
  <button
    ref={ref}
    onClick={e => {
      e.preventDefault()
      onClick(e)
    }}
    className="btn btn-ellipsis custom-dropdown-toggle"
  >
    <FontAwesomeIcon icon={faEllipsisVertical} />
  </button>
))

const AudioPlayer = ({ src }) => {
  // refs and states
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [showVolumeControl, setShowVolumeControl] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)

  // functions
  const togglePlayPause = () => {
    const audio = audioRef.current
    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }
  const handleVolumeChange = e => {
    const audio = audioRef.current
    audio.volume = e.target.value
    setVolume(audio.volume)
  }
  // const handlePlaybackRateChange = rate => {
  //   const audio = audioRef.current
  //   audio.playbackRate = rate
  //   setPlaybackRate(rate)
  // }
  const formatTime = time => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  // effects
  useEffect(() => {
    const audio = audioRef.current
    const setAudioData = () => {
      setDuration(audio.duration)
    }
    const setAudioTime = () => {
      setCurrentTime(audio.currentTime)
    }
    audio.addEventListener("loadeddata", setAudioData)
    audio.addEventListener("timeupdate", setAudioTime)
    return () => {
      audio.removeEventListener("loadeddata", setAudioData)
      audio.removeEventListener("timeupdate", setAudioTime)
    }
  }, [])

  return (
    <div className="audio-player-controls">
      <audio ref={audioRef} src={src} />
      {/* <div className="controls"> */}
      <button onClick={togglePlayPause} className="btn btn-play">
        <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
      </button>
      <div className="time">
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>
      <ProgressBar
        now={(currentTime / duration) * 100}
        className={`show-volume--${showVolumeControl}`}
      />
      <div className="volume">
        <button
          className="btn btn-volume"
          onClick={() => setShowVolumeControl(!showVolumeControl)}
        >
          <FontAwesomeIcon icon={volume > 0 ? faVolumeHigh : faVolumeMute} />
        </button>
        {showVolumeControl && (
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
          />
        )}
      </div>
      <Dropdown>
        <Dropdown.Toggle id="speed-dropdown" as={CustomToggle} />
        <Dropdown.Menu>
          <Dropdown.Header>Playback Speed</Dropdown.Header>
          {[0.5, 1, 1.5, 2].map(speed => (
            <Dropdown.Item
              key={speed}
              onClick={() => {
                audioRef.current.playbackRate = speed
                setPlaybackRate(speed)
              }}
              active={playbackRate === speed}
            >
              {speed}x
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  )
}

export default AudioPlayer
