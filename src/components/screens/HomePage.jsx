import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { HiMenuAlt3, HiHome, HiOutlineCog, HiViewGrid } from "react-icons/hi";
import { FaCodePullRequest } from "react-icons/fa6";
import { FiXSquare } from "react-icons/fi";
import LOGO from "../../assets/Logo.png";
import Typography from "../atoms/Typography";
import useStore from "../../utils/zustand";
import Header from "../Molecule/Header";
import Footer from "../Molecule/Footer";
import { FaUsers } from "react-icons/fa";
import { FaQuestion } from "react-icons/fa";
import { MdReviews } from "react-icons/md";
import { ImBlogger } from "react-icons/im";
import { MdAlignHorizontalLeft } from "react-icons/md";
import { FaBookReader } from "react-icons/fa";
import { FaBriefcase } from "react-icons/fa";
import { GiPoliceBadge } from "react-icons/gi";
import { FaBookOpen } from "react-icons/fa";
import {
  getAllCategories,
  getAllCourseName,
} from "../../APIs/courses.services";

const menuItems = [
  { label: "Home", path: "/home", icon: <HiHome />, role: "ADMIN" },
  {
    label: "Dashboard",
    path: "dashboard",
    icon: <HiViewGrid />,
    role: "ADMIN",
  },
  {
    label: "Courses",
    path: "courses",
    icon: <FaBookReader />,
    role: "ADMIN",
  },
  {
    label: "Jobs",
    path: "jobs",
    icon: <FaBriefcase />,
    role: "ADMIN",
  },
  {
    label: "Projects",
    path: "projects",
    icon: <GiPoliceBadge />,
    role: "ADMIN",
  },
  {
    label: "Blogs",
    path: "blogs",
    icon: <ImBlogger />,
    role: "ADMIN",
  },
  {
    label: "Enquiry",
    path: "requests",
    icon: <FaCodePullRequest />,
    role: "ADMIN",
  },
  {
    label: "Faqs",
    path: "faqs",
    icon: <FaQuestion />,
    role: "ADMIN",
  },
  {
    label: "Testmonials",
    path: "testimonials",
    icon: <MdReviews />,
    role: "ADMIN",
  },
  {
    label: "Settings",
    path: "settings",
    icon: <HiOutlineCog />,
    role: "ADMIN",
  },
  {
    label: "Users",
    path: "users",
    icon: <FaUsers />,
    role: "SUPER_ADMIN",
  },
  {
    label: "Miscellaneous",
    path: "misc",
    icon: <MdAlignHorizontalLeft />,
    role: "ADMIN",
  },
  {
    label: "Syllabus",
    path: "syllabus",
    icon: <FaBookOpen />,
    role: "ADMIN",
  },
];

const HomePage = () => {
  const userRole = useStore((state) => state.userRole);
  const activeTab = useStore((state) => state.activeTab);
  const setCourses = useStore((state) => state.setCourses);
  const setActiveTab = useStore((state) => state.setActiveTab);
  const setCategories = useStore((state) => state.setCategories);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const location = useLocation();

  const toggleNav = () => setIsNavOpen(!isNavOpen);

  const fetchAllCourseNames = async () => {
    const response = await getAllCourseName();
    if (response?.success && Array.isArray(response?.data)) {
      setCourses(response?.data);
    }
  };

  const fetchAllCategories = async () => {
    const response = await getAllCategories();
    if (response?.success && Array.isArray(response?.data)) {
      setCategories(response?.data);
    }
  };

  useEffect(() => {
    fetchAllCourseNames();
    fetchAllCategories();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 w-60 bg-gray-800 text-white h-screen overflow-y-auto transform ${
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
            {menuItems.map((item) => {
              if (
                item.role &&
                item.role !== userRole &&
                userRole !== "SUPER_ADMIN"
              ) {
                // Skip rendering menu items where the role does not match the user's role
                return null;
              }

              return (
                <li key={item.path}>
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
                </li>
              );
            })}
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
      <div className="flex-1 overflow-y-auto">
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
    </div>
  );
};

export default HomePage;
