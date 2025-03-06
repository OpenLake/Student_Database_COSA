import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Room Booking</h1>

      {/* Display status messages */}
      {message && <p className="mb-4 text-green-600">{message}</p>}

      <form className="space-y-3 bg-white p-4 rounded-lg shadow-md" onSubmit={handleSubmit}>
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          className="border p-2 w-full rounded"
          required
        />
        <input
          type="time"
          value={form.time}
          onChange={(e) => setForm({ ...form, time: e.target.value })}
          className="border p-2 w-full rounded"
          required
        />
        <select
          value={form.room}
          onChange={(e) => setForm({ ...form, room: e.target.value })}
          className="border p-2 w-full rounded"
          required
        >
          <option value="">Select Room</option>
          <option value="Room A">Room A</option>
          <option value="Room B">Room B</option>
        </select>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="border p-2 w-full rounded"
          placeholder="Event description"
          required
        />
        <button type="submit" className="bg-blue-600 text-white p-2 rounded w-full">
          Request Booking
        </button>
      </form>

      <h2 className="text-xl font-bold mt-6">Booking Requests</h2>
      <table className="w-full border-collapse border mt-3">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Date</th>
            <th className="border p-2">Time</th>
            <th className="border p-2">Room</th>
            <th className="border p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b, i) => (
            <tr key={i} className="text-center border">
              <td className="border p-2">{b.date}</td>
              <td className="border p-2">{b.time}</td>
              <td className="border p-2">{b.room}</td>
              <td className={`border p-2 ${b.status === "Pending" ? "text-yellow-500" : b.status === "Approved" ? "text-green-500" : "text-red-500"}`}>
                {b.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
