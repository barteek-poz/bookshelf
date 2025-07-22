import { User } from "./userTypes";

export type AuthContextType = {
  user: User | null, 
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
  accessToken: string | null, 
  setAccessToken : React.Dispatch<React.SetStateAction<string | null>>,
  isAuthenticated: boolean,
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>,
  loading: boolean
}

export type AuthContextProviderProps = {
  children: React.ReactNode;
}