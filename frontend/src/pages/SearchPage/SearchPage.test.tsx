import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { AuthContext } from "../../context/AuthContext";
import { ErrorProvider } from "../../context/ErrorContext";
import SearchPage from "./SearchPage";

test("renders input with placeholder", () => {
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
          <SearchPage />
        </ErrorProvider>
      </AuthContext.Provider>
    </MemoryRouter>
  );

  expect(
    screen.getByPlaceholderText(
      "Enter the title of the book you are looking for..."
    )
  ).toBeInTheDocument();
});


test("renders search result when title in input is longer than 2 characters", async () => {
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
          <SearchPage/>
        </ErrorProvider>
      </AuthContext.Provider>
    </MemoryRouter>
  );

  const input = screen.getByPlaceholderText("Enter the title of the book you are looking for...")
  fireEvent.change(input, {target: {value:"te"}})
  await waitFor(() => {
    expect(screen.getByText('Results for "te"')).toBeInTheDocument();
  })
});

test("do not renders search result when title in input is 1 character", async () => {
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
          <SearchPage/>
        </ErrorProvider>
      </AuthContext.Provider>
    </MemoryRouter>
  );

  const input = screen.getByPlaceholderText("Enter the title of the book you are looking for...")
  fireEvent.change(input, {target: {value:"t"}})
  await waitFor(() => {
    expect(screen.getByText('Recently added books')).toBeInTheDocument();
    expect(screen.queryByText('Results for "t"')).not.toBeInTheDocument();
  })
});
