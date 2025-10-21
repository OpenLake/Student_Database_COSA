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
  Clock1,
  IdCard,
} from "lucide-react";
import { InfoCard } from "../common/InfoCard";

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

export const PositionCard = ({ position, onViewDetails, onEdit, onDelete }) => {
  const desc = [
    // { key: "Created by", value: position.created_by || "Unknown", icon: Edit },
    {
      key: "Created on",
      value: new Date(position.created_at || Date.now()).toLocaleDateString(
        "en-GB",
        { day: "numeric", month: "long", year: "numeric" }
      ),
      icon: Calendar,
    },
    {
      key: "Last Updated",
      value: new Date(position.updated_at || Date.now()).toLocaleDateString(
        "en-GB",
        { day: "numeric", month: "long", year: "numeric" }
      ),
      icon: Clock1,
    },
  ];
  return (
    <InfoCard
      title={position.title}
      subtitle={position.unit_id?.name}
      badgeText={position.position_type}
      badgeColor="bg-white"
      descriptionItems={desc}
      onAction={() => onViewDetails(position)}
      onActionText="View Details"
      onActionColor="bg-[#BAFFB4]"
      onActionDisabled={false}
      onEdit={() => onEdit(position)}
      onDelete={() => onDelete(position)}
      onActionProps={position}
    />
  );
};

export const PositionHolderCard = ({
  holder,
  onViewDetails,
  onEdit,
  onDelete,
}) => {
  const getStatusColor = (status) => {
    const colors = {
      active: "bg-green-100 text-green-800",
      completed: "bg-[#EAE0D5] text-[#856A5D]",
      terminated: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-[#F5F1EC] text-black";
  };

  const getStatusIcon = (status) => {
    const icons = {
      active: UserCheck,
      completed: Award,
      terminated: Clock,
    };
    return icons[status] || UserCheck;
  };
  const desc = [
    {
      key: "ID",
      value: holder.user_id?.user_id || "N/A",
      icon: IdCard,
    },
    {
      key: "Status",
      value: holder.status?.charAt(0).toUpperCase() + holder.status?.slice(1),
      icon: getStatusIcon(holder.status),
    },
    {
      key: "Tenure",
      value: holder.tenure_year,
      icon: Calendar,
    },
  ];
  return (
    <InfoCard
      title={holder.user_id?.personal_info?.name || "N/A"}
      subtitle={holder.position_id?.unit_id?.name || "Unknown Dept"}
      badgeText={holder.position_id?.title || "Unknown Position"}
      badgeColor={getStatusColor(holder.status)}
      descriptionItems={desc}
      onAction={() => onViewDetails(holder)}
      onActionText="View Details"
      onActionColor="bg-[#BAFFB4]"
      onActionDisabled={false}
      onEdit={() => onEdit(holder)}
      onDelete={() => onDelete(holder)}
      onActionProps={holder}
    />
  );
};
