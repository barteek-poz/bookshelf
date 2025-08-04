import { useState, useEffect, useContext } from "react";
import { useAuth } from "../context/AuthContext.js";

type fetchError = {
  message: string, 
  code: number
}

const useFetch = <T,> (url:string, autoFetch: boolean) => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<fetchError | null>(null);
  const [isPending, setIsPending] = useState<boolean>(false);
  const { accessToken } = useAuth();
  
    const fetchData = async () => {
      setIsPending(true);
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          setError({
            message: response.statusText,
            code: response.status,
          });
          throw new Error(response.statusText);
        }
        const jsonData = await response.json();
        setIsPending(false);
        setData(jsonData.data);
        setError(null);
      } catch (err) {
        console.log(err);
        setIsPending(false);
      }
    };
    useEffect(() => {
      if (autoFetch && url) {
        fetchData();
      }
    }, [autoFetch, url]);

  return { data, error, isPending };
};

export default useFetch;
