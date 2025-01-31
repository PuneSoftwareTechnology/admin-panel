import React, { useState, useEffect } from "react";
import InputBox from "../atoms/InputBox";
import PrimaryButton from "../atoms/PrimaryButton";
import Modal from "../Molecule/Modal";
import useStore from "../../utils/zustand";
import DropDown from "../atoms/DropDown";
import { createBlog, fetchOneBlog, updateBlog } from "../../APIs/blog.services";
import { toast } from "react-toastify";
import Typography from "../atoms/Typography";

// Category and Status options
const categoryOptions = [
  { label: "SAP Training", value: "SAP" },
  { label: "Cloud Technologies", value: "CLOUD" },
  { label: "Data Analytics", value: "DATA_ANALYTICS" },
  { label: "Machine Learning & AI", value: "AI&ML" },
  { label: "Cyber Security", value: "CYBER_SECURITY" },
];

const statusOptions = [
  { label: "Draft", value: "DRAFT" },
  { label: "Published", value: "PUBLISHED" },
  { label: "Archived", value: "ARCHIVED" },
];

// Input fields configuration
const inputFields = [
  { id: "title", label: "Title", type: "text", required: true },
  { id: "slug", label: "Slug", type: "text", required: true },
  { id: "content", label: "Content", type: "textarea", required: true },
  { id: "introduction", label: "Introduction", type: "textarea" },
  { id: "conclusion", label: "Conclusion", type: "textarea" },
  { id: "image", label: "Featured Image", type: "file" },
  {
    id: "category",
    label: "Category",
    type: "select",
    options: categoryOptions,
  },
  { id: "status", label: "Status", type: "select", options: statusOptions },
];

const AddBlogModal = ({ isOpen, onClose, blogId = null }) => {
  const email = useStore((state) => state.email);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "SAP",
    status: "Draft",
    slug: "",
    introduction: "",
    conclusion: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (blogId) {
      const fetchBlog = async () => {
        try {
          const response = await fetchOneBlog(blogId);
          if (response?.success) {
            const blog = response.data;
            setFormData({
              title: blog.title || "",
              content: blog.main_content || "",
              category: blog.category || "SAP",
              status: blog.status || "PUBLISHED",
              slug: blog.slug || "",
              introduction: blog.introduction || "",
              conclusion: blog.conclusion || "",
              image: blog.featured_image || null,
            });
            setImagePreview(blog.featured_image || null);
          }
        } catch (err) {
          console.error("Error fetching blog:", err);
        }
      };
      fetchBlog();
    }
  }, [blogId]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.title || !formData.content) {
      setError("Title and Content are required");
      setLoading(false);
      return;
    }

    const blogPayload = {
      ...formData,
      main_content: formData?.content,
      author_id: email,
      featured_image:
        formData?.image ||
        "https://imgs.search.brave.com/PjE33tVn9FgNIvLyiXIda3Iuc-QnbB3f_cexAHHWsHU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9idXJz/dC5zaG9waWZ5Y2Ru/LmNvbS9waG90b3Mv/YS1kcm9wLW9mLXBp/bmstYW5kLXllbGxv/dy1wYWludC1pbi13/YXRlci5qcGc_d2lk/dGg9MTAwMCZmb3Jt/YXQ9cGpwZyZleGlm/PTAmaXB0Yz0w",
      id: blogId,
    };
    delete blogPayload?.content;
    delete blogPayload?.image;
    if (!blogId) {
      delete blogPayload?.id;
    }

    console.log(blogPayload);

    try {
      const response = blogId
        ? await updateBlog(blogPayload)
        : await createBlog(blogPayload);

      if (response?.success) {
        toast.success(response.message || "Blog saved successfully!");
        onClose();
      } else {
        toast.error("Error occurred. Try again!");
      }
    } catch (err) {
      console.error("Error in handleSubmit:", err);
      toast.error("An error occurred while processing your request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={blogId ? "Edit Blog" : "Add Blog"}
      width="max-w-[50vw]"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {inputFields.map((field) => (
          <div key={field.id}>
            <Typography variant="h6">{field.label}</Typography>
            {field.type === "textarea" ? (
              <textarea
                id={field.id}
                name={field.id}
                placeholder={`Enter ${field.label.toLowerCase()}`}
                value={formData[field.id]}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required={field.required}
              />
            ) : field.type === "select" ? (
              <DropDown
                id={field.id}
                name={field.id}
                value={formData[field.id]}
                options={field.options}
                onChange={handleChange}
              />
            ) : field.type === "file" ? (
              <input
                type="file"
                id={field.id}
                name={field.id}
                accept="image/*"
                onChange={handleImageChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            ) : (
              <InputBox
                id={field.id}
                name={field.id}
                type={field.type}
                placeholder={`Enter ${field.label.toLowerCase()}`}
                value={formData[field.id]}
                onChange={handleChange}
                required={field.required}
                error={
                  error && !formData[field.id]
                    ? `${field.label} is required`
                    : ""
                }
              />
            )}
            {error && !formData[field.id] && field.required && (
              <p className="text-red-500 text-sm">{error}</p>
            )}
          </div>
        ))}

        {imagePreview && (
          <img
            src={imagePreview}
            alt="Image Preview"
            className="mt-2 max-w-full h-auto rounded-md"
          />
        )}

        <div className="flex justify-end">
          <PrimaryButton type="submit" loading={loading}>
            {blogId ? "Update Blog" : "Add Blog"}
          </PrimaryButton>
        </div>
      </form>
    </Modal>
  );
};

export default AddBlogModal;
