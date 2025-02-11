import { apiRequest } from "./apiCall";

export const fetchAllProjects = async () => {
  return await apiRequest(
    "GET",
    "/projects/all",
    null,
    "Failed to fetch projects",
    false
  );
};

export const deleteProject = async (payload) => {
  return await apiRequest(
    "PATCH",
    "/projects/delete",
    payload,
    "Failed to delete project",
    true
  );
};

export const addProject = async (payload) => {
  console.log(payload);
  return await apiRequest(
    "POST",
    "/projects/create",
    payload,
    "Failed to add project",
    true
  );
};

export const updateProject = async (payload) => {
  return await apiRequest(
    "PATCH",
    "/projects/update",
    payload,
    "Failed to update project",
    true
  );
};
