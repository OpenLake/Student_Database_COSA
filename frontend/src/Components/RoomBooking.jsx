import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  Plus,
  RefreshCcw,
  XCircle,
} from "lucide-react";
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

const APPROVAL_ROLES = [
  "PRESIDENT",
  "GENSEC_SCITECH",
  "GENSEC_ACADEMIC",
  "GENSEC_CULTURAL",
  "GENSEC_SPORTS",
];

const toDateInput = (date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const combineDateTime = (dateStr, timeStr) =>
  new Date(`${dateStr}T${timeStr}:00`);

const formatDateTime = (value) =>
  new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
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

const RoomBooking = () => {
  const { isUserLoggedIn } = useContext(AdminContext);
  const userRole = isUserLoggedIn?.role || "STUDENT";
  const username = isUserLoggedIn?.username || "";
  const userId = isUserLoggedIn?._id;

  const canBook = ADMIN_ROLES.includes(userRole);
  const canReview = APPROVAL_ROLES.includes(userRole);

  const [rooms, setRooms] = useState([]);
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submittingBooking, setSubmittingBooking] = useState(false);
  const [creatingRoom, setCreatingRoom] = useState(false);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [showRoomForm, setShowRoomForm] = useState(false);
  const [roomForm, setRoomForm] = useState({
    name: "",
    capacity: "",
    location: "",
    amenities: "",
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
      setError("");
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
      setError(
        err.response?.data?.message || "Failed to refresh room bookings.",
      );
    }
  };

  useEffect(() => {
    const initialize = async () => {
      try {
        setLoading(true);
        setError("");

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
        setError(
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
        if (!filters.roomId || booking.room?._id !== filters.roomId)
          return false;
        return sameDay(booking.startTime, filters.date);
      })
      .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  }, [bookings, filters.roomId, filters.date]);

  const filteredBookings = useMemo(() => {
    return bookings
      .filter((booking) => {
        if (filters.roomId && booking.room?._id !== filters.roomId)
          return false;
        if (filters.status && booking.status !== filters.status) return false;
        return true;
      })
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }, [bookings, filters.roomId, filters.status]);

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

  const handleCreateRoom = async (event) => {
    event.preventDefault();
    setError("");
    setSuccessMessage("");

    try {
      setCreatingRoom(true);
      const amenities = roomForm.amenities
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      await api.post("/api/rooms/create-room", {
        name: roomForm.name.trim(),
        capacity: Number(roomForm.capacity),
        location: roomForm.location.trim(),
        amenities,
      });

      setRoomForm({ name: "", capacity: "", location: "", amenities: "" });
      setShowRoomForm(false);
      setSuccessMessage("Room created successfully.");
      await refreshData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create room.");
    } finally {
      setCreatingRoom(false);
    }
  };

  const handleSubmitBooking = async (event) => {
    event.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!bookingForm.roomId) {
      setError("Please select a room.");
      return;
    }

    const start = combineDateTime(bookingForm.date, bookingForm.startTime);
    const end = combineDateTime(bookingForm.date, bookingForm.endTime);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      setError("Please enter valid booking date and time.");
      return;
    }

    if (end <= start) {
      setError("End time must be after start time.");
      return;
    }

    if (clashWarning) {
      setError(
        "This slot overlaps with an existing booking. Please choose a different time.",
      );
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

      setSuccessMessage("Room booking request submitted successfully.");
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
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit booking.");
    } finally {
      setSubmittingBooking(false);
    }
  };

  const handleReviewBooking = async (bookingId, status) => {
    try {
      setError("");
      setSuccessMessage("");

      await api.put(`/api/rooms/bookings/${bookingId}/status`, { status });

      const bookingsData = await fetchBookings();
      setBookings(bookingsData);
      setSuccessMessage(`Booking ${status.toLowerCase()} successfully.`);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update booking status.",
      );
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      setError("");
      setSuccessMessage("");

      await api.delete(`/api/rooms/bookings/${bookingId}`);

      const bookingsData = await fetchBookings();
      setBookings(bookingsData);
      setSuccessMessage("Booking cancelled successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to cancel booking.");
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
            Book rooms for events, detect time clashes, and monitor day-wise
            availability.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {canBook && (
            <button
              onClick={() => setShowRoomForm((prev) => !prev)}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              <Plus className="h-4 w-4" />
              Add Room
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

      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {successMessage}
        </div>
      )}

      {showRoomForm && canBook && (
        <form
          onSubmit={handleCreateRoom}
          className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-4"
        >
          <h3 className="text-base font-semibold text-slate-900">
            Create New Room
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                setRoomForm((prev) => ({
                  ...prev,
                  capacity: event.target.value,
                }))
              }
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
              required
            />
            <input
              type="text"
              placeholder="Location"
              value={roomForm.location}
              onChange={(event) =>
                setRoomForm((prev) => ({
                  ...prev,
                  location: event.target.value,
                }))
              }
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
              required
            />
            <input
              type="text"
              placeholder="Amenities (comma-separated)"
              value={roomForm.amenities}
              onChange={(event) =>
                setRoomForm((prev) => ({
                  ...prev,
                  amenities: event.target.value,
                }))
              }
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
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

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <form
          onSubmit={handleSubmitBooking}
          className="rounded-xl border border-slate-200 p-5 space-y-4"
        >
          <h3 className="text-base font-semibold text-slate-900">
            New Booking Request
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Room
              </label>
              <select
                value={bookingForm.roomId}
                onChange={(event) =>
                  setBookingForm((prev) => ({
                    ...prev,
                    roomId: event.target.value,
                  }))
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                required
              >
                {rooms.length === 0 && (
                  <option value="">No rooms available</option>
                )}
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
                  setBookingForm((prev) => ({
                    ...prev,
                    eventId: event.target.value,
                  }))
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
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Date
              </label>
              <input
                type="date"
                value={bookingForm.date}
                onChange={(event) =>
                  setBookingForm((prev) => ({
                    ...prev,
                    date: event.target.value,
                  }))
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Start
                </label>
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
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  End
                </label>
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
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Purpose
            </label>
            <textarea
              value={bookingForm.purpose}
              onChange={(event) =>
                setBookingForm((prev) => ({
                  ...prev,
                  purpose: event.target.value,
                }))
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm min-h-24"
              placeholder="Add a short purpose for this room usage"
            />
          </div>

          {clashWarning && (
            <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">
              <div className="font-medium">Clash Warning</div>
              <div className="mt-1">
                Conflicts with{" "}
                {clashWarning.room?.name || "an existing booking"} from{" "}
                {formatDateTime(clashWarning.startTime)} to{" "}
                {formatDateTime(clashWarning.endTime)}.
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

        <div className="rounded-xl border border-slate-200 p-5 space-y-4">
          <h3 className="text-base font-semibold text-slate-900">
            Room Availability
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Room
              </label>
              <select
                value={filters.roomId}
                onChange={(event) =>
                  setFilters((prev) => ({
                    ...prev,
                    roomId: event.target.value,
                  }))
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
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Date
              </label>
              <input
                type="date"
                value={filters.date}
                onChange={(event) =>
                  setFilters((prev) => ({ ...prev, date: event.target.value }))
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 space-y-2 max-h-80 overflow-auto">
            {availabilityBookings.length === 0 ? (
              <div className="text-sm text-slate-600">
                No bookings found for {selectedRoomName} on this date.
              </div>
            ) : (
              availabilityBookings.map((booking) => (
                <div
                  key={booking._id}
                  className="rounded-lg border border-slate-200 bg-white p-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-medium text-slate-900">
                      {booking.event?.title || "General Booking"}
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${statusStyleMap[booking.status] || "bg-slate-100 text-slate-700"}`}
                    >
                      {booking.status}
                    </span>
                  </div>
                  <div className="mt-1 space-y-1 text-xs text-slate-600">
                    <div className="flex items-center gap-1">
                      <Clock3 className="h-3.5 w-3.5" />
                      {formatDateTime(booking.startTime)} -{" "}
                      {formatDateTime(booking.endTime)}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {booking.room?.location || "Location unavailable"}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <CalendarDays className="h-4 w-4" />
            Availability view updates live whenever bookings are created or
            reviewed.
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h3 className="text-base font-semibold text-slate-900">
            Booking Requests
          </h3>

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
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-500">
                    No bookings match your current filters.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => {
                  const canCancel =
                    String(booking.bookedBy?._id || booking.bookedBy) ===
                      String(userId) || ADMIN_ROLES.includes(userRole);

                  return (
                    <tr
                      key={booking._id}
                      className="border-b border-slate-100 align-top"
                    >
                      <td className="py-3 pr-3 text-slate-900 font-medium">
                        {booking.room?.name || "-"}
                      </td>
                      <td className="py-3 pr-3 text-slate-700">
                        <div>
                          {booking.event?.title ||
                            booking.purpose ||
                            "General booking"}
                        </div>
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
                        <div className="flex flex-wrap gap-2">
                          {canReview && booking.status === "Pending" && (
                            <>
                              <button
                                onClick={() =>
                                  handleReviewBooking(booking._id, "Approved")
                                }
                                className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-emerald-700"
                              >
                                <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                              </button>
                              <button
                                onClick={() =>
                                  handleReviewBooking(booking._id, "Rejected")
                                }
                                className="inline-flex items-center gap-1 rounded-md bg-rose-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-rose-700"
                              >
                                <XCircle className="h-3.5 w-3.5" /> Reject
                              </button>
                            </>
                          )}

                          {canCancel &&
                            !["Cancelled", "Rejected"].includes(
                              booking.status,
                            ) && (
                              <button
                                onClick={() => handleCancelBooking(booking._id)}
                                className="inline-flex items-center gap-1 rounded-md border border-slate-300 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
                              >
                                Cancel
                              </button>
                            )}

                          {!canReview && booking.status === "Pending" && (
                            <span className="text-xs text-slate-500">
                              Awaiting admin review
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {!canBook && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 flex items-start gap-2">
          <AlertCircle className="h-4 w-4 mt-0.5" />
          Access is read-only for your role. Contact an admin role to create or
          manage bookings.
        </div>
      )}
    </div>
  );
};

export default RoomBooking;
