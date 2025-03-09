import React, { useEffect, useState } from "react";
import Loader from "../atoms/Loader";
import Typography from "../atoms/Typography";
import { fetchAllSyllabus, deleteSyllabus } from "../../APIs/syllabus.services";
import TableView from "../Organims/TableView";
import useStore from "../../utils/zustand";
import AddSyllabusModal from "../Molecule/AddSyllabusModal"; // Import the new modal component
import PrimaryButton from "../atoms/PrimaryButton";
import { MdAdd } from "react-icons/md";
import DeleteModal from "../Organims/DeleteModal"; // Import the DeleteModal component

const Syllabus = () => {
  const courses = useStore((state) => state.courseNames);
  const [loading, setLoading] = useState(false);
  const [syllabus, setSyllabus] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSyllabus, setSelectedSyllabus] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);

  const fetchSyllabusAPICall = async () => {
    setLoading(true);
    try {
      const response = await fetchAllSyllabus();
      if (response?.success && Array.isArray(response?.data)) {
        setSyllabus(response.data);
      } else {
        setSyllabus([]);
      }
    } catch (error) {
      setSyllabus([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSyllabusAPICall();
  }, []);

  const headers = ["ID", "Course", "Modules", "User Email"];

  const formattedSyllabus = syllabus.map((item, index) => ({
    id: item?.course_id,
    course_name:
      courses.find((course) => course?.id === item?.course_id)?.name || "",
    courses_syllabus: item?.courses_syllabus || [],
    user_email: item?.user_email || "",
  }));

  const columnStyleMap = {
    Modules: ({ value }) => (
      <div>
        {value.map((module, idx) => (
          <div key={idx}>
            <Typography variant="body1">✅ {module.module_name}</Typography>
          </div>
        ))}
      </div>
    ),
  };

  const handleRowClick = (data) => {
    setSelectedSyllabus(
      syllabus?.find((item) => item?.course_id === data?.course_id)
    );
    setIsModalOpen(true);
  };

  const handleAddSyllabus = () => {
    setSelectedSyllabus(null);
    setIsModalOpen(true);
  };

  const handleDeleteSyllabus = async () => {
    try {
      await deleteSyllabus({ course_id: selectedSyllabus?.course_id });
      fetchSyllabusAPICall();
    } catch (error) {
      console.error("Failed to delete syllabus:", error);
    } finally {
      setDeleteModal(false);
      setSelectedSyllabus(null);
    }
  };

  const openDeleteModal = (syllabus) => {
    setSelectedSyllabus(syllabus);
    setDeleteModal(true);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center my-4">
        <Typography variant="h3">Syllabus</Typography>
        <PrimaryButton onClick={handleAddSyllabus}>
          <MdAdd size={24} />
          Add Syllabus
        </PrimaryButton>
      </div>
      {loading ? (
        <Loader className="mx-auto mt-32 border-gray-900" size="large" />
      ) : (
        <TableView
          data={formattedSyllabus}
          headers={headers}
          columnStyleMap={columnStyleMap}
          onRowClick={handleRowClick}
          onDelete={openDeleteModal}
        />
      )}
      {isModalOpen && (
        <AddSyllabusModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            fetchSyllabusAPICall();
          }}
          syllabus={selectedSyllabus}
        />
      )}
      {deleteModal && (
        <DeleteModal
          isOpen={deleteModal}
          onClose={() => setDeleteModal(false)}
          onDelete={handleDeleteSyllabus}
          loading={loading}
        />
      )}
    </div>
  );
};

export default Syllabus;
