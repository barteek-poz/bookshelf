import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import AuthContextProvider, { AuthContext } from "../../context/AuthContext";
import { ErrorProvider } from "../../context/ErrorContext";
import Signup from "./Signup";

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
          <Signup />
        </ErrorProvider>
      </AuthContextProvider>
    </MemoryRouter>
  );
  await waitFor(() => {
    expect(screen.getByText("Bookshelf")).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByLabelText("PasswordConfirm")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create account" })).toBeInTheDocument();
    expect(screen.getByRole("link", {name:"here"}))
  });
});

test("navigates to '/' after successfull signup", async () => {
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
      }}>
      <MemoryRouter>
        <ErrorProvider>
          <Signup />
        </ErrorProvider>
      </MemoryRouter>
    </AuthContext.Provider>
  );

  fireEvent.change(screen.getByLabelText("Name"), {
    target: { value: "Test" },
  });
  fireEvent.change(screen.getByLabelText("Email"), {
    target: { value: "test@test.com" },
  });
  fireEvent.change(screen.getByLabelText("Password"), {
    target: { value: "password" },
  });
  fireEvent.change(screen.getByLabelText("PasswordConfirm"), {
    target: { value: "password" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Create account" }));
  await waitFor(() => {
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});


describe("failed signup with wrong password", () => {
  test("render error message after failed signup with wrong passwords", async () => {
    globalThis.fetch = jest.fn(() =>
        Promise.resolve({
          ok: false,
          json: () => Promise.resolve({ message: "Passwords do not match" }),
        } as Response)
      ) as jest.Mock;
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
        }}>
        <MemoryRouter>
          <ErrorProvider>
            <Signup/>
          </ErrorProvider>
        </MemoryRouter>
      </AuthContext.Provider>
    );

    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Name" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@test.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "wrongpass" },
    });
    fireEvent.change(screen.getByLabelText("PasswordConfirm"), {
      target: { value: "wrongpass1" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Create account" }));
    await waitFor(() => {
      expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
    });
  });

  test("render error message after failed signup because of existing user", async () => {
    globalThis.fetch = jest.fn(() =>
        Promise.resolve({
          ok: false,
          json: () => Promise.resolve({ message: "User with this email is already signed up" }),
        } as Response)
      ) as jest.Mock;
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
        }}>
        <MemoryRouter>
          <ErrorProvider>
            <Signup/>
          </ErrorProvider>
        </MemoryRouter>
      </AuthContext.Provider>
    );

    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Name" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "wrong@test.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "pass" },
    });
    fireEvent.change(screen.getByLabelText("PasswordConfirm"), {
      target: { value: "pass" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Create account" }));
    await waitFor(() => {
      expect(screen.getByText("User with this email is already signed up")).toBeInTheDocument();
    });
  });
});
