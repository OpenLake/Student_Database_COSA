import React, { useState, useEffect, useContext, useMemo } from "react";
import api from "../../utils/api";
import { AdminContext } from "../../context/AdminContext";
import { Plus, X, ChevronDown, Calendar, CheckCircle2, CircleOff, User } from "lucide-react";

const SkillManagement = () => {
  const [skills, setSkills] = useState([]);
  const [userSkills, setUserSkills] = useState([]);
  const [positions, setPositions] = useState([]);
  const [filteredSkills, setFilteredSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Filters State
  const [selectedType, setSelectedType] = useState("All"); // Changed from selectedCategory
  const [selectedProficiency, setSelectedProficiency] = useState("All");
  const [selectedEndorsement, setSelectedEndorsement] = useState("All");

  const { isUserLoggedIn } = useContext(AdminContext);

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
        const [skillsRes, positionsRes] = await Promise.all([
          api.get(`/api/skills/get-skills`),
          api.get(`/api/positions/get-all`),
        ]);
        setSkills(skillsRes.data);
        setPositions(positionsRes.data);
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
        const userSkillsRes = await api.get(`/api/skills/user-skills/${isUserLoggedIn._id}`);
        setUserSkills(userSkillsRes.data);
        setFilteredSkills(userSkillsRes.data);
      } catch (error) {
        console.error("Failed to fetch user skills:", error);
      }
    };
    fetchUserSkills();
  }, [isUserLoggedIn]);

  // Memoized lists for filter dropdowns
  const { types, proficiencies, endorsementStatuses } = useMemo(() => {
    // Changed to pull 'type' instead of 'category'
    const uniqueTypes = [...new Set(userSkills.map(us => us.skill_id?.type).filter(Boolean))];
    const profs = ["Beginner", "Intermediate", "Advanced", "Expert"];
    const endorsements = ["Endorsed", "Not Endorsed"];
    return { types: uniqueTypes, proficiencies: profs, endorsementStatuses: endorsements };
  }, [userSkills]);

  // Apply filters
  useEffect(() => {
    let filtered = userSkills;
    
    // Updated to filter by 'type'
    if (selectedType !== "All") {
      filtered = filtered.filter(us => us.skill_id?.type === selectedType);
    }
    if (selectedProficiency !== "All") {
      filtered = filtered.filter(us => us.proficiency_level?.toLowerCase() === selectedProficiency.toLowerCase());
    }
    if (selectedEndorsement !== "All") {
      const isEndorsed = selectedEndorsement === "Endorsed";
      filtered = filtered.filter(us => us.is_endorsed === isEndorsed);
    }
    
    setFilteredSkills(filtered);
  }, [selectedType, selectedProficiency, selectedEndorsement, userSkills]); // Updated dependency

  const handleSkillChange = (skillId) => {
    setFormData((prev) => ({ ...prev, skill_id: skillId }));
    setShowNewSkillForm(skillId === "other");
  };

  const resetForm = () => {
    setFormData({ skill_id: "", proficiency_level: "beginner", position_id: "" });
    setNewSkillData({ name: "", category: "", type: "technical", description: "" });
    setShowForm(false);
    setShowNewSkillForm(false);
  };
  
  const handleSubmit = async () => {
    if (!formData.skill_id) return alert("Please select a skill.");
    if (showNewSkillForm && (!newSkillData.name.trim() || !newSkillData.category.trim())) return alert("Please fill all required fields for the new skill.");

    setLoading(true);
    try {
      let skillIdToUse = formData.skill_id;
      if (showNewSkillForm) {
        const newSkillResponse = await api.post(`/api/skills/create-skill`, newSkillData);
        skillIdToUse = newSkillResponse.data._id;
      }
      await api.post(`/api/skills/create-user-skill`, {
        user_id: isUserLoggedIn._id,
        skill_id: skillIdToUse,
        proficiency_level: formData.proficiency_level,
        position_id: formData.position_id || null,
      });
      const userSkillsRes = await api.get(`/api/skills/user-skills/${isUserLoggedIn._id}`);
      setUserSkills(userSkillsRes.data);
      alert("Skill added successfully!");
      resetForm();
    } catch (error) {
      console.error("Error adding skill:", error);
      alert("Error adding skill. It might already exist in your profile.");
    } finally {
      setLoading(false);
    }
  };

  const getProficiencyColor = (level) => {
    const colors = {
      beginner: "bg-blue-100 text-blue-800",
      intermediate: "bg-yellow-100 text-yellow-800",
      advanced: "bg-orange-100 text-orange-800",
      expert: "bg-red-100 text-red-800",
    };
    return colors[level?.toLowerCase()] || "bg-gray-100 text-gray-800";
  };
  
  const FilterDropdown = ({ label, value, onChange, options }) => (
    <div>
      <label className="block text-sm font-medium text-[#7D6B5F] mb-1">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-3 pr-10 py-2 border border-[#DCD3C9] rounded-lg focus:ring-2 focus:ring-[#A98B74] focus:border-[#A98B74] appearance-none bg-white text-[#5E4B3D]"
        >
          <option>All</option>
          {options.map(opt => <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>)}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#A98B74] w-4 h-4 pointer-events-none" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFAE2] p-6 sm:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="grid grid-cols-[1fr_auto] items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-[#5E4B3D] mb-1">
              Skills Management
            </h2>
            <p className="text-[#7D6B5F]">
              Manage your professional and personal skills
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-[#5E4B3D] text-white px-5 py-2.5 rounded-lg hover:bg-opacity-90 transition-colors font-medium shadow"
          >
            <Plus className="w-4 h-4" />
            Add Skill
          </button>
        </div>
        
        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 p-4 bg-white rounded-lg border border-[#DCD3C9]">
          <FilterDropdown label="Type" value={selectedType} onChange={setSelectedType} options={types} />
          <FilterDropdown label="Proficiency" value={selectedProficiency} onChange={setSelectedProficiency} options={proficiencies} />
          <FilterDropdown label="Endorsement" value={selectedEndorsement} onChange={setSelectedEndorsement} options={endorsementStatuses} />
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl border border-[#DCD3C9]">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#DCD3C9]">
                <h2 className="text-xl font-bold text-[#5E4B3D]">Add New Skill</h2>
                <button onClick={resetForm} className="text-[#A98B74] hover:text-[#7D6B5F] p-1"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-5">
                <div>
                  <label className="block mb-2 text-sm font-semibold text-[#5E4B3D]">
                    Select Skill
                  </label>
                  <div className="relative">
                    <select
                      value={formData.skill_id}
                      onChange={(e) => handleSkillChange(e.target.value)}
                      className="w-full p-3 border border-[#DCD3C9] rounded-lg focus:ring-2 focus:ring-[#A98B74] focus:border-[#A98B74] appearance-none bg-white text-[#5E4B3D]"
                    >
                      <option value="">Choose a skill...</option>
                      {skills.map((skill) => (
                        <option key={skill._id} value={skill._id}>
                          {skill.name} ({skill.category})
                        </option>
                      ))}
                      <option value="other">+ Add new skill</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#A98B74] w-4 h-4 pointer-events-none" />
                  </div>
                </div>

                {showNewSkillForm && (
                  <div className="p-4 bg-[#F5F1EC] border border-[#DCD3C9] rounded-lg space-y-4">
                    <h3 className="font-semibold text-[#5E4B3D] text-sm">
                      Create New Skill
                    </h3>
                    {[
                      { label: 'Skill Name', name: 'name', placeholder: 'Enter skill name', type: 'text' },
                      { label: 'Category', name: 'category', placeholder: 'e.g., Programming, Design', type: 'text' }
                    ].map(field => (
                      <div key={field.name}>
                        <label className="block text-sm mb-2 font-medium text-[#5E4B3D]">{field.label} *</label>
                        <input
                          type={field.type}
                          value={newSkillData[field.name]}
                          onChange={(e) => setNewSkillData(prev => ({ ...prev, [field.name]: e.target.value }))}
                          className="w-full p-3 border border-[#DCD3C9] rounded-lg focus:ring-2 focus:ring-[#A98B74] focus:border-[#A98B74] text-[#5E4B3D]"
                          placeholder={field.placeholder}
                          required
                        />
                      </div>
                    ))}
                    <div>
                      <label className="block text-sm mb-2 font-medium text-[#5E4B3D]">Type *</label>
                      <select
                        value={newSkillData.type}
                        onChange={(e) => setNewSkillData(prev => ({...prev, type: e.target.value}))}
                        className="w-full p-3 border border-[#DCD3C9] rounded-lg focus:ring-2 focus:ring-[#A98B74] focus:border-[#A98B74] text-[#5E4B3D]"
                        required
                      >
                        <option value="technical">Technical</option>
                        <option value="cultural">Cultural</option>
                        <option value="sports">Sports</option>
                        <option value="academic">Academic</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                     <div>
                       <label className="block text-sm mb-2 font-medium text-[#5E4B3D]">Description</label>
                       <textarea
                         value={newSkillData.description}
                         onChange={(e) => setNewSkillData(prev => ({...prev, description: e.target.value}))}
                         className="w-full p-3 border border-[#DCD3C9] rounded-lg focus:ring-2 focus:ring-[#A98B74] focus:border-[#A98B74] text-[#5E4B3D]"
                         rows={3}
                         placeholder="Optional: A brief description"
                       />
                     </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm mb-2 font-semibold text-[#5E4B3D]">Proficiency Level *</label>
                  <select
                    value={formData.proficiency_level}
                    onChange={(e) => setFormData(prev => ({ ...prev, proficiency_level: e.target.value }))}
                    className="w-full p-3 border border-[#DCD3C9] rounded-lg focus:ring-2 focus:ring-[#A98B74] focus:border-[#A98B74] text-[#5E4B3D]"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm mb-2 font-semibold text-[#5E4B3D]">Associated Position (Optional)</label>
                  <select
                    value={formData.position_id}
                    onChange={(e) => setFormData(prev => ({...prev, position_id: e.target.value }))}
                    className="w-full p-3 border border-[#DCD3C9] rounded-lg focus:ring-2 focus:ring-[#A98B74] focus:border-[#A98B74] text-[#5E4B3D]"
                  >
                    <option value="">No specific position</option>
                    {positions.map((pos) => (
                      <option key={pos._id} value={pos._id}>
                        {pos.title} - {pos.unit_id?.name || "No Unit"}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3 pt-6 border-t border-[#DCD3C9]">
                  <button
                    onClick={resetForm}
                    className="flex-1 bg-white border border-[#DCD3C9] text-[#7D6B5F] py-3 rounded-lg hover:bg-[#F5F1EC] transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-1 bg-[#A98B74] text-white py-3 rounded-lg hover:bg-[#856A5D] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    {loading ? "Adding..." : "Add Skill"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredSkills.map((userSkill) => (
            <div key={userSkill._id} className="bg-white border border-[#DCD3C9] p-4 rounded-lg shadow-sm hover:shadow-md hover:border-[#A98B74] transition-all">
              <div className="grid grid-cols-2 gap-4 items-center">
                {/* Left Side */}
                <div className="flex flex-col gap-1">
                  <h5 className="font-bold text-base text-[#5E4B3D] truncate">
                    {userSkill.skill_id?.name || "Unnamed Skill"}
                  </h5>
                  <div className="flex items-center gap-2 text-sm text-[#7D6B5F]">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(userSkill.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                {/* Right Side */}
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getProficiencyColor(userSkill.proficiency_level)}`}>
                    {userSkill.proficiency_level?.charAt(0).toUpperCase() + userSkill.proficiency_level?.slice(1)}
                  </span>
                  {userSkill.is_endorsed ? (
                    <div className="flex items-center gap-1.5 text-sm text-green-600 font-medium">
                      <CheckCircle2 className="w-4 h-4"/>
                      <span>Endorsed</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-sm text-[#7D6B5F] font-medium">
                      <CircleOff className="w-4 h-4"/>
                      <span>Not Endorsed</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State for No Filter Results */}
        {userSkills.length > 0 && filteredSkills.length === 0 && (
          <div className="text-center py-16 bg-white border border-[#DCD3C9] rounded-lg">
            <h3 className="text-lg font-semibold text-[#5E4B3D] mb-2">No Skills Found</h3>
            <p className="text-[#7D6B5F] max-w-sm mx-auto">
              No skills match your current filter criteria. Try adjusting your filters.
            </p>
          </div>
        )}

        {/* Empty State for No Skills Added */}
        {userSkills.length === 0 && (
           <div className="text-center py-16 bg-white border border-[#DCD3C9] rounded-lg">
             <div className="w-16 h-16 bg-[#F5F1EC] rounded-full flex items-center justify-center mx-auto mb-4">
               <User className="w-8 h-8 text-[#A98B74]" />
             </div>
             <h3 className="text-lg font-semibold text-[#5E4B3D] mb-2">No skills added yet</h3>
             <p className="text-[#7D6B5F] mb-6 max-w-sm mx-auto">
               Click "Add Skill" to start building your professional profile.
             </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillManagement;