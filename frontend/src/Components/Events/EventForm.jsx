import React, { useState, useEffect } from "react";
import Select from "react-select";
import api from "../../utils/api";

const DateTimeFields = ({ section, data, handler, styles }) => (
  <>
    <div>
      <label className="text-xs text-stone-500">Start Date</label>
      <input
        type="date"
        value={data.date.start}
        onChange={(e) => handler(section, "date", "start", e.target.value)}
        className={styles}
      />
    </div>
    <div>
      <label className="text-xs text-stone-500">Start Time</label>
      <input
        type="time"
        value={data.time.start}
        onChange={(e) => handler(section, "time", "start", e.target.value)}
        className={styles}
      />
    </div>
    <div>
      <label className="text-xs text-stone-500">End Date</label>
      <input
        type="date"
        value={data.date.end}
        onChange={(e) => handler(section, "date", "end", e.target.value)}
        className={styles}
      />
    </div>
    <div>
      <label className="text-xs text-stone-500">End Time</label>
      <input
        type="time"
        value={data.time.end}
        onChange={(e) => handler(section, "time", "end", e.target.value)}
        className={styles}
      />
    </div>
  </>
);

const ScheduleFields = ({
  data,
  handleDateTimeChange,
  handleNestedChange,
  inputStyles,
  labelStyles,
}) => (
  <div>
    <h3 className="text-base font-semibold text-stone-700 border-b border-stone-200 pb-1 mb-3">
      Schedule
    </h3>
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <DateTimeFields
        section="schedule"
        data={data}
        handler={handleDateTimeChange}
        styles={inputStyles}
      />
      <div className="col-span-2">
        <label className={labelStyles}>Venue</label>
        <input
          value={data.venue}
          onChange={(e) =>
            handleNestedChange("schedule", "venue", e.target.value)
          }
          className={inputStyles}
        />
      </div>
      <div className="col-span-2">
        <label className={labelStyles}>Mode</label>
        <select
          value={data.mode}
          onChange={(e) =>
            handleNestedChange("schedule", "mode", e.target.value)
          }
          className={inputStyles}
        >
          <option value="">Select Mode</option>
          <option value="online">Online</option>
          <option value="offline">Offline</option>
          <option value="hybrid">Hybrid</option>
        </select>
      </div>
    </div>
  </div>
);

const BudgetFields = ({
  data,
  setFormData,
  handleSponsorChange,
  handleRemoveSponsor,
  addSponsor,
  inputStyles,
}) => (
  <div>
    <h3 className="text-base font-semibold text-stone-700 border-b border-stone-200 pb-1 mb-3">
      Budget & Sponsors
    </h3>
    <input
      type="number"
      placeholder="Allocated Budget"
      value={data.allocated}
      onChange={(e) =>
        setFormData((prev) => ({
          ...prev,
          budget: { ...prev.budget, allocated: e.target.value },
        }))
      }
      className={`${inputStyles} mb-2`}
    />
    {data.sponsors.map((sponsor, index) => (
      <div key={index} className="flex items-center gap-2 mb-2">
        <input
          type="text"
          value={sponsor}
          onChange={(e) => handleSponsorChange(index, e.target.value)}
          placeholder={`Sponsor ${index + 1}`}
          className={`${inputStyles} flex-grow !mt-0`}
        />
        <button
          type="button"
          onClick={() => handleRemoveSponsor(index)}
          className="p-2 text-stone-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors"
          title="Remove Sponsor"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    ))}
    <button
      type="button"
      onClick={addSponsor}
      className="text-stone-600 hover:text-stone-800 font-medium text-xs mt-1 transition"
    >
      + Add Sponsor
    </button>
  </div>
);

const initialFormState = {
  title: "",
  description: "",
  category: "",
  type: "",
  organizing_unit_id: "",
  organizers: [],
  schedule: {
    date: { start: "", end: "" },
    time: { start: "", end: "" },
    venue: "",
    mode: "",
  },
  registration: {
    required: false,
    date: { start: "", end: "" },
    time: { start: "", end: "" },
    fees: "",
    max_participants: "",
  },
  budget: {
    allocated: "",
    sponsors: [""],
  },
};

// --- Main EventForm Component ---

