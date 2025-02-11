import { apiRequest } from "./apiCall";

export const fetchAllSyllabus = async () => {
  return await apiRequest(
    "GET",
    "/courses/syllabus/all",
    null,
    "Failed to fetch syllabus",
    false
  );
};
