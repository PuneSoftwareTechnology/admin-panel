import React, { useEffect, useState } from "react";
import Loader from "../atoms/Loader";
import Typography from "../atoms/Typography";
import DeleteModal from "../Organims/DeleteModal";
import { toast } from "react-toastify";
import TableView from "../Organims/TableView";
import {
  fetchAllProjects,
  deleteProject,
  addProject,
  updateProject,
} from "../../APIs/projects.services";
import useStore from "../../utils/zustand";
import ProjectModal from "../Organims/ProjectModal";
import PrimaryButton from "../atoms/PrimaryButton";
import { MdAdd } from "react-icons/md";

const Projects = () => {
  const email = useStore((state) => state.email);
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [projectModal, setProjectModal] = useState(false);
  const [projectLoading, setProjectLoading] = useState(false);

  const fetchProjectsAPICall = async () => {
    setLoading(true);
    try {
      const response = await fetchAllProjects();

      if (response?.success && Array.isArray(response?.data)) {
        setProjects(response.data);
      } else {
        setProjects([]);
      }
    } catch (error) {
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectsAPICall();
  }, []);

  const deleteProjectAPICALL = async () => {
    setDeleteLoading(true);
    try {
      const payload = {
        id: selectedProject?.id,
        user_email: email,
      };

      const response = await deleteProject(payload);
      if (response?.success) {
        toast.success("Project deleted successfully");
        setDeleteModal(false);
        fetchProjectsAPICall();
      } else {
        toast.error("Failed to delete project");
      }
    } catch (err) {
      toast.error("An error occurred while deleting project");
    } finally {
      setDeleteLoading(false);
    }
  };

  const saveProjectAPICALL = async (project) => {
    setProjectLoading(true);
    try {
      const payload = {
        ...project,
        user_email: email,
        ...(selectedProject && { id: selectedProject.id }),
      };

      console.log("Payload being sent:", payload); // Add this line for logging

      const response = selectedProject
        ? await updateProject(payload)
        : await addProject(payload);

      if (response?.success) {
        toast.success(
          `Project ${selectedProject ? "updated" : "added"} successfully`
        );
        setProjectModal(false);
        fetchProjectsAPICall();
      } else {
        toast.error(`Failed to ${selectedProject ? "update" : "add"} project`);
      }
    } catch (err) {
      toast.error(
        `An error occurred while ${
          selectedProject ? "updating" : "adding"
        } project`
      );
    } finally {
      setProjectLoading(false);
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

  const openDeleteModalHandler = (project) => {
    setSelectedProject(project);
    setDeleteModal(true);
  };

  const openProjectModalHandler = (project = null) => {
    setSelectedProject(project);
    setProjectModal(true);
  };

  const formattedProjects = projects.map((item, index) => ({
    id: item?.id || index,
    name: item?.name || "",
    description: item?.description || "",
    created_at: item?.created_at || "",
    related_course: item?.related_course || "",
    user_email: item?.user_email || "",
  }));

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center my-4">
        <Typography variant="h3">Projects</Typography>
        <PrimaryButton onClick={() => openProjectModalHandler(null)}>
          {" "}
          <MdAdd size={24} color="white" />
          Add Project
        </PrimaryButton>
      </div>
      {loading ? (
        <Loader />
      ) : (
        <>
          <TableView
            data={formattedProjects}
            headers={headers}
            onDelete={openDeleteModalHandler}
            onRowClick={openProjectModalHandler}
          />

          {deleteModal && (
            <DeleteModal
              isOpen={deleteModal}
              onClose={() => setDeleteModal(false)}
              onDelete={deleteProjectAPICALL}
              loading={deleteLoading}
            />
          )}

          {projectModal && (
            <ProjectModal
              isOpen={projectModal}
              onClose={() => {
                setSelectedProject(null);
                setProjectModal(false);
              }}
              onSave={saveProjectAPICALL}
              loading={projectLoading}
              project={selectedProject}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Projects;
