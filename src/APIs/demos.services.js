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

export const updateDemo = async (payload) => {
  return await apiRequest(
    "PATCH",
    "/demo/update",
    payload,
    "Failed to Update",
    true
  );
};
