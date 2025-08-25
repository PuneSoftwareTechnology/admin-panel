import { useEffect, useState } from "react";
import { deleteDemo, getDemoRequests } from "../../APIs/demos.services";
import Loader from "../atoms/Loader";
import ErrorPage from "./ErrorPage";
import Typography from "../atoms/Typography";
import UpdateDemoRequestModal from "../Organims/UpdateDemoRequestModal";
import TableView from "../Organims/TableView";
import DeleteModal from "../Organims/DeleteModal";
import { toast } from "react-toastify";
import useStore from "../../utils/zustand";
import moment from "moment";
import { FaDownload } from "react-icons/fa";

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
    "created At",
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
      created_at: moment(request?.created_at).format("DD/MM/YYYY"),
      course:
        courses?.find((item) => item?.id === request?.course_id)?.name || "",
    })) || [];

  const deleteDemoAPICALL = async () => {
    setDeleteLoading(true);
    try {
      const response = await deleteDemo({ id: selectedDemo?.id });

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

  const customComponents = {
    Message: ({ value }) => (
      <span className="block break-words whitespace-normal">{value}</span>
    ),
  };

  const handleDownloadCSV = () => {
    if (!formattedData.length) return;

    const exportData = formattedData.map(
      ({
        id,
        name,
        email,
        phone,
        message,
        comment,
        next_step,
        created_at,
        course,
      }) => ({
        ID: id,
        Name: name,
        Email: email,
        Phone: phone,
        Message: message,
        Comment: comment,
        "Next Step": next_step,
        "Created At": created_at,
        Course: course,
      })
    );

    const csvRows = [
      Object.keys(exportData[0]).join(","),
      ...exportData.map((row) =>
        Object.values(row)
          .map((val) => `"${String(val).replace(/"/g, '""')}"`)
          .join(",")
      ),
    ];
    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "demo_requests.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <Typography variant="h4">Enquiries</Typography>
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
      {formattedData.length > 0 ? (
        <TableView
          columnStyleMap={customComponents}
          headers={headers}
          data={formattedData}
          onDelete={(row) => {
            setDeleteModal(true);
            setSelectedDemo(row);
          }}
          onRowClick={(row) => {
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
