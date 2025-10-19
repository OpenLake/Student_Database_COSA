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
        <option>All</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt.charAt(0).toUpperCase() + opt.slice(1)}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black w-4 h-4 pointer-events-none" />
    </div>
  </div>
);

export default FilterDropdown;