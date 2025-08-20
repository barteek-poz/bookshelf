import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { AuthContext } from "../../context/AuthContext";
import { ErrorProvider } from "../../context/ErrorContext";
import useFetch from "../../hooks/useFetch";
import EditBook from "./EditBook";
import userEvent from "@testing-library/user-event";
import BookPage from "../BookPage/BookPage";

jest.mock("../../components/GenreSelect/GenreSelect", () => ({ control, defaultValue }: { control: any; defaultValue: string | null }) => {
  return (
    <select data-testid="genre-select" defaultValue={defaultValue} {...control}>
      {defaultValue && <option value={defaultValue}>{defaultValue}</option>}
      <option value="fantasy">Fantasy</option>
      <option value="sci-fi">Sci-Fi</option>
    </select>
  );
});

jest.mock("../../hooks/useFetch", () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

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
    error: null,
  });
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
  expect(screen.getByLabelText("Select book cover")).toBeInTheDocument();
  expect(screen.getByDisplayValue("Test title")).toBeInTheDocument();
  expect(screen.getByDisplayValue("Test author")).toBeInTheDocument();
  expect(screen.getByDisplayValue("Test year")).toBeInTheDocument();
  const genreSelect = screen.getByTestId("genre-select") as HTMLSelectElement;
  expect(genreSelect.value).toBe("Test genre");
  expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
});

describe("buttons behaviour", () => {
  beforeEach(() => {
    (globalThis as any).fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });
  });
  test("submit new book data", async () => {
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
      error: null,
    });

    render(
      <MemoryRouter initialEntries={["/books/1/edit"]}>
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
            <Routes>
              <Route path="/books/:id/edit" element={<EditBook />} />
              <Route path="/books/:id" element={<BookPage />} />
            </Routes>
          </ErrorProvider>
        </AuthContext.Provider>
      </MemoryRouter>
    );
    const bookCover = screen.getByAltText("book cover");
    const coverBtn = screen.getByLabelText("Select book cover");
    const titleInput = screen.getByDisplayValue("Test title");
    const authorInput = screen.getByDisplayValue("Test author");
    const yearInput = screen.getByDisplayValue("Test year");
    const genreSelect = screen.getByTestId("genre-select") as HTMLSelectElement;
    const saveBtn = screen.getByRole("button", { name: "Save" });

    const mockFile = new File(["new moc cover img"], "new-cover.png", {
      type: "image/png",
    });

    await userEvent.clear(titleInput);
    await userEvent.type(titleInput, "New title");
    await userEvent.clear(authorInput);
    await userEvent.type(authorInput, "New author");
    await userEvent.clear(yearInput);
    await userEvent.type(yearInput, "2020");
    await userEvent.upload(coverBtn, mockFile);
    await userEvent.selectOptions(genreSelect, "fantasy");

    (useFetch as jest.Mock).mockReturnValueOnce({
      data: {
        id: 1,
        author: "New author",
        title: "New title",
        createdBy: 1,
        coverUrl: "new-cover.png",
        genre: "Fantasy",
        publishYear: "2020",
      },
      isPending: false,
      error: null,
    });

    await userEvent.click(saveBtn);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/books/1");
    });

    await waitFor(() => {
      expect(screen.getByDisplayValue("New title")).toBeInTheDocument();
      expect(screen.getByDisplayValue("New author")).toBeInTheDocument();
      expect(screen.getByDisplayValue("2020")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Fantasy")).toBeInTheDocument();
    });
  });

  test("cancel button", async () => {
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
      error: null,
    });

    render(
      <MemoryRouter initialEntries={["/books/1/edit"]}>
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
            <Routes>
              <Route path="/books/:id/edit" element={<EditBook />} />
              <Route path="/books/:id" element={<BookPage />} />
            </Routes>
          </ErrorProvider>
        </AuthContext.Provider>
      </MemoryRouter>
    );
    const saveBtn = screen.getByRole("button", { name: "Save" });
    await userEvent.click(saveBtn)
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/books/1")
    })
  });
});
