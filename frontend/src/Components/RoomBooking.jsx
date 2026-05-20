import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Filter,
  MapPin,
  Plus,
  RefreshCcw,
  Search,
  Users,
  X,
  XCircle,
  History,
  Info
} from "lucide-react";
import { toast } from "react-toastify";
import { AdminContext } from "../context/AdminContext";
import api from "../utils/api";

// ─── Constants ───────────────────────────────────────────────────────────────

const ADMIN_ROLES = [
  "PRESIDENT",
  "GENSEC_SCITECH",
  "GENSEC_ACADEMIC",
  "GENSEC_CULTURAL",
  "GENSEC_SPORTS",
  "CLUB_COORDINATOR",
];

const APPROVAL_UI_ROLE = "PRESIDENT";

const PRESET_AMENITIES = [
  "Projector",
  "Whiteboard",
  "AC",
  "Sound System",
  "Mic",
  "Wi-Fi",
  "Smart Display",
];

const HOUR_START = 7;
const HOUR_END = 23;
const HOUR_WIDTH_PX = 80;

// ─── Helpers ─────────────────────────────────────────────────────────────────

const toDateInput = (date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const combineDateTime = (dateStr, timeStr) =>
  new Date(`${dateStr}T${timeStr}:00`);

const getTodayStart = () => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now;
};

const parseLocalDate = (value) => {
  if (!value) return new Date(NaN);
  if (value instanceof Date) return value;
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, month - 1, day);
  }
  return new Date(value);
};

