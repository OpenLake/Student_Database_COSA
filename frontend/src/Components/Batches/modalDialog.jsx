import { useState, useEffect } from "react";
import { Modal, Field, Divider } from "./ui";
import { fetchBatchUsers } from "../../services/batch";
import { Users, ChevronDown, ChevronUp, Search, X, Plus } from "lucide-react";
import StudentsPanel from "./studentPanel";

/* ─── tiny helpers ─────────────────────────────────────────── */
const toId = (s) =>
  s && typeof s === "object" ? (s._id || s).toString() : String(s);

const initials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "?";

const DEFAULT_PIC = "https://www.gravatar.com/avatar/?d=mp";

/* ─── Avatar ────────────────────────────────────────────────── */
export function Avatar({ student, size = 34 }) {
  const name = student.personal_info?.name || "";
  const pic = student.personal_info?.profilePic;
  const hasRealPic = pic && pic !== DEFAULT_PIC;

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "#dcfce7",
        border: "1.5px solid #bbf7d0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 11,
        fontWeight: 800,
        color: "#166534",
        flexShrink: 0,
        overflow: "hidden",
      }}
    >
      {hasRealPic ? (
        <img
          src={pic}
          alt={name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        initials(name)
      )}
    </div>
  );
}

/* ─── Checkbox ──────────────────────────────────────────────── */
export function Checkbox({ checked, disabled }) {
  return (
    <div
      style={{
        width: 17,
        height: 17,
        borderRadius: 5,
        border: `1.5px solid ${checked ? "#16a34a" : "#d4d0cb"}`,
        background: checked ? "#16a34a" : "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        transition: "all 0.15s",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {checked && (
        <svg width="10" height="7" viewBox="0 0 10 7" fill="none">
          <path
            d="M1 3.5L3.5 6L9 1"
            stroke="white"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
  );
}

/* ─── Main ModalDialog ──────────────────────────────────────── */
export default function ModalDialog({
  modalOpen,
  closeModal,
  viewingBatch,
  editing,
  form,
  setForm,
  saveDraft,
  submitBatch,
  events = [],
  templates = [],
  handleEventChange,
  handleTemplateChange,
  selectedEvent,
}) {
  const hc = (e) =>
    setForm((f) => ({
      ...f,
      [e.target.name]: e.target.value,
    }));

  const handleSignatoryChange = (index = -1, field, value) => {
    setForm((prev) => {
      if (index === -1) {
        return { ...prev, signatoryDetails: [{ [field]: value }] };
      }
      const updated = [...prev.signatoryDetails];
      updated[index] = {
        ...updated[index],
        [field]: value,
      };

      return { ...prev, signatoryDetails: updated };
    });
  };

  const isViewOnly = viewingBatch && Object.keys(viewingBatch).length > 0;

  useEffect(() => {
    if (form.signatoryDetails.length === 0) {
      setForm((prev) => ({
        ...prev,
        signatoryDetails: [{ name: "", role: "" }],
      }));
    }
  }, []);

  const selectStyle = {
    width: "100%",
    boxSizing: "border-box",
    border: "1.5px solid #e7e5e0",
    borderRadius: 12,
    padding: "9px 12px",
    fontSize: 13,
    color: "#1c1917",
    background: "#fafaf5",
    outline: "none",
    fontFamily: "inherit",
  };

  const labelStyle = {
    display: "block",
    fontSize: 10,
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    color: "#1a3d15",
    marginBottom: 5,
  };

  return (
    <Modal
      open={modalOpen}
      onClose={closeModal}
      title={
        viewingBatch
          ? `View — ${viewingBatch.title}`
          : editing
            ? `Edit — ${editing.title}`
            : "Create New Batch"
      }
    >
      <Field
        label="Batch Name"
        name="title"
        value={form.title}
        onChange={hc}
        placeholder="Hackathon 2026 Certificates"
      />

      <Divider label="Event Details" />

      <div style={{ marginBottom: 12 }}>
        <label style={labelStyle}>Event</label>
        <select
          name="eventId"
          value={form.eventId || ""}
          disabled={isViewOnly}
          onChange={(e) => handleEventChange(e.target.value)}
          style={selectStyle}
        >
          <option value="">Select an event</option>
          {events.map((ev) => (
            <option key={ev._id} value={ev._id}>
              {ev.title}
            </option>
          ))}
        </select>
      </div>

      <Field
        label="Event Name"
        name="eventName"
        value={form.eventName || ""}
        onChange={hc}
        placeholder="Event Name"
        disabled
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 12,
        }}
      >
        <Field
          label="Organization"
          name="org"
          value={form.org}
          onChange={hc}
          placeholder="Organization"
          disabled
        />
        <Field
          label="Start Date"
          name="startDate"
          type="text"
          value={form.startDate}
          onChange={hc}
          disabled
        />
        <Field
          label="End Date"
          name="endDate"
          type="text"
          value={form.endDate}
          onChange={hc}
          disabled
        />
      </div>

      <Field
        label="Description"
        name="description"
        type="textarea"
        value={form.description}
        onChange={hc}
        placeholder="Brief description…"
        disabled
      />

      <Divider label="Certificate Details" />

      <div style={{ marginBottom: 12 }}>
        <label style={labelStyle}>Template</label>
        <select
          name="templateId"
          value={form.templateId || ""}
          onChange={(e) => handleTemplateChange(e.target.value)}
          disabled={isViewOnly}
          style={selectStyle}
        >
          <option value="">Select a template</option>
          {templates?.map((t) => (
            <option key={t._id} value={t._id}>
              {t.title}
            </option>
          ))}
        </select>
      </div>

      {/* Signatory Details */}
      <div className="flex flex-col gap-3">
        {form.signatoryDetails.map((sig, index) => {
          return (
            <div key={index} className="grid grid-cols-2 gap-3">
              <Field
                label="Signatory Name"
                name="name"
                value={sig?.name || ""}
                onChange={(e) =>
                  handleSignatoryChange(index, "name", e.target.value)
                }
                placeholder="John Smith"
                disabled={isViewOnly}
              />
              <Field
                label="Role"
                name="sigRole"
                value={sig?.role || ""}
                onChange={(e) =>
                  handleSignatoryChange(index, "role", e.target.value)
                }
                placeholder="Dean"
                disabled={isViewOnly}
              />
            </div>
          );
        })}

        {!isViewOnly && form.signatoryDetails.length < 3 && (
          <button
            onClick={() =>
              setForm((prev) => ({
                ...prev,
                signatoryDetails: [
                  ...prev.signatoryDetails,
                  { name: "", role: "" },
                ],
              }))
            }
            className="flex items-center gap-[4px] w-[10vw] px-2.5 py-1 !rounded-xl border border-[#e7e5e0]
            bg-[#fafaf5] cursor-pointer !text-sm text-zinc-600 "
          >
            <Plus size={12} />
            Add Signatory
          </button>
        )}
      </div>

      <Divider label="Students" />

      <Field
        label="No.of Students"
        name="students"
        type="number"
        value={form.students.length !== 0 ? form.students.length : null}
        placeholder="No.of Students"
        disabled
      />
      <StudentsPanel
        form={form}
        setForm={setForm}
        isViewOnly={isViewOnly}
        selectedEvent={selectedEvent}
      />

      {/* ── modal footer buttons ── */}
      <div className="flex mt-4">
        {!isViewOnly ? (
          <>
            <button
              onClick={closeModal}
              className="px-[15px] py-[9px] !rounded-2xl border-[1.5px] border-[#e7e5e0] bg-[#fafaf5] text-red-600 text-xs font-bold cursor-pointer"
            >
              Cancel
            </button>

            <div className="flex-1" />

            <button
              onClick={saveDraft}
              className="px-[17px] py-[9px] !mr-3 !rounded-2xl border-[1.5px] border-amber-200 bg-amber-50 text-amber-800 text-xs font-extrabold cursor-pointer"
            >
              Save Draft
            </button>

            <button
              onClick={submitBatch}
              className="px-5 py-[9px] !rounded-2xl bg-[#1a3d15] text-white text-xs font-extrabold cursor-pointer"
            >
              Submit Batch
            </button>
          </>
        ) : (
          <button
            onClick={closeModal}
            className="px-[15px] py-[9px] !rounded-2xl border-[1.5px] border-[#e7e5e0] bg-[#fafaf5] text-gray-600 text-xs font-bold cursor-pointer"
          >
            Close
          </button>
        )}
      </div>
    </Modal>
  );
}
