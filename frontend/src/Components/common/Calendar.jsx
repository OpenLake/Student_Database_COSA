import React, { useState, useContext } from "react";
import ReactDOM from "react-dom";
import { Calendar1 } from "lucide-react";
import { AdminContext } from "../../context/AdminContext";
import { useEvents } from "../../hooks/useEvents";
import { holidays2025 } from "../../config/calendarConfig";
import {
  buildCalendarGrid,
  getEventsForDate,
  getHolidayForDate,
} from "../../utils/calendarUtils";
import { useCalendarHover } from "../../hooks/useCalendarHover";

const DashboardCalendar = () => {
  const { isUserLoggedIn } = useContext(AdminContext);
  const username = isUserLoggedIn?.username || "";
  const userRole = isUserLoggedIn?.role || "STUDENT";
  const { events } = useEvents(userRole, username) || [];

  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const {
    hoveredEvent,
    hoverPosition,
    handleMouseEnter,
    handleMouseLeave,
    handlePopupEnter,
    handlePopupLeave,
  } = useCalendarHover(events, holidays2025);

  const days = buildCalendarGrid(year, month);

  const getTileColor = (d) => {
    if (!d) return "bg-transparent";
    const date = new Date(year, month, d);
    const dayMid = new Date(date).setHours(0, 0, 0, 0); 
    const todayMid = new Date(today).setHours(0, 0, 0, 0);
    const hasEvent = getEventsForDate(date, events).length > 0;
    const holiday = getHolidayForDate(date, holidays2025);

    if (holiday) return "bg-green-300 text-green-900 font-semibold";
    if (dayMid < todayMid) return "bg-red-300 text-white font-semibold";
    if (dayMid === todayMid) return "bg-sky-400 text-white font-semibold";
    if (hasEvent) return "bg-yellow-300 text-yellow-900 font-semibold";
    return "bg-gray-100 text-gray-700";
  };

  const changeMonth = (offset) => {
    let newMonth = month + offset;
    let newYear = year;
    if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    }
    setMonth(newMonth);
    setYear(newYear);
  };

  return (
    <div className="w-full h-full bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col items-center justify-start py-2 overflow-visible">
      <div className="flex items-center justify-between w-[90%] mb-1">
        <div className="flex items-center gap-1">
          <Calendar1 size={16} className="text-gray-600" />
          <p className="text-[12px] font-semibold text-gray-800">
            {new Date(year, month).toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-[9px] text-gray-500">
            <Legend color="bg-sky-400" label="Today" />
            <Legend color="bg-yellow-300" label="Event" />
            <Legend color="bg-green-300" label="Holiday" />
            <Legend color="bg-red-300" label="Past" />
          </div>
          <div className="flex items-center gap-2 text-gray-500 text-sm font-bold">
            <button
              onClick={() => changeMonth(-1)}
              className="hover:text-gray-700"
            >
              ‹
            </button>
            <button
              onClick={() => changeMonth(1)}
              className="hover:text-gray-700"
            >
              ›
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7 text-[10px] font-medium text-gray-500 text-center w-[90%] mb-1">
        {["M", "T", "W", "T", "F", "S", "S"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-[3px] w-[90%]">
        {days.map((day, idx) => (
          <div
            key={idx}
            className={`flex items-center justify-center h-7 w-7 rounded-md text-[10px] ${getTileColor(day)} transition-all duration-150`}
            onMouseEnter={(e) =>
              day && handleMouseEnter(e, new Date(year, month, day))
            }
            onMouseLeave={handleMouseLeave}
          >
            {day && <span>{day}</span>}
          </div>
        ))}
      </div>

      {hoveredEvent &&
        ReactDOM.createPortal(
          <HoverPopup
            hoveredEvent={hoveredEvent}
            hoverPosition={hoverPosition}
            handlePopupEnter={handlePopupEnter}
            handlePopupLeave={handlePopupLeave}
          />,
          document.body,
        )}
    </div>
  );
};

const Legend = ({ color, label }) => (
  <div className="flex items-center gap-[3px]">
    <span className={`w-2 h-2 rounded-full ${color}`}></span>
    <span>{label}</span>
  </div>
);

const HoverPopup = ({
  hoveredEvent,
  hoverPosition,
  handlePopupEnter,
  handlePopupLeave,
}) => (
  <div
    className="fixed z-[9999] bg-white border border-gray-300 rounded-lg shadow-xl p-2 w-52 max-h-48 overflow-auto"
    style={{
      top: Math.max(hoverPosition.y - 10, 60),
      left: hoverPosition.x,
      transform: "translate(-50%, -100%)",
    }}
    onMouseEnter={handlePopupEnter}
    onMouseLeave={handlePopupLeave}
  >
    <h4 className="font-semibold text-slate-800 mb-1 text-[11px]">
      {hoveredEvent.date.toDateString()}
    </h4>

    {hoveredEvent.holiday && (
      <div className="mb-1 border-b border-gray-200 pb-1">
        <p className="text-[11px] font-semibold text-green-700">
          🟩 {hoveredEvent.holiday.name}
        </p>
      </div>
    )}

    {hoveredEvent.events.map((ev) => (
      <div
        key={ev._id}
        className="mb-1 last:mb-0 border-b last:border-none pb-1"
      >
        <p className="text-[11px] font-semibold text-blue-700 truncate">
          {ev.title}
        </p>
        <p className="text-[10px] text-gray-500 truncate">{ev.description}</p>
        <p className="text-[9px] text-gray-400">
          {new Date(ev.schedule.start).toLocaleDateString()} →{" "}
          {new Date(ev.schedule.end).toLocaleDateString()}
        </p>
      </div>
    ))}
  </div>
);

export default DashboardCalendar;
