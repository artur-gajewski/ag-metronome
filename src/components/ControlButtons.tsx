interface ControlButtonsProps {
  isPlaying: boolean;
  isMuted: boolean;
  visualAid: boolean;
  measureTop: number;
  onPlayToggle: () => void;
  onMuteToggle: () => void;
  onVisualAidToggle: () => void;
  onBeatsToggle: () => void;
  onTap: () => void;
}

export const ControlButtons = ({
  isPlaying,
  isMuted,
  visualAid,
  measureTop,
  onPlayToggle,
  onMuteToggle,
  onVisualAidToggle,
  onBeatsToggle,
  onTap,
}: ControlButtonsProps) => {
  return (
    <div className="buttons">
      {!isPlaying ? (
        <button className="button" onClick={onPlayToggle} aria-label="Play">
          ▶ Play
        </button>
      ) : (
        <button className="button" onClick={onPlayToggle} aria-label="Stop">
          ⏸ Stop
        </button>
      )}

      <button className="button" onClick={onMuteToggle} aria-label={isMuted ? "Unmute" : "Mute"}>
        {isMuted ? "🔇 Unmute" : "🔊 Mute"}
      </button>

      <button className="button" onClick={onVisualAidToggle} aria-label={visualAid ? "Disable Visual Aid" : "Enable Visual Aid"}>
        {visualAid ? "🔴 Disable Visual Aid" : "🟢 Enable Visual Aid"}
      </button>

      <button className="button" onClick={onBeatsToggle} aria-label={`Change beats, currently ${measureTop}`}>
        {measureTop} Beats
      </button>

      <button className="button-large" onClick={onTap} aria-label="Tap Tempo">
        🖱️ Tap Tempo
      </button>
    </div>
  );
};
