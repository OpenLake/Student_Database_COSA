import React from "react";

const LoadingSpinner = ({ size = "lg", text, fullscreen = true }) => {
  const sizeClasses = {
    sm: "h-5 w-5 border-2",
    md: "h-10 w-10 border-[3px]",
    lg: "h-14 w-14 border-4",
  };

  const spinner = (
    <div
      className={`${sizeClasses[size]} border-amber-300/70 border-t-transparent border-l-transparent rounded-full animate-spin`}
    ></div>
  );

  if (fullscreen) {
    // Fullscreen loader
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center backdrop-blur-sm bg-black/5 z-50">
        {spinner}
        {text && (
          <p className="mt-3 text-gray-700 text-base font-medium tracking-wide">
            {text}
          </p>
        )}
      </div>
    );
  }

  // Inline loader (for buttons or smaller UI areas)
  return (
    <div className="flex items-center justify-center gap-2">
      {spinner}
      {text && <span className="text-gray-600 text-sm">{text}</span>}
    </div>
  );
};

export default LoadingSpinner;
