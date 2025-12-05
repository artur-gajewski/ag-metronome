import { describe, it, expect } from "vitest";
import { AVAILABLE_BEATS, BPM_MIN, BPM_MAX, type Measure } from "../types";

describe("types", () => {
  describe("Measure interface", () => {
    it("accepts valid measure object", () => {
      const measure: Measure = { top: 4 };
      expect(measure.top).toBe(4);
    });
  });

  describe("AVAILABLE_BEATS", () => {
    it("contains correct number of beat options", () => {
      expect(AVAILABLE_BEATS).toHaveLength(5);
    });

    it("contains correct beat values", () => {
      const beatValues = AVAILABLE_BEATS.map((b) => b.top);
      expect(beatValues).toEqual([2, 3, 4, 6, 8]);
    });

    it("contains valid Measure objects", () => {
      AVAILABLE_BEATS.forEach((beat) => {
        expect(beat).toHaveProperty("top");
        expect(typeof beat.top).toBe("number");
      });
    });
  });

  describe("BPM constants", () => {
    it("has correct BPM_MIN value", () => {
      expect(BPM_MIN).toBe(40);
    });

    it("has correct BPM_MAX value", () => {
      expect(BPM_MAX).toBe(300);
    });

    it("BPM_MIN is less than BPM_MAX", () => {
      expect(BPM_MIN).toBeLessThan(BPM_MAX);
    });
  });
});
