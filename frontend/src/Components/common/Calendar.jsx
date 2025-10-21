import { Calendar1 } from "lucide-react";
import React from "react";

const Calendar = () => {
  return (
    <div className="text-center rounded-xl p-12 bg-white">
      <div className="flex justify-center items-center gap-4 text-gray-400 mb-4">
        <Calendar1 size={48} strokeWidth={1.5} />
      </div>
      <h2 className="text-xl font-semibold text-slate-700">
        Calendar Coming Soon
      </h2>
    </div>
  );
};

export default Calendar;
