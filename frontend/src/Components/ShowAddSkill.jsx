import { useState } from "react";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_BACKEND_URL; // Use environment variable

export function ShowSkills() {
  const [id, setId] = useState("");
  const [skills, setSkills] = useState([]);
  const [error, setError] = useState("");

  const fetchSkills = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/skills/${id}`);
      setSkills(response.data);
      setError("");
    } catch (err) {
      setError("Skills not found or invalid ID");
      setSkills([]);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <input
        type="text"
        className="border p-2 w-full rounded"
        placeholder="Enter Student ID"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 mt-2 rounded w-full"
        onClick={fetchSkills}
      >
        Show Skills
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      <ul className="mt-4">
        {skills.map((skill) => (
          <li key={skill._id} className="p-2 border-b">
            {skill.skillName} ({skill.skillType}) -{" "}
            {skill.endorsed ? "✅ Endorsed" : "❌ Not Endorsed"}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function AddSkill() {
  const [id, setId] = useState("");
  const [skillName, setSkillName] = useState("");
  const [skillType, setSkillType] = useState("tech");
  const [message, setMessage] = useState("");

  const addSkill = async () => {
    try {
      await axios.post(`${BASE_URL}/skills`, {
        studentId: id,
        skillName,
        skillType,
      });
      setMessage("Skill added successfully!");
    } catch (err) {
      setMessage("Error adding skill.");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <input
        type="text"
        className="border p-2 w-full rounded mb-2"
        placeholder="Enter Student ID"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />
      <input
        type="text"
        className="border p-2 w-full rounded mb-2"
        placeholder="Skill Name"
        value={skillName}
        onChange={(e) => setSkillName(e.target.value)}
      />
      <select
        className="border p-2 w-full rounded mb-2"
        value={skillType}
        onChange={(e) => setSkillType(e.target.value)}
      >
        <option value="tech">Tech</option>
        <option value="acad">Academic</option>
        <option value="sport">Sport</option>
        <option value="cultural">Cultural</option>
      </select>
      <button
        className="bg-green-500 text-white px-4 py-2 w-full rounded"
        onClick={addSkill}
      >
        Add Skill
      </button>
      {message && <p className="text-blue-500 mt-2">{message}</p>}
    </div>
  );
}
