import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";

describe("App", () => {
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

  it("renders the app", () => {
    render(<App />);

    expect(screen.getByText(/BPM:/)).toBeInTheDocument();
  });

  it("renders all main components", () => {
    render(<App />);

    // BPM Slider
    expect(screen.getByRole("slider")).toBeInTheDocument();

    // Control buttons
    expect(screen.getByText("▶ Play")).toBeInTheDocument();
    expect(screen.getByText("🔊 Mute")).toBeInTheDocument();
    expect(screen.getByText("🟢 Enable Visual Aid")).toBeInTheDocument();

    // Beat indicators
    expect(screen.getByText("1")).toBeInTheDocument();

    // Keyboard hints
    expect(screen.getByText("Space")).toBeInTheDocument();
  });

  it("starts with default BPM of 100", () => {
    render(<App />);

    expect(screen.getByText("BPM: 100")).toBeInTheDocument();
  });

  it("starts with 4 beats", () => {
    render(<App />);

    expect(screen.getByText("4 Beats")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
  });

  it("changes play state when play button is clicked", async () => {
    const user = userEvent.setup();
    render(<App />);

    const playButton = screen.getByText("▶ Play");
    await user.click(playButton);

    expect(screen.getByText("⏸ Stop")).toBeInTheDocument();
  });

  it("toggles mute state when mute button is clicked", async () => {
    const user = userEvent.setup();
    render(<App />);

    const muteButton = screen.getByText("🔊 Mute");
    await user.click(muteButton);

    expect(screen.getByText("🔇 Unmute")).toBeInTheDocument();
  });

  it("toggles visual aid when button is clicked", async () => {
    const user = userEvent.setup();
    render(<App />);

    const visualAidButton = screen.getByText("🟢 Enable Visual Aid");
    await user.click(visualAidButton);

    expect(screen.getByText("🔴 Disable Visual Aid")).toBeInTheDocument();
  });

  it("cycles through beat options", async () => {
    const user = userEvent.setup();
    render(<App />);

    const beatsButton = screen.getByText("4 Beats");

    await user.click(beatsButton);
    expect(screen.getByText("6 Beats")).toBeInTheDocument();

    await user.click(screen.getByText("6 Beats"));
    expect(screen.getByText("8 Beats")).toBeInTheDocument();

    await user.click(screen.getByText("8 Beats"));
    expect(screen.getByText("2 Beats")).toBeInTheDocument();
  });

  it("updates BPM when slider is changed", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByText("BPM: 100")).toBeInTheDocument();

    // Use keyboard arrows to change BPM
    await user.keyboard("{ArrowUp}");

    // BPM should have increased to 101
    expect(screen.getByText("BPM: 101")).toBeInTheDocument();
  });

  it("stops metronome when BPM slider is changed", async () => {
    const user = userEvent.setup();
    render(<App />);

    // Start metronome
    await user.click(screen.getByText("▶ Play"));
    expect(screen.getByText("⏸ Stop")).toBeInTheDocument();

    // Change BPM by directly interacting with the slider (not keyboard shortcuts)
    // We need to trigger the onChange event directly
    const slider = screen.getByRole("slider") as HTMLInputElement;

    // Simulate changing the slider value
    await user.click(slider);

    // Fire a change event with a new value
    const changeEvent = new Event("change", { bubbles: true });
    Object.defineProperty(slider, "value", { value: "105", writable: true });
    slider.dispatchEvent(changeEvent);

    // Should stop after slider change
    await waitFor(() => {
      expect(screen.getByText("▶ Play")).toBeInTheDocument();
    });
  });

  it("responds to Space key press for play/stop", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByText("▶ Play")).toBeInTheDocument();

    await user.keyboard(" ");

    expect(screen.getByText("⏸ Stop")).toBeInTheDocument();
  });

  it("responds to M key press for mute", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.keyboard("m");

    expect(screen.getByText("🔇 Unmute")).toBeInTheDocument();
  });

  it("responds to V key press for visual aid", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.keyboard("v");

    expect(screen.getByText("🔴 Disable Visual Aid")).toBeInTheDocument();
  });

  it("responds to B key press for beat change", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.keyboard("b");

    expect(screen.getByText("6 Beats")).toBeInTheDocument();
  });

  it("responds to ArrowUp key press for BPM increase", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByText("BPM: 100")).toBeInTheDocument();

    await user.keyboard("{ArrowUp}");

    expect(screen.getByText("BPM: 101")).toBeInTheDocument();
  });

  it("responds to ArrowDown key press for BPM decrease", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByText("BPM: 100")).toBeInTheDocument();

    await user.keyboard("{ArrowDown}");

    expect(screen.getByText("BPM: 99")).toBeInTheDocument();
  });

  it("handles tap tempo button click", async () => {
    const user = userEvent.setup();
    render(<App />);

    const tapButton = screen.getByText("🖱️ Tap Tempo");

    // First tap should not change anything
    await user.click(tapButton);
    expect(screen.getByText("BPM: 100")).toBeInTheDocument();
  });

  it("clamps BPM to minimum value", async () => {
    const user = userEvent.setup();
    render(<App />);

    // Try to go below minimum (40) with keyboard arrows from 100
    // Need to go down 61 times: 100 - 40 = 60, plus one more
    for (let i = 0; i < 70; i++) {
      await user.keyboard("{ArrowDown}");
    }

    const bpmText = screen.getByText(/BPM:/);
    const bpmValue = parseInt(bpmText.textContent!.split(" ")[1]);
    expect(bpmValue).toBe(40); // Should be clamped at 40
  });

  it("clamps BPM to maximum value", async () => {
    const user = userEvent.setup();
    render(<App />);

    // Try to go above maximum (300) with keyboard
    for (let i = 0; i < 250; i++) {
      await user.keyboard("{ArrowUp}");
    }

    const bpmText = screen.getByText(/BPM:/);
    const bpmValue = parseInt(bpmText.textContent!.split(" ")[1]);
    expect(bpmValue).toBeLessThanOrEqual(300);
  });
});
