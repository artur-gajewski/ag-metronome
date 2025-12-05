import { useState, useCallback } from "react";
import "./App.css";
import { BPMSlider, BeatIndicator, ControlButtons, KeyboardHints } from "./components";
import { useAudioClick, useTapTempo, useMetronome, useKeyboardControls } from "./hooks";
import { AVAILABLE_BEATS, BPM_MIN, BPM_MAX, type Measure } from "./types";

function App() {
  const [bpm, setBpm] = useState<number>(100);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentBeat, setCurrentBeat] = useState<number>(-1);
  const [flash, setFlash] = useState(false);
  const [visualAid, setVisualAid] = useState(false);
  const [measure, setMeasure] = useState<Measure>({ top: 4 });

  const { playClick } = useAudioClick();
  const { handleTap } = useTapTempo(setBpm);

  const handleFlash = useCallback(() => {
    setFlash(true);
    setTimeout(() => setFlash(false), 100);
  }, []);

  const handleBeatChange = useCallback((beat: number) => {
    setCurrentBeat(beat);
  }, []);

  useMetronome({
    isPlaying,
    bpm,
    measureTop: measure.top,
    visualAid,
    isMuted,
    onBeatChange: handleBeatChange,
    onFlash: handleFlash,
    playClick,
  });

  const toggleBeats = useCallback(() => {
    setMeasure((prev) => {
      const idx = AVAILABLE_BEATS.findIndex((m) => m.top === prev.top);
      return AVAILABLE_BEATS[(idx + 1) % AVAILABLE_BEATS.length];
    });
    setCurrentBeat(-1);
    setIsPlaying(false);
  }, []);

  const handlePlayToggle = useCallback(() => {
    setIsPlaying((prev) => !prev);
    setCurrentBeat(-1);
  }, []);

  const handleTapTempo = useCallback(() => {
    handleTap();
    setCurrentBeat(-1);
    setIsPlaying(false);
  }, [handleTap]);

  useKeyboardControls({
    onPlayToggle: handlePlayToggle,
    onMuteToggle: () => setIsMuted((prev) => !prev),
    onVisualAidToggle: () => setVisualAid((prev) => !prev),
    onTap: handleTapTempo,
    onBeatsToggle: toggleBeats,
    onBpmIncrease: () => setBpm((prev) => Math.min(prev + 1, BPM_MAX)),
    onBpmDecrease: () => setBpm((prev) => Math.max(prev - 1, BPM_MIN)),
  });

  return (
    <div className={`container ${flash ? "flash" : ""}`}>
      <div className="content">
        <BPMSlider bpm={bpm} onBpmChange={setBpm} onStop={() => setIsPlaying(false)} />

        <BeatIndicator measureTop={measure.top} currentBeat={currentBeat} />

        <ControlButtons
          isPlaying={isPlaying}
          isMuted={isMuted}
          visualAid={visualAid}
          measureTop={measure.top}
          onPlayToggle={handlePlayToggle}
          onMuteToggle={() => setIsMuted((m) => !m)}
          onVisualAidToggle={() => setVisualAid((v) => !v)}
          onBeatsToggle={toggleBeats}
          onTap={handleTapTempo}
        />

        <KeyboardHints />
      </div>
    </div>
  );
}

export default App;
