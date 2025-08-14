import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { AuthContext } from "../../context/AuthContext";
import { ErrorProvider } from "../../context/ErrorContext";
import AddBook from "./AddBook";

jest.mock("../../components/GenreSelect/GenreSelect", () => ({
  __esModule: true,
  default: () => <div data-testid="genre-select" />,
}));

jest.mock("../../components/BookPropositions/BookPropositions", () => ({
  __esModule: true,
  default: ({ previewExistingBookHandler }: any) => (
    <ul data-testid="book-propositions">
      <li
        role="listitem"
        onClick={() =>
          previewExistingBookHandler({
            id: 1,
            author: "Test",
            title: "Title",
            coverUrl: "coverUrl",
          })
        }
      >
        Title
      </li>
    </ul>
  ),
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

test("form render", () => {
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
          <AddBook />
        </ErrorProvider>
      </AuthContext.Provider>
    </MemoryRouter>
  );
  expect(screen.getByAltText("cover preview")).toBeInTheDocument();
  expect(screen.getByLabelText("Select book cover")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Book title")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Author")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Publish year")).toBeInTheDocument();
  expect(screen.getByTestId("genre-select")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
});

describe("book propositions after typing in title input", () => {
  beforeEach(() => {
    globalThis.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
  test("book proposition renders after 2 characters", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        books: [
          {
            id: 1,
            author: "Test",
            title: "Title",
            createdBy: 1,
            coverUrl: "coverUrl",
            genre: "genre",
            publishYear: "publishYear",
          },
        ],
      }),
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
            <AddBook />
          </ErrorProvider>
        </AuthContext.Provider>
      </MemoryRouter>
    );
    const input = screen.getByPlaceholderText("Book title");
    const bookCover = screen.getByAltText("cover preview");
    await userEvent.type(input, "ti");
    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalled();
      expect(screen.getByTestId("book-propositions")).toBeInTheDocument();
    });
    const firstProposition = screen.getAllByRole("listitem")[0];
    await userEvent.click(firstProposition);
    await waitFor(() => {
      expect(bookCover).toHaveAttribute("src", "coverUrl");
    });
  });

  test("book propositions do not renders when there is no books in db", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ books: [] }),
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
            <AddBook />
          </ErrorProvider>
        </AuthContext.Provider>
      </MemoryRouter>
    );
    const input = screen.getByPlaceholderText("Book title");
    await userEvent.type(input, "ti");
    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalled();
      expect(screen.queryByTestId("book-propositions")).not.toBeInTheDocument();
    });
  });
});

describe("buttons behaviour", () => {
  beforeEach(() => {
    globalThis.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
  test("error when try to submit empty input", async () => {
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
            <AddBook />
          </ErrorProvider>
        </AuthContext.Provider>
      </MemoryRouter>
    );

    const submitBtn = screen.getByRole("button", { name: "Save" });
    await userEvent.click(submitBtn);
    await waitFor(() => {
      expect(screen.getByText("Please provide book title")).toBeInTheDocument();
      expect(
        screen.getByText("Please provide book author")
      ).toBeInTheDocument();
    });
  });

  test("submit book in db", async () => {
    (globalThis.fetch as jest.Mock).mockImplementation((url) => {
      if (url.includes("search-by-title")) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ books: [] }),
        }) as unknown as Response;
      }
      if (url.includes("add")) {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            data: { id: 1, title: "Test title", author: "Test author" },
          }),
        }) as unknown as Response;
      }
      throw new Error(`Unexpected fetch URL: ${url}`);
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
            <AddBook />
          </ErrorProvider>
        </AuthContext.Provider>
      </MemoryRouter>
    );

    const titleInput = screen.getByPlaceholderText("Book title");
    const authorInput = screen.getByPlaceholderText("Author");
    const submitBtn = screen.getByRole("button", { name: "Save" });
    await userEvent.type(titleInput, "Test title");
    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.stringContaining("search-by-title"),
        expect.any(Object)
      );
    });
    await userEvent.type(authorInput, "Test author");
    await userEvent.click(submitBtn);
    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.stringContaining("add"),
        expect.any(Object)
      );
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });
  test("cover preview changes after selecting new cover", async () => {
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
            <AddBook />
          </ErrorProvider>
        </AuthContext.Provider>
      </MemoryRouter>
    );
    const bookCoverPreview = screen.getByAltText(
      "cover preview"
    ) as HTMLImageElement;
    const fileInput = screen.getByLabelText("Select book cover");
    const mockFile = new File(["mock cover img"], "cover.png", {
      type: "image/png",
    });
    await userEvent.upload(fileInput, mockFile);
    await waitFor(() => {
      expect(bookCoverPreview.src).toMatch(/^data:image\/png;base64,/);
    });
  });

  test("clear inputs when cancel", () => {
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
            <AddBook />
          </ErrorProvider>
        </AuthContext.Provider>
      </MemoryRouter>
    );

    const bookCoverPreview = screen.getByAltText("cover preview");
    const fileInput = screen.getByLabelText("Select book cover");
    const titleInput = screen.getByPlaceholderText("Book title");
    const authorInput = screen.getByPlaceholderText("Author");
    const publishInput = screen.getByPlaceholderText("Publish year");
    const genreInput = screen.getByTestId("genre-select");
    const cancelBtn = screen.getByRole("button", { name: "Cancel" });
  });
});
