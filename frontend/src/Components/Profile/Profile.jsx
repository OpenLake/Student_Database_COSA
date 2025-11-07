import React from "react";
import StudentProfile from "./ProfilePage";
import { useAuth } from "../../hooks/useAuth";
import AdminProfile from "./AdminProfile";

const Profile = () => {
  const { userRole } = useAuth();

  if (userRole === "STUDENT") return <StudentProfile />;

  return <AdminProfile />;
};

export default Profile;
