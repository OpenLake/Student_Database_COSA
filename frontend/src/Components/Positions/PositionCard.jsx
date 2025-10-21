import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import {
  Plus,
  X,
  AlertCircle,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Users,
  UserCheck,
  Award,
  Clock,
  DollarSign,
  MapPin,
  Calendar,
} from "lucide-react";

export const ErrorMessage = ({ message }) =>
  message ? (
    <div className="flex items-center mt-1 text-xs text-red-600">
      <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
      {message}
    </div>
  ) : null;

export const SearchInput = ({ value, onChange, placeholder }) => (
  <div className="flex-1 relative">
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black w-4 h-4" />
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full pl-10 pr-4 py-2 bg-white text-black placeholder-black border border-[#DCD3C9] rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none"
    />
  </div>
);

export const FormInput = ({ label, required, error, ...props }) => (
  <div>
    <label className="text-sm font-medium text-stone-600">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      {...props}
      className="w-full p-2 mt-1 bg-white border border-stone-300 rounded-lg text-sm text-stone-900 placeholder-stone-400 focus:ring-1 focus:ring-stone-400 focus:border-stone-400 transition"
    />
    <ErrorMessage message={error} />
  </div>
);

export const FormSelect = ({ label, required, error, options, ...props }) => (
  <div>
    <label className="text-sm font-medium text-stone-600">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      {...props}
      className="w-full p-2 mt-1 bg-white border border-stone-300 rounded-lg text-sm text-stone-900 focus:ring-1 focus:ring-stone-400 focus:border-stone-400 transition"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    <ErrorMessage message={error} />
  </div>
);

export const DynamicFieldArray = ({
  label,
  array,
  onUpdate,
  onRemove,
  onAdd,
  error,
}) => (
  <div>
    <label className="text-sm font-medium text-stone-600">
      {label} <span className="text-red-500">*</span>
    </label>
    {array.map((item, index) => (
      <div key={index} className="flex items-center gap-2 mt-1">
        <input
          type="text"
          value={item}
          onChange={(e) => onUpdate(index, e.target.value)}
          className="w-full p-2 bg-white border border-stone-300 rounded-lg text-sm text-stone-900 placeholder-stone-400 focus:ring-1 focus:ring-stone-400 focus:border-stone-400 transition flex-grow"
          placeholder={`${label.slice(0, -1)} #${index + 1}`}
        />
        {array.length > 1 && (
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="p-2 text-stone-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>
    ))}
    <button
      type="button"
      onClick={onAdd}
      className="text-stone-600 hover:text-stone-800 font-medium text-sm mt-2 transition flex items-center gap-1"
    >
      <Plus size={14} /> Add {label.slice(0, -1)}
    </button>
    <ErrorMessage message={error} />
  </div>
);

export const PositionCard = ({ position, onViewDetails, onEdit, onDelete }) => (
  <div className="bg-white rounded-lg border-2 border-black hover:shadow-md transition-shadow flex flex-col justify-between">
    <div className="p-4">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-semibold text-black pr-2">{position.title}</h4>
        <span className="flex-shrink-0 px-2 py-1 bg-[#EAE0D5] text-[#856A5D] text-xs rounded-full">
          {position.position_type}
        </span>
      </div>
      <div className="flex items-center gap-2 text-sm text-black mb-2">
        <MapPin className="w-4 h-4 flex-shrink-0" />
        <span>{position.unit_id?.name}</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-black">
        <Users className="w-4 h-4 flex-shrink-0" />
        <span>
          {position.position_count} position
          {position.position_count !== 1 ? "s" : ""}
        </span>
      </div>
    </div>
    <div className="p-4 border-t border-[#DCD3C9]">
      <div className="flex gap-2">
        <button
          onClick={() => onViewDetails(position)}
          className="flex-1 px-1 py-2 bg-black text-white text-sm rounded-lg hover:bg-[#856A5D] transition-colors flex items-center justify-center gap-1"
        >
          <Eye className="w-4 h-4" />
          View Details
        </button>
        <button
          onClick={() => onEdit(position)}
          className="px-3 py-2 bg-[#F5F1EC] text-black text-sm rounded-lg hover:bg-[#EAE0D5] transition-colors"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(position)}
          className="px-3 py-2 bg-red-100 text-red-700 text-sm rounded-lg hover:bg-red-200 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
);
