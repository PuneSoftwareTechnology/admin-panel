import { apiRequest } from "./apiCall";

export const getDemoRequests = () =>
  apiRequest("GET", "/demo/responses", null, "Failed to fetch demos", true);
