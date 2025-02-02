import { useState } from "react";

const useBulletPoints = (initialPoints = []) => {
  const [points, setPoints] = useState(initialPoints);

  const addPoint = (point) => {
    if (point.trim()) {
      setPoints((prevPoints) => {
        const updatedPoints = [...prevPoints, point.trim()];
        return [...new Set(updatedPoints)];
      });
    }
  };

  const removePoint = (index) => {
    const updatedPoints = points.filter((_, i) => i !== index);
    setPoints(updatedPoints);
  };

  return { points, addPoint, removePoint };
};

export default useBulletPoints;
