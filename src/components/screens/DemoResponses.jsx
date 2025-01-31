import React, { useEffect, useState } from "react";
import { getDemoRequests } from "../../APIs/demos.services";
import Loader from "../atoms/Loader";
import ErrorPage from "./ErrorPage";
import Typography from "../atoms/Typography";
import UpdateDemoRequestModal from "../Organims/UpdateDemoRequestModal";
import TableView from "../Organims/TableView";

const DemoRequests = () => {
  const [demoRequests, setDemoRequests] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedDemo, setSelectedDemo] = useState(null);

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
    "Created At",
  ];

  const formattedData =
    demoRequests?.map((request, index) => ({
      index: request?.id || index,
      name: request.name || "",
      email: request.email || "",
      phone: request.phone || "",
      message: request.message || "",
      comment: request?.comment || "",
      next_step: request?.next_step || "",
      created_at: request?.created_at,
    })) || [];

  return (
    <div className="p-4 sm:p-6">
      <Typography variant="h4">Demo Requests</Typography>
      {formattedData.length > 0 ? (
        <TableView
          headers={headers}
          data={formattedData}
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
    </div>
  );
};

export default DemoRequests;
