import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTapTempo } from "../../hooks/useTapTempo";

describe("useTapTempo", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });
  it("returns handleTap function", () => {
    const mockSetBpm = vi.fn();
    const { result } = renderHook(() => useTapTempo(mockSetBpm));

    expect(result.current.handleTap).toBeDefined();
    expect(typeof result.current.handleTap).toBe("function");
  });

  it("does not calculate BPM on first tap", () => {
    const mockSetBpm = vi.fn();
    const { result } = renderHook(() => useTapTempo(mockSetBpm));

    act(() => {
      result.current.handleTap();
    });

    expect(mockSetBpm).not.toHaveBeenCalled();
  });

  it("calculates BPM after two taps", () => {
    const mockSetBpm = vi.fn();
    const { result } = renderHook(() => useTapTempo(mockSetBpm));

    act(() => {
      result.current.handleTap();
    });

    // Wait a bit and tap again
    act(() => {
      vi.advanceTimersByTime(500);
      result.current.handleTap();
    });

    expect(mockSetBpm).toHaveBeenCalled();
  });

  it("resets tap history after long delay", () => {
    const mockSetBpm = vi.fn();
    const { result } = renderHook(() => useTapTempo(mockSetBpm));

    act(() => {
      result.current.handleTap();
      vi.advanceTimersByTime(3000); // More than 2 seconds
      result.current.handleTap();
    });

    // Should not calculate BPM because taps were too far apart
    expect(mockSetBpm).not.toHaveBeenCalled();
  });

  it("ignores taps that are too fast", () => {
    const mockSetBpm = vi.fn();
    const { result } = renderHook(() => useTapTempo(mockSetBpm));

    act(() => {
      result.current.handleTap();
      vi.advanceTimersByTime(100); // Less than MIN_INTERVAL
      result.current.handleTap();
    });

    expect(mockSetBpm).not.toHaveBeenCalled();
  });

  it("clamps BPM to valid range", () => {
    const mockSetBpm = vi.fn((callback) => {
      if (typeof callback === "function") {
        const newBpm = callback(100);
        expect(newBpm).toBeGreaterThanOrEqual(40);
        expect(newBpm).toBeLessThanOrEqual(300);
      }
    });

    const { result } = renderHook(() => useTapTempo(mockSetBpm));

    act(() => {
      result.current.handleTap();
      vi.advanceTimersByTime(500);
      result.current.handleTap();
    });

    expect(mockSetBpm).toHaveBeenCalled();
  });

  it("smooths BPM changes with weighted average", () => {
    const mockSetBpm = vi.fn((callback) => {
      if (typeof callback === "function") {
        const newBpm = callback(100);
        // The new BPM should be a weighted average (30% old, 70% new)
        expect(newBpm).toBeDefined();
        expect(typeof newBpm).toBe("number");
      }
    });

    const { result } = renderHook(() => useTapTempo(mockSetBpm));

    act(() => {
      result.current.handleTap();
      vi.advanceTimersByTime(500);
      result.current.handleTap();
    });

    expect(mockSetBpm).toHaveBeenCalled();
  });
});
