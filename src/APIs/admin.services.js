import axios from "axios";
import { LOCAL_URL } from "../utils/urls";

// Function to handle admin login
export const adminLogin = async (payload) => {
  try {
    const url = `${LOCAL_URL}/admin/login`;
    const { data } = await axios.post(url, payload);

    return data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error("Axios Error:", err.response?.data || err.message);
      throw new Error("Something went wrong while logging in the admin.");
    } else {
      console.error("Unexpected Error:", err);
      throw new Error("An unexpected error occurred.");
    }
  }
};
