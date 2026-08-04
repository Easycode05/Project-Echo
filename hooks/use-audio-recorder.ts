'use client';

import { useState, useCallback } from 'react';

export function useAudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  
  // Since we are no longer tapping into the mic for performance reasons, 
  // we just return a static 0. The Orb handles its own pure CSS animations now.
  const audioLevel = 0; 
  const audioUrl = null;
  const hasPermission = true;

  const startRecording = useCallback(async () => {
    setIsRecording(true);
  }, []);

  const stopRecording = useCallback((): Promise<string | null> => {
    return new Promise((resolve) => {
      setIsRecording(false);
      resolve(null);
    });
  }, []);

  return {
    isRecording,
    audioLevel,
    audioUrl,
    hasPermission,
    startRecording,
    stopRecording,
  };
}
