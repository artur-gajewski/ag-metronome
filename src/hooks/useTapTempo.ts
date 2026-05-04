import { useRef, useCallback } from "react";

export const useTapTempo = (setBpm: (bpm: number | ((prev: number) => number)) => void) => {
  const tapTimesRef = useRef<number[]>([]);
  const lastTapRef = useRef<number>(0);

  const handleTap = useCallback(() => {
    const now = performance.now();
    const MIN_INTERVAL = 200;
    const MAX_INTERVAL = 1500;
    const sinceLast = now - lastTapRef.current;

    if (sinceLast > 0 && sinceLast < MIN_INTERVAL - 20) {
      lastTapRef.current = now;
      return;
    }

    if (sinceLast > 2000) {
      tapTimesRef.current = [];
    }

    tapTimesRef.current.push(now);

    const limit = tapTimesRef.current.length < 10 ? 10 : 100;
    if (tapTimesRef.current.length > limit) {
      tapTimesRef.current = tapTimesRef.current.slice(-limit);
    }

    lastTapRef.current = now;

    if (tapTimesRef.current.length >= 2) {
      const times = tapTimesRef.current;
      const intervals: number[] = [];

      for (let i = 1; i < times.length; i++) {
        const iv = times[i] - times[i - 1];
        if (iv >= MIN_INTERVAL && iv <= MAX_INTERVAL) {
          intervals.push(iv);
        }
      }

      if (intervals.length === 0) return;

      let bpmCalc: number;
      if (intervals.length === 1) {
        bpmCalc = 60000 / intervals[0];
      } else {
        const bpms = intervals.map((iv) => 60000 / iv);
        if (bpms.length >= 6) {
          const sorted = [...bpms].sort((a, b) => a - b);
          sorted.shift();
          sorted.pop();
          bpmCalc = sorted.reduce((a, b) => a + b, 0) / sorted.length;
        } else if (bpms.length >= 3) {
          bpmCalc = bpms.reduce((a, b) => a + b, 0) / bpms.length;
        } else {
          bpmCalc = bpms[bpms.length - 1];
        }
      }

      const clamped = Math.min(300, Math.max(40, Math.round(bpmCalc)));
      setBpm((prev) => Math.round(prev * 0.3 + clamped * 0.7));
    }
  }, [setBpm]);

  return { handleTap };
};
