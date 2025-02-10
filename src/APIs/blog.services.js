import { apiRequest } from "./apiCall";

export const fetchAllBlogs = async () => {
  return await apiRequest("GET", "/blog/all", null, "Failed to fetch", false);
};

export const updateBlog = async (payload) => {
  return await apiRequest(
    "PATCH",
    "/blog/update",
    payload,
    "Failed to update",
    true
  );
};

export const createBlog = async (payload) => {
  return await apiRequest(
    "POST",
    "/blog/create",
    payload,
    "Failed to create",
    true
  );
};

export const fetchOneBlog = async (slug) => {
  return await apiRequest(
    "GET",
    `/blog/?slug=${slug}`,
    null,
    "Failed to Fetch",
    false
  );
};
