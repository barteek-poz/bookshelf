import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { AuthContext } from "../../context/AuthContext";
import { ErrorProvider } from "../../context/ErrorContext";
import Dashboard from "./Dashboard";

describe("successfull books fetch", () => {
  beforeEach(() => {
    globalThis.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            data: [
              {
                id: 1,
                author: "Test",
                title: "Title",
                createdBy: 1,
                coverUrl: "coverUrl",
                genre: "genre",
                publishYear: "publishYear",
              },
            ],
          }),
      } as Response)
    ) as jest.Mock;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("renders books", async () => {
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
          }}>
          <ErrorProvider>
            <Dashboard />
          </ErrorProvider>
        </AuthContext.Provider>
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByAltText("shelf-img")).toBeInTheDocument();
      expect(screen.getByRole("link")).toHaveAttribute("href", "/books/1");
    });
  });
});
