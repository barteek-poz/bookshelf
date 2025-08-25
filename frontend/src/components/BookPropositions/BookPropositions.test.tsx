import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import BookPropositions from "./BookPropositions";

test("renders book propositions when provided", async () => {
  const existingBooks = [
    {
      id: 1,
      title: "Test title",
      author: "Test author",
      coverUrl: "coverUrl.png",
      inLibrary: true,
      canEdit: true,
    },
  ];
  const previewExistingBookHandler = jest.fn();
  render(
    <MemoryRouter>
      <BookPropositions existingBooks={existingBooks} previewExistingBookHandler={previewExistingBookHandler} />
    </MemoryRouter>
  );
  const bookListElement = screen.getAllByRole("listitem")[0];
  expect(
    screen.getByText(
      "Here is a list of books we have in our database. You can add them to your Bookshelf by clicking on the title. If you want to add a new book, continue typing the title."
    )
  ).toBeInTheDocument();
  expect(bookListElement).toBeInTheDocument();
  expect(screen.getByText("Test author")).toBeInTheDocument();
  expect(screen.getByText(/test title/i)).toBeInTheDocument();
  await userEvent.click(bookListElement);
  await waitFor(() => {
    expect(previewExistingBookHandler).toHaveBeenCalledWith({
      id: 1,
      title: "Test title",
      author: "Test author",
      coverUrl: "coverUrl.png",
      inLibrary: true,
      canEdit: true,
    });
  });
});
