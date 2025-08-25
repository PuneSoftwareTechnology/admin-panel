import axios from "axios";
import { BASE_URL } from "../utils/urls";

export const apiRequest = async (
  method,
  endpoint,
  payload = null,
  errorMessage = "",
  requireAuth = false
) => {
  try {
    const url = `${BASE_URL}${endpoint}`;
    const token = requireAuth
      ? JSON.parse(localStorage.getItem("zustandStore"))?.jwtToken
      : null;

    const headers = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };

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

      const backendMessage = err.response?.data?.message;
      if (
        backendMessage === "USER_NOT_FOUND" ||
        backendMessage === "Invalid or Expired Token"
      ) {
        localStorage.clear();
        window.location.href = "/admin-login";
        return; // Prevent further execution
      }

      throw new Error(err.message || errorMessage);
    } else {
      console.error("Unexpected Error:", err);
      throw new Error("An unexpected error occurred.");
    }
  }
};
