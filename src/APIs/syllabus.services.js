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

export const updateSyllabus = async (payload) => {
  return await apiRequest(
    "PATCH",
    "/courses/syllabus/update",
    payload,
    "Failed to fetch syllabus",
    true
  );
};
export const createSyllabus = async (payload) => {
  return await apiRequest(
    "POST",
    "/courses/syllabus/create",
    payload,
    "Failed to fetch syllabus",
    true
  );
};

export const deleteSyllabus = async (payload) => {
  return await apiRequest(
    "PATCH",
    "/courses/syllabus/delete",
    payload,
    "Failed to fetch syllabus",
    true
  );
};
