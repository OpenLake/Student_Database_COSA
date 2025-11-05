import React, { useState, useContext } from "react";
import ReactDOM from "react-dom";
import { Calendar1 } from "lucide-react";
import { AdminContext } from "../../context/AdminContext";
import { useEvents } from "../../hooks/useEvents";
import {
  academicsMonsoon2025,
  holidays2025,
} from "../../config/calendarConfig";
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
  } = useCalendarHover(events, holidays2025, academicsMonsoon2025);

  const days = buildCalendarGrid(year, month);

  const getTileColor = (d) => {
    if (!d) return "bg-transparent";
    const date = new Date(year, month, d, 12, 0, 0, 0);
    const dayMid = new Date(date).setHours(0, 0, 0, 0);
    const todayMid = new Date(today).setHours(0, 0, 0, 0);
    const hasEvent = getEventsForDate(date, events).length > 0;
    const holiday = getHolidayForDate(date, holidays2025);
    const hasAcademicEvent = getHolidayForDate(date, academicsMonsoon2025);

    if (holiday) return "bg-green-300 text-green-900 font-semibold";
    if (dayMid < todayMid) return "bg-gray-300 text-white font-semibold";
    if (dayMid === todayMid) return "bg-sky-400 text-white font-semibold";
    if (hasEvent) return "bg-yellow-300 text-yellow-900 font-semibold";
    if (hasAcademicEvent) return "bg-red-300 text-red-900 font-semibold";
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
    <div className="w-full h-full bg-white rounded-xl flex flex-col items-center justify-start py-2 overflow-visible mb-1">
      <div className="items-center justify-between w-[90%]">
        <div>
          <div className="flex jusify-between text-2xl font-bold tracking-tight text-gray-900">
            <div className="flex items-center">
              <Calendar1 size={24} className="text-gray-600 mt-1" />
              <span className="mx-2">Monthly Schedule</span>
            </div>
            <div className="flex-1"></div>
            <div className="flex items-center gap-2 mx-2 text-gray-500 text-3xl font-bold">
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
          <div className="flex text-gray-600 justify-between">
            <p className="text-base font-semibold text-gray-800">
              {new Date(year, month).toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </p>

            {/* <div className="flex content-center gap-3 "> */}
            <div className="flex items-start gap-1 text-[9px] text-gray-500 ml-5 mr-2 mt-1">
              <Legend color="bg-sky-400" label="Today" />
              <Legend color="bg-yellow-300" label="Event" />
              <Legend color="bg-green-300" label="Holiday" />
              <Legend color="bg-red-300" label="Academic" />
            </div>
          </div>
          {/* </div> */}
        </div>
      </div>

      <div className="grid grid-cols-7 text-[10px] font-medium text-gray-500 text-center w-[90%] mb-1">
        {["M", "T", "W", "T", "F", "S", "S"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-[5px] w-[90%] place-items-stretch">
        {days.map((day, idx) => (
          <div
            key={idx}
            className={`flex items-center justify-center aspect-square rounded-md text-sm ${getTileColor(day)} transition-all duration-150`}
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
          document.body
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
    <div className="font-semibold text-slate-800 mb-1 text-base">
      {hoveredEvent.date.toDateString()}
    </div>

    {hoveredEvent.holiday && (
      <div className="mb-1 pb-1">
        <div className="text-xs font-semibold text-green-700">
          🟩 {hoveredEvent.holiday.name}
        </div>
      </div>
    )}

    {hoveredEvent.academic && (
      <div className="mb-1 pb-1">
        <div className="text-xs font-semibold text-red-700">
          🟥 {hoveredEvent.academic.name}
        </div>
      </div>
    )}

    {hoveredEvent.events.map((ev) => (
      <div
        key={ev._id}
        className="mb-1 pb-1 text-xs font-semibold text-blue-700 truncate"
      >
        🟦 {ev.title}
      </div>
    ))}
  </div>
);

export default DashboardCalendar;
