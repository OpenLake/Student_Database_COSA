import { useAnnouncementsForm } from "../../hooks/useAnnouncements";
import { useState, useEffect } from "react";

const CreateAnnouncementModal = ({ open, onClose, initialData, onSaved }) => {
  const {
    formData,
    setFormData,
    updateField,
    createAnnouncement,
    updateAnnouncement,
  } = useAnnouncementsForm();
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        content: initialData.content,
        type: initialData.type,
        isPinned: initialData.is_pinned,
        targetIdentifier: "",
      });
    }
  }, [initialData]);
  if (!open) return null;

  const submit = async () => {
    const res = !initialData
      ? await createAnnouncement()
      : await updateAnnouncement(initialData._id);
    if (res.success) {
      onSaved();
      onClose();
    } else {
      // Show error notification to user
      alert(res.message || "Failed to save announcement");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-4 rounded w-full max-w-lg">
        <h2 className="text-lg font-semibold mb-3">Create Announcement</h2>

        <input
          className="border w-full p-2 mb-2"
          placeholder="Title"
          value={formData.title}
          onChange={(e) => updateField("title", e.target.value)}
        />

        <textarea
          className="border w-full p-2 mb-2"
          placeholder="Content"
          rows={4}
          value={formData.content}
          onChange={(e) => updateField("content", e.target.value)}
        />

        <select
          className="border w-full p-2 mb-2"
          value={formData.type}
          onChange={(e) => updateField("type", e.target.value)}
        >
          <option value="General">General</option>
          <option value="Event">Event</option>
          <option value="Organizational_Unit">Organization</option>
          <option value="Position">Position</option>
        </select>

        {formData.type !== "General" && (
          <input
            className="border w-full p-2 mb-2"
            placeholder="Target ID Ex:CLUB_SWARA"
            value={formData.targetIdentifier}
            onChange={(e) => updateField("targetIdentifier", e.target.value)}
          />
        )}

        <label className="flex items-center gap-2 mb-3 text-sm">
          <input
            type="checkbox"
            checked={formData.isPinned}
            onChange={(e) => updateField("isPinned", e.target.checked)}
          />
          Pin announcement
        </label>

        <div className="flex justify-end gap-2">
          <button onClick={onClose}>Cancel</button>
          <button
            onClick={submit}
            className="bg-blue-600 text-white px-4 py-1 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateAnnouncementModal;
