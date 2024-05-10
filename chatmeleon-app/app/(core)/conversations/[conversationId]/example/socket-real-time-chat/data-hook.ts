"use client";

import { useSession } from "next-auth/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

/**
 * Fetch and return paginated data from an endpoint of the API back-end. Used to
 * fetch conversations and messages list.
 */
const usePaginatedData = <T>(
  endpoint: string,
  order: "asc" | "desc" = "asc"
) => {
  const [data, setData] = useState<T[] | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const session = useSession();

  const fetchData = useCallback(
    async (abortSignal: AbortSignal) => {
      if (session.status !== "authenticated") {
        throw new Error("Unauthenticated");
      }

      const { chatToken } = session.data;

      const fetchUrl = new URL(endpoint, BACKEND_URL);
      fetchUrl.searchParams.set("pageSize", String(100));
      // fixed page size used for testing, no pagination

      const res = await fetch(fetchUrl, {
        method: "GET",
        signal: abortSignal,
        headers: {
          Authorization: `Bearer ${chatToken}`,
        },
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      if (!res.headers.get("Content-Type")?.includes("application/json")) {
        throw new Error("Expected data");
      }

      // assume the data are of the expected type without validating
      const data: T[] = await res.json();

      return data;
    },
    [endpoint, session.data, session.status]
  );

  const abortCtrlRef = useRef<AbortController | null>(null);

  // Fetch the data as an effect
  useEffect(() => {
    setData(null);
    setError(null);

    if (session.status === "loading") return;

    abortCtrlRef.current = new AbortController();

    fetchData(abortCtrlRef.current.signal)
      .then((data) => {
        setData(order === "asc" ? data.toReversed() : data);
        setError(null);
      })
      .catch((err: Error /** Assume type Error without validating */) => {
        if (err.name === "AbortError") return;

        setData(null);
        setError(err);
      });

    return () => {
      abortCtrlRef.current?.abort();
      abortCtrlRef.current = null;
    };
  }, [fetchData, order, session.status]);

  const onNewDatum = useCallback(
    (datum: T) =>
      setData((data) => {
        if (!data) {
          return [datum];
        }
        return order === "asc" ? [...data, datum] : [datum, ...data];
      }),
    [order]
  );

  return useMemo(
    () => ({
      data,
      error,
      onNewDatum,
    }),
    [data, error, onNewDatum]
  );
};

export default usePaginatedData;
