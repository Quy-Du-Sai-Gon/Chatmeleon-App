import { useSession } from "next-auth/react";
import { useInfiniteQuery } from "react-query";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

/**
 * Fetch and return paginated data from an endpoint of the API back-end. Used to
 * fetch conversations and messages list.
 */
const usePaginatedData = <T extends BaseObject>(
  endpoint: string,
  pageSize: number
) => {
  const { data: session } = useSession();

  const fetchPaginatedData = async ({ pageParam = "" }) => {
    if (!session) {
      throw new Error("Unauthenticated");
    }

    const { chatToken } = session;

    const fetchUrl = new URL(endpoint, BACKEND_URL);
    fetchUrl.searchParams.set("pageSize", String(pageSize)); // Adjust page size as needed
    if (pageParam) {
      fetchUrl.searchParams.set("cursor", pageParam);
    }

    const res = await fetch(fetchUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${chatToken}`,
      },
    });

    if (!res.ok) {
      throw new Error(`Error fetching data: ${res.status}`);
    }
    const data: T[] = await res.json();

    return data;
  };

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery(["paginatedData", endpoint], fetchPaginatedData, {
    getNextPageParam: (lastPage) => {
      // Implement your logic to determine if there is a next page
      // Return the cursor for the next page (ID of the last item in the current page)
      const lastItem = lastPage[pageSize - 1];
      return lastItem ? lastItem.id : undefined;
    },
    enabled: !!session, // Enable query only when session exists
    staleTime: 1000 * 60 * 5,
  });

  return {
    data: data ? data.pages.flat() : [],
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  };
};

export default usePaginatedData;
