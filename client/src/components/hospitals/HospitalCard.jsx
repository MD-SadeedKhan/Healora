import React from "react";
import { MapPin, Phone, Star } from "lucide-react";
import clsx from "clsx";

const HospitalCard = ({ hospital, isSelected, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={clsx(
        "border rounded p-3 shadow cursor-pointer hover:bg-blue-50",
        isSelected && "border-blue-500 bg-blue-50"
      )}
    >
      <h3 className="font-semibold text-gray-800">{hospital.name}</h3>
      <div className="flex items-center text-sm text-gray-600 mt-1">
        <MapPin className="w-4 h-4 mr-1" />
        {hospital.vicinity || "Address not available"}
      </div>
      <div className="flex items-center text-sm text-gray-600 mt-1">
        <Star className="w-4 h-4 mr-1 text-yellow-400" />
        {hospital.rating || "N/A"}
      </div>
      <div className="text-xs text-gray-500 mt-1">
        {hospital.distance?.toFixed(2)} km away
      </div>
    </div>
  );
};

export default HospitalCard;
