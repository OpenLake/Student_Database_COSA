import { useState, useEffect, useMemo } from "react";
import {
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
  FileText,
  LayoutGrid,
  List,
  X,
  Filter,
  SquareUser,
  Info,
} from "lucide-react";

import { toast } from "react-toastify";

import TemplateModal from "./TemplateModal";
import ThumbnailPreview from "./thumbnailPreview";
import { Select } from "./Select";
import { useAdminContext } from "../../context/AdminContext";
import { fetchTemplates } from "../../services/templates";
import { deleteTemplate } from "../../services/templates";

const STATUS_STYLE = {
  Active: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  Draft: "bg-yellow-100 text-yellow-700 border border-yellow-300",
  Archived: "bg-gray-100 text-gray-500 border border-gray-200",
};

const STATUS_DOT = {
  Active: "bg-emerald-500",
  Draft: "bg-yellow-400",
  Archived: "bg-gray-400",
};

const TEMPLATE_STATUS_MAP = {
  Active: "#5c8a6e",   // muted green
  Draft: "#8a7d5c",    // muted amber/tan
  Archived: "#6e7a8a", // muted slate blue
};

export default function Templates() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const [search, setSearch] = useState("");
  const [catFilter, setCat] = useState("All");
  const [statusFilter, setStatus] = useState("All");
  const [creatorFilter, setCreator] = useState("All");
  const [mode, setMode] = useState("create");
  const [view, setView] = useState("grid"); // "grid" | "list"

  const { userRole} = useAdminContext();
  const role = (userRole || "").toUpperCase();

  const loadTemplates = async () => {
  setLoading(true);

  try {
    const res = await fetchTemplates();

    if (res?.status === 200) {
      setTemplates(res.data);
    }
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  loadTemplates();
}, []);


  const filtered = templates?.filter((t) => {
    if(!t?.title || !t?.category || !t?.createdBy?.personal_info?.name || !t.status) return false;

    const matchSearch = !search || t.title.toLowerCase().includes(search?.toLowerCase());
    const matchCat = catFilter === "All" || t.category === catFilter;
    const matchStatus = statusFilter === "All" || t.status === statusFilter;
    const matchCreator =
      creatorFilter === "All" ||
      t.createdBy.personal_info.name === creatorFilter;
  
    return matchSearch && matchCat && matchStatus && matchCreator;
  });

  const filters = useMemo(
    () => ({
      categories: [...new Set(templates?.map((t) => t.category))],
      statuses: [...new Set(templates?.map((t) => t.status))],
      creators: [
        ...new Set(templates?.map((t) => t.createdBy.personal_info.name)),
      ],
    }),
    [templates],
  );
  
  
  const del = async (id) => {
  const ok = window.confirm(
    "Are you sure you want to archive this template?"
  );

  if (!ok) return;

  try {
    await deleteTemplate(id);
    await loadTemplates();
  } catch (err) {
    console.error(err);
    toast.error("Failed to archive template.");
  }
};

  const hasFilters =
    catFilter !== "All" ||
    statusFilter !== "All" ||
    creatorFilter !== "All" ||
    search;

  const clearAll = () => {
    setCat("All");
    setStatus("All");
    setCreator("All");
    setSearch("");
  };

  if (loading) {
  return (
    <div className="flex justify-center items-center h-96">
      <p className="text-gray-500">Loading templates...</p>
    </div>
  );
}

  return (
    <div className="min-h-screen bg-[#FEFCE8] p-6">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap'); * { font-family:'DM Sans',sans-serif; }`}</style>

      {/* ── filters bar ───────────────────────────────────── */}
      <div className="flex items-center gap-2.5 mb-5 flex-wrap">
        {/* view toggle */}
        <div className="flex items-center bg-white border border-yellow-100 rounded-xl p-1 gap-0.5">
          <button
            onClick={() => setView("grid")}
            className={`p-1.5 !rounded-lg transition-colors ${view === "grid" ? "text-white shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
            style={
              view === "grid"
                ? { background: "linear-gradient(135deg, #2A6040, #1E4A30)" }
                : {}
            }
          >
            <LayoutGrid size={15} />
          </button>
          <button
            onClick={() => setView("list")}
            className={`p-1.5 !rounded-lg transition-colors ${view === "list" ? "text-white shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
            style={
              view === "list"
                ? { background: "linear-gradient(135deg, #2A6040, #1E4A30)" }
                : {}
            }
          >
            <List size={15} />
          </button>
        </div>

        {/* search */}
        <div className="relative flex-1 min-w-48 max-w-72">
          <Search
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search templates…"
            className="w-full pl-8 pr-4 py-2 text-xs font-medium rounded-xl border border-yellow-100 bg-white text-gray-700 placeholder:text-gray-400 outline-none focus:border-yellow-300 focus:ring-2 focus:ring-yellow-100 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={12} />
            </button>
          )}
        </div>

        <Select
          value={catFilter}
          onChange={setCat}
          options={filters.categories}
          icon={Filter}
          placeholder="Categories"
        />

        <Select
          value={statusFilter}
          onChange={setStatus}
          options={filters.statuses}
          icon={Info}
          placeholder="Status"
        />

        <Select
          value={creatorFilter}
          onChange={setCreator}
          options={filters.creators}
          icon={SquareUser}
          placeholder="Creators"
        />

        {hasFilters && (
          <button
            onClick={clearAll}
            className="text-xs font-semibold bg-white text-yellow-700 !rounded-2xl border hover:text-yellow-900 px-2 py-2 "
          >
            Clear all
          </button>
        )}

        <div className="ml-32">
          <button
            onClick={() => {
              setMode("create");
              setSelectedTemplate(null);
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 !rounded-2xl text-sm font-bold text-white shadow-md shadow-emerald-900/20"
          style={{
             background:"linear-gradient(135deg,#2A6040,#1E4A30)",
  }}
>
  <Plus size={16} />
  <span>Create</span>
</button>
        </div>
      </div>

      {/* ── empty state ───────────────────────────────────── */}
      {filtered?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <FileText size={42} className="text-yellow-200 mb-3" />
          <p className="text-lg font-bold text-gray-400">No templates found</p>
          {search ? (
            <p className="text-xs font-bold text-gray-400">
              Try adjusting your filters or search
            </p>
          ) : (
            <p className="text-xs font-bold text-gray-400">
              No templates exist. Create one today
            </p>
          )}
        </div>
      )}

      {/* GRID VIEW */}
      {view === "grid" && filtered?.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered?.map((t) => (
            <div
              key={t._id}
              className="group bg-white border border-yellow-100 rounded-2xl overflow-hidden hover:border-yellow-200 hover:shadow-lg hover:shadow-yellow-100/50 transition-all duration-200 cursor-pointer"
            >
              {/* thumbnail */}
              <div className="relative h-36 w-full border-b border-yellow-50">
                <ThumbnailPreview color={TEMPLATE_STATUS_MAP[t.status]} category={t.category}/>
                {/* hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-200" />
                {/* status badge */}
                <div className="absolute bottom-2.5 right-2.5">
                  <span
                    className={`inline-flex items-center mr-3 mb-1 gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full ${STATUS_STYLE[t.status]}`}
                  >
                    <span
                      className={`w-1 h-1 rounded-full ${STATUS_DOT[t.status]}`}
                    />
                    {t.status}
                  </span>
                </div>
              </div>

              {/* card body */}
              <div className="rounded-b-2xl bg-white">
                {/* inner panel mimicking the rounded sub-card in the image */}
                <div className="rounded-xl p-2.5 space-y-2 ">
                  {/* Row 1: NAME field + small category box */}
                  <div className="flex items-center justify-between">
                    <div className="flex border border-yellow-200 rounded-md px-2 bg-amber-50/40">
                      <p className="text-[12px] font-bold text-gray-900 truncate my-auto p-2 leading-tight">
                        {t.title}
                      </p>
                    </div>
                    <div className="flex border border-yellow-200 rounded-2xl px-2 bg-amber-50/40 mr-5">
                      <span className="text-[10px] font-bold uppercase mx-auto py-1 tracking-widest text-amber-600 whitespace-nowrap">
                        {t.category}
                      </span>
                    </div>
                  </div>

                  {/* Row 2 */}
                  <div className="flex items-center justify-between">
                    {/* LEFT: action buttons */}
                    <div className="flex items-center gap-1.5">
                      <button
                        className={`flex items-center justify-center h-6 border border-yellow-200 !rounded-xl px-2 text-blue-600 hover:bg-blue-100 shrink-0`}
                        onClick={() => {
    setSelectedTemplate(t);
    setMode("view");
    setShowModal(true);
}}
                      >
                        <span
                          className={`text-[9px] font-bold uppercase tracking-widest whitespace-nowrap`}
                        >
                          View
                        </span>
                      </button>

                      {(role === "PRESIDENT" ||
                      role.startsWith("GENSEC") ||
                      t.title.includes("Copy")) ? (
                        <>
                          <button
                            className={`flex items-center justify-center h-6 border border-yellow-200 !rounded-xl px-2 text-gray-600 hover:bg-gray-200 shrink-0`}
                            onClick={() => {
    setSelectedTemplate(t);
    setMode("edit");
    setShowModal(true);
}}
                          >
                            <span
                              className={`text-[9px] font-bold uppercase tracking-widest whitespace-nowrap`}
                            >
                              Edit
                            </span>
                          </button>

                          <button
                            className={`flex items-center justify-center h-6 border border-yellow-200 !rounded-xl px-2 text-red-600 hover:bg-red-100 shrink-0`}
                            onClick={() => del(t._id)}
                          >
                            <span
                              className={`text-[9px] font-bold uppercase tracking-widest whitespace-nowrap`}
                            >
                              Delete
                            </span>
                          </button>
                        </>
                      ) : null }
                    </div>

                    {/* RIGHT: avatar + author + date */}
                    <div className="flex items-center gap-2">
                      <div
                        className="w-5 h-5 rounded-full border-2 flex items-center justify-center text-[8px] font-bold text-white shrink-0"
                        style={{ borderColor: t.color, background: t.color }}
                      >
                        {t.createdBy.personal_info.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>

                      <span className="text-[10px] text-gray-400 font-medium">
                        {t.createdBy.personal_info.name}
                      </span>

                      <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap">
                        {new Date(t.createdAt).toLocaleDateString("en-GB").replaceAll("/", "-")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* LIST VIEW */}
      {view === "list" && filtered?.length > 0 && (
        <div className="bg-white border border-yellow-100 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full border-collapse">
            <thead>
              <tr
                style={{
                  background: "linear-gradient(135deg, #2A6040, #1E4A30)",
                }}
              >
                {[
                  "Template",
                  "Category",
                  "Status",
                  "Created By",
                  "Last Modified",
                  "Actions",
                ].map((h, i, arr) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-white/60 whitespace-nowrap"
                    style={
                      i < arr.length - 1
                        ? { borderRight: "1px solid rgba(255,255,255,0.07)" }
                        : {}
                    }
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((t, i) => (
                <tr
                  key={t._id}
                  className="hover:bg-amber-50/40 transition-colors"
                  style={{
                    borderBottom:
                      i < filtered.length - 1 ? "1px solid #fef9c3" : "none",
                  }}
                >
                  <td
                    className="px-5 py-1.5"
                    style={{ borderRight: "1px solid #fef3c7" }}
                  >
                    <div className="flex items-center">
                      <p className="text-sm font-bold text-gray-900">
                        {t.title}
                      </p>
                    </div>
                  </td>
                  <td
                    className="px-4 py-1.5"
                    style={{ borderRight: "1px solid #fef3c7" }}
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-50 text-amber-600 border border-amber-100">
                      {t.category}
                    </span>
                  </td>
                  <td
                    className="px-4 py-1.5"
                    style={{ borderRight: "1px solid #fef3c7" }}
                  >
                    <span
                      className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${STATUS_STYLE[t.status]}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[t.status]}`}
                      />
                      {t.status}
                    </span>
                  </td>
                  <td
                    className="px-4 py-1.5"
                    style={{ borderRight: "1px solid #fef3c7" }}
                  >
                    <div className="flex items-center">
                      <span className="text-xs text-gray-600 font-medium">
                        {t.createdBy.personal_info.name}
                      </span>
                    </div>
                  </td>
                  <td
                    className="px-4 py-1.5"
                    style={{ borderRight: "1px solid #fef3c7" }}
                  >
                    <span className="text-xs text-gray-500 font-medium">
                      {new Date(t.updatedAt).toLocaleDateString("en-GB").replaceAll("/", "-")}
                    </span>
                  </td>
                  <td className="px-4 py-1.5">
                    <div className="flex items-center gap-1">
                      <button
                        className="p-1.5 !rounded-lg text-blue-500 hover:bg-blue-50 border transition-colors"
                          onClick={() => {
                            setSelectedTemplate(t);
                            setMode("view");
                            setShowModal(true);
                          }}
                      >
                      <Eye size={14} />
                      </button>


                      {(role === "PRESIDENT" ||
                      role.startsWith("GENSEC") ||
                      t.title.includes("Copy")) ? (
                        <>
                          <button
                            className="p-1.5 !rounded-lg text-gray-600 border hover:bg-amber-50 hover:text-amber-600 transition-colors"
                            onClick={() => {
                              setSelectedTemplate(t);
                              setMode("edit");
                              setShowModal(true);
                            }}
                          >
                          <Pencil size={14} />
                          </button>

                          <button
                            className="p-1.5 !rounded-lg text-red-400 border hover:bg-red-50 hover:text-red-500 transition-colors"
                            onClick={() => del(t._id)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </>
                      ) : (
                        <></>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <TemplateModal
    open={showModal}
    mode={mode}
    template={selectedTemplate}
    onClose={() => {
        setShowModal(false);
        setSelectedTemplate(null);
    }}
    onSuccess={loadTemplates}
/>
    </div>
  );
}