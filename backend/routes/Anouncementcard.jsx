import React from 'react';

const AnnouncementCard = ({ announcement }) => {
  return (
    <div className="p-4 border rounded-lg shadow bg-white">
      <div className="flex justify-between">
        <h2 className="text-lg font-semibold">{announcement.title}</h2>
        <p className="text-sm text-gray-500">
          {new Date(announcement.created_at).toLocaleDateString()}
        </p>
      </div>
      <p className="text-gray-700 mt-2">{announcement.content}</p>
      <p className="text-sm text-gray-600 mt-2">
        Posted by: {announcement.author?.name || 'Unknown'}
      </p>
      {announcement.type !== 'General' && (
        <p className="text-xs text-gray-500">Type: {announcement.type}</p>
      )}
    </div>
  );
};

export default AnnouncementCard;
