import { useRef, useCallback } from "react";

export const useAudioClick = () => {
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playClick = useCallback((isFirstBeat: boolean, isMuted: boolean) => {
    if (isMuted) return;

    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }

    const ctx = audioCtxRef.current;
    if (ctx.state === "suspended") ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    // Accented beat (stronger tone)
    osc.frequency.value = isFirstBeat ? 880 : 440;

    gain.gain.setValueAtTime(1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.1);
  }, []);

  return { playClick };
};
