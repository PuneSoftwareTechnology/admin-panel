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

export const createCourse = async (payload) => {
  return await apiRequest(
    "POST",
    "/courses/create",
    payload,
    "Failed to Add course",
    true
  );
};

export const updateCourse = async (payload) => {
  return await apiRequest(
    "PATCH",
    "/courses/update",
    payload,
    "Failed to Add course",
    true
  );
};

export const deleteCourse = async (payload) => {
  return await apiRequest(
    "PATCH",
    "/courses/delete",
    payload,
    "Failed to Add course",
    true
  );
};
