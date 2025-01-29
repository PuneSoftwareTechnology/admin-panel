import React, { useState } from "react";
import { toast } from "react-toastify";
import Typography from "../atoms/Typography";
import InputBox from "../atoms/InputBox";
import PrimaryButton from "../atoms/PrimaryButton";
// import { createAdminUser } from "../../APIs/admin.services";
import Dropdown from "../atoms/DropDown";

const CreateUser = () => {
  const [userDetails, setUserDetails] = useState({
    username: "",
    password: "",
    email: "",
    role: "ADMIN",
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails({ ...userDetails, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // try {
    //   const response = await createAdminUser(userDetails);
    //   if (response?.success) {
    //     toast.success("User created successfully!");
    //     setUserDetails({
    //       username: "",
    //       password: "",
    //       role: "ADMIN",
    //     });
    //   } else {
    //     toast.error("Failed to create user. Try again.");
    //   }
    // } catch (err) {
    //   console.error("User creation failed", err);
    //   toast.error("An error occurred. Please try again.");
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-md p-6 bg-white shadow-md rounded-lg">
        <Typography
          variant="h3"
          as="h3"
          className="text-center text-gray-800 mb-6"
        >
          Create Admin User
        </Typography>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Typography variant="h5" as="h5">
            Username
          </Typography>
          <InputBox
            id="username"
            name="username"
            type="text"
            placeholder="Username"
            value={userDetails.username}
            onChange={handleInputChange}
            required
          />
          <Typography variant="h5" as="h5">
            Password
          </Typography>
          <InputBox
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            value={userDetails.password}
            onChange={handleInputChange}
            required
          />
          <InputBox
            id="email"
            name="email"
            type="email"
            placeholder="Email"
            value={userDetails.email}
            onChange={handleInputChange}
            required
          />
          <Typography variant="h5" as="h5">
            Role
          </Typography>
          <Dropdown
            id="role"
            name="role"
            options={[
              { value: "SUPER_ADMIN", label: "Super Admin" },
              { value: "ADMIN", label: "Admin" },
            ]}
            value={userDetails.role}
            onChange={(e) =>
              setUserDetails({ ...userDetails, role: e.target.value })
            }
          />
          <PrimaryButton type="submit" stretch loading={loading}>
            {loading ? "Creating User..." : "Create User"}
          </PrimaryButton>
        </form>
      </div>
    </div>
  );
};

export default CreateUser;
