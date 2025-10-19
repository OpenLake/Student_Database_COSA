import React from "react";
import { X, ChevronDown } from "lucide-react";

const SkillFormModal = ({
  showForm,
  formData,
  newSkillData,
  showNewSkillForm,
  skills,
  positions,
  loading,
  onSkillChange,
  onFormDataChange,
  onNewSkillDataChange,
  onSubmit,
  onClose,
}) => {
  if (!showForm) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl border border-[#DCD3C9]">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#DCD3C9]">
          <h2 className="text-xl font-bold text-[#5E4B3D]">Add New Skill</h2>
          <button
            onClick={onClose}
            className="text-[#A98B74] hover:text-[#7D6B5F] p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-5">
          {/* Skill Selection */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-[#5E4B3D]">
              Select Skill
            </label>
            <div className="relative">
              <select
                value={formData.skill_id}
                onChange={(e) => onSkillChange(e.target.value)}
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

          {/* New Skill Form */}
          {showNewSkillForm && (
            <div className="p-4 bg-[#F5F1EC] border border-[#DCD3C9] rounded-lg space-y-4">
              <h3 className="font-semibold text-[#5E4B3D] text-sm">
                Create New Skill
              </h3>

              <div>
                <label className="block text-sm mb-2 font-medium text-[#5E4B3D]">
                  Skill Name *
                </label>
                <input
                  type="text"
                  value={newSkillData.name}
                  onChange={(e) =>
                    onNewSkillDataChange({ name: e.target.value })
                  }
                  className="w-full p-3 border border-[#DCD3C9] rounded-lg focus:ring-2 focus:ring-[#A98B74] focus:border-[#A98B74] text-[#5E4B3D]"
                  placeholder="Enter skill name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm mb-2 font-medium text-[#5E4B3D]">
                  Category *
                </label>
                <input
                  type="text"
                  value={newSkillData.category}
                  onChange={(e) =>
                    onNewSkillDataChange({ category: e.target.value })
                  }
                  className="w-full p-3 border border-[#DCD3C9] rounded-lg focus:ring-2 focus:ring-[#A98B74] focus:border-[#A98B74] text-[#5E4B3D]"
                  placeholder="e.g., Programming, Design"
                  required
                />
              </div>

              <div>
                <label className="block text-sm mb-2 font-medium text-[#5E4B3D]">
                  Type *
                </label>
                <select
                  value={newSkillData.type}
                  onChange={(e) =>
                    onNewSkillDataChange({ type: e.target.value })
                  }
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
                <label className="block text-sm mb-2 font-medium text-[#5E4B3D]">
                  Description
                </label>
                <textarea
                  value={newSkillData.description}
                  onChange={(e) =>
                    onNewSkillDataChange({ description: e.target.value })
                  }
                  className="w-full p-3 border border-[#DCD3C9] rounded-lg focus:ring-2 focus:ring-[#A98B74] focus:border-[#A98B74] text-[#5E4B3D]"
                  rows={3}
                  placeholder="Optional: A brief description"
                />
              </div>
            </div>
          )}

          {/* Proficiency Level */}
          <div>
            <label className="block text-sm mb-2 font-semibold text-[#5E4B3D]">
              Proficiency Level *
            </label>
            <select
              value={formData.proficiency_level}
              onChange={(e) =>
                onFormDataChange({ proficiency_level: e.target.value })
              }
              className="w-full p-3 border border-[#DCD3C9] rounded-lg focus:ring-2 focus:ring-[#A98B74] focus:border-[#A98B74] text-[#5E4B3D]"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>
          </div>

          {/* Associated Position */}
          <div>
            <label className="block text-sm mb-2 font-semibold text-[#5E4B3D]">
              Associated Position (Optional)
            </label>
            <select
              value={formData.position_id}
              onChange={(e) =>
                onFormDataChange({ position_id: e.target.value })
              }
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

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 border-t border-[#DCD3C9]">
            <button
              onClick={onClose}
              className="flex-1 bg-white border border-[#DCD3C9] text-[#7D6B5F] py-3 rounded-lg hover:bg-[#F5F1EC] transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={onSubmit}
              disabled={loading}
              className="flex-1 bg-[#A98B74] text-white py-3 rounded-lg hover:bg-[#856A5D] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? "Adding..." : "Add Skill"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillFormModal;