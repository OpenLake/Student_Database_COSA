import { Search, OctagonAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { useRequest } from "../../context/RequestContext";
import { useAdminContext } from "../../context/AdminContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Card from "./Card";
export default function Requests() {
  const { pending, approved, rejected, total, setPending } = useRequest();

  const { isUserLoggedIn } = useAdminContext();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        if (!isUserLoggedIn || Object.keys(isUserLoggedIn).length === 0) {
          navigate("/");
          return;
        }
        setLoading(true);
        //api req to fetch data
        const mockRequests = [
          {
            id: 1,
            organization: "ABC University",
            event: "Tech Fest 2026",
            priority: "High",
            count: 124,
            submitted: "2026-02-12",
            requestedBy: "John Matthews",
          },
          {
            id: 2,
            organization: "Global Institute of Science",
            event: "AI & Robotics Workshop",
            priority: "Medium",
            count: 58,
            submitted: "2026-02-15",
            requestedBy: "Priya Sharma",
          },
        ];
        setPending(mockRequests.length);
        setRequests(mockRequests);
      } catch (err) {
        toast.error(err.message || "Requests could not be fetched");
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [isUserLoggedIn]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-600 text-lg">Loading Requests...</div>
      </div>
    );
  }

  function statusColor(status) {
    switch (status) {
      case "Pending":
        return "bg-yellow-200 text-yellow-800";
      case "Approved":
        return "bg-green-200 text-green-700";
      case "Rejected":
        return "bg-red-200 text-red-700";
    }
  }

  const filteredRequests = requests.filter((req) => {
    const searchMatch =
      !search ||
      req.event.toLowerCase().includes(search.toLowerCase()) ||
      req.organization.toLowerCase().includes(search.toLowerCase()) ||
      req.requestedBy.toLowerCase().includes(search.toLowerCase());

    return searchMatch;
  });

  return (
    <div className="px-6 pt-6 pb-6 ">
      {/* Top Section */}
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        {/* Status Indicators */}
        <div className="flex items-center gap-6 flex-wrap">
          {/* Pending Status */}
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-yellow-300"></div>
            <span className="text-gray-700 font-medium">
              Pending: {pending}
            </span>
          </div>

          {/* Approved Status */}
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-400"></div>
            <span className="text-gray-700 font-medium">
              Approved: {approved}
            </span>
          </div>

          {/* Rejected Status */}
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-400"></div>
            <span className="text-gray-700 font-medium">
              Rejected: {rejected}
            </span>
          </div>

          {/* Total Status */}
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span className="text-gray-700 font-medium">
              Certificates Generated: {total}
            </span>
          </div>
        </div>

        {/* Filter Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by requester, event or organization"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black focus:border-transparent"
          />
        </div>
      </div>

      {/* Request Cards */}
      <div className="space-y-4">
        {filteredRequests.length !== 0 ? (
          filteredRequests.map((req) => (
            <Card req={req} statusColor={statusColor} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <OctagonAlert size={48} className="mb-4 opacity-50" />
            <p className="text-lg">
              {search
                ? `No requests found matching ${search}`
                : `No requests found.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
