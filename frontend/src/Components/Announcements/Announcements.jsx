import React, { useContext, useState, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
import { useFetchAnnouncements } from "../../hooks/useAnnouncements";
import AnnouncementsCard from "./AnnouncementsCard";
import CreateAnnouncementModal from "./CreateAnnouncementModal";

const Announcements = () => {
  const { isUserLoggedIn } = useContext(AdminContext);
  const userRole = isUserLoggedIn?.role || "STUDENT";
  const [filters, setFilters] = useState({
    type: "General",
    isPinned: undefined,
    page: 1,
    limit: 10,
    search: "",
  });
  const announcementTypes = [
    "General",
    "Event",
    "OrganizationalUnit",
    "Position",
  ];
  const { announcements, refetch, deleteAnnouncement } =
    useFetchAnnouncements(filters);

  const access = userRole != "STUDENT";

  const [open, setOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);

  const openCreate = () => {
    setEditingAnnouncement(null);
    setOpen(true);
  };

  const openEdit = (announcement) => {
    setEditingAnnouncement(announcement);
    setOpen(true);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Filters */}
      <div className="flex items-center py-2 justify-around ">
        {/* Type Filter */}
        <select
          value={filters.type}
          onChange={(e) =>
            setFilters((f) => ({ ...f, type: e.target.value, page: 1 }))
          }
          className="border rounded px-2 py-1"
        >
          <option value="General">General</option>
          <option value="Event">Event</option>
          <option value="OrganizationalUnit">Organization</option>
          <option value="Position">Position</option>
        </select>

        {/* Search */}
        <input
          type="text"
          placeholder="Search announcements..."
          value={filters.search}
          onChange={(e) =>
            setFilters((f) => ({ ...f, search: e.target.value, page: 1 }))
          }
          className="border rounded px-3 py-1 w-64"
        />
        {access && (
          <button
            onClick={() => setOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            + Add Announcement
          </button>
        )}

        {/* Pinned */}
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={filters.isPinned}
            onChange={(e) =>
              setFilters((f) => ({ ...f, isPinned: e.target.checked, page: 1 }))
            }
          />
          Pinned only
        </label>
      </div>
      {/* Announcements List */}
      <div className="flex flex-wrap gap-2 px-4">
        {/*
       {loading && <div>Loading...</div>}

     {!loading && announcements.length === 0 && (
          <div>No announcements found.</div>
        )}
*/}
        {announcements.map((a) => (
          <AnnouncementsCard
            key={a._id}
            announcement={a}
            onDelete={() => deleteAnnouncement(a._id)}
            onEdit={() => openEdit(a)}
          />
        ))}
      </div>
      <CreateAnnouncementModal
        open={open}
        onClose={() => setOpen(false)}
        initialData={editingAnnouncement}
        onSaved={refetch}
      />
    </div>
  );
};

export default Announcements;
