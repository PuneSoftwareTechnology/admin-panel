import { apiRequest } from "./apiCall";

export const adminLogin = (payload) =>
  apiRequest(
    "POST",
    "/admin/login",
    payload,
    "Failed to log in the admin.",
    false
  );

export const createAdminUser = (payload) =>
  apiRequest(
    "POST",
    "/admin/create-user",
    payload,
    "Failed to create the admin user.",
    true
  );

export const getAllUsers = () =>
  apiRequest("GET", "/admin/all-users", null, "Failed to fetch users.", true);

export const deleteUser = (payload) =>
  apiRequest(
    "PATCH",
    "/admin/delete-user",
    payload,
    "Failed to delete user.",
    true
  );