const EventForm = ({ addEvent, setAddEvent, event = null, onClose }) => {
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
      sponsors: event?.budget?.sponsors?.length ? event.budget.sponsors : [""],
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

  // Handlers
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
  const handleDateTimeChange = (section, type, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [type]: { ...prev[section][type], [field]: value },
      },
    }));
  };
  const handleSponsorChange = (index, value) => {
    const updatedSponsors = [...formData.budget.sponsors];
    updatedSponsors[index] = value;
    setFormData((prev) => ({
      ...prev,
      budget: { ...prev.budget, sponsors: updatedSponsors },
    }));
  };
  const addSponsor = () => {
    setFormData((prev) => ({
      ...prev,
      budget: { ...prev.budget, sponsors: [...prev.budget.sponsors, ""] },
    }));
  };
  const handleRemoveSponsor = (index) => {
    if (formData.budget.sponsors.length === 1) {
      return handleSponsorChange(index, "");
    }
    const updatedSponsors = formData.budget.sponsors.filter(
      (_, i) => i !== index,
    );
    setFormData((prev) => ({
      ...prev,
      budget: { ...prev.budget, sponsors: updatedSponsors },
    }));
  };

  // handleSubmit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    const combineDateTime = (dateStr, timeStr) =>
      new Date(`${dateStr}T${timeStr}`);
    const finalPayload = {
      ...formData,
      schedule: {
        ...formData.schedule,
        start: combineDateTime(
          formData.schedule.date.start,
          formData.schedule.time.start,
        ),
        end: combineDateTime(
          formData.schedule.date.end,
          formData.schedule.time.end,
        ),
      },
      registration: formData.registration.required
        ? {
            ...formData.registration,
            start: combineDateTime(
              formData.registration.date.start,
              formData.registration.time.start,
            ),
            end: combineDateTime(
              formData.registration.date.end,
              formData.registration.time.end,
            ),
          }
        : { required: false },
    };
    try {
      if (event) {
        // Logic for UPDATING an event
        await api.put(`/api/events/${event._id}`, finalPayload);
        alert("✅ Event updated successfully!");
      } else {
        // Logic for CREATING a new event
        await api.post(`/api/events/create`, finalPayload);
        alert("✅ Event created successfully!");
        setFormData(initialFormState); // Reset form after successful creation
      }
      onClose?.(); // Close the form/modal if onClose is provided
    } catch (err) {
      console.error(err);
      alert("❌ Failed to submit event.");
    }
  };

  // Style definitions are unchanged
  const inputStyles =
    "w-full p-2 mt-1 bg-white border border-stone-300 rounded-lg text-sm text-stone-900 placeholder-stone-400 focus:ring-1 focus:ring-stone-400 focus:border-stone-400 transition";
  const labelStyles = "text-sm font-medium text-stone-600";
  const customSelectStyles = {
    /* Style object from previous step is unchanged */
  };

  return (
    addEvent && (
      <div className="min-h-screen w-full bg-[#FDFAE2] flex flex-col items-center justify-center p-4 font-sans">
        <div className="">
          <button
            className="text-red-500 font-bold"
            onClick={() => setAddEvent(false)}
          >
            Close
          </button>
        </div>
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-4xl p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-stone-200 space-y-4"
        >
          <h2 className="text-2xl font-bold text-center text-stone-800">
            {event ? "Edit Event" : "Create New Event"}
          </h2>
          <div className="grid grid-cols-1 gap-2">
            <label className={labelStyles}>Event Title</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className={inputStyles}
            />
            <label className={labelStyles}>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={2}
              className={inputStyles}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelStyles}>Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={inputStyles}
                required
              >
                <option value="">Select Category</option>
                {["cultural", "technical", "sports", "academic", "other"].map(
                  (c) => (
                    <option key={c} value={c} className="capitalize">
                      {c}
                    </option>
                  ),
                )}
              </select>
            </div>
            <div>
              <label className={labelStyles}>Type</label>
              <input
                name="type"
                value={formData.type}
                onChange={handleChange}
                className={inputStyles}
                placeholder="e.g. Competition, Workshop"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelStyles}>Organizing Unit</label>
              <select
                name="organizing_unit_id"
                value={formData.organizing_unit_id}
                onChange={handleChange}
                className={inputStyles}
                required
              >
                <option value="">Select Unit</option>
                {units.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelStyles}>Organizers</label>
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
                styles={customSelectStyles}
              />
            </div>
          </div>
          <ScheduleFields
            data={formData.schedule}
            handleDateTimeChange={handleDateTimeChange}
            handleNestedChange={handleNestedChange}
            inputStyles={inputStyles}
            labelStyles={labelStyles}
          />
          <div>
            <h3 className="text-base font-semibold text-stone-700 border-b border-stone-200 pb-1 mb-3">
              Registration
            </h3>
            <label className="flex items-center space-x-3 text-sm text-stone-700">
              <input
                type="checkbox"
                checked={formData.registration.required}
                onChange={(e) =>
                  handleNestedChange(
                    "registration",
                    "required",
                    e.target.checked,
                  )
                }
                className="h-4 w-4 rounded border-stone-300 text-stone-700 focus:ring-stone-600"
              />
              <span>Registration Required</span>
            </label>
            {formData.registration.required && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
                <DateTimeFields
                  section="registration"
                  data={formData.registration}
                  handler={handleDateTimeChange}
                  styles={inputStyles}
                />
                <input
                  type="number"
                  placeholder="Fees"
                  value={formData.registration.fees}
                  onChange={(e) =>
                    handleNestedChange("registration", "fees", e.target.value)
                  }
                  className={`${inputStyles} col-span-2`}
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
                  className={`${inputStyles} col-span-2`}
                />
              </div>
            )}
          </div>
          <BudgetFields
            data={formData.budget}
            setFormData={setFormData}
            handleSponsorChange={handleSponsorChange}
            handleRemoveSponsor={handleRemoveSponsor}
            addSponsor={addSponsor}
            inputStyles={inputStyles}
          />
          <div className="pt-2 flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-stone-800 text-white py-2.5 px-4 rounded-lg hover:bg-stone-700 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-500"
            >
              {event ? "Update Event" : "Create Event"}
            </button>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 px-4 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-100 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-300"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    )
  );
};

export default EventForm;