const formatDateTime = (value) =>
  new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const formatDate = (value) => {
  const d = parseLocalDate(value);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatTime = (value) =>
  new Date(value).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

const sameDay = (value, dateStr) => {
  if (!value || !dateStr) return false;
  const date = new Date(value);
  const [year, month, day] = dateStr.split("-").map(Number);
  return (
    date.getFullYear() === year &&
    date.getMonth() + 1 === month &&
    date.getDate() === day
  );
};

const isClashing = (existingBooking, startTime, endTime) => {
  if (!["Pending", "Approved"].includes(existingBooking.status)) return false;
  const existingStart = new Date(existingBooking.startTime);
  const existingEnd = new Date(existingBooking.endTime);
  return existingStart < endTime && existingEnd > startTime;
};

// ─── Style helpers ────────────────────────────────────────────────────────────

const statusStyleMap = {
  Pending: "bg-amber-100 text-amber-800 border-amber-200",
  Approved: "bg-stone-100 text-stone-800 border-stone-200",
  Rejected: "bg-rose-100 text-rose-800 border-rose-200",
  Cancelled: "bg-slate-200 text-slate-700 border-slate-300",
};

const timelineColorMap = {
  Pending: "bg-amber-100 border-amber-300 text-amber-900 shadow-sm",
  Approved: "bg-stone-100 border-stone-300 text-stone-900 shadow-sm",
};

// Premium segmented control style
const tabStyle = (isActive) =>
  `rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
    isActive
      ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/50"
      : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
  }`;

// ─── Modal Component ──────────────────────────────────────────────────────────

const Modal = ({ open, onClose, title, children }) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      style={{ background: "rgba(15,23,42,0.6)", backdropFilter: "blur(6px)" }}
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col"
        style={{ animation: "modalIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)" }}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">{children}</div>
      </div>
      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: translateY(16px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
};

// ─── Create Room Modal ────────────────────────────────────────────────────────

const CreateRoomModal = ({ open, onClose, onSubmit, submitting }) => {
  const [form, setForm] = useState({
    name: "",
    capacity: "",
    location: "",
    amenities: [],
    customAmenity: "",
  });

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setForm({ name: "", capacity: "", location: "", amenities: [], customAmenity: "" });
    }
  }, [open]);

  const addAmenityChip = () => {
    const value = form.customAmenity.trim();
    if (!value) return;
    if (form.amenities.some((a) => a.toLowerCase() === value.toLowerCase())) {
      toast.info("Amenity already added.");
      return;
    }
    setForm((prev) => ({ ...prev, amenities: [...prev.amenities, value], customAmenity: "" }));
  };

  const toggleAmenity = (amenity) =>
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));

  const removeAmenity = (amenity) =>
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((a) => a !== amenity),
    }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <Modal open={open} onClose={onClose} title="Create New Room">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="room-name" className="block text-xs font-medium text-slate-700 mb-1">Room Name</label>
            <input
              id="room-name"
              type="text"
              placeholder="e.g., LH-101"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              className="w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 transition-all bg-white"
              required
            />
          </div>
          <div>
            <label htmlFor="room-capacity" className="block text-xs font-medium text-slate-700 mb-1">Capacity</label>
            <input
              id="room-capacity"
              type="number"
              min="1"
              placeholder="e.g., 50"
              value={form.capacity}
              onChange={(e) => setForm((p) => ({ ...p, capacity: e.target.value }))}
              className="w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 transition-all bg-white"
              required
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="room-location" className="block text-xs font-medium text-slate-700 mb-1">Location</label>
            <input
              id="room-location"
              type="text"
              placeholder="e.g., Block A, Ground Floor"
              value={form.location}
              onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
              className="w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 transition-all bg-white"
              required
            />
          </div>
        </div>

        <div className="space-y-2 pt-2 border-t border-slate-100">
          <label className="block text-xs font-medium text-slate-700">Amenities Setup</label>
          <div className="flex flex-wrap gap-1.5">
            {PRESET_AMENITIES.map((amenity) => {
              const selected = form.amenities.includes(amenity);
              return (
                <button
                  key={amenity}
                  type="button"
                  onClick={() => toggleAmenity(amenity)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium border transition-all ${
                    selected
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-slate-600 border-slate-300 hover:border-slate-400 hover:bg-slate-50"
                  }`}
                >
                  {amenity}
                </button>
              );
            })}
          </div>
          <div className="flex gap-2 pt-1">
            <input
              type="text"
              placeholder="Add custom amenity"
              value={form.customAmenity}
              onChange={(e) => setForm((p) => ({ ...p, customAmenity: e.target.value }))}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addAmenityChip())}
              className="rounded-md border border-slate-300 px-2.5 py-1.5 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 transition-all bg-white"
            />
            <button
              type="button"
              onClick={addAmenityChip}
              className="rounded-md bg-slate-200 text-slate-700 px-3 py-1.5 text-xs font-medium hover:bg-slate-300 transition-colors"
            >
              Add
            </button>
          </div>
          {form.amenities.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {form.amenities.map((amenity) => (
                <span key={amenity} className="inline-flex items-center gap-1 bg-slate-100 border border-slate-200 text-slate-800 text-[11px] font-medium px-2 py-0.5 rounded-md">
                  {amenity}
                  <button
                    type="button"
                    onClick={() => removeAmenity(amenity)}
                    className="text-slate-400 hover:text-rose-500 rounded-full p-0.5 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end pt-3 border-t border-slate-100">
          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto rounded-lg bg-slate-900 px-5 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50 transition"
          >
            {submitting ? "Creating..." : "Save Room"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

// ─── Drag-and-Select Timeline ─────────────────────────────────────────────────

const DragTimeline = ({ bookings, date, onSlotSelect, clashBookingId }) => {
  const trackRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [dragEnd, setDragEnd] = useState(null);
  const [hoveredHour, setHoveredHour] = useState(null);
  const totalHours = HOUR_END - HOUR_START;
  const totalWidth = totalHours * HOUR_WIDTH_PX;

  const getClientX = (e) => (e.touches && e.touches.length > 0 ? e.touches[0].clientX : e.clientX);

  const xToHour = (clientX) => {
    if (!trackRef.current) return HOUR_START;
    const rect = trackRef.current.getBoundingClientRect();
    const x = clientX - rect.left + trackRef.current.scrollLeft;
    return Math.max(HOUR_START, Math.min(HOUR_END, HOUR_START + x / HOUR_WIDTH_PX));
  };

  const roundHalf = (h) => Math.round(h * 2) / 2;

  const onDragStart = (e) => {
    // Only block default if it's a mouse event to keep scrolling smooth on mobile
    if (!e.touches && e.button !== 0) return; 
    const h = roundHalf(xToHour(getClientX(e)));
    setDragging(true);
    setDragStart(h);
    setDragEnd(h);
  };

  const onDragMove = useCallback(
    (e) => {
      if (!trackRef.current) return;
      const h = roundHalf(xToHour(getClientX(e)));
      setHoveredHour(h);
      if (dragging) setDragEnd(h);
    },
    [dragging]
  );

  const onDragEnd = useCallback(() => {
    if (!dragging) return;
    setDragging(false);
    if (dragStart === null || dragEnd === null) return;
    const s = Math.min(dragStart, dragEnd);
    const e = Math.max(dragStart, dragEnd);
    if (e - s < 0.25) return;
    const pad = (n) => String(Math.floor(n)).padStart(2, "0");
    const minStr = (h) => (h % 1 === 0.5 ? "30" : "00");
    const startStr = `${pad(s)}:${minStr(s)}`;
    const endStr = `${pad(e)}:${minStr(e)}`;
    onSlotSelect(startStr, endStr);
    setDragStart(null);
    setDragEnd(null);
  }, [dragging, dragStart, dragEnd, onSlotSelect]);

  const onMouseLeave = () => {
    setHoveredHour(null);
    if (dragging) {
      setDragging(false);
      setDragStart(null);
      setDragEnd(null);
    }
  };

  const bars = bookings.map((booking) => {
    const start = new Date(booking.startTime);
    const end = new Date(booking.endTime);
    const startH = start.getHours() + start.getMinutes() / 60;
    const endH = end.getHours() + end.getMinutes() / 60;
    const left = (startH - HOUR_START) * HOUR_WIDTH_PX;
    const width = (endH - startH) * HOUR_WIDTH_PX;
    const isClash = clashBookingId === booking._id;
    return { booking, left, width, isClash, startH, endH };
  });

  const selLeft = dragStart !== null && dragEnd !== null
    ? (Math.min(dragStart, dragEnd) - HOUR_START) * HOUR_WIDTH_PX : 0;
  const selWidth = dragStart !== null && dragEnd !== null
    ? Math.abs(dragEnd - dragStart) * HOUR_WIDTH_PX : 0;

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm select-none">
      <div
        ref={trackRef}
        style={{ width: totalWidth + 40, minHeight: 120, position: "relative", cursor: dragging ? "col-resize" : "crosshair", touchAction: "pan-y" }}
        onMouseDown={onDragStart}
        onTouchStart={onDragStart}
        onMouseMove={onDragMove}
        onTouchMove={onDragMove}
        onMouseUp={onDragEnd}
        onTouchEnd={onDragEnd}
        onMouseLeave={onMouseLeave}
      >
        {/* Hour labels */}
        <div className="flex h-8 border-b border-slate-100 bg-slate-50/50">
          {Array.from({ length: totalHours + 1 }, (_, i) => (
            <div
              key={i}
              className="flex-shrink-0 text-center text-[11px] font-medium text-slate-400 pt-2"
              style={{ width: HOUR_WIDTH_PX, borderLeft: i > 0 ? "1px dashed #e2e8f0" : "none" }}
            >
              {String(HOUR_START + i).padStart(2, "0")}:00
            </div>
          ))}
        </div>

        <div className="relative h-[88px]">
          {/* Background grid lines */}
          {Array.from({ length: totalHours + 1 }, (_, i) => (
             <div key={`grid-${i}`} className="absolute top-0 h-full border-l border-dashed border-slate-100" style={{ left: i * HOUR_WIDTH_PX }} />
          ))}

          {/* Hover line */}
          {hoveredHour !== null && !dragging && (
            <div
              className="absolute top-0 h-full w-[2px] bg-amber-400 pointer-events-none z-10"
              style={{ left: (hoveredHour - HOUR_START) * HOUR_WIDTH_PX }}
            />
          )}

          {/* Drag selection highlight */}
          {dragging && dragStart !== null && dragEnd !== null && selWidth > 0 && (
            <div
              className="absolute top-2 h-[72px] bg-amber-50/60 border-2 border-dashed border-amber-400 rounded-lg pointer-events-none z-30"
              style={{ left: selLeft, width: selWidth }}
            />
          )}

          {/* Booking bars */}
          {bars.map(({ booking, left, width, isClash }) => (
            <div
              key={booking._id}
              title={`${booking.event?.title || booking.purpose || "Booking"}\n${formatDateTime(booking.startTime)} → ${formatDateTime(booking.endTime)}\nBooked by: ${booking.bookedBy?.personal_info?.name || booking.bookedBy?.username || "—"}`}
              className={`absolute top-2 h-[72px] rounded-lg p-2 overflow-hidden cursor-default z-20 transition-all ${timelineColorMap[booking.status] || "bg-slate-100 border-slate-300 text-slate-700"} ${isClash ? "ring-2 ring-rose-500 ring-offset-2 z-40" : ""}`}
              style={{
                left: Math.max(0, left),
                width: Math.max(24, width - 2),
                animation: isClash ? "clashPulse 0.8s ease-in-out infinite alternate" : "none",
              }}
            >
              <div className="text-[11px] font-bold leading-tight truncate">
                {booking.event?.title || booking.purpose || "Booking"}
              </div>
              <div className="text-[10px] opacity-80 mt-0.5 truncate">
                {formatTime(booking.startTime)}–{formatTime(booking.endTime)}
              </div>
              <div className="text-[10px] opacity-70 truncate mt-1">
                {booking.bookedBy?.personal_info?.name || booking.bookedBy?.username || ""}
              </div>
            </div>
          ))}

          {/* Empty state hint */}
          {bars.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-400 pointer-events-none">
              Drag horizontally across the timeline to request a booking slot
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes clashPulse {
          from { box-shadow: 0 0 0 0 rgba(244,63,94,0.5); }
          to   { box-shadow: 0 0 0 8px rgba(244,63,94,0); }
        }
      `}</style>
    </div>
  );
};

// ─── Rejection Modal ──────────────────────────────────────────────────────────

const RejectionModal = ({ open, onClose, onConfirm }) => {
  const [reason, setReason] = useState("");
  const handleConfirm = () => {
    onConfirm(reason.trim());
    setReason("");
  };
  return (
    <Modal open={open} onClose={onClose} title="Reject Booking Request">
      <div className="space-y-5">
        <div className="bg-rose-50 border border-rose-100 text-rose-800 text-sm p-3 rounded-lg flex items-start gap-2">
           <Info className="h-5 w-5 shrink-0 mt-0.5 opacity-80" />
           <p>Provide an optional reason for rejection. This will be visible to the requester to help them adjust their request.</p>
        </div>
        <div>
          <label htmlFor="rejection-reason" className="block text-sm font-medium text-slate-700 mb-1.5">
            Reason for Rejection
          </label>
          <textarea
            id="rejection-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g., Room is reserved for maintenance."
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm min-h-[100px] focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
          />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-rose-700 transition"
          >
            <XCircle className="h-4 w-4" /> Confirm Rejection
          </button>
        </div>
      </div>
    </Modal>
  );
};

// ─── Booking Modal ────────────────────────────────────────────────────────────

const BookingModal = ({
  open,
  onClose,
  rooms,
  events,
  bookings,
  canBook,
  onSubmit,
  submitting,
  initialData,
  onClashChange, // Function to notify parent of current clash ID
}) => {
  const [form, setForm] = useState({
    roomId: rooms[0]?._id || "",
    eventId: "",
    date: toDateInput(new Date()),
    startTime: "10:00",
    endTime: "11:00",
    purpose: "",
  });

  // Reset form or load initial data when modal opens/closes
  useEffect(() => {
    if (open) {
      if (initialData) {
        setForm((prev) => ({ ...prev, ...initialData }));
      } else {
        setForm({
          roomId: rooms[0]?._id || "",
          eventId: "",
          date: toDateInput(new Date()),
          startTime: "10:00",
          endTime: "11:00",
          purpose: "",
        });
      }
    }
  }, [open, initialData, rooms]);

  const start = useMemo(
    () => combineDateTime(form.date, form.startTime),
    [form.date, form.startTime]
  );
  const end = useMemo(
    () => combineDateTime(form.date, form.endTime),
    [form.date, form.endTime]
  );

  const clashWarning = useMemo(() => {
    if (!form.roomId || !form.date || !form.startTime || !form.endTime) return null;
    if (isNaN(start) || isNaN(end) || end <= start) return null;
    return bookings.find((b) => {
      if (b.room?._id !== form.roomId) return false;
      if (!sameDay(b.startTime, form.date)) return false;
      return isClashing(b, start, end);
    });
  }, [bookings, form, start, end]);

  // Sync clash state with parent (for timeline highlighting)
  useEffect(() => {
    if (onClashChange) {
      onClashChange(clashWarning ? clashWarning._id : null);
    }
    return () => onClashChange && onClashChange(null);
  }, [clashWarning, onClashChange]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.roomId) return toast.error("Please select a room.");
    if (isNaN(start.getTime()) || isNaN(end.getTime()))
      return toast.error("Please enter valid date/time.");
    if (end <= start) return toast.error("End time must be after start time.");
    if (start < new Date()) return toast.error("Cannot book a past date/time.");
    if (clashWarning) return toast.error("This slot overlaps with an existing booking.");
    onSubmit(form);
  };

  return (
    <Modal open={open} onClose={onClose} title="Request Room Booking">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label htmlFor="modal-room" className="block text-sm font-medium text-slate-700 mb-1.5">
              Room
            </label>
            <select
              id="modal-room"
              value={form.roomId}
              onChange={(e) => setForm((p) => ({ ...p, roomId: e.target.value }))}
              className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 transition-all"
              required
            >
              {rooms.length === 0 && <option value="">No rooms available</option>}
              {rooms.map((room) => (
                <option key={room._id} value={room._id}>
                  {room.name} ({room.location}) — {room.capacity} seats
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <div>
              <label htmlFor="modal-date" className="block text-sm font-medium text-slate-700 mb-1.5">
                Date
              </label>
              <input
                id="modal-date"
                type="date"
                value={form.date}
                min={toDateInput(new Date())}
                onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
                className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 transition-all"
                required
              />
            </div>
            <div>
              <label htmlFor="modal-event" className="block text-sm font-medium text-slate-700 mb-1.5">
                Linked Event (optional)
              </label>
              <select
                id="modal-event"
                value={form.eventId}
                onChange={(e) => setForm((p) => ({ ...p, eventId: e.target.value }))}
                className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 transition-all"
              >
                <option value="">No event selected</option>
                {events.map((ev) => (
                  <option key={ev._id} value={ev._id}>
                    {ev.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div>
              <label htmlFor="modal-start" className="block text-sm font-medium text-slate-700 mb-1.5">
                Start Time
              </label>
              <input
                id="modal-start"
                type="time"
                value={form.startTime}
                onChange={(e) => setForm((p) => ({ ...p, startTime: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 transition-all bg-white"
                required
              />
            </div>
            <div>
              <label htmlFor="modal-end" className="block text-sm font-medium text-slate-700 mb-1.5">
                End Time
              </label>
              <input
                id="modal-end"
                type="time"
                value={form.endTime}
                onChange={(e) => setForm((p) => ({ ...p, endTime: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 transition-all bg-white"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="modal-purpose" className="block text-sm font-medium text-slate-700 mb-1.5">
              Purpose
            </label>
            <textarea
              id="modal-purpose"
              value={form.purpose}
              onChange={(e) => setForm((p) => ({ ...p, purpose: e.target.value }))}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm min-h-[80px] focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 transition-all"
              placeholder="Briefly describe what the room will be used for..."
            />
          </div>
        </div>

        {clashWarning && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 animate-pulse">
            <div className="font-semibold flex items-center gap-2">
              <AlertCircle className="h-5 w-5" /> Overlapping Booking Detected
            </div>
            <div className="mt-2 text-rose-700">
              This slot conflicts with <span className="font-semibold">{clashWarning.room?.name || "an existing booking"}</span> from{" "}
              <span className="font-mono">{formatDateTime(clashWarning.startTime)}</span> to{" "}
              <span className="font-mono">{formatDateTime(clashWarning.endTime)}</span>.
              {clashWarning.bookedBy && (
                <div className="mt-1">
                  Booked by: <span className="font-medium">{clashWarning.bookedBy.personal_info?.name || clashWarning.bookedBy.username || "—"}</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="pt-2">
           <button
            type="submit"
            disabled={!canBook || submitting || rooms.length === 0}
            className="w-full flex justify-center items-center rounded-xl bg-slate-800 px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-700 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {submitting ? "Submitting Request..." : "Submit Booking Request"}
          </button>
        </div>
        {!canBook && (
          <p className="text-xs text-slate-500 text-center mt-2">
            You do not have permission to create room bookings.
          </p>
        )}
      </form>
    </Modal>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const RoomBooking = () => {
  const { isUserLoggedIn } = useContext(AdminContext);
  const userRole = isUserLoggedIn?.role || "STUDENT";
  const username = isUserLoggedIn?.username || "";
  const userId = isUserLoggedIn?._id;

  const canBook = ADMIN_ROLES.includes(userRole);
  const canApprove = userRole === APPROVAL_UI_ROLE;
  const showMyRequests = canBook && !canApprove;

  const [rooms, setRooms] = useState([]);
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submittingBooking, setSubmittingBooking] = useState(false);
  const [creatingRoom, setCreatingRoom] = useState(false);

  const [activeTab, setActiveTab] = useState("availability");
  
  // Admin internal tab
  const [adminView, setAdminView] = useState("pending"); // "pending" | "history"

  // Modals
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingModalInitial, setBookingModalInitial] = useState(null);
  const [createRoomModalOpen, setCreateRoomModalOpen] = useState(false);
  const [rejectionTarget, setRejectionTarget] = useState(null);

  const [filters, setFilters] = useState({
    roomId: "",
    date: toDateInput(new Date()),
    status: "",
    minCapacity: "",
    amenities: [],
  });

  const fetchEvents = useCallback(async () => {
    if (!userRole || userRole === "STUDENT") return [];
    let url = `/api/events/by-role/${userRole}`;
    if (userRole === "CLUB_COORDINATOR" && username) {
      url += `?username=${encodeURIComponent(username)}`;
    }
    const res = await api.get(url);
    return res.data || [];
  }, [userRole, username]);

  const fetchRooms = async () => {
    const res = await api.get("/api/rooms/rooms");
    return res.data || [];
  };

  const fetchBookings = async () => {
    const res = await api.get("/api/rooms/bookings");
    return res.data || [];
  };

  const refreshData = async () => {
    try {
      const [roomsData, bookingsData, eventsData] = await Promise.all([
        fetchRooms(),
        fetchBookings(),
        fetchEvents(),
      ]);
      setRooms(roomsData);
      setBookings(bookingsData);
      setEvents(eventsData);

      if (!filters.roomId && roomsData.length > 0) {
        setFilters((prev) => ({ ...prev, roomId: roomsData[0]._id }));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to refresh data.");
    }
  };

  useEffect(() => {
    const initialize = async () => {
      try {
        setLoading(true);
        const [roomsData, eventsData, bookingsData] = await Promise.all([
          fetchRooms(),
          fetchEvents(),
          fetchBookings(),
        ]);
        setRooms(roomsData);
        setEvents(eventsData);
        setBookings(bookingsData);
        if (roomsData.length > 0) {
          setFilters((prev) => ({ ...prev, roomId: roomsData[0]._id }));
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load data.");
      } finally {
        setLoading(false);
      }
    };
    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userRole, username]);

  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      if (filters.minCapacity && room.capacity < Number(filters.minCapacity)) return false;
      if (
        filters.amenities.length > 0 &&
        !filters.amenities.every((a) => room.amenities?.includes(a))
      )
        return false;
      return true;
    });
  }, [rooms, filters.minCapacity, filters.amenities]);

  const availabilityBookings = useMemo(() => {
    return bookings.filter((b) => {
      if (!filters.roomId || b.room?._id !== filters.roomId) return false;
      if (!["Pending", "Approved"].includes(b.status)) return false;
      return sameDay(b.startTime, filters.date);
    });
  }, [bookings, filters.roomId, filters.date]);

  const [timelineClashId, setTimelineClashId] = useState(null);

  const upcomingByDate = useMemo(() => {
    if (!filters.roomId) return {};
    const todayStart = getTodayStart();
    return bookings
      .filter((b) => {
        if (b.room?._id !== filters.roomId) return false;
        if (!["Pending", "Approved"].includes(b.status)) return false;
        return new Date(b.startTime) >= todayStart;
      })
      .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
      .reduce((acc, b) => {
        const key = toDateInput(new Date(b.startTime));
        if (!acc[key]) acc[key] = [];
        acc[key].push(b);
        return acc;
      }, {});
  }, [bookings, filters.roomId]);

  const myRequests = useMemo(() => {
    return bookings
      .filter((b) => String(b.bookedBy?._id || b.bookedBy) === String(userId))
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }, [bookings, userId]);

  const pendingForApproval = useMemo(() => {
    return bookings
      .filter((b) => b.status === "Pending")
      .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  }, [bookings]);

  const approvalHistory = useMemo(() => {
    return bookings
      .filter((b) => ["Approved", "Rejected", "Cancelled"].includes(b.status))
      .sort((a, b) => new Date(b.updated_at || b.created_at) - new Date(a.updated_at || a.created_at));
  }, [bookings]);

  const selectedRoom = useMemo(
    () => rooms.find((r) => r._id === filters.roomId),
    [rooms, filters.roomId]
  );

  const handleCreateRoom = async (formData) => {
    try {
      setCreatingRoom(true);
      await api.post("/api/rooms/create-room", {
        name: formData.name.trim(),
        capacity: Number(formData.capacity),
        location: formData.location.trim(),
        amenities: formData.amenities,
      });
      setCreateRoomModalOpen(false);
      toast.success("Room created successfully.");
      await refreshData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create room.");
    } finally {
      setCreatingRoom(false);
    }
  };

  const handleSubmitBooking = async (form) => {
    const start = combineDateTime(form.date, form.startTime);
    const end = combineDateTime(form.date, form.endTime);
    try {
      setSubmittingBooking(true);
      const payload = {
        roomId: form.roomId,
        date: new Date(`${form.date}T00:00:00`),
        startTime: start,
        endTime: end,
        purpose: form.purpose.trim(),
      };
      if (form.eventId) payload.eventId = form.eventId;
      await api.post("/api/rooms/book", payload);
      toast.success("Room booking request submitted.");
      setBookingModalOpen(false);
      setBookingModalInitial(null);
      setFilters((prev) => ({ ...prev, roomId: form.roomId, date: form.date }));
      const bookingsData = await fetchBookings();
      setBookings(bookingsData);
      setActiveTab("availability");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit booking.");
    } finally {
      setSubmittingBooking(false);
    }
  };

  const handleApproveBooking = async (bookingId) => {
    try {
      await api.put(`/api/rooms/bookings/${bookingId}/status`, { status: "Approved" });
      setBookings(await fetchBookings());
      toast.success("Booking approved.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to approve booking.");
    }
  };

  const openRejectionModal = (bookingId) => setRejectionTarget(bookingId);

  const handleConfirmRejection = async (reason) => {
    if (!rejectionTarget) return;
    try {
      await api.put(`/api/rooms/bookings/${rejectionTarget}/status`, {
        status: "Rejected",
        ...(reason ? { rejectionReason: reason } : {}),
      });
      setBookings(await fetchBookings());
      toast.success("Booking rejected.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reject booking.");
    } finally {
      setRejectionTarget(null);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      await api.delete(`/api/rooms/bookings/${bookingId}`);
      setBookings(await fetchBookings());
      toast.success("Booking cancelled.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel booking.");
    }
  };

  const handleSlotSelect = useCallback(
    (startTime, endTime) => {
      if (!canBook) return;
      setBookingModalInitial({
        roomId: filters.roomId || rooms[0]?._id || "",
        date: filters.date,
        startTime,
        endTime,
        eventId: "",
        purpose: "",
      });
      setBookingModalOpen(true);
    },
    [canBook, filters.roomId, filters.date, rooms]
  );

  const toggleFilterAmenity = (amenity) =>
    setFilters((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));

  if (loading) {
    return (
      <div className="h-full rounded-2xl bg-white p-8 shadow-sm border border-slate-200">
        <div className="flex items-center justify-center h-64">
          <div className="h-12 w-12 rounded-full border-4 border-slate-100 border-t-slate-700 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <>
      <BookingModal
        open={bookingModalOpen}
        onClose={() => { setBookingModalOpen(false); setBookingModalInitial(null); }}
        rooms={filteredRooms.length > 0 ? filteredRooms : rooms}
        events={events}
        bookings={bookings}
        canBook={canBook}
        onSubmit={handleSubmitBooking}
        submitting={submittingBooking}
        initialData={bookingModalInitial}
        onClashChange={setTimelineClashId}
      />

      <CreateRoomModal
        open={createRoomModalOpen}
        onClose={() => setCreateRoomModalOpen(false)}
        onSubmit={handleCreateRoom}
        submitting={creatingRoom}
      />

      <RejectionModal
        open={!!rejectionTarget}
        onClose={() => setRejectionTarget(null)}
        onConfirm={handleConfirmRejection}
      />

      <div className="p-4 md:p-6 space-y-4 max-w-7xl mx-auto">
        
        {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-2">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Smart Room Booking</h2>
            <p className="text-slate-500 mt-2 max-w-xl">
              Drag the timeline to select an empty slot and reserve a room instantly. Filter by capacity or amenities to find your perfect space.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {canBook && (
  <button
    onClick={() => { setBookingModalInitial(null); setBookingModalOpen(true); }}
    className="inline-flex items-center gap-1.5 text-sm font-medium text-black"
  >
    <Plus className="h-4 w-4" /> Request Room
  </button>
)}

{userRole === "PRESIDENT" && (
  <button
    onClick={() => setCreateRoomModalOpen(true)}
    className="inline-flex items-center gap-1.5 rounded-xl text-sm font-medium text-black ml-2"
  >
    <Plus className="h-4 w-4" /> Add Room
  </button>
)}
            <button
              onClick={refreshData}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition shadow-sm ml-2"
              aria-label="Refresh Data"
            >
              <RefreshCcw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="bg-slate-100/70 p-1.5 rounded-xl inline-flex flex-wrap gap-1">
          <button className={tabStyle(activeTab === "availability")} onClick={() => setActiveTab("availability")}>
            Availability & Booking
          </button>
          {canApprove && (
            <button className={tabStyle(activeTab === "approvals")} onClick={() => setActiveTab("approvals")}>
              Admin / Approvals{" "}
              {pendingForApproval.length > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center h-5 w-5 rounded-full bg-rose-500 text-white text-[11px] font-bold shadow-sm">
                  {pendingForApproval.length}
                </span>
              )}
            </button>
          )}
          {showMyRequests && (
            <button className={tabStyle(activeTab === "myRequests")} onClick={() => setActiveTab("myRequests")}>
              My Requests
            </button>
          )}
        </div>

        {/* ── Availability Tab ── */}
        {activeTab === "availability" && (
          <div className="space-y-4 animate-in fade-in duration-300">
            {/* Filters Box */}
            <div className="rounded-2xl border border-slate-200 p-3 space-y-4 bg-white shadow-sm">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-800 uppercase tracking-wider mb-2">
                <Filter className="h-4 w-4 text-slate-600" /> Filter Spaces
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                <div className="md:col-span-2">
                  <label htmlFor="filter-room" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Select Room
                  </label>
                  <select
                    id="filter-room"
                    value={filters.roomId}
                    onChange={(e) => setFilters((p) => ({ ...p, roomId: e.target.value }))}
                    className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 transition-all bg-white"
                  >
                    {filteredRooms.map((room) => (
                      <option key={room._id} value={room._id}>
                        {room.name} ({room.capacity} seats)
                      </option>
                    ))}
                    {filteredRooms.length === 0 && <option value="">No rooms match filters</option>}
                  </select>
                </div>
                <div>
                  <label htmlFor="filter-date" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Date
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const d = new Date(filters.date);
                        d.setDate(d.getDate() - 1);
                        if (d >= getTodayStart()) setFilters((p) => ({ ...p, date: toDateInput(d) }));
                      }}
                      className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 hover:bg-slate-50 transition shadow-sm"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <input
                      id="filter-date"
                      type="date"
                      value={filters.date}
                      min={toDateInput(new Date())}
                      onChange={(e) => setFilters((p) => ({ ...p, date: e.target.value }))}
                      className="flex-1 w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 transition-all bg-white"
                    />
                    <button
                      onClick={() => {
                        const d = new Date(filters.date);
                        d.setDate(d.getDate() + 1);
                        setFilters((p) => ({ ...p, date: toDateInput(d) }));
                      }}
                      className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 hover:bg-slate-50 transition shadow-sm"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div>
                  <label htmlFor="filter-capacity" className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-1.5">
                     Minimum Capacity
                  </label>
                  <input
                    id="filter-capacity"
                    type="number"
                    min="0"
                    placeholder="e.g., 20"
                    value={filters.minCapacity}
                    onChange={(e) => setFilters((p) => ({ ...p, minCapacity: e.target.value }))}
                    className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 transition-all bg-white"
                  />
                </div>
              </div>
              
              {/* Amenities Toggles */}
              <div className="pt-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-slate-700 mr-2">Amenities required:</span>
                  {PRESET_AMENITIES.map((amenity) => {
                    const active = filters.amenities.includes(amenity);
                    return (
                      <button
                        key={amenity}
                        type="button"
                        onClick={() => toggleFilterAmenity(amenity)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                          active
                            ? "bg-slate-800 text-white border-slate-800 shadow-sm"
                            : "bg-white text-slate-600 border-slate-200 hover:border-slate-400 hover:bg-slate-50"
                        }`}
                      >
                        {amenity}
                      </button>
                    );
                  })}
                  {filters.amenities.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setFilters((p) => ({ ...p, amenities: [] }))}
                      className="px-3 py-1.5 rounded-full text-xs font-medium text-slate-500 hover:text-slate-800 underline transition ml-1"
                    >
                      Clear All
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Room Details Strip */}
            {selectedRoom && (
              <div className="flex flex-wrap items-center gap-4 bg-slate-50 border border-slate-200 px-5 py-3 rounded-xl shadow-sm">
                <span className="font-bold text-slate-900 text-lg">{selectedRoom.name}</span>
                <div className="h-4 w-px bg-slate-300 hidden md:block"></div>
                <span className="flex items-center gap-1.5 text-sm text-slate-600 font-medium">
                  <MapPin className="h-4 w-4 text-slate-400" /> {selectedRoom.location}
                </span>
                <span className="flex items-center gap-1.5 text-sm text-slate-600 font-medium">
                  <Users className="h-4 w-4 text-slate-400" /> {selectedRoom.capacity} Seats
                </span>
                {selectedRoom.amenities?.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap ml-auto">
                    {selectedRoom.amenities.map((a) => (
                      <span key={a} className="bg-white text-slate-600 text-xs font-medium px-2.5 py-1 rounded-md border border-slate-200 shadow-sm">
                        {a}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── Timeline Section ── */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Clock3 className="h-5 w-5 text-slate-600" />
                  Daily Timeline — {formatDate(filters.date)}
                </h3>
                {canBook && (
                  <span className="text-sm font-medium text-slate-700 bg-slate-100 px-3 py-1 rounded-full hidden sm:block">
                    Drag empty slots to book
                  </span>
                )}
              </div>
              <DragTimeline
                bookings={availabilityBookings}
                date={filters.date}
                onSlotSelect={handleSlotSelect}
                clashBookingId={timelineClashId}
              />
              <div className="flex flex-wrap items-center gap-5 text-sm text-slate-600 pt-2 px-1 font-medium">
                <span className="flex items-center gap-2">
                  <span className="inline-block w-4 h-4 rounded-md bg-stone-100 border border-stone-300 shadow-sm" /> Approved Bookings
                </span>
                <span className="flex items-center gap-2">
                  <span className="inline-block w-4 h-4 rounded-md bg-amber-100 border border-amber-300 shadow-sm" /> Pending Approval
                </span>
                <span className="flex items-center gap-2">
                  <span className="inline-block w-4 h-4 rounded-md bg-slate-50 border border-slate-200 shadow-sm" /> Available
                </span>
              </div>
            </div>

            {/* ── Upcoming Details Grid ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
              
              {/* Daily List */}
              <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm flex flex-col">
                <div className="bg-slate-50 px-5 py-4 border-b border-slate-200">
                  <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                    <Search className="h-4 w-4 text-slate-500" /> Selected Day Details
                  </h3>
                </div>
                <div className="flex-1 p-0 overflow-y-auto max-h-[360px]">
                  {availabilityBookings.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full py-12 text-center text-slate-500">
                      <CalendarDays className="h-10 w-10 text-slate-300 mb-3" />
                      <p className="text-sm">No bookings scheduled for this day.</p>
                    </div>
                  ) : (
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50/50 sticky top-0 z-10 backdrop-blur-sm">
                        <tr className="text-left text-xs uppercase tracking-wider font-semibold text-slate-500 border-b border-slate-100">
                          <th className="px-4 py-2.5">Time</th>
                          <th className="px-4 py-2.5">Details & User</th>
                          <th className="px-4 py-2.5">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {availabilityBookings.map((b) => (
                          <tr key={b._id} className="hover:bg-slate-50/80 transition group">
                            <td className="px-4 py-2.5 whitespace-nowrap text-slate-700 font-mono text-xs font-medium">
                              {formatTime(b.startTime)}
                              <span className="text-slate-300 mx-1">-</span>
                              {formatTime(b.endTime)}
                            </td>
                            <td className="px-4 py-2.5">
                              <div className="font-medium text-slate-900">{b.event?.title || b.purpose || "General booking"}</div>
                              <div className="text-xs text-slate-500 mt-0.5">{b.bookedBy?.personal_info?.name || b.bookedBy?.username || "—"}</div>
                            </td>
                            <td className="px-4 py-2.5">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusStyleMap[b.status] || "bg-slate-100 text-slate-700 border-slate-200"}`}>
                                {b.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

              {/* Future Bookings Box */}
              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col">
                <div className="bg-slate-50 px-5 py-4 border-b border-slate-200">
                  <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-slate-500" /> Future Schedule
                  </h3>
                </div>
                <div className="flex-1 p-5 overflow-y-auto max-h-[360px]">
                   {Object.keys(upcomingByDate).length === 0 ? (
                    <div className="text-center text-sm text-slate-500 py-8">
                      No future bookings found for this room.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {Object.keys(upcomingByDate).sort().slice(0, 5).map((dateKey) => (
                        <div key={dateKey} className="relative">
                          <div className="sticky top-0 bg-white/95 backdrop-blur z-10 pb-2 mb-2 font-semibold text-slate-800 text-sm border-b border-slate-100">
                            {formatDate(dateKey)}
                          </div>
                          <div className="space-y-3">
                            {upcomingByDate[dateKey].map((b) => (
                              <div key={b._id} className="flex gap-4 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-300 transition group">
                                <div className="flex flex-col text-xs font-mono font-medium text-slate-500 min-w-[70px]">
                                  <span>{formatTime(b.startTime)}</span>
                                  <span className="text-slate-300 leading-[4px]">|</span>
                                  <span>{formatTime(b.endTime)}</span>
                                </div>
                                <div>
                                  <div className="text-sm font-semibold text-slate-900 mb-0.5 group-hover:text-slate-900 transition">
                                    {b.event?.title || b.purpose || "General booking"}
                                  </div>
                                  <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <span className={`px-1.5 py-0.5 rounded border ${statusStyleMap[b.status]}`}>
                                      {b.status}
                                    </span>
                                    <span>· {b.bookedBy?.personal_info?.name || b.bookedBy?.username || "—"}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
            </div>
          </div>
        )}

        {/* ── Admin Approvals Tab ── */}
        {activeTab === "approvals" && canApprove && (
          <div className="space-y-6 animate-in fade-in duration-300">
             
             {/* Sub navigation for Admin */}
             <div className="flex border-b border-slate-200">
                <button
                  onClick={() => setAdminView("pending")}
                  className={`py-3 px-6 text-sm font-semibold uppercase tracking-wider transition-colors ${
                    adminView === "pending" ? "border-b-2 border-blue-600 text-slate-900" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Pending Requests
                </button>
                <button
                  onClick={() => setAdminView("history")}
                  className={`py-3 px-6 text-sm font-semibold uppercase tracking-wider transition-colors ${
                    adminView === "history" ? "border-b-2 border-blue-600 text-slate-900" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Decision History
                </button>
             </div>

            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                  <thead className="bg-slate-50">
                    <tr className="text-left text-xs uppercase tracking-wider font-semibold text-slate-500">
                      <th className="px-4 py-2.5">Room & Time</th>
                      <th className="px-6 py-2.5">Requester</th>
                      <th className="px-6 py-2.5">Event Details</th>
                      {adminView === "history" && <th className="px-6 py-2.5">Status</th>}
                      {adminView === "pending" && <th className="px-6 py-2.5 text-right">Actions</th>}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-100">
                    {adminView === "pending" ? (
                      pendingForApproval.length === 0 ? (
                        <tr><td colSpan="4" className="px-6 py-12 text-center text-slate-500">All caught up! No pending requests.</td></tr>
                      ) : (
                        pendingForApproval.map((b) => (
                          <tr key={b._id} className="hover:bg-slate-50 transition align-top">
                            <td className="px-4 py-2.5">
                              <div className="font-bold text-slate-900">{b.room?.name || "—"}</div>
                              <div className="text-xs text-slate-500 mt-1">{formatDate(b.startTime)}</div>
                              <div className="font-mono text-xs font-medium text-slate-600 mt-0.5">
                                {formatTime(b.startTime)} - {formatTime(b.endTime)}
                              </div>
                            </td>
                            <td className="px-4 py-2.5 font-medium text-slate-800">
                              {b.bookedBy?.personal_info?.name || b.bookedBy?.username || "—"}
                            </td>
                            <td className="px-4 py-2.5 text-slate-600 max-w-xs">
                              {b.event?.title || b.purpose || "General booking"}
                            </td>
                            <td className="px-4 py-2.5 text-right whitespace-nowrap">
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => handleApproveBooking(b._id)}
                                  className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-800 hover:text-white transition border border-slate-200 hover:border-slate-800"
                                >
                                  <CheckCircle2 className="h-4 w-4" /> Approve
                                </button>
                                <button
                                  onClick={() => openRejectionModal(b._id)}
                                  className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-600 hover:text-white transition border border-rose-200 hover:border-rose-600"
                                >
                                  <XCircle className="h-4 w-4" /> Reject
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )
                    ) : (
                      approvalHistory.length === 0 ? (
                        <tr><td colSpan="4" className="px-6 py-12 text-center text-slate-500">No past decisions found.</td></tr>
                      ) : (
                        approvalHistory.map((b) => (
                           <tr key={b._id} className="hover:bg-slate-50 transition align-top">
                            <td className="px-4 py-2.5">
                              <div className="font-bold text-slate-900">{b.room?.name || "—"}</div>
                              <div className="text-xs text-slate-500 mt-1">{formatDate(b.startTime)}</div>
                              <div className="font-mono text-xs font-medium text-slate-600 mt-0.5">
                                {formatTime(b.startTime)} - {formatTime(b.endTime)}
                              </div>
                            </td>
                            <td className="px-4 py-2.5 font-medium text-slate-800">
                              {b.bookedBy?.personal_info?.name || b.bookedBy?.username || "—"}
                            </td>
                            <td className="px-4 py-2.5 text-slate-600 max-w-xs">
                              {b.event?.title || b.purpose || "General booking"}
                            </td>
                            <td className="px-4 py-2.5 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusStyleMap[b.status]}`}>
                                {b.status}
                              </span>
                              <div className="text-[10px] text-slate-400 mt-1">
                                Modified: {new Date(b.updated_at || b.created_at).toLocaleDateString()}
                              </div>
                            </td>
                          </tr>
                        ))
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── My Requests Tab ── */}
        {activeTab === "myRequests" && showMyRequests && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <History className="h-5 w-5 text-slate-400" /> My Booking History
              </h3>
              <div className="flex items-center gap-3">
                 <label className="text-sm font-medium text-slate-500">Filter Status:</label>
                 <select
                  value={filters.status}
                  onChange={(e) => setFilters((p) => ({ ...p, status: e.target.value }))}
                  className="rounded-xl border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500/20 bg-white shadow-sm"
                >
                  <option value="">All Requests</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            
            <div className="rounded-xl border border-slate-200 overflow-hidden">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50">
                  <tr className="text-left text-xs uppercase tracking-wider font-semibold text-slate-500">
                    <th className="px-4 py-2.5">Room & Time</th>
                    <th className="px-4 py-2.5">Purpose</th>
                    <th className="px-4 py-2.5">Status</th>
                    <th className="px-4 py-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                  {myRequests.filter((b) => !filters.status || b.status === filters.status).length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-12 text-center text-slate-500">
                        No requests match the current filters.
                      </td>
                    </tr>
                  ) : (
                    myRequests
                      .filter((b) => !filters.status || b.status === filters.status)
                      .map((b) => {
                        const canCancel = !["Cancelled", "Rejected"].includes(b.status);
                        return (
                          <tr key={b._id} className="hover:bg-slate-50 transition align-top">
                            <td className="px-4 py-2.5">
                              <div className="font-bold text-slate-900">{b.room?.name || "—"}</div>
                              <div className="text-xs text-slate-500 mt-1">{formatDate(b.startTime)}</div>
                              <div className="font-mono text-xs font-medium text-slate-600 mt-0.5">
                                {formatTime(b.startTime)} - {formatTime(b.endTime)}
                              </div>
                            </td>
                            <td className="px-4 py-2.5 text-slate-700 max-w-sm">
                              {b.event?.title || b.purpose || "General booking"}
                            </td>
                            <td className="px-4 py-2.5 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusStyleMap[b.status] || "bg-slate-100 text-slate-700 border-slate-200"}`}>
                                {b.status}
                              </span>
                            </td>
                            <td className="px-4 py-2.5 text-right whitespace-nowrap">
                              {canCancel ? (
                                <button
                                  onClick={() => handleCancelBooking(b._id)}
                                  className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition shadow-sm"
                                >
                                  Cancel Request
                                </button>
                              ) : (
                                <span className="text-xs text-slate-400 italic px-2">Locked</span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Read-only notice */}
        {!canBook && (
          <div className="rounded-xl border border-amber-200 bg-amber-50/80 px-5 py-4 text-sm text-amber-800 flex items-start gap-3 shadow-sm">
            <AlertCircle className="h-5 w-5 shrink-0 text-amber-600" />
            <div>
              <p className="font-semibold text-amber-900">Read-Only Mode</p>
              <p className="mt-0.5 opacity-90">Your current account role restricts booking creation. Contact a club coordinator or administrator if you need to reserve space.</p>
            </div>
          </div>
        )}

      </div>
    </>
  );
};

export default RoomBooking;
