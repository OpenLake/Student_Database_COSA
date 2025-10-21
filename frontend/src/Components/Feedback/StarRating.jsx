import { useState } from "react";

export const StarRating = ({ rating, onRatingChange }) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <>
      <div className="flex items-center space-x-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="text-3xl transition-all"
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => onRatingChange(star)}
          >
            <span
              className={`text-3xl ${
                star <= (hoverRating || rating) ? "text-black" : "text-gray-300"
              }`}
            >
              ★
            </span>
          </button>
        ))}
      </div>
      <span className="text-xs text-gray-600">
        {rating ? `${rating} out of 5` : "No rating selected"}
      </span>
    </>
  );
};
