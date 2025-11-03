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
  const iso = date.toISOString().split("T")[0];
  return holidays.find((h) => h.date === iso);
};
