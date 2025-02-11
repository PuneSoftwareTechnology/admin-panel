import { apiRequest } from "./apiCall";

export const fetchAllCourses = async () => {
  return await apiRequest(
    "GET",
    "/courses/all",
    null,
    "Failed to fetch courses",
    false
  );
};
