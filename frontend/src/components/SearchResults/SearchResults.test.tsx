import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router"
import SearchResults from "./SearchResults"

test("renders searched books", () => {
    const existingBooks = [
        {
            id: 1, 
            title: "Test title", 
            author: "Test author",
            coverUrl: "coverUrl.png", 
            inLibrary: true, 
            canEdit: false,
        },
        {
            id: 2, 
            title: "Test title 2", 
            author: "Test author 2",
            coverUrl: "coverUrl2.png", 
            inLibrary: false, 
            canEdit: false,
        },
    ]
    render(
        <MemoryRouter>
            <SearchResults existingBooks={existingBooks}/>
        </MemoryRouter>
    )
    expect(screen.getAllByRole("link")[0]).toHaveAttribute("href", "/books/1")
    expect(screen.getAllByRole("link")[1]).toHaveAttribute("href", "/books/2")
})