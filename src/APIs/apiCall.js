import axios from "axios";
import { LOCAL_URL } from "../utils/urls";

export const apiRequest = async (
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
      if (err.response.data.message === "USER_NOT_FOUND") {
        localStorage.clear();
      }
      throw new Error(err.message || errorMessage);
    } else {
      console.error("Unexpected Error:", err);
      throw new Error("An unexpected error occurred.");
    }
  }
};
