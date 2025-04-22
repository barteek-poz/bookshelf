import { createContext, useEffect, useState, useContext } from "react";

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null); // tylko in-memory
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const saveAuthData = (token, userData) => {
    setAccessToken(token);
    setUser(userData);
    setIsAuthenticated(true);
  };

  const clearAuthData = () => {
    setAccessToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const refreshAccessToken = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/v1/users/refresh-token", {
        method: "POST",
        credentials: "include", // ⬅️ ważne — wysyła ciasteczka z refreshToken
      });

      if (response.ok) {
        const data = await response.json();
        saveAuthData(data.accessToken, data.user); // zakładamy, że user jest w odpowiedzi
      } else {
        clearAuthData();
      }
    } catch (err) {
      console.error("Refresh failed", err);
      clearAuthData();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAccessToken();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        setAccessToken,
        isAuthenticated,
        setIsAuthenticated,
        user,
        setUser,
        loading,
        saveAuthData,
        clearAuthData,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
