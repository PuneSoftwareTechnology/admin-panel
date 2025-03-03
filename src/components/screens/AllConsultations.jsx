import React, { useEffect, useState } from "react";
import Loader from "../atoms/Loader";
import Typography from "../atoms/Typography";
import DeleteModal from "../Organims/DeleteModal";
import { toast } from "react-toastify";
import TableView from "../Organims/TableView";
import {
  deleteConsultation,
  getConsultations,
} from "../../APIs/demos.services";

const AllConsultations = () => {
  const [loading, setLoading] = useState(false);
  const [consultations, setConsultations] = useState([]);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchConsultationsAPICall = async () => {
    setLoading(true);
    try {
      const response = await getConsultations();

      if (response?.success && Array.isArray(response?.data)) {
        setConsultations(response.data);
      } else {
        setConsultations([]);
      }
    } catch (error) {
      console.error("Error fetching consultations:", error);
      setConsultations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultationsAPICall();
  }, []);

  const deleteConsultationAPICALL = async () => {
    setDeleteLoading(true);
    try {
      const response = await deleteConsultation({
        id: selectedConsultation?.id,
      });
      if (response?.success) {
        toast.success("Consultation deleted successfully");
        setConsultations(
          consultations.filter(
            (consultation) => consultation.id !== selectedConsultation?.id
          )
        );
        setDeleteModal(false);
      } else {
        toast.error("Failed to delete consultation");
      }
    } catch (err) {
      console.error("Error deleting consultation:", err);
      toast.error("An error occurred while deleting consultation");
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return <Loader className="mx-auto mt-32 border-gray-900" size="large" />;
  }

  const formattedData =
    consultations?.map((request, index) => ({
      id: request?.id || index,
      name: request.name || "",
      phone_number: request.phone_number || "",
      message: request?.message || "",
      created_at: request?.created_at,
    })) || [];

  return (
    <div className="container mx-auto p-4">
      <Typography variant="h3" className="mb-2">
        Consultations
      </Typography>

      <TableView
        data={formattedData}
        headers={["Name", "Phone Number", "Message", "Created at"]}
        onDelete={(consultation) => {
          setSelectedConsultation(consultation);
          setDeleteModal(true);
        }}
      />

      {deleteModal && (
        <DeleteModal
          isOpen={deleteModal}
          onClose={() => setDeleteModal(false)}
          onDelete={deleteConsultationAPICALL}
          loading={deleteLoading}
        />
      )}
    </div>
  );
};

export default AllConsultations;
