import { Search, OctagonAlert, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { useRequest } from "../../context/RequestContext";
import { useAdminContext } from "../../context/AdminContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import RequestsTable from "./Card";
import {ViewModal} from "./viewModal";
import {EditModal} from "./editModal";


export default function Requests() {
  const { requestStatus, setRequestStatus } = useRequest();

  const { isUserLoggedIn } = useAdminContext();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [viewing, setViewing] = useState(null);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");

  const stats = [
    { dot: "bg-yellow-400", label: "Pending", value: requestStatus.pending },
    { dot: "bg-emerald-500", label: "Approved", value: requestStatus.approved },
    { dot: "bg-red-500", label: "Rejected", value: requestStatus.rejected },
  ];

  // keep request stats in sync with current requests
  useEffect(() => {
    if (!requests || requests.length === 0) {
      setRequestStatus({ pending: 0, approved: 0, rejected: 0, total: 0 });
      return;
    }

    let pending = 0;
    let approved = 0;
    let rejected = 0;
    let total = 0;

    requests.forEach((req) => {
      if (req.status === "Approved"){
        approved++;
        total = approved*req.students;
      }
      else if (req.status === "Rejected") rejected++;
      else pending++;
    });

    setRequestStatus({
      pending,
      approved,
      rejected,
      total
    });
  }, [requests, setRequestStatus]);

  const approve = (id) => setRequests(requests.map((req) => req.id === id? {...req, status: "Approved"} : req));
  const reject = (id) => setRequests(requests.map((req) => req.id === id? {...req, status: "Rejected"} : req));

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
            students: 124,
            date: "2026-02-12",
            requestedBy: "John Matthews",
            status: "Pending",
          },
          {
            id: 2,
            organization: "Global Institute of Science",
            event: "AI & Robotics Workshop",
            priority: "Medium",
            students: 58,
            date: "2026-02-15",
            requestedBy: "Priya Sharma",
            status: "Pending",
          },
          
        ];
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

  function handleUpdateRequest(updatedRequest) {
    setRequests((prev) =>
      prev.map((req) => (req.id === updatedRequest.id ? updatedRequest : req))
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-600 text-lg">Loading Requests...</div>
      </div>
    );
  }

  const filteredRequests = requests.filter((req) => {
    if (!search || !search.trim()) return true;

    const event = req.event.toLowerCase();
    const organization = req.organization.toLowerCase();
    const requestedBy = req.requestedBy.toLowerCase();

    const searchWords = search.toLowerCase().split(" ").filter(Boolean);

    return searchWords.every((word) =>
      event.includes(word) ||
      organization.includes(word) ||
      requestedBy.includes(word)
    );
  });

  return (

    <div className="min-h-screen bg-[#FEFCE8] px-6 pt-4 pb-6 font-sans">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap'); * { font-family: 'DM Sans', sans-serif; }`}</style>
    
      {/* stats + search bar */}
      <div className="flex items-center justify-between gap-10 mb-2">
          {/* Stats Box */}
          <div className="bg-white rounded-2xl shadow-md px-4 py-2.5 flex items-center gap-6">
            {stats.map(({ dot, label, value }) => (
              <div key={label} className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${dot}`} />
                <span className="text-sm font-semibold text-gray-700">
                  {label}: <span className="font-bold text-gray-900">{value}</span>
                </span>
              </div>
            ))}

            <div className="flex items-center gap-1 border-gray-100">
              <FileText size={14} className="text-gray-400" />
              <span className="text-sm font-semibold text-gray-700">
                Certificates Generated: <span className="font-bold text-gray-900">{requestStatus.total}</span>
              </span>
            </div>
          </div>

          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by event, organization or requester"
              className="pl-9 pr-4 py-2 w-full text-sm rounded-xl border border-gray-200 bg-gray-50 text-gray-700 placeholder:text-gray-400 outline-none"
            />
          </div>
      </div>
    
      {/* Request Table */}
      {filteredRequests.length === 0 
      ? ( <div className="text-center py-16 text-gray-400 text-sm font-medium">No requests match your search.</div> ) 
      : 
        <RequestsTable
          requests={filteredRequests}
          onView={setViewing}
          onEdit={setEditing}
          onApprove={approve}
          onReject={reject}
        />
      }

      {viewing && <ViewModal request={viewing} onClose={() => setViewing(null)} />}
      {editing && (
        <EditModal
          request={editing}
          onClose={() => setEditing(null)}
          onSave={handleUpdateRequest}
        />
      )}
      
    
    </div>
  );
}
