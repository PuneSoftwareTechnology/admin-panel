import React from "react";
import { FaUserCircle } from "react-icons/fa";
import useStore from "../../utils/zustand";
import Typography from "../atoms/Typography";

const Header = () => {
  const name = useStore((state) => state.name);
  const role = useStore((state) => state.userRole);

  return (
    <header className="bg-gray-800 text-white py-4 px-6 flex justify-between items-center lg:flex lg:justify-between hidden lg:block">
      {/* Left Section */}
      <div className="text-lg font-bold">Welcome to the App</div>

      {/* Right Section */}
      <div className="relative group">
        <FaUserCircle className="cursor-pointer text-3xl hover:text-blue-400 sm:text-2xl" />

        <div className="absolute right-0 mt-2 py-2 w-40 bg-white text-gray-800 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 border border-gray-300 hidden group-hover:block">
          <Typography
            variant="h6"
            className="border-b pb-2 text-center font-semibold text-gray-900"
          >
            {name}
          </Typography>
          <Typography variant="h6" className="text-center text-gray-600 mt-1">
            {role}
          </Typography>
        </div>
      </div>
    </header>
  );
};

export default Header;
