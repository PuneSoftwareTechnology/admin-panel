import React, { useEffect, useState } from "react";
import { getDemoRequests } from "../../APIs/demos.services";
import Loader from "../atoms/Loader";
import moment from "moment/moment";
import ErrorPage from "./ErrorPage";
import Typography from "../atoms/Typography";

const DemoRequests = () => {
  const [demoRequests, setDemoRequests] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    return <Loader className={"mx-auto mt-32 border-gray-900"} size="large" />;
  }

  if (error) {
    return <ErrorPage />;
  }

  return (
    <div className="p-4 sm:p-6">
      {demoRequests?.length ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300 text-sm sm:text-base">
            <thead className="bg-gray-400">
              <tr>
                <th className="border border-gray-300 p-2">#</th>
                <th className="border border-gray-300 p-2">Name</th>
                <th className="border border-gray-300 p-2">Email</th>
                <th className="border border-gray-300 p-2">Phone</th>
                <th className="border border-gray-300 p-2">Message</th>
                <th className="border border-gray-300 p-2">Created At</th>
              </tr>
            </thead>
            <tbody>
              {demoRequests.map((request, index) => (
                <tr
                  key={request.id}
                  className={
                    index % 2 === 0
                      ? "bg-white hover:bg-gray-100"
                      : "bg-gray-200 hover:bg-gray-300"
                  }
                >
                  <td className="border border-gray-300 p-2 text-center">
                    {index + 1}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {request.name || ""}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {request.email || ""}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {request.phone || ""}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {request.message || ""}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {moment(request?.created_at).format("MMM Do YY")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <Typography variant="h3" className="mx-auto mt-32 text-center">
          No demo requests available.
        </Typography>
      )}
    </div>
  );
};

export default DemoRequests;
