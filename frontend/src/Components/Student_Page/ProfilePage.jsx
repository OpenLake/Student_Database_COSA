import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useCallback,
  useLayoutEffect,
} from "react";
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
import { fetchStudent } from "../../services/utils";
import { AdminContext } from "../../App";
import ProfilePhoto from "./ProfilePhoto";

// --- Validation helpers ---
const validateMobile = (number) => /^[0-9]{10}$/.test(number);
const validateUrl = (url) =>
  !url || /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-]*)*\/?$/.test(url);
const validateLinkedIn = (url) =>
  !url || /^https?:\/\/(www\.)?linkedin\.com\/.*$/.test(url);
const currentYear = new Date().getFullYear();
const validateAdmissionYear = (year) =>
  Number(year) >= 2016 && Number(year) <= currentYear;

// --- Cursor fix hook ---
function useCursorInput(value, setValue) {
  const inputRef = useRef(null);
  const posRef = useRef(null);

  const onChange = useCallback(
    (e) => {
      posRef.current = e.target.selectionStart;
      setValue(e.target.value);
    },
    [setValue],
  );

  useLayoutEffect(() => {
    if (inputRef.current && posRef.current !== null) {
      inputRef.current.setSelectionRange(posRef.current, posRef.current);
    }
  }, [value]);

  return [inputRef, onChange];
}

