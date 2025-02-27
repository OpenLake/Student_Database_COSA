import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
// import dotenv from "dotenv";
// dotenv.config();

import { Loader2, Calendar, Award, UserCircle, BookOpen, Clock, Mail } from "lucide-react";
//import PropTypes from "prop-types";

// MyComponent.propTypes = {
//   tenureYear: PropTypes.string.isRequired, // or PropTypes.number.isRequired if it's a number
// };


export const CoSATenure = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const tenureParam = queryParams.get('tenure');
  
  const [activeTab, setActiveTab] = useState(tenureParam ? "show" : "create");
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "show") {
      navigate("/cosa?tenure=24-25");
    } else {
      navigate("/cosa");
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-center mb-8">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium rounded-l-lg border ${
              activeTab === "create"
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
            }`}
            onClick={() => handleTabChange("create")}
          >
            Create Record
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium rounded-r-lg border ${
              activeTab === "show"
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
            }`}
            onClick={() => handleTabChange("show")}
          >
            View Records
          </button>
        </div>
      </div>
      
      {activeTab === "create" ? <CreateTenure /> : <ShowTenure tenureYear={tenureParam} />}
    </div>
  );
};

export const CreateTenure = () => {
  const [formData, setFormData] = useState({
    studentId: "",
    studentName: "",
    email: "",
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
        studentName: "",
        email: "",
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
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-lg border border-indigo-100">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-indigo-900 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-indigo-600" />
          Create CoSA Tenure Record
        </h2>
        <p className="text-slate-600 mt-1">Enter the tenure details below</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Column */}
          <div className="flex-1 space-y-6">
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
              <label className="block text-sm font-medium text-slate-700 mb-1">Student Name</label>
              <div className="relative">
                <UserCircle className="absolute left-3 top-3.5 w-5 h-5 text-indigo-400" />
                <input
                  type="text"
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleChange}
                  placeholder="Enter student name"
                  className="w-full pl-10 pr-4 py-3 rounded-md bg-slate-50 border border-slate-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all duration-200"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-indigo-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  className="w-full pl-10 pr-4 py-3 rounded-md bg-slate-50 border border-slate-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all duration-200"
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
          </div>
          
          {/* Right Column */}
          <div className="flex-1 space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Achievements</label>
              <textarea
                name="achievements"
                value={formData.achievements}
                onChange={handleChange}
                placeholder="List achievements and contributions..."
                className="w-full p-4 rounded-md bg-slate-50 border border-slate-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all duration-200 min-h-[252px]"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white font-medium py-3 px-6 rounded-md hover:bg-indigo-700 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Award className="w-5 h-5" />
              Create Tenure Record
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export const ShowTenure = ({ tenureYear }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeYear, setActiveYear] = useState(tenureYear || "24-25");
  const navigate = useNavigate();

  const years = ["23-24", "24-25", "25-26"];

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
  }, [activeYear]);

  const handleYearChange = (year) => {
    setActiveYear(year);
    navigate(`/cosa?=${year}`);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-60">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-indigo-900 mb-4">CoSA Tenure Team</h2>
        <p className="text-slate-600 max-w-2xl mx-auto">Meet our dedicated team of student assistants who contribute to the success of our program</p>
        
        <div className="mt-6 inline-flex rounded-md shadow-sm" role="group">
          {years.map(year => (
            <button
              key={year}
              type="button"
              className={`px-4 py-2 text-sm font-medium ${
                year === activeYear
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              } ${
                year === years[0] ? "rounded-l-lg" : year === years[years.length-1] ? "rounded-r-lg" : ""
              } border border-gray-200`}
              onClick={() => handleYearChange(year)}
            >
              {year}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {records.map((record) => (
          <div key={record._id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="h-48 bg-indigo-100 flex items-center justify-center">
              <UserCircle className="w-20 h-20 text-indigo-300" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-indigo-900 mb-1">{record.studentName || "Unknown"}</h3>
              <p className="text-indigo-600 font-medium mb-3">{record.role}</p>
              <p className="text-sm text-slate-500 mb-3">
                <span className="inline-flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {record.tenurePeriod || "N/A"}
                </span>
              </p>
              <p className="text-sm text-slate-600 mb-4 line-clamp-3" title={record.achievements}>
                {record.achievements || "No achievements listed"}
              </p>
              {record.email && (
                <a href={`mailto:${record.email}`} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium inline-flex items-center">
                  <Mail className="w-4 h-4 mr-1" />
                  Contact
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoSATenure;