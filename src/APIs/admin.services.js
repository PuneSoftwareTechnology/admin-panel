import axios from "axios";
import { LOCAL_URL } from "../utils/urls";

// Utility function to handle API requests with different methods
const apiRequest = async (
  method,
  endpoint,
  payload = null,
  errorMessage = "",
  requireAuth = false
) => {
  try {
    const url = `${LOCAL_URL}${endpoint}`;
    const token = requireAuth
      ? JSON.parse(localStorage.getItem("zustandStore"))?.jwtToken
      : null;

    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const config = {
      method,
      url,
      headers,
      data: payload,
    };

    const { data } = await axios(config);

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

// Admin login function (POST) - No token required
export const adminLogin = (payload) =>
  apiRequest(
    "POST",
    "/admin/login",
    payload,
    "Failed to log in the admin.",
    false
  );

// Create Admin User function (POST) - No token required
export const createAdminUser = (payload) =>
  apiRequest(
    "POST",
    "/admin/create-user",
    payload,
    "Failed to create the admin user.",
    true
  );

// Get All Users function (GET) - Token required
export const getAllUsers = () =>
  apiRequest("GET", "/admin/all-users", null, "Failed to fetch users.", true);
