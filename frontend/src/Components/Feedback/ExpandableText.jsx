import React, { useState } from "react";

const ExpandableText = ({ text = "", limit = 200 }) => {
  const [expanded, setExpanded] = useState(false);

  if (!text) return null;

  const isLong = text.length > limit;
  const displayText = expanded || !isLong ? text : text.slice(0, limit) + "...";

  return (
    <div className="text-gray-700 leading-relaxed break-words max-w-md whitespace-pre-wrap">
      {displayText}
      {isLong && (
        <button
          onClick={() => setExpanded((prev) => !prev)}
          className="ml-1 text-sm text-blue-600 hover:underline focus:outline-none"
        >
          {expanded ? "View Less" : "View More"}
        </button>
      )}
    </div>
  );
};

export default ExpandableText;
