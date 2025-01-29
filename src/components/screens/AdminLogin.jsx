import React, { useState } from "react";
import { toast } from "react-toastify";
import useStore from "../../utils/zustand";
import Typography from "../atoms/Typography";
import InputBox from "../atoms/InputBox";
import PrimaryButton from "../atoms/PrimaryButton";
import { adminLogin } from "../../APIs/admin.services";
import { useNavigate } from "react-router-dom";
import Footer from "../Molecule/Footer";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const setAuthenticated = useStore((state) => state.setAuthenticated);
  const setJWTToken = useStore((state) => state.setJwtToken);
  const setEmail = useStore((state) => state.setEmail);
  const setRole = useStore((state) => state.setRole);
  const setName = useStore((state) => state.setName);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      const response = await adminLogin(credentials);
      if (response?.success) {
        setAuthenticated(true);
        setJWTToken(response.token);
        setEmail(response?.data?.email);
        setRole(response?.data?.role);
        setName(response?.data?.name);
        navigate("/home");
      } else {
        toast.error("Login failed! Try again.");
      }
    } catch (err) {
      console.error("Login failed", err);
      toast.error("An error occurred during login.");
    } finally {
      setLoading(false);
      setCredentials({
        username: "",
        password: "",
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-col md:flex-row items-center justify-center flex-grow px-4 gap-y-4 md:gap-x-4">
        <div className="max-w-xl w-full text-center">
          <Typography variant="h1" as="h1" className="text-gray-800">
            Welcome to Pune Software Technologies Admin Panel
          </Typography>
          <p className="mt-4 text-gray-600 text-sm md:text-base">
            Access powerful tools to manage users, monitor analytics, and
            configure system settings efficiently.
          </p>
        </div>
        <div className="w-full max-w-md p-6 bg-white shadow-md rounded-lg mt-8">
          <Typography
            variant="h3"
            as="h3"
            className="text-center text-gray-800 mb-6"
          >
            Admin Login
          </Typography>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Typography variant="h5" as="h5">
              Username
            </Typography>
            <InputBox
              id="username"
              name="username"
              type="username"
              placeholder="Username Address"
              value={credentials.username}
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
              value={credentials.password}
              onChange={handleInputChange}
              required
            />
            <PrimaryButton type="submit" stretch loading={loading}>
              {loading ? "Logging in..." : "Login"}
            </PrimaryButton>
          </form>
        </div>
      </div>
      <Footer className="mt-auto" />
    </div>
  );
};

export default AdminLogin;
