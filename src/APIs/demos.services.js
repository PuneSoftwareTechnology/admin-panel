import axios from "axios";
import { LOCAL_URL } from "../utils/urls";

// Function to get all demo responses
export const getDemoRequests = async () => {
  try {
    const token = JSON.parse(localStorage.getItem("zustandStore"))?.jwtToken;
    if (!token) {
      throw new Error("Authorization token is missing.");
    }

    const url = `${LOCAL_URL}/demo/responses`;
    const { data } = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the header
      },
    });

    return data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error("Axios Error:", err.response?.data || err.message);
      throw new Error("Something went wrong while fetching demo requests.");
    } else {
      console.error("Unexpected Error:", err);
      throw new Error("An unexpected error occurred.");
    }
  }
};
