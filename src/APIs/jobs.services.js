import { apiRequest } from "./apiCall";

export const fetchallJobs = async () => {
  return await apiRequest("GET", "/jobs/all", null, "Failed to fetch", false);
};

export const deleteJob = async (payload) => {
  return await apiRequest(
    "PATCH",
    "/jobs/delete",
    payload,
    "Failed to delete job",
    true
  );
};

export const addJob = async (payload) => {
  return await apiRequest(
    "POST",
    "/jobs/create",
    payload,
    "Failed to add job",
    true
  );
};

export const updateJob = async (payload) => {
  return await apiRequest(
    "PATCH",
    "/jobs/update",
    payload,
    "Failed to update job",
    true
  );
};
