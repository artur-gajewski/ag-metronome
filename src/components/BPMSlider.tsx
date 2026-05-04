import { BPM_MIN, BPM_MAX } from "../types";

interface BPMSliderProps {
  bpm: number;
  onBpmChange: (bpm: number) => void;
  onStop: () => void;
}

export const BPMSlider = ({ bpm, onBpmChange, onStop }: BPMSliderProps) => {
  return (
    <div className="sliderBox">
      <div className="bpm-display">
        <h1 className="title">BPM: {bpm}</h1>
        <input
          type="number"
          min={BPM_MIN}
          max={BPM_MAX}
          value={bpm}
          onChange={(e) => {
            const val = Number(e.target.value);
            if (!isNaN(val) && val >= BPM_MIN && val <= BPM_MAX) {
              onBpmChange(val);
              onStop();
            }
          }}
          className="bpm-input"
          aria-label="BPM value"
        />
      </div>
      <input
        type="range"
        min={BPM_MIN}
        max={BPM_MAX}
        value={bpm}
        onChange={(e) => {
          onBpmChange(Number(e.target.value));
          onStop();
        }}
        className="slider"
        aria-label="BPM slider"
      />
    </div>
  );
};
