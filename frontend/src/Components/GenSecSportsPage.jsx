import { useState, useEffect } from "react";
import axios from "axios";

const backendUrl = process.env.REACT_APP_BACKEND_URL; // Use environment variable

export default function GenSecSportsPage() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${backendUrl}/skills/unendorsed/sport`);
      setSkills(res.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching skills:", err);
      setError("Failed to load sports skills. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const endorseSkill = async (skillId) => {
    try {
      await axios.put(`${backendUrl}/skills/endorse-sport/${skillId}`);
      setSkills(skills.filter((skill) => skill._id !== skillId));
    } catch (err) {
      console.error("Error endorsing skill:", err);
      alert("Failed to endorse sports skill. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Sports Skills Pending Endorsement
        </h1>
        <p className="text-gray-600 mt-2">
          Review and endorse sports skills submitted by students
        </p>
      </header>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-red-700">
          <p>{error}</p>
          <button 
            onClick={fetchSkills}
            className="mt-2 text-sm font-medium underline"
          >
            Try again
          </button>
        </div>
      ) : skills.length === 0 ? (
        <div className="bg-gray-50 p-8 rounded-lg border border-gray-200 text-center">
          <p className="text-gray-600 font-medium">No unendorsed sports skills found</p>
          <p className="text-gray-500 text-sm mt-2">All current skills have been reviewed</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {skills.map((skill) => (
            <li 
              key={skill._id} 
              className="p-5 border border-gray-200 rounded-lg hover:shadow-md transition-shadow bg-white"
            >
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div className="flex-grow">
                  <p className="text-lg font-semibold text-gray-800">{skill.skillName}</p>
                  <div className="mt-1 flex flex-col md:flex-row md:items-center text-gray-600 text-sm">
                    <span className="font-medium">Student:</span>
                    <span className="md:ml-2">{skill.student.name}</span>
                    <span className="md:ml-2 text-gray-500">({skill.student.ID_No})</span>
                  </div>
                </div>
                <button
                  className="px-5 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors shadow-sm whitespace-nowrap"
                  onClick={() => endorseSkill(skill._id)}
                >
                  Endorse Skill
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      
      <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between items-center">
        <button
          onClick={fetchSkills}
          className="text-red-600 hover:text-red-800 font-medium flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
            <path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0z"></path>
            <path d="M12 7v5l2.5 2.5"></path>
          </svg>
          Refresh
        </button>
        <span className="text-sm text-gray-500">
          {skills.length} skill{skills.length !== 1 ? 's' : ''} pending review
        </span>
      </div>
    </div>
  );
}