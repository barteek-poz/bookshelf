import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { AuthContext } from "../../context/AuthContext";
import { ErrorProvider } from "../../context/ErrorContext";
import RecentBooks from "./RecentBooks";
import useFetch from "../../hooks/useFetch";
import ErrorPage from "../../pages/ErrorPage/ErrorPage";

jest.mock("../../hooks/useFetch", () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

test("render recent books", () => {
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
          <RecentBooks />
        </ErrorProvider>
      </AuthContext.Provider>
    </MemoryRouter>
  );
  expect(screen.getByRole("link")).toHaveAttribute("href", "/books/1");
});
test("render nothing when there is no books", () => {
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
          <RecentBooks />
        </ErrorProvider>
      </AuthContext.Provider>
    </MemoryRouter>
  );
  expect(screen.queryByRole("link")).not.toBeInTheDocument()
});


test("render loader when pending", () => {
  (useFetch as jest.Mock).mockReturnValue({
    data: [{
        id: 1,
        author: "Test",
        title: "Title",
        createdBy: 1,
        coverUrl: "coverUrl",
        genre: "genre",
        publishYear: "publishYear",
      },],
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
          <RecentBooks />
        </ErrorProvider>
      </AuthContext.Provider>
    </MemoryRouter>
  );
  expect(screen.getByTestId("grid-loader")).toBeInTheDocument();
});


test("redirect to /error when error", async() => {
  (useFetch as jest.Mock).mockReturnValue({
    data: [],
    isPending: false,
    error: true,
  });
  render(
    <MemoryRouter initialEntries={["/books/search"]}>
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
          <Routes >
          <Route path="/books/search" element={<RecentBooks/>} />
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
