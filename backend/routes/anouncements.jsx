import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AnnouncementCard from '../components/AnnouncementCard';
import CreateAnnouncementModal from '../components/CreateAnnouncementModal';

const AnnouncementPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await axios.get('/api/announcements');
      setAnnouncements(res.data.reverse()); // reverse chronological
    } catch (err) {
      console.error('Error fetching announcements:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">📢 Announcements</h1>
        {/* Show button only if admin */}
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => setShowModal(true)}
        >
          + New Announcement
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-4">
          {announcements.map((a) => (
            <AnnouncementCard key={a._id} announcement={a} />
          ))}
        </div>
      )}

      {showModal && (
        <CreateAnnouncementModal
          onClose={() => setShowModal(false)}
          onCreated={fetchAnnouncements}
        />
      )}
    </div>
  );
};

export default AnnouncementPage;
