import axios from "axios";
import { LOCAL_URL } from "../utils/urls";

// Common function to handle POST requests
const apiPostRequest = async (endpoint, payload, errorMessage) => {
  try {
    const url = `${LOCAL_URL}${endpoint}`;
    const { data } = await axios.post(url, payload);
    return data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error("Axios Error:", err.response?.data || err.message);
      throw new Error(
        errorMessage || "An error occurred while processing the request."
      );
    } else {
      console.error("Unexpected Error:", err);
      throw new Error("An unexpected error occurred.");
    }
  }
};

// Admin login function
export const adminLogin = (payload) =>
  apiPostRequest("/admin/login", payload, "Failed to log in the admin.");

// Create Admin User function
export const createAdminUser = (payload) =>
  apiPostRequest(
    "/admin/create-user",
    payload,
    "Failed to create the admin user."
  );
