import React, { useEffect, useState } from "react";
import axios from "axios";

const TenureRecords = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    studentId: "",
    role: "",
    startDate: "",
    endDate: "",
    achievements: "",
  });

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        //const token = localStorage.getItem('token');
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/tenure`, //,{

          //headers: { Authorization: `Bearer ${token}` }}
        );
        setRecords(response.data);
      } catch (error) {
        console.error("Error fetching records:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      //const token = localStorage.getItem('token');
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/tenure`,
        formData, //,{

        //  headers: { Authorization: `Bearer ${token}` }}
      );
      setFormData({
        studentId: "",
        role: "",
        startDate: "",
        endDate: "",
        achievements: "",
      });
      window.location.reload(); // Refresh to show updated records
    } catch (error) {
      console.error("Error adding tenure record:", error);
    }
  };

  if (loading) return <p>Loading tenure records...</p>;

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">CoSA Tenure Records</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          name="studentId"
          value={formData.studentId}
          onChange={handleChange}
          placeholder="Student ID"
          className="border p-2 mr-2"
          required
        />
        <input
          type="text"
          name="role"
          value={formData.role}
          onChange={handleChange}
          placeholder="Role"
          className="border p-2 mr-2"
          required
        />
        <input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          className="border p-2 mr-2"
          required
        />
        <input
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          className="border p-2 mr-2"
          required
        />
        <input
          type="text"
          name="achievements"
          value={formData.achievements}
          onChange={handleChange}
          placeholder="Achievements"
          className="border p-2 mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Add Tenure
        </button>
      </form>
      <table className="min-w-full border">
        <thead>
          <tr>
            <th className="border px-4 py-2">Student Name</th>
            <th className="border px-4 py-2">Role</th>
            <th className="border px-4 py-2">Tenure Period</th>
            <th className="border px-4 py-2">Achievements</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record._id}>
              <td className="border px-4 py-2">{record.studentId?.name}</td>
              <td className="border px-4 py-2">{record.role}</td>
              <td className="border px-4 py-2">
                {record.startDate} - {record.endDate}
              </td>
              <td className="border px-4 py-2">{record.achievements}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TenureRecords;
