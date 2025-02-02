import { useState } from "react";
import axios from "axios";
import Loader from "../components/atoms/Loader";

const UPLOAD_URL = "https://api.imgbb.com/1/upload";
const API_KEY = "0cc73818100d94431369ba1bc02193f5";

const useFileUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState(null);

  const uploadFile = async (file) => {
    if (!file) return;

    setIsUploading(true);
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

      console.log("Upload Response:", response.data);

      if (response.data.success) {
        setUploadedUrl(response.data.data.url);
      } else {
        alert("Upload failed. Check API response.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const UploadButton = () => (
    <div>
      <label className="w-fit cursor-pointer px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2">
        {isUploading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin rounded-full"></div>
            <span>Uploading</span>
          </>
        ) : (
          "Upload File"
        )}
        <input
          type="file"
          className="hidden"
          onChange={(e) => e.target.files && uploadFile(e.target.files[0])}
          disabled={isUploading}
        />
      </label>

      {/* Loader or Image preview */}
      <div className="mt-4 flex justify-start items-center">
        {isUploading ? (
          <Loader className={"mx-10 my-10 "} />
        ) : uploadedUrl ? (
          <img
            src={uploadedUrl}
            alt="Image Preview"
            className="w-50 h-50 rounded-md object-cover mx-auto"
          />
        ) : null}
      </div>
    </div>
  );

  return { UploadButton, uploadedUrl };
};

export default useFileUpload;
