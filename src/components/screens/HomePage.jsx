import React, { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  HiMenuAlt3,
  HiHome,
  HiOutlineCog,
  HiLogout,
  HiViewGrid,
} from "react-icons/hi";
import { FaCodePullRequest } from "react-icons/fa6";
import { FiXSquare } from "react-icons/fi";
import LOGO from "../../assets/Logo.png";
import Typography from "../atoms/Typography";
import useStore from "../../utils/zustand";
import Header from "../Molecule/Header";
import Footer from "../Molecule/Footer";
import PrimaryButton from "../atoms/PrimaryButton"; // Assuming you have this button component
import SecondaryButton from "../atoms/SecondaryButton";

const menuItems = [
  { label: "Home", path: "/home", icon: <HiHome /> },
  { label: "Dashboard", path: "dashboard", icon: <HiViewGrid /> },
  { label: "Requests", path: "requests", icon: <FaCodePullRequest /> },
  { label: "Settings", path: "settings", icon: <HiOutlineCog /> },
  { label: "Logout", path: "logout", icon: <HiLogout />, isButton: true },
];

const HomePage = () => {
  const activeTab = useStore((state) => state.activeTab);
  const setActiveTab = useStore((state) => state.setActiveTab);
  const [openModal, setOpenModal] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate(); // React Router hook to navigate

  const toggleNav = () => setIsNavOpen(!isNavOpen);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    setOpenModal(false);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 w-60 bg-gray-800 text-white h-screen transform ${
          isNavOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:relative md:translate-x-0 z-10`}
      >
        <div className="flex justify-start items-center gap-4 p-4">
          <img src={LOGO} height={50} width={50} alt="Logo" />
          <Typography variant="h5" color="white">
            Pune Software Technologies
          </Typography>
        </div>
        <nav className="mt-4">
          <ul className="space-y-2 px-4">
            {menuItems.map((item) => (
              <li key={item.path}>
                {item.isButton ? (
                  <button
                    className="flex items-center gap-2 w-full text-left p-2 rounded hover:bg-gray-600"
                    onClick={() => setOpenModal(true)}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ) : (
                  <Link
                    to={item.path}
                    className={`flex items-center gap-2 px-2 py-2 rounded ${
                      location.pathname === item.path ||
                      activeTab === item?.path
                        ? "bg-gray-600"
                        : "hover:bg-gray-700"
                    }`}
                    onClick={() => setActiveTab(item?.path)}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
      {isNavOpen && (
        <FiXSquare
          onClick={toggleNav}
          size={32}
          color="white"
          className="bg-gray-800 rounded-md lg:hidden fixed top-0 left-60"
        />
      )}

      {/* Main Content */}
      <div className="flex-1">
        <header className="flex items-center justify-between p-4 bg-gray-800 text-white md:hidden">
          <HiMenuAlt3 size={24} onClick={toggleNav} />
          <Typography variant="h6" color="text-white">
            Pune Software Technologies
          </Typography>
        </header>
        <main>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow p-4 bg-gray-100">
              <Outlet />
            </main>
            <Footer />
          </div>
        </main>
      </div>

      {/* Logout Modal */}
      {openModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-start pt-4 justify-center z-20">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <Typography variant="h6" color="black" className="mb-4">
              Are you sure you want to log out?
            </Typography>
            <div className="flex justify-end items-center gap-4">
              <SecondaryButton onClick={() => setOpenModal(false)} color="gray">
                Cancel
              </SecondaryButton>
              <PrimaryButton onClick={handleLogout} color="red">
                Logout
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
