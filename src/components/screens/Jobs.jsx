import React, { useEffect, useState } from "react";
import Loader from "../atoms/Loader";
import Typography from "../atoms/Typography";
import DeleteModal from "../Organims/DeleteModal";
import { toast } from "react-toastify";
import TableView from "../Organims/TableView";
import {
  fetchallJobs,
  deleteJob,
  addJob,
  updateJob,
} from "../../APIs/jobs.services";
import useStore from "../../utils/zustand";
import JobModal from "../Organims/JobModal";
import PrimaryButton from "../atoms/PrimaryButton";
import { MdAdd } from "react-icons/md";

const Jobs = () => {
  const email = useStore((state) => state.email);
  const courses = useStore((state) => state.courseNames);
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [jobModal, setJobModal] = useState(false);
  const [jobLoading, setJobLoading] = useState(false);

  const fetchJobsAPICall = async () => {
    setLoading(true);
    try {
      const response = await fetchallJobs();

      if (response?.success && Array.isArray(response?.data)) {
        setJobs(response.data);
      } else {
        setJobs([]);
      }
    } catch (error) {
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobsAPICall();
  }, []);

  const deleteJobAPICALL = async () => {
    setDeleteLoading(true);
    try {
      const payload = {
        id: selectedJob?.id,
        user_email: email,
      };

      const response = await deleteJob(payload);
      if (response?.success) {
        toast.success("Job deleted successfully");
        setDeleteModal(false);
        fetchJobsAPICall();
      } else {
        toast.error("Failed to delete job");
      }
    } catch (err) {
      toast.error("An error occurred while deleting job");
    } finally {
      setDeleteLoading(false);
    }
  };

  const saveJobAPICALL = async (job) => {
    setJobLoading(true);
    try {
      const response = selectedJob
        ? await updateJob({
            ...job,
            id: selectedJob.id,
            user_email: email,
          })
        : await addJob({
            ...job,
            user_email: email,
          });

      if (response?.success) {
        toast.success(`Job ${selectedJob ? "updated" : "added"} successfully`);
        setJobModal(false);
        fetchJobsAPICall();
      } else {
        toast.error(`Failed to ${selectedJob ? "update" : "add"} job`);
      }
    } catch (err) {
      toast.error(
        `An error occurred while ${selectedJob ? "updating" : "adding"} job`
      );
    } finally {
      setJobLoading(false);
    }
  };

  const headers = [
    "ID",
    "Name",
    "Description",
    "Created at",
    "Related course",
    "User email",
  ];

  const openDeleteModalHandler = (job) => {
    setSelectedJob(job);
    setDeleteModal(true);
  };

  const openJobModalHandler = (job = null) => {
    setSelectedJob(job);
    setJobModal(true);
  };

  const formattedJobs = jobs.map((item, index) => ({
    id: item?.id || index,
    name: item?.name || "",
    description: item?.description || "",
    created_at: item?.created_at || "",
    related_course:
      courses.find((course) => course?.id === item?.related_course)?.name || "",
    user_email: item?.user_email || "",
  }));

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center my-4">
        <Typography variant="h3">Jobs</Typography>
        <PrimaryButton onClick={() => openJobModalHandler(null)}>
          <MdAdd size={24} color="white" />
          Add Job
        </PrimaryButton>
      </div>
      {loading ? (
        <Loader className="mx-auto mt-32 border-gray-900" size="large" />
      ) : (
        <>
          <TableView
            data={formattedJobs}
            headers={headers}
            onDelete={openDeleteModalHandler}
            onRowClick={openJobModalHandler}
          />

          {deleteModal && (
            <DeleteModal
              isOpen={deleteModal}
              onClose={() => setDeleteModal(false)}
              onDelete={deleteJobAPICALL}
              loading={deleteLoading}
            />
          )}

          {jobModal && (
            <JobModal
              isOpen={jobModal}
              onClose={() => {
                setSelectedJob(null);
                setJobModal(false);
              }}
              onSave={saveJobAPICALL}
              loading={jobLoading}
              job={selectedJob}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Jobs;
