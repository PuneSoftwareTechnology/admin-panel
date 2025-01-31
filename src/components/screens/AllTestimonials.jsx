import React, { useEffect, useState } from "react";
import Loader from "../atoms/Loader";
import PrimaryButton from "../atoms/PrimaryButton";
import { MdAdd } from "react-icons/md";
import Typography from "../atoms/Typography";
import DeleteModal from "../Organims/DeleteModal";
import { toast } from "react-toastify";
import TableView from "../Organims/TableView";
import {
  deleteTestimonial,
  fetchAllTestimonials,
} from "../../APIs/testimonial.services";
import useStore from "../../utils/zustand";

const AllTestimonials = () => {
  const email = useStore((state) => state.email);
  const [loading, setLoading] = useState(false);
  const [testimonials, setTestimonials] = useState([]);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchTestmonialsAPICall = async () => {
    setLoading(true);
    try {
      const response = await fetchAllTestimonials();

      if (response?.success && Array.isArray(response?.data)) {
        setTestimonials(response.data);
      } else {
        setTestimonials([]);
      }
    } catch (error) {
      setTestimonials([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestmonialsAPICall();
  }, []);

  const deleteTestimonialAPICALL = async () => {
    setDeleteLoading(true);
    try {
      const payload = {
        id: selectedTestimonial?.id,
        user_email: email,
      };

      const response = await deleteTestimonial(payload);
      if (response?.success) {
        toast.success("Testimonial deleted successfully");
        setDeleteModal(false);
        fetchTestmonialsAPICall();
      } else {
        toast.error("Failed to delete Testmonial");
      }
    } catch (err) {
      toast.error("An error occurred while deleting Testmonial");
    } finally {
      setDeleteLoading(false);
    }
  };

  const headers = [
    "ID",
    "Name",
    "Rating",
    "Testimonial",
    "course",
    "Created at",
    "User email",
  ];

  if (loading) {
    return <Loader className="mx-auto mt-32 border-gray-900" size="large" />;
  }

  const openDeleteModalHandler = (testimonial) => {
    setSelectedTestimonial(testimonial);
    setDeleteModal(true);
  };

  return (
    <div className="container mx-auto p-4">
      <Typography variant="h3">Testmonials</Typography>
      <TableView
        data={testimonials}
        headers={headers}
        onDelete={openDeleteModalHandler}
      />

      {deleteModal && (
        <DeleteModal
          isOpen={deleteModal}
          onClose={() => setDeleteModal(false)}
          onDelete={deleteTestimonialAPICALL}
          loading={deleteLoading}
        />
      )}
    </div>
  );
};

export default AllTestimonials;
