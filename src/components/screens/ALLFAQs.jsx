import React, { useEffect, useState } from "react";
import { deleteFAQ, fetchFAQs } from "../../APIs/faq.services";
import Loader from "../atoms/Loader";
import PrimaryButton from "../atoms/PrimaryButton";
import { MdAdd } from "react-icons/md";
import AddFAQModal from "../Organims/AddFAQModal";
import Typography from "../atoms/Typography";
import DeleteModal from "../Organims/DeleteModal";
import { toast } from "react-toastify";
import moment from "moment/moment";

const AllFAQs = () => {
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
        fetchFAQsAPICall();
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

  const openAddModalHandler = () => {
    setOpenAddModal(true);
    setDeleteModal(false); // Ensure delete modal is closed when add modal is opened
  };

  const openDeleteModalHandler = (faq) => {
    setSelectedFaq(faq);
    setDeleteModal(true);
    setOpenAddModal(false); // Ensure add modal is closed when delete modal is opened
  };

  return (
    <div className="container mx-auto p-4">
      {/* Add FAQ Button */}
      <div className="flex justify-between items-center mb-4">
        <Typography variant="h3">FAQs</Typography>
        <PrimaryButton onClick={openAddModalHandler}>
          <MdAdd size={24} color="white" />
          Add FAQ
        </PrimaryButton>
      </div>

      {/* FAQs Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-600">
            <tr>
              <th className="px-4 text-white py-2 border">Question</th>
              <th className="px-4 text-white py-2 border">Answer</th>
              <th className="px-4 text-white py-2 border">Related Topic</th>
              <th className="px-4 text-white py-2 border">Created at</th>
              <th className="px-4 text-white py-2 border"></th>
            </tr>
          </thead>
          <tbody>
            {faqs.length > 0 ? (
              faqs.map((faq, index) => (
                <tr
                  key={faq.id}
                  className={
                    index % 2 === 0
                      ? "bg-white hover:bg-gray-100 cursor-pointer"
                      : "bg-gray-200 hover:bg-gray-300  cursor-pointer"
                  }
                  onClick={() => {
                    setSelectedFaq(faq);
                    openAddModalHandler();
                  }}
                >
                  <td className="px-4 py-2 border">{faq.question}</td>
                  <td className="px-4 py-2 border">{faq.answer}</td>
                  <td className="px-4 py-2 border">{faq.related_topic}</td>
                  <td className="px-4 py-2 border">
                    {moment(faq.created_at).format("MMMM Do YYYY, h:mm:ss a")}
                  </td>
                  <td
                    className="px-4 py-2 border text-center "
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering the row click
                      openDeleteModalHandler(faq);
                    }}
                  >
                    <span className="bg-red-600 text-white px-2 py-1 rounded-md text-sm font-semibold">
                      Delete
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="text-center text-xl font-semibold py-4"
                >
                  No FAQs found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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
