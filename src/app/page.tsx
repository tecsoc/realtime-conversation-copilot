"use client"

import React, { useCallback, useEffect, useRef } from "react";
import styles from "./page.module.sass";

const RecordStateObject = {
  notStarted: 0,
  recording: 1,
  paused: 2,
  reRecording: 3,
} as const;
type RecordStateType = typeof RecordStateObject[keyof typeof RecordStateObject];

const userMediaSettings = {
  audio: true,
};

export default function Home() {
  const [isRecording, setIsRecording] = React.useState<RecordStateType>(RecordStateObject.notStarted);
  const audioRef = useRef<HTMLAudioElement>();
  const mediaRecorderRef = useRef<MediaRecorder>();

  const setAudioref = useCallback((node: HTMLAudioElement) => {
    if(!node) return;
    audioRef.current = node;
  }, []);

  const buttonOnClick = useCallback(() => {
    setIsRecording((prev) => {
      if (prev === RecordStateObject.notStarted) return RecordStateObject.recording;
      if (prev === RecordStateObject.recording || prev === RecordStateObject.reRecording) return RecordStateObject.paused;
      if (prev === RecordStateObject.paused) return RecordStateObject.reRecording;
      return prev;
    })
  }, []);

  const buttonText = React.useMemo(() => {
    if (isRecording === RecordStateObject.notStarted) return "録音開始";
    if (isRecording === RecordStateObject.recording || RecordStateObject.reRecording) return "一時停止";
    if (isRecording === RecordStateObject.paused) return "再開";
    return "";
  }, [isRecording]);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia(userMediaSettings)
      .then((stream) => {
        if (isRecording === RecordStateObject.paused) {
          stream.getTracks().forEach((track) => track.enabled = false);
          audioRef.current?.pause();
          return;
        } else if (isRecording === RecordStateObject.reRecording) {
          stream.getTracks().forEach((track) => track.enabled = true);
          audioRef.current?.play();
          return;
        }
        if (audioRef.current) {
          audioRef.current.srcObject = stream;
        }
      })
  }, [isRecording]);
  
  return (
    <div className={styles.parentNode}>
      <button onClick={buttonOnClick}>{buttonText}</button>
      <audio ref={setAudioref} autoPlay controls></audio>
    </div>
  )
}
