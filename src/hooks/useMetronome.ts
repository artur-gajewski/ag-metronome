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
  const timerRef = useRef<number | null>(null);
  const currentBeatRef = useRef<number>(0);

  // Keep latest callback/state values in refs so the timer closure never goes stale
  const isMutedRef = useRef(isMuted);
  const visualAidRef = useRef(visualAid);
  const onBeatChangeRef = useRef(onBeatChange);
  const onFlashRef = useRef(onFlash);
  const playClickRef = useRef(playClick);

  useEffect(() => { isMutedRef.current = isMuted; }, [isMuted]);
  useEffect(() => { visualAidRef.current = visualAid; }, [visualAid]);
  useEffect(() => { onBeatChangeRef.current = onBeatChange; }, [onBeatChange]);
  useEffect(() => { onFlashRef.current = onFlash; }, [onFlash]);
  useEffect(() => { playClickRef.current = playClick; }, [playClick]);

  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    const interval = (60 / bpm) * 1000;
    // expected tracks when the next tick should ideally fire, allowing drift correction
    let expected = performance.now() + interval;
    currentBeatRef.current = 0;

    // Fire the first beat immediately
    onBeatChangeRef.current(0);
    playClickRef.current(true, isMutedRef.current);
    if (visualAidRef.current) onFlashRef.current();

    const tick = () => {
      const beat = currentBeatRef.current;
      onBeatChangeRef.current(beat);
      playClickRef.current(beat === 0, isMutedRef.current);
      if (beat === 0 && visualAidRef.current) onFlashRef.current();

      currentBeatRef.current = (currentBeatRef.current + 1) % measureTop;

      // Correct for drift: schedule the next tick earlier if we ran late
      const drift = performance.now() - expected;
      expected += interval;
      timerRef.current = window.setTimeout(tick, Math.max(0, interval - drift));
    };

    currentBeatRef.current = 1;
    timerRef.current = window.setTimeout(tick, interval);

    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isPlaying, bpm, measureTop]);
};
