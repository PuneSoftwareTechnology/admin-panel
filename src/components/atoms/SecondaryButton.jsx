import React from "react";
import Loader from "./Loader";

const SecondaryButton = ({
  type,
  onClick,
  disabled = false,
  loading = false,
  children,
  stretch = false,
  ariaLabel = "button",
  className,
  ...rest
}) => {
  const isButtonDisabled = disabled || loading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isButtonDisabled}
      aria-label={ariaLabel}
      className={`w-full py-2 px-4 rounded-md text-blue-600 border-2 ${
        stretch ? "w-full" : "sm:w-auto"
      } ${
        isButtonDisabled
          ? "bg-gray-100 border-gray-400 cursor-not-allowed"
          : "bg-white hover:bg-gray-100 hover:border-blue-700"
      } ${className}`}
      {...rest}
    >
      <div className="flex justify-center items-center gap-x-2 font-semibold">
        {loading && (
          <div className="flex justify-center items-center">
            <Loader size="small" ariaLabel="Submitting..." />
          </div>
        )}
        {children}
      </div>
    </button>
  );
};

export default SecondaryButton;
