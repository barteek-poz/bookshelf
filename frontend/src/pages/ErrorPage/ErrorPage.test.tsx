import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { ErrorContext } from "../../context/ErrorContext";
import ErrorPage from "../ErrorPage/ErrorPage";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

test("error page display error message", () => {
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
        <ErrorContext.Provider value={{
            errorMsg: "Error message",
            setErrorMsg: jest.fn()
        }}>
          <ErrorPage/>
        </ErrorContext.Provider>
      </AuthContext.Provider>
    </MemoryRouter>
  );
  expect(screen.getByText("Error message")).toBeInTheDocument()
})

test("navigate to '/' when no error message", async () => {
render(
    <MemoryRouter initialEntries={["/error"]}>
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
        <ErrorContext.Provider value={{
            errorMsg: null,
            setErrorMsg: jest.fn()
        }}>
         <Routes>
            <Route path="/error" element={<ErrorPage />} />
            <Route path="/" element={<div>Dashboard</div>} />
          </Routes>
        </ErrorContext.Provider>
      </AuthContext.Provider>
    </MemoryRouter>
  );
  await waitFor(() => {
    expect(screen.getByText("Dashboard")).toBeInTheDocument()
  })
  expect(screen.queryByRole("heading", { level: 1 })).not.toBeInTheDocument();
})