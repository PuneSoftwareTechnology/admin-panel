import { apiRequest } from "./apiCall";

export const saveNotificationEmails = async (payload) => {
  console.log(payload, "payload");

  return await apiRequest(
    "POST",
    "/settings/save-emails",
    payload,
    "Failed to save emails",
    true
  );
};

export const fetchNotificationEmails = async () => {
  return await apiRequest(
    "GET",
    "/settings/all-emails",
    null,
    "Failed to fetch emails",
    true
  );
};

export const deleteNotificationEmail = async (payload) => {
  return await apiRequest(
    "PATCH",
    "/settings/delete-emails",
    payload,
    "Failed to delete email",
    true
  );
};
