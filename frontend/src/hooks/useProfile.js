import { useState, useEffect, useContext } from "react";
import { fetchCredentials } from "../services/auth";
import { AdminContext } from "../context/AdminContext";
import api from "../utils/api";

// --- Validation & Helpers ---
const validateMobile = (number) => /^[0-9]{10}$/.test(number);
const validateUrl = (url) =>
  !url || /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-]*)*\/?$/.test(url);
const validateLinkedIn = (url) =>
  !url || /^https?:\/\/(www\.)?linkedin\.com\/.*$/.test(url);
const currentYear = new Date().getFullYear();
const validateAdmissionYear = (year) =>
  Number(year) >= 2016 && Number(year) <= currentYear;

// Helper to update nested state properties immutably
const setNestedValue = (obj, path, value) => {
  const keys = path.split(".");
  const lastKey = keys.pop();
  const lastObj = keys.reduce((o, key) => (o[key] = o[key] || {}), obj);
  lastObj[lastKey] = value;
  return { ...obj };
};

// Helper to get nested values, handling undefined paths
const getNestedValue = (obj, path) =>
  path
    .split(".")
    .reduce((o, key) => (o && o[key] !== "undefined" ? o[key] : ""), obj);

export const useProfile = () => {
  const { isUserLoggedIn } = useContext(AdminContext);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(null);
  const [editedProfile, setEditedProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});
  // console.log(isUserLoggedIn)
  // Fetch profile data on mount
  useEffect(() => {
    // if (isUserLoggedIn?.user_id) {
      setLoading(true);
      fetchCredentials()
        .then((data) => {
          if (data) {
            setProfile(data);
            // console.log(data)
            setEditedProfile(JSON.parse(JSON.stringify(data))); // Deep copy
          }
        })
        .catch(() =>
          setToast({ message: "Error fetching profile", type: "error" }),
        )
        .finally(() => setLoading(false));
    // }
  }, [isUserLoggedIn]);


  // Validation logic
  const validateAll = () => {
    const errs = {};
    if (
      editedProfile.personal_info?.phone &&
      !validateMobile(editedProfile.personal_info.phone)
    ) {
      errs["personal_info.phone"] = "Mobile number must be 10 digits";
    }
    if (
      editedProfile.contact_info?.socialLinks?.github &&
      !validateUrl(editedProfile.contact_info.socialLinks.github)
    ) {
      errs["contact_info.socialLinks.github"] = "Invalid GitHub URL";
    }
    if (
      editedProfile.contact_info?.socialLinks?.linkedin &&
      !validateLinkedIn(editedProfile.contact_info.socialLinks.linkedin)
    ) {
      errs["contact_info.socialLinks.linkedin"] = "Invalid LinkedIn URL";
    }
    if (
      editedProfile.academic_info?.batch_year &&
      !validateAdmissionYear(editedProfile.academic_info.batch_year)
    ) {
      errs["academic_info.batch_year"] =
        `Admission year must be between 2016 and ${currentYear}`;
    }
    return errs;
  };

  // Handlers
  const handleEdit = () => {
    setIsEditing(true);
    setEditedProfile(JSON.parse(JSON.stringify(profile))); // Deep copy to prevent mutation
    setErrors({});
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile((prev) => setNestedValue(prev, name, value));
  };

  const handleSave = async () => {
    const validationErrors = validateAll();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setToast({ message: "Please fix validation errors", type: "error" });
      return;
    }

    setLoading(true);
    try {
      const res = await api.put(`/profile/updateStudentProfile`, {
        userId: profile.user_id,
        updatedDetails: {
          personal_info: editedProfile.personal_info,
          academic_info: editedProfile.academic_info,
          contact_info: editedProfile.contact_info,
        },
      });
      setProfile(res.data.updatedStudent);
      setIsEditing(false);
      setToast({ message: "Profile updated successfully!", type: "success" });
    } catch (error) {
      setToast({ message: "Failed to update profile", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpdate = (newPhoto) => {
    const updatedProfile = setNestedValue(
      profile,
      "personal_info.profilePic",
      newPhoto,
    );
    setProfile(updatedProfile);
    setEditedProfile(updatedProfile);
  };

  const closeToast = () => setToast(null);

  return {
    // State
    isEditing,
    profile,
    editedProfile,
    loading,
    toast,
    errors,

    // Handlers
    handleEdit,
    handleCancel,
    handleChange,
    handleSave,
    handlePhotoUpdate,
    closeToast,

    // Utilities
    getNestedValue,
  };
};

export { currentYear };
