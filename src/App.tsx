import { useState, useCallback } from "react";
import "./App.css";
import { BPMSlider, BeatIndicator, ControlButtons, KeyboardHints } from "./components";
import { useAudioClick, useTapTempo, useMetronome, useKeyboardControls } from "./hooks";
import { AVAILABLE_BEATS, BPM_MIN, BPM_MAX, type TimeSignature } from "./types";

function App() {
  const [bpm, setBpm] = useState<number>(100);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentBeat, setCurrentBeat] = useState<number>(-1);
  const [flash, setFlash] = useState(false);
  const [visualAid, setVisualAid] = useState(false);
  const [measure, setMeasure] = useState<TimeSignature>({ top: 4 });

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
    // Reset visual beat; useMetronome will immediately fire onBeatChange(0) if playing
    setCurrentBeat(-1);
  }, []);

  const handlePlayToggle = useCallback(() => {
    setIsPlaying((prev) => !prev);
    setCurrentBeat(-1);
  }, []);

  const handleTapTempo = useCallback(() => {
    handleTap();
    // Let the metronome keep running; it will restart from beat 0 when bpm updates
  }, [handleTap]);

  const handleMuteToggle = useCallback(() => setIsMuted((prev) => !prev), []);
  const handleVisualAidToggle = useCallback(() => setVisualAid((prev) => !prev), []);
  const handleBpmIncrease = useCallback(() => setBpm((prev) => Math.min(prev + 1, BPM_MAX)), []);
  const handleBpmDecrease = useCallback(() => setBpm((prev) => Math.max(prev - 1, BPM_MIN)), []);

  useKeyboardControls({
    onPlayToggle: handlePlayToggle,
    onMuteToggle: handleMuteToggle,
    onVisualAidToggle: handleVisualAidToggle,
    onTap: handleTapTempo,
    onBeatsToggle: toggleBeats,
    onBpmIncrease: handleBpmIncrease,
    onBpmDecrease: handleBpmDecrease,
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
          onMuteToggle={handleMuteToggle}
          onVisualAidToggle={handleVisualAidToggle}
          onBeatsToggle={toggleBeats}
          onTap={handleTapTempo}
        />

        <KeyboardHints />
      </div>
    </div>
  );
}

export default App;
