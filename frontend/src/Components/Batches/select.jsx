import {ChevronDown} from "lucide-react"
/* ── select dropdown ─────────────────────────────────────── */
export const Select = ({ value, onChange, options = [], icon: Icon, placeholder }) => (
    <div className="relative">
      {Icon && <Icon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />}
      <select
        value={value} onChange={e => onChange(e.target.value)}
        className={`appearance-none bg-white border border-yellow-100 text-gray-700 text-xs font-semibold rounded-xl pr-7 py-2 outline-none focus:border-yellow-300 focus:ring-2 focus:ring-yellow-100 transition-all cursor-pointer ${Icon ? "pl-8" : "pl-3"}`}
      >
        <option value="ALL">{placeholder}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
    </div>
  );