import { act, renderHook } from "@testing-library/react";
import { useErrorHandler } from "./useErrorHandler";
import { ErrorContext, ErrorProvider } from "../context/ErrorContext";
import { ReactNode } from "react";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

test("error message passed to context, navigate to /error", () => {
  const setErrorMsg = jest.fn();
  const errorWrapper = ({ children }: { children: ReactNode }) => <ErrorContext.Provider value={{ errorMsg: "", setErrorMsg }}>{children}</ErrorContext.Provider>;
  const { result } = renderHook(() => useErrorHandler(), { wrapper: errorWrapper });
  act(() => {
    result.current.errorHandler("Error message");
  });
  expect(setErrorMsg).toHaveBeenCalledWith("Error message");
  expect(mockNavigate).toHaveBeenCalledWith("/error");
});
