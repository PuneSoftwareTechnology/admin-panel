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
import { FaDownload } from "react-icons/fa6";

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

  // Add this function inside your component
  const handleDownloadCSV = () => {
    if (!consultations || consultations.length === 0) {
      toast.info("No consultations to download");
      return;
    }

    // Create CSV headers
    const headers = ["Name", "Phone Number", "Message", "Created at"];
    const rows = consultations.map((c) => [
      c.name,
      c.phone_number,
      c.message,
      c.created_at,
    ]);

    // Combine headers and rows
    const csvContent = [headers, ...rows]
      .map((row) => row.map((item) => `"${item}"`).join(","))
      .join("\n");

    // Create a blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "consultations.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
      <div className="flex justify-between items-center mb-4">
        <Typography variant="h3" className="mb-2">
          Consultations
        </Typography>
        <div className="flex gap-2">
          <button
            onClick={handleDownloadCSV}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-800 transition font-semibold"
            title="Download as CSV"
          >
            <FaDownload className="mr-2 text-xl" />
            Download CSV
          </button>
        </div>
      </div>
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
