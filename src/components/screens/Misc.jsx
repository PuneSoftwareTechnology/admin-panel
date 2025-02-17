import React from "react";
import Typography from "../atoms/Typography";
import Companies from "../Organims/Companies";

const Misc = () => {
  const headers = ["ID", "Name", "Description", "Created At"];

  return (
    <div className="p-4">
      <Typography variant="h2">Miscellaneous Data</Typography>
      <Companies />
    </div>
  );
};

export default Misc;
