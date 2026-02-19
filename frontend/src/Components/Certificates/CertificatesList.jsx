import React, { useState, useEffect } from "react";
import { Download, Eye, Calendar, User, Award, Search } from "lucide-react";
import api from "../../utils/api";
import { useAdminContext } from "../../context/AdminContext";

const CertificatesList = () => {
  const { isUserLoggedIn } = useAdminContext();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [certificateFilter, setCertificateFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchCertificates() {
      try {
        setLoading(true);
        // TODO: Replace with actual API endpoint when available
        // const response = await api.get(`/api/certificates/${isUserLoggedIn._id}`);
        // setCertificates(response.data);

        // Mock data for now - remove when API is ready
        const mockCertificates = [
          {
            _id: "1",
            event: "Tech Fest 2024",
            issuedBy: "Computer Science Club",
            date: "2024-01-15",
            status: "Approved",
            certificateUrl: "#",
            rejectionReason: undefined,
          },
          {
            _id: "2",
            event: "Hackathon 2024",
            issuedBy: "Coding Club",
            date: "2024-02-20",
            status: "Pending",
            certificateUrl: "#",
            rejectionReason: undefined,
          },
          {
            _id: "3",
            event: "Workshop Series",
            issuedBy: "Technical Society",
            date: "2024-03-10",
            status: "Rejected",
            certificateUrl: "#",
            rejectionReason: "Incomplete participation",
          },
        ];
        setCertificates(mockCertificates);
      } catch (err) {
        console.error("Error fetching certificates:", err);
        setError("Failed to fetch certificates");
      } finally {
        setLoading(false);
      }
    }

    if (isUserLoggedIn && Object.keys(isUserLoggedIn).length > 0) {
      fetchCertificates();
    }
  }, [isUserLoggedIn]);

  const filteredCertificates = certificates.filter((cert) => {
    // Filter by status
    const matchesStatus =
      certificateFilter === "ALL" || cert.status === certificateFilter;

    // Filter by search term (searches in event name and issuedBy)
    const matchesSearch =
      !searchTerm ||
      cert.event?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.issuedBy?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800 border-green-300";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "Rejected":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const filterButtons = [
    { label: "ALL", value: "ALL" },
    { label: "Pending", value: "Pending" },
    { label: "Approved", value: "Approved" },
    { label: "Rejected", value: "Rejected" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-600 text-lg">Loading certificates...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-600 text-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-6 bg-gray-50">
      {/* Filter Buttons */}
      <div className="flex gap-3 mb-6  flex-shrink-0">
        {filterButtons.map((btn) => (
          <button
            key={btn.value}
            onClick={() => setCertificateFilter(btn.value)}
            className={`px-4 h-[40px] rounded-xl font-semibold transition-all duration-200 ${
              certificateFilter === btn.value
                ? "bg-black text-white shadow-md"
                : "bg-white text-black border-2 border-black hover:bg-gray-50"
            }`}
          >
            {btn.label}
          </button>
        ))}

        {/**search bar */}
        <div className="relative flex-1 ">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search by event or issued by..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-1.5 rounded-xl border-2 border-black bg-white text-black placeholder-gray-400 "
          />
        </div>
      </div>

      {/* Certificates Grid */}
      <div className="flex-1 overflow-auto">
        {filteredCertificates.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <Award size={48} className="mb-4 opacity-50" />
            <p className="text-lg">
              {searchTerm
                ? `No certificates found matching ${searchTerm}`
                : `No ${certificateFilter === "ALL" ? "" : certificateFilter.toLowerCase()} certificates found.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCertificates.map((certificate) => (
              <div
                key={certificate._id}
                className="bg-white rounded-2xl shadow-sm border-2 border-black p-3 flex flex-col hover:shadow-md transition-shadow"
              >
                {/* Certificate Header */}
                <div className="flex items-start justify-between mb-4">
                  <Award className="text-yellow-500" size={32} />
                  <span
                    className={`px-3 py-1 rounded-lg text-sm font-semibold border ${getStatusColor(
                      certificate.status,
                    )}`}
                  >
                    {certificate.status}
                  </span>
                </div>

                {/* Certificate Details */}
                <div className="flex-1 space-y-3 mb-4">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Event</div>
                    <div className="text-base font-semibold text-gray-900">
                      {certificate.event || "N/A"}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                      <User size={12} />
                      Issued By
                    </div>
                    <div className="text-sm text-gray-700">
                      {certificate.issuedBy || "N/A"}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                      <Calendar size={12} />
                      Date
                    </div>
                    <div className="text-sm text-gray-700">
                      {formatDate(certificate.date)}
                    </div>
                  </div>

                  {certificate.rejectionReason && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-2">
                      <div className="text-sm text-red-600 font-semibold mb-1">
                        Rejection Reason
                      </div>
                      <div className="text-xs text-red-700">
                        {certificate.rejectionReason}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-auto">
                  {certificate.status === "Approved" && (
                    <>
                      <button
                        onClick={() => {
                          if (certificate.certificateUrl) {
                            window.open(certificate.certificateUrl, "_blank");
                          }
                        }}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium text-sm"
                      >
                        <Eye size={16} />
                        View
                      </button>
                      <button
                        onClick={() => {
                          if (certificate.certificateUrl) {
                            const link = document.createElement("a");
                            link.href = certificate.certificateUrl;
                            link.download = `${certificate.event}_certificate.pdf`;
                            link.click();
                          }
                        }}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white text-black border-2 border-black rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
                      >
                        <Download size={16} />
                        Download
                      </button>
                    </>
                  )}
                  {certificate.status === "Pending" && (
                    <button
                      disabled
                      //className="w-full px-4 py-2 bg-gray-100 text-gray-500 rounded-2xl cursor-not-allowed font-medium text-sm"
                      className={`w-full px-4 py-2 rounded-lg font-medium text-sm cursor-not-allowed ${getStatusColor(certificate.status)}`}
                    >
                      Pending Approval
                    </button>
                  )}
                  {certificate.status === "Rejected" && (
                    <button
                      disabled
                      className={`w-full px-4 py-2 rounded-lg font-medium text-sm cursor-not-allowed ${getStatusColor(certificate.status)}`}
                    >
                      Certificate Rejected
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificatesList;
