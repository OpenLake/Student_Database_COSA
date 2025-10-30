import React from "react";
import { Award, Trophy, Medal, Star } from "lucide-react";

const DisplayCard = ({
  icon: IconComponent = Medal,
  iconColor,
  backgroundColor = "bg-[#C9F5E3]",
  title,
  subtitle,
  description,
  iconSize = 48,
}) => {
  return (
    <div
      className={`rounded-2xl p-2 flex flex-col items-center justify-center text-center ${backgroundColor}`}
      //   style={{ backgroundColor }}
    >
      {/* Medal/Icon Container */}
      <div className="mb-2">
        <div
          className="rounded-full p-2"
          //   style={{ backgroundColor: "black" }}
        >
          <IconComponent
            size={iconSize}
            className="text-black"
            strokeWidth={2}
          />
        </div>
      </div>

      {/* Title */}
      <div className="text-xl font-bold text-gray-900 mb-2">{title}</div>

      {/* Subtitle */}
      <div className="text-gray-600 font-medium mb-1">{subtitle}</div>

      {/* Description */}
      <div className="text-gray-500">{description}</div>
    </div>
  );
};

export default DisplayCard;
