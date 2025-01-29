import React from "react";
import { useNavigate } from "react-router-dom";
import Typography from "../atoms/Typography";
import PrimaryButton from "../atoms/PrimaryButton";

const NotAuthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <Typography variant="h1" className="text-red-600 text-center">
        403 - Not Authorized
      </Typography>
      <Typography variant="body1" className="text-gray-700 text-center mt-2">
        You do not have permission to access this page.
      </Typography>

      <div className="mt-6 flex flex-col sm:flex-row gap-4">
        <PrimaryButton onClick={() => navigate(-1)}>Go Back</PrimaryButton>
        <PrimaryButton onClick={() => navigate("/home")}>
          Go to Home
        </PrimaryButton>
      </div>
    </div>
  );
};

export default NotAuthorized;
