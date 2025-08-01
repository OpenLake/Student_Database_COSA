import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";

const EventForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    type: "",
    organizing_unit_id: "",
    organizers: [],
    schedule: {
      date: {
        start: "",
        end: "",
      },
      time: {
        start: "",
        end: "",
      },
      venue: "",
      mode: "",
    },
    registration: {
      required: false,
      date: {
        start: "",
        end: "",
      },
      time: {
        start: "",
        end: "",
      },
      fees: "",
      max_participants: "",
    },
    budget: {
      allocated: "",
      sponsors: [""],
    },
  });

  const [units, setUnits] = useState([]);
  const [users, setUsers] = useState([]);
  const API_BASE = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

  useEffect(() => {
    const fetchData = async () => {
      const [unitsRes, usersRes] = await Promise.all([
        axios.get(`${API_BASE}/api/events/units`),
        axios.get(`${API_BASE}/api/events/users`),
      ]);

      setUnits(unitsRes.data);
      setUsers(usersRes.data);
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
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  const handleScheduleDateTimeChange = (type, field, value) => {
    setFormData((prev) => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [type]: {
          ...prev.schedule[type],
          [field]: value,
        },
      },
    }));
  };

  const handleRegistrationDateTimeChange = (type, field, value) => {
    setFormData((prev) => ({
      ...prev,
      registration: {
        ...prev.registration,
        [type]: {
          ...prev.registration[type],
          [field]: value,
        },
      },
    }));
  };

  const handleSponsorChange = (index, value) => {
    const updated = [...formData.budget.sponsors];
    updated[index] = value;
    setFormData((prev) => ({
      ...prev,
      budget: {
        ...prev.budget,
        sponsors: updated,
      },
    }));
  };

  const addSponsor = () => {
    setFormData((prev) => ({
      ...prev,
      budget: {
        ...prev.budget,
        sponsors: [...prev.budget.sponsors, ""],
      },
    }));
  };

  const combineDateTime = (dateStr, timeStr) => {
    return new Date(`${dateStr}T${timeStr}`);
  };

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
      await axios.post(`${API_BASE}/api/events/create`, finalPayload);
      alert("✅ Event created successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to create event.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow space-y-8"
    >
      <h2 className="text-3xl font-bold text-center text-indigo-700">
        Create New Event
      </h2>

      {/* Title + Description */}
      <div>
        <label className="font-medium">Event Title</label>
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full p-2 mt-1 border rounded"
        />
      </div>

      <div>
        <label className="font-medium">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full p-2 mt-1 border rounded"
        />
      </div>

      {/* Category + Type */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="font-medium">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-2 mt-1 border rounded"
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
          <label className="font-medium">Type</label>
          <input
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full p-2 mt-1 border rounded"
            placeholder="e.g. Competition"
          />
        </div>
      </div>

      {/* Organizing Unit + Organizers */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="font-medium">Organizing Unit</label>
          <select
            name="organizing_unit_id"
            value={formData.organizing_unit_id}
            onChange={handleChange}
            className="w-full p-2 mt-1 border rounded"
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
          <label className="font-medium">Organizers</label>
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
            className="mt-1"
            classNamePrefix="select"
            placeholder="Select organizers..."
          />
        </div>
      </div>

      {/* Schedule Section */}
      <div>
        <h3 className="text-lg font-semibold border-b pb-1 mb-2">Schedule</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label>Start Date</label>
            <input
              type="date"
              value={formData.schedule.date.start}
              onChange={(e) =>
                handleScheduleDateTimeChange("date", "start", e.target.value)
              }
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label>Start Time</label>
            <input
              type="time"
              value={formData.schedule.time.start}
              onChange={(e) =>
                handleScheduleDateTimeChange("time", "start", e.target.value)
              }
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label>End Date</label>
            <input
              type="date"
              value={formData.schedule.date.end}
              onChange={(e) =>
                handleScheduleDateTimeChange("date", "end", e.target.value)
              }
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label>End Time</label>
            <input
              type="time"
              value={formData.schedule.time.end}
              onChange={(e) =>
                handleScheduleDateTimeChange("time", "end", e.target.value)
              }
              className="w-full border rounded p-2"
            />
          </div>
          <div className="col-span-2">
            <label>Venue</label>
            <input
              value={formData.schedule.venue}
              onChange={(e) =>
                handleNestedChange("schedule", "venue", e.target.value)
              }
              className="w-full border rounded p-2"
            />
          </div>
          <div className="col-span-2">
            <label>Mode</label>
            <select
              value={formData.schedule.mode}
              onChange={(e) =>
                handleNestedChange("schedule", "mode", e.target.value)
              }
              className="w-full border rounded p-2"
            >
              <option value="">Select</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>
        </div>
      </div>

      {/* Registration Section */}
      <div>
        <h3 className="text-lg font-semibold border-b pb-1 mb-2">
          Registration
        </h3>
        <label className="flex items-center space-x-2">
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
          <div className="grid grid-cols-2 gap-4 mt-4">
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
              className="w-full border rounded p-2"
              placeholder="Start Date"
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
              className="w-full border rounded p-2"
              placeholder="Start Time"
            />
            <input
              type="date"
              value={formData.registration.date.end}
              onChange={(e) =>
                handleRegistrationDateTimeChange("date", "end", e.target.value)
              }
              className="w-full border rounded p-2"
              placeholder="End Date"
            />
            <input
              type="time"
              value={formData.registration.time.end}
              onChange={(e) =>
                handleRegistrationDateTimeChange("time", "end", e.target.value)
              }
              className="w-full border rounded p-2"
              placeholder="End Time"
            />
            <input
              type="number"
              placeholder="Fees"
              value={formData.registration.fees}
              onChange={(e) =>
                handleNestedChange("registration", "fees", e.target.value)
              }
              className="w-full border rounded p-2 col-span-2"
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
              className="w-full border rounded p-2 col-span-2"
            />
          </div>
        )}
      </div>

      {/* Budget & Sponsors */}
      <div>
        <h3 className="text-lg font-semibold border-b pb-1 mb-2">
          Budget & Sponsors
        </h3>
        <input
          type="number"
          placeholder="Allocated Budget"
          value={formData.budget.allocated}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              budget: {
                ...prev.budget,
                allocated: e.target.value,
              },
            }))
          }
          className="w-full border rounded p-2 mb-3"
        />
        {formData.budget.sponsors.map((sponsor, index) => (
          <input
            key={index}
            type="text"
            value={sponsor}
            onChange={(e) => handleSponsorChange(index, e.target.value)}
            placeholder={`Sponsor ${index + 1}`}
            className="w-full border rounded p-2 mb-2"
          />
        ))}
        <button
          type="button"
          onClick={addSponsor}
          className="text-indigo-600 hover:underline text-sm"
        >
          + Add Sponsor
        </button>
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 text-lg font-semibold"
        >
          Submit Event
        </button>
      </div>
    </form>
  );
};

export default EventForm;
