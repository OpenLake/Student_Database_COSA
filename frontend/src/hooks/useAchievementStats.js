// src/hooks/useAchievementStats.js
import { useAchievements } from "./useAchievements";
import { useMemo } from "react";

export const useAchievementStats = () => {
  const { achievements, loading, error } = useAchievements();

  const stats = useMemo(() => {
    if (!achievements || achievements.length === 0)
      return {
        total: 0,
        verified: 0,
        pending: 0,
        withCertificates: 0,
        topType: "N/A",
      };

    const verified = achievements.filter((a) => a.verified).length;
    const pending = achievements.length - verified;
    const withCertificates = achievements.filter(
      (a) => a.certificate_url,
    ).length;

    // Count by type
    const typeCounts = achievements.reduce((acc, a) => {
      if (a.type) acc[a.type] = (acc[a.type] || 0) + 1;
      return acc;
    }, {});

    // Find most frequent type
    const topType =
      Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

    return {
      total: achievements.length,
      verified,
      pending,
      withCertificates,
      topType,
    };
  }, [achievements]);

  return { stats, loading, error };
};
