import { act, renderHook, waitFor } from "@testing-library/react";
import { useAuth } from "../context/AuthContext";
import useFetch from "./useFetch";
import { message } from "antd";

jest.mock("../context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

describe("useFetch test", () => {
  const mockAccessToken = "accessToken";
  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({ accessToken: mockAccessToken });
    globalThis.fetch = jest.fn();
  });
  afterEach(() => {
    jest.resetAllMocks();
  });

  test("fetch data successfully", async () => {
    const mockData = { data: { id: 1, title: "Test title" } };
    (globalThis.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    const { result } = renderHook(() => useFetch("/api/get-book"));
    expect(result.current.isPending).toBe(true);
    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });
    expect(result.current.data).toEqual(mockData.data);
    expect(result.current.error).toBe(null);
  });

  test("fetch error", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 404,
      text: async () => "Not found",
    });

    const { result } = renderHook(() => useFetch("/api/invalid-url"));
    expect(result.current.isPending).toBe(true);
    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });
    expect(result.current.error).toEqual({ message: "Not found", code: 404 });
    expect(result.current.data).toBe(null);
  });

  test("throw error when no url", async () => {
    const { result } = renderHook(() => useFetch());
    await act(async () => {                 // need to call useFetch by hand because no url
      await result.current.fetchData();
    });
    expect(result.current.error).toEqual({ message: "No URL provided", code: 400 });
    expect(result.current.data).toBe(null);
  });
});
