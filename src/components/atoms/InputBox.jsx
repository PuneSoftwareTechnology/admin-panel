import React from "react";
import { HiExclamationCircle } from "react-icons/hi";

const InputBox = ({
  id,
  name,
  type,
  placeholder,
  value,
  onChange,
  required = false,
  error,
  rest,
}) => {
  const hasError = !!error;
  const inputClassNames = `mt-1 block w-full p-2 text-gray-900 rounded-md border-2 focus:outline-none focus:ring-2 ${
    hasError
      ? "border-red-500 focus:ring-red-500"
      : "border-gray-300 focus:ring-gray-500"
  }`;

  return (
    <div className="relative">
      <label htmlFor={id} className="sr-only">
        {placeholder}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={inputClassNames}
        aria-invalid={hasError ? "true" : "false"}
        aria-describedby={hasError ? `${id}-error` : undefined}
        {...rest}
      />
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
