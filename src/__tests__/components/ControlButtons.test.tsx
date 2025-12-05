import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ControlButtons } from "../../components/ControlButtons";

describe("ControlButtons", () => {
  const defaultProps = {
    isPlaying: false,
    isMuted: false,
    visualAid: false,
    measureTop: 4,
    onPlayToggle: vi.fn(),
    onMuteToggle: vi.fn(),
    onVisualAidToggle: vi.fn(),
    onBeatsToggle: vi.fn(),
    onTap: vi.fn(),
  };

  it("renders Play button when not playing", () => {
    render(<ControlButtons {...defaultProps} />);

    expect(screen.getByText("▶ Play")).toBeInTheDocument();
  });

  it("renders Stop button when playing", () => {
    render(<ControlButtons {...defaultProps} isPlaying={true} />);

    expect(screen.getByText("⏸ Stop")).toBeInTheDocument();
  });

  it("calls onPlayToggle when play button is clicked", async () => {
    const user = userEvent.setup();
    const mockOnPlayToggle = vi.fn();

    render(<ControlButtons {...defaultProps} onPlayToggle={mockOnPlayToggle} />);

    await user.click(screen.getByText("▶ Play"));
    expect(mockOnPlayToggle).toHaveBeenCalledOnce();
  });

  it("shows Unmute button when muted", () => {
    render(<ControlButtons {...defaultProps} isMuted={true} />);

    expect(screen.getByText("🔇 Unmute")).toBeInTheDocument();
  });

  it("shows Mute button when not muted", () => {
    render(<ControlButtons {...defaultProps} isMuted={false} />);

    expect(screen.getByText("🔊 Mute")).toBeInTheDocument();
  });

  it("calls onMuteToggle when mute button is clicked", async () => {
    const user = userEvent.setup();
    const mockOnMuteToggle = vi.fn();

    render(<ControlButtons {...defaultProps} onMuteToggle={mockOnMuteToggle} />);

    await user.click(screen.getByText("🔊 Mute"));
    expect(mockOnMuteToggle).toHaveBeenCalledOnce();
  });

  it("shows Disable Visual Aid when visual aid is enabled", () => {
    render(<ControlButtons {...defaultProps} visualAid={true} />);

    expect(screen.getByText("🔴 Disable Visual Aid")).toBeInTheDocument();
  });

  it("shows Enable Visual Aid when visual aid is disabled", () => {
    render(<ControlButtons {...defaultProps} visualAid={false} />);

    expect(screen.getByText("🟢 Enable Visual Aid")).toBeInTheDocument();
  });

  it("calls onVisualAidToggle when visual aid button is clicked", async () => {
    const user = userEvent.setup();
    const mockOnVisualAidToggle = vi.fn();

    render(<ControlButtons {...defaultProps} onVisualAidToggle={mockOnVisualAidToggle} />);

    await user.click(screen.getByText("🟢 Enable Visual Aid"));
    expect(mockOnVisualAidToggle).toHaveBeenCalledOnce();
  });

  it("shows current beats measure", () => {
    render(<ControlButtons {...defaultProps} measureTop={6} />);

    expect(screen.getByText("6 Beats")).toBeInTheDocument();
  });

  it("calls onBeatsToggle when beats button is clicked", async () => {
    const user = userEvent.setup();
    const mockOnBeatsToggle = vi.fn();

    render(<ControlButtons {...defaultProps} onBeatsToggle={mockOnBeatsToggle} />);

    await user.click(screen.getByText("4 Beats"));
    expect(mockOnBeatsToggle).toHaveBeenCalledOnce();
  });

  it("calls onTap when tap tempo button is clicked", async () => {
    const user = userEvent.setup();
    const mockOnTap = vi.fn();

    render(<ControlButtons {...defaultProps} onTap={mockOnTap} />);

    await user.click(screen.getByText("🖱️ Tap Tempo"));
    expect(mockOnTap).toHaveBeenCalledOnce();
  });

  it("renders all buttons", () => {
    render(<ControlButtons {...defaultProps} />);

    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(5);
  });
});
