"use client"

import React, { useCallback } from "react";
import { ReactMic } from 'react-mic';
import styles from "./page.module.sass";

const RecordStateObject = {
  notStarted: 0,
  recording: 1,
  paused: 2,
} as const;
type RecordStateType = typeof RecordStateObject[keyof typeof RecordStateObject];

export default function Home() {
  const [isRecording, setIsRecording] = React.useState<RecordStateType>(RecordStateObject.notStarted);
  const buttonOnClick = useCallback(() => {
    setIsRecording((prev) => {
      if (prev === RecordStateObject.notStarted) return RecordStateObject.recording;
      if (prev === RecordStateObject.recording) return RecordStateObject.paused;
      if (prev === RecordStateObject.paused) return RecordStateObject.recording;
      return prev;
    })
  }, []);

  const buttonText = React.useMemo(() => {
    if (isRecording === RecordStateObject.notStarted) return "録音開始";
    if (isRecording === RecordStateObject.recording) return "一時停止";
    if (isRecording === RecordStateObject.paused) return "再開";
    return "";
  }, [isRecording]);
  
  return (
    <div className={styles.parentNode}>
      <ReactMic
        record={isRecording === RecordStateObject.recording}
        pause={isRecording === RecordStateObject.paused}
        visualSetting="sinewave"
        mimeType="audio/webm"
        echoCancellation={true} 
        autoGainControl={true}  
        noiseSuppression={true} 
      />
      <button onClick={buttonOnClick}>{buttonText}</button>
    </div>
  )
}
