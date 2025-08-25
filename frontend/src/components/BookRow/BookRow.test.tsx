import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router"
import BookRow from "./BookRow"

test("renders book shelf with book element", () => {
     const books = [
    {
      id: 1,
      title: "Test title",
      author: "Test author",
      coverUrl: "coverUrl.png",
      inLibrary: true,
      canEdit: true,
    },
  ];
    render(
        <MemoryRouter>
            <BookRow books={books}/>
        </MemoryRouter>
    )
    expect(screen.getByAltText("shelf-img")).toBeInTheDocument()
    expect(screen.getByRole("link")).toHaveAttribute("href", "/books/1")
})