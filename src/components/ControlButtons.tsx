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
        <button className="button" onClick={onPlayToggle}>
          ▶ Play
        </button>
      ) : (
        <button className="button" onClick={onPlayToggle}>
          ⏸ Stop
        </button>
      )}

      <button className="button" onClick={onMuteToggle}>
        {isMuted ? "🔇 Unmute" : "🔊 Mute"}
      </button>

      <button className="button" onClick={onVisualAidToggle}>
        {visualAid ? "🔴 Disable Visual Aid" : "🟢 Enable Visual Aid"}
      </button>

      <button className="button" onClick={onBeatsToggle}>
        {measureTop} Beats
      </button>

      <button className="button-large" onClick={onTap}>
        🖱️ Tap Tempo
      </button>
    </div>
  );
};
