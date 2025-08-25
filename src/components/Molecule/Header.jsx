import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { HiLogout } from "react-icons/hi";
import useStore from "../../utils/zustand";
import Typography from "../atoms/Typography";
import LogoutModal from "../Organims/LogoutModal"; // Add this import

const Header = () => {
  const name = useStore((state) => state.name);
  const role = useStore((state) => state.userRole);
  const [openModal, setOpenModal] = useState(false); // Add state for modal

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
    setOpenModal(false);
  };

  return (
    <header className="bg-gray-800 text-white py-4 px-6 flex justify-between items-center lg:flex lg:justify-between hidden lg:block">
      {/* Left Section */}
      <div className="text-lg font-bold">Welcome to the App</div>

      {/* Right Section */}
      <div className="relative group">
        <FaUserCircle className="cursor-pointer text-3xl hover:text-blue-400 sm:text-2xl" />

        <div className="absolute right-0 pt-2 w-45 bg-white text-gray-800 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 border border-gray-300 hidden group-hover:block">
          <Typography
            variant="h6"
            className="border-b pb-2 text-center font-semibold text-gray-900"
          >
            {name?.toUpperCase() || "Admin"}
          </Typography>
          <Typography variant="h6" className="text-center text-gray-600 mt-1">
            {role}
          </Typography>
          <button
            className="flex items-center gap-2 w-full text-left p-2 text-white rounded bg-red-500 text-center hover:bg-red-600 mt-2"
            onClick={() => setOpenModal(true)}
          >
            <HiLogout className="text-white" />
            Logout
          </button>
        </div>
      </div>
      <LogoutModal
        isOpen={openModal}
        onClose={() => {
          setOpenModal(false);
        }}
        handleLogout={handleLogout}
      />
    </header>
  );
};

export default Header;
