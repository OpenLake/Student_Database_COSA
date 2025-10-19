import { Award, CheckCircle, ExternalLink, XCircle } from "lucide-react";
import {
  formatDate,
  getLevelBadgeColor,
  getVerificationBadgeColor,
} from "../../utils/achievementHelpers";

const AchievementCard = ({ achievement }) => {
  return (
    <div className="bg-white rounded-lg gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">
              {achievement.title}
            </h3>
            {achievement.description && (
              <p className="text-sm text-gray-600 mb-3">
                {achievement.description}
              </p>
            )}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                {achievement.category?.charAt(0).toUpperCase() +
                  achievement.category?.slice(1)}
              </span>
              {achievement.level && (
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${getLevelBadgeColor(achievement.level)}`}
                >
                  {achievement.level.charAt(0).toUpperCase() +
                    achievement.level.slice(1)}
                </span>
              )}
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${getVerificationBadgeColor(achievement.verified)}`}
              >
                {achievement.verified ? (
                  <>
                    <CheckCircle className="w-3 h-3" />
                    Verified
                  </>
                ) : (
                  <>
                    <XCircle className="w-3 h-3" />
                    Pending
                  </>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {/* Achievement Details */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Award className="w-4 h-4 text-orange-500" />
            <h4 className="text-sm font-medium text-gray-900">
              Achievement Details
            </h4>
          </div>
          <div className="bg-orange-50 rounded-lg p-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Date achieved:</span>
              <span className="text-gray-900 font-medium">
                {formatDate(achievement.date_achieved)}
              </span>
            </div>
            {achievement.type && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Type:</span>
                <span className="text-gray-900 font-medium">
                  {achievement.type}
                </span>
              </div>
            )}
            {achievement.position && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Position:</span>
                <span className="text-gray-900 font-medium">
                  {achievement.position}
                </span>
              </div>
            )}
            {achievement.event_id && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Event:</span>
                <span className="text-gray-900 font-medium">
                  {achievement.event_id.title ||
                    achievement.event_id.name ||
                    "Event"}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Verification Details */}
        {achievement.verified && achievement.verified_by && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <h4 className="text-sm font-medium text-gray-900">
                Verification Details
              </h4>
            </div>
            <div className="bg-green-50 rounded-lg p-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Verified by:</span>
                <span className="text-gray-900 font-medium">
                  {achievement.verified_by.personal_info?.name ||
                    achievement.verified_by.username ||
                    "Unknown"}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Certificate */}
        {achievement.certificate_url && (
          <div>
            <a
              href={achievement.certificate_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-medium transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 outline-none"
            >
              <ExternalLink className="w-4 h-4" />
              View Certificate
            </a>
          </div>
        )}

        {/* Timeline */}
        <div className="flex justify-between text-xs text-gray-500 pt-3 border-t border-gray-200">
          <span>Added: {formatDate(achievement.created_at)}</span>
          <span>ID: {achievement.achievement_id}</span>
        </div>
      </div>
    </div>
  );
};
export default AchievementCard;
