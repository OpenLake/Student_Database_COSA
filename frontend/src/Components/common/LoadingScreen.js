import React from "react";

const LoadingScreen = () => (
  <div className="fixed inset-0 bg-[#FDFAE2] flex flex-col items-center justify-center z-50">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-black mb-4"></div>
    <div className="text-xl font-semibold text-black">Loading...</div>
  </div>
);

export default LoadingScreen;
