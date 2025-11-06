import React, { useState, useContext, useEffect } from "react";

const OrgList = ({ units, parent_unit_id }) => {
  if (!units) {
    return <div>No org units;</div>;
  }
  const filtered_units = units.filter(
    (unit) => unit.parent_unit_id == parent_unit_id,
  );
  return (
    <div>
      {!filtered_units ? (
        <p className="text-gray-500">No orgs found.</p>
      ) : (
        <div className="flex flex-wrap gap-6">
          {filtered_units &&
            filtered_units.map((unit) => (
              <div
                key={unit._id}
                className="w-[220px] bg-[#3faf84] border border-[#e7e4d9] rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-4 flex flex-col items-center text-center"
              >
                {/* Icon circle */}
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#faf6e8] text-gray-800 font-semibold text-lg mb-3 shadow-sm">
                  {unit.name.charAt(0)}
                </div>

                {/* Club info */}
                <h3 className="text-lg font-semibold text-gray-800">
                  {unit.name}
                </h3>
                {unit.type && (
                  <p className="text-sm text-gray-500 mt-1">{unit.type}</p>
                )}

                {/* Button */}
                <button className="mt-4 w-full bg-[#fefbe9] border border-[#e7e4d9] text-gray-700 font-medium py-2 rounded-lg hover:bg-[#f8f5de] transition">
                  View Details
                </button>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default OrgList;
