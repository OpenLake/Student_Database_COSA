import { useState, useEffect } from "react";
import axios from "axios";
import { Profile, EditProfile } from "../Components/profile";
import { fetchCredentials } from "../services/auth";

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchCredentials()
      .then((response) => {
        setProfile(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the profile!", error);
      });
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = (updatedProfile) => {
    axios
      .post("/update-profile", updatedProfile)
      .then((response) => {
        setProfile(updatedProfile);
        setIsEditing(false);
      })
      .catch((error) => {
        console.error("There was an error updating the profile!", error);
      });
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <Profile
      profile={profile}
      isEditing={isEditing}
      onEdit={handleEditClick}
      onSave={handleSaveClick}
    />
  );
};

export default ProfilePage;
