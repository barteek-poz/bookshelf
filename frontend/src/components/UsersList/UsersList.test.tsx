import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { AuthContext } from "../../context/AuthContext";
import UsersList from "./UsersList";
import { ErrorProvider } from "../../context/ErrorContext";
import userEvent from "@testing-library/user-event";
import ErrorPage from "../../pages/ErrorPage/ErrorPage";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

test("renders table with user data", () => {
  const usersData = [
    {
      id: 1,
      user_name: "Test name",
      email: "test@email.com",
    },
    {
      id: 2,
      user_name: "Test name 2",
      email: "test2@email.com",
    },
  ];
  render(
    <MemoryRouter>
      <AuthContext.Provider
        value={{
          user: { id: 1, is_admin: true },
          setAccessToken: jest.fn(),
          setIsAuthenticated: jest.fn(),
          setUser: jest.fn(),
          isAuthenticated: true,
          accessToken: null,
          loading: true,
        }}
      >
        <ErrorProvider>
          <UsersList usersData={usersData} />
        </ErrorProvider>
      </AuthContext.Provider>
    </MemoryRouter>
  );

  expect(screen.getByRole("table")).toBeInTheDocument();
  expect(screen.getByText("Test name")).toBeInTheDocument();
  expect(screen.getByText("test@email.com")).toBeInTheDocument();
  expect(screen.getByText("Test name 2")).toBeInTheDocument();
  expect(screen.getByText("test2@email.com")).toBeInTheDocument();
  expect(screen.getAllByRole("button", { name: /delete/i })[0]).toBeInTheDocument();
  expect(screen.getAllByRole("button", { name: /delete/i })[1]).toBeInTheDocument();
});

describe("delete funtion", () => {
  beforeEach(() => {
    globalThis.fetch = jest.fn();
    window.alert = jest.fn();
  });
  afterEach(() => {
    jest.resetAllMocks();
  });
  test("deleting user", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        message: "User was deleted",
      }),
    });
    const usersData = [
      {
        id: 1,
        user_name: "Test name",
        email: "test@email.com",
      },
    ];

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
            loading: true,
          }}
        >
          <ErrorProvider>
            <UsersList usersData={usersData} />
          </ErrorProvider>
        </AuthContext.Provider>
      </MemoryRouter>
    );
    const deleteBtn = screen.getByRole("button", { name: /delete/i });
    await userEvent.click(deleteBtn);
    const tooltip = screen.getByRole("tooltip");

    expect(tooltip).toBeInTheDocument();

    const confirmBtn = screen.getByRole("button", { name: /yes/i });
    await userEvent.click(confirmBtn);
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("User was successfully deleted.");
    });
  });

  test("error when deleting user", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({}),
    });
    const usersData = [
      {
        id: 1,
        user_name: "Test name",
        email: "test@email.com",
      },
    ];

    render(
      <MemoryRouter initialEntries={["/admin"]}>
        <AuthContext.Provider
          value={{
            user: { id: 1, is_admin: true },
            setAccessToken: jest.fn(),
            setIsAuthenticated: jest.fn(),
            setUser: jest.fn(),
            isAuthenticated: true,
            accessToken: "accessToken",
            loading: true,
          }}
        >
          <ErrorProvider>
            <Routes>
              <Route path="/admin" element={<UsersList usersData={usersData} />} />
              <Route path="/error" element={<ErrorPage />} />
            </Routes>
          </ErrorProvider>
        </AuthContext.Provider>
      </MemoryRouter>
    );
    const deleteBtn = screen.getByRole("button", { name: /delete/i });
    await userEvent.click(deleteBtn);
    const tooltip = screen.getByRole("tooltip");
    expect(tooltip).toBeInTheDocument();
    const confirmBtn = screen.getByRole("button", { name: /yes/i });
    await userEvent.click(confirmBtn);
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/error");
    });
  });
});
