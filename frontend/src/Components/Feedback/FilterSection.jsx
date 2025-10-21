export const FilterSection = ({ label, value, onChange, options }) => (
  <div>
    <div className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-1 px-1">
      {label}
    </div>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-2 py-2 border-2 border-black rounded-md bg-white text-black focus:outline-none"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);
