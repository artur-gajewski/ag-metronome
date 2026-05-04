export interface TimeSignature {
  top: number;
}

export const AVAILABLE_BEATS: TimeSignature[] = [
  { top: 2 },
  { top: 3 },
  { top: 4 },
  { top: 6 },
  { top: 8 },
];

export const BPM_MIN = 40;
export const BPM_MAX = 300;
