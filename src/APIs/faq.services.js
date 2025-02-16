import { apiRequest } from "./apiCall";

export const createFAQ = async (payload) => {
  return await apiRequest(
    "POST",
    "/faq/create",
    payload,
    "Failed to create faq",
    true
  );
};

export const fetchFAQs = async () => {
  return await apiRequest("GET", "/faq/all", null, "Failed to Fetch", false);
};

export const deleteFAQ = async (payload) => {
  return await apiRequest(
    "PATCH",
    "/faq/delete",
    payload,
    "Failed to delete",
    true
  );
};

export const updateFAQ = async (payload) => {
  return await apiRequest(
    "PATCH",
    "/faq/update",
    payload,
    "Failed to update",
    true
  );
};
