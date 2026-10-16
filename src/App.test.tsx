import { vi } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "./App";

vi.mock("marvinj-ts", () => ({
  Marvin: { scale: vi.fn() },
  MarvinImage: vi.fn(),
}));

test("renders the app title", () => {
  render(<App />);
  expect(
    screen.getByText(/perler bead template generator/i)
  ).toBeInTheDocument();
});
