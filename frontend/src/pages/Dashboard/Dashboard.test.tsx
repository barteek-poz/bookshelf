import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { ErrorProvider } from "../../context/ErrorContext";
import Dashboard from "./Dashboard";
import useFetch from "../../hooks/useFetch";
import ErrorPage from "../ErrorPage/ErrorPage";

jest.mock("../../hooks/useFetch", () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

test("renders books", async () => {
  (useFetch as jest.Mock).mockReturnValue({
    data: [
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
          <Dashboard />
        </ErrorProvider>
      </AuthContext.Provider>
    </MemoryRouter>
  );
  await waitFor(() => {
    expect(screen.getByAltText("shelf-img")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute("href", "/books/1");
  });
});

test("renders message when no books in library", async () => {
  (useFetch as jest.Mock).mockReturnValue({
    data: [],
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
          <Dashboard />
        </ErrorProvider>
      </AuthContext.Provider>
    </MemoryRouter>
  );
  await waitFor(() => {
    expect(screen.getByText("You don't have any book in your library.")).toBeInTheDocument();
  });
});

test("rendering loader when pending equals true", () => {
  (useFetch as jest.Mock).mockReturnValue({
    data: null,
    isPending: true,
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
          <Dashboard />
        </ErrorProvider>
      </AuthContext.Provider>
    </MemoryRouter>
  );

  expect(screen.getByText("Loading...")).toBeInTheDocument();
});

test("rendering error message when error", async () => {
  (useFetch as jest.Mock).mockReturnValue({
    data: null,
    isPending: false,
    error: true,
  });
  render(
    <MemoryRouter initialEntries={["/"]}>
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
            <Route path="/" element={<Dashboard />} />
            <Route path="/error" element={<ErrorPage />} />
          </Routes>
        </ErrorProvider>
      </AuthContext.Provider>
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(mockNavigate).toHaveBeenCalledWith("/error");
  });
});
