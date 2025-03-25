import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

export default function RoomBooking() {
  const [form, setForm] = useState({
    date: "",
    time: "",
    room: "",
    description: "",
  });
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/room/requests`);
      setBookings(res.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/room/request`, form);
      setMessage("Booking request submitted!");
      setForm({ date: "", time: "", room: "", description: "" });
      fetchBookings();
    } catch (error) {
      console.error("Error submitting booking:", error);
      setMessage("Failed to submit request.");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-50 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-blue-700 border-b pb-3">
        Room Booking
      </h1>

      {/* Display status messages */}
      {message && (
        <div className="mb-6 p-4 rounded-md bg-blue-50 border-l-4 border-blue-500 text-blue-700 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p>{message}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="bg-blue-600 text-white py-3 px-4 text-lg font-semibold">
          New Booking Request
        </div>
        <form className="p-6 space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="border p-2 w-full rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time
              </label>
              <input
                type="time"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                className="border p-2 w-full rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Room
            </label>
            <select
              value={form.room}
              onChange={(e) => setForm({ ...form, room: e.target.value })}
              className="border p-2 w-full rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select Room</option>
              <option value="Room A">Room A</option>
              <option value="Room B">Room B</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="border p-2 w-full rounded h-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Event description"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded w-full transition-colors duration-200 font-medium"
          >
            Request Booking
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-blue-600 text-white py-3 px-4 text-lg font-semibold">
          Booking Requests
        </div>
        <div className="p-4 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="border-b p-3 font-semibold text-gray-700">
                  Date
                </th>
                <th className="border-b p-3 font-semibold text-gray-700">
                  Time
                </th>
                <th className="border-b p-3 font-semibold text-gray-700">
                  Room
                </th>
                <th className="border-b p-3 font-semibold text-gray-700">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center p-4 text-gray-500">
                    No bookings found
                  </td>
                </tr>
              ) : (
                bookings.map((b, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="p-3">{b.date}</td>
                    <td className="p-3">{b.time}</td>
                    <td className="p-3">{b.room}</td>
                    <td className="p-3">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium
                          ${
                            b.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : b.status === "Approved"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                          }`}
                      >
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
