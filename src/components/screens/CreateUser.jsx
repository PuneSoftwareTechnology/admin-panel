import React, { useState } from "react";
import Typography from "../atoms/Typography";
import InputBox from "../atoms/InputBox";
import PrimaryButton from "../atoms/PrimaryButton";
import Dropdown from "../atoms/DropDown";
import { createAdminUser } from "../../APIs/admin.services";
import { useNavigate } from "react-router-dom";
import Footer from "../Molecule/Footer";

const formFields = [
  {
    label: "Username",
    name: "username",
    type: "text",
    placeholder: "Enter username",
  },
  {
    label: "Password",
    name: "password",
    type: "password",
    placeholder: "Enter password",
  },
  { label: "Email", name: "email", type: "email", placeholder: "Enter email" },
  { label: "Name", name: "name", type: "text", placeholder: "Enter name" },
];

const CreateUser = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({
    username: "",
    password: "",
    email: "",
    name: "",
    role: "ADMIN",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateFields = () => {
    let validationErrors = {};
    formFields.forEach(({ name }) => {
      if (!userDetails[name].trim()) {
        validationErrors[name] = `${
          name.charAt(0).toUpperCase() + name.slice(1)
        } is required`;
      }
    });
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFields()) return;

    setLoading(true);
    try {
      const response = await createAdminUser(userDetails);
      if (response?.success) {
        navigate("/home");
      } else {
        setErrors((prev) => ({
          ...prev,
          form: "Failed to create user. Try again.",
        }));
      }
    } catch (err) {
      console.error("User creation failed", err);
      setErrors((prev) => ({
        ...prev,
        form: "An error occurred. Please try again.",
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-col md:flex-row items-center justify-center flex-grow px-4 gap-y-4 md:gap-x-4">
        <div className="hidden md:flex flex-col items-start p-6 w-1/3">
          <Typography
            variant="h3"
            as="h3"
            className="text-gray-800 text-center"
          >
            Admin Panel
          </Typography>
          <Typography className="text-gray-600 mt-2">
            Manage admin users for Pune Software Technologies.
          </Typography>
        </div>

        <div className="w-full md:w-2/3 max-w-md p-6 bg-white shadow-md rounded-lg">
          <Typography
            variant="h4"
            as="h4"
            className="text-center text-gray-800 mb-6"
          >
            Create Admin User
          </Typography>
          <form onSubmit={handleSubmit} className="space-y-4">
            {formFields.map(({ label, name, type, placeholder }) => (
              <div key={name}>
                <Typography variant="h5" as="h5">
                  {label}
                </Typography>
                <InputBox
                  id={name}
                  name={name}
                  type={type}
                  placeholder={placeholder}
                  value={userDetails[name]}
                  onChange={handleInputChange}
                  error={errors[name]}
                  required
                />
              </div>
            ))}
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
            {errors.form && <p className="text-red-500">{errors.form}</p>}
            <PrimaryButton type="submit" stretch loading={loading}>
              {loading ? "Creating User..." : "Create User"}
            </PrimaryButton>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CreateUser;
