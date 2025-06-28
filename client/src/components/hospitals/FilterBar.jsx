import React, { useState } from "react";

const FilterBar = ({ onFilter }) => {
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");

  const handleSpecialtyChange = (e) => {
    const value = e.target.value;
    setSelectedSpecialty(value);
    onFilter(value, Infinity); // removed distance, passing a high value
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Filter by Specialty
      </label>
      <select
        value={selectedSpecialty}
        onChange={handleSpecialtyChange}
        className="w-full p-2 border border-gray-300 rounded"
      >
        <option>All</option>
        <option>Cardiology</option>
        <option>Neurology</option>
        <option>Oncology</option>
        <option>Emergency</option>
        <option>Orthopedics</option>
        <option>Surgery</option>
        <option>General</option>
        <option>Transplants</option>
        <option>Diagnostics</option>
      </select>
    </div>
  );
};

export default FilterBar;
