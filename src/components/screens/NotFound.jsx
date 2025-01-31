import React from "react";
import { useNavigate } from "react-router-dom";
import PrimaryButton from "../atoms/PrimaryButton";
import Typography from "../atoms/Typography";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center p-6">
      <Typography variant="h1" className="text-red-600 font-bold">
        404
      </Typography>
      <Typography variant="h4" className="mt-2">
        Oops! Page Not Found
      </Typography>
      <Typography variant="p" className="text-gray-600 mt-2">
        The page you are looking for doesn't exist or has been moved.
      </Typography>

      <div className="mt-6 flex gap-4">
        <PrimaryButton onClick={() => navigate("/home")}>
          Go to Home
        </PrimaryButton>
        <PrimaryButton onClick={() => navigate(-1)} variant="secondary">
          Go Back
        </PrimaryButton>
      </div>
    </div>
  );
};

export default NotFound;
