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
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm ">
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>

        {is_pinned && (
          <span className="text-xs font-medium text-blue-600 border border-blue-200 px-2 py-0.5 rounded">
            PINNED
          </span>
        )}
      </div>

      {/* Meta */}
      <div className="text-xs text-gray-500 mb-3">
        <span>{type}</span>
        <span className="mx-2">•</span>
        <span>{new Date(createdAt).toLocaleDateString()}</span>
      </div>

      {/* Content */}
      <p className="text-sm text-gray-700 line-clamp-3">{content}</p>

      {/* Footer */}
      <div className="mt-4 text-xs text-gray-500">
        Posted by {author?.personal_info?.name || "Admin"}
      </div>

      {/* OWNER ACTIONS */}
      {isOwner && (
        <div className="flex gap-2">
          <button className="text-blue-600 text-sm" onClick={onEdit}>
            Edit
          </button>
          <button className="text-red-600 text-sm" onClick={onDelete}>
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default AnnouncementsCard;
