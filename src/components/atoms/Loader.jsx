import React from "react";

const Loader = ({ size = "small", ariaLabel = "Loading...", className }) => {
  const sizeClassNames = {
    small: "w-6 h-6 border-2",
    medium: "w-12 h-12 border-4",
    large: "w-16 h-16 border-8",
  };

  const borderWidthClasses = {
    small: "2",
    medium: "4",
    large: "8",
  };

  return (
    <div
      role="status"
      aria-live="assertive"
      className={`border-t-transparent border-white-100 border-solid animate-spin rounded-full ${sizeClassNames[size]} border-t-${borderWidthClasses[size]} ${className}`}
      aria-label={ariaLabel}
    >
      <span className="sr-only">{ariaLabel}</span>
    </div>
  );
};

export default Loader;
