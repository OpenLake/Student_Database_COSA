import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { navItems } from "../../config/presidentConfig.js";
import LoadingSpinner from "../common/LoadingScreen.js";
const API_BASE_URL =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

const PresidentDashboard = () => {
  // States for various dashboard metrics
  const [pendingRequests, setPendingRequests] = useState(0);
  const [roomBookings, setRoomBookings] = useState(0);
  const [upcomingEvents, setUpcomingEvents] = useState(0);
  const [cosaRecords, setCosaRecords] = useState(0);
  const [recentActivities, setRecentActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch actual data for dashboard
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);

        // Implement actual API calls for each metric
        // Example:
        const requestsResponse = await fetch(
          `${API_BASE_URL}/room/requests?status=pending`,
        );
        const requestsData = await requestsResponse.json();
        setPendingRequests(requestsData.length);

        const bookingsResponse = await fetch(`${API_BASE_URL}/room/requests`);
        const bookingsData = await bookingsResponse.json();
        setRoomBookings(bookingsData.length);

        const eventsResponse = await fetch(`${API_BASE_URL}/events`);
        const eventsData = await eventsResponse.json();
        setUpcomingEvents(eventsData.length);

        const cosaResponse = await fetch(`${API_BASE_URL}/tenure`);
        const cosaData = await cosaResponse.json();
        setCosaRecords(cosaData.length);

        const activitiesResponse = await fetch("/api/activities/recent");
        const activitiesData = await activitiesResponse.json();
        setRecentActivities(activitiesData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        // Implement error handling here
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-lg mb-6 overflow-hidden">
          <div className="bg-blue-600 p-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                President Dashboard
              </h1>
              <div className="bg-white text-blue-700 py-1 px-4 rounded-full text-sm font-semibold">
                Presidential Access
              </div>
            </div>
          </div>
          <div className="p-4 md:p-6">
            <p className="text-gray-600">
              Welcome to your executive control panel. Manage approvals, events,
              room bookings, and more from this central hub.
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500">
            <p className="text-gray-500 text-sm">Pending Approvals</p>
            <p className="text-2xl font-bold text-gray-800">
              {!isLoading ? (
                <span className="text-gray-400"><LoadingSpinner fullscreen={false} size="sm"/></span>
              ) : (
                pendingRequests
              )}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500">
            <p className="text-gray-500 text-sm">Room Bookings</p>
            <p className="text-2xl font-bold text-gray-800">
              {isLoading ? (
                <span className="text-gray-400"><LoadingSpinner fullscreen={false} size="sm"/></span>
              ) : (
                roomBookings
              )}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-yellow-500">
            <p className="text-gray-500 text-sm">Upcoming Events</p>
            <p className="text-2xl font-bold text-gray-800">
              {isLoading ? (
                <span className="text-gray-400"><LoadingSpinner fullscreen={false} size="sm"/></span>
              ) : (
                upcomingEvents
              )}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-purple-500">
            <p className="text-gray-500 text-sm">COSA Records</p>
            <p className="text-2xl font-bold text-gray-800">
              {isLoading ? (
                <span className="text-gray-400"><LoadingSpinner fullscreen={false} size="sm"/></span>
              ) : (
                cosaRecords
              )}
            </p>
          </div>
        </div>

        {/* Main Menu Cards */}
        <div className="grid grid-cols-3 md:grid-cols-3 gap-4 md:gap-6">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`bg-gradient-to-r ${item.gradientClasses} 
              transition-all duration-300 transform hover:scale-105 
              rounded-xl shadow-md overflow-hidden ${item.extraClasses || ""}`}
            >
              <div className="p-5">
                <div className="flex items-center mb-3">
                  {item.icon}
                  <h3 className="ml-2 text-xl font-semibold text-white">
                    {item.title}
                  </h3>
                </div>
                <p className="text-white text-opacity-90 text-sm">
                  {item.description}
                </p>
              </div>
              <div
                className={`bg-opacity-30 p-3 text-center ${item.accentBgClass}`}
              >
                <span className="text-white text-sm font-medium">Access</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Recent Activity Section */}
        <div className="mt-6 bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gray-50 p-4 border-b">
            <h2 className="text-xl font-bold text-gray-800">Recent Activity</h2>
          </div>
          <div className="p-4">
            {isLoading ? (
              <p className="text-center text-gray-500 py-4">
               <LoadingSpinner fullscreen={false} size="sm"/>
              </p>
            ) : recentActivities.length === 0 ? (
              <p className="text-center text-gray-500 py-4">
                No recent activities found
              </p>
            ) : (
              <div className="divide-y divide-gray-100">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="py-3 flex items-center">
                    <div
                      className={`bg-${activity.type}-100 p-2 rounded-full mr-3`}
                    >
                      {/* Render different icons based on activity type */}
                      {activity.type === "approval" && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className={`h-5 w-5 text-${activity.type}-600`}
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                      {activity.type === "event" && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className={`h-5 w-5 text-${activity.type}-600`}
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                      {activity.type === "cosa" && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className={`h-5 w-5 text-${activity.type}-600`}
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                          <path
                            fillRule="evenodd"
                            d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {activity.description}
                      </p>
                      <p className="text-xs text-gray-500">
                        {activity.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PresidentDashboard;
