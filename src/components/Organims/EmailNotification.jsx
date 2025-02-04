import React, { useState, useEffect } from "react";
import useBulletPoints from "../../hooks/useBulletPoints";
import useStore from "../../utils/zustand";
import Typography from "../atoms/Typography";
import BulletPointsInput from "../Molecule/BulletPointsInput";
import PrimaryButton from "../atoms/PrimaryButton";
import Loader from "../atoms/Loader";
import TableView from "./TableView";
import DeleteModal from "./DeleteModal";
import useEmailNotifications from "../../hooks/useEmailNotifications";

const EmailNotifications = () => {
  const { points, addPoint, removePoint } = useBulletPoints();
  const userEmail = useStore((state) => state.email);
  const { emails, loading, fetching, fetchEmails, saveEmails, deleteEmail } =
    useEmailNotifications(userEmail);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [emailToDelete, setEmailToDelete] = useState(null);

  useEffect(() => {
    fetchEmails();
  }, [fetchEmails]);

  // Prepare email list for table view
  const headers = ["ID", "Email", "User Email", "Created At"];
  const formattedData = emails.map((email, index) => ({
    id: email.id || index,
    email: email.email || "",
    user_email: email.user_email || "",
    created_at: email.created_at,
  }));

  return (
    <div className="m-6 border-2 text-sm bg-white p-6 rounded-lg">
      <div className="mt-4 w-1/3">
        <Typography variant="h3">Email Notifications</Typography>
        <div className="mt-4">
          <Typography variant="h6">Enter emails to receive updates:</Typography>
          <BulletPointsInput
            points={points}
            onAddPoint={addPoint}
            onRemovePoint={removePoint}
          />
          <PrimaryButton
            onClick={() => saveEmails(points)}
            loading={loading}
            className="mt-4"
          >
            Save Emails
          </PrimaryButton>
        </div>
      </div>

      <div className="mt-8">
        <Typography variant="h3">Notification Emails List</Typography>
        {fetching ? (
          <Loader
            size="large"
            ariaLabel="Loading emails..."
            className="border-gray-600 mx-auto my-16"
          />
        ) : (
          <TableView
            data={formattedData}
            headers={headers}
            onDelete={(email) => {
              setEmailToDelete(email);
              setDeleteModalOpen(true);
            }}
          />
        )}
      </div>

      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onDelete={() => deleteEmail(emailToDelete.id)}
        loading={loading}
      />
    </div>
  );
};

export default EmailNotifications;
