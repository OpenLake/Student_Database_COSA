import React from "react";
import { ChevronDown } from "lucide-react";

const FilterDropdown = ({ label, value, onChange, options }) => (
  <div>
    <label className="block text-sm font-medium text-[#7D6B5F] mb-1">
      {label}
    </label>
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-3 pr-10 py-2 border border-[#DCD3C9] rounded-lg focus:ring-2 focus:ring-[#A98B74] focus:border-[#A98B74] appearance-none bg-white text-[#5E4B3D]"
      >
        <option>All</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt.charAt(0).toUpperCase() + opt.slice(1)}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#A98B74] w-4 h-4 pointer-events-none" />
    </div>
  </div>
);

export default FilterDropdown;