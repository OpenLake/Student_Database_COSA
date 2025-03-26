import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  Loader2,
  Calendar,
  Award,
  UserCircle,
  BookOpen,
  Clock,
  Mail,
  ArrowRight,
  Star,
  FileText,
  Check,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const CoSATenure = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const tenureParam = queryParams.get("tenure");

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
    <div className="container mx-auto px-4 py-12 bg-gradient-to-b from-indigo-50 to-white min-h-screen">
      <div className="flex justify-center mb-12">
        <div
          className="inline-flex rounded-full shadow-lg overflow-hidden border border-indigo-100"
          role="group"
        >
          <button
            type="button"
            className={`px-6 py-3 text-sm font-medium transition-all duration-300 ${
              activeTab === "create"
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-700 hover:bg-indigo-50"
            }`}
            onClick={() => handleTabChange("create")}
          >
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Create Record</span>
            </div>
          </button>
          <button
            type="button"
            className={`px-6 py-3 text-sm font-medium transition-all duration-300 ${
              activeTab === "show"
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-700 hover:bg-indigo-50"
            }`}
            onClick={() => handleTabChange("show")}
          >
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4" />
              <span>View Records</span>
            </div>
          </button>
        </div>
      </div>

      {activeTab === "create" ? (
        <CreateTenure />
      ) : (
        <ShowTenure tenureYear={tenureParam} />
      )}
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
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/tenure`,
        {
          ...formData,
          studentId: Number(formData.studentId),
          startDate: new Date(formData.startDate),
          endDate: new Date(formData.endDate),
        },
        {
          withCredentials: true,
        },
      );
      setFormData({
        studentId: "",
        studentName: "",
        email: "",
        role: "",
        startDate: "",
        endDate: "",
        achievements: "",
      });
      toast.success("Record added successfully");
    } catch (error) {
      toast.error("Error adding tenure record");
      console.error("Error adding tenure record:", error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white rounded-2xl shadow-xl border border-indigo-100 transform hover:shadow-2xl transition-all duration-300">
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-indigo-900 flex items-center gap-3">
          <BookOpen className="w-7 h-7 text-indigo-600" />
          Create CoSA Tenure Record
        </h2>
        <div className="h-1 w-20 bg-gradient-to-r from-indigo-500 to-purple-500 mt-3 mb-4 rounded-full"></div>
        <p className="text-slate-600 mt-1">Enter the tenure details below</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column */}
          <div className="flex-1 space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Student ID
              </label>
              <div className="relative group">
                <UserCircle className="absolute left-4 top-3.5 w-5 h-5 text-indigo-400 group-hover:text-indigo-600 transition-colors duration-200" />
                <input
                  type="text"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  placeholder="Enter student ID"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-400 focus:ring-3 focus:ring-indigo-100 transition-all duration-200 hover:bg-slate-100"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Student Name
              </label>
              <div className="relative group">
                <UserCircle className="absolute left-4 top-3.5 w-5 h-5 text-indigo-400 group-hover:text-indigo-600 transition-colors duration-200" />
                <input
                  type="text"
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleChange}
                  placeholder="Enter student name"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-400 focus:ring-3 focus:ring-indigo-100 transition-all duration-200 hover:bg-slate-100"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-indigo-400 group-hover:text-indigo-600 transition-colors duration-200" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-400 focus:ring-3 focus:ring-indigo-100 transition-all duration-200 hover:bg-slate-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Role
              </label>
              <div className="relative group"></div>
              <Award className="absolute left-4 top-3.5 w-5 h-5 text-indigo-400 group-hover:text-indigo-600 transition-colors duration-200" />
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
                placeholder="Enter role"
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-400 focus:ring-3 focus:ring-indigo-100 transition-all duration-200 hover:bg-slate-100"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Start Date
                </label>
                <div className="relative group">
                  <Calendar className="absolute left-4 top-3.5 w-5 h-5 text-indigo-400 group-hover:text-indigo-600 transition-colors duration-200" />
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-400 focus:ring-3 focus:ring-indigo-100 transition-all duration-200 hover:bg-slate-100"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  End Date
                </label>
                <div className="relative group">
                  <Clock className="absolute left-4 top-3.5 w-5 h-5 text-indigo-400 group-hover:text-indigo-600 transition-colors duration-200" />
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-400 focus:ring-3 focus:ring-indigo-100 transition-all duration-200 hover:bg-slate-100"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex-1 space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Achievements
              </label>
              <textarea
                name="achievements"
                value={formData.achievements}
                onChange={handleChange}
                placeholder="List achievements and contributions..."
                className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-400 focus:ring-3 focus:ring-indigo-100 transition-all duration-200 min-h-[272px] hover:bg-slate-100"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-indigo-800 text-white font-semibold py-4 px-6 rounded-xl hover:from-indigo-700 hover:to-indigo-900 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-indigo-200 flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              Create Tenure Record
            </button>
          </div>
        </div>
      </form>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export const ShowTenure = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [activeYear, setActiveYear] = useState(id || "24-25");

  // Helper function to get academic year date range
  const getAcademicYearDateRange = (yearString) => {
    const [startYear, endYear] = yearString.split("-");
    return {
      start: new Date(`20${startYear}-08-01`),
      end: new Date(`20${endYear}-07-31`),
    };
  };

  // Filter records based on academic year
  const filterRecordsByYear = (records, yearString) => {
    if (!records || records.length === 0) {
      return [];
    }

    try {
      const [startYear, endYear] = yearString.split("-").map(Number);
      if (parseInt(endYear) !== parseInt(startYear) + 1) {
        throw new Error("Year range must be consecutive years");
      }
      const { start, end } = getAcademicYearDateRange(yearString);
      console.log(
        "Filtering for year:",
        yearString,
        "Start:",
        start,
        "End:",
        end,
      );

      return records.filter((record) => {
        const [startDateStr, endDateStr] = record.tenurePeriod.split(" - ");
        const [startDay, startMonth, startYear] = startDateStr.split("-");
        const [endDay, endMonth, endYear] = endDateStr.split("-");

        const recordStartDate = new Date(
          `${startYear}-${startMonth}-${startDay}`,
        );
        const recordEndDate = new Date(`${endYear}-${endMonth}-${endDay}`);

        console.log(
          "Record:",
          record.studentName,
          "StartDate:",
          recordStartDate,
          "EndDate:",
          recordEndDate,
        );

        const isInRange =
          (recordStartDate >= start && recordStartDate <= end) ||
          (recordEndDate >= start && recordEndDate <= end) ||
          (recordStartDate <= start && recordEndDate >= end);

        console.log("Is in range:", isInRange);
        return isInRange;
      });
    } catch (error) {
      console.error("Error filtering records:", error);
      return [];
    }
  };

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/tenure`,
          {
            withCredentials: true,
          },
        );
        console.log("Fetched records:", response.data);

        if (!response.data || response.data.length === 0) {
          console.log("No records returned from API");
          setRecords([]);
          setFilteredRecords([]);
          setLoading(false);
          return;
        }

        setRecords(response.data);

        // Apply filtering based on academic year
        const filtered = filterRecordsByYear(response.data, activeYear);
        console.log("Filtered records:", filtered);

        setFilteredRecords(filtered);
      } catch (error) {
        toast.error("Error fetching records");
        console.error("Error fetching records:", error);
        setRecords([]);
        setFilteredRecords([]);
        if (error.status === 401 || error.status === 403) {
          navigate("/login", { replace: true });
          return;
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, [activeYear]);

  // Format date as DD/MM/YYYY
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error, dateString);
      return "Invalid date";
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-60">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mb-4" />
        <p className="text-indigo-600 font-medium animate-pulse">
          Loading records...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto m-4">
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-6">
          CoSA Tenure Team
        </h2>
        {filteredRecords.length !== 0 && (
          <>
            <p className="text-slate-600 max-w-2xl mx-auto mb-8 text-lg">
              Meet our dedicated team of student assistants who contribute to
              the success of our program
            </p>

            <div className="inline-block bg-indigo-100 text-indigo-800 font-medium rounded-full px-6 py-2 mb-8">
              Academic Year:{" "}
              {`20${activeYear.split("-")[0]}-20${activeYear.split("-")[1]}`}
            </div>
          </>
        )}
      </div>

      {records.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-indigo-100">
          <UserCircle className="w-20 h-20 text-indigo-200 mx-auto mb-6" />
          <p className="text-xl text-slate-600 mb-3">
            No records found in database
          </p>
          <p className="text-sm text-slate-500">
            Please contact the administrator to add records
          </p>
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-indigo-100">
          <UserCircle className="w-20 h-20 text-indigo-200 mx-auto mb-6" />
          <p className="text-xl text-slate-600 mb-3">
            No records found for selected academic year
          </p>
          <p className="text-sm text-slate-500">
            Please try a different academic year or contact the administrator
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredRecords.map((record, index) => {
            // Use the tenurePeriod directly from the record or create it if using startDate/endDate fields
            let tenurePeriod = record.tenurePeriod;
            if (!tenurePeriod && record.startDate && record.endDate) {
              tenurePeriod = `${formatDate(record.startDate)} - ${formatDate(record.endDate)}`;
            }

            const studentName = record.studentName || "Unknown";
            const studentID = record.studentID || "N/A";
            const achievements =
              record.achievements || "No achievements listed";

            return (
              <div
                key={record._id || index}
                className="bg-white max-w-72 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-indigo-50"
              >
                <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-pattern opacity-10"></div>
                  <UserCircle className="w-20 h-20 text-white opacity-90 relative z-10" />
                </div>
                <div className="p-4">
                  <h3 className="text-2xl font-bold text-indigo-900 mb-2">
                    {studentName}
                  </h3>
                  <p className="text-indigo-600 font-medium mb-4 inline-block bg-indigo-50 px-3 py-1 rounded-full">
                    {record.role}
                  </p>
                  <p className="text-sm text-slate-500 mb-4">
                    <span className="inline-flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-indigo-400" />
                      {tenurePeriod}
                    </span>
                  </p>
                  <div className="bg-slate-50 p-4 rounded-xl mb-4 max-h-28 overflow-auto">
                    <p
                      className="text-sm text-slate-600 line-clamp-3"
                      title={achievements}
                    >
                      {achievements}
                    </p>
                  </div>
                  {record.email && (
                    <a
                      href={`mailto:${record.email}`}
                      className="text-indigo-600 hover:text-indigo-800 text-sm font-medium inline-flex items-center bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-full transition-colors duration-300"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Contact
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default CoSATenure;
