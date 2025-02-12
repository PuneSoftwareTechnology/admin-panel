import React from "react";

const ToggleSwitch = ({ id, checked, onChange, label }) => {
  return (
    <div className="flex items-center">
      {/* Wrap the entire toggle switch in a label */}
      <label htmlFor={id} className="flex items-center cursor-pointer">
        {label && <span className="mr-3 text-gray-700">{label}</span>}
        <div className="relative">
          {/* Hidden checkbox for accessibility */}
          <input
            id={id}
            type="checkbox"
            checked={checked}
            onChange={onChange}
            className="sr-only peer"
          />
          {/* Switch Background */}
          <div className="w-12 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-500 transition-all duration-300"></div>
          {/* Switch Knob */}
          <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md transform peer-checked:translate-x-6 transition-all duration-300"></div>
        </div>
      </label>
    </div>
  );
};

export default ToggleSwitch;
