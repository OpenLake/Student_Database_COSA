import { useState, useEffect } from "react";
import { fetchCredentials } from "../services/auth";

export const useAuth = () => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(null);

  const handleLogin = (userData) => {
    setIsUserLoggedIn(userData);
    setUserRole(userData.role);
    setIsOnboardingComplete(userData.onboardingComplete);
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const user = await fetchCredentials();
        if (user) {
          setIsUserLoggedIn(user);
          setUserRole(user.role);
          setIsOnboardingComplete(user.onboardingComplete);
          console.log("User role:", user.role);
          console.log("Onboarding complete:", user.onboardingComplete);
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
