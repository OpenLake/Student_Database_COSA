import { useState, useRef } from "react";
import { getEventsForDate, getHolidayForDate } from "../utils/calendarUtils";

export const useCalendarHover = (events, holidays, academics) => {
  const [hoveredEvent, setHoveredEvent] = useState(null);
  const [isHoveringCard, setIsHoveringCard] = useState(false);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });

  const hoverTimeout = useRef(null);
  const leaveTimeout = useRef(null);

  const handleMouseEnter = (e, date) => {
    clearTimeout(hoverTimeout.current);
    clearTimeout(leaveTimeout.current);

    const evs = Array.isArray(events) ? getEventsForDate(date, events) : [];
    const holiday = getHolidayForDate(date, holidays);
    const academic = getHolidayForDate(date, academics);

    if (evs.length > 0 || holiday || academic) {
      const rect = e.currentTarget.getBoundingClientRect();
      hoverTimeout.current = setTimeout(() => {
        setHoverPosition({ x: rect.left + rect.width / 2, y: rect.top });
        setHoveredEvent({ date, events: evs, holiday, academic: academic });
      }, 120);
    }
  };

  const handleMouseLeave = () => {
    clearTimeout(hoverTimeout.current);
    leaveTimeout.current = setTimeout(() => {
      if (!isHoveringCard) setHoveredEvent(null);
    }, 200);
  };

  const handlePopupEnter = () => {
    clearTimeout(leaveTimeout.current);
    setIsHoveringCard(true);
  };

  const handlePopupLeave = () => {
    setIsHoveringCard(false);
    setHoveredEvent(null);
  };

  return {
    hoveredEvent,
    hoverPosition,
    handleMouseEnter,
    handleMouseLeave,
    handlePopupEnter,
    handlePopupLeave,
  };
};
