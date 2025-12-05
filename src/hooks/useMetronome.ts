import { useEffect, useRef } from "react";

interface UseMetronomeProps {
  isPlaying: boolean;
  bpm: number;
  measureTop: number;
  visualAid: boolean;
  isMuted: boolean;
  onBeatChange: (beat: number) => void;
  onFlash: () => void;
  playClick: (isFirstBeat: boolean, isMuted: boolean) => void;
}

export const useMetronome = ({
  isPlaying,
  bpm,
  measureTop,
  visualAid,
  isMuted,
  onBeatChange,
  onFlash,
  playClick,
}: UseMetronomeProps) => {
  const intervalRef = useRef<number | null>(null);
  const isMutedRef = useRef(isMuted);
  const visualAidRef = useRef(visualAid);
  const currentBeatRef = useRef<number>(0);

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  useEffect(() => {
    visualAidRef.current = visualAid;
  }, [visualAid]);

  useEffect(() => {
    if (isPlaying) {
      const interval = (60 / bpm) * 1000;

      currentBeatRef.current = 0;
      onBeatChange(0);
      playClick(true, isMutedRef.current);

      if (visualAidRef.current) {
        onFlash();
      }

      intervalRef.current = window.setInterval(() => {
        currentBeatRef.current = (currentBeatRef.current + 1) % measureTop;
        const next = currentBeatRef.current;

        if (next === 0 && visualAidRef.current) {
          onFlash();
        }

        playClick(next === 0, isMutedRef.current);
        onBeatChange(next);
      }, interval);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, bpm, measureTop]);
};
