import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleProfileClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-gray-800 text-white py-4 px-6 flex justify-between items-center lg:flex lg:justify-between hidden lg:block">
      {/* Left Section */}
      <div className="text-lg font-bold">Welcome to the App</div>

      {/* Right Section */}
      <div className="relative">
        <FaUserCircle
          className="cursor-pointer text-3xl hover:text-blue-400 sm:text-2xl"
          onClick={handleProfileClick}
        />
        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded shadow-lg">
            <div
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => setIsMenuOpen(false)}
            >
              Logged in as: Saurabh Soni
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
