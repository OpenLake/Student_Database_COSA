import { useState } from "react";
import {
  X,
  CalendarDays,
  Users,
  UserCircle2,
  Award,
  Pencil,
  FlameKindling,
  Save,
  Building2,
  ChevronDown,
} from "lucide-react";

import { Overlay, C } from "./ui";

/* EDIT MODAL */
const Field = ({ label, icon: Icon, children, half }) => (
  <div style={{ gridColumn: half ? undefined : "1 / -1", display: "flex", flexDirection: "column", gap: 6 }}>
    <label style={{
      display: "flex", alignItems: "center", gap: 6,
      fontSize: 11, fontWeight: 700, color: C.warmGray,
      letterSpacing: "0.08em", textTransform: "uppercase",
    }}>
      {Icon && <Icon size={13} strokeWidth={2} />}
      {label} <span style={{ color: C.red }}>*</span>
    </label>
    {children}
  </div>
);

const inputStyle = {
  width: "100%", padding: "10px 14px",
  borderRadius: 10, fontSize: 14, color: C.text,
  background: C.white,
  border: `1.5px solid ${C.border}`,
  outline: "none", boxSizing: "border-box",
  fontFamily: "inherit",
  transition: "border-color 0.15s",
};

export const EditModal = ({ request, onClose, onSave }) => {
  const [form, setForm] = useState({ ...request });

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <Overlay onClose={onClose}>
      <div style={{
        width: 580, background: C.cream,
        borderRadius: 20, overflow: "hidden",
        border: `1.5px solid ${C.borderStrong}`,
        boxShadow: "0 24px 60px rgba(30,26,10,0.3)",
        fontFamily: "'DM Sans', sans-serif",
        maxHeight: "90vh", display: "flex", flexDirection: "column",
      }}>
        {/* header */}
        <div style={{
          background: `linear-gradient(135deg, #F7F0A8 0%, #EDE090 100%)`,
          padding: "22px 28px 18px",
          borderBottom: `1px solid ${C.borderStrong}`,
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <Pencil size={16} color={C.amber} strokeWidth={2.2} />
                <span style={{ fontSize: 11, fontWeight: 700, color: C.warmGray, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  Edit Request
                </span>
              </div>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: C.text }}>
                Update Request Details
              </h2>
              <p style={{ margin: "4px 0 0", fontSize: 13, color: C.textMuted }}>
                Changes will update the certificate request record
              </p>
            </div>
            <button onClick={onClose} style={{
              background: "rgba(0,0,0,0.08)", border: "none",
              borderRadius: 8, padding: 6, cursor: "pointer",
              display: "flex", alignItems: "center", color: C.warmGray, flexShrink: 0,
            }}>
              <X size={15} />
            </button>
          </div>
        </div>

        {/* scrollable body */}
        <div style={{ overflowY: "auto", padding: "24px 28px" }}>
          {/* event info section */}
          <div style={{
            background: `linear-gradient(135deg, #EFF8FF 0%, #E8F2FA 100%)`,
            border: `1px solid #C8DAEA`,
            borderRadius: 14, padding: "18px 20px", marginBottom: 20,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <Award size={16} color="#3A70A8" strokeWidth={2} />
              <span style={{ fontSize: 13, fontWeight: 700, color: "#2A5580", letterSpacing: "0.04em" }}>
                Event Information
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <Field label="Event Name" icon={null} half>
                <input style={inputStyle} value={form.event} onChange={set("event")}
                  onFocus={e => e.target.style.borderColor = C.amberLight}
                  onBlur={e => e.target.style.borderColor = C.border}
                />
              </Field>
              <Field label="Organization" icon={Building2} half>
                <input style={inputStyle} value={form.organization} onChange={set("organization")}
                  onFocus={e => e.target.style.borderColor = C.amberLight}
                  onBlur={e => e.target.style.borderColor = C.border}
                />
              </Field>
            </div>
          </div>

          {/* detail fields */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field label="Submission Date" icon={CalendarDays} half>
              <input type="date" style={inputStyle} value={form.date} onChange={set("date")}
                onFocus={e => e.target.style.borderColor = C.amberLight}
                onBlur={e => e.target.style.borderColor = C.border}
              />
            </Field>
            <Field label="Student Count" icon={Users} half>
              <input type="number" style={inputStyle} value={form.students} onChange={set("students")}
                onFocus={e => e.target.style.borderColor = C.amberLight}
                onBlur={e => e.target.style.borderColor = C.border}
              />
            </Field>
            <Field label="Requested By" icon={UserCircle2} half>
              <input style={inputStyle} value={form.requestedBy} onChange={set("requestedBy")}
                onFocus={e => e.target.style.borderColor = C.amberLight}
                onBlur={e => e.target.style.borderColor = C.border}
              />
            </Field>
            <Field label="Priority" icon={FlameKindling} half>
              <div style={{ position: "relative" }}>
                <select style={{ ...inputStyle, appearance: "none", paddingRight: 36, cursor: "pointer" }}
                  value={form.priority} onChange={set("priority")}
                  onFocus={e => e.target.style.borderColor = C.amberLight}
                  onBlur={e => e.target.style.borderColor = C.border}
                >
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
                <ChevronDown size={14} style={{
                  position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                  color: C.warmGray, pointerEvents: "none",
                }} />
              </div>
            </Field>
          </div>
        </div>

        {/* footer */}
        <div style={{
          padding: "16px 28px 24px",
          borderTop: `1px solid ${C.border}`,
          display: "flex", gap: 10, justifyContent: "flex-end",
          flexShrink: 0,
        }}>
          <button onClick={onClose} style={{
            padding: "10px 22px", borderRadius: 11,
            background: "transparent", color: C.warmGray,
            border: `1.5px solid ${C.border}`, cursor: "pointer",
            fontWeight: 600, fontSize: 14, fontFamily: "inherit",
          }}
            onMouseEnter={e => { e.target.style.background = C.creamDark; }}
            onMouseLeave={e => { e.target.style.background = "transparent"; }}
          >
            Cancel
          </button>
          <button onClick={() => { onSave(form); onClose(); }} style={{
            padding: "10px 24px", borderRadius: 11,
            background: `linear-gradient(135deg, #2A6040, #1E4A30)`,
            color: "#E8F5EE",
            border: "none", cursor: "pointer",
            fontWeight: 700, fontSize: 14, fontFamily: "inherit",
            display: "flex", alignItems: "center", gap: 8,
            boxShadow: "0 4px 14px rgba(30,74,48,0.3)",
          }}
           
          >
            <Save size={15} />
            Save Changes
          </button>
        </div>
      </div>
    </Overlay>
  );
};