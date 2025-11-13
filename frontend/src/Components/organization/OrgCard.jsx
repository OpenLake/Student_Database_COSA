import React, { useState, useEffect } from "react";
const OrgCard = ({ unit, onClick }) => {
  return (
    <div
      key={unit._id}
      className="w-[180px] bg-[#56b996] border border-[#e7e4d9] rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-2 flex flex-col justify-center items-center text-center"
    >
      {/* Icon circle */}
      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#faf6e8] text-gray-800 font-semibold text-lg mb-3 shadow-sm">
        {unit.name.charAt(0)}
      </div>

      {/* Org info */}
      <h3 className=" font-semibold text-gray-800">{unit.name}</h3>
      {unit.type && (
        <p className=" font-medium text-gray-300 mt-1">{unit.type}</p>
      )}

      {/* Button */}
      <button
        className="mt-2 w-full  bg-[#fefbe9] border border-[#e7e4d9] text-gray-700 font-medium py-1.5 rounded-md hover:bg-[#f8f5de] transition"
        onClick={() => onClick(unit)}
      >
        View Details
      </button>
    </div>
  );
};

export default OrgCard;
