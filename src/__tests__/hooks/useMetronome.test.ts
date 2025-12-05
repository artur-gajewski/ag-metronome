import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useMetronome } from "../../hooks/useMetronome";

describe("useMetronome", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  const defaultProps = {
    isPlaying: false,
    bpm: 120,
    measureTop: 4,
    visualAid: false,
    isMuted: false,
    onBeatChange: vi.fn(),
    onFlash: vi.fn(),
    playClick: vi.fn(),
  };

  it("does not start interval when not playing", () => {
    const mockOnBeatChange = vi.fn();

    renderHook(() => useMetronome({ ...defaultProps, onBeatChange: mockOnBeatChange }));

    vi.advanceTimersByTime(1000);

    expect(mockOnBeatChange).not.toHaveBeenCalled();
  });

  it("starts interval when playing", () => {
    const mockOnBeatChange = vi.fn();
    const mockPlayClick = vi.fn();

    renderHook(() =>
      useMetronome({
        ...defaultProps,
        isPlaying: true,
        onBeatChange: mockOnBeatChange,
        playClick: mockPlayClick,
      })
    );

    expect(mockOnBeatChange).toHaveBeenCalledWith(0);
    expect(mockPlayClick).toHaveBeenCalledWith(true, false);
  });

  it("advances beats on interval", () => {
    const mockOnBeatChange = vi.fn();

    renderHook(() =>
      useMetronome({
        ...defaultProps,
        isPlaying: true,
        onBeatChange: mockOnBeatChange,
      })
    );

    // Initial beat
    expect(mockOnBeatChange).toHaveBeenCalledWith(0);

    // Advance by interval (60/120 * 1000 = 500ms)
    vi.advanceTimersByTime(500);

    expect(mockOnBeatChange).toHaveBeenCalledWith(1);
  });

  it("cycles beats according to measureTop", () => {
    const mockOnBeatChange = vi.fn();

    renderHook(() =>
      useMetronome({
        ...defaultProps,
        isPlaying: true,
        measureTop: 3,
        onBeatChange: mockOnBeatChange,
      })
    );

    // Beat 0
    expect(mockOnBeatChange).toHaveBeenCalledWith(0);

    vi.advanceTimersByTime(500); // Beat 1
    vi.advanceTimersByTime(500); // Beat 2
    vi.advanceTimersByTime(500); // Back to Beat 0

    expect(mockOnBeatChange).toHaveBeenCalledWith(0);
  });

  it("calls onFlash when visual aid is enabled on first beat", () => {
    const mockOnFlash = vi.fn();

    renderHook(() =>
      useMetronome({
        ...defaultProps,
        isPlaying: true,
        visualAid: true,
        onFlash: mockOnFlash,
      })
    );

    expect(mockOnFlash).toHaveBeenCalled();
  });

  it("does not call onFlash when visual aid is disabled", () => {
    const mockOnFlash = vi.fn();

    renderHook(() =>
      useMetronome({
        ...defaultProps,
        isPlaying: true,
        visualAid: false,
        onFlash: mockOnFlash,
      })
    );

    mockOnFlash.mockClear();

    vi.advanceTimersByTime(500);

    expect(mockOnFlash).not.toHaveBeenCalled();
  });

  it("plays click with correct parameters for first beat", () => {
    const mockPlayClick = vi.fn();

    renderHook(() =>
      useMetronome({
        ...defaultProps,
        isPlaying: true,
        playClick: mockPlayClick,
      })
    );

    expect(mockPlayClick).toHaveBeenCalledWith(true, false);
  });

  it("plays click with correct parameters for regular beat", () => {
    const mockPlayClick = vi.fn();

    renderHook(() =>
      useMetronome({
        ...defaultProps,
        isPlaying: true,
        playClick: mockPlayClick,
      })
    );

    mockPlayClick.mockClear();

    vi.advanceTimersByTime(500);

    expect(mockPlayClick).toHaveBeenCalledWith(false, false);
  });

  it("adjusts interval based on BPM", () => {
    const mockOnBeatChange = vi.fn();

    renderHook(() =>
      useMetronome({
        ...defaultProps,
        isPlaying: true,
        bpm: 60, // 1 beat per second
        onBeatChange: mockOnBeatChange,
      })
    );

    mockOnBeatChange.mockClear();

    vi.advanceTimersByTime(1000);

    expect(mockOnBeatChange).toHaveBeenCalledWith(1);
  });

  it("clears interval when stopped", () => {
    const mockOnBeatChange = vi.fn();

    const { rerender } = renderHook(
      ({ isPlaying }) =>
        useMetronome({ ...defaultProps, isPlaying, onBeatChange: mockOnBeatChange }),
      { initialProps: { isPlaying: true } }
    );

    mockOnBeatChange.mockClear();

    rerender({ isPlaying: false });

    vi.advanceTimersByTime(1000);

    // Should not advance beats after stopping
    expect(mockOnBeatChange).not.toHaveBeenCalled();
  });

  it("cleans up interval on unmount", () => {
    const clearIntervalSpy = vi.spyOn(globalThis, "clearInterval");

    const { unmount } = renderHook(() => useMetronome({ ...defaultProps, isPlaying: true }));

    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();
  });
});
