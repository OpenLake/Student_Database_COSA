import React from "react";
import { User } from "lucide-react";

export const EmptyStateNoSkills = () => (
  <div className="text-center py-4 bg-white rounded-lg">
    <div className="w-16 h-16 bg-[#F5F1EC] rounded-full flex items-center justify-center mx-auto mb-4">
      <User className="w-8 h-8 text-black" />
    </div>
    <h3 className="text-lg font-semibold text-black mb-2">
      No skills added yet
    </h3>
    <p className="text-black mb-6 max-w-sm mx-auto">
      Click "Add Skill" to start building your professional profile.
    </p>
  </div>
);

export const EmptyStateNoResults = () => (
  <div className="text-center py-4 bg-white rounded-lg">
    <h3 className="text-lg font-semibold text-black mb-2">No Skills Found</h3>
    <p className="text-black max-w-sm mx-auto">
      No skills match your current filter criteria. Try adjusting your filters.
    </p>
  </div>
);
