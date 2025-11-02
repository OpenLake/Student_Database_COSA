import React from "react";

const FeedbackPreview = ({ fb }) => {
  if (!fb)
    return (
      <div className="p-2.5 flex align-middle justify-center">
        <p className="font-semibold text-xl">Select Feedback to preview</p>
      </div>
    );

  return (
    <div className="p-2.5 flex flex-col justify-center">
      <p className="font-semibold text-blue-900 ">{fb.comments}</p>
      <p>
        <span className="font-semibold">Type: </span>
        {fb.type}
      </p>
      <p>
        <span className="font-semibold">Status: </span>{" "}
        <span className={fb.is_resolved ? "text-green-600" : "text-red-600"}>
          {fb.is_resolved ? "Resolved" : "Pending"}
        </span>
      </p>
      <p>
        <span className="font-semibold">Created At: </span>
        <span>
          {new Date(fb.created_at).toLocaleDateString("en-US", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </span>
      </p>
      {fb.is_resolved && (
        <p>
          <span className="font-semibold">Resolved At: </span>
          <span>
            {new Date(fb.resolved_at).toLocaleDateString("en-US", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </span>
        </p>
      )}

      <p>
        <span className="font-semibold">Target: </span>
        <span className="text-green-600">
          {fb.target_type === "User" && fb.target_data
            ? `${fb.target_data.personal_info?.name} (${fb.target_data.username})` ||
              fb.target_data.username
            : fb.target_type === "Event" && fb.target_data
              ? `${fb.target_data.title} (${fb.target_data.organizing_unit})`
              : fb.target_type === "Club/Organization" && fb.target_data
                ? `${fb.target_data.name} (${fb.target_data.parent})`
                : fb.target_type === "POR" && fb.target_data
                  ? `${fb.target_data.title} (${fb.target_data.unit})`
                  : "N/A"}
        </span>
      </p>
    </div>
  );
};

export default FeedbackPreview;
