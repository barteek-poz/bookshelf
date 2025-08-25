import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import BooksList from "./BooksList";
import userEvent from "@testing-library/user-event";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("renders table with navigate to /book", () => {
  const booksData = [
    {
      id: 1,
      title: "Test title",
      author: "Test author",
      coverUrl: "coverUrl.png",
      inLibrary: true,
      canEdit: true,
    },
  ];
  test("renders table with list of books", () => {
    render(
      <MemoryRouter>
        <BooksList booksData={booksData} />
      </MemoryRouter>
    );
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByText("Test author")).toBeInTheDocument();
    expect(screen.getByText("Test title")).toBeInTheDocument();
  });
  
  test("click on row navigates to book page", async () => {
    render(
      <MemoryRouter initialEntries={["/admin"]}>
        <Routes>
            <Route path="/admin"  element={<BooksList booksData={booksData}/>}/>
            <Route path="/books/1" element={<div>Book page</div>} />
          </Routes>
      </MemoryRouter>
    );
    const tableRow = screen.getByText("Test author");
    await userEvent.click(tableRow)
    await waitFor(()=>{
      expect(screen.getByText("Book page")).toBeInTheDocument()
    })
  });
});
