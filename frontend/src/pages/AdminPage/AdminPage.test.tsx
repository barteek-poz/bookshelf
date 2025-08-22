import { render, screen, waitFor } from "@testing-library/react";
import useFetch from "../../hooks/useFetch";
import { MemoryRouter } from "react-router";
import { AuthContext } from "../../context/AuthContext";
import { ErrorProvider } from "../../context/ErrorContext";
import AdminPage from "./AdminPage";
import userEvent from "@testing-library/user-event";

jest.mock("../../hooks/useFetch", () => ({
  __esModule: true,
  default: jest.fn(),
}));

test("renders db summary", async () => {
  (useFetch as jest.Mock).mockReturnValue({
    data: {
      numOfUsers: 3,
      numOfBooks: 5,
    },
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
          <AdminPage />
        </ErrorProvider>
      </AuthContext.Provider>
    </MemoryRouter>
  );
  await waitFor(() => {
    expect(screen.getByText("Number of books in database: 5")).toBeInTheDocument();
    expect(screen.getByText("Number of users: 3")).toBeInTheDocument();
  });
});

describe("buttons behaviour", () => {
  test("fetch users list", async () => {
    (useFetch as jest.Mock).mockReturnValue({
    fetchData: jest.fn().mockResolvedValue([
      { id: 1, name: "User 1", email: "user_1@email.com" },
      { id: 2, name: "User 2", email: "user_2@email.com" },
    ]),
    data: null,
    error: null,
    isPending: false,
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
            <AdminPage />
          </ErrorProvider>
        </AuthContext.Provider>
      </MemoryRouter>
    );
    const showUsersBtn = screen.getByRole("button", { name: "Show all users" });
    await userEvent.click(showUsersBtn);
    await waitFor(()=> {
        expect(screen.getByText("user_1@email.com")).toBeInTheDocument()
        expect(screen.getByText("user_2@email.com")).toBeInTheDocument()
    })
  });
  test("fetch books list", async () => {
    (useFetch as jest.Mock).mockReturnValue({
    fetchData: jest.fn().mockResolvedValue([
      {
        id: 1,
        author: "Test author",
        title: "Test title",
        createdBy: 1,
        coverUrl: "coverUrl",
        genre: "Test genre",
        publishYear: "Test year",
      }
    ]),
    data: null,
    error: null,
    isPending: false,
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
            <AdminPage />
          </ErrorProvider>
        </AuthContext.Provider>
      </MemoryRouter>
    );
    const showUsersBtn = screen.getByRole("button", { name: "Show all books" });
    await userEvent.click(showUsersBtn);
    await waitFor(()=> {
        expect(screen.getByText("Test title")).toBeInTheDocument()
        expect(screen.getByText("Test author")).toBeInTheDocument()
    })
  });
});
