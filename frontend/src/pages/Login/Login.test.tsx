import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import AuthContextProvider, { AuthContext } from "../../context/AuthContext";
import { ErrorProvider } from "../../context/ErrorContext";
import Login from "./Login";

beforeEach(() => {
  globalThis.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          accessToken: "test-token",
          user: { id: 1, name: "Test User" },
        }),
    } as Response)
  ) as jest.Mock;
});

afterEach(() => {
  jest.resetAllMocks();
});

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

test("renders form elements", async () => {
  render(
    <MemoryRouter>
      <AuthContextProvider>
        <ErrorProvider>
          <Login />
        </ErrorProvider>
      </AuthContextProvider>
    </MemoryRouter>
  );
  await waitFor(() => {
    expect(screen.getByText("Bookshelf")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "here" }));
  });
});


test("transfers user to /signup page", async () => {
  render(
    <MemoryRouter initialEntries={["/login"]}>
      <AuthContextProvider>
        <ErrorProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<div>Signup</div>} />
          </Routes>
        </ErrorProvider>
      </AuthContextProvider>
    </MemoryRouter>
  );
    await waitFor(() => {
    const signupLink = screen.getByRole("link", { name: "here" })
    fireEvent.click(signupLink)
    expect(screen.getByText("Signup")).toBeInTheDocument()
  });
});


test("navigates to '/' after successfull login", async () => {
  const mockSetAccessToken = jest.fn();
  const mockSetIsAuthenticated = jest.fn();
  const mockSetUser = jest.fn();
  render(
    <AuthContext.Provider
      value={{
        setAccessToken: mockSetAccessToken,
        setIsAuthenticated: mockSetIsAuthenticated,
        setUser: mockSetUser,
        isAuthenticated: false,
        accessToken: "",
        user: null,
        loading: false,
      }}
    >
      <MemoryRouter>
        <ErrorProvider>
          <Login />
        </ErrorProvider>
      </MemoryRouter>
    </AuthContext.Provider>
  );

  fireEvent.change(screen.getByLabelText("Email"), {
    target: { value: "test@test.com" },
  });
  fireEvent.change(screen.getByLabelText("Password"), {
    target: { value: "password" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Login" }));
  await waitFor(() => {
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});

describe("failed login", () => {
  beforeEach(() => {
    globalThis.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ message: "Invalid credentials" }),
      } as Response)
    ) as jest.Mock;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("render error message after failed login", async () => {
    render(
      <AuthContext.Provider
        value={{
          setAccessToken: jest.fn(),
          setIsAuthenticated: jest.fn(),
          setUser: jest.fn(),
          isAuthenticated: false,
          accessToken: "",
          user: null,
          loading: false,
        }}
      >
        <MemoryRouter>
          <ErrorProvider>
            <Login />
          </ErrorProvider>
        </MemoryRouter>
      </AuthContext.Provider>
    );

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "wrong@test.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "wrongpass" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Login" }));
    await waitFor(() => {
      expect(screen.getByText("Invalid email or password")).toBeInTheDocument();
    });
  });
});
