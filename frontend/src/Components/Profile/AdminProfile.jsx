import React from "react";
import {
  Edit3,
  Save,
  X,
  User,
  Mail,
  Activity,
  PieChart,
  TrendingUp,
  Wallet,
  Users,
  Building2,
  Phone,
  Calendar,
  Home,
  MapPin,
} from "lucide-react";
import ProfilePhoto from "./ProfilePhoto";
import { useProfile } from "../../hooks/useProfile";
import { useStats } from "../../hooks/useStats";

// --- Toast component (reused design) ---
const Toast = ({ message, type, onClose }) => (
  <div
    className={`fixed top-6 right-6 z-50 px-4 py-2 rounded-xl shadow-lg flex items-center gap-2 text-sm ${
      type === "success"
        ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white"
        : "bg-gradient-to-r from-rose-500 to-pink-600 text-white"
    }`}
  >
    <span>{message}</span>
    <button
      onClick={onClose}
      className="ml-1 w-5 h-5 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
    >
      <X className="w-4 h-4" />
    </button>
  </div>
);

const AdminProfile = () => {
  const {
    isEditing,
    profile,
    editedProfile,
    loading,
    toast,
    errors,
    handleEdit,
    handleCancel,
    handleChange,
    handleSave,
    handlePhotoUpdate,
    closeToast,
    getNestedValue,
  } = useProfile();

  const { stats } = useStats();
  const budget = stats?.budget || {};
  const roleDisplay = profile?.role?.replace(/_/g, " ") || "Admin";

  // --- Form Structure Configuration (from StudentProfile) ---
  const formSections = {
    "Basic Information": [
      {
        name: "personal_info.name",
        label: "Full Name",
        icon: User,
        readOnly: true,
      },
      {
        name: "user_id",
        label: "User ID",
        icon: User,
        readOnly: true,
      },
      {
        name: "personal_info.email",
        label: "Email",
        icon: Mail,
        readOnly: true,
      },
      {
        name: "role",
        label: "Role",
        icon: Building2,
        readOnly: true,
      },
      {
        name: "status",
        label: "Status",
        icon: Activity,
        readOnly: true,
      },
    ],
    "Personal & Contact": [
      {
        name: "personal_info.phone",
        label: "Mobile Number",
        icon: Phone,
        maxLength: 10,
        inputMode: "numeric",
      },
      {
        name: "personal_info.gender",
        label: "Gender",
        icon: Users,
        type: "select",
        options: ["Male", "Female", "Other"],
      },
      {
        name: "personal_info.date_of_birth",
        label: "Date of Birth",
        icon: Calendar,
        type: "date",
      },
    ],
    Accommodation: [
      {
        name: "contact_info.hostel",
        label: "Hostel Name",
        icon: Home,
        type: "select",
        options: ["None", "MSH", "Indravati", "Gopad", "Kanhar"],
      },
      { name: "contact_info.room_number", label: "Room Number", icon: MapPin },
    ],
    "Social Links": [
      {
        name: "contact_info.socialLinks.github",
        label: "GitHub",
        type: "url",
        placeholder: "https://github.com/username",
      },
      {
        name: "contact_info.socialLinks.linkedin",
        label: "LinkedIn",
        type: "url",
        placeholder: "https://linkedin.com/in/username",
      },
    ],
  };

  if (loading && !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-indigo-200 border-t-indigo-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-700 font-medium">No profile found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {toast && <Toast {...toast} onClose={closeToast} />}

      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-700 text-white px-6 py-4 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <ProfilePhoto
            isEditing={isEditing}
            ID_No={profile.user_id}
            profilePic={profile.personal_info?.profilePic}
            onPhotoUpdate={handlePhotoUpdate}
          />
          <div>
            <h2 className="text-xl font-semibold text-white">
              {profile.personal_info?.name}
            </h2>
            <p className="text-sm text-blue-100 mt-1 uppercase tracking-wide">
              {roleDisplay}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors shadow"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit</span>
            </button>
          ) : (
            <>
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex items-center gap-1 bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-emerald-700 transition-colors shadow disabled:opacity-70"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? "Saving..." : "Save"}</span>
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-1 bg-rose-600 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-rose-700 transition-colors shadow"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-3 py-6 space-y-6">
        {/* --- Budget Overview Section (Kept for Admin) --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            icon={Wallet}
            label="Total Budget Allocated"
            value={`₹${budget.total || 0}`}
          />
          <StatCard
            icon={PieChart}
            label="Budget Used"
            value={`₹${budget.used || 0}`}
          />
          <StatCard
            icon={TrendingUp}
            label="Utilization"
            value={
              budget.total
                ? `${((budget.used / budget.total) * 100).toFixed(1)}%`
                : "0%"
            }
          />
        </div>

        {/* --- Admin Profile Info (Now an Editable Form) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(formSections).map(([sectionTitle, fields]) => (
            <div key={sectionTitle} className="space-y-3">
              <h2 className="text-lg font-bold text-gray-900 border-b border-indigo-600 pb-1">
                {sectionTitle}
              </h2>
              {fields.map((field) => {
                const value = getNestedValue(editedProfile, field.name) || "";
                const Component =
                  field.type === "select" ? SelectField : EditableField;
                const fieldProps = {
                  ...field,
                  key: field.name,
                  isEditing,
                  value:
                    field.type === "date" && value
                      ? value.split("T")[0]
                      : value,
                  error: errors[field.name],
                  onChange: handleChange,
                };

                if (field.readOnly) {
                  let displayValue = getNestedValue(profile, field.name);
                  if (field.name === "role") {
                    displayValue = roleDisplay; // Use the formatted role
                  }
                  return (
                    <ReadOnlyField
                      key={field.name}
                      {...field}
                      value={displayValue}
                    />
                  );
                }

                return <Component {...fieldProps} />;
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Small reusable UI blocks (StatCard is kept) ---
const StatCard = ({ icon: Icon, label, value }) => (
  <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
    <div className="p-2 bg-indigo-100 rounded-full text-indigo-700">
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-lg font-semibold text-gray-800">{value}</p>
    </div>
  </div>
);

// --- Reusable Field Components (Copied from StudentProfile, themed to indigo) ---
const ReadOnlyField = ({ icon: Icon, label, value }) => (
  <div className="flex items-start space-x-2 p-2 bg-gray-50 rounded border border-gray-200">
    {Icon && <Icon className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />}
    <div className="flex-grow">
      <label className="block text-xs font-medium text-gray-700 mb-0.5">
        {label}
      </label>
      <p className="text-gray-900 text-sm">
        {value || <span className="text-gray-400">Not provided</span>}
      </p>
    </div>
  </div>
);

const EditableField = ({
  icon: Icon,
  label,
  value,
  error,
  isEditing,
  onChange,
  ...inputProps
}) => (
  <div className="flex flex-col space-y-1">
    <div className="flex items-start space-x-2 p-2 bg-gray-50 rounded border border-gray-200">
      {Icon && (
        <Icon className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
      )}
      <div className="flex-grow">
        <label className="block text-xs font-medium text-gray-700 mb-0.5">
          {label}
        </label>
        {isEditing ? (
          <input
            value={value}
            onChange={onChange}
            className={`w-full px-2 py-1 border rounded text-xs transition-colors ${
              error
                ? "border-red-500"
                : "border-gray-300 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            }`}
            {...inputProps}
          />
        ) : (
          <p className="text-gray-900 text-sm">
            {value || <span className="text-gray-400">Not provided</span>}
          </p>
        )}
      </div>
    </div>
    {error && <span className="text-xs text-red-600 ml-6">{error}</span>}
  </div>
);

const SelectField = ({
  icon: Icon,
  label,
  value,
  options,
  isEditing,
  onChange,
  name,
  error,
}) => (
  <div className="flex flex-col space-y-1">
    <div className="flex items-start space-x-2 p-2 bg-gray-50 rounded border border-gray-200">
      {Icon && (
        <Icon className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
      )}
      <div className="flex-grow">
        <label className="block text-xs font-medium text-gray-700 mb-0.5">
          {label}
        </label>
        {isEditing ? (
          <select
            name={name}
            value={value}
            onChange={onChange}
            className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="" disabled>
              Select {label}
            </option>
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : (
          <p className="text-gray-900 text-sm">
            {value || <span className="text-gray-400">Not provided</span>}
          </p>
        )}
      </div>
    </div>
    {error && <span className="text-xs text-red-600 ml-6">{error}</span>}
  </div>
);

export default AdminProfile;
