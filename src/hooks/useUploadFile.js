import { useState } from "react";
import axios from "axios";
import { BiSolidCloudUpload } from "react-icons/bi";
import Loader from "../components/atoms/Loader";

const UPLOAD_URL = "https://api.imgbb.com/1/upload";
const API_KEY = "0cc73818100d94431369ba1bc02193f5";

const useFileUpload = () => {
  const [uploadStates, setUploadStates] = useState({});

  const uploadFile = async (file, fieldId) => {
    if (!file) return;

    setUploadStates((prev) => ({
      ...prev,
      [fieldId]: { isUploading: true, uploadedUrl: null },
    }));

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post(
        `${UPLOAD_URL}?key=${API_KEY}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        setUploadStates((prev) => ({
          ...prev,
          [fieldId]: {
            isUploading: false,
            uploadedUrl: response.data.data.url,
          },
        }));
      } else {
        alert("Upload failed. Check API response.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setUploadStates((prev) => ({
        ...prev,
        [fieldId]: { ...prev[fieldId], isUploading: false },
      }));
    }
  };

  const UploadButton = ({ fieldId, showImage = true, onChange }) => {
    return (
      <div className="upload-button-wrapper">
        <input
          type="file"
          onChange={(e) => {
            const file = e.target.files[0];
            uploadFile(file, fieldId);
            if (onChange) onChange(e);
          }}
          style={{ display: "none" }}
          id={`file-upload-${fieldId}`}
        />
        <label
          htmlFor={`file-upload-${fieldId}`}
          className="styled-upload-button"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            backgroundColor: "#3b82f6",
            color: "white",
            padding: "8px 16px",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "500",
            transition: "background-color 0.2s ease",
          }}
        >
          {uploadStates[fieldId]?.isUploading ? (
            <>
              <Loader size="small" />
              <span>Uploading</span>
            </>
          ) : (
            <>
              <BiSolidCloudUpload size={24} />
              <span>Upload File</span>
            </>
          )}
        </label>
        {showImage && uploadStates[fieldId]?.uploadedUrl && (
          <div className="mt-4">
            <img
              src={uploadStates[fieldId].uploadedUrl}
              alt="Uploaded"
              className="w-50 h-50 rounded-md object-cover mx-auto"
            />
          </div>
        )}
      </div>
    );
  };

  const clearState = (fieldId) => {
    setUploadStates((prev) => ({
      ...prev,
      [fieldId]: { isUploading: false, uploadedUrl: null },
    }));
  };

  return { UploadButton, uploadStates, clearState };
};

export default useFileUpload;
