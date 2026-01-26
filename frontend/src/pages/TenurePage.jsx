import React, { useEffect, useState } from "react";
import Layout from "../Components/common/Layout";
import api from "../utils/api";
import { Search, Briefcase } from "lucide-react";

const TenurePage = () => {
  const [tenureData, setTenureData] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTenureData = async () => {
      try {
        console.log("TenurePage: Fetching tenure data...");
        const response = await api.get("/api/por/current");
        console.log("TenurePage: API Response:", response);

        if (response.data) {
          setTenureData(response.data);
        } else {
          // Handle case where data might be null/undefined but call succeeded
          setTenureData({});
        }
        setLoading(false);
      } catch (err) {
        console.error("TenurePage: Error fetching tenure data:", err);
        const msg =
          err.response?.data?.message ||
          err.message ||
          "Failed to load tenure data.";
        setError(
          `${msg}. Please ensure the backend server is running on the correct port.`,
        );
        setLoading(false);
      }
    };

    fetchTenureData();
  }, []);

  // Safety check for tenureData
  const safeData = tenureData || {};

  const filteredData = Object.entries(safeData).reduce(
    (acc, [orgName, data]) => {
      if (!data || !data.members) return acc;

      const term = searchTerm.toLowerCase();

      // Filter logic: Check if Org Name or any Member Name/Position matches search
      const matchesOrg = orgName.toLowerCase().includes(term);

      // Filter members safely
      const matchedMembers = data.members.filter((member) => {
        const name = member.user?.personal_info?.name?.toLowerCase() || "";
        const title = member.position_title?.toLowerCase() || "";
        return name.includes(term) || title.includes(term);
      });

      if (matchesOrg || matchedMembers.length > 0) {
        acc[orgName] = {
          ...data,
          // Show all members if org matches, else only matched members
          members: matchesOrg ? data.members : matchedMembers,
        };
      }
      return acc;
    },
    {},
  );

  return (
    <Layout headerText="Current Tenure">
      <div className="space-y-8 pb-10">
        {/* Search Bar */}
        <div className="relative max-w-md mx-auto md:mx-0">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-black focus:border-black sm:text-sm transition duration-150 ease-in-out shadow-sm"
            placeholder="Search for people or organizations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
            <span className="ml-3 text-gray-400">Loading...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center p-8 bg-red-50 rounded-xl border border-red-100">
            <div className="text-red-500 font-medium text-lg mb-2">
              Error Loading Data
            </div>
            <div className="text-red-400 text-sm text-center max-w-md">
              {error}
            </div>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : Object.keys(filteredData).length === 0 ? (
          <div className="text-center text-gray-500 mt-10 p-8 bg-gray-50 rounded-xl">
            No results found for "{searchTerm}".
          </div>
        ) : (
          Object.entries(filteredData).map(([orgName, data]) => (
            <div
              key={orgName}
              className="bg-white/80 rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Briefcase className="w-6 h-6 text-yellow-800" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{orgName}</h2>
                  {data.unit_info && (
                    <p className="text-sm text-gray-500 uppercase tracking-wide font-medium">
                      {data.unit_info.type}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {data.members && data.members.length > 0 ? (
                  data.members.map((member) => (
                    <div
                      key={member.holder_id || Math.random()}
                      className="flex flex-col items-center p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="relative w-24 h-24 mb-3">
                        <img
                          src={
                            member.user?.personal_info?.profilePic ||
                            "https://www.gravatar.com/avatar/?d=mp"
                          }
                          alt={member.user?.personal_info?.name || "User"}
                          className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-sm"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://www.gravatar.com/avatar/?d=mp";
                          }}
                        />
                        <div className="absolute bottom-0 right-0 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></div>
                      </div>

                      <h3
                        className="text-lg font-semibold text-gray-900 text-center line-clamp-1 w-full"
                        title={member.user?.personal_info?.name}
                      >
                        {member.user?.personal_info?.name || "Unknown User"}
                      </h3>
                      <p
                        className="text-sm text-gray-600 text-center font-medium mt-1 px-2 py-1 bg-gray-50 rounded-full w-full truncate"
                        title={member.position_title}
                      >
                        {member.position_title || "Position Holder"}
                      </p>
                      {member.user?.personal_info?.email && (
                        <p className="text-xs text-gray-400 mt-2 truncate w-full text-center">
                          {member.user.personal_info.email}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 col-span-full text-center py-4">
                    No members found in this group.
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </Layout>
  );
};

export default TenurePage;
