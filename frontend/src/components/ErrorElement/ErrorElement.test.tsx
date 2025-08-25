import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import ErrorElement from "./ErrorElement";

test("renders error message", () => {
  render(
    <MemoryRouter>
      <ErrorElement />
    </MemoryRouter>
  );
  expect(screen.getByText("Bookshelf")).toBeInTheDocument();
  expect(screen.getByText("Sorry, but something went wrong. Please refresh the page or try to reconnect later.")).toBeInTheDocument();
});
