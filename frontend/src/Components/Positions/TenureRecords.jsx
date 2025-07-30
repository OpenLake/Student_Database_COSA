// import React, { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { useParams } from "react-router-dom";
// import {
//   Loader2,
//   Calendar,
//   Award,
//   UserCircle,
//   BookOpen,
//   Clock,
//   Mail,
// } from "lucide-react";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// export const CoSATenure = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const queryParams = new URLSearchParams(location.search);
//   const tenureParam = queryParams.get("tenure");

//   const [activeTab, setActiveTab] = useState(tenureParam ? "show" : "create");

//   const handleTabChange = (tab) => {
//     setActiveTab(tab);
//     if (tab === "show") {
//       navigate("/cosa?tenure=24-25");
//     } else {
//       navigate("/cosa");
//     }
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="flex justify-center mb-8">
//         <div className="inline-flex rounded-md shadow-sm" role="group">
//           <button
//             type="button"
//             className={`px-4 py-2 text-sm font-medium rounded-l-lg border ${
//               activeTab === "create"
//                 ? "bg-indigo-600 text-white border-indigo-600"
//                 : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
//             }`}
//             onClick={() => handleTabChange("create")}
//           >
//             Create Record
//           </button>
//           <button
//             type="button"
//             className={`px-4 py-2 text-sm font-medium rounded-r-lg border ${
//               activeTab === "show"
//                 ? "bg-indigo-600 text-white border-indigo-600"
//                 : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
//             }`}
//             onClick={() => handleTabChange("show")}
//           >
//             View Records
//           </button>
//         </div>
//       </div>

//       {activeTab === "create" ? (
//         <CreateTenure />
//       ) : (
//         <ShowTenure tenureYear={tenureParam} />
//       )}
//     </div>
//   );
// };

// export const CreateTenure = () => {
//   const [formData, setFormData] = useState({
//     studentId: "",
//     studentName: "",
//     email: "",
//     role: "",
//     startDate: "",
//     endDate: "",
//     achievements: "",
//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post(`${process.env.REACT_APP_BACKEND_URL}/tenure`, {
//         ...formData,
//         studentId: Number(formData.studentId),
//         startDate: new Date(formData.startDate),
//         endDate: new Date(formData.endDate),
//       });
//       setFormData({
//         studentId: "",
//         studentName: "",
//         email: "",
//         role: "",
//         startDate: "",
//         endDate: "",
//         achievements: "",
//       });
//       toast.success("Record added successfully");
//     } catch (error) {
//       toast.error("Error adding tenure record");
//       console.error("Error adding tenure record:", error);
//     }
//   };

//   return (
//     <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-lg border border-indigo-100">
//       <div className="mb-8">
//         <h2 className="text-2xl font-semibold text-indigo-900 flex items-center gap-2">
//           <BookOpen className="w-6 h-6 text-indigo-600" />
//           Create CoSA Tenure Record
//         </h2>
//         <p className="text-slate-600 mt-1">Enter the tenure details below</p>
//       </div>

//       <form onSubmit={handleSubmit}>
//         <div className="flex flex-col md:flex-row gap-6">
//           {/* Left Column */}
//           <div className="flex-1 space-y-6">
//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-1">
//                 Student ID
//               </label>
//               <div className="relative">
//                 <UserCircle className="absolute left-3 top-3.5 w-5 h-5 text-indigo-400" />
//                 <input
//                   type="text"
//                   name="studentId"
//                   value={formData.studentId}
//                   onChange={handleChange}
//                   placeholder="Enter student ID"
//                   className="w-full pl-10 pr-4 py-3 rounded-md bg-slate-50 border border-slate-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all duration-200"
//                   required
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-1">
//                 Student Name
//               </label>
//               <div className="relative">
//                 <UserCircle className="absolute left-3 top-3.5 w-5 h-5 text-indigo-400" />
//                 <input
//                   type="text"
//                   name="studentName"
//                   value={formData.studentName}
//                   onChange={handleChange}
//                   placeholder="Enter student name"
//                   className="w-full pl-10 pr-4 py-3 rounded-md bg-slate-50 border border-slate-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all duration-200"
//                   required
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-1">
//                 Email
//               </label>
//               <div className="relative">
//                 <Mail className="absolute left-3 top-3.5 w-5 h-5 text-indigo-400" />
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   placeholder="Enter email address"
//                   className="w-full pl-10 pr-4 py-3 rounded-md bg-slate-50 border border-slate-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all duration-200"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-1">
//                 Role
//               </label>
//               <div className="relative">
//                 <Award className="absolute left-3 top-3.5 w-5 h-5 text-indigo-400" />
//                 <input
//                   type="text"
//                   name="role"
//                   value={formData.role}
//                   onChange={handleChange}
//                   placeholder="Enter role"
//                   className="w-full pl-10 pr-4 py-3 rounded-md bg-slate-50 border border-slate-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all duration-200"
//                   required
//                 />
//               </div>
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-slate-700 mb-1">
//                   Start Date
//                 </label>
//                 <div className="relative">
//                   <Calendar className="absolute left-3 top-3.5 w-5 h-5 text-indigo-400" />
//                   <input
//                     type="date"
//                     name="startDate"
//                     value={formData.startDate}
//                     onChange={handleChange}
//                     className="w-full pl-10 pr-4 py-3 rounded-md bg-slate-50 border border-slate-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all duration-200"
//                     required
//                   />
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-slate-700 mb-1">
//                   End Date
//                 </label>
//                 <div className="relative">
//                   <Clock className="absolute left-3 top-3.5 w-5 h-5 text-indigo-400" />
//                   <input
//                     type="date"
//                     name="endDate"
//                     value={formData.endDate}
//                     onChange={handleChange}
//                     className="w-full pl-10 pr-4 py-3 rounded-md bg-slate-50 border border-slate-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all duration-200"
//                     required
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Right Column */}
//           <div className="flex-1 space-y-6">
//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-1">
//                 Achievements
//               </label>
//               <textarea
//                 name="achievements"
//                 value={formData.achievements}
//                 onChange={handleChange}
//                 placeholder="List achievements and contributions..."
//                 className="w-full p-4 rounded-md bg-slate-50 border border-slate-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all duration-200 min-h-[252px]"
//               />
//             </div>

