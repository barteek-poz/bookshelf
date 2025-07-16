import React, { createContext, useEffect, useState, useContext, useMemo } from "react";

type User = {
  id: number
}

export type AuthContextType = {
  user: User | null, 
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
  accessToken: string | null, 
  setAccessToken : React.Dispatch<React.SetStateAction<string | null>>,
  isAuthenticated: boolean,
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>,
  loading: boolean
}

type AuthContextProviderProps = {
  children: React.ReactNode;
}



export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

const AuthProvider = ({ children }: AuthContextProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null); 
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const saveAuthData = (token:string, userData:User) => {
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
    setLoading(true)
    try {
      const response = await fetch("http://localhost:3000/api/v1/auth/refresh-token", {
        method: "POST",
        credentials: "include", 
      });

      if (response.ok) {
        const data = await response.json();
        saveAuthData(data.accessToken, data.user); 
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
    refreshAccessToken()
    const refreshInterval = setInterval(()=> {
      refreshAccessToken();
    }, 900000)

    return () => clearInterval(refreshInterval)
  }, []);

  const memoValue = useMemo(
    () => ({
      user,
      setUser,
      accessToken,
      setAccessToken,
      isAuthenticated,
      setIsAuthenticated,
      loading,
    }),
    [user, accessToken, isAuthenticated, loading]
  );

  return (
    <AuthContext.Provider
      value={memoValue}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;