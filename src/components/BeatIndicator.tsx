interface BeatIndicatorProps {
  measureTop: number;
  currentBeat: number;
}

export const BeatIndicator = ({ measureTop, currentBeat }: BeatIndicatorProps) => {
  return (
    <div className="beats">
      {Array.from({ length: measureTop }, (_, beat) => {
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
  );
};
