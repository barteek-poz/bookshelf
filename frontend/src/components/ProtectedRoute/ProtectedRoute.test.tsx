import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { AuthContext } from "../../context/AuthContext";
import ProtectedRoute from "./ProtectedRoute";

test("return to login when no context", () => {
  render(
    <MemoryRouter initialEntries={["/protected"]}>
      <AuthContext.Provider
        value={{
          user: null,
          setAccessToken: jest.fn(),
          setIsAuthenticated: jest.fn(),
          setUser: jest.fn(),
          isAuthenticated: false,
          accessToken: null,
          loading: false,
        }}
      >
        <Routes>
          <Route
            path="/protected"
            element={
              <ProtectedRoute>
                <div>Children element</div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div>Login page</div>} />
        </Routes>
      </AuthContext.Provider>
    </MemoryRouter>
  );

  expect(screen.getByText("Login page")).toBeInTheDocument();
});

test("render children element", () => {
  render(
    <MemoryRouter initialEntries={["/protected"]}>
      <AuthContext.Provider
        value={{
          user: { id: 1, is_admin: false },
          setAccessToken: jest.fn(),
          setIsAuthenticated: jest.fn(),
          setUser: jest.fn(),
          isAuthenticated: true,
          accessToken: null,
          loading: false,
        }}
      >
        <ProtectedRoute children={<div>Children page</div>} />
      </AuthContext.Provider>
    </MemoryRouter>
  );

  expect(screen.getByText("Children page")).toBeInTheDocument();
});

test("render loader", () => {
  render(
    <MemoryRouter initialEntries={["/protected"]}>
      <AuthContext.Provider
        value={{
          user: { id: 1, is_admin: false },
          setAccessToken: jest.fn(),
          setIsAuthenticated: jest.fn(),
          setUser: jest.fn(),
          isAuthenticated: true,
          accessToken: null,
          loading: true,
        }}
      >
        <ProtectedRoute children={<div>Children page</div>} />
      </AuthContext.Provider>
    </MemoryRouter>
  );

  expect(screen.getByTestId("grid-loader")).toBeInTheDocument();
});
