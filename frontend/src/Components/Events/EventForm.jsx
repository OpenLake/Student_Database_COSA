import React, { useState, useEffect } from "react";
import Select from "react-select";
import api from "../../utils/api";

const EventForm = ({ event = null, onClose }) => {
  const [units, setUnits] = useState([]);
  const [users, setUsers] = useState([]);

  const [formData, setFormData] = useState({
    title: event?.title || "",
    description: event?.description || "",
    category: event?.category || "",
    type: event?.type || "",
    organizing_unit_id: event?.organizing_unit_id || "",
    organizers: event?.organizers?.map((o) => o._id) || [],
    schedule: {
      date: {
        start: event
          ? new Date(event.schedule.start).toISOString().slice(0, 10)
          : "",
        end: event
          ? new Date(event.schedule.end).toISOString().slice(0, 10)
          : "",
      },
      time: {
        start: event
          ? new Date(event.schedule.start).toTimeString().slice(0, 5)
          : "",
        end: event
          ? new Date(event.schedule.end).toTimeString().slice(0, 5)
          : "",
      },
      venue: event?.schedule?.venue || "",
      mode: event?.schedule?.mode || "",
    },
    registration: {
      required: event?.registration?.required || false,
      date: {
        start: event?.registration?.start
          ? new Date(event.registration.start).toISOString().slice(0, 10)
          : "",
        end: event?.registration?.end
          ? new Date(event.registration.end).toISOString().slice(0, 10)
          : "",
      },
      time: {
        start: event?.registration?.start
          ? new Date(event.registration.start).toTimeString().slice(0, 5)
          : "",
        end: event?.registration?.end
          ? new Date(event.registration.end).toTimeString().slice(0, 5)
          : "",
      },
      fees: event?.registration?.fees || "",
      max_participants: event?.registration?.max_participants || "",
    },
    budget: {
      allocated: event?.budget?.allocated || "",
      sponsors: event?.budget?.sponsors || [""],
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [unitsRes, usersRes] = await Promise.all([
          api.get(`/api/events/units`),
          api.get(`/api/events/users`),
        ]);
        setUnits(unitsRes.data);
        setUsers(usersRes.data);
      } catch (err) {
        console.error("Failed to fetch units or users", err);
      }
    };
    fetchData();
  }, []);

  const organizerOptions = [
    ...users.map((u) => ({
      value: u._id,
      label: `${u.personal_info?.name || "Unnamed"} - ${u.username}`,
      type: "user",
    })),
    ...units.map((u) => ({
      value: u._id,
      label: `${u.name} - ${u.type || "unit"}`,
      type: "unit",
    })),
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNestedChange = (section, key, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [key]: value },
    }));
  };

  const handleScheduleDateTimeChange = (type, field, value) => {
    setFormData((prev) => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [type]: { ...prev.schedule[type], [field]: value },
      },
    }));
  };

  const handleRegistrationDateTimeChange = (type, field, value) => {
    setFormData((prev) => ({
      ...prev,
      registration: {
        ...prev.registration,
        [type]: { ...prev.registration[type], [field]: value },
      },
    }));
  };

  const handleSponsorChange = (index, value) => {
    const updated = [...formData.budget.sponsors];
    updated[index] = value;
    setFormData((prev) => ({
      ...prev,
      budget: { ...prev.budget, sponsors: updated },
    }));
  };

  const addSponsor = () => {
    setFormData((prev) => ({
      ...prev,
      budget: { ...prev.budget, sponsors: [...prev.budget.sponsors, ""] },
    }));
  };

  const combineDateTime = (dateStr, timeStr) =>
    new Date(`${dateStr}T${timeStr}`);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalPayload = {
      ...formData,
      schedule: {
        start: combineDateTime(
          formData.schedule.date.start,
          formData.schedule.time.start,
        ),
        end: combineDateTime(
          formData.schedule.date.end,
          formData.schedule.time.end,
        ),
        venue: formData.schedule.venue,
        mode: formData.schedule.mode,
      },
      registration: formData.registration.required
        ? {
            required: true,
            start: combineDateTime(
              formData.registration.date.start,
              formData.registration.time.start,
            ),
            end: combineDateTime(
              formData.registration.date.end,
              formData.registration.time.end,
            ),
            fees: formData.registration.fees,
            max_participants: formData.registration.max_participants,
          }
        : { required: false },
    };

    try {
      if (event) {
        await api.put(`/api/events/${event._id}`, finalPayload);
        alert("✅ Event updated successfully!");
      } else {
        await api.post(`/api/events/create`, finalPayload);
        alert("✅ Event created successfully!");
      }
      if (onClose) onClose();
    } catch (err) {
      console.error(err);
      alert("❌ Failed to submit event.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto p-4 bg-white rounded-xl shadow space-y-4 max-h-[calc(100vh-6rem)] overflow-y-auto"
    >
      <h2 className="text-xl font-semibold text-center text-indigo-700">
        {event ? "Edit Event" : "Create New Event"}
      </h2>

      {/* Title + Description */}
      <div className="grid grid-cols-1 gap-2">
        <label className="text-sm font-medium">Event Title</label>
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full p-1.5 mt-1 border rounded text-sm"
        />

        <label className="text-sm font-medium">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={2}
          className="w-full p-1.5 mt-1 border rounded text-sm"
        />
      </div>

      {/* Category + Type */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-sm font-medium">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-1.5 mt-1 border rounded text-sm"
            required
          >
            <option value="">Select</option>
            {["cultural", "technical", "sports", "academic", "other"].map(
              (c) => (
                <option key={c}>{c}</option>
              ),
            )}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">Type</label>
          <input
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full p-1.5 mt-1 border rounded text-sm"
            placeholder="e.g. Competition"
          />
        </div>
      </div>

      {/* Organizing Unit + Organizers */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-sm font-medium">Organizing Unit</label>
          <select
            name="organizing_unit_id"
            value={formData.organizing_unit_id}
            onChange={handleChange}
            className="w-full p-1.5 mt-1 border rounded text-sm"
            required
          >
            <option value="">Select</option>
            {units.map((u) => (
              <option key={u._id} value={u._id}>
                {u.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">Organizers</label>
          <Select
            isMulti
            options={organizerOptions}
            value={organizerOptions.filter((opt) =>
              formData.organizers.includes(opt.value),
            )}
            onChange={(selected) =>
              setFormData((prev) => ({
                ...prev,
                organizers: selected.map((s) => s.value),
              }))
            }
            className="mt-1 text-sm"
            classNamePrefix="select"
            placeholder="Select organizers..."
            styles={{
              control: (base) => ({ ...base, minHeight: 34, height: 34 }),
              valueContainer: (base) => ({ ...base, padding: "0 6px" }),
              input: (base) => ({ ...base, margin: 0, padding: 0 }),
            }}
          />
        </div>
      </div>

      {/* Schedule */}
      <div>
        <h3 className="text-sm font-semibold border-b pb-1 mb-2">Schedule</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div>
            <label className="text-sm">Start Date</label>
            <input
              type="date"
              value={formData.schedule.date.start}
              onChange={(e) =>
                handleScheduleDateTimeChange("date", "start", e.target.value)
              }
              className="w-full border rounded p-1.5 text-sm mt-1"
            />
          </div>
          <div>
            <label className="text-sm">Start Time</label>
            <input
              type="time"
              value={formData.schedule.time.start}
              onChange={(e) =>
                handleScheduleDateTimeChange("time", "start", e.target.value)
              }
              className="w-full border rounded p-1.5 text-sm mt-1"
            />
          </div>
          <div>
            <label className="text-sm">End Date</label>
            <input
              type="date"
              value={formData.schedule.date.end}
              onChange={(e) =>
                handleScheduleDateTimeChange("date", "end", e.target.value)
              }
              className="w-full border rounded p-1.5 text-sm mt-1"
            />
          </div>
          <div>
            <label className="text-sm">End Time</label>
            <input
              type="time"
              value={formData.schedule.time.end}
              onChange={(e) =>
                handleScheduleDateTimeChange("time", "end", e.target.value)
              }
              className="w-full border rounded p-1.5 text-sm mt-1"
            />
          </div>

          <div className="sm:col-span-2 col-span-2">
            <label className="text-sm">Venue</label>
            <input
              value={formData.schedule.venue}
              onChange={(e) =>
                handleNestedChange("schedule", "venue", e.target.value)
              }
              className="w-full border rounded p-1.5 text-sm mt-1"
            />
          </div>

          <div className="sm:col-span-2 col-span-2">
            <label className="text-sm">Mode</label>
            <select
              value={formData.schedule.mode}
              onChange={(e) =>
                handleNestedChange("schedule", "mode", e.target.value)
              }
              className="w-full border rounded p-1.5 text-sm mt-1"
            >
              <option value="">Select</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>
        </div>
      </div>

      {/* Registration */}
      <div>
        <h3 className="text-sm font-semibold border-b pb-1 mb-2">
          Registration
        </h3>
        <label className="flex items-center space-x-2 text-sm">
          <input
            type="checkbox"
            checked={formData.registration.required}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                registration: {
                  ...prev.registration,
                  required: e.target.checked,
                },
              }))
            }
          />
          <span>Registration Required</span>
        </label>

        {formData.registration.required && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
            <input
              type="date"
              value={formData.registration.date.start}
              onChange={(e) =>
                handleRegistrationDateTimeChange(
                  "date",
                  "start",
                  e.target.value,
                )
              }
              className="w-full border rounded p-1.5 text-sm"
            />
            <input
              type="time"
              value={formData.registration.time.start}
              onChange={(e) =>
                handleRegistrationDateTimeChange(
                  "time",
                  "start",
                  e.target.value,
                )
              }
              className="w-full border rounded p-1.5 text-sm"
            />
            <input
              type="date"
              value={formData.registration.date.end}
              onChange={(e) =>
                handleRegistrationDateTimeChange("date", "end", e.target.value)
              }
              className="w-full border rounded p-1.5 text-sm"
            />
            <input
              type="time"
              value={formData.registration.time.end}
              onChange={(e) =>
                handleRegistrationDateTimeChange("time", "end", e.target.value)
              }
              className="w-full border rounded p-1.5 text-sm"
            />

            <input
              type="number"
              placeholder="Fees"
              value={formData.registration.fees}
              onChange={(e) =>
                handleNestedChange("registration", "fees", e.target.value)
              }
              className="w-full border rounded p-1.5 text-sm col-span-2"
            />
            <input
              type="number"
              placeholder="Max Participants"
              value={formData.registration.max_participants}
              onChange={(e) =>
                handleNestedChange(
                  "registration",
                  "max_participants",
                  e.target.value,
                )
              }
              className="w-full border rounded p-1.5 text-sm col-span-2"
            />
          </div>
        )}
      </div>

      {/* Budget & Sponsors */}
      <div>
        <h3 className="text-sm font-semibold border-b pb-1 mb-2">
          Budget & Sponsors
        </h3>
        <input
          type="number"
          placeholder="Allocated Budget"
          value={formData.budget.allocated}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              budget: { ...prev.budget, allocated: e.target.value },
            }))
          }
          className="w-full border rounded p-1.5 mb-2 text-sm"
        />
        {formData.budget.sponsors.map((sponsor, index) => (
          <input
            key={index}
            type="text"
            value={sponsor}
            onChange={(e) => handleSponsorChange(index, e.target.value)}
            placeholder={`Sponsor ${index + 1}`}
            className="w-full border rounded p-1.5 mb-1 text-sm"
          />
        ))}
        <button
          type="button"
          onClick={addSponsor}
          className="text-indigo-600 hover:underline text-xs mt-1"
        >
          + Add Sponsor
        </button>
      </div>

      <div className="pt-2 flex gap-2">
        <button
          type="submit"
          className="flex-1 bg-black text-white py-1.5 px-3 rounded hover:bg-gray-900 text-sm font-semibold"
        >
          {event ? "Update Event" : "Create Event"}
        </button>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-1.5 px-3 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 text-sm font-semibold"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default EventForm;
