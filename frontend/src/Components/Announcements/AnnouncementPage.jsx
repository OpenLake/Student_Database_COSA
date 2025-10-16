import { useState, useEffect } from "react";
import LoadingScreen from "../common/LoadingScreen";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AnnouncementPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [announcements, setAnnouncements] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/announcements`,
        );
        console.log("Fetched announcements:", response.data);
        if (response.status === 200) {
          setAnnouncements(response.data.announcements);
          setLoading(false);
        } else {
          setError("Failed to load announcements.");
          setLoading(false);
        }
      } catch (err) {
        console.error("Error fetching announcements:", err);
        setError("Failed to load announcements.");
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      {/* Create Announcement */}
      <div>
        <button
          onClick={() => {
            navigate("/announcements/create-announcement");
          }}
        >
          {" "}
          + Create Announcement
        </button>
      </div>

      {/* All Announcements */}
      <div>
        <h1>Announcements</h1>
        {announcements.length === 0 ? (
          <p>No announcements available.</p>
        ) : (
          <ul>
            {announcements.map((announcement) => (
              <li key={announcement._id}>
                <h2>{announcement.title}</h2>
                <p>{announcement.content}</p>
                <p>
                  <em>
                    Posted on:{" "}
                    {`${new Date(announcement.createdAt).toLocaleString()}`}
                  </em>
                </p>
                <p>Author: {`${announcement?.author?.username}`}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
export default AnnouncementPage;
