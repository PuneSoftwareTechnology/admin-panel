import React, { useEffect, useState } from "react";
import Loader from "../atoms/Loader";
import Typography from "../atoms/Typography";
import DeleteModal from "../Organims/DeleteModal";
import EditTestimonial from "../Organims/EditTestimonial";
import { toast } from "react-toastify";
import TableView from "../Organims/TableView";
import {
  deleteTestimonial,
  fetchAllTestimonials,
} from "../../APIs/testimonial.services";

const AllTestimonials = () => {
  const [loading, setLoading] = useState(false);
  const [testimonials, setTestimonials] = useState([]);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editModal, setEditModal] = useState(false);

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

  const openEditModalHandler = (testimonial) => {
    setSelectedTestimonial(
      testimonials?.find((item) => item?.id === testimonial?.id)
    );
    setEditModal(true);
  };

  const headers = [
    "ID",
    "Name",
    "Rating",
    "Testimonial",
    "Created at",
    "User email",
  ];

  const formattedData = testimonials?.map((item, index) => ({
    id: item?.id || index,
    name: item?.name,
    star_rating: item?.star_rating,
    testimonial: item?.testimonial,
    created_at: item?.created_at,
    user_email: item?.user_email,
  }));

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
        data={formattedData}
        headers={headers}
        onRowClick={openEditModalHandler}
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

      {editModal && (
        <EditTestimonial
          isOpen={editModal}
          onClose={() => {
            fetchTestmonialsAPICall();
            setEditModal(false);
          }}
          data={selectedTestimonial}
        />
      )}
    </div>
  );
};

export default AllTestimonials;
