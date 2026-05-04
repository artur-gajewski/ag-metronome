import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useKeyboardControls } from "../../hooks/useKeyboardControls";

describe("useKeyboardControls", () => {
  const mockCallbacks = {
    onPlayToggle: vi.fn(),
    onMuteToggle: vi.fn(),
    onVisualAidToggle: vi.fn(),
    onTap: vi.fn(),
    onBeatsToggle: vi.fn(),
    onBpmIncrease: vi.fn(),
    onBpmDecrease: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("calls onPlayToggle when Space is pressed", () => {
    renderHook(() => useKeyboardControls(mockCallbacks));

    const event = new KeyboardEvent("keydown", { code: "Space" });
    window.dispatchEvent(event);

    expect(mockCallbacks.onPlayToggle).toHaveBeenCalledOnce();
  });

  it("calls onMuteToggle when M is pressed", () => {
    renderHook(() => useKeyboardControls(mockCallbacks));

    const event = new KeyboardEvent("keydown", { code: "KeyM" });
    window.dispatchEvent(event);

    expect(mockCallbacks.onMuteToggle).toHaveBeenCalledOnce();
  });

  it("calls onVisualAidToggle when V is pressed", () => {
    renderHook(() => useKeyboardControls(mockCallbacks));

    const event = new KeyboardEvent("keydown", { code: "KeyV" });
    window.dispatchEvent(event);

    expect(mockCallbacks.onVisualAidToggle).toHaveBeenCalledOnce();
  });

  it("calls onTap when Enter is pressed", () => {
    renderHook(() => useKeyboardControls(mockCallbacks));

    const event = new KeyboardEvent("keydown", { code: "Enter" });
    window.dispatchEvent(event);

    expect(mockCallbacks.onTap).toHaveBeenCalledOnce();
  });

  it("calls onTap when T is pressed", () => {
    renderHook(() => useKeyboardControls(mockCallbacks));

    const event = new KeyboardEvent("keydown", { code: "KeyT" });
    window.dispatchEvent(event);

    expect(mockCallbacks.onTap).toHaveBeenCalledOnce();
  });

  it("calls onBeatsToggle when B is pressed", () => {
    renderHook(() => useKeyboardControls(mockCallbacks));

    const event = new KeyboardEvent("keydown", { code: "KeyB" });
    window.dispatchEvent(event);

    expect(mockCallbacks.onBeatsToggle).toHaveBeenCalledOnce();
  });

  it("calls onBpmIncrease when ArrowUp is pressed", () => {
    renderHook(() => useKeyboardControls(mockCallbacks));

    const event = new KeyboardEvent("keydown", { code: "ArrowUp" });
    window.dispatchEvent(event);

    expect(mockCallbacks.onBpmIncrease).toHaveBeenCalledOnce();
  });

  it("calls onBpmDecrease when ArrowDown is pressed", () => {
    renderHook(() => useKeyboardControls(mockCallbacks));

    const event = new KeyboardEvent("keydown", { code: "ArrowDown" });
    window.dispatchEvent(event);

    expect(mockCallbacks.onBpmDecrease).toHaveBeenCalledOnce();
  });

  it("cleans up event listener on unmount", () => {
    const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");

    const { unmount } = renderHook(() => useKeyboardControls(mockCallbacks));

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith("keydown", expect.any(Function));
  });

  it("does not call callbacks when event comes from an input element", () => {
    renderHook(() => useKeyboardControls(mockCallbacks));

    const input = document.createElement("input");
    document.body.appendChild(input);

    // Dispatch events from the input – they bubble up to window but target is HTMLInputElement
    ["ArrowUp", "ArrowDown", "Space", "KeyM"].forEach((code) => {
      input.dispatchEvent(new KeyboardEvent("keydown", { code, bubbles: true }));
    });

    expect(mockCallbacks.onBpmIncrease).not.toHaveBeenCalled();
    expect(mockCallbacks.onBpmDecrease).not.toHaveBeenCalled();
    expect(mockCallbacks.onPlayToggle).not.toHaveBeenCalled();
    expect(mockCallbacks.onMuteToggle).not.toHaveBeenCalled();

    document.body.removeChild(input);
  });

  it("does not call callbacks for unhandled keys", () => {
    renderHook(() => useKeyboardControls(mockCallbacks));

    const event = new KeyboardEvent("keydown", { code: "KeyA" });
    window.dispatchEvent(event);

    expect(mockCallbacks.onPlayToggle).not.toHaveBeenCalled();
    expect(mockCallbacks.onMuteToggle).not.toHaveBeenCalled();
    expect(mockCallbacks.onVisualAidToggle).not.toHaveBeenCalled();
  });
});
