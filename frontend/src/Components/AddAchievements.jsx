import React, { useState, useEffect } from "react";
import {
  Calendar,
  Award,
  FileText,
  MapPin,
  Trophy,
  Tag,
  Star,
} from "lucide-react";
import { AdminContext } from "../context/AdminContext";
import api from "../utils/api";
export default function AchievementForm() {
  const { isUserLoggedIn } = React.useContext(AdminContext);
  const [formData, setFormData] = useState({
    user_id: isUserLoggedIn._id,
    title: "",
    description: "",
    category: "",
    type: "",
    level: "",
    event_id: "",
    date_achieved: "",
    position: "",
    certificate_url: "",
  });
  const [events, setEvents] = useState([]);
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get("/api/events/events");
        setEvents(response.data);
        console.log("Events:", response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
        setEvents([]);
      }
    };
    fetchEvents();
  }, []);

  const types = ["academic", "cultural", "sports", "technical", "other"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(`/api/achievements/add`, formData);
      alert("Achievement submitted successfully!");
      setFormData({
        title: "",
        description: "",
        category: "",
        type: "",
        level: "",
        date_achieved: "",
        position: "",
        certificate_url: "",
        event_id: "",
      });
    } catch (error) {
      console.error("Error submitting achievement:", error);
      alert(
        "Error submitting achievement: " +
          (error.response?.data.message || error.message),
      );
    }
  };

  return (
    <div className="min-h-screen bg-white py-4 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-2">
              <div className="bg-black rounded-full p-2">
                <Trophy className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-black mb-1">
              Add New Achievement
            </h1>
            <p className="text-gray-600">
              Record your academic and extracurricular accomplishments
            </p>
          </div>

          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="flex items-center text-sm font-medium text-black mb-2">
                <Award className="w-4 h-4 mr-2" />
                Achievement Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., First Place in Science Fair"
                className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="flex items-center text-sm font-medium text-black mb-2">
                <FileText className="w-4 h-3 mr-1" />
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Provide details about your achievement..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all resize-none"
              />
            </div>

            {/* Category and Type Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center text-sm font-medium text-black mb-2">
                  <Tag className="w-4 h-4 mr-2" />
                  Category *
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  placeholder="Enter Category"
                  className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-black mb-2">
                  <Star className="w-4 h-4 mr-2" />
                  Type*
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                  required
                >
                  <option value="">Select Type</option>
                  {types.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-black mb-2">
                <Trophy className="w-4 h-4 mr-2" />
                Event
              </label>
              <select
                name="event_id"
                value={formData.event_id}
                onChange={handleInputChange}
                className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
              >
                <option value="">Select Event (optional)</option>
                {events.map((event) => (
                  <option key={event._id} value={event._id}>
                    {event.title} - {event.organizing_unit_id.name}
                  </option>
                ))}
              </select>
            </div>
            {/* Level and Position Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center text-sm font-medium text-black mb-2">
                  <MapPin className="w-4 h-4 mr-2" />
                  Level
                </label>
                <input
                  type="text"
                  name="level"
                  value={formData.level}
                  onChange={handleInputChange}
                  placeholder="Enter achievement level"
                  className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-black mb-2">
                  <Trophy className="w-4 h-4 mr-2" />
                  Position/Rank
                </label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  placeholder="e.g., 1st, 2nd, Winner"
                  className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            {/* Date Achieved */}
            <div>
              <label className="flex items-center text-sm font-medium text-black mb-2">
                <Calendar className="w-4 h-4 mr-2" />
                Date Achieved *
              </label>
              <input
                type="date"
                name="date_achieved"
                value={formData.date_achieved}
                onChange={handleInputChange}
                className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                required
              />
            </div>

            {/* Certificate URL */}
            <div>
              <label className="flex items-center text-sm font-medium text-black mb-2">
                <FileText className="w-4 h-4 mr-2" />
                Certificate/Document URL
              </label>
              <input
                type="url"
                name="certificate_url"
                value={formData.certificate_url}
                onChange={handleInputChange}
                placeholder="https://example.com/certificate.pdf"
                className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
              />
              <p className="text-xs text-gray-500 mt-1">
                Upload your certificate to a cloud service and paste the link
                here
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                onClick={handleSubmit}
                className="w-full bg-black text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <Trophy className="w-5 h-5" />
                <span>Submit Achievement</span>
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
}
