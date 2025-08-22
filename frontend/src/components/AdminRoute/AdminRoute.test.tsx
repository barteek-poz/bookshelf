import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router";
import { AuthContext } from "../../context/AuthContext";
import { ErrorProvider } from "../../context/ErrorContext";
import AdminRoute from "./AdminRoute";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

test("render children element", () => {
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
          <AdminRoute children={<div>Children element</div>} />
        </ErrorProvider>
      </AuthContext.Provider>
    </MemoryRouter>
  );
  expect(screen.getByText("Children element")).toBeInTheDocument();
});

test("navigates to '/' when user is not admin", async () => {
  render(
    <MemoryRouter initialEntries={["/admin"]}>
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
            <Route path="/admin" element={<AdminRoute children={<div>Children element</div>}/>} />
            <Route path="/" element={<div>Dashboard</div>} />
          </Routes>
        </ErrorProvider>
      </AuthContext.Provider>
    </MemoryRouter>
  );
  await waitFor(() => {
    expect(screen.getByText("Dashboard")).toBeInTheDocument()
  })
});
