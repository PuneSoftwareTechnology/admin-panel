import React, { useEffect, useState } from "react";
import Loader from "../atoms/Loader";
import Typography from "../atoms/Typography";
import {
  fetchAllCourses,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../../APIs/courses.services";
import TableView from "../Organims/TableView";
import AddCourseModal from "../Organims/AddCourseModal";
import DeleteModal from "../Organims/DeleteModal";
import PrimaryButton from "../atoms/PrimaryButton";
import { MdAdd } from "react-icons/md";

const Courses = () => {
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const fetchCoursesAPICall = async () => {
    setLoading(true);
    try {
      const response = await fetchAllCourses();
      if (response?.success && Array.isArray(response?.data)) {
        setCourses(response.data);
      } else {
        setCourses([]);
      }
    } catch (error) {
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoursesAPICall();
  }, []);

  const headers = ["ID", "Name", "Slug", "Category", "User Email"];

  const formattedCourses = courses.map((item, index) => ({
    id: item?.id || index,
    name: item?.name || "",
    slug: item?.slug || "",
    category: item?.category || "",
    user_email: item?.user_email || "",
  }));

  const handleAddCourse = () => {
    setSelectedCourse(null);
    setIsAddModalOpen(true);
  };

  const handleEditCourse = (course) => {
    setSelectedCourse(courses.find((item) => item.slug === course.slug));
    setIsAddModalOpen(true);
  };

  const handleDeleteCourse = (course) => {
    setSelectedCourse(course);
    setIsDeleteModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setSelectedCourse(null);
    fetchCoursesAPICall();
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedCourse(null);
  };

  const handleConfirmDelete = async () => {
    setLoading(true);
    try {
      await deleteCourse({ id: selectedCourse.id });
      fetchCoursesAPICall();
    } catch (error) {
      // Handle error
    } finally {
      setLoading(false);
      handleCloseDeleteModal();
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center my-4">
        <Typography variant="h3">Courses</Typography>
        <PrimaryButton onClick={handleAddCourse}>
          <MdAdd size={24} color="white" />
          Add Course
        </PrimaryButton>
      </div>
      {loading ? (
        <Loader className="mx-auto mt-32 border-gray-900" size="large" />
      ) : (
        <TableView
          data={formattedCourses}
          headers={headers}
          onRowClick={handleEditCourse}
          onDelete={handleDeleteCourse}
        />
      )}
      {isAddModalOpen && (
        <AddCourseModal
          isOpen={isAddModalOpen}
          onClose={handleCloseAddModal}
          courseData={selectedCourse}
        />
      )}
      {isDeleteModalOpen && (
        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          onDelete={handleConfirmDelete}
        />
      )}
    </div>
  );
};

export default Courses;
