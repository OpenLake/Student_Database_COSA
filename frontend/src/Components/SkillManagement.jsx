import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AdminContext } from "../App";
import {
  Plus,
  X,
  ChevronDown,
  User,
  Award,
  Calendar,
  Tag,
  Code,
  BookOpen,
  Trophy,
  Users,
} from "lucide-react";

const SkillManagement = ({ userId }) => {
  const [skills, setSkills] = useState([]);
  const [userSkills, setUserSkills] = useState([]);
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const API_BASE = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

  const { isUserLoggedIn } = React.useContext(AdminContext);

  const [formData, setFormData] = useState({
    skill_id: "",
    proficiency_level: "beginner",
    position_id: "",
  });

  const [showNewSkillForm, setShowNewSkillForm] = useState(false);
  const [newSkillData, setNewSkillData] = useState({
    name: "",
    category: "",
    type: "technical",
    description: "",
  });

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const skillsRes = await axios.get(`${API_BASE}/api/skills/get-skills`);
        setSkills(skillsRes.data);
        const positionsRes = await axios.get(
          `${API_BASE}/api/positions/get-all`,
        );
        setPositions(positionsRes.data);

        console.log("Skills:", skillsRes.data);
        console.log("Positions:", positionsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Fetch user skills
  useEffect(() => {
    const fetchUserSkills = async () => {
      if (!isUserLoggedIn?._id) return;

      try {
        const userSkillsRes = await axios.get(
          `${API_BASE}/api/skills/user-skills/${isUserLoggedIn._id}`,
        );
        setUserSkills(userSkillsRes.data);
        console.log("User skills:", userSkillsRes.data);
      } catch (error) {
        console.error("Failed to fetch user skills:", error);
      }
    };

    fetchUserSkills();
  }, [isUserLoggedIn]);

  const handleSkillChange = (skillId) => {
    setFormData((prev) => ({ ...prev, skill_id: skillId }));
    setShowNewSkillForm(skillId === "other");
  };

  const resetForm = () => {
    setFormData({
      skill_id: "",
      proficiency_level: "beginner",
      position_id: "",
    });
    setNewSkillData({
      name: "",
      category: "",
      type: "technical",
      description: "",
    });
    setShowForm(false);
    setShowNewSkillForm(false);
  };

  const handleSubmit = async () => {
    if (!formData.skill_id) {
      alert("Please select a skill.");
      return;
    }

    if (
      formData.skill_id !== "other" &&
      !skills.find((s) => s._id === formData.skill_id)
    ) {
      alert("Please select a valid skill.");
      return;
    }

    if (
      showNewSkillForm &&
      (!newSkillData.name.trim() ||
        !newSkillData.category.trim() ||
        !newSkillData.type)
    ) {
      alert("Please fill all required fields in the new skill form.");
      return;
    }

    const existingSkill = userSkills.find(
      (us) =>
        us.skill_id._id === formData.skill_id ||
        (showNewSkillForm &&
          us.skill_id.name.toLowerCase() === newSkillData.name.toLowerCase()),
    );

    if (existingSkill) {
      alert("You have already added this skill.");
      return;
    }

    setLoading(true);
    try {
      let skillIdToUse = formData.skill_id;
      let skillRes = null;

      if (showNewSkillForm) {
        skillRes = await axios.post(`${API_BASE}/api/skills/create-skill`, {
          name: newSkillData.name.trim(),
          category: newSkillData.category.trim(),
          type: newSkillData.type,
          description: newSkillData.description || "",
        });
        skillIdToUse = skillRes.data._id;
      }

      const userSkillRes = await axios.post(
        `${API_BASE}/api/skills/create-user-skill`,
        {
          user_id: isUserLoggedIn._id,
          skill_id: skillIdToUse,
          proficiency_level: formData.proficiency_level,
          position_id: formData.position_id || null,
        },
      );

      const fullSkill = showNewSkillForm
        ? skillRes.data
        : skills.find((s) => s._id === skillIdToUse);

      const finalUserSkill = {
        ...userSkillRes.data,
        skill_id: fullSkill,
        position_id:
          positions.find((p) => p._id === formData.position_id) || null,
      };

      setUserSkills((prev) => [...prev, finalUserSkill]);
      alert("Skill added successfully!");
      resetForm();
    } catch (error) {
      console.error("Error adding skill:", error);
      alert("Error adding skill.");
    } finally {
      setLoading(false);
    }
  };

  const getProficiencyColor = (level) => {
    const colors = {
      beginner: "bg-gray-50 text-gray-700 border-gray-200",
      intermediate: "bg-gray-100 text-gray-800 border-gray-300",
      advanced: "bg-gray-900 text-white border-gray-900",
      expert: "bg-black text-white border-black",
    };
    return colors[level] || colors.beginner;
  };

  const getTypeIcon = (type) => {
    const icons = {
      technical: Code,
      cultural: Users,
      sports: Trophy,
      academic: BookOpen,
    };
    return icons[type] || Code;
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
          <div>
            <h1 className="text-3xl font-bold text-black mb-2">
              Skills Management
            </h1>
            <p className="text-gray-600">
              Manage your professional and personal skills
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
          >
            <Plus className="w-4 h-4" />
            Add Skill
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-black">Add New Skill</h2>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Inputs */}
              <div className="space-y-5">
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-900">
                    Select Skill
                  </label>
                  <div className="relative">
                    <select
                      value={formData.skill_id}
                      onChange={(e) => handleSkillChange(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black appearance-none bg-white"
                    >
                      <option value="">Choose a skill...</option>
                      {skills.map((skill) => (
                        <option key={skill._id} value={skill._id}>
                          {skill.name} ({skill.category})
                        </option>
                      ))}
                      <option value="other">+ Add new skill</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4 pointer-events-none" />
                  </div>
                </div>

                {showNewSkillForm && (
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-4">
                    <h3 className="font-semibold text-gray-900 text-sm">
                      Create New Skill
                    </h3>
                    <div>
                      <label className="block text-sm mb-2 font-medium text-gray-900">
                        Skill Name *
                      </label>
                      <input
                        type="text"
                        value={newSkillData.name}
                        onChange={(e) =>
                          setNewSkillData((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                        placeholder="Enter skill name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-2 font-medium text-gray-900">
                        Category *
                      </label>
                      <input
                        type="text"
                        value={newSkillData.category}
                        onChange={(e) =>
                          setNewSkillData((prev) => ({
                            ...prev,
                            category: e.target.value,
                          }))
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                        placeholder="e.g., Programming, Design, Marketing"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-2 font-medium text-gray-900">
                        Type *
                      </label>
                      <select
                        value={newSkillData.type}
                        onChange={(e) =>
                          setNewSkillData((prev) => ({
                            ...prev,
                            type: e.target.value,
                          }))
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                        required
                      >
                        <option value="technical">Technical</option>
                        <option value="cultural">Cultural</option>
                        <option value="sports">Sports</option>
                        <option value="academic">Academic</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm mb-2 font-medium text-gray-900">
                        Description
                      </label>
                      <textarea
                        value={newSkillData.description}
                        onChange={(e) =>
                          setNewSkillData((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                        rows={3}
                        placeholder="Optional description of the skill"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm mb-2 font-semibold text-gray-900">
                    Proficiency Level *
                  </label>
                  <select
                    value={formData.proficiency_level}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        proficiency_level: e.target.value,
                      }))
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm mb-2 font-semibold text-gray-900">
                    Associated Position (optional)
                  </label>
                  <select
                    value={formData.position_id}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        position_id: e.target.value,
                      }))
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                  >
                    <option value="">No specific position</option>
                    {positions.map((pos) => (
                      <option key={pos._id} value={pos._id}>
                        {pos.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3 pt-6 border-t border-gray-200">
                  <button
                    onClick={resetForm}
                    className="flex-1 bg-white border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-1 bg-black text-white py-3 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    {loading ? "Adding..." : "Add Skill"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Skills List */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-black">
              Your Skills ({userSkills.length})
            </h2>
          </div>

          {userSkills.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No skills added yet
              </h3>
              <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                Start building your professional skill profile to showcase your
                expertise
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
              >
                Add Your First Skill
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {userSkills.map((userSkill) => {
                const IconComponent = getTypeIcon(userSkill.skill_id.type);
                return (
                  <div
                    key={userSkill._id}
                    className="border border-gray-200 p-5 rounded-lg hover:shadow-md transition-all duration-200 hover:border-gray-300"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                            <IconComponent className="w-4 h-4 text-gray-600" />
                          </div>
                          <h3 className="font-semibold text-gray-900 text-lg">
                            {userSkill.skill_id.name}
                          </h3>
                          <span
                            className={`px-3 py-1 text-xs rounded-full font-medium border ${getProficiencyColor(
                              userSkill.proficiency_level,
                            )}`}
                          >
                            {userSkill.proficiency_level
                              .charAt(0)
                              .toUpperCase() +
                              userSkill.proficiency_level.slice(1)}
                          </span>
                        </div>

                        <div className="text-sm text-gray-600 flex gap-6 flex-wrap mb-3">
                          <span className="flex items-center gap-2">
                            <Tag className="w-3 h-3" />
                            {userSkill.skill_id.category}
                          </span>
                          <span className="flex items-center gap-2">
                            <Calendar className="w-3 h-3" />
                            {userSkill.created_at
                              ? new Date(
                                  userSkill.created_at,
                                ).toLocaleDateString()
                              : "N/A"}
                          </span>
                          {userSkill.position_id && (
                            <span className="flex items-center gap-2 text-black font-medium">
                              <User className="w-3 h-3" />
                              {userSkill.position_id.title}
                            </span>
                          )}
                          {userSkill.is_endorsed && (
                            <span className="flex items-center gap-2 text-gray-900 font-medium">
                              <Award className="w-3 h-3" />
                              Endorsed
                            </span>
                          )}
                          <span className="flex items-center gap-2">
                            <Award className="w-3 h-3" />
                            <span
                              className={
                                userSkill.is_endorsed
                                  ? "text-gray-900 font-medium"
                                  : "text-gray-500"
                              }
                            >
                              {userSkill.is_endorsed
                                ? "Endorsed"
                                : "Not Endorsed"}
                            </span>
                          </span>
                        </div>

                        {userSkill.skill_id.description && (
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {userSkill.skill_id.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkillManagement;
