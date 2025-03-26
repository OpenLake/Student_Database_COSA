import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BASE_URL = process.env.REACT_APP_BACKEND_URL;

export function ShowSkills() {
  const [id, setId] = useState("");
  const [skills, setSkills] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchSkills = async () => {
    if (!id.trim()) {
      setError("Please enter a student ID");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/skills/${id}`, {
        withCredentials: true,
      });
      setSkills(res.data);
      setError("");
    } catch (err) {
      setError("Skills not found or invalid ID");
      setSkills([]);
      if (error.status === 401 || error.status === 403) {
        navigate("/login", { replace: true });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto mt-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Student Skills
      </h2>
      <div className="flex gap-2">
        <input
          type="text"
          className="border border-gray-300 p-2 flex-grow rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter Student ID"
          value={id}
          onChange={(e) => setId(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchSkills()}
        />
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center justify-center"
          onClick={fetchSkills}
          disabled={loading}
        >
          {loading ? (
            <span className="inline-block animate-pulse">Loading...</span>
          ) : (
            "Show Skills"
          )}
        </button>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
          <p>{error}</p>
        </div>
      )}

      {skills.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold text-gray-700 mb-2">Skills List</h3>
          <ul className="bg-gray-50 rounded-md border border-gray-200 divide-y divide-gray-200">
            {skills.map((skill) => (
              <li
                key={skill._id}
                className="p-3 flex items-center justify-between hover:bg-gray-100"
              >
                <div>
                  <span className="font-medium">{skill.skillName}</span>
                  <span className="text-sm text-gray-500 ml-2">
                    ({skill.skillType})
                  </span>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${skill.endorsed ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                >
                  {skill.endorsed ? "✅ Endorsed" : "❌ Not Endorsed"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {skills.length === 0 && !error && !loading && id && (
        <p className="mt-4 text-gray-500 text-center py-4">
          No skills found for this student ID
        </p>
      )}
    </div>
  );
}

export function AddSkill() {
  const [id, setId] = useState("");
  const [skillName, setSkillName] = useState("");
  const [skillType, setSkillType] = useState("tech");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!id.trim()) {
      setMessage({ type: "error", text: "Student ID is required" });
      return false;
    }
    if (!skillName.trim()) {
      setMessage({ type: "error", text: "Skill name is required" });
      return false;
    }
    return true;
  };

  const addSkill = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await axios.post(`${BASE_URL}/skills`, {
        studentId: id,
        skillName,
        skillType,
      });
      setMessage({ type: "success", text: "Skill added successfully!" });
      setSkillName(""); // Clear the skill name for easier entry of multiple skills
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Error adding skill",
      });
    } finally {
      setLoading(false);
    }
  };

  const skillTypeOptions = [
    { value: "tech", label: "Technology", icon: "💻" },
    { value: "acad", label: "Academic", icon: "📚" },
    { value: "sport", label: "Sport", icon: "🏅" },
    { value: "cultural", label: "Cultural", icon: "🎭" },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto mt-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Add New Skill
      </h2>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="studentId"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Student ID
          </label>
          <input
            id="studentId"
            type="text"
            className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Student ID"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
        </div>

        <div>
          <label
            htmlFor="skillName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Skill Name
          </label>
          <input
            id="skillName"
            type="text"
            className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., React, Java, Photography"
            value={skillName}
            onChange={(e) => setSkillName(e.target.value)}
          />
        </div>

        <div>
          <label
            htmlFor="skillType"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Skill Type
          </label>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {skillTypeOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`p-2 border rounded-md flex items-center justify-center ${
                  skillType === option.value
                    ? "bg-blue-100 border-blue-500 text-blue-700"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => setSkillType(option.value)}
              >
                <span className="mr-2">{option.icon}</span>
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 w-full rounded-md mt-4 transition-colors duration-200 flex items-center justify-center"
        onClick={addSkill}
        disabled={loading}
      >
        {loading ? (
          <span className="inline-block animate-pulse">Saving...</span>
        ) : (
          "Add Skill"
        )}
      </button>

      {message.text && (
        <div
          className={`mt-4 p-3 ${
            message.type === "success"
              ? "bg-green-100 border-green-500 text-green-700"
              : "bg-red-100 border-red-500 text-red-700"
          } border-l-4 rounded`}
        >
          <p>{message.text}</p>
        </div>
      )}
    </div>
  );
}
