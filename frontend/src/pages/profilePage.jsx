import React from "react";
import { SidebarProvider } from "../hooks/useSidebar";
import { useProfile } from "../hooks/useProfile";
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
  Linkedin,
  Github,
  MessageCircle,
  BookOpen,
  Sparkles,
} from "lucide-react";
import ProfilePhoto from "../Components/Student/ProfilePhoto";
import { AdminContext } from "../context/AdminContext";
import Layout from "../Components/common/Layout";
import { NavbarConfig } from "../config/navbarConfig";
import { Toast } from "../Components/common/Toast";

const EditButton = (isEditing, onEdit, onSave, loading, onCancel) => {
  return (
    <div className="flex gap-1.5">
      {!isEditing ? (
        <button
          onClick={onEdit}
          className="flex items-center gap-1 bg-blue-600 text-white px-2.5 py-1 rounded font-medium text-xs hover:bg-blue-700 transition-colors"
        >
          <Edit3 className="w-3 h-3" />
          <span>Edit</span>
        </button>
      ) : (
        <>
          <button
            onClick={onSave}
            disabled={loading}
            className="flex items-center gap-1 bg-emerald-600 text-white px-2.5 py-1 rounded font-medium text-xs hover:bg-emerald-700 transition-colors disabled:opacity-70"
          >
            <Save className="w-3 h-3" />
            <span>{loading ? "Saving..." : "Save"}</span>
          </button>
          <button
            onClick={onCancel}
            className="flex items-center gap-1 bg-rose-600 text-white px-2.5 py-1 rounded font-medium text-xs hover:bg-rose-700 transition-colors"
          >
            <X className="w-3 h-3" />
            <span>Cancel</span>
          </button>
        </>
      )}
    </div>
  );
};

const ProfileHeader = ({
  profile,
  isEditing,
  onPhotoUpdate,
  ProfilePhotoComponent,
}) => (
  <div className="bg-[#f5f1e8] flex items-center gap-2.5">
    <ProfilePhotoComponent
      isEditing={isEditing}
      ID_No={profile.user_id}
      profilePic={profile.personal_info?.profilePic}
      onPhotoUpdate={onPhotoUpdate}
    />
  </div>
);

const ProfilePage = () => {
  const { isUserLoggedIn } = React.useContext(AdminContext);

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

  // Loading state
  if (loading && !profile) {
    return <LoadingState />;
  }

  // Empty state
  if (!profile) {
    return <EmptyState />;
  }
  const components = {
    ProfileHeader: ProfileHeader,
    StudentProfile1: StudentProfile1,
    StudentProfile2: StudentProfile2,
  };
  const gridConfig = [
    {
      id: "header",
      component: "ProfileHeader",
      position: {
        colStart: 0,
        colEnd: 3,
        rowStart: 0,
        rowEnd: 4,
      },
      props: {
        profile: profile,
        isEditing: isEditing,
        loading: loading,
        onEdit: handleEdit,
        onSave: handleSave,
        onCancel: handleCancel,
        onPhotoUpdate: handlePhotoUpdate,
        ProfilePhotoComponent: ProfilePhoto,
      },
    },
    {
      id: "left",
      component: "StudentProfile1",
      position: {
        colStart: 0,
        colEnd: 10,
        rowStart: 4,
        rowEnd: 16,
      },
    },
    {
      id: "right",
      component: "StudentProfile2",
      position: {
        colStart: 10,
        colEnd: 20,
        rowStart: 4,
        rowEnd: 16,
      },
    },
  ];

  const role = isUserLoggedIn?.role || "STUDENT";
  const navItems = NavbarConfig[role] || [];
  return (
    <SidebarProvider role={role} navItems={navItems}>
      {toast && <Toast {...toast} onClose={closeToast} />}

      <Layout
        headerText="Profile"
        gridConfig={gridConfig}
        components={components}
      />
    </SidebarProvider>
  );
};

export default ProfilePage;

const StudentProfile1 = () => {
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

  // Loading state
  if (loading && !profile) {
    return <LoadingState />;
  }

  // Empty state
  if (!profile) {
    return <EmptyState />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-3 py-6">
        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> */}

        {Object.entries(formSections1).map(([sectionTitle, fields]) => (
          <FormSection
            key={sectionTitle}
            title={sectionTitle}
            fields={fields}
            isEditing={isEditing}
            profile={profile}
            editedProfile={editedProfile}
            errors={errors}
            onChange={handleChange}
            getNestedValue={getNestedValue}
          />
        ))}
        {/* </div> */}
      </div>
    </div>
  );
};

const StudentProfile2 = () => {
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

  // Loading state
  if (loading && !profile) {
    return <LoadingState />;
  }

  // Empty state
  if (!profile) {
    return <EmptyState />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-3 py-6">
        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> */}

        {Object.entries(formSections2).map(([sectionTitle, fields]) => (
          <FormSection
            key={sectionTitle}
            title={sectionTitle}
            fields={fields}
            isEditing={isEditing}
            profile={profile}
            editedProfile={editedProfile}
            errors={errors}
            onChange={handleChange}
            getNestedValue={getNestedValue}
          />
        ))}
        {/* </div> */}
      </div>
    </div>
  );
};

// ==================== Field Components ====================
export const ReadOnlyField = ({ icon: Icon, label, value }) => (
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

export const EditableField = ({
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

export const SelectField = ({
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

// ==================== Form Section Component ====================
export const FormSection = ({
  title,
  fields,
  isEditing,
  profile,
  editedProfile,
  errors,
  onChange,
  getNestedValue,
}) => (
  <div className="space-y-3">
    <h2 className="text-lg font-bold text-gray-900 border-b border-blue-600 pb-1">
      {title}
    </h2>
    {fields.map((field) => {
      const value = getNestedValue(editedProfile, field.name) || "";
      const Component = field.type === "select" ? SelectField : EditableField;
      const fieldProps = {
        ...field,
        key: field.name,
        isEditing,
        value: field.type === "date" && value ? value.split("T")[0] : value,
        error: errors[field.name],
        onChange,
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
);

// ==================== Loading State Component ====================
export const LoadingState = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-200 border-t-blue-600"></div>
  </div>
);

// ==================== Empty State Component ====================
export const EmptyState = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <User className="w-12 h-12 text-gray-400 mx-auto mb-2" />
      <p className="text-gray-700 font-medium">No profile found</p>
    </div>
  </div>
);

// ==================== Form Configuration ====================
export const currentYear = new Date().getFullYear();

export const formSections = {
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
    { name: "personal_info.email", label: "Email", icon: Mail, readOnly: true },
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

export const formSections1 = {
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
    { name: "personal_info.email", label: "Email", icon: Mail, readOnly: true },
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
};

export const formSections2 = {
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

const BasicInformation = () => {
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

  // Loading state
  if (loading && !profile) {
    return <LoadingState />;
  }

  // Empty state
  if (!profile) {
    return <EmptyState />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-3 py-6">
        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> */}

        {Object.entries(formSections1["Basic Information"]).map(
          ([sectionTitle, fields]) => (
            <FormSection
              key={sectionTitle}
              title={sectionTitle}
              fields={fields}
              isEditing={isEditing}
              profile={profile}
              editedProfile={editedProfile}
              errors={errors}
              onChange={handleChange}
              getNestedValue={getNestedValue}
            />
          ),
        )}
        {/* </div> */}
      </div>
    </div>
  );
};
