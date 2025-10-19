import React from "react";
import {
  Edit3,
  Save,
  X,
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Home,
  Calendar,
  Users,
} from "lucide-react";
import ProfilePhoto from "./ProfilePhoto";
import { useProfile, currentYear } from "../../hooks/useProfile";

// --- Toast component ---
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

const StudentProfile = () => {
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

  // --- Form Structure Configuration ---
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
        label: "Student ID",
        icon: GraduationCap,
        readOnly: true,
      },
      {
        name: "personal_info.email",
        label: "Email",
        icon: Mail,
        readOnly: true,
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
    "Academic Information": [
      {
        name: "academic_info.batch_year",
        label: "Admission Year",
        icon: Calendar,
        type: "number",
        min: 2016,
        max: currentYear,
      },
      {
        name: "academic_info.program",
        label: "Program",
        icon: GraduationCap,
        type: "select",
        options: ["B.Tech", "M.Tech", "MSc", "PhD", "Other"],
      },
      {
        name: "academic_info.branch",
        label: "Discipline",
        icon: GraduationCap,
        type: "select",
        options: [
          "Computer Science & Engineering",
          "Electrical Engineering",
          "Mechanical Engineering",
          "Civil Engineering",
          "Electronics & Communication",
          "Chemical Engineering",
          "Mathematics",
          "Physics",
          "Chemistry",
        ],
      },
      {
        name: "academic_info.current_year",
        label: "Year of Study",
        icon: GraduationCap,
        type: "select",
        options: ["1st", "2nd", "3rd", "4th", "5th", "Alumni"],
      },
      {
        name: "academic_info.cgpa",
        label: "CGPA",
        icon: GraduationCap,
        type: "number",
        step: "0.01",
        min: 0,
        max: 10,
        placeholder: "e.g. 8.50",
      },
    ],
    "Contact Information": [
      {
        name: "personal_info.phone",
        label: "Mobile Number",
        icon: Phone,
        maxLength: 10,
        inputMode: "numeric",
      },
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
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-200 border-t-blue-600"></div>
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
            <p className="text-sm text-blue-100 mt-1">
              Student ID: {profile.user_id}
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

      <div className="max-w-4xl mx-auto px-3 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(formSections).map(([sectionTitle, fields]) => (
            <div key={sectionTitle} className="space-y-3">
              <h2 className="text-lg font-bold text-gray-900 border-b border-blue-600 pb-1">
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
                  return (
                    <ReadOnlyField
                      key={field.name}
                      {...field}
                      value={getNestedValue(profile, field.name)}
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

// --- Reusable Field Components ---
const ReadOnlyField = ({ icon: Icon, label, value }) => (
  <div className="flex items-start space-x-2 p-2 bg-gray-50 rounded border border-gray-200">
    {Icon && <Icon className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />}
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
      {Icon && <Icon className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />}
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
                : "border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
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
      {Icon && <Icon className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />}
      <div className="flex-grow">
        <label className="block text-xs font-medium text-gray-700 mb-0.5">
          {label}
        </label>
        {isEditing ? (
          <select
            name={name}
            value={value}
            onChange={onChange}
            className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
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

export default StudentProfile;
