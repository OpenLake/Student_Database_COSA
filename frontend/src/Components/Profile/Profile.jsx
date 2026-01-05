import React from "react";
import StudentProfile from "./ProfilePage";
import { useAuth } from "../../hooks/useAuth";

import PORProfile from "./PORProfile";

const Profile = () => {
  const { userRole, isLoading } = useAuth();

  if(isLoading){
    return (
      <div className="flex justify-center items-center h-full">
        Loading...
      </div>
    );
  }

  if (userRole === "STUDENT") return <StudentProfile />;

  return <PORProfile />;
};

export default Profile;
