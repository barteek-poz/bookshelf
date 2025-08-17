import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, useParams, Routes, Route } from "react-router";
import { AuthContext } from "../../context/AuthContext";
import { ErrorProvider } from "../../context/ErrorContext";
import BookPage from "./BookPage";
import useFetch from "../../hooks/useFetch";
import userEvent from "@testing-library/user-event";
import EditBook from "../EditBook/EditBook";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useParams: () => ({ id: "1" }),
}));

jest.mock("../../hooks/useFetch", () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe("initial render", () => {
  test("render book data, edit and remove btns", async () => {
    (useFetch as jest.Mock).mockReturnValue({
      data: {
        id: 1,
        author: "Test author",
        title: "Test title",
        createdBy: 1,
        coverUrl: "coverUrl",
        genre: "Test genre",
        publishYear: "Test year",
        inLibrary: true,
        canEdit: true,
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
            <BookPage />
          </ErrorProvider>
        </AuthContext.Provider>
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByAltText("book cover")).toHaveAttribute("src", "coverUrl");
      expect(screen.getByText("Test title")).toBeInTheDocument();
      expect(screen.getByText("Test author")).toBeInTheDocument();
      expect(screen.getByText("Test genre")).toBeInTheDocument();
      expect(screen.getByText("Test year")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Edit book" })).toBeInTheDocument();
      expect(screen.queryByRole("button", { name: "Remove book from library" })).toBeInTheDocument();
    });
  });

  test("render book data, add to library btn", async () => {
    (useFetch as jest.Mock).mockReturnValue({
      data: {
        id: 1,
        author: "Test author",
        title: "Test title",
        createdBy: 1,
        coverUrl: "coverUrl",
        genre: "Test genre",
        publishYear: "Test year",
        inLibrary: false,
        canEdit: false,
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
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Add book to your library" })).toBeInTheDocument();
    });
  });

  test("render remove from db btn", async () => {
    (useFetch as jest.Mock).mockReturnValue({
      data: {
        id: 1,
        author: "Test author",
        title: "Test title",
        createdBy: 1,
        coverUrl: "coverUrl",
        genre: "Test genre",
        publishYear: "Test year",
        inLibrary: false,
        canEdit: false,
      },
      isPending: false,
      error: null,
    });
    render(
      <MemoryRouter>
        <AuthContext.Provider
          value={{
            user: { id: 1, is_admin: true },
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
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Remove book from database" })).toBeInTheDocument();
    });
  });
});

describe("buttons behaviour", () => {
  test("add book to library", async () => {
    (useFetch as jest.Mock).mockReturnValue({
      data: {
        id: 1,
        author: "Test author",
        title: "Test title",
        createdBy: 1,
        coverUrl: "coverUrl",
        genre: "Test genre",
        publishYear: "Test year",
        inLibrary: false,
        canEdit: false,
      },
      isPending: false,
      error: null,
    });
    render(
      <MemoryRouter>
        <AuthContext.Provider
          value={{
            user: { id: 1, is_admin: true },
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
    const addBtn = screen.getByRole("button", { name: "Add book to your library" });
    await userEvent.click(addBtn);
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });
  test("remove book from library", async () => {
    (useFetch as jest.Mock).mockReturnValue({
      data: {
        id: 1,
        author: "Test author",
        title: "Test title",
        createdBy: 1,
        coverUrl: "coverUrl",
        genre: "Test genre",
        publishYear: "Test year",
        inLibrary: true,
        canEdit: false,
      },
      isPending: false,
      error: null,
    });
    render(
      <MemoryRouter>
        <AuthContext.Provider
          value={{
            user: { id: 1, is_admin: true },
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
    const removeBtn = screen.getByRole("button", { name: "Remove book from library" });
    await userEvent.click(removeBtn);
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });
  test("edit book", async () => {
    (useFetch as jest.Mock).mockReturnValue({
      data: {
        id: 1,
        author: "Test author",
        title: "Test title",
        createdBy: 1,
        coverUrl: "coverUrl",
        genre: "Test genre",
        publishYear: "Test year",
        inLibrary: true,
        canEdit: true,
      },
      isPending: false,
      error: null,
    });
    render(
      <MemoryRouter initialEntries={["/books/1"]}>
        <AuthContext.Provider
          value={{
            user: { id: 1, is_admin: true },
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
              <Route path="/books/:id" element={<BookPage />} />
              <Route path="/books/:id/edit" element={<div>Edit book</div>} />
            </Routes>
          </ErrorProvider>
        </AuthContext.Provider>
      </MemoryRouter>
    );
    const editBtn = screen.getByRole("link", { name: "Edit book" });
    await userEvent.click(editBtn);
    expect(screen.getByText("Edit book")).toBeInTheDocument()
  });
});
