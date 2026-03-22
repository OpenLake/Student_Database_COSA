import React, { useState } from "react";
import OrgList from "./OrgList";
import { ArrowLeft } from "lucide-react";

const OrgView = ({ orgUnit, units, onBack }) => {
  const [selectedChildOrg, setSelectedChildOrg] = useState(null);
  if (selectedChildOrg) {
    return (
      <OrgView
        orgUnit={selectedChildOrg}
        units={units.filter(
          (unit) => unit.parent_unit_id === selectedChildOrg._id,
        )}
        onBack={() => setSelectedChildOrg(null)}
      />
    );
  }
  return (
    <div>
      {/* Back button */}
      <button
        onClick={onBack}
        className="mb-4 flex items-center gap-2 px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition shadow-sm"
      >
        <ArrowLeft size={16} />
        <span className="font-medium">Back</span>
      </button>

      {/* Parent org details */}
      <div className="parent-org-info bg-white p-6 rounded-2xl shadow-2xl border border-gray-100 mb-6">
        <h2 className="text-2xl font-bold mb-3 text-gray-800">
          {orgUnit.name}
        </h2>

        <div className="space-y-2 text-gray-700">
          <p>{orgUnit.description}</p>
          <p>
            <strong>Category:</strong> {orgUnit.category}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span
              className={`font-semibold ${
                orgUnit.is_active ? "text-green-600" : "text-red-500"
              }`}
            >
              {orgUnit.is_active ? "Active" : "Inactive"}
            </span>
          </p>
          <p>
            <strong>Email:</strong> {orgUnit.contact_info.email}
          </p>
        </div>

        {/* Social Media */}
        {orgUnit.contact_info.social_media?.length > 0 && (
          <div className="mt-4">
            <strong className="block mb-1 text-gray-800">Social Media:</strong>
            <ul className="list-disc list-inside space-y-1">
              {orgUnit.contact_info.social_media.map((item) => (
                <li key={item._id}>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {item.platform}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Budget Info */}
        {orgUnit.budget_info && (
          <div className="mt-4 bg-[#f9fafb] p-3 rounded-lg border border-gray-100">
            <strong className="block mb-1 text-gray-800">
              Budget Information:
            </strong>
            <p>Allocated Budget: ₹{orgUnit.budget_info.allocated_budget}</p>
            <p>Expenditure: ₹{orgUnit.budget_info.spent_amount}</p>
          </div>
        )}
      </div>

      {/* Child org list */}
      <OrgList
        units={units}
        parent_unit_id={orgUnit._id}
        selectedOrg={setSelectedChildOrg}
      />
    </div>
  );
};

export default OrgView;
