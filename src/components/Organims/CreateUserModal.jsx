import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../Molecule/Modal";
import Typography from "../atoms/Typography";
import InputBox from "../atoms/InputBox";
import PrimaryButton from "../atoms/PrimaryButton";
import { createAdminUser, updateAdminUser } from "../../APIs/admin.services";
import Dropdown from "../atoms/DropDown";
import { toast } from "react-toastify";

const formFields = [
  {
    id: "username",
    name: "username",
    label: "Username",
    type: "text",
    placeholder: "Enter username",
  },
  {
    id: "name",
    name: "name",
    label: "Name",
    type: "text",
    placeholder: "Enter name",
  },
  {
    id: "email",
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "Enter email",
  },
  {
    id: "password",
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "Enter password",
  },
];

const roleOptions = [
  { value: "ADMIN", label: "Admin" },
  { value: "SUPER_ADMIN", label: "Super Admin" },
];

const CreateUserModal = ({ isOpen, onClose, user = null }) => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    role: "ADMIN",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const isEditMode = Boolean(user);

  useEffect(() => {
    if (user) {
      setUserDetails({
        username: user.username || "",
        name: user.name || "",
        email: user.email || "",
        role: user.role || "ADMIN",
        password: "", // Don't prefill password for editing
      });
    }
  }, [user]);

  const validateFields = () => {
    const validationErrors = {};

    formFields.forEach(({ name }) => {
      if (name !== "password" || (name === "password" && !isEditMode)) {
        if (!userDetails[name]?.trim()) {
          validationErrors[name] = `${
            name.charAt(0).toUpperCase() + name.slice(1)
          } is required`;
        }
      }
    });

    // Password validation (only if not in edit mode and password is provided)
    if (userDetails.password && userDetails.password.length < 6) {
      validationErrors.password = "Password must be at least 6 characters long";
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFields()) return;
    setLoading(true);
    try {
      let response = user
        ? await updateAdminUser(userDetails)
        : await createAdminUser(userDetails);
      if (response?.success) {
        toast.success("User saved successfully");
        onClose();
      } else {
        setErrors((prev) => ({
          ...prev,
          form: "Failed to save user. Try again.",
        }));
      }
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        form: "An error occurred. Please try again.",
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={user ? "Edit User" : "Create User"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {formFields.map(({ id, name, label, type, placeholder }) => (
          <div key={id}>
            <Typography variant="h5" as="h5">
              {label}
            </Typography>
            <InputBox
              id={id}
              name={name}
              type={type}
              placeholder={placeholder}
              value={userDetails[name]}
              onChange={handleInputChange}
              error={errors[name]}
            />
          </div>
        ))}

        <Typography variant="h5" as="h5">
          Role
        </Typography>
        <Dropdown
          id="role"
          name="role"
          options={roleOptions}
          value={userDetails.role}
          onChange={handleInputChange}
        />
        {errors.form && <p className="text-red-500">{errors.form}</p>}

        <div className="flex justify-end mb-4 mt-8">
          <PrimaryButton type="submit" disabled={loading} loading={loading}>
            {user ? "Update User" : "Create User"}
          </PrimaryButton>
        </div>
      </form>
    </Modal>
  );
};

export default CreateUserModal;
