import React, { useState } from "react";
import { HiExclamationCircle } from "react-icons/hi";
import { HiEye, HiEyeOff } from "react-icons/hi";

const InputBox = ({
  id,
  name,
  type,
  placeholder,
  value,
  onChange,
  required = false,
  error,
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const hasError = !!error;
  const isPassword = type === "password";

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const inputClassNames = `mt-1 block w-full p-2 text-gray-900 rounded-md border-2 focus:outline-none focus:ring-2 pr-10 ${
    hasError
      ? "border-red-500 focus:ring-red-500"
      : "border-gray-300 focus:ring-gray-500"
  }`;

  return (
    <div className="relative">
      <label htmlFor={id} className="sr-only">
        {placeholder}
      </label>
      <div className="relative">
        <input
          id={id}
          name={name}
          type={isPassword && showPassword ? "text" : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={inputClassNames}
          aria-invalid={hasError ? "true" : "false"}
          aria-describedby={hasError ? `${id}-error` : undefined}
          {...rest}
        />
        {isPassword && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-2 flex items-center text-gray-600"
          >
            {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
          </button>
        )}
      </div>
      {hasError && (
        <div
          id={`${id}-error`}
          className="flex justify-start items-center mt-1"
          role="alert"
        >
          <HiExclamationCircle
            className="hidden md:block"
            color="red"
            size={16}
          />
          <p className="text-red-900 sm:text-[4]">{error}</p>
        </div>
      )}
    </div>
  );
};

export default InputBox;
