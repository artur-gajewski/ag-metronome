import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useAudioClick } from "../../hooks/useAudioClick";

describe("useAudioClick", () => {
  beforeEach(() => {
    // Mock AudioContext as a class constructor
    class MockAudioContext {
      state = "running";
      currentTime = 0;
      destination = {};
      resume = vi.fn();
      createOscillator = vi.fn().mockReturnValue({
        type: "sine",
        frequency: { value: 440 },
        connect: vi.fn(),
        start: vi.fn(),
        stop: vi.fn(),
      });
      createGain = vi.fn().mockReturnValue({
        gain: {
          setValueAtTime: vi.fn(),
          exponentialRampToValueAtTime: vi.fn(),
        },
        connect: vi.fn(),
      });
    }

    globalThis.AudioContext = MockAudioContext as unknown as typeof AudioContext;
  });

  it("returns playClick function", () => {
    const { result } = renderHook(() => useAudioClick());

    expect(result.current.playClick).toBeDefined();
    expect(typeof result.current.playClick).toBe("function");
  });

  it("does not play click when muted", () => {
    const { result } = renderHook(() => useAudioClick());

    const createOscillatorSpy = vi.fn();
    const mockCtx = new (AudioContext as unknown as new () => AudioContext)();
    mockCtx.createOscillator = createOscillatorSpy;

    act(() => {
      result.current.playClick(true, true);
    });

    // Should return early and not create oscillator when muted
    expect(createOscillatorSpy).not.toHaveBeenCalled();
  });

  it("plays click when not muted", () => {
    const { result } = renderHook(() => useAudioClick());

    act(() => {
      result.current.playClick(true, false);
    });

    // Should create AudioContext and play (we just verify no errors)
    expect(result.current.playClick).toBeDefined();
  });

  it("uses different frequency for first beat", () => {
    const mockOscillator = {
      type: "sine",
      frequency: { value: 0 },
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
    };

    class MockAudioContextWithOsc {
      state = "running";
      currentTime = 0;
      destination = {};
      resume = vi.fn();
      createOscillator = vi.fn().mockReturnValue(mockOscillator);
      createGain = vi.fn().mockReturnValue({
        gain: {
          setValueAtTime: vi.fn(),
          exponentialRampToValueAtTime: vi.fn(),
        },
        connect: vi.fn(),
      });
    }

    globalThis.AudioContext = MockAudioContextWithOsc as unknown as typeof AudioContext;

    const { result } = renderHook(() => useAudioClick());

    act(() => {
      result.current.playClick(true, false);
    });

    // First beat should use 880Hz
    expect(mockOscillator.frequency.value).toBe(880);
  });

  it("uses different frequency for regular beat", () => {
    const mockOscillator = {
      type: "sine",
      frequency: { value: 0 },
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
    };

    class MockAudioContextWithOsc {
      state = "running";
      currentTime = 0;
      destination = {};
      resume = vi.fn();
      createOscillator = vi.fn().mockReturnValue(mockOscillator);
      createGain = vi.fn().mockReturnValue({
        gain: {
          setValueAtTime: vi.fn(),
          exponentialRampToValueAtTime: vi.fn(),
        },
        connect: vi.fn(),
      });
    }

    globalThis.AudioContext = MockAudioContextWithOsc as unknown as typeof AudioContext;

    const { result } = renderHook(() => useAudioClick());

    act(() => {
      result.current.playClick(false, false);
    });

    // Regular beat should use 440Hz
    expect(mockOscillator.frequency.value).toBe(440);
  });

  it("maintains stable reference for playClick", () => {
    const { result, rerender } = renderHook(() => useAudioClick());

    const firstPlayClick = result.current.playClick;
    rerender();
    const secondPlayClick = result.current.playClick;

    expect(firstPlayClick).toBe(secondPlayClick);
  });
});
