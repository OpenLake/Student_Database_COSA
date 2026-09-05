import { Search, X, User as UserIcon } from "lucide-react";
import { useState } from "react";
import { useStudents } from "../../hooks/useStudents";
import { Modal } from "../Batches/ui";

const FilterSelect = ({ label, value, onChange, options }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="border-[1.5px] border-[#e7e5e0] rounded-lg px-2.5 py-[7px] text-[12px] font-semibold text-[#1c1917] bg-[#fafaf5] outline-none"
  >
    {options.map((opt) => (
      <option key={opt} value={opt}>
        {opt === "All" ? `All ${label}` : opt}
      </option>
    ))}
  </select>
);

const StatusBadge = ({ status }) => {
  const map = {
    active: { bg: "#f0fdf4", color: "#166534", border: "#bbf7d0" },
    inactive: { bg: "#f5f5f4", color: "#78716c", border: "#e7e5e0" },
    graduated: { bg: "#f0f9ff", color: "#0c4a6e", border: "#bae6fd" },
  };
  const s = map[status] || map.inactive;
  return (
    <span
      className="text-[10px] font-bold px-2 py-[3px] rounded-full border"
      style={{ background: s.bg, color: s.color, borderColor: s.border }}
    >
      {status || "unknown"}
    </span>
  );
};

const StudentDetailModal = ({ student, onClose }) => {
  if (!student) return null;
  const { personal_info: p = {}, academic_info: a = {}, contact_info: c = {} } =
    student;

  return (
    <Modal open={!!student} onClose={onClose} title="Student Details">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-[#fafaf5] border-[1.5px] border-[#e7e5e0] flex items-center justify-center overflow-hidden flex-shrink-0">
          {p.profilePic ? (
            <img
              src={p.profilePic}
              alt={p.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <UserIcon size={20} className="text-[#a8a29e]" />
          )}
        </div>
        <div>
          <div className="text-[15px] font-bold text-[#1c1917]">
            {p.name || "Unknown Student"}
          </div>
          <div className="text-[12px] text-[#78716c]">
            {student.username} · {student.user_id}
          </div>
        </div>
        <div className="ml-auto">
          <StatusBadge status={student.status} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-[12px]">
        <Detail label="Email" value={p.email} />
        <Detail label="Phone" value={p.phone} />
        <Detail label="Gender" value={p.gender} />
        <Detail
          label="Date of Birth"
          value={
            p.date_of_birth
              ? new Date(p.date_of_birth).toLocaleDateString()
              : "-"
          }
        />
        <Detail label="Program" value={a.program} />
        <Detail label="Branch" value={a.branch} />
        <Detail label="Batch Year" value={a.batch_year} />
        <Detail label="Current Year" value={a.current_year} />
        <Detail label="CGPA" value={a.cgpa} />
        <Detail label="Hostel" value={c.hostel} />
        <Detail label="Room No." value={c.room_number} />
      </div>
    </Modal>
  );
};

const Detail = ({ label, value }) => (
  <div>
    <div className="text-[10px] uppercase tracking-wide text-[#a8a29e] font-bold">
      {label}
    </div>
    <div className="text-[#1c1917] font-medium">{value || "-"}</div>
  </div>
);

const StudentManagement = () => {
  const {
    students,
    loading,
    error,
    search,
    setSearch,
    branch,
    setBranch,
    batchYear,
    setBatchYear,
    status,
    setStatus,
    branchOptions,
    batchYearOptions,
    statusOptions,
    page,
    setPage,
    pagination,
  } = useStudents();

  const [selectedStudent, setSelectedStudent] = useState(null);

  return (
    <div className="bg-white px-6 py-4 w-full h-full mx-auto rounded-lg overflow-y-auto">
      <div className="flex flex-wrap items-center gap-2.5 mb-4">
        <div className="relative flex-1 min-w-[220px]">
          <Search
            size={14}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#a8a29e] pointer-events-none"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, roll no."
            className="w-full box-border border-[1.5px] border-[#e7e5e0] rounded-lg pl-8 pr-8 py-[8px] text-[13px] text-[#1c1917] bg-[#fafaf5] outline-none"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-[#a8a29e]"
            >
              <X size={13} />
            </button>
          )}
        </div>

        <FilterSelect
          label="Branches"
          value={branch}
          onChange={setBranch}
          options={branchOptions}
        />
        <FilterSelect
          label="Batches"
          value={batchYear}
          onChange={setBatchYear}
          options={batchYearOptions}
        />
        <FilterSelect
          label="Statuses"
          value={status}
          onChange={setStatus}
          options={statusOptions}
        />
      </div>

      <div className="border-[1.5px] border-[#e7e5e0] rounded-xl overflow-hidden">
        <div className="grid grid-cols-[2fr_1.2fr_1fr_1fr_0.8fr] gap-2 px-4 py-2 bg-[#fafaf5] border-b border-[#f0ede8] text-[11px] font-bold text-[#78716c] uppercase">
          <span>Name</span>
          <span>Email</span>
          <span>Branch</span>
          <span>Batch</span>
          <span>Status</span>
        </div>

        {loading ? (
          <div className="py-10 text-center text-[13px] text-[#a8a29e] font-semibold">
            Loading students…
          </div>
        ) : error ? (
          <div className="py-10 text-center text-[13px] text-red-600 font-semibold">
            {error}
          </div>
        ) : students.length === 0 ? (
          <div className="py-10 text-center text-[13px] text-[#a8a29e] font-semibold">
            No students match your search.
          </div>
        ) : (
          students.map((student) => (
            <button
              key={student._id}
              onClick={() => setSelectedStudent(student)}
              className="w-full text-left grid grid-cols-[2fr_1.2fr_1fr_1fr_0.8fr] gap-2 px-4 py-2.5 border-b border-[#f0ede8] last:border-b-0 text-[12px] text-[#1c1917] hover:bg-[#fafaf5] transition-colors"
            >
              <span className="font-semibold truncate">
                {student.personal_info?.name || "Unknown"}
              </span>
              <span className="truncate text-[#78716c]">
                {student.personal_info?.email || "-"}
              </span>
              <span className="truncate">
                {student.academic_info?.branch || "-"}
              </span>
              <span className="truncate">
                {student.academic_info?.batch_year || "-"}
              </span>
              <span>
                <StatusBadge status={student.status} />
              </span>
            </button>
          ))
        )}
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 text-[12px] text-[#78716c] font-semibold">
          <span>
            Page {pagination.page} of {pagination.totalPages} ·{" "}
            {pagination.total} students
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page <= 1}
              className="px-3 py-1 rounded-lg border-[1.5px] border-[#e7e5e0] bg-[#fafaf5] disabled:opacity-40"
            >
              Prev
            </button>
            <button
              onClick={() =>
                setPage((p) => Math.min(p + 1, pagination.totalPages))
              }
              disabled={page >= pagination.totalPages}
              className="px-3 py-1 rounded-lg border-[1.5px] border-[#e7e5e0] bg-[#fafaf5] disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}

      <StudentDetailModal
        student={selectedStudent}
        onClose={() => setSelectedStudent(null)}
      />
    </div>
  );
};

export default StudentManagement;