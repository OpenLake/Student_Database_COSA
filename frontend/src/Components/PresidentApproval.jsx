import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

export default function PresidentApproval() {
  const [bookings, setBookings] = useState([]);

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

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`${API_BASE_URL}/room/request/${id}/status`, { status });
      fetchBookings();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">President Approval Panel</h1>

      <h2 className="text-xl font-bold mt-6">Pending Room Booking Requests</h2>
      <table className="w-full border-collapse border mt-3">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Date</th>
            <th className="border p-2">Time</th>
            <th className="border p-2">Room</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b, i) => (
            <tr key={i} className="text-center border">
              <td className="border p-2">{b.date}</td>
              <td className="border p-2">{b.time}</td>
              <td className="border p-2">{b.room}</td>
              <td className="border p-2">{b.description}</td>
              <td className={`border p-2 ${b.status === "Pending" ? "text-yellow-500" : b.status === "Approved" ? "text-green-500" : "text-red-500"}`}>
                {b.status}
              </td>
              <td className="border p-2 space-x-2">
                {b.status === "Pending" && (
                  <>
                    <button onClick={() => updateStatus(b._id, "Approved")} className="bg-green-500 text-white px-2 py-1 rounded">
                      Approve
                    </button>
                    <button onClick={() => updateStatus(b._id, "Rejected")} className="bg-red-500 text-white px-2 py-1 rounded">
                      Reject
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
