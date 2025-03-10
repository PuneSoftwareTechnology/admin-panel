import { useState } from "react";
import axios from "axios";
import { BiSolidCloudUpload } from "react-icons/bi";
import Loader from "../components/atoms/Loader";
import { UPLOAD_URL } from "../utils/urls";


const useFileUpload = () => {
  const [uploadStates, setUploadStates] = useState({});

  const uploadFile = async (file, fieldId, isMulti) => {
    if (!file) return;

    setUploadStates((prev) => ({
      ...prev,
      [fieldId]: {
        isUploading: true,
        uploadedUrl: isMulti ? [...(prev[fieldId]?.uploadedUrl || [])] : null,
      },
    }));

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post(
        `${UPLOAD_URL}?key=4d8e213b8caa0364d5df19af520bcd0f`,
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
            uploadedUrl: isMulti
              ? [...(prev[fieldId]?.uploadedUrl || []), response.data.data.url]
              : response.data.data.url,
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

  const removeFile = (fieldId, index = null) => {
    setUploadStates((prev) => {
      if (index !== null && Array.isArray(prev[fieldId]?.uploadedUrl)) {
        const updatedUrls = prev[fieldId].uploadedUrl.filter(
          (_, i) => i !== index
        );
        return {
          ...prev,
          [fieldId]: { isUploading: false, uploadedUrl: updatedUrls },
        };
      }
      return {
        ...prev,
        [fieldId]: { isUploading: false, uploadedUrl: null },
      };
    });
  };

  const UploadButton = ({
    fieldId,
    showImage = true,
    onChange,
    existingImageUrl = null,
    isMulti = false,
  }) => {
    return (
      <div className="upload-button-wrapper">
        <input
          type="file"
          onChange={(e) => {
            const file = e.target.files[0];
            uploadFile(file, fieldId, isMulti);
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
        {showImage && (
          <div className="mt-4">
            {existingImageUrl && !uploadStates[fieldId]?.uploadedUrl && (
              <div className="relative">
                <img
                  src={existingImageUrl}
                  alt="Existing"
                  className="w-50 h-50 rounded-md object-cover mx-auto"
                />
              </div>
            )}
            {Array.isArray(uploadStates[fieldId]?.uploadedUrl)
              ? uploadStates[fieldId].uploadedUrl.map((url, index) => (
                  <div key={index} className="relative">
                    <img
                      src={url}
                      alt="Uploaded"
                      className="w-50 h-50 rounded-md object-cover mx-auto"
                    />
                  </div>
                ))
              : uploadStates[fieldId]?.uploadedUrl && (
                  <div className="relative">
                    <img
                      src={uploadStates[fieldId].uploadedUrl}
                      alt="Uploaded"
                      className="w-50 h-50 rounded-md object-cover mx-auto"
                    />
                  </div>
                )}
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

  return { UploadButton, uploadStates, clearState, removeFile };
};

export default useFileUpload;
