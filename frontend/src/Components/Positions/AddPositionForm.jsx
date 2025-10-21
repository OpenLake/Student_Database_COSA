import { useAdminContext } from "../../context/AdminContext";
import { usePositionForm } from "../../hooks/usePositions";
import { DynamicFieldArray, FormInput, FormSelect } from "./PositionCard";

const AddPositionForm = () => {
  const currentUser = useAdminContext();
  const {
    formData,
    setFormData,
    scopedUnits,
    isCoordinator,
    errors,
    isSubmitting,
    handleSubmit,
  } = usePositionForm(currentUser);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRequirementChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      requirements: { ...prev.requirements, [field]: value },
    }));
  };

  const handleArrayChange = (arrayName, index, value) => {
    setFormData((prev) => {
      const updatedArray = [...prev[arrayName]];
      updatedArray[index] = value;
      return { ...prev, [arrayName]: updatedArray };
    });
  };

  const handleRequirementArrayChange = (arrayName, index, value) => {
    setFormData((prev) => ({
      ...prev,
      requirements: {
        ...prev.requirements,
        [arrayName]: prev.requirements[arrayName].map((item, i) =>
          i === index ? value : item
        ),
      },
    }));
  };

  const addToArray = (arrayName) => {
    setFormData((prev) => ({
      ...prev,
      [arrayName]: [...prev[arrayName], ""],
    }));
  };

  const addToRequirementArray = (arrayName) => {
    setFormData((prev) => ({
      ...prev,
      requirements: {
        ...prev.requirements,
        [arrayName]: [...prev.requirements[arrayName], ""],
      },
    }));
  };

  const removeFromArray = (arrayName, index) => {
    setFormData((prev) => ({
      ...prev,
      [arrayName]: prev[arrayName].filter((_, i) => i !== index),
    }));
  };

  const removeFromRequirementArray = (arrayName, index) => {
    setFormData((prev) => ({
      ...prev,
      requirements: {
        ...prev.requirements,
        [arrayName]: prev.requirements[arrayName].filter((_, i) => i !== index),
      },
    }));
  };

  return (
    <div className="w-full bg-white flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full px-8 bg-white/80 backdrop-blur-sm rounded-2xl"
      >
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Position Title"
            required
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            placeholder="e.g., Core Member"
            error={errors.title}
          />

          {/* ADDED: Organizational Unit field */}
          <FormSelect
            label="Organizational Unit"
            required
            value={formData.unit_id}
            onChange={(e) => handleInputChange("unit_id", e.target.value)}
            error={errors.unit_id}
            options={[
              { value: "", label: "Select unit" },
              ...scopedUnits.map((unit) => ({
                value: unit._id,
                label: unit.name,
              })),
            ]}
            disabled={isCoordinator}
          />

          <FormSelect
            label="Position Type"
            required
            value={formData.position_type}
            onChange={(e) => handleInputChange("position_type", e.target.value)}
            error={errors.position_type}
            options={[
              { value: "", label: "Select type" },
              { value: "Core Member", label: "Core Member" },
              { value: "Member", label: "Member" },
              { value: "Team Lead", label: "Team Lead" },
              { value: "Coordinator", label: "Coordinator" },
              { value: "Volunteer", label: "Volunteer" },
              { value: "Intern", label: "Intern" },
              { value: "Other", label: "Other" },
            ]}
          />

          {/* ADDED: Custom position type field (shown when "Other" is selected) */}
          {formData.position_type === "Other" && (
            <FormInput
              label="Custom Position Type"
              required
              type="text"
              value={formData.custom_position_type}
              onChange={(e) =>
                handleInputChange("custom_position_type", e.target.value)
              }
              placeholder="Specify position type"
              error={errors.custom_position_type}
            />
          )}

          <FormInput
            label="Number of Positions"
            required
            type="number"
            min="1"
            value={formData.position_count}
            onChange={(e) =>
              handleInputChange("position_count", Number(e.target.value))
            }
            error={errors.position_count}
          />
        </div>

        {/* ADDED: Description field */}
        <div className="pt-4 border-t border-stone-200">
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="Describe the position..."
            rows="4"
            className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500"
          />
        </div>

        {/* ADDED: Requirements section */}
        <div className="pt-4 border-t border-stone-200">
          <h3 className="text-lg font-semibold text-stone-800 mb-4">
            Requirements
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <FormInput
              label="Minimum CGPA"
              type="number"
              step="0.1"
              min="0"
              max="10"
              value={formData.requirements.min_cgpa}
              onChange={(e) =>
                handleRequirementChange("min_cgpa", Number(e.target.value))
              }
            />

            <FormInput
              label="Minimum Year"
              type="number"
              min="1"
              max="5"
              value={formData.requirements.min_year}
              onChange={(e) =>
                handleRequirementChange("min_year", Number(e.target.value))
              }
            />
          </div>

          <DynamicFieldArray
            label="Skills Required"
            array={formData.requirements.skills_required}
            onUpdate={(index, value) =>
              handleRequirementArrayChange("skills_required", index, value)
            }
            onRemove={(index) =>
              removeFromRequirementArray("skills_required", index)
            }
            onAdd={() => addToRequirementArray("skills_required")}
          />
        </div>

        {/* Responsibilities */}
        <div className="pt-4 grid grid-cols-1 gap-y-6 border-t border-stone-200">
          <DynamicFieldArray
            label="Responsibilities"
            array={formData.responsibilities}
            onUpdate={(index, value) =>
              handleArrayChange("responsibilities", index, value)
            }
            onRemove={(index) => removeFromArray("responsibilities", index)}
            onAdd={() => addToArray("responsibilities")}
            error={errors.responsibilities}
          />
        </div>

        <div className="pt-5 flex flex-col sm:flex-row gap-4 border-t border-stone-200">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-stone-800 text-white py-2.5 px-4 rounded-lg hover:bg-stone-700 text-sm font-semibold transition-colors disabled:bg-stone-400"
          >
            {isSubmitting ? "Creating..." : "Create Position"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPositionForm;
