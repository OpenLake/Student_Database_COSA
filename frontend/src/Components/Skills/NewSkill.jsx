import React from "react";

const NewSkill = () => {
  return (
    <div className="p-4 bg-[#F5F1EC] border border-[#DCD3C9] rounded-lg space-y-4">
      <h3 className="font-semibold text-black text-sm">Create New Skill</h3>

      <div>
        <label className="block text-sm mb-2 font-medium text-black">
          Skill Name *
        </label>
        <input
          type="text"
          value={newSkillData.name}
          onChange={(e) => updateNewSkillData({ name: e.target.value })}
          className="w-full p-3 border border-[#DCD3C9] rounded-lg focus:ring-2 focus:ring-black focus:border-black text-black"
          placeholder="Enter skill name"
          required
        />
      </div>

      <div>
        <label className="block text-sm mb-2 font-medium text-black">
          Category *
        </label>
        <input
          type="text"
          value={newSkillData.category}
          onChange={(e) => updateNewSkillData({ category: e.target.value })}
          className="w-full p-3 border border-[#DCD3C9] rounded-lg focus:ring-2 focus:ring-black focus:border-black text-black"
          placeholder="e.g., Programming, Design"
          required
        />
      </div>

      <div>
        <label className="block text-sm mb-2 font-medium text-black">
          Type *
        </label>
        <select
          value={newSkillData.type}
          onChange={(e) => updateNewSkillData({ type: e.target.value })}
          className="w-full p-3 border border-[#DCD3C9] rounded-lg focus:ring-2 focus:ring-black focus:border-black text-black"
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
        <label className="block text-sm mb-2 font-medium text-black">
          Description
        </label>
        <textarea
          value={newSkillData.description}
          onChange={(e) => updateNewSkillData({ description: e.target.value })}
          className="w-full p-3 border border-[#DCD3C9] rounded-lg focus:ring-2 focus:ring-black focus:border-black text-black"
          rows={3}
          placeholder="Optional: A brief description"
        />
      </div>
    </div>
  );
};

export default NewSkill;