//             <button
//               type="submit"
//               className="w-full bg-indigo-600 text-white font-medium py-3 px-6 rounded-md hover:bg-indigo-700 transition-all duration-200 flex items-center justify-center gap-2"
//             >
//               <Award className="w-5 h-5" />
//               Create Tenure Record
//             </button>
//           </div>
//         </div>
//       </form>
//       <ToastContainer position="top-right" autoClose={3000} />
//     </div>
//   );
// };

// export const ShowTenure = () => {
//   const { id } = useParams(); // Get the year from URL params if present
//   const navigate = useNavigate();
//   const [records, setRecords] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filteredRecords, setFilteredRecords] = useState([]);
//   const [activeYear, setActiveYear] = useState(id || "24-25"); // Default to current year if no param

//   // Helper function to get academic year date range
//   const getAcademicYearDateRange = (yearString) => {
//     const [startYear, endYear] = yearString.split("-");
//     return {
//       start: new Date(`20${startYear}-08-01`), // August 1st of start year
//       end: new Date(`20${endYear}-07-31`), // July 31st of end year
//     };
//   };

//   // Filter records based on academic year
//   const filterRecordsByYear = (records, yearString) => {
//     if (!records || records.length === 0) {
//       return [];
//     }

//     try {
//       const [startYear, endYear] = yearString.split("-").map(Number);
//       if (parseInt(endYear) !== parseInt(startYear) + 1) {
//         throw new Error("Year range must be consecutive years");
//       }
//       const { start, end } = getAcademicYearDateRange(yearString);
//       console.log(
//         "Filtering for year:",
//         yearString,
//         "Start:",
//         start,
//         "End:",
//         end,
//       );

//       return records.filter((record) => {
//         // Parse dates from tenurePeriod since that's what we have in the frontend data
//         const [startDateStr, endDateStr] = record.tenurePeriod.split(" - ");

//         // Parse DD-MM-YYYY format
//         const [startDay, startMonth, startYear] = startDateStr.split("-");
//         const [endDay, endMonth, endYear] = endDateStr.split("-");

//         const recordStartDate = new Date(
//           `${startYear}-${startMonth}-${startDay}`,
//         );
//         const recordEndDate = new Date(`${endYear}-${endMonth}-${endDay}`);

//         console.log(
//           "Record:",
//           record.studentName,
//           "StartDate:",
//           recordStartDate,
//           "EndDate:",
//           recordEndDate,
//         );

//         const isInRange =
//           (recordStartDate >= start && recordStartDate <= end) ||
//           (recordEndDate >= start && recordEndDate <= end) ||
//           (recordStartDate <= start && recordEndDate >= end);

//         console.log("Is in range:", isInRange);
//         return isInRange;
//       });
//     } catch (error) {
//       console.error("Error filtering records:", error);
//       return [];
//     }
//   };

//   useEffect(() => {
//     const fetchRecords = async () => {
//       try {
//         const response = await axios.get(
//           `${process.env.REACT_APP_BACKEND_URL}/tenure`,
//         );
//         console.log("Fetched records:", response.data);

//         if (!response.data || response.data.length === 0) {
//           console.log("No records returned from API");
//           setRecords([]);
//           setFilteredRecords([]);
//           setLoading(false);
//           return;
//         }

//         setRecords(response.data);

//         // Apply filtering based on academic year
//         const filtered = filterRecordsByYear(response.data, activeYear);
//         console.log("Filtered records:", filtered);

