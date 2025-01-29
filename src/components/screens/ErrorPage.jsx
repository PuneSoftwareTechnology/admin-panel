import React from "react";
import { useNavigate } from "react-router-dom";
import Typography from "../atoms/Typography";
import PrimaryButton from "../atoms/PrimaryButton";
import useStore from "../../utils/zustand";

const ErrorPage = () => {
  const setActiveTab = useStore((state) => state.setActiveTab);
  const navigate = useNavigate();

  const handleReload = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    setActiveTab("home");
    navigate("/home");
  };

  return (
    <div className="flex flex-col items-center justify-center mt-32 ">
      <Typography variant="h1">Something went wrong!</Typography>
      <Typography variant="h5">
        An unexpected error has occurred. Please try again later.
      </Typography>
      <div className="flex space-x-4 mt-4">
        <PrimaryButton onClick={handleReload}>Reload page</PrimaryButton>
        <PrimaryButton onClick={handleGoHome}>Go to Home</PrimaryButton>
      </div>
    </div>
  );
};

export default ErrorPage;
