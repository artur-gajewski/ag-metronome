import { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  const [bpm, setBpm] = useState<number>(100);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentBeat, setCurrentBeat] = useState<number>(0);
  const intervalRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Play a short beep (high pitch for first beat, low for others)
  const playClick = (isFirstBeat: boolean) => {
    if (isMuted) return;
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }

    const ctx = audioCtxRef.current;

    // Resume audio context for iOS/Chrome mobile
    if (ctx.state === "suspended") {
      ctx.resume();
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Frequencies: first beat is higher, others one octave lower
    osc.type = "sine";
    osc.frequency.value = isFirstBeat ? 880 : 440;

    // Envelope: short beep (100ms)
    gain.gain.setValueAtTime(1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.1);
  };

  // Handle Play/Pause interval
  useEffect(() => {
    if (isPlaying) {
      const interval = (60 / bpm) * 1000;
      intervalRef.current = window.setInterval(() => {
        setCurrentBeat((prev) => {
          const next = (prev + 1) % 4;
          playClick(next === 0);
          return next;
        });
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
  }, [isPlaying, bpm, isMuted]);

  // Spacebar listener for Play/Pause
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault(); // prevent scrolling
        setIsPlaying((prev) => !prev);
      }
      if (e.code === "KeyM") {
        setIsMuted((prev) => !prev);
      }
      if (e.code === "ArrowUp") {
        setBpm((prev) => Math.min(prev + 1, 200));
      }
      if (e.code === "ArrowDown") {
        setBpm((prev) => Math.max(prev - 1, 40));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className={"container"}>
      <div className={"content"}>
        <div className={"sliderBox"}>
          <h1 className={"title"}>BPM: {bpm}</h1>
          <input
            type="range"
            min={40}
            max={200}
            value={bpm}
            onChange={(e) => setBpm(Number(e.target.value))}
            className={"slider"}
          />
        </div>

        <div className={"beats"}>
          {[0, 1, 2, 3].map((beat) => {
            const isActive = currentBeat === beat;
            const isFirst = beat === 0;

            return (
              <div
                key={beat}
                className={`beat ${isActive ? "active" : ""} ${
                  isFirst && isActive ? "first-beat" : ""
                }`}
                style={{
                  transform: isActive ? "scale(1.3)" : "scale(1)",
                  transition: "transform 0.1s ease",
                }}
              >
                {beat + 1}
              </div>
            );
          })}
        </div>

        <div className={"buttons"}>
          {!isPlaying ? (
            <button className={"button"} onClick={() => setIsPlaying(true)}>
              ▶ Play
            </button>
          ) : (
            <button className={"button"} onClick={() => setIsPlaying(false)}>
              ⏸ Pause
            </button>
          )}
          <button className={"button"} onClick={() => setIsMuted((m) => !m)}>
            {isMuted ? "🔇 Unmute" : "🔊 Mute"}
          </button>
        </div>

        <div className={"hint"}>
          <b>Space</b> to Play/Pause
          <br />
          <b>M</b> to Mute/Unmute
          <br />
          <b>Arrow up</b> to Increase BPM
          <br />
          <b>Arrow down</b> to Decrease BPM
        </div>
      </div>
    </div>
  );
}

export default App;