//         setFilteredRecords(filtered);
//       } catch (error) {
//         toast.error("Error fetching records");
//         console.error("Error fetching records:", error);
//         setRecords([]);
//         setFilteredRecords([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRecords();
//   }, [activeYear]);

//   // Format date as DD/MM/YYYY
//   const formatDate = (dateString) => {
//     try {
//       const date = new Date(dateString);
//       return date.toLocaleDateString("en-GB", {
//         day: "2-digit",
//         month: "2-digit",
//         year: "numeric",
//       });
//     } catch (error) {
//       console.error("Error formatting date:", error, dateString);
//       return "Invalid date";
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-60">
//         <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-6xl mx-auto">
//       <div className="mb-8 text-center">
//         <h2 className="text-3xl font-bold text-indigo-900 mb-4">
//           CoSA Tenure Team
//         </h2>
//         {filteredRecords.length != 0 && (
//           <>
//             <p className="text-slate-600 max-w-2xl mx-auto mb-6">
//               Meet our dedicated team of student assistants who contribute to
//               the success of our program
//             </p>

//             <div className="text-sm text-indigo-700 mb-4">
//               Showing records for academic year:{" "}
//               {`20${activeYear.split("-")[0]}-20${activeYear.split("-")[1]}`}
//             </div>
//           </>
//         )}
//       </div>

//       {records.length === 0 ? (
//         <div className="text-center py-12 bg-white rounded-lg shadow-md">
//           <UserCircle className="w-16 h-16 text-indigo-200 mx-auto mb-4" />
//           <p className="text-lg text-slate-600 mb-2">
//             No records found in database
//           </p>
//           <p className="text-sm text-slate-500">
//             Please contact the administrator to add records
//           </p>
//         </div>
//       ) : filteredRecords.length === 0 ? (
//         <div className="text-center py-12 bg-white rounded-lg shadow-md">
//           <UserCircle className="w-16 h-16 text-indigo-200 mx-auto mb-4" />
//           <p className="text-lg text-slate-600 mb-2">
//             No records found for selected academic year
//           </p>
//           <p className="text-sm text-slate-500">
//             Please try a different academic year or contact the administrator
//           </p>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredRecords.map((record, index) => {
//             // Use the tenurePeriod directly from the record or create it if using startDate/endDate fields
//             let tenurePeriod = record.tenurePeriod;
//             if (!tenurePeriod && record.startDate && record.endDate) {
//               tenurePeriod = `${formatDate(record.startDate)} - ${formatDate(record.endDate)}`;
//             }

//             const studentName = record.studentName || "Unknown";
//             const studentID = record.studentID || "N/A";
//             const achievements =
//               record.achievements || "No achievements listed";

//             return (
//               <div
//                 key={record._id || index}
//                 className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
//               >
//                 <div className="h-48 bg-indigo-100 flex items-center justify-center">
//                   <UserCircle className="w-20 h-20 text-indigo-300" />
//                 </div>
//                 <div className="p-6">
//                   <h3 className="text-xl font-semibold text-indigo-900 mb-1">
//                     {studentName}
//                   </h3>
//                   <p className="text-indigo-600 font-medium mb-3">
//                     {record.role}
//                   </p>
//                   <p className="text-sm text-slate-500 mb-3">
//                     <span className="inline-flex items-center">
//                       <Calendar className="w-4 h-4 mr-1" />
//                       {tenurePeriod}
//                     </span>
//                   </p>
//                   <p
//                     className="text-sm text-slate-600 mb-4 line-clamp-3"
//                     title={achievements}
//                   >
//                     {achievements}
//                   </p>
//                   {record.email && (
//                     <a
//                       href={`mailto:${record.email}`}
//                       className="text-indigo-600 hover:text-indigo-800 text-sm font-medium inline-flex items-center"
//                     >
//                       <Mail className="w-4 h-4 mr-1" />
//                       Contact
//                     </a>
//                   )}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}
//       <ToastContainer position="top-right" autoClose={3000} />
//     </div>
//   );
// };
// export default CoSATenure;

// AddPositionPORPage.jsx
import React, { useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import AddPositionForm from "./AddPositionForm";
import AddPositionHolderForm from "./AddPositionHolderForm";

const CreateTenure = () => {
  return (
    <div className="bg-white min-h-screen p-8 text-black">
      <Tabs>
        <TabList className="flex space-x-4 border-b-2 border-gray-200">
          <Tab className="py-2 px-4 font-medium cursor-pointer border-b-2 border-transparent focus:outline-none [&.react-tabs__tab--selected]:border-[#4f46e5]">
            Add Position
          </Tab>
          <Tab className="py-2 px-4 font-medium cursor-pointer border-b-2 border-transparent focus:outline-none [&.react-tabs__tab--selected]:border-[#4f46e5]">
            Add Position Holder (POR)
          </Tab>
        </TabList>

        <TabPanel>
          <AddPositionForm />
        </TabPanel>
        <TabPanel>
          <AddPositionHolderForm />
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default CreateTenure;
