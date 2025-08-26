import { render, renderHook, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import GenreSelect from "./GenreSelect";
import { useForm } from "react-hook-form";
import { BookInputType } from "../../types/bookTypes";
import useFetch from "../../hooks/useFetch";
import { ErrorProvider } from "../../context/ErrorContext";
import userEvent from "@testing-library/user-event";
import ErrorPage from "../../pages/ErrorPage/ErrorPage";

jest.mock("../../hooks/useFetch", () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("initial render", () => {
  (useFetch as jest.Mock).mockReturnValue({
    data: [
      { id: 1, value: "novel", label: "novel" },
      { id: 2, value: "poetry", label: "poetry" },
      { id: 3, value: "crime", label: "crime" },
    ],
    isPending: false,
    error: null,
  });
  test("renders genres", async () => {
    const { result } = renderHook(() => useForm<BookInputType>());
    const { control } = result.current;
    render(
      <MemoryRouter>
        <ErrorProvider>
          <GenreSelect control={control} defaultValue={null} />
        </ErrorProvider>
      </MemoryRouter>
    );
    expect(screen.getByText("Select genre")).toBeInTheDocument();
    const select = screen.getByRole("combobox");
    await userEvent.click(select);
    await waitFor(() => {
      expect(screen.getByText("Novel")).toBeInTheDocument();
      expect(screen.getByText("Poetry")).toBeInTheDocument();
      expect(screen.getByText("Crime")).toBeInTheDocument();
    });
  });

  test("render initial value", async () => {
    const { result } = renderHook(() =>
      useForm<BookInputType>({
        defaultValues: { genre: "novel" },
      })
    );
    const { control } = result.current;
    render(
      <MemoryRouter>
        <ErrorProvider>
          <GenreSelect control={control} defaultValue="novel" />
        </ErrorProvider>
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText("Novel")).toBeInTheDocument();
    });
  });
});

test("renders error message", async () => {
  (useFetch as jest.Mock).mockReturnValue({
    data: [],
    isPending: false,
    error: true,
  });
  const { result } = renderHook(() => useForm<BookInputType>());
  const { control } = result.current;
  render(
    <MemoryRouter initialEntries={["/books/edit/1"]}>
      <ErrorProvider>
        <Routes>
          <Route path="/books/edit/1" element={<GenreSelect control={control} defaultValue={null} />} />
          <Route path="/error" element={<ErrorPage />} />
        </Routes>
      </ErrorProvider>
    </MemoryRouter>
  );
  await waitFor(() => {
   expect(mockNavigate).toHaveBeenCalledWith("/error");
  });
});
