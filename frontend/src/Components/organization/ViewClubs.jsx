import React, { useState, useEffect, useContext } from "react";
import api from "../../utils/api";
import { AdminContext } from "../../context/AdminContext";
import OrgList from "./OrgList";
import OrgView from "./OrgView";
const ViewClubs = () => {
  const { isUserLoggedIn } = useContext(AdminContext);
  const userRole = isUserLoggedIn?.role || "STUDENT";
  const [orgs, setOrgs] = useState(null);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [currId, setCurrId] = useState(null);
  const [searchTerm, setSearchTerm] = useState(null);
  const getRoleCategory = (role) => {
    switch (role) {
      case "GENSEC_SCITECH":
        return "scitech";
      case "GENSEC_ACADEMIC":
        return "academic";
      case "GENSEC_CULTURAL":
        return "cultural";
      case "GENSEC_SPORTS":
        return "sports";
      default:
        return "";
    }
  };
  const getId = (role) => {
    switch (role) {
      case "GENSEC_SCITECH":
        return "COUNCIL_SCITECH";
      case "GENSEC_ACADEMIC":
        return "COUNCIL_ACADEMIC";
      case "GENSEC_CULTURAL":
        return "COUNCIL_CULTURAL";
      case "GENSEC_SPORTS":
        return "COUNCIL_SPORTS";
      case "PRESIDENT":
        return "PRESIDENT_GYMKHANA";
      default:
        return "";
    }
  };
  const handleSearch = () => {
    if (searchTerm === null || !searchTerm.trim() || !orgs) {
      alert("Enter an organization name");
      return;
    }
    const match = orgs.find(
      (unit) => unit.name.toLowerCase() === searchTerm.trim().toLowerCase(),
    );
    if (match) {
      setSelectedOrg(match);
      setSearchTerm(""); // optional — clear search after opening
    } else {
      alert("No organization found with that name");
    }
  };

  useEffect(() => {
    const fetchUnits = async () => {
      let url = `/api/orgUnit/organizational-units`;
      const category = getRoleCategory(userRole);
      if (userRole !== "PRESIDENT" && category) {
        url += `?category=${category}`;
      }
      try {
        const { data } = await api.get(url);
        setOrgs(data);
      } catch (error) {
        console.error("Error fetching organizational units:", error);
      }
    };
    fetchUnits();
  }, [userRole]);
  useEffect(() => {
    if (orgs) {
      for (const unit of orgs) {
        if (unit.unit_id === getId(userRole)) {
          setCurrId(unit._id);
          break;
        }
      }
    }
  }, [orgs, userRole]);
  if (selectedOrg) {
    return (
      <div className="min-h-screen p-8 rounded-3xl">
        <OrgView
          orgUnit={selectedOrg}
          units={orgs}
          onBack={() => setSelectedOrg(null)}
          showDetails={true} // Show details from second layer onwards
        />
      </div>
    );
  }
  return (
    <div className="min-h-screen pt-2 pr-8 pl-8 pb-8 rounded-3xl">
      <h2 className="font-semibold mb-6 text-gray-800">
        Organizations under {userRole.replace(/_/g, " ")}
      </h2>
      <div className="flex items-center gap-2 mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
          placeholder="Search organization..."
          className="w-64 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3faf84]"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
        >
          Search
        </button>
      </div>

      <OrgList
        units={orgs}
        parent_unit_id={currId}
        selectedOrg={setSelectedOrg}
      />
    </div>
  );
};

export default ViewClubs;
