import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../utils/api";

const inputStyles =
  "w-full p-2 mt-1 bg-white border border-stone-300 rounded-lg text-sm text-stone-900 placeholder-stone-400 focus:ring-1 focus:ring-stone-400 focus:border-stone-400 transition";
const labelStyles = "text-sm font-medium text-stone-600";

function CreateAnnouncement() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submitForm = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    const formData = new FormData(e.target);
    const data = {
      title: formData.get("title"),
      content: formData.get("content"),
      type: formData.get("type"),
      isPinned: formData.get("isPinned") === "on",
    };

    try {
      const res = await api.post(`/api/announcements`, data);
      if (res.status === 201 || res.status === 200) {
        navigate("/announcements");
      } else {
        setError("Failed to create announcement.");
      }
    } catch (err) {
      console.error("Create announcement error:", err);
      setError(err.response?.data?.message || "Failed to create announcement.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FDFAE2] flex items-start justify-center p-6 font-sans">
      <form
        onSubmit={submitForm}
        className="w-full max-w-2xl p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-stone-200 space-y-6"
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold text-stone-800">
            Create Announcement
          </h2>
          <p className="text-stone-500 text-sm">
            Publish an announcement to your community.
          </p>
        </div>

        {error && <div className="text-red-600 text-sm">{error}</div>}

        <div>
          <label className={labelStyles} htmlFor="title">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            className={inputStyles}
            type="text"
            id="title"
            name="title"
            required
          />
        </div>

        <div>
          <label className={labelStyles} htmlFor="content">
            Content <span className="text-red-500">*</span>
          </label>
          <textarea
            className={inputStyles}
            id="content"
            name="content"
            rows={6}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelStyles} htmlFor="type">
              Type
            </label>
            <select
              className={inputStyles}
              id="type"
              name="type"
              defaultValue="General"
            >
              <option value="General">General</option>
              <option value="Event">Event</option>
              <option value="Organizational Unit">Organizational Unit</option>
              <option value="Position">Position</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <input
              id="isPinned"
              name="isPinned"
              type="checkbox"
              className="w-4 h-4"
            />
            <label className="text-sm text-stone-700" htmlFor="isPinned">
              Pin Announcement
            </label>
          </div>
        </div>

        <div className="pt-4 flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-stone-800 text-white py-2.5 px-4 rounded-lg hover:bg-stone-700 text-sm font-semibold transition-colors disabled:bg-stone-400"
          >
            {isSubmitting ? "Creating..." : "Create Announcement"}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 py-2.5 px-4 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-100 text-sm font-semibold transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateAnnouncement;
