import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import Book from "./Book";

test("render book data", () => {
  render(
    <MemoryRouter>
      <Book id={1} title="Test title" author="Test author" coverUrl="coverUrl.png" inLibrary={true} canEdit={true} />
    </MemoryRouter>
  );
  const book = screen.getByRole("link");
  expect(book).toHaveAttribute("href", "/books/1");
  expect(book).toHaveStyle("background-image: url(coverUrl.png)");
});

test("render default cover and book info", () => {
  render(
    <MemoryRouter>
      <Book id={1} title="Test title" author="Test author" coverUrl={null} inLibrary={true} canEdit={true} />
    </MemoryRouter>
  );
  const book = screen.getByRole("link");
  expect(book).toHaveAttribute("href", "/books/1");
  expect(book).not.toHaveStyle("background-image: url(coverUrl.png)");
  expect(screen.getByText("Test title")).toBeInTheDocument()
  expect(screen.getByText("Test author")).toBeInTheDocument()
});
