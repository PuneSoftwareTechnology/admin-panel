import { apiRequest } from "./apiCall";

export const getDemoRequests = async () => {
  return await apiRequest(
    "GET",
    "/demo/responses",
    null,
    "Failed to fetch demos",
    true
  );
};
