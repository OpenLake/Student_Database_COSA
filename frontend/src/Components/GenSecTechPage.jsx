import { useState, useEffect } from "react";
import axios from "axios";

export default function GenSecTechPage() {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const res = await axios.get("http://localhost:8000/skills/unendorsed/tech");
      setSkills(res.data);
    } catch (err) {
      console.error("Error fetching skills:", err);
    }
  };

  const endorseSkill = async (skillId) => {
    try {
      await axios.put(`http://localhost:8000/skills/endorse/${skillId}`);
      setSkills(skills.filter((skill) => skill._id !== skillId)); // Remove endorsed skill from UI
    } catch (err) {
      console.error("Error endorsing skill:", err);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Tech Skills Pending Endorsement</h2>
      {skills.length === 0 ? (
        <p>No unendorsed tech skills found.</p>
      ) : (
        <ul className="space-y-4">
          {skills.map((skill) => (
            <li key={skill._id} className="p-4 border rounded-lg flex justify-between items-center">
              <div>
                <p className="text-lg font-semibold">{skill.skillName}</p>
                <p className="text-sm text-gray-600">Student: {skill.student.name} ({skill.student.ID_No})</p>
              </div>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                onClick={() => endorseSkill(skill._id)}
              >
                Endorse
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
