import React, { useState, useEffect } from "react";
import Typography from "../atoms/Typography";
import Modal from "../Molecule/Modal";
import useFileUpload from "../../hooks/useUploadFile";

const AddCourseModal = ({ isOpen, onClose, courseData, onSave }) => {
  const [name, setName] = useState("");
  const [intro, setIntro] = useState("");
  const { UploadButton, uploadStates, clearState } = useFileUpload();

  useEffect(() => {
    if (courseData) {
      setName(courseData.name || "");
      setIntro(courseData.intro || "");
      // Set other fields if necessary
    }
  }, [courseData]);

  const handleSave = () => {
    const course = {
      name,
      intro,
      // Add other fields if necessary
    };
    onSave(course);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={courseData ? "Edit Course" : "Add New Course"}
    >
      <div className="p-4">
        <form>
          <div className="mb-4">
            <Typography variant="body1" className="block text-gray-700">
              Course Name
            </Typography>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <Typography variant="body1" className="block text-gray-700">
              Course Intro
            </Typography>
            <input
              type="text"
              value={intro}
              onChange={(e) => setIntro(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <Typography variant="body1" className="block text-gray-700">
              Featured Image
            </Typography>
            <UploadButton fieldId="courseImage" />
            {uploadStates.courseImage?.uploadedUrl && (
              <div className="mt-2">
                <img
                  src={uploadStates.courseImage.uploadedUrl}
                  alt="Uploaded"
                  className="w-full h-auto rounded-md object-cover"
                />
              </div>
            )}
          </div>
          {/* Add more fields as necessary */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddCourseModal;
