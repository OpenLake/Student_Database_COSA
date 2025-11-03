import React from "react";
import { useAchievementStats } from "../../hooks/useAchievementStats";
import {
  Award,
  CheckCircle,
  Clock,
  FileText,
  Star,
  Loader2,
} from "lucide-react";

const StatItem = ({ icon: Icon, label, value, color }) => (
  <div className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-md border border-gray-200">
    <div className="flex items-center gap-1.5">
      <Icon className={`w-4 h-4 ${color}`} />
      <span className="text-sm text-gray-700">{label}</span>
    </div>
    <span className="text-sm font-semibold text-gray-900">{value}</span>
  </div>
);

const AchievementsStats = () => {
  const { stats, loading, error } = useAchievementStats();

  if (loading)
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
      </div>
    );

  if (error)
    return (
      <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg">
        Failed to load stats
      </div>
    );

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex flex-col gap-2">
      <h3 className="text-base font-semibold text-gray-900 mb-1">
        Achievement Stats
      </h3>

      <StatItem
        icon={Award}
        label="Total Achievements"
        value={stats.total}
        color="text-blue-500"
      />
      <StatItem
        icon={CheckCircle}
        label="Verified"
        value={stats.verified}
        color="text-green-500"
      />
      <StatItem
        icon={Clock}
        label="Pending"
        value={stats.pending}
        color="text-yellow-500"
      />
      <StatItem
        icon={FileText}
        label="Certificates"
        value={stats.withCertificates}
        color="text-purple-500"
      />
      <StatItem
        icon={Star}
        label="Top Type"
        value={stats.topType}
        color="text-orange-500"
      />
    </div>
  );
};

export default AchievementsStats;
