import React, { useState, useEffect } from "react";
import InputBox from "../atoms/InputBox";
import PrimaryButton from "../atoms/PrimaryButton";
import Modal from "../Molecule/Modal";
import useStore from "../../utils/zustand";
import DropDown from "../atoms/DropDown";
import { createBlog, fetchOneBlog, updateBlog } from "../../APIs/blog.services";
import { toast } from "react-toastify";
import Typography from "../atoms/Typography";
import useFileUpload from "../../hooks/useUploadFile";
import BulletPointsInput from "../Molecule/BulletPointsInput";
import useBulletPoints from "../../hooks/useBulletPoints";

// Status options
const statusOptions = [
  { label: "Draft", value: "DRAFT" },
  { label: "Published", value: "PUBLISHED" },
  { label: "Archived", value: "ARCHIVED" },
];

// Input fields configuration
const inputFields = [
  { id: "slug", label: "Slug", type: "text", required: true },
  { id: "title", label: "Title", type: "text", required: true },
  { id: "featured_image", label: "Featured Image", type: "file" },
  { id: "introduction", label: "Introduction", type: "textarea" },
  { id: "primary_content_title", label: "Primary Content Title", type: "text" },
  {
    id: "primary_content_intro",
    label: "Primary Content Intro",
    type: "textarea",
  },
  { id: "primary_content_image", label: "Primary Content Image", type: "file" },
  {
    id: "primary_content_text",
    label: "Primary Content Text",
    type: "textarea",
  },
  {
    id: "secondary_content_title",
    label: "Secondary Content Title",
    type: "text",
  },
  {
    id: "secondary_content_intro",
    label: "Secondary Content Intro",
    type: "textarea",
  },
  {
    id: "secondary_content_image",
    label: "Secondary Content Image",
    type: "file",
  },
  {
    id: "secondary_content_text",
    label: "Secondary Content Text",
    type: "textarea",
  },
  {
    id: "tertiary_content_title",
    label: "Tertiary Content Title",
    type: "text",
  },
  {
    id: "tertiary_content_points",
    label: "Tertiary Content Points",
    type: "custom", // Mark this as a custom field
  },
  { id: "conclusion", label: "Conclusion", type: "textarea" },
  {
    id: "category_id",
    label: "Category",
    type: "select",
    options: [], // Initialize with an empty array
  },
  { id: "status", label: "Status", type: "select", options: statusOptions },
];

const AddBlogModal = ({ isOpen, onClose, blogId = null }) => {
  const categories = useStore((state) => state.categories);
  const { UploadButton, uploadStates, clearState } = useFileUpload();
  const { points, addPoint, removePoint } = useBulletPoints([]);

  const email = useStore((state) => state.email);
  const [formData, setFormData] = useState({
    slug: "",
    title: "",
    featured_image: null,
    introduction: "",
    primary_content_title: "",
    primary_content_intro: "",
    primary_content_image: null,
    primary_content_text: "",
    secondary_content_title: "",
    secondary_content_intro: "",
    secondary_content_image: null,
    secondary_content_text: "",
    tertiary_content_title: "",
    tertiary_content_points: [],
    conclusion: "",
    category_id: "",
    status: "Draft",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (categories.length > 0) {
      inputFields.find((field) => field.id === "category_id").options =
        categories.map((category) => ({
          label: category.name,
          value: category.id,
        }));
    }
  }, [categories]);

  useEffect(() => {
    if (blogId) {
      const fetchBlog = async () => {
        try {
          const response = await fetchOneBlog(blogId);
          if (response?.success) {
            const blog = response.data;
            setFormData({
              ...blog,
              tertiary_content_points: blog.tertiary_content_points || [], // Ensure it's an array
            });

            if (blog?.tertiary_content_points) {
              JSON.parse(blog?.tertiary_content_points).forEach((point) =>
                addPoint(point)
              );
            }
          }
        } catch (err) {
          console.error("Error fetching blog:", err);
        }
      };
      fetchBlog();
    }
  }, [blogId]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.slug || !formData.title) {
      setError("Slug and Title are required");
      setLoading(false);
      return;
    }

    const blogPayload = {
      ...formData,
      author_id: email,
      featured_image:
        uploadStates.featured_image?.uploadedUrl || formData.featured_image,
      primary_content_image:
        uploadStates.primary_content_image?.uploadedUrl ||
        formData.primary_content_image,
      secondary_content_image:
        uploadStates.secondary_content_image?.uploadedUrl ||
        formData.secondary_content_image,
      tertiary_content_points: points, // Use the bullet points from the hook
    };

    delete blogPayload["file-upload-featured_image"];
    delete blogPayload["file-upload-primary_content_image"];
    delete blogPayload["file-upload-secondary_content_image"];
    // delete blogPayload["category"];

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
      clearState("featured_image");
      clearState("primary_content_image");
      clearState("secondary_content_image");
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
            <Typography variant="h6" className="mb-2">
              {field.label}
            </Typography>
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
              <>
                {uploadStates[field.id]?.uploadedUrl && (
                  <img
                    src={uploadStates[field.id].uploadedUrl}
                    alt={field.label}
                    className="w-50 h-50 rounded-md object-cover mx-auto"
                  />
                )}
                {formData[field?.id] ? (
                  <img
                    src={formData[field?.id]}
                    alt="Image Preview"
                    className="w-50 h-50 rounded-md object-cover mx-auto"
                  />
                ) : (
                  <UploadButton
                    fieldId={field.id}
                    showImage={false}
                    onChange={(e) => handleChange(e)}
                  />
                )}
              </>
            ) : field.type === "custom" &&
              field.id === "tertiary_content_points" ? (
              <BulletPointsInput
                points={points}
                onAddPoint={addPoint}
                onRemovePoint={removePoint}
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

        <div className="flex justify-end">
          <PrimaryButton type="submit" disabled={loading} loading={loading}>
            {blogId ? "Update Blog" : "Add Blog"}
          </PrimaryButton>
        </div>
      </form>
    </Modal>
  );
};

export default AddBlogModal;
