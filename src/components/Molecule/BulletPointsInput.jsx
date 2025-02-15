import React, { useState } from "react";
import { GiCancel } from "react-icons/gi";
import PrimaryButton from "../atoms/PrimaryButton";
import { IoMdAdd } from "react-icons/io";

const BulletPointsInput = ({ points, onAddPoint, onRemovePoint }) => {
  const [inputValue, setInputValue] = useState("");

  const handleAddPoint = (e) => {
    e.preventDefault();
    if (inputValue.trim() !== "") {
      onAddPoint(inputValue);
      setInputValue("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleAddPoint(e);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter a bullet point"
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <PrimaryButton onClick={handleAddPoint}>
          <IoMdAdd size={"24"} />
          Add
        </PrimaryButton>
      </div>
      <ul className=" flex flex-wrap justify-start items-center gap-2 ml-4 mr-2">
        {points.map((point, index) => (
          <li
            key={index}
            className="flex items-center justify-between p-2 bg-gray-200 gap-x-2 rounded-md"
          >
            <span>{point}</span>
            <button
              type="button"
              onClick={() => onRemovePoint(index)}
              className="text-red-500 hover:text-red-700"
            >
              <GiCancel />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BulletPointsInput;
