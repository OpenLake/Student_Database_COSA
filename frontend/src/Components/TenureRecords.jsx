import React, { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, Calendar, Award, UserCircle, BookOpen, Clock } from "lucide-react";

export const CreateTenure = () => {
  const [formData, setFormData] = useState({
    studentId: "",
    role: "",
    startDate: "",
    endDate: "",
    achievements: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/tenure`, {
        ...formData,
        studentId: Number(formData.studentId),
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
      });
      setFormData({
        studentId: "",
        role: "",
        startDate: "",
        endDate: "",
        achievements: "",
      });
      alert("Record added successfully");
    } catch (error) {
      console.error("Error adding tenure record:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg border border-indigo-100">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-indigo-900 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-indigo-600" />
          Create CoSA Tenure Record
        </h2>
        <p className="text-slate-600 mt-1">Enter the tenure details below</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Student ID</label>
          <div className="relative">
            <UserCircle className="absolute left-3 top-3.5 w-5 h-5 text-indigo-400" />
            <input
              type="text"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              placeholder="Enter student ID"
              className="w-full pl-10 pr-4 py-3 rounded-md bg-slate-50 border border-slate-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all duration-200"
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
          <div className="relative">
            <Award className="absolute left-3 top-3.5 w-5 h-5 text-indigo-400" />
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              placeholder="Enter role"
              className="w-full pl-10 pr-4 py-3 rounded-md bg-slate-50 border border-slate-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all duration-200"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3.5 w-5 h-5 text-indigo-400" />
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-md bg-slate-50 border border-slate-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all duration-200"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
            <div className="relative">
              <Clock className="absolute left-3 top-3.5 w-5 h-5 text-indigo-400" />
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-md bg-slate-50 border border-slate-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all duration-200"
                required
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Achievements</label>
          <textarea
            name="achievements"
            value={formData.achievements}
            onChange={handleChange}
            placeholder="List achievements and contributions..."
            className="w-full p-4 rounded-md bg-slate-50 border border-slate-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all duration-200 min-h-[120px]"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white font-medium py-3 px-6 rounded-md hover:bg-indigo-700 transition-all duration-200 flex items-center justify-center gap-2"
        >
          <Award className="w-5 h-5" />
          Create Tenure Record
        </button>
      </form>
    </div>
  );
};

export const ShowTenure = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/tenure`);
        setRecords(response.data);
      } catch (error) {
        console.error("Error fetching records:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-60">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg border border-indigo-100">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-indigo-900 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-indigo-600" />
          CoSA Tenure Records
        </h2>
        <p className="text-slate-600 mt-1">Comprehensive record of student tenure achievements</p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full">
          <thead>
            <tr className="bg-indigo-50 text-left">
              <th className="px-6 py-4 font-semibold text-indigo-900">Student</th>
              <th className="px-6 py-4 font-semibold text-indigo-900">Role</th>
              <th className="px-6 py-4 font-semibold text-indigo-900">Period</th>
              <th className="px-6 py-4 font-semibold text-indigo-900">Achievements</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record, index) => (
              <tr
                key={record._id}
                className={`${
                  index % 2 === 0 ? "bg-white" : "bg-slate-50"
                } hover:bg-indigo-50 transition-colors duration-150`}
              >
                <td className="px-6 py-4 font-medium text-indigo-900">
                  {record.studentName || "Unknown"}
                </td>
                <td className="px-6 py-4 text-slate-700">{record.role}</td>
                <td className="px-6 py-4 text-slate-700">{record.tenurePeriod || "N/A"}</td>
                <td className="px-6 py-4 text-slate-700">
                  <div className="max-w-xs truncate" title={record.achievements}>
                    {record.achievements || "No achievements listed"}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};