import React from "react";
import StudentProfile from "./ProfilePage";
import { useAuth } from "../../hooks/useAuth";

import PORProfile from "./PORProfile";

const Profile = () => {
  const { userRole } = useAuth();

  if (userRole === "STUDENT") return <StudentProfile />;

  return <PORProfile />;
};

export default Profile;
