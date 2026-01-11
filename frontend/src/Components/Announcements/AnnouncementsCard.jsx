import { Calendar, User, Tag, MapPin, Pencil, Trash2, Pin } from "lucide-react";
import { AdminContext } from "../../context/AdminContext";
import { useContext } from "react";

const AnnouncementsCard = ({ announcement, onDelete, onEdit }) => {
  const {
    title,
    content,
    author,
    type,
    target_id,
    is_pinned,
    createdAt,
    updatedAt,
  } = announcement;
  const { isUserLoggedIn } = useContext(AdminContext);
  const isOwner = String(isUserLoggedIn?._id) === String(author?._id);

  return (
    <div className="bg-white border rounded-xl shadow-sm hover:shadow-md transition p-4 flex flex-col justify-between">
      {/* Header */}
      <div>
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-semibold text-gray-800 line-clamp-2">
            {title}
          </h3>

          {is_pinned && (
            <span className="flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
              <Pin size={12} />
              Pinned
            </span>
          )}
        </div>

        {/* Meta info (Event-style icons) */}
        <div className="flex flex-row mt-2 space-y-1 justify-between text-s text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar size={15} className="text-gray-400" />
            <span>{new Date(createdAt).toLocaleDateString()}</span>
          </div>

          <div className="flex items-center gap-2">
            <Tag size={15} className="text-gray-400" />
            <span>{type}</span>
          </div>
        </div>
      </div>
      {/* Content */}
      <div className="text-gray-400">
        <p className="mt-3 text-xl text-gray-800 line-clamp-4 ">{content}</p>
      </div>
      <div className="flex flex-col justify-between">
        <div className="flex items-center gap-2">
          <User size={14} className="text-gray-400" />
          <span className="text-sm">
            {author?.personal_info?.name || author?.username || "Admin"}
          </span>
        </div>

        {/* Footer actions (icon-based like Events) */}
        {isOwner && (
          <div className="mt-4 flex justify-end gap-3">
            <button
              onClick={onEdit}
              className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
            >
              <Pencil size={14} />
              Edit
            </button>
            <button
              onClick={onDelete}
              className="flex items-center gap-1 text-sm text-red-600 hover:underline"
            >
              <Trash2 size={14} />
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnnouncementsCard;
