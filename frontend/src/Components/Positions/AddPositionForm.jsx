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

  const handleArrayChange = (arrayName, index, value) => {
    setFormData((prev) => {
      const updatedArray = [...prev[arrayName]];
      updatedArray[index] = value;
      return { ...prev, [arrayName]: updatedArray };
    });
  };

  const addToArray = (arrayName) => {
    setFormData((prev) => ({
      ...prev,
      [arrayName]: [...prev[arrayName], ""],
    }));
  };

  const removeFromArray = (arrayName, index) => {
    setFormData((prev) => ({
      ...prev,
      [arrayName]: prev[arrayName].filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="w-full bg-white flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full px-8 bg-white/80 backdrop-blur-sm rounded-2xl"
      >
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

        <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 border-t border-stone-200">
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
