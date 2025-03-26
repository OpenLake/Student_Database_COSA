import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const EditProfile = () => {
  const [updatedProfile, setUpdatedProfile] = useState({
    program: "",
    yearOfAdmission: "",
    discipline: "",
  });
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProfile((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/student/update-profile`,
        {
          ...updatedProfile,
          yearOfAdmission: parseInt(updatedProfile.yearOfAdmission, 10),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );
      if (res.status === 200) {
        console.log("Profile updated successfully");
        navigate("/", { replace: true });
      }
    } catch (err) {
      console.error("There was an error updating the profile!", err);
      if (err.status === 401 || err.status === 403) {
        navigate("/login", { replace: true });
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <form onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
        <div className="mb-4">
          <label className="block text-gray-700">Program</label>
          <input
            type="text"
            name="program"
            value={updatedProfile.program}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Year of Admission</label>
          <input
            type="text"
            name="yearOfAdmission"
            value={updatedProfile.yearOfAdmission}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Discipline</label>
          <input
            type="text"
            name="discipline"
            value={updatedProfile.discipline}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded"
          />
        </div>
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
        >
          Save
        </button>
      </form>
    </div>
  );
};

export { EditProfile };
