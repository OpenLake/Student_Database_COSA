import { useState, useEffect } from "react";
import { fetchCredentials } from "../services/auth";

export const useAuth = () => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(null);

  const handleLogin = (userData) => {
    if (!userData) return;
    setIsUserLoggedIn(userData);
    if (userData?.role) setUserRole(userData.role);
    // Always set onboarding flag based on the user's value (previous logic only set it when falsy)
    setIsOnboardingComplete(Boolean(userData?.onboardingComplete));
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const response = await fetchCredentials();
        const user = response.message;
        console.log("User is:", user);
        if (response?.success) {
          handleLogin(user);
          //console.log("User role:", user.role);
          //console.log("Onboarding complete:", user.onboardingComplete);
        } else {
          setIsUserLoggedIn(false);
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);
        setIsUserLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  return {
    isUserLoggedIn,
    setIsUserLoggedIn,
    userRole,
    setUserRole,
    isOnboardingComplete,
    setIsOnboardingComplete,
    isLoading,
    setIsLoading,
    handleLogin,
  };
};
