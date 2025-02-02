import { useState } from "react";
import {
  deleteNotificationEmail,
  fetchNotificationEmails,
  saveNotificationEmails,
} from "../APIs/settings.services";

const useEmailNotifications = (userEmail) => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const fetchEmails = async () => {
    try {
      const response = await fetchNotificationEmails();
      if (response?.success && Array.isArray(response?.data)) {
        setEmails(response.data);
      }
    } catch (err) {
      console.error("Error fetching emails", err);
    } finally {
      setFetching(false);
    }
  };

  const saveEmails = async (points) => {
    setLoading(true);
    try {
      const response = await saveNotificationEmails({
        emails: points,
        user_email: userEmail,
      });
      if (response?.success) {
        fetchEmails();
      }
    } catch (err) {
      console.error("Error saving emails", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteEmail = async (emailId) => {
    setLoading(true);
    try {
      const response = await deleteNotificationEmail({ id: emailId });
      if (response?.success) {
        setEmails((prevEmails) =>
          prevEmails.filter((email) => email.id !== emailId)
        );
        fetchEmails();
      }
    } catch (err) {
      console.error("Error deleting email", err);
    } finally {
      setLoading(false);
    }
  };

  return { emails, loading, fetching, fetchEmails, saveEmails, deleteEmail };
};

export default useEmailNotifications;
