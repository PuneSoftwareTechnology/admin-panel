import React, { useEffect, useState } from "react";
import { deleteDemo, getDemoRequests } from "../../APIs/demos.services";
import Loader from "../atoms/Loader";
import ErrorPage from "./ErrorPage";
import Typography from "../atoms/Typography";
import UpdateDemoRequestModal from "../Organims/UpdateDemoRequestModal";
import TableView from "../Organims/TableView";
import DeleteModal from "../Organims/DeleteModal";
import { toast } from "react-toastify";
import useStore from "../../utils/zustand";

const DemoRequests = () => {
  const courses = useStore((state) => state.courseNames);
  const [demoRequests, setDemoRequests] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedDemo, setSelectedDemo] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchDemoRequests = async () => {
    try {
      const data = await getDemoRequests();
      setDemoRequests(data?.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDemoRequests();
  }, []);

  if (loading) {
    return <Loader className="mx-auto mt-32 border-gray-900" size="large" />;
  }

  if (error) {
    return <ErrorPage />;
  }

  const headers = [
    "ID",
    "Name",
    "Email",
    "Phone",
    "Message",
    "Comment",
    "Next Step",
    "Course",
  ];

  const formattedData =
    demoRequests?.map((request, index) => ({
      id: request?.id || index,
      name: request.name || "",
      email: request.email || "",
      phone: request.phone || "",
      message: request.message || "",
      comment: request?.comment || "",
      next_step: request?.next_step || "",
      course:
        courses?.find((item) => item?.id === request?.course_id)?.name || "",
    })) || [];

  const deleteDemoAPICALL = async () => {
    setDeleteLoading(true);
    try {
      const response = await deleteDemo({ id: selectedDemo?.index });
      console.log(response, "response");

      if (response?.success) {
        toast.success("Demo deleted successfully");
        setDemoRequests(
          demoRequests.filter((demo) => demo.id !== selectedDemo?.id)
        );
        setDeleteModal(false);
        fetchDemoRequests();
      } else {
        toast.error("Failed to delete Demo");
      }
    } catch (err) {
      console.error("Error deleting Demo:", err);
      toast.error("An error occurred while deleting Demo");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <Typography variant="h4">Demo Requests</Typography>
      {formattedData.length > 0 ? (
        <TableView
          headers={headers}
          data={formattedData}
          onDelete={(row) => {
            setDeleteModal(true);
            setSelectedDemo(row);
          }}
          onRowClick={(row) => {
            console.log("lrskjhgn;o4tlkh");
            setSelectedDemo(row);
            setOpenModal(true);
          }}
        />
      ) : (
        <Typography variant="h3" className="mx-auto mt-32 text-center">
          No demo requests available.
        </Typography>
      )}

      <UpdateDemoRequestModal
        isOpen={openModal}
        onClose={() => {
          setOpenModal(false);
          fetchDemoRequests();
        }}
        demoRequest={selectedDemo}
      />
      {deleteModal && (
        <DeleteModal
          isOpen={deleteModal}
          onClose={() => setDeleteModal(false)}
          onDelete={deleteDemoAPICALL}
          loading={deleteLoading}
        />
      )}
    </div>
  );
};

export default DemoRequests;
