import { render, screen, waitFor } from "@testing-library/react";
import Login from "./Login";
import { MemoryRouter } from "react-router";
import { ErrorProvider } from "../../context/ErrorContext";
import AuthContextProvider from "../../context/AuthContext";

beforeEach(() => {
  globalThis.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ accessToken: "test-token", user: { id: 1, name: "Test User" } }),
    } as Response)
  ) as jest.Mock;
});

afterEach(() => {
  jest.resetAllMocks();
});

test("renders Bookshelf logo", async () => {
  render(
    <MemoryRouter>
      <AuthContextProvider>
        <ErrorProvider>
          <Login />
        </ErrorProvider>
      </AuthContextProvider>
    </MemoryRouter>
  );

  // Czekamy aż tekst pojawi się na ekranie - bo AuthProvider ustawia loading false asynchronicznie
  await waitFor(() => {
    expect(screen.getByText("Bookshelf")).toBeInTheDocument();
  });
});
