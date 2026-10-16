import { render, screen } from "@testing-library/react";
import App from "./App";

jest.mock("marvinj-ts", () => ({
  Marvin: { scale: jest.fn() },
  MarvinImage: jest.fn(),
}));

test("renders the app title", () => {
  render(<App />);
  expect(
    screen.getByText(/perler bead template generator/i)
  ).toBeInTheDocument();
});