// --- Toast component ---
const Toast = ({ message, type, onClose }) => (
  <div
    className={`fixed top-6 right-6 z-50 px-4 py-2 rounded-xl shadow-lg flex items-center gap-2 text-sm
    ${
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
  const { isUserLoggedIn } = useContext(AdminContext);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(null);
  const [editedProfile, setEditedProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});
  const [profilePic, setProfilePic] = useState(null);
  // Cursor-preserving handlers for all editable fields
  const [mobileRef, mobileOnChange] = useCursorInput(
    editedProfile?.mobile_no || "",
    (val) => setEditedProfile((prev) => ({ ...prev, mobile_no: val })),
  );
  const [hostelRoomRef, hostelRoomOnChange] = useCursorInput(
    editedProfile?.hostelRoom || "",
    (val) => setEditedProfile((prev) => ({ ...prev, hostelRoom: val })),
  );
  const [addYearRef, addYearOnChange] = useCursorInput(
    editedProfile?.add_year || "",
    (val) => setEditedProfile((prev) => ({ ...prev, add_year: val })),
  );
  const [githubRef, githubOnChange] = useCursorInput(
    editedProfile?.socialLinks?.github || "",
    (val) =>
      setEditedProfile((prev) => ({
        ...prev,
        socialLinks: { ...prev.socialLinks, github: val },
      })),
  );
  const [linkedinRef, linkedinOnChange] = useCursorInput(
    editedProfile?.socialLinks?.linkedin || "",
    (val) =>
      setEditedProfile((prev) => ({
        ...prev,
        socialLinks: { ...prev.socialLinks, linkedin: val },
      })),
  );

  useEffect(() => {
    if (isUserLoggedIn?.ID_No) {
      setLoading(true);
      fetchStudent(isUserLoggedIn.ID_No)
        .then((data) => {
          if (data?.student) {
            setProfile(data.student);
            setEditedProfile(data.student);
            setProfilePic(data.student.profilePic);
          }
        })
        .catch(() =>
          setToast({ message: "Error fetching profile", type: "error" }),
        )
        .finally(() => setLoading(false));
    }
  }, [isUserLoggedIn]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedProfile({ ...profile });
    setErrors({});
  };

  const validateAll = () => {
    const errs = {};
    if (editedProfile.mobile_no && !validateMobile(editedProfile.mobile_no)) {
      errs.mobile_no = "Mobile number must be 10 digits";
    }
    if (
      editedProfile.socialLinks?.github &&
      !validateUrl(editedProfile.socialLinks.github)
    ) {
      errs.github = "Invalid GitHub URL";
    }
    if (
      editedProfile.socialLinks?.linkedin &&
      !validateLinkedIn(editedProfile.socialLinks.linkedin)
    ) {
      errs.linkedin = "Invalid LinkedIn URL";
    }
    if (
      editedProfile.add_year &&
      !validateAdmissionYear(editedProfile.add_year)
    ) {
      errs.add_year = `Admission year must be between 2016 and ${currentYear}`;
    }
    return errs;
  };

  const handleSave = async () => {
    const errors = validateAll();
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      setToast({ message: "Please fix validation errors", type: "error" });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/updateStudentProfile`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: profile.ID_No,
            updatedDetails: editedProfile,
          }),
          credentials: "include",
        },
      );

      if (response.ok) {
        const data = await response.json();
        setProfile(data.updatedStudent);
        setIsEditing(false);
        setToast({ message: "Profile updated successfully!", type: "success" });
      } else {
        throw new Error("Update failed");
      }
    } catch (error) {
      setToast({ message: "Failed to update profile", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditedProfile({ ...profile });
    setIsEditing(false);
    setErrors({});
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-200 border-t-blue-600"></div>
      </div>
    );

  if (!profile)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-700 font-medium">No profile found</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white px-6 py-4 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Profile Photo with improved border and shadow */}

          <ProfilePhoto
            isEditing={isEditing}
            ID_No={profile.ID_No}
            profilePic={profile.profilePic}
            onPhotoChange={(newPhoto) =>
              setProfile((prev) => ({ ...prev, profilePic: newPhoto }))
            }
          />

          {/* User Info */}
          <div>
            <h2 className="text-xl font-semibold text-white">{profile.name}</h2>
            <p className="text-sm text-blue-100 mt-1">
              Student ID: {profile.ID_No}
            </p>
          </div>
        </div>
        {/* Action Buttons */}
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

      {/* Profile Content */}
      <div className="max-w-4xl mx-auto px-3 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Basic Information */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900 border-b border-blue-600 pb-1">
              Basic Information
            </h2>
            <ReadOnlyField icon={User} label="Full Name" value={profile.name} />
            <ReadOnlyField
              icon={GraduationCap}
              label="Student ID"
              value={profile.ID_No}
            />
            <ReadOnlyField icon={Mail} label="Email" value={profile.email} />
            <SelectField
              icon={Users}
              label="Gender"
              value={editedProfile.gender}
              options={["Male", "Female", "Other"]}
              isEditing={isEditing}
              onChange={(val) =>
                setEditedProfile((prev) => ({ ...prev, gender: val }))
              }
            />
          </div>

          {/* Academic Information */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900 border-b border-blue-600 pb-1">
              Academic Information
            </h2>
            <EditableField
              icon={Calendar}
              label="Admission Year"
              value={editedProfile.add_year}
              error={errors.add_year}
              isEditing={isEditing}
              inputProps={{
                ref: addYearRef,
                onChange: addYearOnChange,
                type: "number",
                min: 2016,
                max: currentYear,
              }}
            />
            <SelectField
              icon={GraduationCap}
              label="Program"
              value={editedProfile.Program}
              options={["B.Tech", "M.Tech", "MSc", "PhD", "Other"]}
              isEditing={isEditing}
              onChange={(val) =>
                setEditedProfile((prev) => ({ ...prev, Program: val }))
              }
            />
            <SelectField
              icon={GraduationCap}
              label="Discipline"
              value={editedProfile.discipline}
              options={[
                "Computer Science & Engineering",
                "Electrical Engineering",
                "Mechanical Engineering",
                "Civil Engineering",
                "Electronics & Communication",
                "Chemical Engineering",
                "Mathematics",
                "Physics",
                "Chemistry",
              ]}
              isEditing={isEditing}
              onChange={(val) =>
                setEditedProfile((prev) => ({ ...prev, discipline: val }))
              }
            />
            <SelectField
              icon={GraduationCap}
              label="Year of Study"
              value={editedProfile.yearOfStudy}
              options={["1st", "2nd", "3rd", "4th", "5th", "Alumni"]}
              isEditing={isEditing}
              onChange={(val) =>
                setEditedProfile((prev) => ({ ...prev, yearOfStudy: val }))
              }
            />
          </div>

          {/* Contact Information */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900 border-b border-blue-600 pb-1">
              Contact Information
            </h2>
            <EditableField
              icon={Phone}
              label="Mobile Number"
              value={editedProfile.mobile_no}
              error={errors.mobile_no}
              isEditing={isEditing}
              inputProps={{
                ref: mobileRef,
                onChange: mobileOnChange,
                maxLength: 10,
                inputMode: "numeric",
              }}
            />
            <SelectField
              icon={Home}
              label="Hostel Name"
              value={editedProfile.hostelName}
              options={["None", "MSH", "Indravati", "Gopad", "Kanhar"]}
              isEditing={isEditing}
              onChange={(val) =>
                setEditedProfile((prev) => ({ ...prev, hostelName: val }))
              }
            />
            <EditableField
              icon={MapPin}
              label="Room Number"
              value={editedProfile.hostelRoom}
              isEditing={isEditing}
              inputProps={{
                ref: hostelRoomRef,
                onChange: hostelRoomOnChange,
              }}
            />
          </div>

          {/* Social Links */}
          <div className="space-y-3 md:col-span-2">
            <h2 className="text-lg font-bold text-gray-900 border-b border-blue-600 pb-1">
              Social Links
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <EditableField
                label="GitHub"
                value={editedProfile.socialLinks?.github}
                error={errors.github}
                isEditing={isEditing}
                inputProps={{
                  ref: githubRef,
                  onChange: githubOnChange,
                  type: "url",
                  placeholder: "https://github.com/username",
                }}
              />
              <EditableField
                label="LinkedIn"
                value={editedProfile.socialLinks?.linkedin}
                error={errors.linkedin}
                isEditing={isEditing}
                inputProps={{
                  ref: linkedinRef,
                  onChange: linkedinOnChange,
                  type: "url",
                  placeholder: "https://linkedin.com/in/username",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Components
const ReadOnlyField = ({ icon: Icon, label, value }) => (
  <div className="flex items-start space-x-2 p-2 bg-gray-50 rounded border border-gray-200">
    <Icon className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
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
  inputProps,
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
            value={value || ""}
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
}) => (
  <div className="flex flex-col space-y-1">
    <div className="flex items-start space-x-2 p-2 bg-gray-50 rounded border border-gray-200">
      <Icon className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
      <div className="flex-grow">
        <label className="block text-xs font-medium text-gray-700 mb-0.5">
          {label}
        </label>
        {isEditing ? (
          <select
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
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
  </div>
);

export default StudentProfile;
