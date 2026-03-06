

import { Overlay, Pill, C } from "./ui";
import {
  X,
  CalendarDays,
  Users,
  UserCircle2,
  Award
} from "lucide-react";

const labelColor = {
  "Approved": "green",
  "Rejected": "red",
  "Pending": "amber" 
} 

/* ─── info tile (used in View modal) ────────────────────── */
const InfoTile = ({ icon: Icon, label, value, wide }) => (
  <div
    className={`
      ${wide ? "col-span-full" : ""}
      rounded-[14px]
      px-[20px] py-[16px]
      flex flex-col gap-[6px]
      border
      bg-[${C.white}]
      border-[${C.border}]
    `}
  >
    <div
      className={`
        flex items-center gap-[7px]
        text-[${C.warmGray}]
      `}
    >
      <Icon size={15} strokeWidth={2} />
      <span className="text-[11px] font-semibold tracking-[0.08em] uppercase">
        {label}
      </span>
    </div>

    <span
      className={`
        text-[20px] font-bold tracking-[-0.01em]
        text-[${C.text}]
      `}
    >
      {value}
    </span>
  </div>
);

/* VIEW MODAL */
export const ViewModal = ({ request, onClose }) => (
  <Overlay onClose={onClose}>
    <div className={`
        w-[520px]
        rounded-[20px]
        overflow-hidden
        border-[1.5px]
        shadow-[0_24px_60px_rgba(30,26,10,0.28)]
        bg-[${C.cream}]
        border-[${C.borderStrong}]
    `} style={{
      fontFamily: "'DM Sans', sans-serif",
    }}>
      {/* header strip */}
      <div className={`
          bg-[linear-gradient(135deg,#F7F0A8_0%,#EDE090_100%)]
          px-[28px] pt-[22px] pb-[18px]
          border-b
          relative
          border-[${C.borderStrong}]
      `}>

        <button onClick={onClose} className={`
            absolute top-[16px] right-[16px]
            bg-[rgba(0,0,0,0.08)]
            !rounded-md
            p-[6px]
            flex items-center
            cursor-pointer
            text-[${C.warmGray}]
        `}>
          <X size={15} />
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <Award size={18} color={C.amber} strokeWidth={2.2} />
          <span className={`
              text-[11px] font-[700]
              tracking-[0.1em] uppercase
              text-[${C.warmGray}]
            `}
          >
            Request Details
          </span>
        </div>

        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: C.text, lineHeight: 1.25, marginBottom: 12 }}>
          {request.organization} 
          <span style={{ color: C.warmGray, fontWeight: 500 }}> | </span> {request.event}
        </h2>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Pill 
          label={request.status}
          color={labelColor[request.status]} />
          <Pill
            label={`${request.priority} Priority`}
            color={request.priority === "High" ? "red" : "amber"}
          />
        </div>
      </div>

      {/* body */}
      <div style={{ padding: "24px 28px 28px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <InfoTile icon={CalendarDays} label="Submission Date" value={request.date} />
          <InfoTile icon={Users} label="Eligible Students" value={request.students} />
          <InfoTile icon={UserCircle2} label="Requested By" value={request.requestedBy} wide />
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}>
          <button onClick={onClose} 
          className={`
            px-[28px] py-[10px]
            !rounded-md
            border-none
            cursor-pointer
            tracking-[0.02em]
            bg-[${C.text}]
            text-[${C.cream}]
          `}
          style={{
            fontWeight: 600, fontSize: 14,
          }}      
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </Overlay>
);
