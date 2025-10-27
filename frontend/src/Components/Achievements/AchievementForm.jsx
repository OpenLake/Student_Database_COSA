import {
  Award,
  Calendar,
  FileText,
  MapPin,
  Star,
  Tag,
  Trophy,
} from "lucide-react";
import { useAchievementForm } from "../../hooks/useAchievements";

const FormField = ({ label, icon: Icon, children, required = false }) => (
  <div>
    <label className="flex items-center gap-2 text-sm font-medium text-black mb-2"
    style={{ display: "inline-flex", alignItems: "center" }}>
      {Icon && <Icon className="w-4 h-4 shrink-0" />}
      <span>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </span>
    </label>
    {children}
  </div>
);


const Input = ({
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}) => (
  <input
    type={type}
    name={name}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className="w-full px-2 py-2 border-2 border-black rounded-md bg-white text-black focus:outline-none"
    required={required}
  />
);

const TextArea = ({ name, value, onChange, placeholder, rows = 4 }) => (
  <textarea
    name={name}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    rows={rows}
    className="w-full px-2 py-2 border-2 border-black rounded-md bg-white text-black focus:outline-none"
  />
);

const Select = ({
  name,
  value,
  onChange,
  options,
  placeholder,
  required = false,
}) => (
  <select
    name={name}
    value={value}
    onChange={onChange}
    className="w-full px-2 py-2 border-2 border-black rounded-md bg-white text-black focus:outline-none"
    required={required}
  >
    <option value="">{placeholder}</option>
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);

const AchievementForm = () => {
  const { formData, events, loading, updateFormData, submitAchievement } =
    useAchievementForm();

  const types = ["academic", "cultural", "sports", "technical", "other"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await submitAchievement();
    alert(result.message);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg p-8">
          <div className="space-y-4">
            {/* Title */}
            <FormField label="Achievement Title" icon={Award} required>
              <Input
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., First Place in Science Fair"
                required
              />
            </FormField>

            {/* Description */}
            <FormField label="Description" icon={FileText}>
              <TextArea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Provide details about your achievement..."
              />
            </FormField>

            {/* Category and Type Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Category" icon={Tag} required>
                <Input
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  placeholder="Enter Category"
                />
              </FormField>

              <FormField label="Type" icon={Star} required>
                <Select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  options={types.map((t) => ({ value: t, label: t }))}
                  placeholder="Select Type"
                  required
                />
              </FormField>
            </div>

            {/* Event */}
            <FormField label="Event" icon={Trophy}>
              <Select
                name="event_id"
                value={formData.event_id}
                onChange={handleInputChange}
                options={events.map((e) => ({
                  value: e._id,
                  label: `${e.title} - ${e.organizing_unit_id.name}`,
                }))}
                placeholder="Select Event (optional)"
              />
            </FormField>

            {/* Level and Position Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Level" icon={MapPin}>
                <Input
                  name="level"
                  value={formData.level}
                  onChange={handleInputChange}
                  placeholder="Enter achievement level"
                />
              </FormField>

              <FormField label="Position/Rank" icon={Trophy}>
                <Input
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  placeholder="e.g., 1st, 2nd, Winner"
                />
              </FormField>
            </div>

            {/* Date Achieved */}
            <FormField label="Date Achieved" icon={Calendar} required>
              <Input
                type="date"
                name="date_achieved"
                value={formData.date_achieved}
                onChange={handleInputChange}
                required
              />
            </FormField>

            {/* Certificate URL */}
            <FormField label="Certificate/Document URL" icon={FileText}>
              <Input
                type="url"
                name="certificate_url"
                value={formData.certificate_url}
                onChange={handleInputChange}
                placeholder="https://example.com/certificate.pdf"
              />
              <p className="text-xs text-gray-500 mt-1">
                Upload your certificate to a cloud service and paste the link
                here
              </p>
            </FormField>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`w-full bg-black text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center space-x-2 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <Trophy className="w-5 h-5" />
                <span>{loading ? "Submitting..." : "Submit Achievement"}</span>
              </button>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-600 text-center">
              <strong>Note:</strong> Your achievement will be reviewed for
              verification before being published to your profile.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementForm;
