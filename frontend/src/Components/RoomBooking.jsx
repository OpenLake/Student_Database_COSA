import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  Plus,
  RefreshCcw,
  Search,
  X,
  XCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import { AdminContext } from "../context/AdminContext";
import api from "../utils/api";

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

const formatDateTime = (value) =>
  new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const formatDate = (value) =>
  new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
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
  if (!["Pending", "Approved"].includes(existingBooking.status)) {
    return false;
  }

  const existingStart = new Date(existingBooking.startTime);
  const existingEnd = new Date(existingBooking.endTime);

  return existingStart < endTime && existingEnd > startTime;
};

const statusStyleMap = {
  Pending: "bg-amber-100 text-amber-800",
  Approved: "bg-emerald-100 text-emerald-800",
  Rejected: "bg-rose-100 text-rose-800",
  Cancelled: "bg-slate-200 text-slate-700",
};

const tabStyle = (isActive) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive
      ? "bg-slate-900 text-white"
      : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-100"
  }`;

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

  const [showRoomForm, setShowRoomForm] = useState(false);
  const [activeTab, setActiveTab] = useState("request");

  const [roomForm, setRoomForm] = useState({
    name: "",
    capacity: "",
    location: "",
    amenities: [],
    customAmenity: "",
  });

  const [filters, setFilters] = useState({
    roomId: "",
    date: toDateInput(new Date()),
    status: "",
  });

  const [bookingForm, setBookingForm] = useState({
    roomId: "",
    eventId: "",
    date: toDateInput(new Date()),
    startTime: "10:00",
    endTime: "11:00",
    purpose: "",
  });

  const fetchRooms = async () => {
    const response = await api.get("/api/rooms/rooms");
    return response.data || [];
  };

  const fetchBookings = async () => {
    const response = await api.get("/api/rooms/bookings");
    return response.data || [];
  };

  const refreshData = async () => {
    try {
      const [roomsData, bookingsData] = await Promise.all([
        fetchRooms(),
        fetchBookings(),
      ]);

      setRooms(roomsData);
      setBookings(bookingsData);

      if (!filters.roomId && roomsData.length > 0) {
        setFilters((prev) => ({ ...prev, roomId: roomsData[0]._id }));
      }
      if (!bookingForm.roomId && roomsData.length > 0) {
        setBookingForm((prev) => ({ ...prev, roomId: roomsData[0]._id }));
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to refresh room bookings.",
      );
    }
  };

  useEffect(() => {
    const initialize = async () => {
      try {
        setLoading(true);

        let eventsRequest = Promise.resolve([]);
        if (userRole && userRole !== "STUDENT") {
          let eventsUrl = `/api/events/by-role/${userRole}`;
          if (userRole === "CLUB_COORDINATOR" && username) {
            eventsUrl += `?username=${encodeURIComponent(username)}`;
          }
          eventsRequest = api
            .get(eventsUrl)
            .then((response) => response.data || []);
        }

        const [roomsData, eventsData, bookingsData] = await Promise.all([
          fetchRooms(),
          eventsRequest,
          fetchBookings(),
        ]);

        setRooms(roomsData);
        setEvents(eventsData);
        setBookings(bookingsData);

        if (roomsData.length > 0) {
          setFilters((prev) => ({ ...prev, roomId: roomsData[0]._id }));
          setBookingForm((prev) => ({ ...prev, roomId: roomsData[0]._id }));
        }
      } catch (err) {
        toast.error(
          err.response?.data?.message ||
            "Failed to load room booking data. Please refresh.",
        );
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, [userRole, username]);

  const selectedRoomName = useMemo(() => {
    const selectedRoom = rooms.find((room) => room._id === filters.roomId);
    return selectedRoom?.name || "Selected room";
  }, [rooms, filters.roomId]);

  const availabilityBookings = useMemo(() => {
    return bookings
      .filter((booking) => {
        if (!filters.roomId || booking.room?._id !== filters.roomId) return false;
        if (!["Pending", "Approved"].includes(booking.status)) return false;
        return sameDay(booking.startTime, filters.date);
      })
      .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  }, [bookings, filters.roomId, filters.date]);

  const upcomingByDate = useMemo(() => {
    if (!filters.roomId) return {};
    const todayStart = getTodayStart();

    const grouped = bookings
      .filter((booking) => {
        if (booking.room?._id !== filters.roomId) return false;
        if (!["Pending", "Approved"].includes(booking.status)) return false;
        return new Date(booking.startTime) >= todayStart;
      })
      .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
      .reduce((acc, booking) => {
        const key = toDateInput(new Date(booking.startTime));
        if (!acc[key]) acc[key] = [];
        acc[key].push(booking);
        return acc;
      }, {});

    return grouped;
  }, [bookings, filters.roomId]);

  const clashWarning = useMemo(() => {
    if (
      !bookingForm.roomId ||
      !bookingForm.date ||
      !bookingForm.startTime ||
      !bookingForm.endTime
    ) {
      return null;
    }

    const start = combineDateTime(bookingForm.date, bookingForm.startTime);
    const end = combineDateTime(bookingForm.date, bookingForm.endTime);
    if (end <= start) return null;

    return bookings.find((booking) => {
      if (booking.room?._id !== bookingForm.roomId) return false;
      if (!sameDay(booking.startTime, bookingForm.date)) return false;
      return isClashing(booking, start, end);
    });
  }, [bookings, bookingForm]);

  const myRequests = useMemo(() => {
    return bookings
      .filter((booking) =>
        String(booking.bookedBy?._id || booking.bookedBy) === String(userId),
      )
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }, [bookings, userId]);

  const pendingForApproval = useMemo(() => {
    return bookings
      .filter((booking) => booking.status === "Pending")
      .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  }, [bookings]);

  const timeSlots = useMemo(() => {
    const slots = [];
    for (let hour = 8; hour <= 21; hour += 1) {
      const label = `${String(hour).padStart(2, "0")}:00 - ${String(hour + 1).padStart(2, "0")}:00`;
      const slotStart = combineDateTime(filters.date, `${String(hour).padStart(2, "0")}:00`);
      const slotEnd = combineDateTime(filters.date, `${String(hour + 1).padStart(2, "0")}:00`);

      const booking = availabilityBookings.find((entry) =>
        isClashing(entry, slotStart, slotEnd),
      );

      slots.push({ label, booking });
    }
    return slots;
  }, [availabilityBookings, filters.date]);

  const addAmenityChip = () => {
    const value = roomForm.customAmenity.trim();
    if (!value) return;

    if (roomForm.amenities.some((amenity) => amenity.toLowerCase() === value.toLowerCase())) {
      toast.info("Amenity already added.");
      return;
    }

    setRoomForm((prev) => ({
      ...prev,
      amenities: [...prev.amenities, value],
      customAmenity: "",
    }));
  };

  const toggleAmenity = (amenity) => {
    setRoomForm((prev) => {
      const exists = prev.amenities.includes(amenity);
      return {
        ...prev,
        amenities: exists
          ? prev.amenities.filter((item) => item !== amenity)
          : [...prev.amenities, amenity],
      };
    });
  };

  const removeAmenity = (amenity) => {
    setRoomForm((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((item) => item !== amenity),
    }));
  };

  const handleCreateRoom = async (event) => {
    event.preventDefault();

    try {
      setCreatingRoom(true);

      await api.post("/api/rooms/create-room", {
        name: roomForm.name.trim(),
        capacity: Number(roomForm.capacity),
        location: roomForm.location.trim(),
        amenities: roomForm.amenities,
      });

      setRoomForm({
        name: "",
        capacity: "",
        location: "",
        amenities: [],
        customAmenity: "",
      });
      setShowRoomForm(false);
      toast.success("Room created successfully.");
      await refreshData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create room.");
    } finally {
      setCreatingRoom(false);
    }
  };

  const handleSubmitBooking = async (event) => {
    event.preventDefault();

    if (!bookingForm.roomId) {
      toast.error("Please select a room.");
      return;
    }

    const start = combineDateTime(bookingForm.date, bookingForm.startTime);
    const end = combineDateTime(bookingForm.date, bookingForm.endTime);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      toast.error("Please enter valid booking date and time.");
      return;
    }

    if (end <= start) {
      toast.error("End time must be after start time.");
      return;
    }

    if (start < new Date()) {
      toast.error("You cannot submit a booking request for past date/time.");
      return;
    }

    if (clashWarning) {
      toast.error("This slot overlaps with an existing booking.");
      return;
    }

    try {
      setSubmittingBooking(true);

      const payload = {
        roomId: bookingForm.roomId,
        date: new Date(`${bookingForm.date}T00:00:00`),
        startTime: start,
        endTime: end,
        purpose: bookingForm.purpose.trim(),
      };

      if (bookingForm.eventId) {
        payload.eventId = bookingForm.eventId;
      }

      await api.post("/api/rooms/book", payload);

      toast.success("Room booking request submitted successfully.");
      setFilters((prev) => ({
        ...prev,
        roomId: bookingForm.roomId,
        date: bookingForm.date,
      }));
      setBookingForm((prev) => ({
        ...prev,
        eventId: "",
        purpose: "",
      }));

      const bookingsData = await fetchBookings();
      setBookings(bookingsData);
      setActiveTab(showMyRequests ? "myRequests" : "availability");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit booking.");
    } finally {
      setSubmittingBooking(false);
    }
  };

  const handleReviewBooking = async (bookingId, status) => {
    try {
      await api.put(`/api/rooms/bookings/${bookingId}/status`, { status });

      const bookingsData = await fetchBookings();
      setBookings(bookingsData);
      toast.success(`Booking ${status.toLowerCase()} successfully.`);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to update booking status.",
      );
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      await api.delete(`/api/rooms/bookings/${bookingId}`);

      const bookingsData = await fetchBookings();
      setBookings(bookingsData);
      toast.success("Booking cancelled successfully.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel booking.");
    }
  };

  if (loading) {
    return (
      <div className="h-full rounded-2xl bg-white p-6 border border-slate-200">
        <div className="flex items-center justify-center h-56">
          <div className="h-10 w-10 rounded-full border-4 border-slate-200 border-t-slate-700 animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full rounded-2xl bg-white border border-slate-200 p-6 space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">
            Smart Room Booking
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Request rooms, explore day-wise room timelines, and manage your
            bookings in one place.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {canBook && (
            <button
              onClick={() => setShowRoomForm((prev) => !prev)}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              <Plus className="h-4 w-4" />
              {showRoomForm ? "Hide Room Form" : "Add Room"}
            </button>
          )}
          <button
            onClick={refreshData}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700"
          >
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      {showRoomForm && canBook && (
        <form
          onSubmit={handleCreateRoom}
          className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-4"
        >
          <h3 className="text-base font-semibold text-slate-900">Create New Room</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="Room name (e.g., LH-101)"
              value={roomForm.name}
              onChange={(event) =>
                setRoomForm((prev) => ({ ...prev, name: event.target.value }))
              }
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
              required
            />
            <input
              type="number"
              min="1"
              placeholder="Capacity"
              value={roomForm.capacity}
              onChange={(event) =>
                setRoomForm((prev) => ({ ...prev, capacity: event.target.value }))
              }
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
              required
            />
            <input
              type="text"
              placeholder="Location"
              value={roomForm.location}
              onChange={(event) =>
                setRoomForm((prev) => ({ ...prev, location: event.target.value }))
              }
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-600">
              Amenities (click to add/remove)
            </label>
            <div className="flex flex-wrap gap-2">
              {PRESET_AMENITIES.map((amenity) => {
                const selected = roomForm.amenities.includes(amenity);
                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className={`px-2.5 py-1 rounded-full text-xs border ${
                      selected
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-white text-slate-700 border-slate-300"
                    }`}
                  >
                    {amenity}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add custom amenity"
                value={roomForm.customAmenity}
                onChange={(event) =>
                  setRoomForm((prev) => ({
                    ...prev,
                    customAmenity: event.target.value,
                  }))
                }
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm flex-1"
              />
              <button
                type="button"
                onClick={addAmenityChip}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
              >
                Add
              </button>
            </div>

            {roomForm.amenities.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {roomForm.amenities.map((amenity) => (
                  <span
                    key={amenity}
                    className="inline-flex items-center gap-1 bg-slate-200 text-slate-800 text-xs px-2 py-1 rounded-full"
                  >
                    {amenity}
                    <button type="button" onClick={() => removeAmenity(amenity)}>
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={creatingRoom}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-60"
            >
              {creatingRoom ? "Creating..." : "Create Room"}
            </button>
          </div>
        </form>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          className={tabStyle(activeTab === "request")}
          onClick={() => setActiveTab("request")}
        >
          Request Room
        </button>
        <button
          className={tabStyle(activeTab === "availability")}
          onClick={() => setActiveTab("availability")}
        >
          Availability
        </button>
        {canApprove && (
          <button
            className={tabStyle(activeTab === "approvals")}
            onClick={() => setActiveTab("approvals")}
          >
            Approval / Rejection
          </button>
        )}
        {showMyRequests && (
          <button
            className={tabStyle(activeTab === "myRequests")}
            onClick={() => setActiveTab("myRequests")}
          >
            My Requests
          </button>
        )}
      </div>

      {activeTab === "request" && (
        <form
          onSubmit={handleSubmitBooking}
          className="rounded-xl border border-slate-200 p-5 space-y-4"
        >
          <h3 className="text-base font-semibold text-slate-900">Room Request Form</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Room</label>
              <select
                value={bookingForm.roomId}
                onChange={(event) =>
                  setBookingForm((prev) => ({ ...prev, roomId: event.target.value }))
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                required
              >
                {rooms.length === 0 && <option value="">No rooms available</option>}
                {rooms.map((room) => (
                  <option key={room._id} value={room._id}>
                    {room.name} ({room.location})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Linked Event (optional)
              </label>
              <select
                value={bookingForm.eventId}
                onChange={(event) =>
                  setBookingForm((prev) => ({ ...prev, eventId: event.target.value }))
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              >
                <option value="">No event selected</option>
                {events.map((eventItem) => (
                  <option key={eventItem._id} value={eventItem._id}>
                    {eventItem.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Date</label>
              <input
                type="date"
                value={bookingForm.date}
                min={toDateInput(new Date())}
                onChange={(event) =>
                  setBookingForm((prev) => ({ ...prev, date: event.target.value }))
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Start</label>
                <input
                  type="time"
                  value={bookingForm.startTime}
                  onChange={(event) =>
                    setBookingForm((prev) => ({
                      ...prev,
                      startTime: event.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">End</label>
                <input
                  type="time"
                  value={bookingForm.endTime}
                  onChange={(event) =>
                    setBookingForm((prev) => ({
                      ...prev,
                      endTime: event.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Purpose</label>
            <textarea
              value={bookingForm.purpose}
              onChange={(event) =>
                setBookingForm((prev) => ({ ...prev, purpose: event.target.value }))
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm min-h-24"
              placeholder="Add a short purpose for this room usage"
            />
          </div>

          {clashWarning && (
            <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">
              <div className="font-medium">Clash Warning</div>
              <div className="mt-1">
                Conflicts with {clashWarning.room?.name || "an existing booking"} from
                {" "}
                {formatDateTime(clashWarning.startTime)} to {formatDateTime(clashWarning.endTime)}.
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={!canBook || submittingBooking || rooms.length === 0}
            className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-60"
          >
            {submittingBooking ? "Submitting..." : "Submit Booking Request"}
          </button>

          {!canBook && (
            <div className="text-xs text-slate-500 text-center">
              You do not have permission to create room bookings.
            </div>
          )}
        </form>
      )}

      {activeTab === "availability" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 p-5 space-y-4">
            <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <Search className="h-4 w-4" />
              Check Room Availability
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Room</label>
                <select
                  value={filters.roomId}
                  onChange={(event) =>
                    setFilters((prev) => ({ ...prev, roomId: event.target.value }))
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                >
                  {rooms.map((room) => (
                    <option key={room._id} value={room._id}>
                      {room.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Date</label>
                <input
                  type="date"
                  value={filters.date}
                  min={toDateInput(new Date())}
                  onChange={(event) =>
                    setFilters((prev) => ({ ...prev, date: event.target.value }))
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-left text-slate-600">
                    <th className="py-2 px-3">Time Slot</th>
                    <th className="py-2 px-3">Status</th>
                    <th className="py-2 px-3">Booking</th>
                  </tr>
                </thead>
                <tbody>
                  {timeSlots.map((slot) => (
                    <tr key={slot.label} className="border-t border-slate-100">
                      <td className="py-2 px-3 whitespace-nowrap">{slot.label}</td>
                      <td className="py-2 px-3">
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium ${
                            slot.booking
                              ? "bg-rose-100 text-rose-700"
                              : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          {slot.booking ? "Booked" : "Vacant"}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-slate-700">
                        {slot.booking
                          ? `${slot.booking.event?.title || slot.booking.purpose || "General booking"} (${slot.booking.status})`
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <CalendarDays className="h-4 w-4" />
              Selected room: {selectedRoomName}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 p-5 space-y-3">
            <h3 className="text-base font-semibold text-slate-900">Upcoming Timeline</h3>
            {Object.keys(upcomingByDate).length === 0 ? (
              <div className="text-sm text-slate-600">No upcoming bookings for this room.</div>
            ) : (
              Object.keys(upcomingByDate)
                .sort()
                .slice(0, 7)
                .map((dateKey) => (
                  <div key={dateKey} className="rounded-lg border border-slate-200 p-3">
                    <div className="font-medium text-slate-900 mb-2">{formatDate(dateKey)}</div>
                    <div className="space-y-1">
                      {upcomingByDate[dateKey].map((booking) => (
                        <div key={booking._id} className="text-sm text-slate-700 flex items-center gap-2">
                          <Clock3 className="h-4 w-4 text-slate-500" />
                          {new Date(booking.startTime).toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                          {" - "}
                          {new Date(booking.endTime).toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                          <span className={`text-xs px-2 py-0.5 rounded-full ${statusStyleMap[booking.status]}`}>
                            {booking.status}
                          </span>
                          <span>{booking.event?.title || booking.purpose || "General booking"}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      )}

      {activeTab === "approvals" && canApprove && (
        <div className="rounded-xl border border-slate-200 p-5">
          <h3 className="text-base font-semibold text-slate-900 mb-4">Pending Requests</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-slate-200 text-slate-600">
                  <th className="py-2 pr-3">Room</th>
                  <th className="py-2 pr-3">Requester</th>
                  <th className="py-2 pr-3">Event / Purpose</th>
                  <th className="py-2 pr-3">Time</th>
                  <th className="py-2 pr-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingForApproval.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-slate-500">
                      No pending bookings.
                    </td>
                  </tr>
                ) : (
                  pendingForApproval.map((booking) => (
                    <tr key={booking._id} className="border-b border-slate-100 align-top">
                      <td className="py-3 pr-3 text-slate-900 font-medium">{booking.room?.name || "-"}</td>
                      <td className="py-3 pr-3 text-slate-700">
                        {booking.bookedBy?.personal_info?.name || booking.bookedBy?.username || "-"}
                      </td>
                      <td className="py-3 pr-3 text-slate-700">
                        {booking.event?.title || booking.purpose || "General booking"}
                      </td>
                      <td className="py-3 pr-3 text-slate-600 whitespace-nowrap">
                        {formatDateTime(booking.startTime)}
                        <br />
                        {formatDateTime(booking.endTime)}
                      </td>
                      <td className="py-3 pr-3">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => handleReviewBooking(booking._id, "Approved")}
                            className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-emerald-700"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                          </button>
                          <button
                            onClick={() => handleReviewBooking(booking._id, "Rejected")}
                            className="inline-flex items-center gap-1 rounded-md bg-rose-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-rose-700"
                          >
                            <XCircle className="h-3.5 w-3.5" /> Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "myRequests" && showMyRequests && (
        <div className="rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <h3 className="text-base font-semibold text-slate-900">My Requests</h3>
            <select
              value={filters.status}
              onChange={(event) =>
                setFilters((prev) => ({ ...prev, status: event.target.value }))
              }
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-slate-200 text-slate-600">
                  <th className="py-2 pr-3">Room</th>
                  <th className="py-2 pr-3">Event / Purpose</th>
                  <th className="py-2 pr-3">Time</th>
                  <th className="py-2 pr-3">Status</th>
                  <th className="py-2 pr-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {myRequests
                  .filter((booking) => {
                    if (!filters.status) return true;
                    return booking.status === filters.status;
                  })
                  .map((booking) => {
                    const canCancel = !["Cancelled", "Rejected"].includes(booking.status);
                    return (
                      <tr key={booking._id} className="border-b border-slate-100 align-top">
                        <td className="py-3 pr-3 text-slate-900 font-medium">{booking.room?.name || "-"}</td>
                        <td className="py-3 pr-3 text-slate-700">
                          {booking.event?.title || booking.purpose || "General booking"}
                        </td>
                        <td className="py-3 pr-3 text-slate-600 whitespace-nowrap">
                          {formatDateTime(booking.startTime)}
                          <br />
                          {formatDateTime(booking.endTime)}
                        </td>
                        <td className="py-3 pr-3">
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-medium ${statusStyleMap[booking.status] || "bg-slate-100 text-slate-700"}`}
                          >
                            {booking.status}
                          </span>
                        </td>
                        <td className="py-3 pr-3">
                          {canCancel ? (
                            <button
                              onClick={() => handleCancelBooking(booking._id)}
                              className="inline-flex items-center gap-1 rounded-md border border-slate-300 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
                            >
                              Cancel
                            </button>
                          ) : (
                            <span className="text-xs text-slate-500">No action</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                {myRequests.length === 0 && (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-slate-500">
                      No requests found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!canBook && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 flex items-start gap-2">
          <AlertCircle className="h-4 w-4 mt-0.5" />
          Access is read-only for your role. Contact an admin role to create or
          manage bookings.
        </div>
      )}

      <div className="text-xs text-slate-500 flex items-center gap-2">
        <MapPin className="h-4 w-4" />
        Tip: Open Availability tab first, inspect the slot table, then submit from
        Request Room tab.
      </div>
    </div>
  );
};

export default RoomBooking;
