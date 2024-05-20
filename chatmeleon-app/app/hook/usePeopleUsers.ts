import { PeopleUser } from "@/types/people-user";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const usePeopleUsers = async (
  chatToken: string | undefined,
  pageNumber: string
): Promise<PeopleUser[]> => {
  console.log("Fetching users now");
  const getMessageURL = `${BACKEND_URL}/users/search?pageSize=10&pageNumber=${pageNumber}`;

  try {
    const res = await fetch(getMessageURL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${chatToken}`,
      },
    });

    if (res.ok) {
      const data = await res.json();
      return data;
    } else {
      console.error("Error fetching users:", res.status);
      return [];
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

export default usePeopleUsers;
