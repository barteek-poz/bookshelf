import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext"; 

type FetchError = {
  message: string;
  code: number;
};

const useFetch = <T,>(initialUrl?: string) => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<FetchError | null>(null);
  const [isPending, setIsPending] = useState<boolean>(false);
  const { accessToken } = useAuth(); 

  const fetchData = async (customUrl?: string): Promise<T | null> => {
    const url = customUrl || initialUrl;
    if (!url) {
      const err = { message: "No URL provided", code: 400 };
      setError(err);
      return null;
    }

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
        const message = await response.text();
        const err = { message, code: response.status };
        setError(err);
        return null;
      }

      const json = await response.json();
      setData(json.data);
      setError(null);
      return json.data as T;
    } catch (err) {
      console.error(err);
      const fallbackError = { message: "Unknown server error", code: 500 };
      setError(fallbackError);
      return null;
    } finally {
      setIsPending(false);
    }
  };

  useEffect(() => {
    if (initialUrl) {
      fetchData();
    }
  }, [initialUrl]);

  return { data, error, isPending, fetchData };
};

export default useFetch;
