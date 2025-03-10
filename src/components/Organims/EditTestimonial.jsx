import React, { useState } from "react";
import Modal from "../Molecule/Modal";
import PrimaryButton from "../atoms/PrimaryButton";
import Dropdown from "../atoms/DropDown";
import Typography from "../atoms/Typography";
import { toast } from "react-toastify";
import useStore from "../../utils/zustand";
import { updateTestimonial } from "../../APIs/testimonial.services";
import InputBox from "../atoms/InputBox";

const EditTestimonial = ({ isOpen, onClose, data }) => {
  const courses = useStore((state) => state.courseNames);
  const user_email = useStore((state) => state.email);
  const [editData, setEditData] = useState({ ...data });
  const [editLoading, setEditLoading] = useState(false);

  const courseOptions = courses.map((course) => ({
    value: course?.id,
    label: course?.name,
  }));

  const handleChange = (name, value) => {
    setEditData({ ...editData, [name]: value });
  };

  const saveEditChanges = async () => {
    setEditLoading(true);
    try {
      const response = await updateTestimonial({ ...editData, user_email });
      if (response?.success) {
        toast.success("Testimonial updated successfully");
        onClose();
      } else {
        toast.error(response?.message || "Failed to update testimonial");
      }
    } catch (err) {
      toast.error(
        err.message || "An error occurred while updating Testimonial"
      );
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Testimonial">
      <div className="space-y-4">
        <div>
          <Typography className="mb-2" variant="h6">
            Name
          </Typography>
          <InputBox
            type="text"
            value={editData?.name || ""}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        </div>

        <div>
          <Typography className="mb-2" variant="h6">
            Rating
          </Typography>
          <InputBox
            type="number"
            min="1"
            max="5"
            value={editData?.star_rating || ""}
            onChange={(e) => handleChange("star_rating", e.target.value)}
          />
        </div>

        <div>
          <Typography className="mb-2" variant="h6">
            Testimonial
          </Typography>
          <textarea
            className="w-full p-2 border border-gray-300 rounded-md"
            value={editData?.testimonial || ""}
            onChange={(e) => handleChange("testimonial", e.target.value)}
          />
        </div>

        <div>
          <Typography className="mb-2" variant="h6">
            Course
          </Typography>
          <Dropdown
            id="course"
            name="course_id"
            options={courseOptions}
            value={editData?.course_id}
            onChange={(e) => handleChange("course_id", e.target.value)}
          />
        </div>

        <PrimaryButton onClick={saveEditChanges} loading={editLoading}>
          Save Changes
        </PrimaryButton>
      </div>
    </Modal>
  );
};

export default EditTestimonial;
