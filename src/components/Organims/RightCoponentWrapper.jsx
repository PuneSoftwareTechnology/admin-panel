import React from "react";
import Header from "../Molecule/Header";
import Footer from "../Molecule/Footer";

const RightComponentWrapper = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow p-4 bg-gray-100">{children}</main>
      <Footer />
    </div>
  );
};

export default RightComponentWrapper;
