import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white py-1 text-center">
      <p className="text-sm">
        &copy; {currentYear} All rights reserved. Developed by
        <a
          href="https://saurabhsoni.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-blue-400 ml-1"
        >
          Saurabh Soni
        </a>
        {/* with <span className="text-red-500">&hearts;</span> */}
      </p>
    </footer>
  );
};

export default Footer;
