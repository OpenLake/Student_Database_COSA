import React, { useState } from "react";

const ProfilePhoto = ({ isEditing, ID_No, profilePic, onPhotoUpdate }) => {
  const [preview, setPreview] = useState(profilePic);
  const [loading, setLoading] = useState(false);

  // Handle file selection and preview
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("image", file);
    formData.append("ID_No", ID_No);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/profile/photo-update`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (response.ok) {
        const data = await response.json();
        setPreview(data.profilePic);
        onPhotoUpdate(data.profilePic);
      } else {
        console.error("Upload failed");
      }
    } catch (err) {
      console.error("Error uploading file:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/profile/photo-delete?ID_No=${ID_No}`,
        {
          method: "DELETE",
        },
      );

      if (response.ok) {
        const data = await response.json();
        setPreview(data.profilePic);
        onPhotoUpdate(data.profilePic);
      } else {
        console.error("Delete failed");
      }
    } catch (err) {
      console.error("Error deleting file:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-300">
        <img
          src={preview}
          alt="Profile"
          className="w-full h-full object-cover"
        />
      </div>

      {isEditing && (
        <div className="flex flex-col items-center gap-2">
          <label className="cursor-pointer bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600">
            {loading ? "Uploading..." : "Change Photo"}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          <button
            className="text-red-500 underline hover:text-red-600"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Processing..." : "Delete Photo"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePhoto;
