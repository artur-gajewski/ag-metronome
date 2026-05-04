import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { KeyboardHints } from "../../components/KeyboardHints";

describe("KeyboardHints", () => {
  it("renders all keyboard shortcuts", () => {
    render(<KeyboardHints />);

    expect(screen.getByText("↑ / ↓")).toBeInTheDocument();
    expect(screen.getByText(/adjust BPM/i)).toBeInTheDocument();
    expect(screen.getByText("Space")).toBeInTheDocument();
    expect(screen.getByText(/to Play\/Stop/i)).toBeInTheDocument();
    expect(screen.getByText("M")).toBeInTheDocument();
    expect(screen.getByText(/to Mute\/Unmute/i)).toBeInTheDocument();
    expect(screen.getByText("V")).toBeInTheDocument();
    expect(screen.getByText(/toggle Visual Aid/i)).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
    expect(screen.getByText(/change beats/i)).toBeInTheDocument();
    expect(screen.getByText("Enter / T")).toBeInTheDocument();
    expect(screen.getByText(/tap tempo/i)).toBeInTheDocument();
  });

  it("renders with correct structure", () => {
    const { container } = render(<KeyboardHints />);

    const hintDiv = container.querySelector(".hint");
    expect(hintDiv).toBeInTheDocument();
  });
});
