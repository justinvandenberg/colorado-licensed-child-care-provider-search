import { useEffect, useState } from "react";

export interface FetchDataOptions {
  body?: any;
  headers?: Record<string, string>;
  method?: string;
}

export interface UseFetchDataResult<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
}

const useFetchData = <T = unknown>(
  url: string,
  options?: FetchDataOptions
): UseFetchDataResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(url, {
          method: options?.method || "GET",
          headers: options?.headers,
          body: options?.body ? JSON.stringify(options.body) : undefined,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get("Content-Type");
        let data: T;

        if (contentType && contentType.includes("application/json")) {
          data = await response.json();
        } else {
          const text = await response.text();

          data = text as unknown as T;
        }

        setData(data);
      } catch (err: unknown) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [options?.body, options?.headers, options?.method, url]);

  return { data, loading, error };
};

export { useFetchData };
