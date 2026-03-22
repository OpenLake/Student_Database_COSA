import { useCallback, useEffect, useMemo, useState } from "react";
import {
  LayoutGrid,
  List,
  Search,
  X,
  Info,
  SquareUser,
  Plus,
  Building2,
  FolderOpen,
  CircleFadingArrowUp,
} from "lucide-react";
import ModalDialog from "./modalDialog";
import { BatchCard, BatchList } from "./batchCard";
import { Select } from "./select";
import {
  fetchBatches,
  createBatch,
  editBatch,
  duplicateBatch,
  deleteBatch,
  archiveBatchApi,
} from "../../services/batch";
import { fetchEvents } from "../../services/events";
import { fetchTemplates } from "../../services/templates";
import { useAdminContext } from "../../context/AdminContext";

export default function BatchesPage() {
  const { isUserLoggedIn } = useAdminContext();
  const [batches, setBatches] = useState([]);
  const [events, setEvents] = useState([]);
  const [templates, setTemplates] = useState([]);

  const [search, setSearch] = useState("");
  const [org, setOrg] = useState("ALL");
  const [status, setStatus] = useState("ALL");
  const [approvalStatus, setApprovalStatus] = useState("ALL");
  const [creator, setCreator] = useState("ALL");
  const [view, setView] = useState("grid");

  const [viewingBatch, setViewingBatch] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({
    title: "", // batch.title
    eventId: "", // batch.eventId._id (if exists)
    eventName: "", // batch.eventId.title
    org: "", // batch.eventId.organizing_unit_id.name
    startDate: "", // batch.eventId.schedule.start
    endDate: "", // batch.eventId.schedule.end
    venue: "", // batch.eventId.schedule.venue
    description: "",
    templateId: "", // batch.templateId._id
    signatoryDetails: [], //batch.signatoryDetails
    students: [], // batch.users
  });

  const fire = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [batches, events, templates] = await Promise.all([
          fetchBatches(isUserLoggedIn?._id),
          fetchEvents(),
          fetchTemplates(),
        ]);

        if (!batches || !events || !templates) {
          fire("Could not load data");
          return;
        }

        //console.log("Batches is:", batches[0]);

        Array.isArray(batches) && setBatches(batches);
        Array.isArray(events) && setEvents(events);
        Array.isArray(templates) && setTemplates(templates);
      } catch (err) {
        fire("Failed to load data");
      }
    };

    fetchData();
  }, []);

  const filter = useMemo(() => {
    const list = batches || [];
    return {
      statuses: [...new Set(list.map((b) => b.lifecycleStatus))],
      approvalStatuses: [...new Set(list.map((b) => b.approvalStatus))],
      creators: [...new Set(list.map((b) => b.initiatedBy.personal_info.name))],
      organizations: [
        ...new Set(list.map((b) => b.eventId.organizing_unit_id.name)),
      ],
    };
  }, [batches]);

  const filtered = (batches || []).filter((b) => {
    const batchOrg = b.eventId.organizing_unit_id.name;
    const matchSearch =
      !search || b.title.toLowerCase().includes(search?.toLowerCase());
    const matchOrg = org === "ALL" || batchOrg === org;
    const matchStatus = status === "ALL" || b.lifecycleStatus === status;
    const matchApprovalStatus =
      approvalStatus === "ALL" || b.approvalStatus === approvalStatus;
    const matchCreator =
      creator === "ALL" || b.initiatedBy.personal_info.name === creator;
    return (
      matchSearch &&
      matchOrg &&
      matchStatus &&
      matchApprovalStatus &&
      matchCreator
    );
  });

  const hasFilters =
    org !== "ALL" ||
    status !== "ALL" ||
    approvalStatus !== "ALL" ||
    creator !== "ALL" ||
    search;
  const clearAll = () => {
    setOrg("ALL");
    setStatus("ALL");
    setCreator("ALL");
    setApprovalStatus("ALL");
    setSearch("");
  };

  const openCreate = () => {
    setEditing(null);
    setViewingBatch(null);
    setForm({
      title: "", // batch.title
      eventId: "", // batch.eventId._id (if exists)
      eventName: "", // batch.eventId.title
      org: "", // batch.eventId.organizing_unit_id.name
      startDate: "", // batch.eventId.schedule.start
      endDate: "", // batch.eventId.schedule.end
      venue: "", // batch.eventId.schedule.venue
      description: "",
      templateId: "", // batch.templateId._id
      templateName: "", // batch.templateId.title
      signatoryDetails: [], //batch.signatoryDetails
      students: [], // batch.users
    });
    setModalOpen(true);
  };

  const openEdit = useCallback((b) => {
    if (b.lifecycleStatus !== "Draft") return;
    if (!b.eventId || !b.templateId) {
      fire("Batch data is incomplete");
      return;
    }

    setEditing(b);
    setViewingBatch(null);
    setForm({
      title: b.title,
      eventId: b.eventId,
      eventName: b.eventId.title || "",
      org: b.eventId.organizing_unit_id?.name || "",
      startDate: b.eventId?.schedule?.start
        ? new Date(b.eventId.schedule.start).toLocaleDateString("en-GB")
        : "",

      endDate: b.eventId?.schedule?.end
        ? new Date(b.eventId.schedule.end).toLocaleDateString("en-GB")
        : "",

      description: b.eventId.description || "",
      templateId: b.templateId._id || "",
      signatoryDetails: b.signatoryDetails || [],
      students: b.users || [],
    });
    setModalOpen(true);
  }, []);

  const openView = useCallback((batch) => {
    setViewingBatch(batch);
    setEditing(null);
    setForm({
      title: batch.title,
      eventId: batch.eventId._id,
      eventName: batch.eventId.title,
      org: batch.eventId.organizing_unit_id.name,
      startDate: new Date(batch.eventId.schedule.start).toLocaleDateString(
        "en-GB",
      ),
      endDate: new Date(batch.eventId.schedule.end).toLocaleDateString("en-GB"),
      venue: batch.eventId.schedule.venue,
      description: batch.eventId.description,
      templateId: batch.templateId._id,
      signatoryDetails: batch.signatoryDetails,
      students: batch.users,
    });
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setViewingBatch(null);
    setEditing(null);
  }, []);

  // When user selects an event in the dropdown, populate Event Details from that event
  const handleEventChange = useCallback(
    (eventId) => {
      const selected = events.find((ev) => ev._id === eventId);
      setForm((f) => ({
        ...f,
        eventId,
        eventName: selected ? selected.title : "",
        org:
          selected &&
          selected.organizing_unit_id &&
          (selected.organizing_unit_id.name || ""),
        startDate:
          selected && selected.schedule && selected.schedule.start
            ? new Date(selected.schedule.start).toLocaleDateString("en-GB")
            : "",
        endDate:
          selected && selected.schedule && selected.schedule.end
            ? new Date(selected.schedule.end).toLocaleDateString("en-GB")
            : "",
        description: selected && (selected.description || ""),
      }));
      setSelectedEvent(selected);
    },
    [events],
  );

  const handleTemplateChange = useCallback(
    (templateId) => {
      const selected = templates.find((t) => t._id === templateId);
      setForm((f) => ({
        ...f,
        templateId: selected && (selected._id || "Unknown"),
      }));
    },
    [templates],
  );

  const getDifference = (editing, form) => {
    const isEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b);
    for (let key in form) {
      if (!isEqual(form[key], editing[key])) return true;
    }
    return false;
  };

  const saveBatch = useCallback(
    async (action) => {
      if (
        !form.title ||
        !form.eventId ||
        !form.templateId ||
        form.signatoryDetails.length === 0 ||
        form.students.length === 0
      ) {
        fire("Please fill in all fields");
        return;
      }
      closeModal();
      try {
        let response;
        if (editing) {
          if (action === "Draft") {
            if (!getDifference(editing, form)) return;
            response = await editBatch({
              ...form,
              action: "Draft",
              batchId: editing?._id,
            });
          } else if (action === "Submitted") {
            response = await editBatch({
              ...form,
              action: "Submitted",
              batchId: editing?._id,
            });
          }
        } else {
          if (action === "Draft") {
            response = await createBatch({
              ...form,
              action: "Draft",
            });
          } else if (action === "Submitted") {
            response = await createBatch({
              ...form,
              action: "Submitted",
            });
          }
        }

        response && fire(response);
        const updated = await fetchBatches(isUserLoggedIn?._id);
        if (updated) setBatches(updated);
      } catch (err) {
        console.error(err);
        fire("Failed to " + action);
      }
    },
    [form],
  );

  const delBatch = useCallback(async (batch) => {
    const response = await deleteBatch(batch._id);
    response && fire(response);
    const updated = await fetchBatches(isUserLoggedIn?._id);
    if (updated && updated.length !== 0) setBatches(updated);
  }, []);

  const archiveBatch = useCallback(async (id) => {
    const response = await archiveBatchApi(id);
    response && fire(response);
    const updated = await fetchBatches(isUserLoggedIn?._id);
    if (updated && updated.length !== 0) setBatches(updated);
  }, []);

  const dupBatch = useCallback(async (b) => {
    const response = await duplicateBatch(b?._id);
    response && fire(response);
    const updated = await fetchBatches(isUserLoggedIn?._id);

    if (updated && updated.length !== 0) setBatches(updated);
  }, []);

  return (
    <div className="min-h-screen bg-[#FEFCE8] p-6">
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap'); * { font-family:'DM Sans',sans-serif; }`}
      </style>

      {/* Toast */}
      {toast && (
        <div
          style={{
            position: "fixed",
            top: 18,
            right: 18,
            zIndex: 200,
            background: "#1a3d15",
            color: "#fff",
            borderRadius: 14,
            padding: "10px 18px",
            fontSize: 12,
            fontWeight: 700,
            boxShadow: "0 8px 32px rgba(26,61,21,0.3)",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "#86efac",
              display: "inline-block",
            }}
          />
          {toast}
        </div>
      )}

      {/*Header */}
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
            placeholder="Search batches..."
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
          value={org}
          onChange={setOrg}
          options={filter.organizations}
          icon={Building2}
          placeholder="Organization"
        />

        <Select
          value={status}
          onChange={setStatus}
          options={filter.statuses}
          icon={Info}
          placeholder="Batch Status"
        />

        <Select
          value={approvalStatus}
          onChange={setApprovalStatus}
          options={filter.approvalStatuses}
          icon={CircleFadingArrowUp}
          placeholder="Approval Status"
        />

        <Select
          value={creator}
          onChange={setCreator}
          options={filter.creators}
          icon={SquareUser}
          placeholder="Created By"
        />

        {hasFilters && (
          <button
            onClick={clearAll}
            className="text-xs font-semibold bg-white text-yellow-700 !rounded-2xl border hover:text-yellow-900 px-2 py-2 "
          >
            Clear
          </button>
        )}

        <div className="">
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-3 py-2 !rounded-md text-sm font-bold text-white shadow-md shadow-emerald-900/20"
            style={{ background: "linear-gradient(135deg, #2A6040, #1E4A30)" }}
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* empty state */}
      {filtered?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <FolderOpen size={42} className="text-yellow-200 mb-3" />
          <p className="text-lg font-bold text-gray-400">No batches found</p>
          {search || hasFilters ? (
            <p className="text-xs font-bold text-gray-400">
              Try adjusting your filters or search
            </p>
          ) : (
            <p className="text-xs font-bold text-gray-400">
              No batches exist. Create one today
            </p>
          )}
        </div>
      )}

      {/* View grid */}
      {view === "grid" && filtered?.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(235px, 1fr))",
            gap: 14,
          }}
        >
          {filtered.map((b) => (
            <BatchCard
              key={b.id}
              batch={b}
              onView={openView}
              onEdit={openEdit}
              onDelete={delBatch}
              onDuplicate={dupBatch}
              onArchive={archiveBatch}
            />
          ))}
        </div>
      )}

      {/**List grid */}
      {view === "list" && filtered?.length > 0 && (
        <BatchList
          filtered={filtered}
          onView={openView}
          onEdit={openEdit}
          onDelete={delBatch}
          onDuplicate={dupBatch}
          onArchive={archiveBatch}
        />
      )}

      <ModalDialog
        modalOpen={modalOpen}
        closeModal={closeModal}
        viewingBatch={viewingBatch}
        editing={editing}
        form={form}
        setForm={setForm}
        saveDraft={() => saveBatch("Draft")}
        submitBatch={() => saveBatch("Submitted")}
        events={events}
        templates={templates}
        handleEventChange={handleEventChange}
        handleTemplateChange={handleTemplateChange}
        selectedEvent={selectedEvent}
      />
    </div>
  );
}
