import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router";
import { AuthContext } from "../../context/AuthContext";
import { ErrorProvider } from "../../context/ErrorContext";
import Menu from "./Menu";

test("renders menu links", async () => {
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
          <Menu />
        </ErrorProvider>
      </AuthContext.Provider>
    </MemoryRouter>
  );
  expect(screen.getByRole("link", { name: /library/i })).toHaveAttribute("href", "/");
  expect(screen.getByRole("link", { name: /search/i })).toHaveAttribute("href", "/books/search");
  expect(screen.getByRole("link", { name: /add book/i })).toHaveAttribute("href", "/books/add");
  expect(screen.getByRole("link", { name: /admin panel/i })).toHaveAttribute("href", "/admin");
  expect(screen.getByRole("link", { name: /logout/i })).toHaveAttribute("href", "/login");
});

test("not render admin panel when user is not admin", async () => {
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
          <Menu />
        </ErrorProvider>
      </AuthContext.Provider>
    </MemoryRouter>
  );
   expect(screen.queryByRole("link", { name: /admin panel/i })).not.toBeInTheDocument()
});

describe("nav buttons test", () => {
  test("search button", async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
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
              <Route path="/" element={<Menu />} />
              <Route path="/books/search" element={<div>Search page</div>} />
            </Routes>
          </ErrorProvider>
        </AuthContext.Provider>
      </MemoryRouter>
    );
    const searchBtn = screen.getByRole("link", { name: /search/i });
    await userEvent.click(searchBtn);
    await waitFor(() => {
      expect(screen.getByText("Search page")).toBeInTheDocument()
    });
  });
  test("search button", async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
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
              <Route path="/" element={<Menu />} />
              <Route path="/books/add" element={<div>Add book</div>} />
            </Routes>
          </ErrorProvider>
        </AuthContext.Provider>
      </MemoryRouter>
    );
    const addBtn = screen.getByRole("link", { name: /add book/i });
    await userEvent.click(addBtn);
    await waitFor(() => {
      expect(screen.getByText("Add book")).toBeInTheDocument()
    });
  });
  test("admin button", async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
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
              <Route path="/" element={<Menu />} />
              <Route path="/admin" element={<div>Admin page</div>} />
            </Routes>
          </ErrorProvider>
        </AuthContext.Provider>
      </MemoryRouter>
    );
    const adminBtn = screen.getByRole("link", { name: /admin panel/i });
    await userEvent.click(adminBtn);
    await waitFor(() => {
      expect(screen.getByText("Admin page")).toBeInTheDocument()
    });
  });
  test("logout button", async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
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
              <Route path="/" element={<Menu />} />
              <Route path="/login" element={<div>Login page</div>} />
            </Routes>
          </ErrorProvider>
        </AuthContext.Provider>
      </MemoryRouter>
    );
    const logoutBtn = screen.getByRole("link", { name: /logout/i });
    await userEvent.click(logoutBtn);
    await waitFor(() => {
      expect(screen.getByText("Login page")).toBeInTheDocument()
    });
  });
});
