import React from "react";
import { ChevronDown } from "lucide-react";

const FilterDropdown = ({ label, value, onChange, options }) => (
  <div>
    <label className="block text-sm font-medium text-black mb-1">
      {label}
    </label>
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-3 pr-10 py-2 border border-[#DCD3C9] rounded-lg focus:ring-2 focus:ring-black focus:border-black appearance-none bg-white text-black"
      >
        <option value="">Select...</option>
        {options.map((opt, idx) => {
          // Handle both string and object types
          const labelText = typeof opt === "string" ? opt : opt.label;
          const valueText = typeof opt === "string" ? opt : opt.value;
          return (
            <option key={idx} value={valueText}>
              {labelText
                ? labelText.charAt(0).toUpperCase() + labelText.slice(1)
                : ""}
            </option>
          );
        })}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black w-4 h-4 pointer-events-none" />
    </div>
  </div>
);

export default FilterDropdown;
