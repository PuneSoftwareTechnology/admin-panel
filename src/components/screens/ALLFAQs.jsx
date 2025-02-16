import React, { useEffect, useState } from "react";
import { deleteFAQ, fetchFAQs } from "../../APIs/faq.services";
import Loader from "../atoms/Loader";
import PrimaryButton from "../atoms/PrimaryButton";
import { MdAdd } from "react-icons/md";
import AddFAQModal from "../Organims/AddFAQModal";
import Typography from "../atoms/Typography";
import DeleteModal from "../Organims/DeleteModal";
import { toast } from "react-toastify";
import TableView from "../Organims/TableView";
import useStore from "../../utils/zustand";

const AllFAQs = () => {
  const courses = useStore((state) => state.courseNames);
  const [loading, setLoading] = useState(false);
  const [faqs, setFaqs] = useState([]);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchFAQsAPICall = async () => {
    setLoading(true);
    try {
      const response = await fetchFAQs();
      if (response?.success && Array.isArray(response?.data)) {
        setFaqs(response.data);
      } else {
        setFaqs([]);
      }
    } catch (error) {
      console.error("Error fetching FAQs:", error);
      setFaqs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFAQsAPICall();
  }, []);

  const deleteFaqAPICALL = async () => {
    setDeleteLoading(true);
    try {
      const response = await deleteFAQ({ id: selectedFaq?.id });
      if (response?.success) {
        toast.success("FAQ deleted successfully");
        setFaqs(faqs.filter((faq) => faq.id !== selectedFaq?.id));
        setDeleteModal(false);
      } else {
        toast.error("Failed to delete FAQ");
      }
    } catch (err) {
      console.error("Error deleting FAQ:", err);
      toast.error("An error occurred while deleting FAQ");
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return <Loader className="mx-auto mt-32 border-gray-900" size="large" />;
  }

  const formattedData =
    faqs?.map((request, index) => ({
      id: request?.id || index,
      question: request.question || "",
      answer: request.answer || "",
      course_id:
        courses.find((course) => course?.id === request?.course_id)?.name || "",
      created_at: request?.created_at,
    })) || [];

  return (
    <div className="container mx-auto p-4">
      {/* Add FAQ Button */}
      <div className="flex justify-between items-center mb-4">
        <Typography variant="h3">FAQs</Typography>
        <PrimaryButton onClick={() => setOpenAddModal(true)}>
          <MdAdd size={24} color="white" /> Add FAQ
        </PrimaryButton>
      </div>

      {/* FAQs Table */}
      <TableView
        data={formattedData}
        headers={["ID", "Question", "Answer", "Related Topic", "Created at"]}
        onRowClick={(faq) => {
          setSelectedFaq(faqs.find((item) => item?.id === faq?.id));
          setOpenAddModal(true);
        }}
        onDelete={(faq) => {
          setSelectedFaq(faq);
          setDeleteModal(true);
        }}
      />

      {/* FAQ Modal */}
      {openAddModal && (
        <AddFAQModal
          isOpen={openAddModal}
          onClose={() => {
            setSelectedFaq(null);
            setOpenAddModal(false);
            fetchFAQsAPICall();
          }}
          faqData={selectedFaq}
        />
      )}

      {/* Delete Modal */}
      {deleteModal && (
        <DeleteModal
          isOpen={deleteModal}
          onClose={() => setDeleteModal(false)}
          onDelete={deleteFaqAPICALL}
          loading={deleteLoading}
        />
      )}
    </div>
  );
};

export default AllFAQs;
