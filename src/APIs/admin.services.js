import { apiRequest } from "./apiCall";

export const adminLogin = async (payload) => {
  return await apiRequest(
    "POST",
    "/admin/login",
    payload,
    "Failed to log in the admin.",
    false
  );
};

export const createAdminUser = async (payload) => {
  return await apiRequest(
    "POST",
    "/admin/create-user",
    payload,
    "Failed to create the admin user.",
    true
  );
};

export const getAllUsers = async () => {
  return await apiRequest(
    "GET",
    "/admin/all-users",
    null,
    "Failed to fetch users.",
    true
  );
};

export const deleteUser = async (payload) => {
  return await apiRequest(
    "PATCH",
    "/admin/delete-user",
    payload,
    "Failed to delete user.",
    true
  );
};

export const updateAdminUser = async (payload) => {
  return await apiRequest(
    "PATCH",
    "/admin/update-user",
    payload,
    "Failed to update user.",
    true
  );
};
