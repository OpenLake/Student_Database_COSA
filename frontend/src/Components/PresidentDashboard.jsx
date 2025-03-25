import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AdminContext } from "../App";
const API_BASE_URL =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

const PresidentDashboard = () => {
  //   const { IsUserLoggedIn } = useContext(AdminContext);
  //   if (!IsUserLoggedIn || IsUserLoggedIn.role !== "president") {
  //     return <p className="text-center text-red-500">Unauthorized Access</p>;
  //   }

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
              {isLoading ? (
                <span className="text-gray-400">Loading...</span>
              ) : (
                pendingRequests
              )}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500">
            <p className="text-gray-500 text-sm">Room Bookings</p>
            <p className="text-2xl font-bold text-gray-800">
              {isLoading ? (
                <span className="text-gray-400">Loading...</span>
              ) : (
                roomBookings
              )}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-yellow-500">
            <p className="text-gray-500 text-sm">Upcoming Events</p>
            <p className="text-2xl font-bold text-gray-800">
              {isLoading ? (
                <span className="text-gray-400">Loading...</span>
              ) : (
                upcomingEvents
              )}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-purple-500">
            <p className="text-gray-500 text-sm">COSA Records</p>
            <p className="text-2xl font-bold text-gray-800">
              {isLoading ? (
                <span className="text-gray-400">Loading...</span>
              ) : (
                cosaRecords
              )}
            </p>
          </div>
        </div>

        {/* Main Menu Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {/* Approve Requests */}
          <Link
            to="/president-approval"
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 rounded-xl shadow-md overflow-hidden"
          >
            <div className="p-5">
              <div className="flex items-center mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="ml-2 text-xl font-semibold text-white">
                  Approve Requests
                </h3>
              </div>
              <p className="text-white text-opacity-90 text-sm">
                Review and approve pending requests
              </p>
            </div>
            <div className="bg-blue-700 bg-opacity-30 p-3 text-center">
              <span className="text-white text-sm font-medium">Access</span>
            </div>
          </Link>

          {/* Room Booking */}
          <Link
            to="/roombooking"
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 rounded-xl shadow-md overflow-hidden"
          >
            <div className="p-5">
              <div className="flex items-center mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                <h3 className="ml-2 text-xl font-semibold text-white">
                  Room Booking
                </h3>
              </div>
              <p className="text-white text-opacity-90 text-sm">
                Manage facility reservations
              </p>
            </div>
            <div className="bg-green-700 bg-opacity-30 p-3 text-center">
              <span className="text-white text-sm font-medium">Access</span>
            </div>
          </Link>

          {/* Give Feedback */}
          <Link
            to="/viewfeedback"
            className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 transform hover:scale-105 rounded-xl shadow-md overflow-hidden"
          >
            <div className="p-5">
              <div className="flex items-center mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
                <h3 className="ml-2 text-xl font-semibold text-white">
                  {" "}
                  Feedback
                </h3>
              </div>
              <p className="text-white text-opacity-90 text-sm">
                View feedback about college issues
              </p>
            </div>
            <div className="bg-yellow-700 bg-opacity-30 p-3 text-center">
              <span className="text-white text-sm font-medium">Access</span>
            </div>
          </Link>

          {/* View Events */}
          <Link
            to="/events"
            className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 rounded-xl shadow-md overflow-hidden"
          >
            <div className="p-5">
              <div className="flex items-center mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <h3 className="ml-2 text-xl font-semibold text-white">
                  View Events
                </h3>
              </div>
              <p className="text-white text-opacity-90 text-sm">
                See all upcoming and past events
              </p>
            </div>
            <div className="bg-purple-700 bg-opacity-30 p-3 text-center">
              <span className="text-white text-sm font-medium">Access</span>
            </div>
          </Link>

          {/* Create Event */}
          <Link
            to="/add-event"
            className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 rounded-xl shadow-md overflow-hidden"
          >
            <div className="p-5">
              <div className="flex items-center mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <h3 className="ml-2 text-xl font-semibold text-white">
                  Create Event
                </h3>
              </div>
              <p className="text-white text-opacity-90 text-sm">
                Schedule new college events
              </p>
            </div>
            <div className="bg-pink-700 bg-opacity-30 p-3 text-center">
              <span className="text-white text-sm font-medium">Access</span>
            </div>
          </Link>

          {/* Create Tenure */}
          <Link
            to="/cosa/create"
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 rounded-xl shadow-md overflow-hidden"
          >
            <div className="p-5">
              <div className="flex items-center mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                <h3 className="ml-2 text-xl font-semibold text-white">
                  Create Tenure
                </h3>
              </div>
              <p className="text-white text-opacity-90 text-sm">
                Add new COSA tenure records
              </p>
            </div>
            <div className="bg-red-700 bg-opacity-30 p-3 text-center">
              <span className="text-white text-sm font-medium">Access</span>
            </div>
          </Link>

          {/* View COSA Records */}
          <Link
            to="/cosa"
            className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 rounded-xl shadow-md overflow-hidden col-span-1 md:col-span-3"
          >
            <div className="p-5">
              <div className="flex items-center mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <h3 className="ml-2 text-xl font-semibold text-white">
                  View COSA Records
                </h3>
              </div>
              <p className="text-white text-opacity-90 text-sm">
                Access complete COSA documentation and tenure history
              </p>
            </div>
            <div className="bg-indigo-700 bg-opacity-30 p-3 text-center">
              <span className="text-white text-sm font-medium">Access</span>
            </div>
          </Link>
        </div>

        {/* Recent Activity Section */}
        <div className="mt-6 bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gray-50 p-4 border-b">
            <h2 className="text-xl font-bold text-gray-800">Recent Activity</h2>
          </div>
          <div className="p-4">
            {isLoading ? (
              <p className="text-center text-gray-500 py-4">
                Loading activities...
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
