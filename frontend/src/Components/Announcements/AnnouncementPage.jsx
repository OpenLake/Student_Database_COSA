import { useState, useEffect } from "react";
import LoadingScreen from "../common/LoadingScreen";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";

function AnnouncementPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [announcements, setAnnouncements] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await api.get(`/api/announcements`);
        if (res.status === 200) setAnnouncements(res.data.announcements || []);
        else setError("Failed to load announcements.");
      } catch (err) {
        console.error("Error fetching announcements:", err);
        setError("Failed to load announcements.");
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  if (loading) return <LoadingScreen />;
  if (error)
    return (
      <div className="min-h-screen w-full bg-[#FDFAE2] flex items-center justify-center p-6 font-sans">
        <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow border border-stone-200 text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen w-full bg-[#FDFAE2] flex items-start justify-center p-6 font-sans">
      <div className="w-full max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-stone-800">Announcements</h1>
            <p className="text-stone-500 text-sm">
              Latest announcements for your community
            </p>
          </div>

          <button
            onClick={() => navigate("/announcements/create-announcement")}
            className="bg-stone-800 text-white py-2 px-4 rounded-lg hover:bg-stone-700 text-sm font-semibold transition-colors"
          >
            + Create Announcement
          </button>
        </div>

        <div className="p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow border border-stone-200">
          {announcements.length === 0 ? (
            <div className="text-center py-12 text-stone-500">
              No announcements available.
            </div>
          ) : (
            <ul className="space-y-4">
              {announcements.map((announcement) => {
                const isPinned = Boolean(announcement.is_pinned);
                return (
                  <li
                    key={announcement._id}
                    className="p-4 bg-white rounded-lg shadow-sm border border-stone-200"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-3">
                          <h2 className="text-lg font-semibold text-stone-800">
                            {announcement.title}
                          </h2>
                          {isPinned && (
                            <span className="flex items-center gap-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="w-3 h-3"
                              >
                                <path d="M12 2l2.09 6.26L20 9.27l-5 3.64L16.18 20 12 16.9 7.82 20 9 12.91 4 9.27l5.91-.99L12 2z" />
                              </svg>
                              <span>Pinned</span>
                            </span>
                          )}
                          <span className="text-xs bg-stone-100 text-stone-700 px-2 py-0.5 rounded-full">
                            {announcement.type}
                          </span>
                        </div>
                        <p className="mt-2 text-stone-700 whitespace-pre-line">
                          {announcement.content}
                        </p>
                      </div>

                      <div className="text-right text-sm text-stone-500">
                        <div>
                          Author: {announcement?.author?.username || "-"}
                        </div>
                        <div className="mt-2">
                          {new Date(announcement.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default AnnouncementPage;
