import { useNavigate } from "react-router-dom";
import { useError } from "../context/ErrorContext";

export const useErrorHandler = () => {
  const navigate = useNavigate();
  const { setErrorMsg } = useError();

  const errorHandler = (errorMsg:string) => {
    setErrorMsg(errorMsg);
    navigate("/error");
  };

  return { errorHandler };
};
