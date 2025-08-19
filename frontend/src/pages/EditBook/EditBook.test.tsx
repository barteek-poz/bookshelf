import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { AuthContext } from "../../context/AuthContext";
import { ErrorProvider } from "../../context/ErrorContext";
import useFetch from "../../hooks/useFetch";
import EditBook from "./EditBook";

jest.mock("../../components/GenreSelect/GenreSelect", () => ({ control, defaultValue }: {control: any; defaultValue: string | null}) => {
  return (
    <select data-testid="genre-select" defaultValue={defaultValue} {...control}>
      {defaultValue && <option value={defaultValue}>{defaultValue}</option> }
      <option value="fantasy">Fantasy</option>
      <option value="sci-fi">Sci-Fi</option>
    </select>
  );
});

jest.mock("../../hooks/useFetch", () => ({
    __esModule: true,
    default: jest.fn()
}))

test("form render", async () => {
   (useFetch as jest.Mock).mockReturnValue({
    data: {
            id: 1,
            author: "Test author",
            title: "Test title",
            createdBy: 1,
            coverUrl: "coverUrl",
            genre: "Test genre",
            publishYear: "Test year",
              },
    isPending: false, 
    error: null
    })
  render(
    <MemoryRouter>
      <AuthContext.Provider
        value={{
          user: { id: 1, is_admin: false },
          setAccessToken: jest.fn(),
          setIsAuthenticated: jest.fn(),
          setUser: jest.fn(),
          isAuthenticated: true,
          accessToken: "accessToken",
          loading: false,
        }}
      >
        <ErrorProvider>
          <EditBook />
        </ErrorProvider>
      </AuthContext.Provider>
    </MemoryRouter>
  );
  expect(screen.getByAltText("book cover")).toHaveAttribute("src", "coverUrl");
  expect(screen.getByLabelText("Select book cover")).toBeInTheDocument()
  expect(screen.getByDisplayValue("Test title")).toBeInTheDocument()
  expect(screen.getByDisplayValue("Test author")).toBeInTheDocument()
  expect(screen.getByDisplayValue("Test year")).toBeInTheDocument()
  const genreSelect = screen.getByTestId("genre-select") as HTMLSelectElement
  expect(genreSelect.value).toBe("Test genre")
  expect(screen.getByRole("button", {name: "Save"})).toBeInTheDocument()
  expect(screen.getByRole("button", {name: "Cancel"})).toBeInTheDocument()
});

describe("buttons behaviour", () => {
    test("submit new book data", () => {
        
    })
})
