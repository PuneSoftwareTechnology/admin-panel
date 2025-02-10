import React, { useEffect, useState } from "react";
import { fetchAllBlogs, updateBlog } from "../../APIs/blog.services";
import Loader from "../atoms/Loader";
import PrimaryButton from "../atoms/PrimaryButton";
import { MdAdd } from "react-icons/md";
import AddBlogModal from "../Organims/AddBlogModal";
import Typography from "../atoms/Typography";
import DeleteModal from "../Organims/DeleteModal";
import { toast } from "react-toastify";
import TableView from "../Organims/TableView";

const Blogs = () => {
  const [loading, setLoading] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchBlogsAPICall = async () => {
    setLoading(true);
    try {
      const response = await fetchAllBlogs();
      if (response?.success && Array.isArray(response?.data)) {
        setBlogs(response.data);
      } else {
        setBlogs([]);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogsAPICall();
  }, []);

  const deleteBlogAPICall = async () => {
    setDeleteLoading(true);
    try {
      const response = await updateBlog({
        id: selectedBlog?.id,
        deleted: true,
      });
      if (response?.success) {
        toast.success("Blog deleted successfully");
        setBlogs(blogs.filter((blog) => blog.id !== selectedBlog?.id));
        setDeleteModal(false);
        fetchBlogsAPICall();
      } else {
        toast.error("Failed to delete blog");
      }
    } catch (err) {
      console.error("Error deleting blog:", err);
      toast.error("An error occurred while deleting blog");
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return <Loader className="mx-auto mt-32 border-gray-900" size="large" />;
  }

  const headers = ["ID", "Title", "Slug", "Created At", "Author", "Status"];

  const colorScheme = {
    DRAFT: "bg-yellow-400",
    PUBLISHED: "bg-green-700",
    ARCHIVED: "bg-red-700",
  };
  const customComponents = {
    Status: ({ value }) => (
      <span
        className={`text-white text-xs font-semibold px-2 py-1 rounded-md ${colorScheme[value]}`}
      >
        {value}
      </span>
    ),
  };
  const formattedBlogs = blogs.map((blog) => ({
    id: blog.id,
    title: blog.title,
    slug: blog.slug,
    created_at: blog.created_at,
    Auther: blog?.author_id,
    status: blog?.status,
  }));

  return (
    <div className="container mx-auto p-4">
      {/* Add Blog Button */}
      <div className="flex justify-between items-center mb-4">
        <Typography variant="h3">Blogs</Typography>
        <PrimaryButton onClick={() => setOpenAddModal(true)}>
          <MdAdd size={24} color="white" />
          Add Blog
        </PrimaryButton>
      </div>

      {/* Blogs Table */}
      <TableView
        headers={headers}
        data={formattedBlogs}
        columnStyleMap={customComponents}
        onRowClick={(row) => {
          setSelectedBlog(row);
          setOpenAddModal(true);
        }}
        onDelete={(row) => {
          setSelectedBlog(row);
          setDeleteModal(true);
        }}
      />

      {/* Add Blog Modal */}
      {openAddModal && (
        <AddBlogModal
          isOpen={openAddModal}
          onClose={() => {
            setSelectedBlog(null);
            setOpenAddModal(false);
            fetchBlogsAPICall();
          }}
          blogId={selectedBlog?.slug}
        />
      )}

      {/* Delete Modal */}
      {deleteModal && (
        <DeleteModal
          isOpen={deleteModal}
          onClose={() => setDeleteModal(false)}
          onDelete={deleteBlogAPICall}
          loading={deleteLoading}
        />
      )}
    </div>
  );
};

export default Blogs;
