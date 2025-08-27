import { JSX, ReactNode } from "react";
import { AuthContext } from "../context/AuthContext";
import { renderHook } from "@testing-library/react";
import useAuthUser from "./useAuthUser";

describe("useAuthUser test", () => {
  const authWrapper = ({ children }: { children: ReactNode }) => (
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
      {children}
    </AuthContext.Provider>
  );
  const unauthWrapper = ({ children }: { children: ReactNode }) => (
    <AuthContext.Provider
      value={{
        user: null,
        setAccessToken: jest.fn(),
        setIsAuthenticated: jest.fn(),
        setUser: jest.fn(),
        isAuthenticated: false,
        accessToken: null,
        loading: false,
      }}
    >
      {children}
    </AuthContext.Provider>
  );

  test("return user when is authenticated", () => {
    const { result } = renderHook(() => useAuthUser(), { wrapper: authWrapper });
    expect(result.current.user).toEqual({ id: 1, is_admin: false });
  });

  test("throws error when user is not authenticated", () => {
    const mockHook = () => renderHook(() => useAuthUser(), { wrapper: unauthWrapper }); //create fn to get toThrow method
    expect(mockHook).toThrow("User is not authenticated");
  });

  test("throw error when no context", () => {
   const mockHook = () => renderHook(() => useAuthUser()); 
    expect(mockHook).toThrow("User is not authenticated");
  })
});
