import { useCallback, useState, useEffect } from "react";
import axios from "axios";
import gensecPageConfig from "../../config/endorseConfig";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

export default function GenSecEndorse({ role }) {
  const config = gensecPageConfig[role];

  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSkills = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${backendUrl}${config.fetchPath}`);
      setSkills(res.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching skills:", err);
      setError("Failed to load skills. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [config.fetchPath]);

  useEffect(() => {
    if (config) fetchSkills();
  }, [config, fetchSkills]);

  const endorseSkill = async (skillId) => {
    try {
      await axios.put(`${backendUrl}${config.endorsePathBase}${skillId}`);
      setSkills(skills.filter((skill) => skill._id !== skillId));
    } catch (err) {
      console.error("Error endorsing skill:", err);
      alert("Failed to endorse skill. Please try again.");
    }
  };

  if (!config) {
    return (
      <div className="text-center text-red-500 mt-10">
        Invalid GenSec role: <code>{role}</code>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          {config.title}
        </h1>
        <p className="text-gray-600 mt-2">{config.subtitle}</p>
      </header>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div
            className={`animate-spin rounded-full h-12 w-12 border-4 border-${config.themeColor}-500 border-t-transparent`}
          ></div>
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
          <p className="text-gray-600 font-medium">
            No unendorsed {role.toLowerCase()} skills found
          </p>
          <p className="text-gray-500 text-sm mt-2">
            All current skills have been reviewed
          </p>
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
                  <p className="text-lg font-semibold text-gray-800">
                    {skill.skillName}
                  </p>
                  <div className="mt-1 flex flex-col md:flex-row md:items-center text-gray-600 text-sm">
                    <span className="font-medium">Student:</span>
                    <span className="md:ml-2">{skill.student.name}</span>
                    <span className="md:ml-2 text-gray-500">
                      ({skill.student.ID_No})
                    </span>
                  </div>
                </div>
                <button
                  className={`px-5 py-2 bg-${config.themeColor}-600 text-white font-medium rounded-lg hover:bg-${config.themeColor}-700 focus:ring-2 focus:ring-${config.themeColor}-500 focus:ring-opacity-50 transition-colors shadow-sm whitespace-nowrap`}
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
          className={`text-${config.themeColor}-600 hover:text-${config.themeColor}-800 font-medium flex items-center`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mr-1"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            stroke="currentColor"
            fill="none"
          >
            <path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0z" />
            <path d="M12 7v5l2.5 2.5" />
          </svg>
          Refresh
        </button>
        <span className="text-sm text-gray-500">
          {skills.length} skill{skills.length !== 1 ? "s" : ""} pending review
        </span>
      </div>
    </div>
  );
}
