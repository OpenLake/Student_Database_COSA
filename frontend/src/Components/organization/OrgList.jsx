import React from "react";
import OrgCard from "./OrgCard";
const OrgList = ({ units, parent_unit_id, selectedOrg }) => {
  if (!units) {
    return <div>No org units;</div>;
  }
  const filtered_units = units.filter((unit) => {
    return unit.parent_unit_id === parent_unit_id;
  });
  return (
    <div>
      {!filtered_units ? (
        <p className="text-gray-500">No orgs found.</p>
      ) : (
        <div className="flex flex-wrap gap-6">
          {filtered_units &&
            filtered_units.map((unit) => (
              <OrgCard key={unit._id} unit={unit} onClick={selectedOrg} />
            ))}
        </div>
      )}
    </div>
  );
};

export default OrgList;
