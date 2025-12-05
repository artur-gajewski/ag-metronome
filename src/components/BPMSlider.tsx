interface BPMSliderProps {
  bpm: number;
  onBpmChange: (bpm: number) => void;
  onStop: () => void;
}

export const BPMSlider = ({ bpm, onBpmChange, onStop }: BPMSliderProps) => {
  return (
    <div className="sliderBox">
      <h1 className="title">BPM: {bpm}</h1>
      <input
        type="range"
        min={40}
        max={300}
        value={bpm}
        onChange={(e) => {
          onBpmChange(Number(e.target.value));
          onStop();
        }}
        className="slider"
      />
    </div>
  );
};
