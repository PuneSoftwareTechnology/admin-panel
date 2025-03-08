import React from "react";
import Typography from "../../components/atoms/Typography";
import PrimaryButton from "../atoms/PrimaryButton";
import { PST_URL } from "../../utils/urls";
import { MdOpenInNew } from "react-icons/md";

const Dashboard = () => {
  const handleClick = (e) => {
    e.preventDefault();
    window.open(`${PST_URL}/add-testimonial`, "_blank");
  };
  return (
    <div className="text-2xl font-bold">
      <div className="flex justify-start gap-x-4 items-start mt-8">
        <Typography variant="h2">Testmonial Form :</Typography>
        <PrimaryButton onClick={handleClick}>
          Form <MdOpenInNew size={30} color="white" />
        </PrimaryButton>
      </div>
    </div>
  );
};

export default Dashboard;
