import { Play } from "lucide-react";
import React from "react";

const NSCard = () => {
  return (
    <div className="text-center rounded-xl p-12 bg-white">
      <div className="flex justify-center items-center gap-4 text-gray-400 mb-4">
        <Play size={48} strokeWidth={1.5} />
      </div>
      <h2 className="text-xl font-semibold text-slate-700">
        NSO/NSS Features Coming Soon
      </h2>
    </div>
  );
};

export default NSCard;
