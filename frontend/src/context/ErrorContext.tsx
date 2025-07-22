import { createContext, useContext, useState } from "react";

export type ErrorContext = {
  errorMsg: string | null;
  setErrorMsg: React.Dispatch<React.SetStateAction<string | null>>;
};

export type ErrorContextProviderProps = {
  children: React.ReactNode;
};

export const ErrorContext = createContext<ErrorContext | null>(null);

export const ErrorProvider = ({ children }: ErrorContextProviderProps) => {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  return (
    <ErrorContext.Provider value={{ errorMsg, setErrorMsg }}>
      {children}
    </ErrorContext.Provider>
  );
};


export const useError = () => {
    const errorCtx = useContext(ErrorContext)
    if(!errorCtx) {
        throw new Error('useError must be used within an ErrorProvider')
    }
    return errorCtx
}