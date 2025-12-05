import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BeatIndicator } from "../../components/BeatIndicator";

describe("BeatIndicator", () => {
  it("renders correct number of beats", () => {
    render(<BeatIndicator measureTop={4} currentBeat={0} />);

    const beats = screen.getAllByText(/[1-4]/);
    expect(beats).toHaveLength(4);
  });

  it("renders beats with correct numbers", () => {
    render(<BeatIndicator measureTop={3} currentBeat={0} />);

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("highlights the current beat", () => {
    render(<BeatIndicator measureTop={4} currentBeat={2} />);

    const beats = screen.getAllByText(/[1-4]/);
    expect(beats[2]).toHaveClass("active");
  });

  it("highlights first beat when current beat is 0", () => {
    render(<BeatIndicator measureTop={4} currentBeat={0} />);

    const firstBeat = screen.getByText("1");
    expect(firstBeat).toHaveClass("active");
    expect(firstBeat).toHaveClass("first-beat");
  });

  it("renders 8 beats correctly", () => {
    render(<BeatIndicator measureTop={8} currentBeat={5} />);

    const beats = screen.getAllByText(/[1-8]/);
    expect(beats).toHaveLength(8);
    expect(beats[5]).toHaveClass("active");
  });

  it("applies scale transform to active beat", () => {
    render(<BeatIndicator measureTop={4} currentBeat={1} />);

    const beats = screen.getAllByText(/[1-4]/);
    expect(beats[1]).toHaveStyle({ transform: "scale(1.3)" });
  });

  it("applies default scale to inactive beats", () => {
    render(<BeatIndicator measureTop={4} currentBeat={1} />);

    const beats = screen.getAllByText(/[1-4]/);
    expect(beats[0]).toHaveStyle({ transform: "scale(1)" });
    expect(beats[2]).toHaveStyle({ transform: "scale(1)" });
    expect(beats[3]).toHaveStyle({ transform: "scale(1)" });
  });
});
