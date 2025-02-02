import React, { useState } from "react";
import { GiCancel } from "react-icons/gi";
import PrimaryButton from "../atoms/PrimaryButton";

const BulletPointsInput = ({ points, onAddPoint, onRemovePoint }) => {
  const [inputValue, setInputValue] = useState("");

  const handleAddPoint = () => {
    onAddPoint(inputValue);
    setInputValue("");
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter a bullet point"
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <PrimaryButton onClick={handleAddPoint}>Add</PrimaryButton>
      </div>
      <ul className="space-y-2 ml-4 mr-2">
        {points.map((point, index) => (
          <li
            key={index}
            className="flex items-center justify-between p-2 bg-gray-100 rounded-md"
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
