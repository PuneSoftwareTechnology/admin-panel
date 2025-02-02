import React from "react";
import Typography from "../atoms/Typography";
import EmailNotifications from "../Organims/EmailNotification";

const Settings = () => {
  return (
    <div className="text-2xl font-bold">
      <Typography variant="h2">Settings</Typography>
      <EmailNotifications />
    </div>
  );
};

export default Settings;
