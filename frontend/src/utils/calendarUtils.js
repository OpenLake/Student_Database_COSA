export const buildCalendarGrid = (year, month) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startWeekday = (firstDay.getDay() + 6) % 7;
  const days = [];
  for (let i = 0; i < startWeekday; i++) days.push(null);
  for (let d = 1; d <= lastDay.getDate(); d++) days.push(d);
  while (days.length % 7 !== 0) days.push(null);
  return days;
};

export const getEventsForDate = (date, events) => {
  const target = new Date(date).setHours(0, 0, 0, 0);
  return events.filter((e) => {
    const start = e?.schedule?.start
      ? new Date(e.schedule.start).setHours(0, 0, 0, 0)
      : null;
    const end = e?.schedule?.end
      ? new Date(e.schedule.end).setHours(0, 0, 0, 0)
      : start;
    return start && target >= start && target <= end;
  });
};

export const getHolidayForDate = (date, holidays) => {
  // Format date as YYYY-MM-DD without timezone conversion
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const iso = `${year}-${month}-${day}`;

  return holidays.find((h) => h.date === iso);
};
