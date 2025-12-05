import { useEffect } from "react";

interface UseKeyboardControlsProps {
  onPlayToggle: () => void;
  onMuteToggle: () => void;
  onVisualAidToggle: () => void;
  onTap: () => void;
  onBeatsToggle: () => void;
  onBpmIncrease: () => void;
  onBpmDecrease: () => void;
}

export const useKeyboardControls = ({
  onPlayToggle,
  onMuteToggle,
  onVisualAidToggle,
  onTap,
  onBeatsToggle,
  onBpmIncrease,
  onBpmDecrease,
}: UseKeyboardControlsProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        onPlayToggle();
      }
      if (e.code === "KeyM") onMuteToggle();
      if (e.code === "KeyV") onVisualAidToggle();
      if (e.code === "Enter" || e.code === "KeyT") {
        onTap();
      }
      if (e.code === "KeyB") {
        onBeatsToggle();
      }
      if (e.code === "ArrowUp") onBpmIncrease();
      if (e.code === "ArrowDown") onBpmDecrease();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    onPlayToggle,
    onMuteToggle,
    onVisualAidToggle,
    onTap,
    onBeatsToggle,
    onBpmIncrease,
    onBpmDecrease,
  ]);
};
