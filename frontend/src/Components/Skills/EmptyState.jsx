import React from "react";
import { User } from "lucide-react";

export const EmptyStateNoSkills = () => (
  <div className="text-center py-16 bg-white border border-[#DCD3C9] rounded-lg">
    <div className="w-16 h-16 bg-[#F5F1EC] rounded-full flex items-center justify-center mx-auto mb-4">
      <User className="w-8 h-8 text-[#A98B74]" />
    </div>
    <h3 className="text-lg font-semibold text-[#5E4B3D] mb-2">
      No skills added yet
    </h3>
    <p className="text-[#7D6B5F] mb-6 max-w-sm mx-auto">
      Click "Add Skill" to start building your professional profile.
    </p>
  </div>
);

export const EmptyStateNoResults = () => (
  <div className="text-center py-16 bg-white border border-[#DCD3C9] rounded-lg">
    <h3 className="text-lg font-semibold text-[#5E4B3D] mb-2">
      No Skills Found
    </h3>
    <p className="text-[#7D6B5F] max-w-sm mx-auto">
      No skills match your current filter criteria. Try adjusting your filters.
    </p>
  </div>
);