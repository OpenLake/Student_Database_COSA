import React, { useContext, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import { useFetchAnnouncements } from "../../hooks/useAnnouncements";
import AnnouncementsCard from "./AnnouncementsCard";
import CreateAnnouncementModal from "./CreateAnnouncementModal";

const Announcements = () => {
  const { isUserLoggedIn } = useContext(AdminContext);
  const userRole = isUserLoggedIn?.role || "STUDENT";
  const [filters, setFilters] = useState({
    type: "All",
    isPinned: false,
    page: 1,
    limit: 10,
    search: "",
  });
  const { announcements, refetch, deleteAnnouncement } =
    useFetchAnnouncements(filters);

  const access = ["PRESIDENT", "GENSEC_SCITECH", "GENSEC_ACADEMIC", "GENSEC_CULTURAL", "GENSEC_SPORTS", "CLUB_COORDINATOR"].includes(userRole);


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
      {/* Filters Toolbar */}
      <div className="flex flex-wrap justify-around items-center gap-3 bg-white border rounded-lg p-3 shadow-sm">
        <select
          value={filters.type}
          onChange={(e) =>
            setFilters((f) => ({ ...f, type: e.target.value, page: 1 }))
          }
          className="border rounded-md px-3 py-2 text-sm"
        >
          <option value="All">All Types</option>
          <option value="General">General</option>
          <option value="Event">Event</option>
          <option value="Organizational_Unit">Organization</option>
          <option value="Position">Position</option>
        </select>

        <input
          type="text"
          placeholder="Search announcements..."
          value={filters.search}
          onChange={(e) =>
            setFilters((f) => ({ ...f, search: e.target.value, page: 1 }))
          }
          className="border rounded-md px-3 py-2 text-sm w-64"
        />

        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={filters.isPinned}
            onChange={(e) =>
              setFilters((f) => ({ ...f, isPinned: e.target.checked, page: 1 }))
            }
          />
          Pinned
        </label>

        {access && (
          <button
            onClick={openCreate}
            className="ml-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
          >
            + Add Announcement
          </button>
        )}
      </div>

     {/* Cards Grid */}
   <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 px-2">
  {announcements?.length === 0 ? (
    <p className="col-span-full text-center text-gray-500">
      No announcements found
    </p>
  ) : (
    announcements?.map((a) => (
      <AnnouncementsCard
        key={a._id}
        announcement={a}
        onEdit={() => openEdit(a)}
        onDelete={() => deleteAnnouncement(a._id)}
      />
    ))
  )}
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
