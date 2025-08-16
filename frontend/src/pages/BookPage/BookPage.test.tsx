import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { AuthContext } from "../../context/AuthContext";
import { ErrorProvider } from "../../context/ErrorContext";
import BookPage from "./BookPage";
import useFetch from "../../hooks/useFetch";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("../../hooks/useFetch", () => ({
  __esModule: true,
  default: jest.fn(),
}));

const fetchResInLibrary = () =>
  (useFetch as jest.Mock).mockImplementation((url: string) => {
    if (url.includes("http://localhost:3000/api/v1/books")) {
      return {
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
      };
    }
    if (url.includes("http://localhost:3000/api/v1/users")) {
      return {
        data: [
          {
            id: 1,
            author: "Test author",
            title: "Test title",
            createdBy: 1,
            coverUrl: "coverUrl",
            genre: "Test genre",
            publishYear: "Test year",
          },
        ],
        isPending: false,
        error: null,
      };
    }
    throw new Error(`Unexpected fetch URL: ${url}`);
  });

const fetchResNotInLibrary = () =>
  (useFetch as jest.Mock).mockImplementation((url: string) => {
    if (url.includes("http://localhost:3000/api/v1/books")) {
      return {
        data: {
          id: 1,
          author: "Test author",
          title: "Test title",
          createdBy: 2,
          coverUrl: "coverUrl",
          genre: "Test genre",
          publishYear: "Test year",
        },
        isPending: false,
        error: null,
      };
    }
    if (url.includes("http://localhost:3000/api/v1/users")) {
      return {
        data: [
          {
            id: 2,
            author: "Test author 2",
            title: "Test title 2",
            createdBy: 2,
            coverUrl: "coverUrl 2",
            genre: "Test genre",
            publishYear: "Test year 2",
          },
        ],
        isPending: false,
        error: null,
      };
    }
    throw new Error(`Unexpected fetch URL: ${url}`);
  });

describe("initial render when book in library", () => {
  beforeEach(() => {
    fetchResInLibrary();
  });
  test("render book data, edit and remove btns", async () => {
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
            <BookPage />
          </ErrorProvider>
        </AuthContext.Provider>
      </MemoryRouter>
    );
    expect(screen.getByAltText("book cover")).toHaveAttribute("src", "coverUrl");
    expect(screen.getByText("Test title")).toBeInTheDocument();
    expect(screen.getByText("Test author")).toBeInTheDocument();
    expect(screen.getByText("Test genre")).toBeInTheDocument();
    expect(screen.getByText("Test year")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Edit book" })).toBeInTheDocument();
    waitFor(() => {
      expect(screen.getByRole("button", { name: "Remove from library" })).toBeInTheDocument();
    })
  });
});

describe("initial render when book not in library", () => {
  beforeEach(() => {
    fetchResNotInLibrary();
  });
  test("render book data, add to library btn", async () => {
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
            <BookPage />
          </ErrorProvider>
        </AuthContext.Provider>
      </MemoryRouter>
    );
    expect(screen.getByAltText("book cover")).toHaveAttribute("src", "coverUrl");
    expect(screen.getByText("Test title")).toBeInTheDocument();
    expect(screen.getByText("Test author")).toBeInTheDocument();
    expect(screen.getByText("Test genre")).toBeInTheDocument();
    expect(screen.getByText("Test year")).toBeInTheDocument();
    waitFor(() => {
      expect(screen.getByRole("button", { name: "Add book to your library" })).toBeInTheDocument();
    })
  });
});
