import { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  const [bpm, setBpm] = useState<number>(100);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentBeat, setCurrentBeat] = useState<number>(-1);
  const [flash, setFlash] = useState(false);
  const [visualAid, setVisualAid] = useState(false);

  const intervalRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const isMutedRef = useRef(isMuted);
  const visualAidRef = useRef(visualAid);

    const tapTimesRef = useRef<number[]>([]);
    const lastTapRef = useRef<number>(0);
    const handleTap = () => {
        const now = performance.now();
        const MIN_INTERVAL = 200;   // 300 BPM -> 200 ms
        const MAX_INTERVAL = 1500;  // 40 BPM  -> 1500 ms

        const sinceLast = now - lastTapRef.current;

        // Ignore accidental double tap / key auto-repeat
        if (sinceLast > 0 && sinceLast < MIN_INTERVAL - 20) {
            lastTapRef.current = now;
            return;
        }

        // Reset if pause between taps exceeds 2s
        if (sinceLast > 2000) {
            tapTimesRef.current = [];
        }
        tapTimesRef.current.push(now);

        // Keep last 10 taps initially; after reaching 10, allow up to 100
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
                // Filter out-of-range intervals (outliers)
                if (iv >= MIN_INTERVAL && iv <= MAX_INTERVAL) {
                    intervals.push(iv);
                }
            }

            if (intervals.length === 0) return;

            let bpmCalc: number;
            if (intervals.length === 1) {
                bpmCalc = 60000 / intervals[0];
            } else {
                const bpms = intervals.map(iv => 60000 / iv);
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
            // Light smoothing to avoid abrupt jumps
            setBpm(prev => Math.round((prev * 0.4) + (clamped * 0.6)));
        }
    };

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  useEffect(() => {
    visualAidRef.current = visualAid;
  }, [visualAid]);

  const playClick = (isFirstBeat: boolean) => {
    if (isMutedRef.current) return;

    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === "suspended") ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.value = isFirstBeat ? 880 : 440;

    gain.gain.setValueAtTime(1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.1);
  };

  useEffect(() => {
    if (isPlaying) {
      const interval = (60 / bpm) * 1000;

      setCurrentBeat(0);
      playClick(true);
      if (visualAidRef.current) {
        setFlash(true);
        setTimeout(() => setFlash(false), 100);
      }

      intervalRef.current = window.setInterval(() => {
        setCurrentBeat((prev) => {
          const next = (prev + 1) % 4;

          if (next === 0 && visualAidRef.current) {
            setFlash(true);
            setTimeout(() => setFlash(false), 100);
          }

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
  }, [isPlaying, bpm]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
          setCurrentBeat(-1);
      }
      if (e.code === "KeyM") {
        setIsMuted((prev) => !prev);
      }
      if (e.code === "KeyV") {
        setVisualAid((prev) => !prev);
      }
      if (e.code === "Enter" || e.code === "KeyT") {
          handleTap();
          setCurrentBeat(-1);
          setIsPlaying(false);
      }
      if (e.code === "ArrowUp") {
        setBpm((prev) => Math.min(prev + 1, 300));
        // setIsPlaying(false);
      }
      if (e.code === "ArrowDown") {
        setBpm((prev) => Math.max(prev - 1, 40));
        // setIsPlaying(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className={`container ${flash ? "flash" : ""}`}>
      <div className="content">
        <div className="sliderBox">
          <h1 className="title">BPM: {bpm}</h1>
          <input
            type="range"
            min={40}
            max={300}
            value={bpm}
            onChange={(e) => {
              setBpm(Number(e.target.value));
              setIsPlaying(false);
            }}
            className="slider"
          />
        </div>

        <div className="beats">
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

        <div className="buttons">
          {!isPlaying ? (
            <button className="button" onClick={() => setIsPlaying(true)}>
              ▶ Play
            </button>
          ) : (
            <button className="button" onClick={() => {
                setIsPlaying(false);
                setCurrentBeat(-1);
            }}>
              ⏸ Stop
            </button>
          )}
          <button className="button" onClick={() => setIsMuted((m) => !m)}>
            {isMuted ? "🔇 Unmute" : "🔊 Mute"}
          </button>
          <button className="button" onClick={() => setVisualAid((v) => !v)}>
            {visualAid ? "🔴 Disable Visual Aid" : "🟢 Enable Visual Aid"}
          </button>
          <button className="button-large" onClick={() => {
              handleTap();
              setCurrentBeat(-1);
              setIsPlaying(false);
          }}>🖱️ Tap Tempo</button>
        </div>

        <div className="hint">
          <b>Space</b> to Play/Stop
          <br />
          <b>M</b> to Mute/Unmute
          <br />
          <b>V</b> to toggle Visual Aid
          <br />
          <b>Arrow up</b> to Increase BPM
          <br />
          <b>Arrow down</b> to Decrease BPM
          <br />
          <b>T or ENTER</b> tap to set BPM
        </div>
      </div>
    </div>
  );
}

export default App;
